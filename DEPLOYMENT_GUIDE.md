# Clinote 보안 강화 배포 가이드

## ⚠️ 중요 안내

보안 강화 버전은 **새로운 파일**로 구현되었습니다.
기존 `src/server.py`를 유지하면서 보안 기능을 검토할 수 있습니다.

---

## 📋 배포 방법

### 옵션 1: 기존 서버 교체 (권장)

```bash
# 1. 백업
cp src/server.py src/server_legacy.py

# 2. 보안 강화 서버로 교체
cp src/server_secure.py src/server.py

# 3. 환경변수 설정
# .env 파일에 추가
cat >> .env << 'EOF'

# Security Settings
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_ENABLED=true
CSRF_ENABLED=true
ADMIN_KAKAO_ID=your-kakao-id-here

EOF

# 4. 테스트 실행
source ../.venv/bin/activate
python -m pytest tests/test_security_simple.py -v

# 5. 서버 재시작
./run.sh
```

### 옵션 2: 점진적 통합

기존 `src/server.py`에 보안 기능을 하나씩 추가:

```python
# src/server.py 상단에 추가

from src.security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    get_cors_config
)
from src.audit import AuditLogger, AuditAction

# 미들웨어 추가
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)

# CORS 업데이트
app.add_middleware(
    CORSMiddleware,
    **get_cors_config(["http://localhost:8003"])
)

# Startup 이벤트에 추가
@app.on_event("startup")
async def startup():
    init_db()
    delete_expired_sessions()
    AuditLogger.init_audit_table()  # 추가
    AuditLogger.cleanup_old_logs()  # 추가
```

---

## 🔍 보안 기능 확인

### 1. 보안 헤더 확인
```bash
# 서버 실행 후
curl -I http://localhost:8003/

# 확인할 헤더:
# - Content-Security-Policy
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - X-XSS-Protection: 1; mode=block
```

### 2. Rate Limiting 테스트
```bash
# 100회 연속 요청으로 rate limit 트리거
for i in {1..110}; do
  curl http://localhost:8003/api/popup
done

# 100회 이후 429 응답 확인
```

### 3. SSRF 방어 테스트
```python
# Python에서 테스트
from src.security import InputValidator

# 차단되어야 함
assert InputValidator.validate_url("http://localhost") == False
assert InputValidator.validate_url("http://127.0.0.1") == False
assert InputValidator.validate_url("http://192.168.1.1") == False

# 허용되어야 함
assert InputValidator.validate_url("https://example.com") == True
```

### 4. XSS 방어 테스트
```python
from src.security import XSSProtection

malicious = "<script>alert('xss')</script>안녕하세요"
clean = XSSProtection.sanitize(malicious, strip=True)
print(clean)  # "안녕하세요" (스크립트 제거됨)
```

### 5. Audit Log 확인
```bash
# SQLite에서 로그 확인
sqlite3 data/clinote.db "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;"

# 또는 관리자 API 사용
curl -H "Authorization: Bearer <admin-token>" \
  http://localhost:8003/api/admin/audit-logs
```

---

## 🚀 프로덕션 배포

### Railway 배포 시

1. **환경변수 설정** (Railway Dashboard)
```
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourapp.railway.app
RATE_LIMIT_ENABLED=true
CSRF_ENABLED=true
ADMIN_KAKAO_ID=<your-kakao-id>
SECRET_KEY=<generate-random-64-hex>
```

2. **Git Push**
```bash
git add .
git commit -m "feat: 보안 강화 적용"
git push origin main
```

3. **배포 확인**
```bash
# HTTPS 확인
curl -I https://yourapp.railway.app/

# HSTS 헤더 확인 (HTTPS에서만 적용)
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## ✅ 배포 후 체크리스트

### 필수 확인 사항

- [ ] **보안 헤더**: CSP, X-Frame-Options, X-Content-Type-Options
- [ ] **HTTPS**: HSTS 헤더 적용 확인
- [ ] **CORS**: Wildcard(*) 사용하지 않음
- [ ] **Rate Limiting**: 과도한 요청 차단 확인
- [ ] **인증**: 미인증 요청 401 반환
- [ ] **Audit Log**: 주요 액션 기록 확인
- [ ] **에러 처리**: 상세 에러 노출 차단
- [ ] **데이터베이스**: 파일 권한 600 (owner만 r/w)

### 보안 점검 명령어

```bash
# 1. 보안 헤더 전체 확인
curl -v https://yourapp.railway.app/ 2>&1 | grep -E "(csp|x-frame|x-content-type|x-xss|strict-transport)"

# 2. CORS 설정 확인
curl -X OPTIONS https://yourapp.railway.app/api/me \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: GET"

# 3. 인증 체크
curl https://yourapp.railway.app/api/me
# 예상 응답: {"detail": "인증이 필요합니다"} (401)

# 4. 관리자 권한 체크
curl https://yourapp.railway.app/api/admin/stats
# 예상 응답: 401 또는 403
```

---

## 📊 모니터링 설정

### Audit Log 정기 점검 (관리자)

```python
# 매일 보안 이벤트 확인 스크립트
import requests

ADMIN_TOKEN = "your-admin-token"
API_URL = "https://yourapp.railway.app"

response = requests.get(
    f"{API_URL}/api/admin/security-events?hours=24",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}
)

events = response.json()["items"]
print(f"최근 24시간 보안 이벤트: {len(events)}건")

# 경고 대상
for event in events:
    if event["action"] == "RATE_LIMIT_EXCEEDED":
        print(f"⚠️  Rate limit 초과: IP {event['ip_address']}")
    elif event["action"] == "LOGIN_FAILED":
        print(f"⚠️  로그인 실패: IP {event['ip_address']}")
```

### 로그 보관 정책

```python
# cleanup_audit_logs.py - 월 1회 실행
from src.audit import AuditLogger

# 90일 이상 된 로그 삭제
AuditLogger.cleanup_old_logs(days=90)
print("Audit log cleanup completed")
```

---

## 🔄 Secret Key Rotation (분기별)

```bash
# 1. 새 키 생성
python -c "import secrets; print(secrets.token_hex(32))"
# 출력: a1b2c3d4e5f6...

# 2. Railway 환경변수 업데이트
OLD_SECRET_KEYS=<현재-SECRET_KEY>
SECRET_KEY=<새로-생성한-키>

# 3. 배포
# 자동으로 재배포됨

# 4. 기존 사용자 세션 유지
# OLD_SECRET_KEYS로 검증 가능 (30일간)

# 5. 30일 후 OLD_SECRET_KEYS 제거
OLD_SECRET_KEYS=
```

---

## 🐛 트러블슈팅

### 문제 1: 보안 헤더가 적용되지 않음

**원인**: `server_secure.py`가 아닌 기존 `server.py`를 사용 중

**해결**:
```bash
# 현재 서버 파일 확인
head -5 src/server.py

# SecurityHeadersMiddleware가 없으면
cp src/server_secure.py src/server.py
```

### 문제 2: Rate Limiting이 작동하지 않음

**원인**: slowapi 패키지 미설치

**해결**:
```bash
pip install slowapi
# 또는
pip install -r requirements.txt
```

### 문제 3: CORS 에러 발생

**원인**: ALLOWED_ORIGINS 설정 누락

**해결**:
```bash
# .env에 추가
ALLOWED_ORIGINS=https://yourapp.railway.app,https://www.yourapp.com
```

### 문제 4: Audit Log 테이블 없음

**원인**: DB 초기화 누락

**해결**:
```python
# Python에서 실행
from src.audit import AuditLogger
AuditLogger.init_audit_table()
```

---

## 📞 지원

### 보안 문의
- 보안 취약점 발견 시: security@yourdomain.com
- 일반 문의: support@yourdomain.com

### 참고 문서
- [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) - 전체 보안 항목 설명
- [requirements.txt](./requirements.txt) - 보안 패키지 목록
- [tests/test_security_simple.py](./tests/test_security_simple.py) - 보안 테스트

---

## 📈 다음 단계

### 1. 추가 보안 강화
- [ ] Redis 기반 Session Store
- [ ] Celery 기반 비동기 작업
- [ ] WAF (Cloudflare) 적용
- [ ] MFA (2단계 인증)
- [ ] 암호화된 DB 백업

### 2. 컴플라이언스
- [ ] GDPR 대응 (개인정보 처리방침)
- [ ] 의료법 준수 (의료광고 관련)
- [ ] 정보보호 관리체계 (ISMS)

### 3. 성능 최적화
- [ ] Redis 캐싱
- [ ] CDN 적용
- [ ] 이미지 최적화
- [ ] DB 인덱싱

---

**마지막 업데이트**: 2026-02-24
**버전**: 2.0.0 (보안 강화)
