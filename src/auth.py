import os
import secrets
import time
from typing import Optional
from enum import Enum
from fastapi import HTTPException, Request
from src.config import TOKEN_EXPIRE, ADMIN_KAKAO_ID


# ── 역할 정의 (RBAC) ───────────────────────────────────

class UserRole(Enum):
    """사용자 역할"""
    USER = "user"
    ADMIN = "admin"


class Permission(Enum):
    """권한 정의"""
    # 기본 권한
    READ_OWN = "read_own"
    WRITE_OWN = "write_own"
    DELETE_OWN = "delete_own"

    # 관리자 권한
    READ_ALL = "read_all"
    WRITE_ALL = "write_all"
    DELETE_ALL = "delete_all"
    MANAGE_USERS = "manage_users"
    MANAGE_SUBSCRIPTIONS = "manage_subscriptions"
    VIEW_AUDIT_LOGS = "view_audit_logs"


# 역할별 권한 매핑
ROLE_PERMISSIONS = {
    UserRole.USER: [
        Permission.READ_OWN,
        Permission.WRITE_OWN,
        Permission.DELETE_OWN,
    ],
    UserRole.ADMIN: [
        Permission.READ_OWN,
        Permission.WRITE_OWN,
        Permission.DELETE_OWN,
        Permission.READ_ALL,
        Permission.WRITE_ALL,
        Permission.DELETE_ALL,
        Permission.MANAGE_USERS,
        Permission.MANAGE_SUBSCRIPTIONS,
        Permission.VIEW_AUDIT_LOGS,
    ]
}


# ── 토큰 관리 ──────────────────────────────────────────

def create_session_token() -> tuple[str, int]:
    """세션 토큰과 만료 타임스탬프(Unix) 반환."""
    token = secrets.token_urlsafe(32)
    expires_at = int(time.time()) + TOKEN_EXPIRE
    return token, expires_at


# ── 인증 함수 ──────────────────────────────────────────

def require_auth(request: Request) -> str:
    """
    Bearer 토큰 또는 ?token= 쿼리파라미터에서 세션 토큰을 꺼내
    DB sessions 테이블을 조회한 뒤 kakao_id(str)를 반환.
    실패 시 HTTP 401.

    보안 강화:
    - Audit log 기록
    - 실패 시 상세 에러 노출 차단
    """
    from src.database import get_session  # 순환 임포트 방지
    from src.audit import AuditLogger, AuditAction

    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.query_params.get("token")

    if not token:
        AuditLogger.log_from_request(
            request, AuditAction.LOGIN_FAILED, status="failed",
            details={"reason": "no_token"}
        )
        raise HTTPException(status_code=401, detail="인증이 필요합니다")

    session = get_session(token)
    if session is None:
        AuditLogger.log_from_request(
            request, AuditAction.LOGIN_FAILED, status="failed",
            details={"reason": "invalid_session"}
        )
        raise HTTPException(status_code=401, detail="세션이 존재하지 않습니다")

    if time.time() > session["expires_at"]:
        AuditLogger.log_from_request(
            request, AuditAction.SESSION_EXPIRED, user_id=session["kakao_id"],
            status="failed"
        )
        raise HTTPException(status_code=401, detail="세션이 만료되었습니다")

    return session["kakao_id"]


def require_admin(request: Request) -> str:
    """
    어드민 전용 — ADMIN_KAKAO_ID와 일치하는 세션만 허용.

    보안 강화:
    - Audit log 기록
    - 권한 부족 시 로깅
    """
    from src.audit import AuditLogger, AuditAction

    kakao_id = require_auth(request)

    if not ADMIN_KAKAO_ID or kakao_id != ADMIN_KAKAO_ID:
        AuditLogger.log_from_request(
            request, AuditAction.PERMISSION_DENIED,
            user_id=kakao_id, status="failed",
            details={"reason": "not_admin"}
        )
        raise HTTPException(status_code=403, detail="관리자 전용입니다")

    # 관리자 액세스 로그
    AuditLogger.log_from_request(
        request, AuditAction.ADMIN_ACCESS,
        user_id=kakao_id
    )

    return kakao_id


# ── RBAC 함수 ──────────────────────────────────────────

def get_user_role(kakao_id: str) -> UserRole:
    """사용자 역할 반환"""
    if ADMIN_KAKAO_ID and kakao_id == ADMIN_KAKAO_ID:
        return UserRole.ADMIN
    return UserRole.USER


def has_permission(kakao_id: str, permission: Permission) -> bool:
    """권한 확인"""
    role = get_user_role(kakao_id)
    return permission in ROLE_PERMISSIONS.get(role, [])


def require_permission(request: Request, permission: Permission) -> str:
    """특정 권한 요구 (Dependency)"""
    from src.audit import AuditLogger, AuditAction

    kakao_id = require_auth(request)

    if not has_permission(kakao_id, permission):
        AuditLogger.log_from_request(
            request, AuditAction.PERMISSION_DENIED,
            user_id=kakao_id, status="failed",
            details={"permission": permission.value}
        )
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    return kakao_id


# ── 테넌트 격리 (Tenant Isolation) ────────────────────

def enforce_tenant_isolation(user_id: str, resource_owner_id: str):
    """
    테넌트 격리 강제
    - 사용자는 자신의 리소스만 접근 가능
    - 관리자는 모든 리소스 접근 가능
    """
    # 관리자는 모든 리소스 접근 가능
    if get_user_role(user_id) == UserRole.ADMIN:
        return

    # 일반 사용자는 본인 리소스만
    if user_id != resource_owner_id:
        raise HTTPException(
            status_code=403,
            detail="다른 사용자의 리소스에 접근할 수 없습니다"
        )


# ── 최소 권한 원칙 적용 ────────────────────────────────

def get_safe_user_info(kakao_id: str) -> dict:
    """
    안전한 사용자 정보 반환 (최소 권한 원칙)
    - 민감한 정보 제외
    """
    from src.database import get_user

    user = get_user(kakao_id)
    if not user:
        return {}

    # 민감한 정보 제외하고 반환
    return {
        "kakao_id": user.get("kakao_id"),
        "nickname": user.get("nickname"),
        "profile_image": user.get("profile_image"),
        # created_at, 기타 내부 정보는 제외
    }
