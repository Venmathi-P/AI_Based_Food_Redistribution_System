from datetime import datetime
from pydantic import BaseModel


class AIPredictionResponse(BaseModel):
    id: int
    product_id: str
    prediction_date: datetime

    forecast_demand: float
    average_daily_demand: float

    current_stock: float
    days_to_expiry: int

    waste_risk_score: float
    risk_level: str

    recommended_order_quantity: float
    storage_capacity: float

    recommendation: str | None = None

    class Config:
        from_attributes = True