from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import date
import pandas as pd

from app.config.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryResponse
from app.utils.expiry import get_expiry_status

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# ----------------------------
# Add Inventory
# ----------------------------
@router.post("/add")
def add_inventory(item: InventoryCreate, db: Session = Depends(get_db)):

    inventory = Inventory(**item.model_dump())

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return {
        "message": "Inventory Added Successfully"
    }


# ----------------------------
# Get Inventory By Business
# ----------------------------
@router.get("/", response_model=list[InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):

    return db.query(Inventory).all()

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
    db: Session = Depends(get_db)
):

    df = pd.read_csv(file.file)

    for _, row in df.iterrows():

        item = Inventory(
            business_id=1,
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
@router.get("/category-summary/{business_id}")
def category_summary(business_id: int, db: Session = Depends(get_db)):

    items = db.query(Inventory).filter(
        Inventory.business_id == business_id
    ).all()

    data = []

    for item in items:

        risk = get_expiry_status(item.expiry_date)["status"]

        data.append({
            "id": item.id,
            "product_name": item.product_name,
            "category": item.category,
            "quantity": item.quantity,
            "expiry_date": item.expiry_date,
            "storage": item.storage_type,
            "risk": risk
        })

    return data
    