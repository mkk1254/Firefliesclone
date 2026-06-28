from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Meeting, Participant, TranscriptSegment, Summary, ActionItem
from app.schemas import (
    MeetingListItem, MeetingDetail, MeetingCreate, MeetingUpdate,
    ActionItemCreate, ActionItemUpdate, ActionItemOut
)

router = APIRouter(prefix="/meetings", tags=["meetings"])

SPEAKER_COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#dc2626", "#d97706", "#0891b2"]


def _assign_color(index: int) -> str:
    return SPEAKER_COLORS[index % len(SPEAKER_COLORS)]


async def _get_meeting_or_404(meeting_id: int, db: AsyncSession) -> Meeting:
    result = await db.execute(
        select(Meeting)
        .where(Meeting.id == meeting_id)
        .options(
            selectinload(Meeting.participants),
            selectinload(Meeting.transcript_segments),
            selectinload(Meeting.summary),
            selectinload(Meeting.action_items),
        )
    )
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.get("", response_model=list[MeetingListItem])
async def list_meetings(
    search: str | None = Query(None),
    participant: str | None = Query(None),
    sort: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Meeting).options(
        selectinload(Meeting.participants)
    )

    if search:
        stmt = stmt.where(Meeting.title.ilike(f"%{search}%"))

    if participant:
        stmt = stmt.join(Meeting.participants).where(
            Participant.name.ilike(f"%{participant}%")
        )

    order = Meeting.date.desc() if sort == "desc" else Meeting.date.asc()
    stmt = stmt.order_by(order)

    result = await db.execute(stmt)
    return result.scalars().unique().all()


@router.post("", response_model=MeetingDetail, status_code=201)
async def create_meeting(payload: MeetingCreate, db: AsyncSession = Depends(get_db)):
    meeting = Meeting(
        title=payload.title,
        date=payload.date,
        duration_seconds=payload.duration_seconds,
    )
    db.add(meeting)
    await db.flush()

    for i, p in enumerate(payload.participants):
        db.add(Participant(
            meeting_id=meeting.id,
            name=p.name,
            email=p.email,
            color_hex=p.color_hex or _assign_color(i),
        ))

    if payload.transcript_text:
        segments = _parse_plain_transcript(payload.transcript_text, meeting.id)
        for seg in segments:
            db.add(seg)
        if segments:
            meeting.duration_seconds = int(segments[-1].end_time_seconds)

    await db.commit()
    return await _get_meeting_or_404(meeting.id, db)


@router.get("/{meeting_id}", response_model=MeetingDetail)
async def get_meeting(meeting_id: int, db: AsyncSession = Depends(get_db)):
    return await _get_meeting_or_404(meeting_id, db)


@router.patch("/{meeting_id}", response_model=MeetingDetail)
async def update_meeting(meeting_id: int, payload: MeetingUpdate, db: AsyncSession = Depends(get_db)):
    meeting = await _get_meeting_or_404(meeting_id, db)

    if payload.title is not None:
        meeting.title = payload.title
    if payload.date is not None:
        meeting.date = payload.date

    if payload.participants is not None:
        for p in meeting.participants:
            await db.delete(p)
        await db.flush()
        for i, p in enumerate(payload.participants):
            db.add(Participant(
                meeting_id=meeting.id,
                name=p.name,
                email=p.email,
                color_hex=p.color_hex or _assign_color(i),
            ))

    meeting.updated_at = datetime.utcnow()
    await db.commit()
    return await _get_meeting_or_404(meeting_id, db)


@router.delete("/{meeting_id}", status_code=204)
async def delete_meeting(meeting_id: int, db: AsyncSession = Depends(get_db)):
    meeting = await _get_meeting_or_404(meeting_id, db)
    await db.delete(meeting)
    await db.commit()


# --- Action Items ---

@router.get("/{meeting_id}/action-items", response_model=list[ActionItemOut])
async def list_action_items(meeting_id: int, db: AsyncSession = Depends(get_db)):
    await _get_meeting_or_404(meeting_id, db)
    result = await db.execute(
        select(ActionItem).where(ActionItem.meeting_id == meeting_id)
    )
    return result.scalars().all()


@router.post("/{meeting_id}/action-items", response_model=ActionItemOut, status_code=201)
async def create_action_item(meeting_id: int, payload: ActionItemCreate, db: AsyncSession = Depends(get_db)):
    await _get_meeting_or_404(meeting_id, db)
    item = ActionItem(meeting_id=meeting_id, **payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/action-items/{item_id}", response_model=ActionItemOut)
async def update_action_item(item_id: int, payload: ActionItemUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActionItem).where(ActionItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/action-items/{item_id}", status_code=204)
async def delete_action_item(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActionItem).where(ActionItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    await db.delete(item)
    await db.commit()


# --- Transcript upload ---

@router.post("/{meeting_id}/transcript/upload", response_model=MeetingDetail)
async def upload_transcript(
    meeting_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Accepts raw text via JSON body. For file upload use the create endpoint."""
    return await _get_meeting_or_404(meeting_id, db)


# --- Summary generation ---

@router.post("/{meeting_id}/summary/generate", response_model=MeetingDetail)
async def generate_summary(meeting_id: int, db: AsyncSession = Depends(get_db)):
    from app.services.groq_service import generate_meeting_summary
    meeting = await _get_meeting_or_404(meeting_id, db)

    transcript_text = "\n".join(
        f"{seg.speaker_name}: {seg.text}"
        for seg in meeting.transcript_segments
    )

    if not transcript_text.strip():
        raise HTTPException(status_code=400, detail="No transcript to summarize")

    result = await generate_meeting_summary(transcript_text)

    if meeting.summary:
        meeting.summary.overview = result["overview"]
        meeting.summary.key_topics = result["key_topics"]
        meeting.summary.chapters = result["chapters"]
    else:
        db.add(Summary(
            meeting_id=meeting.id,
            overview=result["overview"],
            key_topics=result["key_topics"],
            chapters=result["chapters"],
        ))

    await db.commit()
    return await _get_meeting_or_404(meeting_id, db)


def _parse_plain_transcript(text: str, meeting_id: int) -> list[TranscriptSegment]:
    """Parse plain text transcript lines into segments. Format: 'Speaker: text' per line."""
    segments = []
    time_cursor = 0.0
    for i, line in enumerate(text.strip().splitlines()):
        line = line.strip()
        if not line:
            continue
        if ":" in line:
            speaker, _, content = line.partition(":")
            speaker = speaker.strip()
            content = content.strip()
        else:
            speaker = "Speaker"
            content = line

        word_count = len(content.split())
        duration = max(2.0, word_count * 0.4)

        segments.append(TranscriptSegment(
            meeting_id=meeting_id,
            speaker_name=speaker,
            text=content,
            start_time_seconds=round(time_cursor, 1),
            end_time_seconds=round(time_cursor + duration, 1),
            sequence_order=i,
        ))
        time_cursor += duration + 0.5

    return segments
