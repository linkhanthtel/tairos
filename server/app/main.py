from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.models import KanbanBoard
from app.routers import events, kanban, transactions
from app.settings import settings


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(KanbanBoard).filter(KanbanBoard.id == 1).first() is None:
            db.add(
                KanbanBoard(
                    id=1,
                    payload={"todo": [], "inProgress": [], "review": [], "done": []},
                )
            )
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="Tairos API", version="0.1.0", lifespan=lifespan)

_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins if _origins else ["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(transactions.router, prefix="/api")
app.include_router(kanban.router, prefix="/api")
app.include_router(events.router, prefix="/api")
