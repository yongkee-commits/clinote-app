import json
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from src.auth import check_password, get_token, is_blocked, record_fail, require_auth
from src.config import STATIC_DIR
from src.database import (
    init_db, get_clinic, save_clinic,
    create_review, update_review_reply,
    list_reviews, delete_review, count_reviews,
)
from src.ai import stream_review_reply, stream_template

app = FastAPI(title="Clinote")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.on_event("startup")
async def startup():
    init_db()


# ── Auth ──────────────────────────────────────────────────

class LoginBody(BaseModel):
    password: str


@app.post("/api/login")
async def api_login(body: LoginBody, request: Request):
    if is_blocked(request):
        raise HTTPException(status_code=429, detail="잠시 후 다시 시도하세요")
    if not check_password(body.password):
        record_fail(request)
        raise HTTPException(status_code=401, detail="비밀번호가 올바르지 않습니다")
    return {"token": get_token()}


# ── Clinic settings ───────────────────────────────────────

@app.get("/api/clinic")
async def api_get_clinic(_=Depends(require_auth)):
    return get_clinic()


class ClinicBody(BaseModel):
    name: str
    specialty: str = "치과"
    doctor_name: str = ""
    tone: str = "formal"
    forbidden_words: list[str] = []
    emphasis: str = ""


@app.put("/api/clinic")
async def api_save_clinic(body: ClinicBody, _=Depends(require_auth)):
    return save_clinic(
        name=body.name,
        specialty=body.specialty,
        doctor_name=body.doctor_name,
        tone=body.tone,
        forbidden_words=body.forbidden_words,
        emphasis=body.emphasis,
    )


# ── Review reply ──────────────────────────────────────────

class ReviewGenerateBody(BaseModel):
    platform: str = "naver"
    rating: int | None = None
    original_text: str


@app.post("/api/review/generate")
async def api_generate_review(body: ReviewGenerateBody, _=Depends(require_auth)):
    clinic = get_clinic()
    review_id = create_review(body.platform, body.rating, body.original_text)
    full_reply = []

    async def event_stream():
        try:
            async for chunk in stream_review_reply(clinic, body.original_text, body.rating):
                full_reply.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"

            reply_text = "".join(full_reply)
            update_review_reply(review_id, reply_text)
            yield f"data: {json.dumps({'done': True, 'reply_id': review_id}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Review history ────────────────────────────────────────

@app.get("/api/reviews")
async def api_list_reviews(limit: int = 20, offset: int = 0, _=Depends(require_auth)):
    return {
        "items": list_reviews(limit, offset),
        "total": count_reviews(),
    }


@app.delete("/api/reviews/{review_id}")
async def api_delete_review(review_id: int, _=Depends(require_auth)):
    delete_review(review_id)
    return {"ok": True}


# ── Template generation ───────────────────────────────────

class TemplateBody(BaseModel):
    template_type: str
    params: dict = {}


@app.post("/api/template/generate")
async def api_generate_template(body: TemplateBody, _=Depends(require_auth)):
    clinic = get_clinic()
    full_text = []

    async def event_stream():
        try:
            async for chunk in stream_template(clinic, body.template_type, body.params):
                full_text.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"
        except ValueError as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── SPA fallback ──────────────────────────────────────────

@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "index.html"))
