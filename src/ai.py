from typing import AsyncIterator
import anthropic
from src.config import ANTHROPIC_API_KEY

client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

TONE_LABELS = {
    "formal": "정중하고 공식적인 말투 (존댓말, 격식체)",
    "friendly": "친근하고 따뜻한 말투 (존댓말이지만 부드럽게)",
    "professional": "전문적이고 신뢰감 있는 말투 (의료 전문가 톤)",
}


def _build_system_prompt(clinic: dict) -> str:
    tone_desc = TONE_LABELS.get(clinic.get("tone", "formal"), TONE_LABELS["formal"])
    forbidden = clinic.get("forbidden_words", [])
    forbidden_str = ", ".join(forbidden) if forbidden else "없음"
    emphasis = clinic.get("emphasis", "").strip() or "없음"

    return f"""당신은 {clinic.get('name', '병원')} {clinic.get('specialty', '치과')}의 온라인 리뷰 답변 담당자입니다.

병원 정보:
- 원장: {clinic.get('doctor_name', '') or '원장님'}
- 진료과목: {clinic.get('specialty', '치과')}
- 말투: {tone_desc}
- 강조 사항: {emphasis}
- 절대 사용 금지 단어: {forbidden_str}

답변 작성 규칙:
1. 금지 단어를 절대 사용하지 마세요
2. 150~250자 사이로 작성하세요
3. 의료광고 가이드라인 준수 (치료 효과 과장 금지, 비교 광고 금지)
4. 별점이 낮은 경우(1~2점) 진심 어린 사과와 개선 의지를 담아주세요
5. 별점이 높은 경우(4~5점) 감사함과 지속적인 서비스 다짐을 담아주세요
6. 환자 개인정보(이름, 치료 내용 등)를 언급하지 마세요
7. 답변 텍스트만 출력하세요 (설명, 접두어 없이)
8. 마크다운 문법을 절대 사용하지 마세요 — #, ##, **, *, _, ~~, ``` 등 금지"""


def _build_user_prompt(review_text: str, rating: int | None) -> str:
    rating_str = f"별점: {rating}점\n" if rating is not None else ""
    return f"{rating_str}리뷰 내용:\n{review_text}"


async def stream_review_reply(clinic: dict, review_text: str, rating: int | None) -> AsyncIterator[str]:
    system_prompt = _build_system_prompt(clinic)
    user_prompt = _build_user_prompt(review_text, rating)

    async with client.messages.stream(
        model="claude-sonnet-4-5-20250929",
        max_tokens=500,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


TEMPLATE_PROMPTS = {
    "first_visit": {
        "label": "초진 환자 내원 안내 문자",
        "instruction": "초진 환자에게 보낼 내원 안내 문자를 작성하세요. 친근하지만 전문적인 톤으로, 80~120자 이내로 작성하세요.",
        "fields": ["appt_date", "note"],
    },
    "after_care": {
        "label": "치료 후 주의사항 안내문",
        "instruction": "치료 후 환자에게 보낼 주의사항 안내문을 작성하세요. '1. 2. 3.' 숫자 번호 목록으로 핵심 주의사항 3~5가지를 작성하세요. 마크다운(#, **, * 등) 절대 금지.",
        "fields": ["treatment", "note"],
    },
    "recall": {
        "label": "재내원 유도 문자",
        "instruction": "정기 내원을 권유하는 문자를 작성하세요. 부담스럽지 않고 건강을 진심으로 걱정하는 톤으로, 80~120자 이내로 작성하세요.",
        "fields": ["interval", "service"],
    },
    "noshow": {
        "label": "노쇼 방지 예약 리마인더",
        "instruction": "예약 리마인더 문자를 작성하세요. 짧고 명확하게, 예약 정보와 변경/취소 방법을 포함해서 70~100자로 작성하세요.",
        "fields": ["appt_date", "treatment"],
    },
    "holiday": {
        "label": "휴진 공지",
        "instruction": "휴진 공지문을 작성하세요. 채널이 인스타그램인 경우 이모지와 해시태그를 포함하고, 카카오/문자는 간결하게 작성하세요. 불편을 드려 죄송하다는 내용과 정상 진료 재개일을 명확히 포함하세요.",
        "fields": ["date_range", "reason", "resume_date", "channel"],
    },
    "sns": {
        "label": "SNS 캡션",
        "instruction": "SNS 게시물 캡션을 작성하세요. 인스타그램인 경우 이모지와 진료과목에 맞는 해시태그를 포함하고, 블로그인 경우 SEO를 고려한 자연스러운 문체로 작성하세요. 병원의 전문성과 친근함이 동시에 느껴지도록 작성하세요.",
        "fields": ["topic", "platform", "note"],
    },
}


def _build_template_prompt(clinic: dict, template_type: str, params: dict) -> tuple[str, str]:
    tmpl = TEMPLATE_PROMPTS.get(template_type)
    if not tmpl:
        raise ValueError(f"알 수 없는 템플릿 유형: {template_type}")

    tone_desc = TONE_LABELS.get(clinic.get("tone", "formal"), TONE_LABELS["formal"])
    emphasis = clinic.get("emphasis", "").strip() or "없음"

    contact_parts = []
    if clinic.get("phone"):
        contact_parts.append(f"- 전화번호: {clinic['phone']}")
    if clinic.get("address"):
        contact_parts.append(f"- 주소: {clinic['address']}")
    if clinic.get("open_hours"):
        contact_parts.append(f"- 진료시간: {clinic['open_hours']}")
    if clinic.get("naver_map_url"):
        contact_parts.append(f"- 네이버 지도: {clinic['naver_map_url']}")
    if clinic.get("instagram_url"):
        contact_parts.append(f"- 인스타그램: {clinic['instagram_url']}")
    if clinic.get("kakao_channel"):
        contact_parts.append(f"- 카카오 채널: {clinic['kakao_channel']}")
    contact_block = "\n".join(contact_parts) if contact_parts else "- (연락처 미등록)"

    system = f"""당신은 {clinic.get('name', '병원')} {clinic.get('specialty', '치과')}의 콘텐츠 작성 담당자입니다.

병원 정보:
- 원장: {clinic.get('doctor_name', '') or '원장님'}
- 진료과목: {clinic.get('specialty', '치과')}
- 말투: {tone_desc}
- 강조 사항: {emphasis}

병원 연락처:
{contact_block}

규칙:
1. 병원명과 진료과목에 맞는 전문적인 내용으로 작성하세요
2. 의료광고 가이드라인을 준수하세요 (치료 효과 과장 금지)
3. 텍스트만 출력하세요 (설명, 접두어 없이)
4. 마크다운 문법을 절대 사용하지 마세요 — #, ##, **, *, _, ~~, ``` 등 금지
5. SNS 캡션 외에는 이모지도 사용하지 마세요
6. 목록은 숫자(1. 2. 3.)나 · 기호를 사용하세요
7. 전화번호·주소·진료시간 등 연락처 정보가 있으면 콘텐츠에 자연스럽게 포함하세요

작성 유형: {tmpl['label']}
작성 지침: {tmpl['instruction']}"""

    # Build user prompt from params
    param_lines = []
    for field in tmpl["fields"]:
        val = params.get(field, "").strip()
        if val:
            param_lines.append(f"- {field}: {val}")

    user = f"다음 정보를 바탕으로 작성해주세요:\n" + "\n".join(param_lines) if param_lines else "위 지침에 따라 작성해주세요."
    return system, user


async def stream_template(clinic: dict, template_type: str, params: dict) -> AsyncIterator[str]:
    system_prompt, user_prompt = _build_template_prompt(clinic, template_type, params)

    async with client.messages.stream(
        model="claude-sonnet-4-5-20250929",
        max_tokens=800,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    ) as stream:
        async for text in stream.text_stream:
            yield text
