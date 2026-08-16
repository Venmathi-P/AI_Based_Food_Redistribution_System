from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import date
from pathlib import Path
import pandas as pd

from app.config.database import get_db
from app.models.inventory import Inventory
from app.models.ai_prediction import AIPrediction

from app.ai.predict_demand import forecast_product
from app.ai.waste_risk import calculate_waste_risk
from app.ai.reorder_recommendation import (
    calculate_reorder_recommendation
)

from app.ai.preprocessing import preprocess_dataset
from app.ai.train_demand_model import train_models

from sqlalchemy import desc
# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/ai",
    tags=["AI Prediction"]
)


# =========================================================
# PATHS
# =========================================================

APP_DIR = Path(
    __file__
).resolve().parent.parent

AI_DIR = APP_DIR / "ai"

MAPPING_PATH = (
    AI_DIR
    / "data"
    / "product_mapping.csv"
)


# =========================================================
# LOAD PRODUCT MAPPING
# =========================================================

def load_product_mapping():

    print(
        "[AI] Looking for product mapping:"
    )

    print(
        f"[AI] {MAPPING_PATH}"
    )

    if not MAPPING_PATH.exists():

        raise FileNotFoundError(
            f"Product mapping file not found: "
            f"{MAPPING_PATH}"
        )

    try:

        mapping = pd.read_csv(
            MAPPING_PATH
        )

        print(
            f"[AI] Product mapping loaded: "
            f"{len(mapping)} products"
        )

        return mapping

    except Exception as e:

        raise RuntimeError(
            f"Failed to load product mapping: {e}"
        )


# =========================================================
# NORMALIZE PRODUCT NAME
# =========================================================

def normalize_product_name(name):

    if name is None:
        return ""

    return (
        str(name)
        .strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
    )


# =========================================================
# FIND AI MODEL
# =========================================================

def find_model_item_id(
    product_name,
    barcode=None
):

    mapping = load_product_mapping()

    target_name = normalize_product_name(product_name)

    barcode = str(
        barcode or ""
    ).strip()

    print(
        f"[AI] Searching model for "
        f"product='{product_name}', "
        f"barcode='{barcode}'"
    )

    # =====================================================
    # MATCH PRODUCT NAME
    # =====================================================

    if mapping.empty:
        print("[AI] Product mapping is empty")
        return None

    # Make sure required columns exist
    required_columns = [
        "product_id",
        "dataset_item_id",
        "dataset_product_name",
        "model_file"
    ]

    missing_columns = [
        col
        for col in required_columns
        if col not in mapping.columns
    ]

    if missing_columns:

        raise ValueError(
            f"Invalid product_mapping.csv. "
            f"Missing columns: {missing_columns}"
        )

    # =====================================================
    # FIND PRODUCT BY NAME
    # =====================================================

    for _, row in mapping.iterrows():

        dataset_name = normalize_product_name(
            row["dataset_product_name"]
        )

        if dataset_name == target_name:

            product_id = str(
                row["product_id"]
            ).strip()

            dataset_item_id = int(
                float(
                    row["dataset_item_id"]
                )
            )

            model_file = str(
                row["model_file"]
            ).strip()

            print(
                f"[AI] Product matched:"
            )

            print(
                f"[AI] {product_name} -> "
                f"{product_id}"
            )

            print(
                f"[AI] Dataset Item ID: "
                f"{dataset_item_id}"
            )

            print(
                f"[AI] Model file: "
                f"{model_file}"
            )

            return {

                "item_id":
                    dataset_item_id,

                "model_id":
                    product_id,

                "item_name":
                    str(
                        row["dataset_product_name"]
                    ),

                "model_file":
                    model_file
            }

    # =====================================================
    # NO MATCH
    # =====================================================

    print(
        f"[AI] No model found for "
        f"product='{product_name}', "
        f"barcode='{barcode}'"
    )

    return None


# =========================================================
# AUTOMATIC AI MODEL TRAINING
# =========================================================

@router.post(
    "/train"
)
def train_ai_models():

    print("\n")
    print("=" * 60)
    print("STARTING AI MODEL TRAINING")
    print("=" * 60)

    try:

        # =================================================
        # STEP 1: PREPROCESS DATASET
        # =================================================

        print(
            "\n[AI] Step 1: "
            "Preprocessing dataset..."
        )

        preprocessing_result = (
            preprocess_dataset()
        )

        print(
            "[AI] Dataset preprocessing completed."
        )

        # =================================================
        # STEP 2: TRAIN PROPHET MODELS
        # =================================================

        print(
            "\n[AI] Step 2: "
            "Training Prophet models..."
        )

        training_result = (
            train_models()
        )

        print(
            "[AI] Model training completed."
        )

        # =================================================
        # STEP 3: RETURN RESULT
        # =================================================

        return {

            "success":
                True,

            "message":
                "AI models trained successfully.",

            "models_trained":
                training_result[
                    "models_trained"
                ],

            "models":
                training_result[
                    "models"
                ],

            "processed_dataset":
                preprocessing_result[
                    "processed_dataset"
                ],

            "product_mapping":
                preprocessing_result[
                    "product_mapping"
                ],

            "performance_file":
                training_result[
                    "performance_file"
                ]
        }

    except FileNotFoundError as e:

        print(
            f"[AI TRAINING] "
            f"File error: {e}"
        )

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        print(
            f"[AI TRAINING] "
            f"Training failed: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"AI model training failed: "
                f"{str(e)}"
            )
        )


# =========================================================
# REUSABLE AI INVENTORY ANALYSIS
# =========================================================
#
# This function is used by:
#
# 1. Manual API:
#       POST /ai/analyze/{inventory_id}
#
# 2. Scheduled batch prediction:
#       scheduler.py
#
# =========================================================

def analyze_inventory_item(
    inventory_id: int,
    db: Session
):

    # =====================================================
    # 1. GET INVENTORY ITEM
    # =====================================================

    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.id == inventory_id
        )
        .first()
    )

    if not inventory:

        raise ValueError(
            f"Inventory item "
            f"{inventory_id} not found"
        )

    print(
        f"\n[AI] Analyzing inventory ID: "
        f"{inventory_id}"
    )

    # =====================================================
    # 2. VALIDATE QUANTITY
    # =====================================================

    if inventory.quantity is None:

        raise ValueError(
            "Inventory quantity is missing"
        )

    # =====================================================
    # 3. VALIDATE EXPIRY DATE
    # =====================================================

    if inventory.expiry_date is None:

        raise ValueError(
            "Inventory expiry date is missing"
        )

    # =====================================================
    # 4. PRODUCT NAME
    # =====================================================

    product_name = str(
        inventory.product_name or ""
    ).strip()

    if not product_name:

        raise ValueError(
            "Inventory item does not have "
            "a product name."
        )

    # =====================================================
    # 5. BARCODE
    # =====================================================

    barcode = str(
        inventory.barcode or ""
    ).strip()

    print(
        f"[AI] Product name: "
        f"{product_name}"
    )

    print(
        f"[AI] Barcode: "
        f"{barcode}"
    )

    # =====================================================
    # 6. FIND DATASET PRODUCT / MODEL
    # =====================================================

    product_info = find_model_item_id(
        product_name=product_name,
        barcode=barcode
    )

    if not product_info:

        raise ValueError(
            f"No AI model mapping found "
            f"for product '{product_name}' "
            f"with barcode '{barcode}'."
        )

    item_id = (
        product_info["item_id"]
    )

    model_id = (
        product_info["model_id"]
    )

    dataset_product_name = (
        product_info["item_name"]
    )

    print(
        f"[AI] Dataset Item ID: "
        f"{item_id}"
    )

    print(
        f"[AI] Model ID: "
        f"{model_id}"
    )

    print(
        f"[AI] Dataset product: "
        f"{dataset_product_name}"
    )

    # =====================================================
    # 7. INVENTORY VALUES
    # =====================================================

    current_stock = float(
        inventory.quantity
    )

    today = date.today()

    days_to_expiry = (
        inventory.expiry_date - today
    ).days

    storage_capacity = float(
        inventory.storage_capacity or 1
    )

    print(
        f"[AI] Current stock: "
        f"{current_stock}"
    )

    print(
        f"[AI] Days to expiry: "
        f"{days_to_expiry}"
    )

    print(
        f"[AI] Storage capacity: "
        f"{storage_capacity}"
    )

    # =====================================================
    # 8. DEMAND FORECAST
    # =====================================================

    forecast_available = True

    forecast_error = None

    forecast_demand = 0.0

    average_daily_demand = 0.0

    forecast = None

    try:

        print(
            f"[AI] Running demand forecast "
            f"for {model_id}..."
        )

        forecast = forecast_product(
            item_id=model_id,
            days=7
        )

        if "yhat" not in forecast.columns:

            raise ValueError(
                "Forecast result does not contain "
                "'yhat'"
            )

        forecast_demand = float(
            forecast["yhat"]
            .clip(lower=0)
            .sum()
        )

        average_daily_demand = float(
            forecast["yhat"]
            .clip(lower=0)
            .mean()
        )

        print(
            f"[AI] Predicted 7-day demand: "
            f"{forecast_demand:.2f}"
        )

        print(
            f"[AI] Average daily demand: "
            f"{average_daily_demand:.2f}"
        )

    except FileNotFoundError as e:

        forecast_available = False

        forecast_error = str(e)

        print(
            f"[AI] Forecast model not found: "
            f"{forecast_error}"
        )

    except Exception as e:

        forecast_available = False

        forecast_error = str(e)

        print(
            f"[AI] Forecast failed: "
            f"{forecast_error}"
        )

    # =====================================================
    # 9. WASTE RISK
    # =====================================================

    try:

        print(
            "[AI] Calculating waste risk..."
        )

        if forecast_available:

            waste_result = (
                calculate_waste_risk(
                    product_id=model_id,
                    current_stock=current_stock,
                    days_to_expiry=days_to_expiry,
                    forecast=forecast
                )
            )

        else:

            waste_result = (
                calculate_waste_risk(
                    product_id=model_id,
                    current_stock=current_stock,
                    days_to_expiry=days_to_expiry
                )
            )

        print(
            f"[AI] Waste risk: "
            f"{waste_result}"
        )

    except Exception as e:

        raise ValueError(
            f"Waste risk calculation failed: {e}"
        )

    # =====================================================
    # 10. REORDER RECOMMENDATION
    # =====================================================

    try:

        print(
            "[AI] Calculating reorder "
            "recommendation..."
        )

        reorder_result = (
            calculate_reorder_recommendation(
                product_id=model_id,
                current_stock=current_stock,
                storage_capacity=storage_capacity,
                lead_time_days=2,
                safety_stock_days=2
            )
        )

        print(
            f"[AI] Reorder result: "
            f"{reorder_result}"
        )

    except Exception as e:

        raise ValueError(
            f"Reorder calculation failed: {e}"
        )

    # =====================================================
    # 11. SAVE AI PREDICTION
    # =====================================================

    prediction = AIPrediction(

        product_id=model_id,
        inventory_id=inventory.id,

        forecast_demand=(
            forecast_demand
        ),

        average_daily_demand=(
            average_daily_demand
        ),

        current_stock=(
            current_stock
        ),

        days_to_expiry=(
            days_to_expiry
        ),

        waste_risk_score=(
            waste_result[
                "waste_risk_score"
            ]
        ),

        risk_level=(
            waste_result[
                "risk_level"
            ]
        ),

        recommended_order_quantity=(
            reorder_result[
                "recommended_order_quantity"
            ]
        ),

        storage_capacity=(
            storage_capacity
        ),

        recommendation=(
            waste_result[
                "recommendation"
            ]
        )
    )

    try:

        db.add(
            prediction
        )

        db.commit()

        db.refresh(
            prediction
        )

        print(
            f"[AI] Prediction saved. "
            f"Prediction ID: "
            f"{prediction.id}"
        )

    except Exception as e:

        db.rollback()

        raise ValueError(
            f"Failed to save AI prediction: {e}"
        )

    # =====================================================
    # 12. DAILY FORECAST
    # =====================================================

    daily_forecast = []

    if (
        forecast_available
        and forecast is not None
    ):

        for _, row in forecast.iterrows():

            daily_forecast.append({

                "date":
                    row["ds"].strftime(
                        "%Y-%m-%d"
                    ),

                "predicted_demand":
                    round(
                        max(
                            0,
                            float(
                                row["yhat"]
                            )
                        ),
                        2
                    ),

                "lower":
                    round(
                        max(
                            0,
                            float(
                                row["yhat_lower"]
                            )
                        ),
                        2
                    ),

                "upper":
                    round(
                        max(
                            0,
                            float(
                                row["yhat_upper"]
                            )
                        ),
                        2
                    )
            })

    # =====================================================
    # 13. RETURN COMPLETE RESULT
    # =====================================================

    return {

        "prediction_id":
            prediction.id,

        "inventory_id":
            inventory.id,

        "product_id":
            model_id,

        "dataset_item_id":
            item_id,

        "barcode":
            barcode,

        "product_name":
            product_name,

        "dataset_product_name":
            dataset_product_name,

        "current_stock":
            current_stock,

        "days_to_expiry":
            days_to_expiry,

        # =================================================
        # FORECAST
        # =================================================

        "forecast": {

            "available":
                forecast_available,

            "forecast_days":
                7,

            "total_predicted_demand":
                round(
                    forecast_demand,
                    2
                ),

            "average_daily_demand":
                round(
                    average_daily_demand,
                    2
                ),

            "daily_forecast":
                daily_forecast,

            "error":
                forecast_error
        },

        # =================================================
        # WASTE RISK
        # =================================================

        "waste_risk":
            waste_result,

        # =================================================
        # REORDER
        # =================================================

        "reorder":
            reorder_result,

        # =================================================
        # FINAL RECOMMENDATION
        # =================================================

        "recommendation":
            waste_result[
                "recommendation"
            ]
    }


# =========================================================
# MANUAL AI ANALYSIS ENDPOINT
# =========================================================
#
# This endpoint is used by the frontend/manual testing.
#
# POST:
# /ai/analyze/{inventory_id}
#
# =========================================================

@router.post(
    "/analyze/{inventory_id}"
)
def analyze_inventory(

    inventory_id: int,

    db: Session = Depends(
        get_db
    )
):

    try:

        return analyze_inventory_item(
            inventory_id=inventory_id,
            db=db
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/predictions/latest")
def get_latest_predictions(
    db: Session = Depends(get_db)
):

    inventory_items = (
        db.query(Inventory)
        .all()
    )

    results = []

    for inventory in inventory_items:

        prediction = (
            db.query(AIPrediction)
            .filter(
                AIPrediction.inventory_id
                == inventory.id
            )
            .order_by(
                AIPrediction.prediction_date.desc()
            )
            .first()
        )

        if prediction:

            results.append({

                "inventory_id":
                    inventory.id,

                "product_name":
                    inventory.product_name,

                "category":
                    inventory.category,

                "quantity":
                    inventory.quantity,

                "expiry_date":
                    (
                        inventory.expiry_date.isoformat()
                        if inventory.expiry_date
                        else None
                    ),

                "prediction_id":
                    prediction.id,

                "prediction_date":
                    prediction.prediction_date.isoformat(),

                "product_id":
                    prediction.product_id,

                "forecast_demand":
                    prediction.forecast_demand,

                "average_daily_demand":
                    prediction.average_daily_demand,

                "current_stock":
                    prediction.current_stock,

                "days_to_expiry":
                    prediction.days_to_expiry,

                "waste_risk_score":
                    prediction.waste_risk_score,

                "risk_level":
                    prediction.risk_level,

                "recommended_order_quantity":
                    prediction.recommended_order_quantity,

                "storage_capacity":
                    prediction.storage_capacity,

                "recommendation":
                    prediction.recommendation
            })

    return {
        "success": True,
        "count": len(results),
        "predictions": results
    }