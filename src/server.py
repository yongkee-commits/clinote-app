import json
import httpx
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

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
    list_users_with_stats, get_global_stats,
)
from src.ai import stream_review_reply, stream_template, TEMPLATE_PROMPTS

app = FastAPI(title="Clinote")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def kakao_login():
    params = (
        f"client_id={KAKAO_CLIENT_ID}"
        f"&redirect_uri={KAKAO_REDIRECT_URI}"
        f"&response_type=code"
    )
    return RedirectResponse(url=f"{KAKAO_AUTH_URL}?{params}")


@app.get("/api/auth/kakao/callback")
async def kakao_callback(code: str = "", error: str = ""):
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
    return user


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
    return save_clinic(
        user_id=user_id,
        name=body.name,
        specialty=body.specialty,
        doctor_name=body.doctor_name,
        tone=body.tone,
        forbidden_words=body.forbidden_words,
        emphasis=body.emphasis,
        phone=body.phone,
        naver_map_url=body.naver_map_url,
        instagram_url=body.instagram_url,
        kakao_channel=body.kakao_channel,
    )


# ── Review reply ──────────────────────────────────────

class ReviewGenerateBody(BaseModel):
    platform: str = "naver"
    rating: int | None = None
    original_text: str


@app.post("/api/review/generate")
async def api_generate_review(body: ReviewGenerateBody, user_id: str = Depends(require_auth)):
    clinic = get_clinic(user_id)
    review_id = create_review(user_id, body.platform, body.rating, body.original_text)
    full_reply = []

    async def event_stream():
        try:
            async for chunk in stream_review_reply(clinic, body.original_text, body.rating):
                full_reply.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"

            reply_text = "".join(full_reply)
            update_review_reply(review_id, reply_text)
            yield f"data: {json.dumps({'done': True, 'reply_id': review_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

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
async def api_generate_template(body: TemplateBody, user_id: str = Depends(require_auth)):
    clinic = get_clinic(user_id)
    tmpl_info = TEMPLATE_PROMPTS.get(body.template_type)
    if not tmpl_info:
        raise HTTPException(status_code=400, detail="알 수 없는 템플릿 유형")

    template_id = create_template_record(
        user_id=user_id,
        template_type=body.template_type,
        label=tmpl_info["label"],
        params=body.params,
    )
    full_text = []

    async def event_stream():
        try:
            async for chunk in stream_template(clinic, body.template_type, body.params):
                full_text.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"
            output = "".join(full_text)
            update_template_output(template_id, output)
            yield f"data: {json.dumps({'done': True, 'template_id': template_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


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


# ── SPA fallback ──────────────────────────────────────

@app.get("/admin")
@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "index.html"))
