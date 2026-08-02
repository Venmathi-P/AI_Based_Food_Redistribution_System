from datetime import date
from pydantic import BaseModel


class InventoryCreate(BaseModel):
    product_name: str
    category: str
    quantity: int
    purchase_date: date
    expiry_date: date
    storage_type: str
    barcode: str
    business_id: int


class InventoryResponse(InventoryCreate):
    id: int

    class Config:
        from_attributes = True