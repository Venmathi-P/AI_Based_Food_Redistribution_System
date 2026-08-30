from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.auth import get_current_user

from app.models.ngo_requirement import NGORequirement
from app.models.donation import Donation

from app.schemas.ngo_requirement import (
    NGORequirementCreate,
    NGORequirementResponse
)


router = APIRouter(
    prefix="/ngo-requirements",
    tags=["NGO Requirements"]
)


# =========================================================
# CREATE NGO REQUIREMENT
# =========================================================

@router.post(
    "/",
    response_model=NGORequirementResponse
)
def create_requirement(
    requirement: NGORequirementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # Only NGOs can create requirements

    if current_user["role"] != "ngo":

        raise HTTPException(
            status_code=403,
            detail="Only NGOs can create requirements"
        )

    ngo_id = current_user["user_id"]

    new_requirement = NGORequirement(

        ngo_id=ngo_id,

        food_type=requirement.food_type,

        category=requirement.category,

        quantity_required=requirement.quantity_required,

        pickup_location=requirement.pickup_location,

        status="Active"
    )

    db.add(new_requirement)

    db.commit()

    db.refresh(new_requirement)

    return new_requirement


# =========================================================
# GET MY REQUIREMENTS
# =========================================================

@router.get(
    "/",
    response_model=list[NGORequirementResponse]
)
def get_my_requirements(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ngo":

        raise HTTPException(
            status_code=403,
            detail="Only NGOs can view requirements"
        )

    return (
        db.query(NGORequirement)
        .filter(
            NGORequirement.ngo_id ==
            current_user["user_id"]
        )
        .order_by(
            NGORequirement.id.desc()
        )
        .all()
    )


# =========================================================
# AI MATCHING
# =========================================================

@router.get("/matches")
def get_matching_donations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ngo":

        raise HTTPException(
            status_code=403,
            detail="Only NGOs can view matches"
        )

    ngo_id = current_user["user_id"]

    # Get active NGO requirements

    requirements = (
        db.query(NGORequirement)
        .filter(
            NGORequirement.ngo_id == ngo_id,
            NGORequirement.status == "Active"
        )
        .all()
    )

    if not requirements:

        return []


    # Get available donations

    donations = (
        db.query(Donation)
        .filter(
            Donation.status == "Pending"
        )
        .all()
    )

    matches = []


    # =====================================================
    # MATCHING ENGINE
    # =====================================================

    for donation in donations:

        for requirement in requirements:

            score = 0

            reasons = []


            # -------------------------------------------------
            # FOOD TYPE MATCH
            # -------------------------------------------------

            if donation.product_name and requirement.food_type:

                if (
                    donation.product_name
                    .lower()
                    ==
                    requirement.food_type
                    .lower()
                ):

                    score += 50

                    reasons.append(
                        "Food type matches"
                    )


            # -------------------------------------------------
            # CATEGORY MATCH
            # -------------------------------------------------

            if (
                donation.category
                and
                requirement.category
            ):

                if (
                    donation.category
                    .lower()
                    ==
                    requirement.category
                    .lower()
                ):

                    score += 25

                    reasons.append(
                        "Category matches"
                    )


            # -------------------------------------------------
            # QUANTITY MATCH
            # -------------------------------------------------

            if (
                donation.quantity
                and
                requirement.quantity_required
            ):

                if (
                    donation.quantity
                    >=
                    requirement.quantity_required
                ):

                    score += 15

                    reasons.append(
                        "Required quantity available"
                    )

                elif (
                    donation.quantity
                    >=
                    requirement.quantity_required * 0.5
                ):

                    score += 8

                    reasons.append(
                        "Partial quantity available"
                    )


            # -------------------------------------------------
            # LOCATION MATCH
            # -------------------------------------------------

            if (
                donation.pickup_location
                and
                requirement.pickup_location
            ):

                if (
                    donation.pickup_location
                    .lower()
                    ==
                    requirement.pickup_location
                    .lower()
                ):

                    score += 10

                    reasons.append(
                        "Pickup location matches"
                    )


            # -------------------------------------------------
            # ONLY RETURN RELEVANT MATCHES
            # -------------------------------------------------

            if score >= 40:

                matches.append({

                    "donation_id":
                        donation.id,

                    "product_name":
                        donation.product_name,

                    "category":
                        donation.category,

                    "quantity":
                        donation.quantity,

                    "expiry_date":
                        donation.expiry_date,

                    "pickup_location":
                        donation.pickup_location,

                    "requirement_id":
                        requirement.id,

                    "required_food":
                        requirement.food_type,

                    "required_quantity":
                        requirement.quantity_required,

                    "match_score":
                        score,

                    "match_level":
                        (
                            "Excellent"
                            if score >= 80
                            else
                            "Good"
                            if score >= 60
                            else
                            "Possible"
                        ),

                    "reasons":
                        reasons

                })


    # Highest score first

    matches.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return matches