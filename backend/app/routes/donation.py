from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from sqlalchemy import desc
from pydantic import BaseModel

from app.config.auth import get_current_user
from app.config.database import get_db

from app.models.donation import Donation
from app.models.inventory import Inventory
# =========================================================
# DONATION REQUEST SCHEMA
# =========================================================

class DonationCreate(BaseModel):
    pickup_location: str
    available_from: datetime
    available_until: datetime

router = APIRouter(
    prefix="/donations",
    tags=["Donations"]
)


# =========================================================
# LISTING DETAILS SCHEMA
# =========================================================

class ListingDetails(BaseModel):
    pickup_location: str | None = None
    available_from: datetime | None = None
    available_until: datetime | None = None

# =========================================================
# DONATE FOOD / CREATE SURPLUS LISTING
# =========================================================
@router.post("/{inventory_id}")
def donate_food(
    inventory_id: int,
    pickup_location: str,
    available_from: datetime,
    available_until: datetime,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # Only businesses can donate food
    if current_user["role"] != "business":
        raise HTTPException(
            status_code=403,
            detail="Only businesses can donate food"
        )

    business_id = current_user["user_id"]

    # Find inventory belonging to logged-in business
    item = (
        db.query(Inventory)
        .filter(
            Inventory.id == inventory_id,
            Inventory.business_id == business_id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found for this business"
        )

    # Check availability window
    if available_until <= available_from:
        raise HTTPException(
            status_code=400,
            detail="Available until must be later than available from"
        )

    # Check if already donated
    existing = (
        db.query(Donation)
        .filter(
            Donation.inventory_id == inventory_id,
            Donation.status.in_([
                "Pending",
                "Accepted",
                "Scheduled"
            ])
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This inventory item has already been donated."
        )

    # Create surplus food listing
    donation = Donation(
        inventory_id=item.id,
        business_id=item.business_id,
        product_name=item.product_name,
        category=item.category,
        quantity=item.quantity,
        expiry_date=item.expiry_date,

        pickup_location=pickup_location,
        available_from=available_from,
        available_until=available_until,

        status="Pending"
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)

    return {
        "message": "Food listed for donation successfully",
        "donation": donation
    }
# =========================================================
# UPDATE LISTING DETAILS
# =========================================================
# This allows a business to add/update pickup location
# and availability after creating the donation.

@router.put("/{donation_id}/listing-details")
def update_listing_details(
    donation_id: int,
    listing: ListingDetails,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # Only business can update listing
    if current_user["role"] != "business":
        raise HTTPException(
            status_code=403,
            detail="Only businesses can update listing details"
        )

    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id,
            Donation.business_id == current_user["user_id"]
        )
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    # Don't allow changes after completion
    if donation.status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Completed donations cannot be modified"
        )

    # Validate availability window
    if listing.available_from and listing.available_until:

        if listing.available_until <= listing.available_from:
            raise HTTPException(
                status_code=400,
                detail="available_until must be later than available_from"
            )

    donation.pickup_location = listing.pickup_location
    donation.available_from = listing.available_from
    donation.available_until = listing.available_until

    db.commit()
    db.refresh(donation)

    return {
        "message": "Listing details updated successfully",
        "donation": donation
    }


# =========================================================
# ALL DONATIONS
# =========================================================

@router.get("/")
def get_all_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # NGO can see all listings
    if current_user["role"] == "ngo":

        return (
            db.query(Donation)
            .order_by(desc(Donation.id))
            .all()
        )

    # Business sees only its own donations
    return (
        db.query(Donation)
        .filter(
            Donation.business_id == current_user["user_id"]
        )
        .order_by(desc(Donation.id))
        .all()
    )


# =========================================================
# PENDING DONATIONS
# =========================================================

@router.get("/pending")
def get_pending_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # NGO sees available surplus food
    if current_user["role"] == "ngo":

        return (
            db.query(Donation)
            .filter(
                Donation.status == "Pending"
            )
            .order_by(desc(Donation.id))
            .all()
        )

    # Business sees its own pending donations
    return (
        db.query(Donation)
        .filter(
            Donation.business_id == current_user["user_id"],
            Donation.status == "Pending"
        )
        .order_by(desc(Donation.id))
        .all()
    )


# =========================================================
# ACCEPT DONATION
# =========================================================

@router.put("/{donation_id}/accept")
def accept_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ngo":
        raise HTTPException(
            status_code=403,
            detail="Only NGOs can accept donations"
        )

    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id
        )
        .first()
    )

    if donation is None:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    if donation.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Donation already accepted."
        )

    donation.ngo_id = current_user["user_id"]
    donation.status = "Accepted"

    db.commit()
    db.refresh(donation)

    return {
        "message": "Donation Accepted Successfully",
        "donation": donation
    }


# =========================================================
# ACCEPTED DONATIONS
# =========================================================

@router.get("/accepted")
def get_accepted_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    return (
        db.query(Donation)
        .filter(
            Donation.ngo_id == current_user["user_id"],
            Donation.status == "Accepted"
        )
        .order_by(desc(Donation.id))
        .all()
    )


# =========================================================
# SCHEDULE PICKUP
# =========================================================

@router.put("/{donation_id}/schedule")
def schedule_pickup(
    donation_id: int,
    pickup_date: date,
    pickup_time: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id
        )
        .first()
    )

    if donation is None:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    if current_user["role"] != "ngo":
        raise HTTPException(
            status_code=403,
            detail="Only NGOs can schedule pickups"
        )

    if donation.ngo_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this donation"
        )

    if donation.status != "Accepted":
        raise HTTPException(
            status_code=400,
            detail="Only accepted donations can be scheduled"
        )

    donation.status = "Scheduled"
    donation.pickup_date = pickup_date
    donation.pickup_time = pickup_time

    db.commit()
    db.refresh(donation)

    return {
        "message": "Pickup Scheduled Successfully",
        "donation": donation
    }


# =========================================================
# SCHEDULED DONATIONS
# =========================================================

@router.get("/scheduled")
def get_scheduled_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] == "ngo":

        return (
            db.query(Donation)
            .filter(
                Donation.ngo_id == current_user["user_id"],
                Donation.status == "Scheduled"
            )
            .order_by(desc(Donation.id))
            .all()
        )

    return (
        db.query(Donation)
        .filter(
            Donation.business_id == current_user["user_id"],
            Donation.status == "Scheduled"
        )
        .order_by(desc(Donation.id))
        .all()
    )


# =========================================================
# COMPLETE PICKUP
# =========================================================

@router.put("/{donation_id}/complete")
def complete_pickup(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id
        )
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    if current_user["role"] != "ngo":
        raise HTTPException(
            status_code=403,
            detail="Only NGOs can complete pickups"
        )

    if donation.ngo_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this donation"
        )

    if donation.status != "Scheduled":
        raise HTTPException(
            status_code=400,
            detail="Only scheduled pickups can be completed"
        )

    donation.status = "Completed"

    db.commit()
    db.refresh(donation)

    return {
        "message": "Pickup Completed Successfully",
        "donation": donation
    }


# =========================================================
# HISTORY
# =========================================================

@router.get("/history")
def donation_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] == "ngo":

        return (
            db.query(Donation)
            .filter(
                Donation.ngo_id == current_user["user_id"],
                Donation.status == "Completed"
            )
            .order_by(desc(Donation.id))
            .all()
        )

    return (
        db.query(Donation)
        .filter(
            Donation.business_id == current_user["user_id"],
            Donation.status == "Completed"
        )
        .order_by(desc(Donation.id))
        .all()
    )


# =========================================================
# RECENT DONATIONS
# =========================================================

@router.get("/recent")
def get_recent_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    donations = (
        db.query(Donation)
        .filter(
            Donation.business_id == current_user["user_id"]
        )
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
            "ngo_name": (
                f"NGO {donation.ngo_id}"
                if donation.ngo_id
                else "-"
            ),
            "status": donation.status,

            # Milestone 3 fields
            "pickup_location": donation.pickup_location,
            "available_from": donation.available_from,
            "available_until": donation.available_until
        })

    return result


# =========================================================
# NOTIFICATIONS
# =========================================================

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    user_id = current_user["user_id"]
    role = current_user["role"]

    notifications = []

    # =====================================================
    # BUSINESS NOTIFICATIONS
    # =====================================================

    if role == "business":

        donations = (
            db.query(Donation)
            .filter(
                Donation.business_id == user_id,
                Donation.status.in_([
                    "Accepted",
                    "Scheduled",
                    "Completed"
                ])
            )
            .order_by(desc(Donation.id))
            .limit(10)
            .all()
        )

        for donation in donations:

            if donation.status == "Accepted":

                notifications.append({
                    "id": donation.id,
                    "type": "accepted",
                    "message": (
                        f"NGO {donation.ngo_id} accepted your "
                        f"{donation.product_name} donation."
                    ),
                    "status": donation.status
                })

            elif donation.status == "Scheduled":

                notifications.append({
                    "id": donation.id,
                    "type": "scheduled",
                    "message": (
                        f"Pickup scheduled for "
                        f"{donation.product_name} on "
                        f"{donation.pickup_date} at "
                        f"{donation.pickup_time} by "
                        f"NGO {donation.ngo_id}."
                    ),
                    "status": donation.status
                })

            elif donation.status == "Completed":

                notifications.append({
                    "id": donation.id,
                    "type": "completed",
                    "message": (
                        f"Pickup completed for your "
                        f"{donation.product_name} donation."
                    ),
                    "status": donation.status
                })

    # =====================================================
    # NGO NOTIFICATIONS
    # =====================================================

    elif role == "ngo":

        donations = (
            db.query(Donation)
            .filter(
                Donation.ngo_id == user_id,
                Donation.status.in_([
                    "Accepted",
                    "Scheduled",
                    "Completed"
                ])
            )
            .order_by(desc(Donation.id))
            .limit(10)
            .all()
        )

        for donation in donations:

            if donation.status == "Accepted":

                notifications.append({
                    "id": donation.id,
                    "type": "accepted",
                    "message": (
                        f"You accepted "
                        f"{donation.product_name} "
                        f"from Business "
                        f"{donation.business_id}."
                    ),
                    "status": donation.status
                })

            elif donation.status == "Scheduled":

                notifications.append({
                    "id": donation.id,
                    "type": "scheduled",
                    "message": (
                        f"Pickup scheduled for "
                        f"{donation.product_name} on "
                        f"{donation.pickup_date} at "
                        f"{donation.pickup_time}."
                    ),
                    "status": donation.status
                })

            elif donation.status == "Completed":

                notifications.append({
                    "id": donation.id,
                    "type": "completed",
                    "message": (
                        f"Pickup completed for "
                        f"{donation.product_name}."
                    ),
                    "status": donation.status
                })

    return notifications