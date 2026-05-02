from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import KanbanBoard
from app.schemas import KanbanBoardPayload

router = APIRouter(prefix="/tasks", tags=["tasks"])

DEFAULT_BOARD = {
    "todo": [],
    "inProgress": [],
    "review": [],
    "done": [],
}


@router.get("/board")
def get_board(db: Session = Depends(get_db)):
    row = db.query(KanbanBoard).filter(KanbanBoard.id == 1).first()
    if not row:
        return DEFAULT_BOARD
    return row.payload


@router.put("/board")
def put_board(body: KanbanBoardPayload, db: Session = Depends(get_db)):
    payload = body.model_dump()
    row = db.query(KanbanBoard).filter(KanbanBoard.id == 1).first()
    if row:
        row.payload = payload
    else:
        row = KanbanBoard(id=1, payload=payload)
        db.add(row)
    db.commit()
    return {"ok": True}
