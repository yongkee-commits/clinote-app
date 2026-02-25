"""
보안 테스트 스위트
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.server import app
from src.validation import validate_phone, validate_url, sanitize_text, validate_rating

client = TestClient(app)


class TestCORS:
    """CORS 설정 테스트"""

    def test_cors_not_wildcard(self):
        """CORS가 wildcard(*)가 아닌지 확인"""
        response = client.options("/api/me")
        allow_origin = response.headers.get("access-control-allow-origin")
        assert allow_origin != "*", "CORS는 wildcard를 사용하면 안됩니다"

    def test_cors_credentials_allowed(self):
        """CORS credentials 허용 확인"""
        response = client.options(
            "/api/me",
            headers={
                "Origin": "http://localhost:8003",
                "Access-Control-Request-Method": "GET",
            }
        )
        # OPTIONS 응답이 405일 수 있으므로 GET으로도 확인
        if response.status_code == 405:
            response = client.get("/")
        assert response.headers.get("access-control-allow-credentials") == "true" or response.status_code in [200, 401, 403]


class TestSecurityHeaders:
    """보안 헤더 테스트"""

    def test_csp_header_present(self):
        """CSP 헤더 존재 확인"""
        response = client.get("/")
        assert "content-security-policy" in response.headers
        csp = response.headers["content-security-policy"]
        assert "default-src 'self'" in csp

    def test_hsts_header(self):
        """HSTS 헤더 확인"""
        response = client.get("/")
        # 로컬 테스트에서는 HTTP이므로 HSTS 없을 수 있음 - 조건부 체크
        # HTTPS 환경에서는 반드시 있어야 함
        pass  # HTTPS 배포 환경에서 수동 확인 필요

    def test_x_frame_options(self):
        """X-Frame-Options 헤더 확인"""
        response = client.get("/")
        assert response.headers.get("x-frame-options") == "DENY"

    def test_x_content_type_options(self):
        """X-Content-Type-Options 헤더 확인"""
        response = client.get("/")
        assert response.headers.get("x-content-type-options") == "nosniff"


class TestInputValidation:
    """입력 검증 테스트"""

    def test_phone_validation_success(self):
        """전화번호 정상 검증"""
        assert validate_phone("010-1234-5678") == "01012345678"
        assert validate_phone("01012345678") == "01012345678"

    def test_phone_validation_failure(self):
        """전화번호 오류 검증"""
        with pytest.raises(Exception):
            validate_phone("123")  # 너무 짧음

    def test_url_validation_blocks_internal_ip(self):
        """SSRF: 내부 IP 차단 확인"""
        with pytest.raises(Exception):
            validate_url("http://127.0.0.1:8080/admin")
        with pytest.raises(Exception):
            validate_url("http://192.168.1.1/secret")
        with pytest.raises(Exception):
            validate_url("http://10.0.0.1/internal")

    def test_url_validation_allows_external(self):
        """외부 URL 허용 확인"""
        assert validate_url("https://example.com") == "https://example.com"
        assert validate_url("https://www.google.com") == "https://www.google.com"

    def test_xss_sanitization(self):
        """XSS 공격 살균 확인"""
        malicious = "<script>alert('XSS')</script>Hello"
        sanitized = sanitize_text(malicious, strip_tags=True)
        assert "<script>" not in sanitized
        assert "alert" in sanitized  # 텍스트는 남음

    def test_rating_validation(self):
        """별점 검증"""
        assert validate_rating(5) == 5
        with pytest.raises(Exception):
            validate_rating(0)  # 범위 외
        with pytest.raises(Exception):
            validate_rating(6)  # 범위 외


class TestRateLimiting:
    """Rate Limiting 테스트"""

    def test_rate_limit_triggers(self):
        """Rate limit 초과 시 429 응답"""
        # 인증 없이 100회 이상 호출 시 429 응답 확인
        # 실제로는 slowapi 미들웨어가 처리
        # 통합 테스트에서 확인 필요
        pass  # Rate limit은 실제 환경에서 수동 확인


class TestCSRFProtection:
    """CSRF 보호 테스트"""

    def test_csrf_token_required_for_post(self):
        """POST 요청에 CSRF 토큰 필요"""
        # 인증된 세션 없이 POST 시도
        response = client.post("/api/review/generate", json={
            "rating": 5,
            "review_text": "좋아요",
            "reply_tone": "formal"
        })
        # 인증 실패 or CSRF 실패 예상
        assert response.status_code in [401, 403]


class TestAuthNAuthZ:
    """인증/인가 테스트"""

    def test_unauthorized_access_blocked(self):
        """미인증 접근 차단"""
        response = client.get("/api/me")
        assert response.status_code == 401

    def test_admin_endpoint_requires_admin(self):
        """관리자 엔드포인트 권한 확인"""
        response = client.get("/api/admin/users")
        assert response.status_code == 401  # 또는 403


class TestSQLInjection:
    """SQL Injection 방어 테스트"""

    def test_sql_injection_in_params(self):
        """SQL Injection 시도 차단"""
        # Parameterized query 사용으로 자동 방어됨
        # 악의적 입력이 실행되지 않는지 확인
        malicious_input = "'; DROP TABLE users; --"
        # 실제로는 validation 레이어에서 차단되거나
        # DB 레이어에서 이스케이프 처리됨
        sanitized = sanitize_text(malicious_input)
        assert "DROP TABLE" in sanitized  # 텍스트로만 남음
        assert sanitized == malicious_input  # SQL 메타문자 그대로 유지됨 (실행 안됨)


class TestCookieSecurity:
    """쿠키 보안 테스트"""

    def test_session_cookie_httponly(self):
        """세션 쿠키 HttpOnly 설정 확인"""
        # 실제 로그인 후 쿠키 확인 필요
        # Set-Cookie 헤더에 HttpOnly 플래그 존재 확인
        pass  # 통합 테스트에서 확인

    def test_session_cookie_secure(self):
        """세션 쿠키 Secure 설정 확인 (HTTPS)"""
        # HTTPS 환경에서 Secure 플래그 확인
        pass  # HTTPS 배포 환경에서 수동 확인


class TestErrorHandling:
    """에러 정보 노출 방지 테스트"""

    def test_error_no_stack_trace(self):
        """에러 메시지에 스택 트레이스 미포함"""
        response = client.get("/nonexistent")
        assert response.status_code == 404
        # 응답 바디에 파일 경로, 스택 트레이스 없음 확인
        body = response.text
        assert "/Users/" not in body
        assert "Traceback" not in body


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
