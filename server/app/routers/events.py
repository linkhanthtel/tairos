import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CalendarEvent
from app.schemas import CalendarEventCreate, CalendarEventRead, CalendarEventUpdate, event_to_read

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[CalendarEventRead])
def list_events(db: Session = Depends(get_db)):
    rows = db.query(CalendarEvent).order_by(CalendarEvent.start_at).all()
    return [event_to_read(e) for e in rows]


@router.post("", response_model=CalendarEventRead, status_code=201)
def create_event(body: CalendarEventCreate, db: Session = Depends(get_db)):
    row = CalendarEvent(
        id=(body.id or str(uuid.uuid4())),
        title=body.title,
        description=body.description,
        start_at=body.start,
        end_at=body.end,
        color=body.color,
        secondary_color=body.secondaryColor,
        priority=body.priority,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return event_to_read(row)


@router.put("/{event_id}", response_model=CalendarEventRead)
def update_event(event_id: str, body: CalendarEventUpdate, db: Session = Depends(get_db)):
    row = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    if body.title is not None:
        row.title = body.title
    if body.description is not None:
        row.description = body.description
    if body.start is not None:
        row.start_at = body.start
    if body.end is not None:
        row.end_at = body.end
    if body.color is not None:
        row.color = body.color
    if body.secondaryColor is not None:
        row.secondary_color = body.secondaryColor
    if body.priority is not None:
        row.priority = body.priority
    db.commit()
    db.refresh(row)
    return event_to_read(row)


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: str, db: Session = Depends(get_db)):
    row = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(row)
    db.commit()
    return None
