"""
입력 검증 및 살균 (Validation & Sanitization)
"""
import re
import ipaddress
import bleach
from typing import Any
from fastapi import HTTPException
from pydantic import BaseModel, field_validator
import validators


def validate_phone(phone: str) -> str:
    """전화번호 검증 및 정규화"""
    if not phone:
        return ""
    cleaned = re.sub(r'[^0-9]', '', phone)
    if not re.match(r'^0[0-9]{9,10}$', cleaned):
        raise HTTPException(status_code=400, detail="유효하지 않은 전화번호 형식")
    return cleaned


def validate_url(url: str, allow_empty: bool = True) -> str:
    """URL 검증 (SSRF 방어 포함)"""
    if not url:
        if allow_empty:
            return ""
        raise HTTPException(status_code=400, detail="URL이 필요합니다")

    # URL 형식 검증
    if not validators.url(url):
        raise HTTPException(status_code=400, detail="유효하지 않은 URL 형식")

    # 프로토콜 제한 (http/https만)
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="HTTP/HTTPS URL만 허용됩니다")

    # SSRF 방어: 내부 IP 차단
    try:
        from urllib.parse import urlparse
        hostname = urlparse(url).hostname
        if hostname:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local:
                raise HTTPException(status_code=400, detail="내부 IP 주소 접근 불가")
    except ValueError:
        pass  # 호스트명이 IP가 아닌 경우 (도메인) - 허용

    return url


def sanitize_text(text: str, max_length: int = 5000, strip_tags: bool = False) -> str:
    """텍스트 살균 (XSS 방어)"""
    if not text:
        return ""

    # 길이 제한
    text = text.strip()[:max_length]

    # HTML 태그 제거 (선택적)
    if strip_tags:
        text = bleach.clean(text, tags=[], strip=True)

    # 제어 문자 제거 (개행/탭 제외)
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)

    return text


def sanitize_html(html: str, allowed_tags: list[str] = None) -> str:
    """HTML 살균 (화이트리스트 기반)"""
    if not html:
        return ""

    # 기본 허용 태그 (리뷰 답변용)
    if allowed_tags is None:
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a']

    # 허용된 태그와 속성만 남김
    allowed_attrs = {'a': ['href', 'title']}
    return bleach.clean(
        html,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )


def validate_rating(rating: int) -> int:
    """별점 검증 (1-5)"""
    if not isinstance(rating, int) or not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="별점은 1-5 사이여야 합니다")
    return rating


# ── Pydantic Models (입력 검증) ────────────────────────────

class ClinicUpdateModel(BaseModel):
    """병원 정보 업데이트 모델"""
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

    @field_validator('name', 'specialty', 'doctor_name', 'emphasis', 'kakao_channel')
    @classmethod
    def sanitize_text_fields(cls, v: str) -> str:
        return sanitize_text(v, max_length=500)

    @field_validator('phone')
    @classmethod
    def validate_phone_field(cls, v: str) -> str:
        if not v:
            return ""
        return validate_phone(v)

    @field_validator('naver_map_url', 'instagram_url')
    @classmethod
    def validate_url_field(cls, v: str) -> str:
        return validate_url(v, allow_empty=True)


class ReviewGenerateModel(BaseModel):
    """리뷰 답변 생성 모델"""
    platform: str = "naver"
    rating: int | None = None
    original_text: str

    @field_validator('platform', 'original_text')
    @classmethod
    def sanitize_text_fields(cls, v: str) -> str:
        return sanitize_text(v, max_length=5000)

    @field_validator('rating')
    @classmethod
    def validate_rating_field(cls, v: int | None) -> int | None:
        if v is None:
            return None
        return validate_rating(v)


class TemplateGenerateModel(BaseModel):
    """템플릿 생성 모델"""
    template_type: str
    params: dict = {}

    @field_validator('template_type')
    @classmethod
    def sanitize_template_type(cls, v: str) -> str:
        return sanitize_text(v, max_length=50)


class SubscriptionUpdateModel(BaseModel):
    """구독 업데이트 모델 (관리자용)"""
    plan: str = "free"
    is_active: int = 0
    trial_ends_at: str | None = None
    expires_at: str | None = None
    memo: str = ""

    @field_validator('plan', 'memo')
    @classmethod
    def sanitize_text_fields(cls, v: str) -> str:
        return sanitize_text(v, max_length=500)


# ── Validators (매개변수 검증) ──────────────────────────────

class ParamValidator:
    """쿼리 매개변수 검증"""

    @staticmethod
    def validate_limit(limit: int, max_limit: int = 100) -> int:
        """페이지네이션 limit 검증"""
        if limit < 1:
            return 20
        return min(limit, max_limit)

    @staticmethod
    def validate_offset(offset: int) -> int:
        """페이지네이션 offset 검증"""
        return max(0, offset)

    @staticmethod
    def validate_id(id_value: Any, field_name: str = "ID") -> int:
        """ID 검증"""
        try:
            id_int = int(id_value)
            if id_int < 1:
                raise ValueError
            return id_int
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail=f"유효하지 않은 {field_name}")


class CSVValidator:
    """CSV 파일 검증"""

    @staticmethod
    def validate_file_size(content: bytes, max_mb: int = 5) -> None:
        """파일 크기 검증"""
        max_bytes = max_mb * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"파일 크기는 {max_mb}MB 이하여야 합니다"
            )

    @staticmethod
    def validate_row_count(rows: list, max_rows: int = 1000) -> None:
        """행 개수 검증"""
        if len(rows) > max_rows:
            raise HTTPException(
                status_code=400,
                detail=f"CSV 행은 {max_rows}개 이하여야 합니다"
            )


class SQLInjectionDetector:
    """SQL Injection 패턴 감지"""

    # 위험한 SQL 키워드 패턴
    DANGEROUS_PATTERNS = [
        r'\b(union|select|insert|update|delete|drop|alter|create|exec|execute)\b',
        r'--',
        r'/\*.*?\*/',
        r';.*?--',
        r"'.*?OR.*?'.*?'",
    ]

    @classmethod
    def detect(cls, text: str) -> bool:
        """SQL Injection 패턴 감지"""
        if not text:
            return False

        text_lower = text.lower()
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        return False

    @classmethod
    def validate(cls, text: str, field_name: str = "입력값") -> str:
        """SQL Injection 검증 (감지 시 예외 발생)"""
        if cls.detect(text):
            raise HTTPException(
                status_code=400,
                detail=f"{field_name}에 허용되지 않는 문자가 포함되어 있습니다"
            )
        return text
