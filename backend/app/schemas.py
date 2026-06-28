from datetime import datetime
from pydantic import BaseModel


class ParticipantOut(BaseModel):
    id: int
    name: str
    email: str | None
    color_hex: str
    model_config = {"from_attributes": True}


class ParticipantCreate(BaseModel):
    name: str
    email: str | None = None
    color_hex: str = "#7c3aed"


class TranscriptSegmentOut(BaseModel):
    id: int
    speaker_name: str
    text: str
    start_time_seconds: float
    end_time_seconds: float
    sequence_order: int
    model_config = {"from_attributes": True}


class SummaryOut(BaseModel):
    id: int
    overview: str
    key_topics: list
    chapters: list
    model_config = {"from_attributes": True}


class ActionItemOut(BaseModel):
    id: int
    text: str
    assignee: str | None
    due_date: str | None
    is_completed: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class ActionItemCreate(BaseModel):
    text: str
    assignee: str | None = None
    due_date: str | None = None


class ActionItemUpdate(BaseModel):
    text: str | None = None
    assignee: str | None = None
    due_date: str | None = None
    is_completed: bool | None = None


class MeetingListItem(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    participants: list[ParticipantOut]
    created_at: datetime
    model_config = {"from_attributes": True}


class MeetingDetail(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    audio_url: str | None
    participants: list[ParticipantOut]
    transcript_segments: list[TranscriptSegmentOut]
    summary: SummaryOut | None
    action_items: list[ActionItemOut]
    created_at: datetime
    model_config = {"from_attributes": True}


class MeetingCreate(BaseModel):
    title: str
    date: datetime
    duration_seconds: int = 0
    participants: list[ParticipantCreate] = []
    transcript_text: str | None = None


class MeetingUpdate(BaseModel):
    title: str | None = None
    date: datetime | None = None
    participants: list[ParticipantCreate] | None = None
