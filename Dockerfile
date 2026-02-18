FROM python:3.12-slim

WORKDIR /app

# 의존성 먼저 설치 (캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 복사
COPY . .

# 데이터 디렉토리 생성 (볼륨 마운트 전 기본값)
RUN mkdir -p /data

EXPOSE 8080

CMD ["sh", "-c", "uvicorn src.server:app --host 0.0.0.0 --port ${PORT:-8080}"]
