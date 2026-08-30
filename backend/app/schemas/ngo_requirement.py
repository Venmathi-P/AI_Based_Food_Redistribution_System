from pydantic import BaseModel


class NGORequirementCreate(BaseModel):

    food_type: str

    category: str | None = None

    quantity_required: int

    pickup_location: str | None = None


class NGORequirementResponse(BaseModel):

    id: int

    ngo_id: int

    food_type: str

    category: str | None

    quantity_required: int

    pickup_location: str | None

    status: str

    class Config:
        from_attributes = True