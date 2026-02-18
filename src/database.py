import json
import sqlite3
from contextlib import contextmanager
from src.config import DB_PATH


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS clinic (
                id INTEGER PRIMARY KEY DEFAULT 1,
                name TEXT NOT NULL DEFAULT '',
                specialty TEXT NOT NULL DEFAULT '치과',
                doctor_name TEXT DEFAULT '',
                tone TEXT NOT NULL DEFAULT 'formal',
                forbidden_words TEXT DEFAULT '[]',
                emphasis TEXT DEFAULT '',
                updated_at TEXT DEFAULT (datetime('now', 'localtime'))
            );

            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL DEFAULT 'naver',
                rating INTEGER DEFAULT NULL,
                original_text TEXT NOT NULL,
                reply_text TEXT DEFAULT '',
                created_at TEXT DEFAULT (datetime('now', 'localtime'))
            );
        """)
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


def _row(row) -> dict | None:
    if row is None:
        return None
    d = dict(row)
    if "forbidden_words" in d and d["forbidden_words"]:
        try:
            d["forbidden_words"] = json.loads(d["forbidden_words"])
        except Exception:
            d["forbidden_words"] = []
    return d


# ── Clinic ────────────────────────────────────────────────

def get_clinic() -> dict:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM clinic WHERE id = 1").fetchone()
        if row is None:
            conn.execute(
                "INSERT OR IGNORE INTO clinic (id) VALUES (1)"
            )
            row = conn.execute("SELECT * FROM clinic WHERE id = 1").fetchone()
        return _row(row)


def save_clinic(name: str, specialty: str, doctor_name: str,
                tone: str, forbidden_words: list, emphasis: str) -> dict:
    fw_json = json.dumps(forbidden_words, ensure_ascii=False)
    with _connect() as conn:
        conn.execute("""
            INSERT INTO clinic (id, name, specialty, doctor_name, tone, forbidden_words, emphasis, updated_at)
            VALUES (1, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                specialty = excluded.specialty,
                doctor_name = excluded.doctor_name,
                tone = excluded.tone,
                forbidden_words = excluded.forbidden_words,
                emphasis = excluded.emphasis,
                updated_at = excluded.updated_at
        """, (name, specialty, doctor_name, tone, fw_json, emphasis))
    return get_clinic()


# ── Reviews ───────────────────────────────────────────────

def create_review(platform: str, rating: int | None, original_text: str) -> int:
    with _connect() as conn:
        cur = conn.execute(
            "INSERT INTO reviews (platform, rating, original_text) VALUES (?, ?, ?)",
            (platform, rating, original_text)
        )
        return cur.lastrowid


def update_review_reply(review_id: int, reply_text: str):
    with _connect() as conn:
        conn.execute(
            "UPDATE reviews SET reply_text = ? WHERE id = ?",
            (reply_text, review_id)
        )


def list_reviews(limit: int = 20, offset: int = 0) -> list[dict]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM reviews ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (limit, offset)
        ).fetchall()
        return [dict(r) for r in rows]


def delete_review(review_id: int):
    with _connect() as conn:
        conn.execute("DELETE FROM reviews WHERE id = ?", (review_id,))


def count_reviews() -> int:
    with _connect() as conn:
        row = conn.execute("SELECT COUNT(*) FROM reviews").fetchone()
        return row[0] if row else 0
