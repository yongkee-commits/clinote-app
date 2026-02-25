"""
Rate Limiting 설정
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Rate limiter 초기화
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],  # 기본: 분당 100회
    storage_uri="memory://",  # 프로덕션: Redis 권장
)

# 엔드포인트별 제한
RATE_LIMITS = {
    "auth": "10/minute",  # 인증 시도
    "ai_generate": "10/hour",  # AI 생성 (개인)
    "batch_generate": "2/hour",  # 배치 생성
    "admin": "100/hour",  # 관리자 작업
}
