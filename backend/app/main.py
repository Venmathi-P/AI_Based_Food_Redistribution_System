from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import Base, engine

# =========================================================
# IMPORT MODELS
# =========================================================

from app.models.user import User
from app.models.inventory import Inventory
from app.models.donation import Donation
from app.models.ai_prediction import AIPrediction

# =========================================================
# IMPORT ROUTERS
# =========================================================

from app.routes.auth import router as auth_router
from app.routes.inventory import router as inventory_router
from app.routes.dashboard import router as dashboard_router
from app.routes.donation import router as donation_router
from app.routes import ai

# =========================================================
# IMPORT SCHEDULER
# =========================================================

from app.services.scheduler import (
    start_scheduler,
    stop_scheduler
)


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("=" * 60)
    print("STARTING FOOD REDISTRIBUTION BACKEND")
    print("=" * 60)

    # Start AI scheduled prediction
    start_scheduler()

    yield

    # Stop scheduler when application shuts down
    stop_scheduler()

    print("=" * 60)
    print("FOOD REDISTRIBUTION BACKEND SHUTDOWN")
    print("=" * 60)


# =========================================================
# CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Food Redistribution API",
    version="1.0.0",
    lifespan=lifespan
)


# =========================================================
# CORS
# =========================================================

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


# =========================================================
# ROUTERS
# =========================================================

app.include_router(auth_router)

app.include_router(inventory_router)

app.include_router(dashboard_router)

app.include_router(donation_router)

app.include_router(ai.router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def home():

    return {
        "message":
            "Food Redistribution Backend Running Successfully"
    }