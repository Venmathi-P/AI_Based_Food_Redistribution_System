from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)

    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)

    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    ngo_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    product_name = Column(String(150), nullable=False)

    category = Column(String(100))

    quantity = Column(Integer)

    expiry_date = Column(Date)

    status = Column(String(30), default="Pending")

    created_at = Column(DateTime, server_default=func.now())
    pickup_date = Column(Date, nullable=True)
    pickup_time = Column(String(20), nullable=True)