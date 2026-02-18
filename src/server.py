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
    create_template_record, update_template_output,
    list_templates, delete_template_record, count_templates,
)
from src.ai import stream_review_reply, stream_template, TEMPLATE_PROMPTS
from src.sms import send_sms

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
    clinic = get_clinic()
    # API secret은 존재 여부만 반환 (값 노출 방지)
    clinic["solapi_api_secret"] = "SET" if clinic.get("solapi_api_secret") else ""
    return clinic


class ClinicBody(BaseModel):
    name: str
    specialty: str = "치과"
    doctor_name: str = ""
    tone: str = "formal"
    forbidden_words: list[str] = []
    emphasis: str = ""
    phone: str = ""
    naver_map_url: str = ""
    instagram_url: str = ""
    kakao_channel: str = ""
    solapi_api_key: str = ""
    solapi_api_secret: str | None = None  # None이면 기존 값 유지
    solapi_sender: str = ""


@app.put("/api/clinic")
async def api_save_clinic(body: ClinicBody, _=Depends(require_auth)):
    return save_clinic(
        name=body.name,
        specialty=body.specialty,
        doctor_name=body.doctor_name,
        tone=body.tone,
        forbidden_words=body.forbidden_words,
        emphasis=body.emphasis,
        phone=body.phone,
        naver_map_url=body.naver_map_url,
        instagram_url=body.instagram_url,
        kakao_channel=body.kakao_channel,
        solapi_api_key=body.solapi_api_key,
        solapi_api_secret=body.solapi_api_secret,  # None이면 save_clinic에서 기존 값 유지
        solapi_sender=body.solapi_sender,
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
    tmpl_info = TEMPLATE_PROMPTS.get(body.template_type)
    if not tmpl_info:
        raise HTTPException(status_code=400, detail="알 수 없는 템플릿 유형")

    template_id = create_template_record(
        template_type=body.template_type,
        label=tmpl_info["label"],
        params=body.params,
    )
    full_text = []

    async def event_stream():
        try:
            async for chunk in stream_template(clinic, body.template_type, body.params):
                full_text.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"
            output = "".join(full_text)
            update_template_output(template_id, output)
            yield f"data: {json.dumps({'done': True, 'template_id': template_id}, ensure_ascii=False)}\n\n"
        except ValueError as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Template history ──────────────────────────────────────

@app.get("/api/templates")
async def api_list_templates(limit: int = 20, offset: int = 0, _=Depends(require_auth)):
    return {
        "items": list_templates(limit, offset),
        "total": count_templates(),
    }


@app.delete("/api/templates/{template_id}")
async def api_delete_template(template_id: int, _=Depends(require_auth)):
    delete_template_record(template_id)
    return {"ok": True}


# ── SMS send ──────────────────────────────────────────────

class SmsBody(BaseModel):
    receiver: str
    text: str


@app.post("/api/sms/send")
async def api_send_sms(body: SmsBody, _=Depends(require_auth)):
    clinic = get_clinic()
    api_key = clinic.get("solapi_api_key", "")
    api_secret = clinic.get("solapi_api_secret", "")
    sender = clinic.get("solapi_sender", "")

    if not api_key or not api_secret or not sender:
        raise HTTPException(status_code=400, detail="솔라피 설정이 필요합니다 (API Key / Secret / 발신번호)")

    try:
        result = await send_sms(api_key, api_secret, sender, body.receiver, body.text)
        return {"ok": True, "result": result}
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))


# ── SPA fallback ──────────────────────────────────────────

@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "index.html"))
