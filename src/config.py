import os
import secrets
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))

# Railway 볼륨은 DATA_DIR=/data 환경변수로 지정, 로컬은 기본값 사용
_data_dir = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
DB_PATH = _data_dir / "clinote.db"
STATIC_DIR = BASE_DIR / "static"

TOKEN_EXPIRE = 60 * 60 * 24 * 30  # 30일

# Kakao OAuth
KAKAO_CLIENT_ID = os.getenv("KAKAO_CLIENT_ID", "")
KAKAO_CLIENT_SECRET = os.getenv("KAKAO_CLIENT_SECRET", "")
KAKAO_REDIRECT_URI = os.getenv(
    "KAKAO_REDIRECT_URI",
    "http://localhost:8003/api/auth/kakao/callback",
)
