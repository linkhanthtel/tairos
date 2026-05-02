from __future__ import annotations

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
    text: str
    amount: float
    date: date
    category: str | None = None
    paymentMethod: str | None = None
    tags: list[str] = []


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    amount: float
    date: date
    category: str | None = None
    paymentMethod: str | None = None
    tags: list[str] = []


def transaction_to_read(t: Any) -> TransactionRead:
    return TransactionRead(
        id=t.id,
        text=t.text,
        amount=t.amount,
        date=t.trans_date,
        category=t.category,
        paymentMethod=t.payment_method,
        tags=t.tags or [],
    )


class KanbanBoardPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    todo: list[dict[str, Any]]
    inProgress: list[dict[str, Any]]
    review: list[dict[str, Any]]
    done: list[dict[str, Any]]


class CalendarEventCreate(BaseModel):
    id: str | None = None
    title: str
    description: str | None = None
    start: datetime
    end: datetime
    color: str = "#06b6d4"
    secondaryColor: str = "#22d3ee"
    priority: str | None = "medium"


class CalendarEventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    start: datetime | None = None
    end: datetime | None = None
    color: str | None = None
    secondaryColor: str | None = None
    priority: str | None = None


class CalendarEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None = None
    start: datetime
    end: datetime
    color: str
    secondaryColor: str
    priority: str | None = None


def event_to_read(e: Any) -> CalendarEventRead:
    return CalendarEventRead(
        id=e.id,
        title=e.title,
        description=e.description,
        start=e.start_at,
        end=e.end_at,
        color=e.color,
        secondaryColor=e.secondary_color,
        priority=e.priority,
    )
