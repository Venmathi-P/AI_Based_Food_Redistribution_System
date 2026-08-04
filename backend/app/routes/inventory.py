from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import date
import pandas as pd

from app.config.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryResponse
from app.utils.expiry import get_expiry_status
from app.schemas.inventory import POSInventory
from app.ai.waste_prediction import predict_waste
from app.schemas.inventory import POSInventory
from app.schemas.inventory import POSInventory
from app.config.auth import get_current_user
router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# ----------------------------
# Add Inventory
# ----------------------------
@router.post("/add")
def add_inventory(
    item: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    data = item.model_dump()

    # Always use the logged-in business
    data["business_id"] = current_user["user_id"]

    inventory = Inventory(**data)

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return {
        "message": "Inventory Added Successfully"
    }


# ----------------------------
# Get Inventory By Business
# ----------------------------
@router.get("")
def get_inventory(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    business_id = current_user["user_id"]

    return (
        db.query(Inventory)
        .filter(Inventory.business_id == business_id)
        .all()
    )

# ----------------------------
# Get Single Inventory By ID
# ----------------------------
@router.get("/{id}", response_model=InventoryResponse)
def get_inventory_by_id(
    id: int,
    db: Session = Depends(get_db)
):

    inventory = db.query(Inventory).filter(
        Inventory.id == id
    ).first()

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found"
        )

    return inventory


# ----------------------------
# Update Inventory
# ----------------------------
@router.put("/{id}")
def update_inventory(
    id: int,
    item: InventoryCreate,
    db: Session = Depends(get_db)
):

    inventory = db.query(Inventory).filter(
        Inventory.id == id
    ).first()

    if not inventory:
        return {
            "message": "Inventory not found"
        }

    inventory.product_name = item.product_name
    inventory.category = item.category
    inventory.quantity = item.quantity
    inventory.purchase_date = item.purchase_date
    inventory.expiry_date = item.expiry_date
    inventory.storage_type = item.storage_type
    inventory.barcode = item.barcode
    inventory.business_id = item.business_id

    db.commit()

    return {
        "message": "Inventory Updated Successfully"
    }


# ----------------------------
# Delete Inventory
# ----------------------------
@router.delete("/{id}")
def delete_inventory(
    id: int,
    db: Session = Depends(get_db)
):

    inventory = db.query(Inventory).filter(
        Inventory.id == id
    ).first()

    if not inventory:
        return {
            "message": "Inventory not found"
        }

    db.delete(inventory)
    db.commit()

    return {
        "message": "Inventory Deleted Successfully"
    }


# ----------------------------
# CSV Upload
# ----------------------------
@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    df = pd.read_csv(file.file)

    for _, row in df.iterrows():

        item = Inventory(
            business_id=current_user["user_id"],
            product_name=row["product_name"],
            category=row["category"],
            quantity=row["quantity"],
            purchase_date=row["purchase_date"],
            expiry_date=row["expiry_date"],
            storage_type=row["storage_type"],
            barcode=row["barcode"]
        )

        db.add(item)

    db.commit()

    return {
        "message": "CSV Uploaded Successfully"
    }


# ----------------------------
# Expiry Alerts
# ----------------------------
@router.get("/expiry-alerts/{business_id}")
def expiry_alerts(
    business_id: int,
    db: Session = Depends(get_db)
):

    items = db.query(Inventory).filter(
        Inventory.business_id == business_id
    ).all()

    alerts = []

    for item in items:

        expiry = get_expiry_status(item.expiry_date)

        if expiry["status"] != "Safe":

            alerts.append({

                "product_name": item.product_name,
                "quantity": item.quantity,
                "expiry_date": item.expiry_date,
                "days_left": expiry["days_left"],
                "risk": expiry["status"]

            })

    return alerts


# ----------------------------
# Product Categorization
# ----------------------------
@router.get("/categorize/{product_name}")
def categorize(product_name: str):

    taxonomy = {

        "milk": {
            "category": "Dairy",
            "risk": "High",
            "storage": "Refrigerated"
        },

        "bread": {
            "category": "Bakery",
            "risk": "High",
            "storage": "Room Temperature"
        },

        "rice": {
            "category": "Grains",
            "risk": "Low",
            "storage": "Dry Storage"
        },

        "apple": {
            "category": "Fruit",
            "risk": "Medium",
            "storage": "Cool Place"
        }

    }

    return taxonomy.get(
        product_name.lower(),
        {
            "category": "Unknown",
            "risk": "Unknown",
            "storage": "Unknown"
        }
    )
@router.get("/category-summary")
def category_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    business_id = current_user["user_id"]

    items = db.query(Inventory).filter(
        Inventory.business_id == business_id
    ).all()

    data = []

    for item in items:

        ai = predict_waste(item)

        data.append({
            "id": item.id,
            "product_name": item.product_name,
            "category": item.category,
            "quantity": item.quantity,
            "expiry_date": item.expiry_date,
            "storage": item.storage_type,

            # AI Output
            "risk": ai["risk"],
            "score": ai["score"],
            "recommendation": ai["recommendation"]
        })

    return data

# ----------------------------
# POS Sync
# ----------------------------
@router.post("/pos-sync")
def pos_sync(
    data: POSInventory,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # Logged-in business
    business_id = current_user["user_id"]

    # Check whether barcode already exists
    existing = (
        db.query(Inventory)
        .filter(
            Inventory.business_id == business_id,
            Inventory.barcode == data.barcode
        )
        .first()
    )

    if existing:

        existing.product_name = data.product_name
        existing.category = data.category
        existing.quantity += data.quantity
        existing.purchase_date = data.purchase_date
        existing.expiry_date = data.expiry_date
        existing.storage_type = data.storage_type

        db.commit()
        db.refresh(existing)

        return {
            "message": "Inventory updated from POS",
            "inventory": existing
        }

    new_item = Inventory(
        business_id=business_id,
        product_name=data.product_name,
        category=data.category,
        quantity=data.quantity,
        purchase_date=data.purchase_date,
        expiry_date=data.expiry_date,
        storage_type=data.storage_type,
        barcode=data.barcode
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Inventory synced from POS",
        "inventory": new_item
    }