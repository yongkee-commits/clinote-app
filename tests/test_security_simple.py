"""
보안 기능 간단 테스트
"""
import pytest
from src.security import CSRFProtection, XSSProtection, InputValidator, BruteForceProtection


# ── CSRF 토큰 테스트 ───────────────────────────────────

def test_csrf_token_generation():
    """CSRF 토큰 생성 테스트"""
    csrf = CSRFProtection("test-secret")
    token = csrf.generate_token("session123")
    assert token is not None
    assert len(token) > 20


def test_csrf_token_validation():
    """CSRF 토큰 검증 테스트"""
    csrf = CSRFProtection("test-secret")
    token = csrf.generate_token("session123")
    assert csrf.validate_token(token) is True


def test_csrf_token_invalid():
    """잘못된 CSRF 토큰 테스트"""
    csrf = CSRFProtection("test-secret")
    assert csrf.validate_token("invalid-token") is False


# ── XSS 방어 테스트 ────────────────────────────────────

def test_xss_sanitize_script():
    """XSS 스크립트 제거 테스트"""
    malicious = "<script>alert('xss')</script>안녕하세요"
    sanitized = XSSProtection.sanitize(malicious, strip=True)
    assert "<script>" not in sanitized
    assert "안녕하세요" in sanitized


def test_xss_sanitize_onerror():
    """XSS onerror 속성 제거 테스트"""
    malicious = '<img src=x onerror="alert(1)">'
    sanitized = XSSProtection.sanitize(malicious, strip=True)
    assert "onerror" not in sanitized


def test_xss_sanitize_javascript():
    """XSS javascript: 제거 테스트"""
    malicious = '<a href="javascript:alert(1)">클릭</a>'
    sanitized = XSSProtection.sanitize(malicious, strip=True)
    assert "javascript:" not in sanitized


# ── URL 검증 (SSRF 방어) ───────────────────────────────

def test_validate_url_valid():
    """정상 URL 검증"""
    assert InputValidator.validate_url("https://example.com") is True
    assert InputValidator.validate_url("http://example.com/path") is True


def test_validate_url_localhost():
    """localhost 차단 테스트"""
    assert InputValidator.validate_url("http://localhost") is False
    assert InputValidator.validate_url("http://127.0.0.1") is False
    assert InputValidator.validate_url("http://0.0.0.0") is False


def test_validate_url_private_ip():
    """프라이빗 IP 차단 테스트"""
    assert InputValidator.validate_url("http://10.0.0.1") is False
    assert InputValidator.validate_url("http://192.168.1.1") is False
    assert InputValidator.validate_url("http://172.16.0.1") is False


def test_validate_url_invalid_scheme():
    """잘못된 스킴 차단 테스트"""
    assert InputValidator.validate_url("file:///etc/passwd") is False
    assert InputValidator.validate_url("ftp://example.com") is False


def test_validate_url_empty():
    """빈 URL 허용 테스트"""
    assert InputValidator.validate_url("") is True


# ── 전화번호 검증 ──────────────────────────────────────

def test_validate_phone_valid():
    """정상 전화번호 검증"""
    assert InputValidator.validate_phone("010-1234-5678") is True
    assert InputValidator.validate_phone("01012345678") is True
    assert InputValidator.validate_phone("02-1234-5678") is True


def test_validate_phone_invalid():
    """잘못된 전화번호 차단"""
    assert InputValidator.validate_phone("1234") is False
    assert InputValidator.validate_phone("abc") is False


# ── Brute Force 방어 ───────────────────────────────────

def test_brute_force_lockout():
    """브루트포스 잠금 테스트"""
    bf = BruteForceProtection(max_attempts=3, lockout_duration=60)

    # 3회 실패
    for _ in range(3):
        bf.record_failed_attempt("test-user")

    # 잠금 확인
    assert bf.is_locked_out("test-user") is True


def test_brute_force_reset():
    """브루트포스 리셋 테스트"""
    bf = BruteForceProtection(max_attempts=3, lockout_duration=60)

    bf.record_failed_attempt("test-user")
    bf.record_failed_attempt("test-user")

    # 리셋
    bf.reset("test-user")

    # 잠금 해제 확인
    assert bf.is_locked_out("test-user") is False


def test_brute_force_different_users():
    """다른 사용자 독립적 테스트"""
    bf = BruteForceProtection(max_attempts=3, lockout_duration=60)

    for _ in range(3):
        bf.record_failed_attempt("user1")

    assert bf.is_locked_out("user1") is True
    assert bf.is_locked_out("user2") is False


# ── 문자열 길이 검증 ───────────────────────────────────

def test_string_length_validation():
    """문자열 길이 검증"""
    assert InputValidator.validate_string_length("test", 0, 10) is True
    assert InputValidator.validate_string_length("test", 5, 10) is False
    assert InputValidator.validate_string_length("a" * 100, 0, 50) is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
