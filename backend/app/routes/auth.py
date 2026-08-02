from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister
from app.config.security import hash_password
from app.schemas.user import UserLogin
from app.config.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password (currently returns same password)
    hashed_password = hash_password(user.password)

    new_user = User(
    business_name=user.business_name,
    email=user.email,
    password=hashed_password,
    role=user.role
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration Successful"
    }
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    print("=" * 50)
    print("Login Request")
    print("Email received:", user.email)

    users = db.query(User).all()

    print("Users in database:")

    for u in users:
        print(u.id, u.business_name, u.email, u.role)

    db_user = db.query(User).filter(User.email == user.email).first()

    print("Matched User:", db_user)

    if db_user is None:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role,
            "user_id": db_user.id
        }
    )

    return {
    "access_token": token,
    "token_type": "bearer",
    "role": db_user.role,
    "id": db_user.id,
    "business_name": db_user.business_name
}