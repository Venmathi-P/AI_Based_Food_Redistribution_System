from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    business_name: str
    email: EmailStr
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    business_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True