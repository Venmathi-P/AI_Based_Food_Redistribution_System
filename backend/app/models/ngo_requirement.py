from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class NGORequirement(Base):

    __tablename__ = "ngo_requirements"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # NGO who created the requirement
    ngo_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Type of food required
    food_type = Column(
        String(100),
        nullable=False
    )

    # Category of food
    category = Column(
        String(100),
        nullable=True
    )

    # Quantity required
    quantity_required = Column(
        Integer,
        nullable=False
    )

    # Pickup location
    pickup_location = Column(
        String(255),
        nullable=True
    )

    # Requirement status
    status = Column(
        String(30),
        default="Active"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )