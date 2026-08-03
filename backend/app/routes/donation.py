from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.config.database import get_db
from app.models.donation import Donation
from app.models.inventory import Inventory
from sqlalchemy import desc

router = APIRouter(
    prefix="/donations",
    tags=["Donations"]
)


# ===========================
# Donate Food
# ===========================
@router.post("/{inventory_id}")
def donate_food(inventory_id: int, db: Session = Depends(get_db)):

    item = db.query(Inventory).filter(
        Inventory.id == inventory_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found"
        )

    existing = (
        db.query(Donation)
        .filter(
            Donation.inventory_id == inventory_id,
            Donation.status.in_(["Pending", "Accepted", "Scheduled"])
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This inventory item has already been donated."
        )

    donation = Donation(
        inventory_id=item.id,
        business_id=item.business_id,
        product_name=item.product_name,
        category=item.category,
        quantity=item.quantity,
        expiry_date=item.expiry_date,
        status="Pending"
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)

    return {
        "message": "Food donated successfully",
        "donation": donation
    }


# ===========================
# All Donations
# ===========================
@router.get("/")
def get_all_donations(db: Session = Depends(get_db)):

    business_id = 1

    return (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .all()
    )


# ===========================
# Pending Donations
# ===========================
@router.get("/pending")
def get_pending_donations(db: Session = Depends(get_db)):

    business_id = 1

    return (
        db.query(Donation)
        .filter(
            Donation.business_id == business_id,
            Donation.status == "Pending"
        )
        .all()
    )


# ===========================
# Accept Donation
# ===========================
@router.put("/{donation_id}/accept/{ngo_id}")
def accept_donation(
    donation_id: int,
    ngo_id: int,
    db: Session = Depends(get_db)
):

    donation = db.query(Donation).filter(
        Donation.id == donation_id
    ).first()

    if donation is None:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    donation.status = "Accepted"
    donation.ngo_id = ngo_id

    db.commit()
    db.refresh(donation)

    return {
        "message": "Donation Accepted Successfully",
        "donation": donation
    }


# ===========================
# Accepted Donations
# ===========================
@router.get("/accepted/{ngo_id}")
def get_accepted_donations(
    ngo_id: int,
    db: Session = Depends(get_db)
):

    donations = (
        db.query(Donation)
        .filter(
            Donation.ngo_id == ngo_id,
            Donation.status == "Accepted"
        )
        .all()
    )

    return donations


# ===========================
# Schedule Pickup
# ===========================
@router.put("/{donation_id}/schedule")
def schedule_pickup(
    donation_id: int,
    pickup_date: date,
    pickup_time: str,
    db: Session = Depends(get_db)
):

    donation = db.query(Donation).filter(
        Donation.id == donation_id
    ).first()

    if donation is None:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    donation.status = "Scheduled"
    donation.pickup_date = pickup_date
    donation.pickup_time = pickup_time

    db.commit()
    db.refresh(donation)

    return {
        "message": "Pickup Scheduled Successfully"
    }


# ===========================
# Scheduled Donations
# ===========================
@router.get("/scheduled")
def get_scheduled_donations(db: Session = Depends(get_db)):

    business_id = 1

    return (
        db.query(Donation)
        .filter(
            Donation.business_id == business_id,
            Donation.status == "Scheduled"
        )
        .all()
    )
@router.put("/{donation_id}/complete")
def complete_pickup(
    donation_id: int,
    db: Session = Depends(get_db)
):

    donation = db.query(Donation).filter(
        Donation.id == donation_id
    ).first()

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    donation.status = "Completed"

    db.commit()
    db.refresh(donation)

    return {
        "message": "Pickup Completed Successfully"
    }


# ===========================
# Donation History
# ===========================
@router.get("/history")
def donation_history(db: Session = Depends(get_db)):

    business_id = 1

    return (
        db.query(Donation)
        .filter(
            Donation.business_id == business_id,
            Donation.status == "Completed"
        )
        .all()


    )


# ===========================
# Recent Donations
# ===========================
@router.get("/recent")
def get_recent_donations(db: Session = Depends(get_db)):

    business_id = 3

    donations = (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .order_by(desc(Donation.id))
        .limit(5)
        .all()
    )

    result = []

    for donation in donations:
        result.append({
            "id": donation.id,
            "business_name": f"Business {donation.business_id}",
            "food_name": donation.product_name,
            "quantity": donation.quantity,
            "ngo_name": f"NGO {donation.ngo_id}" if donation.ngo_id else "-",
            "status": donation.status
        })

    return result


