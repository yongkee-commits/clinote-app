"""
Audit Logging 시스템
"""
import json
import time
from typing import Any, Optional
from datetime import datetime
from enum import Enum

from src.config import DB_PATH


class AuditAction(Enum):
    """감사 로그 액션 유형"""
    # 인증
    LOGIN = "login"
    LOGOUT = "logout"
    LOGIN_FAILED = "login_failed"
    SESSION_EXPIRED = "session_expired"

    # 데이터 조작
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"

    # 리소스별
    REVIEW_GENERATE = "review_generate"
    TEMPLATE_GENERATE = "template_generate"
    CLINIC_UPDATE = "clinic_update"
    ACCOUNT_DELETE = "account_delete"

    # 관리자
    ADMIN_ACCESS = "admin_access"
    SUBSCRIPTION_UPDATE = "subscription_update"
    POPUP_UPDATE = "popup_update"

    # 보안
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    INVALID_INPUT = "invalid_input"
    PERMISSION_DENIED = "permission_denied"
    CSRF_VALIDATION_FAILED = "csrf_validation_failed"


class AuditLogger:
    """감사 로그 기록"""

    @staticmethod
    def init_audit_table():
        """감사 로그 테이블 초기화"""
        import sqlite3
        with sqlite3.connect(str(DB_PATH)) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
                    user_id      TEXT,
                    action       TEXT NOT NULL,
                    resource     TEXT,
                    resource_id  TEXT,
                    ip_address   TEXT,
                    user_agent   TEXT,
                    status       TEXT DEFAULT 'success',
                    details      TEXT,
                    INDEX idx_audit_user (user_id),
                    INDEX idx_audit_action (action),
                    INDEX idx_audit_timestamp (timestamp)
                )
            """)
            conn.commit()

    @staticmethod
    def log(
        action: AuditAction,
        user_id: Optional[str] = None,
        resource: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        status: str = "success",
        details: Optional[dict] = None
    ):
        """감사 로그 기록"""
        import sqlite3

        try:
            with sqlite3.connect(str(DB_PATH)) as conn:
                # User agent 길이 제한
                ua_trimmed = user_agent[:200] if user_agent else None

                # Details JSON 변환
                details_json = json.dumps(details, ensure_ascii=False) if details else None

                conn.execute("""
                    INSERT INTO audit_logs
                    (user_id, action, resource, resource_id, ip_address, user_agent, status, details)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id,
                    action.value,
                    resource,
                    resource_id,
                    ip_address,
                    ua_trimmed,
                    status,
                    details_json
                ))
                conn.commit()
        except Exception as e:
            # 로그 실패는 애플리케이션 중단하지 않음
            print(f"Audit log error: {e}")

    @staticmethod
    def log_from_request(
        request: Any,
        action: AuditAction,
        user_id: Optional[str] = None,
        resource: Optional[str] = None,
        resource_id: Optional[str] = None,
        status: str = "success",
        details: Optional[dict] = None
    ):
        """Request 객체에서 정보 추출하여 로그"""
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        AuditLogger.log(
            action=action,
            user_id=user_id,
            resource=resource,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status,
            details=details
        )

    @staticmethod
    def get_logs(
        user_id: Optional[str] = None,
        action: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> list[dict]:
        """감사 로그 조회"""
        import sqlite3

        with sqlite3.connect(str(DB_PATH)) as conn:
            conn.row_factory = sqlite3.Row

            query = "SELECT * FROM audit_logs WHERE 1=1"
            params = []

            if user_id:
                query += " AND user_id = ?"
                params.append(user_id)

            if action:
                query += " AND action = ?"
                params.append(action)

            query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            rows = conn.execute(query, params).fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_user_activity_summary(user_id: str, days: int = 30) -> dict:
        """사용자 활동 요약"""
        import sqlite3

        with sqlite3.connect(str(DB_PATH)) as conn:
            # 최근 N일간 활동
            row = conn.execute("""
                SELECT
                    COUNT(*) as total_actions,
                    SUM(CASE WHEN action = 'review_generate' THEN 1 ELSE 0 END) as reviews,
                    SUM(CASE WHEN action = 'template_generate' THEN 1 ELSE 0 END) as templates,
                    SUM(CASE WHEN action LIKE 'login%' THEN 1 ELSE 0 END) as logins,
                    MAX(timestamp) as last_activity
                FROM audit_logs
                WHERE user_id = ?
                AND timestamp > datetime('now', 'localtime', ? || ' days')
            """, (user_id, -days)).fetchone()

            if row:
                return {
                    "total_actions": row[0],
                    "reviews": row[1],
                    "templates": row[2],
                    "logins": row[3],
                    "last_activity": row[4]
                }
            return {}

    @staticmethod
    def get_security_events(hours: int = 24) -> list[dict]:
        """최근 보안 이벤트 조회"""
        import sqlite3

        security_actions = [
            AuditAction.LOGIN_FAILED.value,
            AuditAction.RATE_LIMIT_EXCEEDED.value,
            AuditAction.INVALID_INPUT.value,
            AuditAction.PERMISSION_DENIED.value,
            AuditAction.CSRF_VALIDATION_FAILED.value,
        ]

        with sqlite3.connect(str(DB_PATH)) as conn:
            conn.row_factory = sqlite3.Row

            placeholders = ','.join(['?'] * len(security_actions))
            query = f"""
                SELECT * FROM audit_logs
                WHERE action IN ({placeholders})
                AND timestamp > datetime('now', 'localtime', ? || ' hours')
                ORDER BY timestamp DESC
                LIMIT 100
            """

            rows = conn.execute(query, security_actions + [-hours]).fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def cleanup_old_logs(days: int = 90):
        """오래된 로그 정리 (데이터 보관 정책)"""
        import sqlite3

        with sqlite3.connect(str(DB_PATH)) as conn:
            conn.execute("""
                DELETE FROM audit_logs
                WHERE timestamp < datetime('now', 'localtime', ? || ' days')
            """, (-days,))
            conn.commit()


# ── Audit Decorator ────────────────────────────────────

def audit_action(action: AuditAction, resource: Optional[str] = None):
    """감사 로그 데코레이터"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Request와 user_id 추출
            request = None
            user_id = None

            for arg in args:
                if hasattr(arg, 'client'):  # Request 객체
                    request = arg
                elif isinstance(arg, str) and len(arg) < 50:  # user_id일 가능성
                    user_id = arg

            # kwargs에서도 확인
            if 'request' in kwargs:
                request = kwargs['request']
            if 'user_id' in kwargs:
                user_id = kwargs['user_id']

            # 함수 실행
            try:
                result = await func(*args, **kwargs)

                # 성공 로그
                if request:
                    resource_id = None
                    if isinstance(result, dict) and 'id' in result:
                        resource_id = str(result['id'])

                    AuditLogger.log_from_request(
                        request=request,
                        action=action,
                        user_id=user_id,
                        resource=resource,
                        resource_id=resource_id,
                        status="success"
                    )

                return result

            except Exception as e:
                # 실패 로그
                if request:
                    AuditLogger.log_from_request(
                        request=request,
                        action=action,
                        user_id=user_id,
                        resource=resource,
                        status="failed",
                        details={"error": str(e)[:200]}
                    )
                raise

        return wrapper
    return decorator
