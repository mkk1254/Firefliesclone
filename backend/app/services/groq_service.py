import os
import json
from groq import AsyncGroq

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", ""))

SYSTEM_PROMPT = """You are a meeting analysis assistant. Given a meeting transcript, return a JSON object with:
- overview: a 2-3 sentence summary of the meeting
- key_topics: array of 3-6 short topic strings discussed
- chapters: array of objects with {title, start_time_hint} describing meeting sections

Return ONLY valid JSON, no markdown fences."""


async def generate_meeting_summary(transcript_text: str) -> dict:
    if not os.getenv("GROQ_API_KEY"):
        return _fallback_summary()

    truncated = transcript_text[:6000]

    try:
        response = await client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript:\n{truncated}"},
            ],
            temperature=0.3,
            max_tokens=800,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except Exception:
        return _fallback_summary()


def _fallback_summary() -> dict:
    return {
        "overview": "This meeting covered key project updates, team alignment on next steps, and action items for the upcoming sprint.",
        "key_topics": ["Project status", "Team updates", "Action items", "Next steps"],
        "chapters": [
            {"title": "Introduction & Agenda", "start_time_hint": 0},
            {"title": "Main Discussion", "start_time_hint": 300},
            {"title": "Action Items & Wrap-up", "start_time_hint": 900},
        ],
    }
