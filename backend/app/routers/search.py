from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Meeting, TranscriptSegment

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def global_search(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    """Search across all meeting titles and transcript segments."""
    meetings_result = await db.execute(
        select(Meeting)
        .where(Meeting.title.ilike(f"%{q}%"))
        .options(selectinload(Meeting.participants))
        .limit(10)
    )
    meetings = meetings_result.scalars().all()

    segments_result = await db.execute(
        select(TranscriptSegment)
        .where(TranscriptSegment.text.ilike(f"%{q}%"))
        .limit(20)
    )
    segments = segments_result.scalars().all()

    return {
        "query": q,
        "meetings": [
            {"id": m.id, "title": m.title, "date": m.date, "participants": [p.name for p in m.participants]}
            for m in meetings
        ],
        "transcript_hits": [
            {"meeting_id": s.meeting_id, "segment_id": s.id, "speaker": s.speaker_name,
             "text": s.text, "start_time": s.start_time_seconds}
            for s in segments
        ],
    }
