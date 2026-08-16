from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime

from app.config.database import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Link prediction to actual inventory item
    inventory_id = Column(
        Integer,
        ForeignKey("inventory.id"),
        nullable=False,
        index=True
    )

    # AI dataset/model ID
    product_id = Column(
        String(50),
        nullable=False,
        index=True
    )

    prediction_date = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True
    )

    forecast_demand = Column(
        Float,
        nullable=False
    )

    average_daily_demand = Column(
        Float,
        nullable=False
    )

    current_stock = Column(
        Float,
        nullable=False
    )

    days_to_expiry = Column(
        Integer,
        nullable=False
    )

    waste_risk_score = Column(
        Float,
        nullable=False
    )

    risk_level = Column(
        String(20),
        nullable=False
    )

    recommended_order_quantity = Column(
        Float,
        nullable=False
    )

    storage_capacity = Column(
        Float,
        nullable=False
    )

    recommendation = Column(
        String(255),
        nullable=True
    )