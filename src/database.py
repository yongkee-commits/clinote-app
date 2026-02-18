import json
import sqlite3
import time
from contextlib import contextmanager
from typing import Any
from src.config import DB_PATH


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")

        # ── users ─────────────────────────────────────────
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                kakao_id      TEXT PRIMARY KEY,
                nickname      TEXT NOT NULL DEFAULT '',
                profile_image TEXT NOT NULL DEFAULT '',
                created_at    TEXT DEFAULT (datetime('now', 'localtime'))
            )
        """)

        # ── sessions ──────────────────────────────────────
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token      TEXT PRIMARY KEY,
                kakao_id   TEXT NOT NULL REFERENCES users(kakao_id) ON DELETE CASCADE,
                expires_at INTEGER NOT NULL
            )
        """)
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_sessions_kakao ON sessions(kakao_id)"
        )

        # ── clinic ────────────────────────────────────────
        # 기존 단일테넌트 스키마(id=1 패턴)면 DROP & REBUILD
        clinic_cols = {row[1] for row in conn.execute("PRAGMA table_info(clinic)").fetchall()}
        if clinic_cols and "user_id" not in clinic_cols:
            conn.execute("DROP TABLE IF EXISTS clinic")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS clinic (
                user_id           TEXT PRIMARY KEY REFERENCES users(kakao_id) ON DELETE CASCADE,
                name              TEXT NOT NULL DEFAULT '',
                specialty         TEXT NOT NULL DEFAULT '치과',
                doctor_name       TEXT DEFAULT '',
                tone              TEXT NOT NULL DEFAULT 'formal',
                forbidden_words   TEXT DEFAULT '[]',
                emphasis          TEXT DEFAULT '',
                phone             TEXT DEFAULT '',
                address           TEXT DEFAULT '',
                naver_map_url     TEXT DEFAULT '',
                open_hours        TEXT DEFAULT '',
                instagram_url     TEXT DEFAULT '',
                kakao_channel     TEXT DEFAULT '',
                solapi_api_key    TEXT DEFAULT '',
                solapi_api_secret TEXT DEFAULT '',
                solapi_sender     TEXT DEFAULT '',
                updated_at        TEXT DEFAULT (datetime('now', 'localtime'))
            )
        """)

        # ── reviews ───────────────────────────────────────
        conn.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id       TEXT NOT NULL DEFAULT '',
                platform      TEXT NOT NULL DEFAULT 'naver',
                rating        INTEGER DEFAULT NULL,
                original_text TEXT NOT NULL,
                reply_text    TEXT DEFAULT '',
                created_at    TEXT DEFAULT (datetime('now', 'localtime'))
            )
        """)
        review_cols = {row[1] for row in conn.execute("PRAGMA table_info(reviews)").fetchall()}
        if "user_id" not in review_cols:
            conn.execute("ALTER TABLE reviews ADD COLUMN user_id TEXT NOT NULL DEFAULT ''")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)"
        )

        # ── templates ─────────────────────────────────────
        conn.execute("""
            CREATE TABLE IF NOT EXISTS templates (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id       TEXT NOT NULL DEFAULT '',
                template_type TEXT NOT NULL,
                label         TEXT DEFAULT '',
                params        TEXT DEFAULT '{}',
                output_text   TEXT DEFAULT '',
                created_at    TEXT DEFAULT (datetime('now', 'localtime'))
            )
        """)
        tmpl_cols = {row[1] for row in conn.execute("PRAGMA table_info(templates)").fetchall()}
        if "user_id" not in tmpl_cols:
            conn.execute("ALTER TABLE templates ADD COLUMN user_id TEXT NOT NULL DEFAULT ''")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_templates_user ON templates(user_id)"
        )

        conn.commit()


@contextmanager
def _connect():
    conn = sqlite3.connect(str(DB_PATH), detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _row(row) -> dict[str, Any] | None:
    if row is None:
        return None
    d: dict[str, Any] = dict(row)
    if "forbidden_words" in d and d["forbidden_words"]:
        try:
            d["forbidden_words"] = json.loads(d["forbidden_words"])
        except Exception:
            d["forbidden_words"] = []
    return d


# ── Users ──────────────────────────────────────────────

def upsert_user(kakao_id: str, nickname: str, profile_image: str) -> dict[str, Any]:
    with _connect() as conn:
        conn.execute("""
            INSERT INTO users (kakao_id, nickname, profile_image)
            VALUES (?, ?, ?)
            ON CONFLICT(kakao_id) DO UPDATE SET
                nickname = excluded.nickname,
                profile_image = excluded.profile_image
        """, (kakao_id, nickname, profile_image))
    return {"kakao_id": kakao_id, "nickname": nickname, "profile_image": profile_image}


def get_user(kakao_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE kakao_id = ?", (kakao_id,)
        ).fetchone()
        return dict(row) if row else None


# ── Sessions ───────────────────────────────────────────

def create_session(token: str, kakao_id: str, expires_at: int):
    with _connect() as conn:
        conn.execute(
            "INSERT INTO sessions (token, kakao_id, expires_at) VALUES (?, ?, ?)",
            (token, kakao_id, expires_at)
        )


def get_session(token: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM sessions WHERE token = ?", (token,)
        ).fetchone()
        return dict(row) if row else None


def delete_session(token: str):
    with _connect() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


def delete_expired_sessions():
    with _connect() as conn:
        conn.execute(
            "DELETE FROM sessions WHERE expires_at < ?", (int(time.time()),)
        )


# ── Clinic ────────────────────────────────────────────

def get_clinic(user_id: str) -> dict[str, Any]:
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM clinic WHERE user_id = ?", (user_id,)
        ).fetchone()
        if row is None:
            conn.execute("INSERT OR IGNORE INTO clinic (user_id) VALUES (?)", (user_id,))
            row = conn.execute(
                "SELECT * FROM clinic WHERE user_id = ?", (user_id,)
            ).fetchone()
        return _row(row) or {}


def save_clinic(user_id: str, name: str, specialty: str, doctor_name: str,
                tone: str, forbidden_words: list, emphasis: str,
                phone: str = "", address: str = "",
                naver_map_url: str = "", open_hours: str = "",
                instagram_url: str = "", kakao_channel: str = "",
                solapi_api_key: str = "", solapi_api_secret: str | None = None,
                solapi_sender: str = "") -> dict[str, Any]:
    fw_json = json.dumps(forbidden_words, ensure_ascii=False)
    if solapi_api_secret is None:
        existing = get_clinic(user_id)
        solapi_api_secret = existing.get("solapi_api_secret", "")
    with _connect() as conn:
        conn.execute("""
            INSERT INTO clinic (user_id, name, specialty, doctor_name, tone, forbidden_words,
                emphasis, phone, address, naver_map_url, open_hours, instagram_url,
                kakao_channel, solapi_api_key, solapi_api_secret, solapi_sender, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
            ON CONFLICT(user_id) DO UPDATE SET
                name = excluded.name,
                specialty = excluded.specialty,
                doctor_name = excluded.doctor_name,
                tone = excluded.tone,
                forbidden_words = excluded.forbidden_words,
                emphasis = excluded.emphasis,
                phone = excluded.phone,
                address = excluded.address,
                naver_map_url = excluded.naver_map_url,
                open_hours = excluded.open_hours,
                instagram_url = excluded.instagram_url,
                kakao_channel = excluded.kakao_channel,
                solapi_api_key = excluded.solapi_api_key,
                solapi_api_secret = excluded.solapi_api_secret,
                solapi_sender = excluded.solapi_sender,
                updated_at = excluded.updated_at
        """, (user_id, name, specialty, doctor_name, tone, fw_json, emphasis,
              phone, address, naver_map_url, open_hours, instagram_url, kakao_channel,
              solapi_api_key, solapi_api_secret, solapi_sender))
    return get_clinic(user_id)


# ── Reviews ───────────────────────────────────────────

def create_review(user_id: str, platform: str, rating: int | None, original_text: str) -> int:
    with _connect() as conn:
        cur = conn.execute(
            "INSERT INTO reviews (user_id, platform, rating, original_text) VALUES (?, ?, ?, ?)",
            (user_id, platform, rating, original_text)
        )
        new_id: int = cur.lastrowid  # type: ignore[assignment]
    return new_id


def update_review_reply(review_id: int, reply_text: str):
    with _connect() as conn:
        conn.execute(
            "UPDATE reviews SET reply_text = ? WHERE id = ?",
            (reply_text, review_id)
        )


def list_reviews(user_id: str, limit: int = 20, offset: int = 0) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (user_id, limit, offset)
        ).fetchall()
    return [dict(r) for r in rows]


def delete_review(user_id: str, review_id: int):
    with _connect() as conn:
        conn.execute(
            "DELETE FROM reviews WHERE id = ? AND user_id = ?",
            (review_id, user_id)
        )


def count_reviews(user_id: str) -> int:
    with _connect() as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM reviews WHERE user_id = ?", (user_id,)
        ).fetchone()
    return row[0] if row else 0


# ── Templates ─────────────────────────────────────────

def create_template_record(user_id: str, template_type: str, label: str, params: dict) -> int:
    with _connect() as conn:
        cur = conn.execute(
            "INSERT INTO templates (user_id, template_type, label, params) VALUES (?, ?, ?, ?)",
            (user_id, template_type, label, json.dumps(params, ensure_ascii=False))
        )
        new_id: int = cur.lastrowid  # type: ignore[assignment]
    return new_id


def update_template_output(template_id: int, output_text: str):
    with _connect() as conn:
        conn.execute(
            "UPDATE templates SET output_text = ? WHERE id = ?",
            (output_text, template_id)
        )


def list_templates(user_id: str, limit: int = 20, offset: int = 0) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM templates WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (user_id, limit, offset)
        ).fetchall()
    result: list[dict[str, Any]] = []
    for r in rows:
        d: dict[str, Any] = dict(r)
        try:
            d["params"] = json.loads(d["params"])
        except Exception:
            d["params"] = {}
        result.append(d)
    return result


def delete_template_record(user_id: str, template_id: int):
    with _connect() as conn:
        conn.execute(
            "DELETE FROM templates WHERE id = ? AND user_id = ?",
            (template_id, user_id)
        )


def count_templates(user_id: str) -> int:
    with _connect() as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM templates WHERE user_id = ?", (user_id,)
        ).fetchone()
    return row[0] if row else 0
