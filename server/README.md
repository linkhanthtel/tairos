# Tairos API (FastAPI)

REST API for transactions, kanban board, and calendar events. Uses **SQLite** (`tairos.db` in this folder).

## Requirements

- **Python 3.11, 3.12, or 3.13** (3.14 is not yet supported by `pydantic-core` wheels/builds in many environments)

## Run locally

```bash
cd server
python3.12 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- OpenAPI docs: http://127.0.0.1:8000/docs  
- Health: `GET http://127.0.0.1:8000/api/health`

## Environment

Optional `.env` in `server/`:

```env
DATABASE_URL=sqlite:///./tairos.db
CORS_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

## Endpoints (prefix `/api`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/transactions` | List transactions |
| POST | `/transactions` | Create |
| DELETE | `/transactions/{id}` | Delete |
| GET | `/tasks/board` | Kanban columns JSON |
| PUT | `/tasks/board` | Replace entire board |
| GET | `/events` | List calendar events |
| POST | `/events` | Create event |
| PUT | `/events/{id}` | Update event |
| DELETE | `/events/{id}` | Delete event |
