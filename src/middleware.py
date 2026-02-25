"""
보안 미들웨어: CSP, HSTS, X-Frame-Options, CSRF 보호
"""
import os
import secrets
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from fastapi import Request, HTTPException

# CSRF 토큰 저장소 (프로덕션에서는 Redis 사용 권장)
csrf_tokens = {}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """보안 헤더 추가 미들웨어"""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # CSP - 엄격한 정책
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https: http://k.kakaocdn.net; "
            "connect-src 'self' https://kauth.kakao.com https://kapi.kakao.com; "
            "font-src 'self'; "
            "object-src 'none'; "
            "base-uri 'self'; "
            "form-action 'self'; "
            "frame-ancestors 'none'; "
            "upgrade-insecure-requests;"
        )

        # XSS/Clickjacking/MIME-sniffing 방어
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # HSTS (HTTPS 연결에서만)
        if request.url.scheme == "https" or os.getenv("FORCE_HTTPS") == "true":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        return response


class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """CSRF 보호 미들웨어"""

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS", "TRACE"}
    EXEMPT_PATHS = {
        "/api/auth/kakao",
        "/api/auth/kakao/callback",
        "/health",
        "/",
    }

    async def dispatch(self, request: Request, call_next):
        # Safe 메서드 또는 exempt 경로는 패스
        if request.method in self.SAFE_METHODS or request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)

        # CSRF 토큰 검증
        csrf_token = request.headers.get("X-CSRF-Token")
        user_id = getattr(request.state, "user_id", None)

        if not csrf_token or not user_id:
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF token missing"}
            )

        # 토큰 검증
        expected_token = csrf_tokens.get(user_id)
        if not expected_token or csrf_token != expected_token:
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF token invalid"}
            )

        return await call_next(request)


def generate_csrf_token(user_id: str) -> str:
    """CSRF 토큰 생성"""
    token = secrets.token_urlsafe(32)
    csrf_tokens[user_id] = token
    return token


def get_csrf_token(user_id: str) -> str | None:
    """CSRF 토큰 조회"""
    return csrf_tokens.get(user_id)


def revoke_csrf_token(user_id: str):
    """CSRF 토큰 폐기"""
    csrf_tokens.pop(user_id, None)
