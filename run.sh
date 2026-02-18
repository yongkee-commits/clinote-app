#!/bin/bash
cd "$(dirname "$0")"

# .env 확인
if [ ! -f .env ]; then
    echo "❌ .env 파일이 없습니다. .env.example을 복사해서 설정하세요."
    echo "   cp .env.example .env"
    exit 1
fi

# ANTHROPIC_API_KEY 확인
if ! grep -q "ANTHROPIC_API_KEY=sk-" .env 2>/dev/null; then
    echo "❌ .env에 ANTHROPIC_API_KEY가 설정되지 않았습니다."
    exit 1
fi

# venv 활성화
if [ -d "../.venv" ]; then
    source ../.venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "🔧 venv 생성 중..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -q -r requirements.txt
fi

# 의존성 확인
python3 -c "import fastapi, anthropic" 2>/dev/null || {
    echo "📦 패키지 설치 중..."
    pip install -q -r requirements.txt
}

# 로컬 IP 표시
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo ""
echo "🏥 Clinote 시작 중..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   로컬:   http://localhost:8003"
echo "   네트워크: http://${LOCAL_IP}:8003"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 -m uvicorn src.server:app --host 0.0.0.0 --port 8003 --reload
