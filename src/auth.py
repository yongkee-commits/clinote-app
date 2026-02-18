import secrets
import time
from fastapi import HTTPException, Request
from src.config import TOKEN_EXPIRE


def create_session_token() -> tuple[str, int]:
    """세션 토큰과 만료 타임스탬프(Unix) 반환."""
    token = secrets.token_urlsafe(32)
    expires_at = int(time.time()) + TOKEN_EXPIRE
    return token, expires_at


def require_auth(request: Request) -> str:
    """
    Bearer 토큰 또는 ?token= 쿼리파라미터에서 세션 토큰을 꺼내
    DB sessions 테이블을 조회한 뒤 kakao_id(str)를 반환.
    실패 시 HTTP 401.
    """
    from src.database import get_session  # 순환 임포트 방지

    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="인증이 필요합니다")

    session = get_session(token)
    if session is None:
        raise HTTPException(status_code=401, detail="세션이 존재하지 않습니다")
    if time.time() > session["expires_at"]:
        raise HTTPException(status_code=401, detail="세션이 만료되었습니다")

    return session["kakao_id"]
