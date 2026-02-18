import hashlib
import secrets
import time
from fastapi import HTTPException, Request
from src.config import APP_PASSWORD, SECRET_KEY, TOKEN_EXPIRE

_fail_counts: dict[str, tuple[int, float]] = {}
MAX_FAILS = 5
LOCKOUT_SECONDS = 300


def _get_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    return forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")


def is_blocked(request: Request) -> bool:
    ip = _get_ip(request)
    if ip not in _fail_counts:
        return False
    count, last_fail = _fail_counts[ip]
    if count >= MAX_FAILS:
        if time.time() - last_fail < LOCKOUT_SECONDS:
            return True
        del _fail_counts[ip]
    return False


def record_fail(request: Request):
    ip = _get_ip(request)
    count, _ = _fail_counts.get(ip, (0, 0.0))
    _fail_counts[ip] = (count + 1, time.time())


def check_password(password: str) -> bool:
    return secrets.compare_digest(password.encode(), APP_PASSWORD.encode())


def get_token() -> str:
    expire = int(time.time() + TOKEN_EXPIRE)
    hash_part = hashlib.sha256(f"{expire}:{SECRET_KEY}".encode()).hexdigest()[:32]
    return hash_part + str(expire)


def verify_token(token: str) -> bool:
    if not token or len(token) < 42:
        return False
    try:
        expire = int(token[32:])
        if time.time() > expire:
            return False
        expected = hashlib.sha256(f"{expire}:{SECRET_KEY}".encode()).hexdigest()[:32]
        return secrets.compare_digest(token[:32], expected)
    except Exception:
        return False


def require_auth(request: Request):
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.query_params.get("token")
    if not token or not verify_token(token):
        raise HTTPException(status_code=401, detail="인증이 필요합니다")
    return True
