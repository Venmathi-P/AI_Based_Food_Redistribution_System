from fastapi import FastAPI

from app.config.database import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router

from app.config.database import Base, engine
from app.models.user import User
from app.models.inventory import Inventory
from app.routes.inventory import router as inventory_router
from app.routes.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.donation import Donation
from app.routes.donation import router as donation_router
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Food Redistribution API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://192.168.0.102:5173",
        "http://192.168.0.102:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(dashboard_router)
app.include_router(donation_router)


@app.get("/")
def home():
    return {
        "message": "Food Redistribution Backend Running Successfully"
    }