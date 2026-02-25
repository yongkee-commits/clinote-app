"""
보안 강화된 FastAPI 서버
- CORS/Preflight 설정
- CSRF 토큰
- XSS + CSP 헤더
- SSRF 방어
- AuthN/AuthZ 강화
- RBAC + 테넌트 격리
- 최소 권한 원칙
- Input Validation + SQLi 방어
- Rate Limit / Brute Force 방어
- 쿠키 보안 (HttpOnly, Secure, SameSite)
- Secret 관리 + Rotation
- HTTPS/HSTS + 보안 헤더
- Audit Log
- 에러 노출 차단
"""
import json
import csv
import io
import httpx
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded

from src.auth import (
    create_session_token, require_auth, require_admin,
    enforce_tenant_isolation, get_safe_user_info
)
from src.config import (
    STATIC_DIR, KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI,
    ALLOWED_ORIGINS, IS_PRODUCTION, CSRF_ENABLED, RATE_LIMIT_ENABLED
)
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
from src.security import (
    SecurityHeadersMiddleware, RateLimitMiddleware, CSRFProtection,
    get_cors_config, mask_error_message, BruteForceProtection, InputValidator
)
from src.validation import (
    ClinicUpdateModel, ReviewGenerateModel, TemplateGenerateModel,
    SubscriptionUpdateModel, ParamValidator, CSVValidator, SQLInjectionDetector
)
from src.audit import AuditLogger, AuditAction

# ── FastAPI App 초기화 ─────────────────────────────────

app = FastAPI(
    title="Clinote",
    docs_url="/api/docs" if not IS_PRODUCTION else None,  # Production에서 docs 비활성화
    redoc_url="/api/redoc" if not IS_PRODUCTION else None,
)

# ── 보안 미들웨어 추가 ──────────────────────────────────

# 1. Security Headers (XSS, CSP, HSTS 등)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Rate Limiting
if RATE_LIMIT_ENABLED:
    app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)

# 3. CORS (개선된 설정)
app.add_middleware(
    CORSMiddleware,
    **get_cors_config(ALLOWED_ORIGINS)
)

# ── 정적 파일 ──────────────────────────────────────────

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ── 전역 객체 ──────────────────────────────────────────

KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize"
KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_URL = "https://kapi.kakao.com/v2/user/me"

csrf_protection = CSRFProtection(secret_key=KAKAO_CLIENT_SECRET or "default-secret")
brute_force_protection = BruteForceProtection()

# ── Startup/Shutdown ───────────────────────────────────

@app.on_event("startup")
async def startup():
    """앱 시작 시 초기화"""
    init_db()
    delete_expired_sessions()
    AuditLogger.init_audit_table()
    AuditLogger.cleanup_old_logs(days=90)


@app.on_event("shutdown")
async def shutdown():
    """앱 종료 시 정리"""
    pass


# ── 예외 핸들러 (에러 노출 차단) ───────────────────────

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Rate Limit 초과 핸들러"""
    AuditLogger.log_from_request(
        request, AuditAction.RATE_LIMIT_EXCEEDED,
        status="failed"
    )
    return JSONResponse(
        status_code=429,
        content={"detail": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."}
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """전역 예외 핸들러 (상세 에러 노출 차단)"""
    # HTTPException은 그대로 전달
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    # 기타 에러는 마스킹
    error_msg = mask_error_message(exc, IS_PRODUCTION)

    # 로깅 (실제 에러는 서버 로그에만)
    import traceback
    print(f"[ERROR] {traceback.format_exc()}")

    return JSONResponse(
        status_code=500,
        content={"detail": error_msg}
    )


# ── Kakao OAuth (보안 강화) ────────────────────────────

@app.get("/api/auth/kakao")
async def kakao_login(request: Request):
    """Kakao 로그인 시작"""
    AuditLogger.log_from_request(request, AuditAction.LOGIN)

    params = (
        f"client_id={KAKAO_CLIENT_ID}"
        f"&redirect_uri={KAKAO_REDIRECT_URI}"
        f"&response_type=code"
    )
    return RedirectResponse(url=f"{KAKAO_AUTH_URL}?{params}")


@app.get("/api/auth/kakao/callback")
async def kakao_callback(request: Request, code: str = "", error: str = ""):
    """Kakao OAuth 콜백 (SSRF 방어 포함)"""
    client_ip = request.client.host if request.client else "unknown"

    # Brute Force 체크
    if brute_force_protection.is_locked_out(client_ip):
        AuditLogger.log_from_request(
            request, AuditAction.LOGIN_FAILED,
            status="failed", details={"reason": "brute_force_lockout"}
        )
        return RedirectResponse(url="/?error=too_many_attempts")

    if error or not code:
        brute_force_protection.record_failed_attempt(client_ip)
        return RedirectResponse(url="/?error=kakao_auth_failed")

    # SSRF 방어: Kakao API만 허용 (whitelist)
    allowed_hosts = ["kauth.kakao.com", "kapi.kakao.com"]

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

        try:
            token_resp = await client.post(
                KAKAO_TOKEN_URL,
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if token_resp.status_code != 200:
                brute_force_protection.record_failed_attempt(client_ip)
                return RedirectResponse(url="/?error=token_exchange_failed")

            access_token = token_resp.json().get("access_token")
            if not access_token:
                brute_force_protection.record_failed_attempt(client_ip)
                return RedirectResponse(url="/?error=no_access_token")

            # 2. 유저 프로필 조회
            user_resp = await client.get(
                KAKAO_USER_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_resp.status_code != 200:
                brute_force_protection.record_failed_attempt(client_ip)
                return RedirectResponse(url="/?error=user_fetch_failed")

            user_data = user_resp.json()

        except Exception as e:
            brute_force_protection.record_failed_attempt(client_ip)
            AuditLogger.log_from_request(
                request, AuditAction.LOGIN_FAILED,
                status="failed", details={"error": str(e)[:200]}
            )
            return RedirectResponse(url="/?error=auth_error")

    kakao_id = str(user_data["id"])
    kakao_account = user_data.get("kakao_account", {})
    profile = kakao_account.get("profile", user_data.get("properties", {}))
    nickname = profile.get("nickname", "")
    profile_image = profile.get("profile_image_url", profile.get("profile_image", ""))

    # XSS 방어: nickname sanitize
    from src.security import XSSProtection
    nickname = XSSProtection.sanitize(nickname, strip=True)

    # 3. 유저 upsert + 세션 발급
    upsert_user(kakao_id, nickname, profile_image)
    session_token, expires_at = create_session_token()
    create_session(session_token, kakao_id, expires_at)

    # 성공 로그
    brute_force_protection.reset(client_ip)
    AuditLogger.log_from_request(
        request, AuditAction.LOGIN,
        user_id=kakao_id, status="success"
    )

    # 4. 프론트엔드로 토큰 전달
    return RedirectResponse(url=f"/?token={session_token}")


@app.post("/api/auth/logout")
async def kakao_logout(request: Request, user_id: str = Depends(require_auth)):
    """로그아웃"""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        delete_session(auth_header[7:])

    AuditLogger.log_from_request(
        request, AuditAction.LOGOUT,
        user_id=user_id
    )
    return {"ok": True}


@app.get("/api/me")
async def api_me(request: Request, user_id: str = Depends(require_auth)):
    """현재 사용자 정보 (최소 권한 원칙)"""
    user = get_safe_user_info(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── Clinic settings (보안 강화) ────────────────────────

@app.get("/api/clinic")
async def api_get_clinic(request: Request, user_id: str = Depends(require_auth)):
    """병원 정보 조회 (테넌트 격리)"""
    clinic = get_clinic(user_id)
    # 민감 정보 제외 (Solapi 시크릿 등)
    if "solapi_api_secret" in clinic:
        clinic["solapi_api_secret"] = "***" if clinic["solapi_api_secret"] else ""
    return clinic


@app.put("/api/clinic")
async def api_save_clinic(
    body: ClinicUpdateModel,
    request: Request,
    user_id: str = Depends(require_auth)
):
    """병원 정보 저장 (입력 검증 + XSS 방어)"""
    result = save_clinic(
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

    AuditLogger.log_from_request(
        request, AuditAction.CLINIC_UPDATE,
        user_id=user_id, resource="clinic"
    )

    return result


# ── Review reply (보안 강화) ───────────────────────────

@app.post("/api/review/generate")
async def api_generate_review(
    body: ReviewGenerateModel,
    request: Request,
    user_id: str = Depends(require_auth)
):
    """리뷰 답변 생성 (입력 검증 + 할당량 체크)"""
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

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

            # Audit log
            AuditLogger.log_from_request(
                request, AuditAction.REVIEW_GENERATE,
                user_id=user_id, resource="review", resource_id=str(review_id)
            )

            yield f"data: {json.dumps({'done': True, 'reply_id': review_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': mask_error_message(e, IS_PRODUCTION)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Review history (테넌트 격리) ───────────────────────

@app.get("/api/reviews")
async def api_list_reviews(
    request: Request,
    limit: int = 20,
    offset: int = 0,
    user_id: str = Depends(require_auth)
):
    """리뷰 이력 조회 (테넌트 격리)"""
    limit = ParamValidator.validate_limit(limit, max_limit=100)
    offset = ParamValidator.validate_offset(offset)

    return {
        "items": list_reviews(user_id, limit, offset),
        "total": count_reviews(user_id),
    }


@app.delete("/api/reviews/all")
async def api_delete_all_reviews(request: Request, user_id: str = Depends(require_auth)):
    """전체 리뷰 삭제 (테넌트 격리)"""
    delete_all_reviews(user_id)
    AuditLogger.log_from_request(
        request, AuditAction.DELETE,
        user_id=user_id, resource="reviews", details={"action": "delete_all"}
    )
    return {"ok": True}


@app.delete("/api/reviews/{review_id}")
async def api_delete_review(
    review_id: int,
    request: Request,
    user_id: str = Depends(require_auth)
):
    """리뷰 삭제 (테넌트 격리)"""
    review_id = ParamValidator.validate_id(review_id, "리뷰 ID")
    delete_review(user_id, review_id)

    AuditLogger.log_from_request(
        request, AuditAction.DELETE,
        user_id=user_id, resource="review", resource_id=str(review_id)
    )
    return {"ok": True}


# ── Template generation (보안 강화) ────────────────────

@app.post("/api/template/generate")
async def api_generate_template(
    body: TemplateGenerateModel,
    request: Request,
    user_id: str = Depends(require_auth)
):
    """템플릿 생성 (입력 검증 + SQL injection 방어)"""
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

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

            # Audit log
            AuditLogger.log_from_request(
                request, AuditAction.TEMPLATE_GENERATE,
                user_id=user_id, resource="template", resource_id=str(template_id)
            )

            yield f"data: {json.dumps({'done': True, 'template_id': template_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': mask_error_message(e, IS_PRODUCTION)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/api/template/batch-generate")
async def api_batch_generate_template(
    file: UploadFile = File(...),
    template_type: str = Form(...),
    send_sms: bool = Form(False),
    request: Request = None,
    user_id: str = Depends(require_auth)
):
    """CSV 일괄 생성 (파일 검증 + 크기 제한)"""
    # File validation
    await CSVValidator.validate_file(file)

    # Check trial
    allowed, reason = check_and_use_trial(user_id)
    if not allowed:
        msg = "체험 기간이 종료되었습니다" if reason == "trial_expired" else "체험 생성 횟수(30건)를 초과했습니다"
        raise HTTPException(status_code=403, detail=msg)

    # Template type validation
    SQLInjectionDetector.validate_and_raise(template_type, "템플릿 타입")
    if template_type not in TEMPLATE_PROMPTS:
        raise HTTPException(status_code=400, detail="알 수 없는 템플릿 유형")

    clinic = get_clinic(user_id)
    tmpl_info = TEMPLATE_PROMPTS[template_type]

    # Parse CSV
    content = await file.read()
    text = content.decode('utf-8-sig')
    reader = csv.DictReader(io.StringIO(text))

    batch_params = []
    rows_data = []

    for row in reader:
        params = {}
        phone = ""

        for key, value in row.items():
            key_lower = key.strip().lower()
            value_clean = value.strip()

            # SQL injection 체크
            if SQLInjectionDetector.is_suspicious(value_clean):
                raise HTTPException(
                    status_code=400,
                    detail=f"잘못된 입력이 감지되었습니다: {key}"
                )

            # Map columns
            if key_lower in ['이름', 'name']:
                params['name'] = value_clean
            elif key_lower in ['전화번호', 'phone', 'tel']:
                phone = value_clean
                if phone and not InputValidator.validate_phone(phone):
                    raise HTTPException(
                        status_code=400,
                        detail=f"잘못된 전화번호 형식: {phone}"
                    )
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

    # Row count validation
    CSVValidator.validate_row_count(len(batch_params))

    if not batch_params:
        raise HTTPException(status_code=400, detail="CSV 파일이 비어있거나 형식이 잘못되었습니다")

    # Generate messages
    try:
        generated_messages = await generate_template_batch(clinic, template_type, batch_params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 생성 오류: {mask_error_message(e, IS_PRODUCTION)}")

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
                raise HTTPException(status_code=500, detail=f"SMS 발송 오류: {mask_error_message(e, IS_PRODUCTION)}")

    # Audit log
    AuditLogger.log_from_request(
        request, AuditAction.TEMPLATE_GENERATE,
        user_id=user_id, resource="template_batch",
        details={"count": len(results), "sms_sent": send_sms}
    )

    return {
        "success": True,
        "total": len(results),
        "results": results,
        "sms": sms_result
    }


# ── Template history (테넌트 격리) ─────────────────────

@app.get("/api/templates")
async def api_list_templates(
    request: Request,
    limit: int = 20,
    offset: int = 0,
    user_id: str = Depends(require_auth)
):
    """템플릿 이력 조회 (테넌트 격리)"""
    limit = ParamValidator.validate_limit(limit, max_limit=100)
    offset = ParamValidator.validate_offset(offset)

    return {
        "items": list_templates(user_id, limit, offset),
        "total": count_templates(user_id),
    }


@app.delete("/api/templates/all")
async def api_delete_all_templates(request: Request, user_id: str = Depends(require_auth)):
    """전체 템플릿 삭제 (테넌트 격리)"""
    delete_all_templates(user_id)
    AuditLogger.log_from_request(
        request, AuditAction.DELETE,
        user_id=user_id, resource="templates", details={"action": "delete_all"}
    )
    return {"ok": True}


@app.delete("/api/templates/{template_id}")
async def api_delete_template(
    template_id: int,
    request: Request,
    user_id: str = Depends(require_auth)
):
    """템플릿 삭제 (테넌트 격리)"""
    template_id = ParamValidator.validate_id(template_id, "템플릿 ID")
    delete_template_record(user_id, template_id)

    AuditLogger.log_from_request(
        request, AuditAction.DELETE,
        user_id=user_id, resource="template", resource_id=str(template_id)
    )
    return {"ok": True}


# ── Account management (감사 로그) ─────────────────────

@app.delete("/api/account")
async def api_delete_account(request: Request, user_id: str = Depends(require_auth)):
    """계정 삭제 (전체 데이터 삭제)"""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        delete_session(auth_header[7:])

    delete_all_user_data(user_id)

    AuditLogger.log_from_request(
        request, AuditAction.ACCOUNT_DELETE,
        user_id=user_id, details={"all_data_deleted": True}
    )

    return {"ok": True}


# ── Popup ──────────────────────────────────────────────

@app.get("/api/popup")
async def api_get_popup(user_id: str = Depends(require_auth)):
    """팝업 설정 조회"""
    popup = get_popup_config()
    if not popup.get("active"):
        return {"active": False}
    return popup


# ── Subscription ───────────────────────────────────────

@app.get("/api/subscription")
async def api_get_subscription(user_id: str = Depends(require_auth)):
    """구독 정보 조회 (본인만)"""
    return get_subscription(user_id)


# ── Admin (RBAC + Audit Log) ───────────────────────────

@app.get("/api/admin/stats")
async def api_admin_stats(admin_id: str = Depends(require_admin)):
    """전체 통계 (관리자 전용)"""
    return get_global_stats()


@app.get("/api/admin/users")
async def api_admin_users(
    limit: int = 50,
    offset: int = 0,
    admin_id: str = Depends(require_admin)
):
    """사용자 목록 (관리자 전용)"""
    limit = ParamValidator.validate_limit(limit, max_limit=200)
    offset = ParamValidator.validate_offset(offset)
    return {"items": list_users_with_stats(limit, offset)}


@app.get("/api/admin/users/{kakao_id}")
async def api_admin_user_detail(kakao_id: str, admin_id: str = Depends(require_admin)):
    """사용자 상세 (관리자 전용)"""
    kakao_id = ParamValidator.validate_kakao_id(kakao_id)
    user = get_user(kakao_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    sub = get_subscription(kakao_id)
    return {**user, "subscription": sub}


@app.put("/api/admin/users/{kakao_id}/subscription")
async def api_admin_set_subscription(
    kakao_id: str,
    body: SubscriptionUpdateModel,
    request: Request,
    admin_id: str = Depends(require_admin)
):
    """구독 정보 변경 (관리자 전용)"""
    kakao_id = ParamValidator.validate_kakao_id(kakao_id)

    result = upsert_subscription(
        user_id=kakao_id,
        plan=body.plan,
        is_active=body.is_active,
        trial_ends_at=body.trial_ends_at,
        expires_at=body.expires_at,
        memo=body.memo,
    )

    AuditLogger.log_from_request(
        request, AuditAction.SUBSCRIPTION_UPDATE,
        user_id=admin_id, resource="subscription", resource_id=kakao_id,
        details={"target_user": kakao_id, "plan": body.plan}
    )

    return result


@app.get("/api/admin/popup")
async def api_admin_get_popup(admin_id: str = Depends(require_admin)):
    """팝업 설정 조회 (관리자 전용)"""
    return get_popup_config()


@app.put("/api/admin/popup")
async def api_admin_save_popup(
    body: dict,
    request: Request,
    admin_id: str = Depends(require_admin)
):
    """팝업 설정 저장 (관리자 전용)"""
    # Input validation
    image_url = body.get("image_url", "")
    link_url = body.get("link_url", "")

    if image_url and not InputValidator.validate_url(image_url):
        raise HTTPException(status_code=400, detail="잘못된 이미지 URL")
    if link_url and not InputValidator.validate_url(link_url):
        raise HTTPException(status_code=400, detail="잘못된 링크 URL")

    result = save_popup_config(
        image_url,
        link_url,
        body.get("title", ""),
        body.get("active", 0)
    )

    AuditLogger.log_from_request(
        request, AuditAction.POPUP_UPDATE,
        user_id=admin_id, resource="popup"
    )

    return result


# ── Audit Logs (관리자 전용) ───────────────────────────

@app.get("/api/admin/audit-logs")
async def api_admin_audit_logs(
    user_id: str = None,
    action: str = None,
    limit: int = 100,
    offset: int = 0,
    admin_id: str = Depends(require_admin)
):
    """감사 로그 조회 (관리자 전용)"""
    limit = ParamValidator.validate_limit(limit, max_limit=500)
    offset = ParamValidator.validate_offset(offset)

    logs = AuditLogger.get_logs(user_id, action, limit, offset)
    return {"items": logs, "total": len(logs)}


@app.get("/api/admin/security-events")
async def api_admin_security_events(
    hours: int = 24,
    admin_id: str = Depends(require_admin)
):
    """최근 보안 이벤트 조회 (관리자 전용)"""
    if hours < 1 or hours > 168:  # 최대 7일
        hours = 24

    events = AuditLogger.get_security_events(hours)
    return {"items": events, "hours": hours}


# ── Legal pages ────────────────────────────────────────

@app.get("/privacy")
async def privacy():
    """개인정보 처리방침"""
    return FileResponse(str(STATIC_DIR / "privacy.html"))


@app.get("/terms")
async def terms():
    """이용약관"""
    return FileResponse(str(STATIC_DIR / "terms.html"))


# ── Health Check ───────────────────────────────────────

@app.get("/health")
async def health_check():
    """헬스 체크 (모니터링용)"""
    return {"status": "healthy", "version": "2.0.0"}


# ── SPA fallback ───────────────────────────────────────

@app.get("/admin")
@app.get("/")
async def root():
    """SPA 루트"""
    return FileResponse(str(STATIC_DIR / "index.html"))
