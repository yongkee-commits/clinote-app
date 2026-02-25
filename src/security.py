"""
보안 미들웨어 및 유틸리티
"""
import time
import secrets
import json
from typing import Callable, Optional
from urllib.parse import urlparse
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import bleach
import validators


# ── CSRF 토큰 관리 ─────────────────────────────────────

class CSRFProtection:
    """CSRF 토큰 생성/검증"""

    def __init__(self, secret_key: str, token_lifetime: int = 3600):
        self.serializer = URLSafeTimedSerializer(secret_key)
        self.token_lifetime = token_lifetime

    def generate_token(self, session_id: str = "") -> str:
        """CSRF 토큰 생성"""
        if not session_id:
            session_id = secrets.token_urlsafe(16)
        return self.serializer.dumps(session_id)

    def validate_token(self, token: str, max_age: Optional[int] = None) -> bool:
        """CSRF 토큰 검증"""
        try:
            self.serializer.loads(token, max_age=max_age or self.token_lifetime)
            return True
        except (BadSignature, SignatureExpired):
            return False


# ── XSS 방어 ───────────────────────────────────────────

class XSSProtection:
    """XSS 방어 유틸리티"""

    ALLOWED_TAGS = ['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br']
    ALLOWED_ATTRIBUTES = {'a': ['href', 'title']}

    @staticmethod
    def sanitize(text: str, strip: bool = False) -> str:
        """HTML 태그 제거/이스케이프"""
        if strip:
            return bleach.clean(text, tags=[], strip=True)
        return bleach.clean(
            text,
            tags=XSSProtection.ALLOWED_TAGS,
            attributes=XSSProtection.ALLOWED_ATTRIBUTES,
            strip=True
        )

    @staticmethod
    def sanitize_dict(data: dict, fields: list[str], strip: bool = True) -> dict:
        """딕셔너리의 특정 필드 sanitize"""
        result = data.copy()
        for field in fields:
            if field in result and isinstance(result[field], str):
                result[field] = XSSProtection.sanitize(result[field], strip=strip)
        return result


# ── 입력 검증 ──────────────────────────────────────────

class InputValidator:
    """입력 데이터 검증"""

    @staticmethod
    def validate_url(url: str, allowed_schemes: list[str] = ['http', 'https']) -> bool:
        """URL 검증 (SSRF 방어)"""
        if not url:
            return True  # Empty URL is OK

        if not validators.url(url):
            return False

        parsed = urlparse(url)

        # 스킴 검증
        if parsed.scheme not in allowed_schemes:
            return False

        # 프라이빗 IP 차단 (SSRF 방어)
        hostname = parsed.hostname
        if hostname:
            # localhost 변형 차단
            if hostname.lower() in ['localhost', '127.0.0.1', '0.0.0.0', '::1']:
                return False

            # 프라이빗 IP 범위 차단
            if hostname.startswith(('10.', '172.16.', '192.168.')):
                return False

            # IPv6 프라이빗 주소 차단
            if hostname.startswith(('fc00:', 'fd00:', 'fe80:')):
                return False

        return True

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """전화번호 검증 (한국)"""
        if not phone:
            return True
        # 숫자만 추출
        digits = ''.join(filter(str.isdigit, phone))
        # 010-XXXX-XXXX 형식 (10-11자리)
        return len(digits) >= 10 and len(digits) <= 11 and digits.startswith(('01', '02', '03', '04', '05', '06', '07'))

    @staticmethod
    def validate_email(email: str) -> bool:
        """이메일 검증"""
        if not email:
            return True
        return validators.email(email) is True

    @staticmethod
    def validate_string_length(text: str, min_len: int = 0, max_len: int = 10000) -> bool:
        """문자열 길이 검증"""
        return min_len <= len(text) <= max_len


# ── Rate Limiting ──────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate Limit 미들웨어 with 메모리 기반 추적"""

    def __init__(self, app: ASGIApp, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_counts: dict = defaultdict(list)
        self.last_cleanup = time.time()

    async def dispatch(self, request: Request, call_next: Callable):
        # Cleanup old entries every 5 minutes
        current_time = time.time()
        if current_time - self.last_cleanup > 300:
            self._cleanup_old_entries(current_time)
            self.last_cleanup = current_time

        # Get client identifier
        client_id = self._get_client_id(request)

        # Check rate limit
        if not self._check_rate_limit(client_id, current_time):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."}
            )

        response = await call_next(request)
        return response

    def _get_client_id(self, request: Request) -> str:
        """클라이언트 식별자 추출 (IP + User-Agent 조합)"""
        ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "")[:100]
        return f"{ip}:{hash(user_agent)}"

    def _check_rate_limit(self, client_id: str, current_time: float) -> bool:
        """Rate limit 체크 및 요청 기록"""
        # 윈도우 내 요청만 필터링
        cutoff = current_time - self.window_seconds
        self.request_counts[client_id] = [
            ts for ts in self.request_counts[client_id] if ts > cutoff
        ]

        # 제한 확인
        if len(self.request_counts[client_id]) >= self.max_requests:
            return False

        # 요청 기록
        self.request_counts[client_id].append(current_time)
        return True

    def _cleanup_old_entries(self, current_time: float):
        """오래된 클라이언트 엔트리 정리"""
        cutoff = current_time - self.window_seconds * 2
        to_delete = [
            client_id for client_id, timestamps in self.request_counts.items()
            if not timestamps or max(timestamps) < cutoff
        ]
        for client_id in to_delete:
            del self.request_counts[client_id]


# ── Brute Force 방어 ───────────────────────────────────

class BruteForceProtection:
    """브루트포스 공격 방어"""

    def __init__(self, max_attempts: int = 5, lockout_duration: int = 900):
        self.max_attempts = max_attempts
        self.lockout_duration = lockout_duration
        self.attempts: dict = defaultdict(list)

    def record_failed_attempt(self, identifier: str):
        """실패한 시도 기록"""
        current_time = time.time()
        self.attempts[identifier].append(current_time)

        # 오래된 시도 삭제
        cutoff = current_time - self.lockout_duration
        self.attempts[identifier] = [
            ts for ts in self.attempts[identifier] if ts > cutoff
        ]

    def is_locked_out(self, identifier: str) -> bool:
        """잠금 상태 확인"""
        current_time = time.time()
        cutoff = current_time - self.lockout_duration

        # 오래된 시도 삭제
        self.attempts[identifier] = [
            ts for ts in self.attempts[identifier] if ts > cutoff
        ]

        return len(self.attempts[identifier]) >= self.max_attempts

    def reset(self, identifier: str):
        """성공 시 카운터 리셋"""
        if identifier in self.attempts:
            del self.attempts[identifier]


# ── Security Headers ───────────────────────────────────

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """보안 헤더 추가 미들웨어"""

    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)

        # XSS Protection
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # CSP (Content Security Policy)
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://t1.kakaocdn.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "img-src 'self' data: https: blob:; "
            "font-src 'self' data: https://cdn.jsdelivr.net; "
            "connect-src 'self' https://api.anthropic.com https://kauth.kakao.com https://kapi.kakao.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        response.headers["Content-Security-Policy"] = csp

        # HSTS (HTTPS 강제) - production only
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Additional security headers
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        return response


# ── CORS 설정 (개선된 버전) ────────────────────────────

def get_cors_config(allowed_origins: list[str]):
    """개선된 CORS 설정"""
    return {
        "allow_origins": allowed_origins,
        "allow_credentials": True,
        "allow_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "X-Requested-With"
        ],
        "expose_headers": ["X-CSRF-Token"],
        "max_age": 600,  # Preflight 캐시 10분
    }


# ── 에러 메시지 마스킹 ──────────────────────────────────

def mask_error_message(error: Exception, is_production: bool = True) -> str:
    """에러 메시지 마스킹 (상세 정보 노출 방지)"""
    if not is_production:
        return str(error)

    # Production에서는 일반적인 에러 메시지만 반환
    error_type = type(error).__name__

    safe_messages = {
        "ValueError": "잘못된 입력값입니다",
        "KeyError": "필수 항목이 누락되었습니다",
        "TypeError": "잘못된 데이터 형식입니다",
        "HTTPException": str(error),
    }

    return safe_messages.get(error_type, "처리 중 오류가 발생했습니다")
