# Fireflies.ai Clone

A full-stack meeting notes and transcription platform built as a Scaler SDE Fullstack Assignment.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 (App Router, TypeScript, Tailwind CSS) |
| Backend | Python 3.11 + FastAPI |
| Database | SQLite (via SQLAlchemy async ORM) |
| LLM | Groq API (Llama 3 8B) for AI summary generation |
| State | TanStack Query + Zustand |
| Deployment | Vercel (frontend) + Render (backend) |

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env

uvicorn main:app --reload
# Runs on http://localhost:8000
# DB is seeded automatically on first start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local already points to localhost:8000

npm run dev
# Runs on http://localhost:3000
```

## Database Schema

```
meetings
  id              INTEGER PK
  title           TEXT
  date            DATETIME
  duration_seconds INTEGER
  audio_url       TEXT (nullable)
  created_at      DATETIME
  updated_at      DATETIME

participants
  id              INTEGER PK
  meeting_id      FK → meetings.id
  name            TEXT
  email           TEXT (nullable)
  color_hex       TEXT

transcript_segments
  id              INTEGER PK
  meeting_id      FK → meetings.id
  speaker_name    TEXT
  text            TEXT
  start_time_seconds FLOAT
  end_time_seconds   FLOAT
  sequence_order  INTEGER

summaries
  id              INTEGER PK
  meeting_id      FK → meetings.id (unique)
  overview        TEXT
  key_topics      JSON
  chapters        JSON

action_items
  id              INTEGER PK
  meeting_id      FK → meetings.id
  text            TEXT
  assignee        TEXT (nullable)
  due_date        TEXT (nullable)
  is_completed    BOOLEAN
  created_at      DATETIME
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings` | List meetings (search, sort, filter) |
| POST | `/meetings` | Create meeting |
| GET | `/meetings/{id}` | Get full meeting detail |
| PATCH | `/meetings/{id}` | Update title / participants |
| DELETE | `/meetings/{id}` | Delete meeting |
| GET | `/meetings/{id}/action-items` | List action items |
| POST | `/meetings/{id}/action-items` | Create action item |
| PATCH | `/meetings/action-items/{id}` | Update / complete action item |
| DELETE | `/meetings/action-items/{id}` | Delete action item |
| POST | `/meetings/{id}/summary/generate` | Generate AI summary via Groq |
| GET | `/search?q=...` | Global search across meetings + transcripts |
| GET | `/health` | Health check |

Full docs available at `http://localhost:8000/docs` (Swagger UI).

## Architecture

```
frontend/                  Next.js App Router
  app/
    meetings/              Meeting library + detail pages
    search/                Global search
    settings/              Settings (placeholders)
  components/
    Sidebar.tsx            Left nav (Fireflies-style)
    MeetingCard.tsx        Meeting list item
    TranscriptPanel.tsx    Interactive transcript with seek + search
    SummaryPanel.tsx       AI summary, topics, chapters
    ActionItemsPanel.tsx   Action item CRUD
    MediaPlayer.tsx        Audio player with seek bar
    NewMeetingModal.tsx    Create meeting modal

backend/
  main.py                  FastAPI app, CORS, lifespan (init DB + seed)
  app/
    models.py              SQLAlchemy ORM models
    schemas.py             Pydantic request/response models
    database.py            Async SQLite engine
    seed.py                5 seeded meetings with full data
    routers/
      meetings.py          All meeting + action item endpoints
      search.py            Global search endpoint
    services/
      groq_service.py      Groq API integration for summaries
```

## Assumptions

- Authentication is mocked — a default user "Monal Khatri" is assumed logged in
- Audio player uses a royalty-free sample MP3; real audio upload is not in scope
- Transcript timestamps sync with the media player (click to seek both ways)
- AI summary generation calls Groq API (free tier); falls back to a static summary if the key is missing
- Real-time bot joining, speech-to-text, and integrations (Zoom, Google Meet) are placeholder sections
