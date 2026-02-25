import os
import secrets
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

# ── Core Settings ──────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))

# Railway 볼륨은 DATA_DIR=/data 환경변수로 지정, 로컬은 기본값 사용
_data_dir = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
DB_PATH = _data_dir / "clinote.db"
STATIC_DIR = BASE_DIR / "static"

TOKEN_EXPIRE = 60 * 60 * 24 * 30  # 30일

# ── Kakao OAuth ────────────────────────────────────────

KAKAO_CLIENT_ID = os.getenv("KAKAO_CLIENT_ID", "")
KAKAO_CLIENT_SECRET = os.getenv("KAKAO_CLIENT_SECRET", "")
KAKAO_REDIRECT_URI = os.getenv(
    "KAKAO_REDIRECT_URI",
    "http://localhost:8003/api/auth/kakao/callback",
)

# ── Security Settings ──────────────────────────────────

# Environment (production/development)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

# CORS 설정
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8003,https://*.railway.app"
).split(",")

# Rate Limiting
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
RATE_LIMIT_BURST = int(os.getenv("RATE_LIMIT_BURST", "10"))

# CSRF 설정
CSRF_ENABLED = os.getenv("CSRF_ENABLED", "true").lower() == "true"
CSRF_TOKEN_LIFETIME = int(os.getenv("CSRF_TOKEN_LIFETIME", "3600"))  # 1시간

# Session 설정
SESSION_SECURE_COOKIE = os.getenv("SESSION_SECURE_COOKIE", "true").lower() == "true"
SESSION_SAMESITE = os.getenv("SESSION_SAMESITE", "Lax")  # Strict, Lax, None
SESSION_HTTPONLY = True

# Brute Force 방어
BRUTE_FORCE_MAX_ATTEMPTS = int(os.getenv("BRUTE_FORCE_MAX_ATTEMPTS", "5"))
BRUTE_FORCE_LOCKOUT_DURATION = int(os.getenv("BRUTE_FORCE_LOCKOUT_DURATION", "900"))  # 15분

# Audit Log
AUDIT_LOG_RETENTION_DAYS = int(os.getenv("AUDIT_LOG_RETENTION_DAYS", "90"))

# Admin
ADMIN_KAKAO_ID = os.getenv("ADMIN_KAKAO_ID", "")

# ── Secret Rotation ────────────────────────────────────

# Secret rotation을 위한 old secret keys (쉼표로 구분)
OLD_SECRET_KEYS = os.getenv("OLD_SECRET_KEYS", "").split(",") if os.getenv("OLD_SECRET_KEYS") else []
