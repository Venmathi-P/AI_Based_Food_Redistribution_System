from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.config.database import get_db
from app.config.auth import get_current_user

from app.models.donation import Donation


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# =========================================================
# SUSTAINABILITY IMPACT
# =========================================================

@router.get("/impact")
def get_sustainability_impact(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    user_id = current_user["user_id"]
    role = current_user["role"]


    # =====================================================
    # GET COMPLETED DONATIONS
    # =====================================================

    if role == "business":

        completed_donations = (
            db.query(Donation)
            .filter(
                Donation.business_id == user_id,
                Donation.status == "Completed"
            )
            .all()
        )

    elif role == "ngo":

        completed_donations = (
            db.query(Donation)
            .filter(
                Donation.ngo_id == user_id,
                Donation.status == "Completed"
            )
            .all()
        )

    else:

        completed_donations = []


    # =====================================================
    # CALCULATE FOOD WASTE DIVERTED
    # =====================================================

    food_waste_diverted = sum(
        donation.quantity or 0
        for donation in completed_donations
    )


    # =====================================================
    # ESTIMATE MEALS REDISTRIBUTED
    #
    # Simple project assumption:
    # 1 kg of donated food = 4 meals
    # =====================================================

    meals_redistributed = (
        food_waste_diverted * 4
    )


    # =====================================================
    # ESTIMATE CO2 SAVED
    #
    # Simple project assumption:
    # 1 kg food waste diverted = 1.6 kg CO2e saved
    # =====================================================

    co2_saved = round(
        food_waste_diverted * 1.6,
        2
    )


    # =====================================================
    # COMPLETED DONATION COUNT
    # =====================================================

    completed_donations_count = len(
        completed_donations
    )


    return {

        "food_waste_diverted":
            food_waste_diverted,

        "meals_redistributed":
            meals_redistributed,

        "co2_saved":
            co2_saved,

        "completed_donations":
            completed_donations_count

    }