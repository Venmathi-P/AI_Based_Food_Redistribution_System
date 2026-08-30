from pydantic import BaseModel, Field
from datetime import datetime


class DonationCreate(BaseModel):
    quantity: int = Field(gt=0)

    pickup_location: str = Field(
        min_length=3,
        max_length=255
    )

    available_from: datetime

    available_until: datetime