from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.config.database import Base



class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    business_id = Column(Integer, ForeignKey("users.id"))

    product_name = Column(String(150), nullable=False)

    category = Column(String(100))

    quantity = Column(Integer)

    purchase_date = Column(Date)

    expiry_date = Column(Date)

    storage_type = Column(String(100))

    barcode = Column(String(100))

    created_at = Column(DateTime, server_default=func.now())