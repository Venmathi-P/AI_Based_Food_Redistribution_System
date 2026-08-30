from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.config.database import get_db
from app.config.auth import get_current_user
from app.models.donation import Donation


router = APIRouter(
    prefix="/ngo-analytics",
    tags=["NGO Analytics"]
)


@router.get("/dashboard")
def get_ngo_dashboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ngo":
        return {
            "available_donations": 0,
            "accepted_donations": 0,
            "scheduled_pickups": 0,
            "meals_served": 0
        }

    ngo_id = current_user["user_id"]


    # =====================================================
    # AVAILABLE DONATIONS
    # =====================================================

    available_donations = (
        db.query(Donation)
        .filter(
            Donation.status == "Pending"
        )
        .count()
    )


    # =====================================================
    # ACCEPTED DONATIONS
    # =====================================================

    accepted_donations = (
        db.query(Donation)
        .filter(
            Donation.ngo_id == ngo_id,
            Donation.status.in_([
                "Accepted",
                "Scheduled",
                "Completed"
            ])
        )
        .count()
    )


    # =====================================================
    # SCHEDULED PICKUPS
    # =====================================================

    scheduled_pickups = (
        db.query(Donation)
        .filter(
            Donation.ngo_id == ngo_id,
            Donation.status == "Scheduled"
        )
        .count()
    )


    # =====================================================
    # MEALS SERVED
    #
    # Completed donation quantity × 4
    # =====================================================

    completed_quantity = (
        db.query(
            func.coalesce(
                func.sum(Donation.quantity),
                0
            )
        )
        .filter(
            Donation.ngo_id == ngo_id,
            Donation.status == "Completed"
        )
        .scalar()
    )


    meals_served = completed_quantity * 4


    return {

        "available_donations":
            available_donations,

        "accepted_donations":
            accepted_donations,

        "scheduled_pickups":
            scheduled_pickups,

        "meals_served":
            meals_served

    }