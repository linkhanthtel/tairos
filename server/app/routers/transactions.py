from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionRead, transaction_to_read

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(db: Session = Depends(get_db)):
    rows = db.query(Transaction).order_by(Transaction.trans_date.desc(), Transaction.id.desc()).all()
    return [transaction_to_read(t) for t in rows]


@router.post("", response_model=TransactionRead, status_code=201)
def create_transaction(body: TransactionCreate, db: Session = Depends(get_db)):
    row = Transaction(
        text=body.text,
        amount=body.amount,
        trans_date=body.date,
        category=body.category or None,
        payment_method=body.paymentMethod or None,
        tags=body.tags or [],
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return transaction_to_read(row)


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    row = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(row)
    db.commit()
    return None
