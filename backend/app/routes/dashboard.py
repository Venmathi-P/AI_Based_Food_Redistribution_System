from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.config.database import SessionLocal
from app.models.inventory import Inventory
from app.models.donation import Donation

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    # Temporary demo business
    business_id = 1

    inventory = (
        db.query(Inventory)
        .filter(Inventory.business_id == business_id)
        .all()
    )

    total_products = len(inventory)

    total_quantity = sum(item.quantity for item in inventory)

    today = date.today()

    expiring = sum(
        1
        for item in inventory
        if (item.expiry_date - today).days <= 7
    )

    donation_count = (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .count()
    )

    return {
        "listings": total_products,
        "food_rescued": total_quantity,
        "expiring": expiring,
        "donations": donation_count
    }


@router.get("/category-chart")
def category_chart(db: Session = Depends(get_db)):

    business_id = 3

    rows = (
        db.query(
            Inventory.category,
            func.sum(Inventory.quantity)
        )
        .filter(Inventory.business_id == business_id)
        .group_by(Inventory.category)
        .all()
    )

    return [
        {
            "category": row[0],
            "total": row[1]
        }
        for row in rows
    ]