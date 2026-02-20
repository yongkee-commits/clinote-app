import datetime
import hashlib
import hmac
import secrets

import httpx

SOLAPI_BASE = "https://api.solapi.com"


def _auth_header(api_key: str, api_secret: str) -> str:
    date = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    salt = secrets.token_hex(16)
    data = (date + salt).encode("utf-8")
    signature = hmac.new(api_secret.encode("utf-8"), data, hashlib.sha256).hexdigest()
    return f"HMAC-SHA256 apiKey={api_key}, date={date}, salt={salt}, signature={signature}"


async def send_sms(api_key: str, api_secret: str, sender: str, receiver: str, text: str) -> dict:
    """솔라피 SMS 발송. 성공 시 response dict 반환, 실패 시 예외."""
    receiver = receiver.replace("-", "").replace(" ", "")
    sender = sender.replace("-", "").replace(" ", "")

    headers = {
        "Authorization": _auth_header(api_key, api_secret),
        "Content-Type": "application/json",
    }
    payload = {
        "message": {
            "to": receiver,
            "from": sender,
            "text": text,
        }
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.post(
            f"{SOLAPI_BASE}/messages/v4/send",
            headers=headers,
            json=payload,
        )

    if r.status_code != 200:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise RuntimeError(f"솔라피 오류 ({r.status_code}): {detail}")

    return r.json()


async def send_sms_batch(api_key: str, api_secret: str, sender: str, messages: list[dict]) -> dict:
    """
    일괄 SMS 발송.
    messages: [{"to": "01012345678", "text": "메시지 내용"}, ...]
    반환: {"success": 3, "failed": 0, "results": [...]}
    """
    sender = sender.replace("-", "").replace(" ", "")

    results = []
    success_count = 0
    failed_count = 0

    for msg in messages:
        receiver = msg["to"].replace("-", "").replace(" ", "")
        text = msg["text"]

        try:
            result = await send_sms(api_key, api_secret, sender, receiver, text)
            results.append({"to": msg["to"], "status": "success", "result": result})
            success_count += 1
        except Exception as e:
            results.append({"to": msg["to"], "status": "failed", "error": str(e)})
            failed_count += 1

    return {
        "success": success_count,
        "failed": failed_count,
        "results": results
    }
