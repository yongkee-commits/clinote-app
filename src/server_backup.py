import json
import csv
import io
import httpx
import os
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.auth import create_session_token, require_auth, require_admin
from src.config import STATIC_DIR, KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI
from src.database import (
    init_db,
    upsert_user, get_user, create_session, delete_session, delete_expired_sessions,
    get_clinic, save_clinic,
    create_review, update_review_reply,
    list_reviews, delete_review, count_reviews,
    delete_all_reviews,
    create_template_record, update_template_output,
    list_templates, delete_template_record, count_templates,
    delete_all_templates, delete_all_user_data,
    get_popup_config, save_popup_config,
    get_subscription, upsert_subscription,
    check_and_use_trial,
    list_users_with_stats, get_global_stats,
)
from src.ai import stream_review_reply, stream_template, generate_template_batch, TEMPLATE_PROMPTS
from src.sms import send_sms_batch
from src.middleware import SecurityHeadersMiddleware, generate_csrf_token
from src.ratelimit import limiter, RATE_LIMITS
from src.validation import validate_phone, validate_url, sanitize_text, validate_rating

app = FastAPI(title="Clinote")

# Rate limiter 연결
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS 설정 (환경변수로 제한)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:8003,http://127.0.0.1:8003").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
)

# 보안 헤더 미들웨어
app.add_middleware(SecurityHeadersMiddleware)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize"
KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_URL = "https://kapi.kakao.com/v2/user/me"


@app.on_event("startup")
async def startup():
    init_db()
    delete_expired_sessions()


# ── Kakao OAuth ───────────────────────────────────────

@app.get("/api/auth/kakao")
@limiter.limit(RATE_LIMITS["auth"])
async def kakao_login(request: Request):
    params = (
        f"client_id={KAKAO_CLIENT_ID}"
        f"&redirect_uri={KAKAO_REDIRECT_URI}"
        f"&response_type=code"
    )
    return RedirectResponse(url=f"{KAKAO_AUTH_URL}?{params}")


@app.get("/api/auth/kakao/callback")
@limiter.limit(RATE_LIMITS["auth"])
async def kakao_callback(request: Request, code: str = "", error: str = ""):
    if error or not code:
        return RedirectResponse(url="/?error=kakao_auth_failed")

    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. 코드 → 액세스 토큰
        token_data: dict = {
            "grant_type": "authorization_code",
            "client_id": KAKAO_CLIENT_ID,
            "redirect_uri": KAKAO_REDIRECT_URI,
            "code": code,
        }
        if KAKAO_CLIENT_SECRET:
            token_data["client_secret"] = KAKAO_CLIENT_SECRET
        token_resp = await client.post(
            KAKAO_TOKEN_URL,
            data=token_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        if token_resp.status_code != 200:
            return RedirectResponse(url="/?error=token_exchange_failed")

        access_token = token_resp.json().get("access_token")
        if not access_token:
            return RedirectResponse(url="/?error=no_access_token")

        # 2. 유저 프로필 조회
        user_resp = await client.get(
            KAKAO_USER_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if user_resp.status_code != 200:
            return RedirectResponse(url="/?error=user_fetch_failed")

        user_data = user_resp.json()

    kakao_id = str(user_data["id"])
    kakao_account = user_data.get("kakao_account", {})
    profile = kakao_account.get("profile", user_data.get("properties", {}))
    nickname = profile.get("nickname", "")
    profile_image = profile.get("profile_image_url", profile.get("profile_image", ""))

    # 3. 유저 upsert + 세션 발급
    upsert_user(kakao_id, nickname, profile_image)
    session_token, expires_at = create_session_token()
    create_session(session_token, kakao_id, expires_at)

    # CSRF 토큰 생성
    generate_csrf_token(kakao_id)

    # 4. 프론트엔드로 토큰 전달
    return RedirectResponse(url=f"/?token={session_token}")


@app.post("/api/auth/logout")
async def kakao_logout(request: Request, user_id: str = Depends(require_auth)):
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        delete_session(auth_header[7:])
    return {"ok": True}


@app.get("/api/me")
async def api_me(user_id: str = Depends(require_auth)):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # CSRF 토큰 생성/조회
    csrf_token = generate_csrf_token(user_id)
    return {**user, "csrf_token": csrf_token}


# ── Clinic settings ───────────────────────────────────

@app.get("/api/clinic")
async def api_get_clinic(user_id: str = Depends(require_auth)):
    return get_clinic(user_id)


class ClinicBody(BaseModel):
    name: str
    specialty: str = "치과"
    doctor_name: str = ""
    tone: str = "formal"
    forbidden_words: list[str] = []
    emphasis: str = ""
    phone: str = ""
    naver_map_url: str = ""
    instagram_url: str = ""
    kakao_channel: str = ""


@app.put("/api/clinic")
async def api_save_clinic(body: ClinicBody, user_id: str = Depends(require_auth)):
    # Input validation
    name = sanitize_text(body.name, max_length=100)
    specialty = sanitize_text(body.specialty, max_length=50)
    doctor_name = sanitize_text(body.doctor_name, max_length=50)
    phone = validate_phone(body.phone) if body.phone else ""
    naver_map_url = validate_url(body.naver_map_url, allow_empty=True)
    instagram_url = validate_url(body.instagram_url, allow_empty=True)

    return save_clinic(
        user_id=user_id,
        name=name,
        specialty=specialty,
        doctor_name=doctor_name,
        tone=body.tone,
        forbidden_words=[sanitize_text(w, max_length=50) for w in body.forbidden_words],
        emphasis=sanitize_text(body.emphasis, max_length=500),
        phone=phone,
        naver_map_url=naver_map_url,
        instagram_url=instagram_url,
        kakao_channel=sanitize_text(body.kakao_channel, max_length=100),
    )


# ── Review reply ──────────────────────────────────────

class ReviewGenerateBody(BaseModel):
    platform: str = "naver"
    rating: int | None = None
    original_text: str


@app.post("/api/review/generate")
@limiter.limit(RATE_LIMITS["ai_generate"])
async def api_generate_review(body: ReviewGenerateBody, request: Request, user_id: str = Depends(require_auth)):
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

    # Input validation
    platform = sanitize_text(body.platform, max_length=20)
    original_text = sanitize_text(body.original_text, max_length=5000)
    if body.rating:
        rating = validate_rating(body.rating)
    else:
        rating = None

    clinic = get_clinic(user_id)
    review_id = create_review(user_id, platform, rating, original_text)
    full_reply = []

    async def event_stream():
        try:
            async for chunk in stream_review_reply(clinic, original_text, rating):
                full_reply.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"

            reply_text = "".join(full_reply)
            update_review_reply(review_id, reply_text)
            yield f"data: {json.dumps({'done': True, 'reply_id': review_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            # 에러 정보 노출 차단 (프로덕션)
            error_msg = "서버 오류가 발생했습니다" if os.getenv("ENV") == "production" else str(e)
            yield f"data: {json.dumps({'error': error_msg}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Review history ────────────────────────────────────

@app.get("/api/reviews")
async def api_list_reviews(limit: int = 20, offset: int = 0, user_id: str = Depends(require_auth)):
    return {
        "items": list_reviews(user_id, limit, offset),
        "total": count_reviews(user_id),
    }


@app.delete("/api/reviews/all")
async def api_delete_all_reviews(user_id: str = Depends(require_auth)):
    delete_all_reviews(user_id)
    return {"ok": True}


@app.delete("/api/reviews/{review_id}")
async def api_delete_review(review_id: int, user_id: str = Depends(require_auth)):
    delete_review(user_id, review_id)
    return {"ok": True}


# ── Template generation ───────────────────────────────

class TemplateBody(BaseModel):
    template_type: str
    params: dict = {}


@app.post("/api/template/generate")
@limiter.limit(RATE_LIMITS["ai_generate"])
async def api_generate_template(body: TemplateBody, request: Request, user_id: str = Depends(require_auth)):
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

    # Input validation
    template_type = sanitize_text(body.template_type, max_length=50)

    clinic = get_clinic(user_id)
    tmpl_info = TEMPLATE_PROMPTS.get(template_type)
    if not tmpl_info:
        raise HTTPException(status_code=400, detail="알 수 없는 템플릿 유형")

    template_id = create_template_record(
        user_id=user_id,
        template_type=template_type,
        label=tmpl_info["label"],
        params=body.params,
    )
    full_text = []

    async def event_stream():
        try:
            async for chunk in stream_template(clinic, template_type, body.params):
                full_text.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"
            output = "".join(full_text)
            update_template_output(template_id, output)
            yield f"data: {json.dumps({'done': True, 'template_id': template_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            # 에러 정보 노출 차단 (프로덕션)
            error_msg = "서버 오류가 발생했습니다" if os.getenv("ENV") == "production" else str(e)
            yield f"data: {json.dumps({'error': error_msg}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/api/template/batch-generate")
@limiter.limit(RATE_LIMITS["batch_generate"])
async def api_batch_generate_template(
    request: Request,
    file: UploadFile = File(...),
    template_type: str = Form(...),
    send_sms: bool = Form(False),
    user_id: str = Depends(require_auth)
):
    """
    CSV 파일 업로드 → AI 일괄 생성 → (선택) SMS 발송

    CSV 형식 예시:
    이름,전화번호,예약일,예약시간,진료내용,메모
    김철수,01012345678,2026-02-25,14:00,임플란트,
    """
    # Check trial
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

    clinic = get_clinic(user_id)
    tmpl_info = TEMPLATE_PROMPTS.get(template_type)
    if not tmpl_info:
        raise HTTPException(status_code=400, detail="알 수 없는 템플릿 유형")

    # Parse CSV
    content = await file.read()
    text = content.decode('utf-8-sig')  # Handle BOM
    reader = csv.DictReader(io.StringIO(text))

    batch_params = []
    rows_data = []

    for row in reader:
        # Build params dict from CSV columns
        params = {}
        phone = ""

        # Map CSV columns to template params
        for key, value in row.items():
            key_lower = key.strip().lower()
            value_clean = value.strip()

            if key_lower in ['이름', 'name']:
                params['name'] = value_clean
            elif key_lower in ['전화번호', 'phone', 'tel']:
                phone = value_clean
            elif key_lower in ['예약일', 'appt_date', 'date']:
                params['appt_date'] = value_clean
            elif key_lower in ['예약시간', 'appt_time', 'time']:
                params['appt_time'] = value_clean
            elif key_lower in ['진료내용', 'treatment', 'content']:
                params['treatment'] = value_clean
            elif key_lower in ['메모', 'note', 'memo']:
                params['note'] = value_clean
            elif key_lower in ['주제', 'topic']:
                params['topic'] = value_clean
            elif key_lower in ['플랫폼', 'platform']:
                params['platform'] = value_clean

        batch_params.append(params)
        rows_data.append({
            "params": params,
            "phone": phone,
            "name": params.get('name', '고객')
        })

    if not batch_params:
        raise HTTPException(status_code=400, detail="CSV 파일이 비어있거나 형식이 잘못되었습니다")

    # Generate messages
    try:
        generated_messages = await generate_template_batch(clinic, template_type, batch_params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 생성 오류: {str(e)}")

    # Combine results
    results = []
    for i, (row_data, message) in enumerate(zip(rows_data, generated_messages)):
        results.append({
            "index": i + 1,
            "name": row_data["name"],
            "phone": row_data["phone"],
            "params": row_data["params"],
            "message": message
        })

    # Send SMS if requested
    sms_result = None
    if send_sms:
        api_key = clinic.get("solapi_api_key", "")
        api_secret = clinic.get("solapi_api_secret", "")
        sender = clinic.get("solapi_sender", "")

        if not all([api_key, api_secret, sender]):
            raise HTTPException(status_code=400, detail="SMS 발송을 위해 병원 정보에서 Solapi 설정을 먼저 등록해주세요")

        sms_messages = [
            {"to": row_data["phone"], "text": message}
            for row_data, message in zip(rows_data, generated_messages)
            if row_data["phone"]
        ]

        if sms_messages:
            try:
                sms_result = await send_sms_batch(api_key, api_secret, sender, sms_messages)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"SMS 발송 오류: {str(e)}")

    return {
        "success": True,
        "total": len(results),
        "results": results,
        "sms": sms_result
    }


# ── Template history ──────────────────────────────────

@app.get("/api/templates")
async def api_list_templates(limit: int = 20, offset: int = 0, user_id: str = Depends(require_auth)):
    return {
        "items": list_templates(user_id, limit, offset),
        "total": count_templates(user_id),
    }


@app.delete("/api/templates/all")
async def api_delete_all_templates(user_id: str = Depends(require_auth)):
    delete_all_templates(user_id)
    return {"ok": True}


@app.delete("/api/templates/{template_id}")
async def api_delete_template(template_id: int, user_id: str = Depends(require_auth)):
    delete_template_record(user_id, template_id)
    return {"ok": True}


# ── Account management ────────────────────────────────

@app.delete("/api/account")
async def api_delete_account(request: Request, user_id: str = Depends(require_auth)):
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        delete_session(auth_header[7:])
    delete_all_user_data(user_id)
    return {"ok": True}


# ── Popup ─────────────────────────────────────────────

@app.get("/api/popup")
async def api_get_popup(user_id: str = Depends(require_auth)):
    popup = get_popup_config()
    if not popup.get("active"):
        return {"active": False}
    return popup


# ── Subscription ───────────────────────────────────────

@app.get("/api/subscription")
async def api_get_subscription(user_id: str = Depends(require_auth)):
    return get_subscription(user_id)


# ── Admin ──────────────────────────────────────────────

@app.get("/api/admin/stats")
async def api_admin_stats(admin_id: str = Depends(require_admin)):
    return get_global_stats()


@app.get("/api/admin/users")
async def api_admin_users(limit: int = 50, offset: int = 0, admin_id: str = Depends(require_admin)):
    return {"items": list_users_with_stats(limit, offset)}


@app.get("/api/admin/users/{kakao_id}")
async def api_admin_user_detail(kakao_id: str, admin_id: str = Depends(require_admin)):
    user = get_user(kakao_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    sub = get_subscription(kakao_id)
    return {**user, "subscription": sub}


class SubBody(BaseModel):
    plan: str = "free"
    is_active: int = 0
    trial_ends_at: str | None = None
    expires_at: str | None = None
    memo: str = ""


@app.put("/api/admin/users/{kakao_id}/subscription")
async def api_admin_set_subscription(kakao_id: str, body: SubBody, admin_id: str = Depends(require_admin)):
    return upsert_subscription(
        user_id=kakao_id,
        plan=body.plan,
        is_active=body.is_active,
        trial_ends_at=body.trial_ends_at,
        expires_at=body.expires_at,
        memo=body.memo,
    )


@app.get("/api/admin/popup")
async def api_admin_get_popup(admin_id: str = Depends(require_admin)):
    return get_popup_config()


class PopupBody(BaseModel):
    image_url: str = ""
    link_url: str = ""
    title: str = ""
    active: int = 0


@app.put("/api/admin/popup")
async def api_admin_save_popup(body: PopupBody, admin_id: str = Depends(require_admin)):
    return save_popup_config(body.image_url, body.link_url, body.title, body.active)


# ── Legal pages ───────────────────────────────────────

@app.get("/privacy")
async def privacy():
    return FileResponse(str(STATIC_DIR / "privacy.html"))


@app.get("/terms")
async def terms():
    return FileResponse(str(STATIC_DIR / "terms.html"))


# ── SPA fallback ──────────────────────────────────────

@app.get("/admin")
@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "index.html"))
