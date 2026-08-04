from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.config.auth import get_current_user
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
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    business_id = current_user["user_id"]

    inventory = (
        db.query(Inventory)
        .filter(Inventory.business_id == business_id)
        .all()
    )

    total_products = len(inventory)

    total_quantity = sum(item.quantity for item in inventory)

    today = date.today()

    expiring = 0

    for item in inventory:
        days_left = (item.expiry_date - today).days

        if days_left <= 7:
            expiring += 1

    return {
        "listings": total_products,
        "food_rescued": total_quantity,
        "expiring": expiring,
        "ngos": 12
    }


@router.get("/category-chart")
def category_chart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    business_id = current_user["user_id"]

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
            "category": r[0],
            "total": r[1]
        }
        for r in rows
    ]