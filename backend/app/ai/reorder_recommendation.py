from app.ai.predict_demand import forecast_product


# =========================================================
# REORDER RECOMMENDATION
# =========================================================

def calculate_reorder_recommendation(

    product_id: str,

    current_stock: float,

    storage_capacity: float,

    lead_time_days: int = 2,

    safety_stock_days: int = 2

):

    product_id = str(
        product_id
    ).strip()

    current_stock = float(
        current_stock
    )

    storage_capacity = float(
        storage_capacity
    )

    lead_time_days = int(
        lead_time_days
    )

    safety_stock_days = int(
        safety_stock_days
    )


    # =====================================================
    # VALIDATION
    # =====================================================

    if current_stock < 0:

        raise ValueError(
            "Current stock cannot be negative"
        )

    if storage_capacity < 0:

        raise ValueError(
            "Storage capacity cannot be negative"
        )

    if lead_time_days < 0:

        raise ValueError(
            "Lead time cannot be negative"
        )

    if safety_stock_days < 0:

        raise ValueError(
            "Safety stock days cannot be negative"
        )


    # =====================================================
    # GET DEMAND FORECAST
    # =====================================================

    forecast_days = max(
        7,
        lead_time_days + safety_stock_days
    )

    forecast = forecast_product(

        # IMPORTANT:
        # predict_demand.py expects item_id
        item_id=product_id,

        days=forecast_days
    )


    # =====================================================
    # GET DAILY DEMAND
    # =====================================================

    if "yhat" not in forecast.columns:

        raise ValueError(
            "Forecast result does not contain 'yhat'"
        )

    daily_demand = (

        forecast["yhat"]
        .clip(lower=0)
        .tolist()

    )


    # =====================================================
    # AVERAGE DAILY DEMAND
    # =====================================================

    if not daily_demand:

        average_daily_demand = 0.0

    else:

        average_daily_demand = (

            sum(daily_demand)
            /
            len(daily_demand)

        )


    # =====================================================
    # LEAD-TIME DEMAND
    # =====================================================

    lead_time_demand = (

        average_daily_demand
        *
        lead_time_days

    )


    # =====================================================
    # SAFETY STOCK
    # =====================================================

    safety_stock = (

        average_daily_demand
        *
        safety_stock_days

    )


    # =====================================================
    # TARGET INVENTORY
    # =====================================================

    target_inventory = (

        lead_time_demand
        +
        safety_stock

    )


    # =====================================================
    # AVAILABLE STORAGE
    # =====================================================

    available_storage = max(

        0,

        storage_capacity
        -
        current_stock

    )


    # =====================================================
    # RAW REORDER QUANTITY
    # =====================================================

    raw_reorder_quantity = max(

        0,

        target_inventory
        -
        current_stock

    )


    # =====================================================
    # FINAL REORDER QUANTITY
    # =====================================================

    recommended_order = min(

        raw_reorder_quantity,

        available_storage

    )

    recommended_order = round(
        recommended_order
    )


    # =====================================================
    # REORDER STATUS
    # =====================================================

    if recommended_order <= 0:

        status = "NO_REORDER"

    elif (
        recommended_order
        <
        average_daily_demand
    ):

        status = "SMALL_REORDER"

    else:

        status = "REORDER_REQUIRED"


    # =====================================================
    # STORAGE UTILIZATION
    # =====================================================

    projected_inventory = (

        current_stock
        +
        recommended_order

    )


    if storage_capacity > 0:

        storage_utilization = (

            projected_inventory
            /
            storage_capacity

        ) * 100

    else:

        storage_utilization = 0


    # =====================================================
    # REORDER RECOMMENDATION TEXT
    # =====================================================

    if status == "NO_REORDER":

        recommendation = (
            "No additional stock is required "
            "at this time."
        )

    elif status == "SMALL_REORDER":

        recommendation = (
            "Small quantity reorder recommended "
            "based on forecasted demand."
        )

    else:

        recommendation = (
            "Reorder stock based on predicted "
            "demand, lead time and safety stock."
        )


    # =====================================================
    # RETURN RESULT
    # =====================================================

    return {

        "product_id":
            product_id,

        "current_stock":
            round(
                current_stock,
                2
            ),

        "storage_capacity":
            round(
                storage_capacity,
                2
            ),

        "average_daily_demand":
            round(
                average_daily_demand,
                2
            ),

        "lead_time_days":
            lead_time_days,

        "lead_time_demand":
            round(
                lead_time_demand,
                2
            ),

        "safety_stock_days":
            safety_stock_days,

        "safety_stock":
            round(
                safety_stock,
                2
            ),

        "target_inventory":
            round(
                target_inventory,
                2
            ),

        "available_storage":
            round(
                available_storage,
                2
            ),

        "recommended_order_quantity":
            recommended_order,

        "projected_inventory":
            round(
                projected_inventory,
                2
            ),

        "storage_utilization_percent":
            round(
                storage_utilization,
                2
            ),

        "status":
            status,

        "recommendation":
            recommendation
    }


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    result = calculate_reorder_recommendation(

        product_id="ITEM_001",

        current_stock=50,

        storage_capacity=3000,

        lead_time_days=2,

        safety_stock_days=2

    )


    print("\n")

    print("=" * 60)

    print(
        "SMART REORDER RECOMMENDATION"
    )

    print("=" * 60)


    for key, value in result.items():

        print(
            f"{key}: {value}"
        )