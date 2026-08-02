from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "foodredistributionsystem2026"
ALGORITHM = "HS256"

# Temporary (for milestone demo only)

def hash_password(password: str):
    return password


def verify_password(plain_password, stored_password):
    return plain_password == stored_password


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)