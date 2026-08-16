import pandas as pd

from app.ai.predict_demand import forecast_product


# =========================================================
# WASTE RISK CALCULATION
# =========================================================

def calculate_waste_risk(
    product_id: str,
    current_stock: float,
    days_to_expiry: int,
    forecast=None
):

    # =====================================================
    # NORMALIZE INPUTS
    # =====================================================

    product_id = str(
        product_id
    ).strip()

    current_stock = float(
        current_stock
    )

    days_to_expiry = int(
        days_to_expiry
    )

    # =====================================================
    # VALIDATION
    # =====================================================

    if current_stock < 0:

        raise ValueError(
            "Current stock cannot be negative."
        )

    # =====================================================
    # GET FORECAST
    # =====================================================

    if forecast is None:

        forecast = forecast_product(
            item_id=product_id,
            days=7
        )

    # =====================================================
    # VALIDATE FORECAST
    # =====================================================

    if forecast is None:

        raise ValueError(
            "Forecast is empty."
        )

    if not isinstance(
        forecast,
        pd.DataFrame
    ):

        raise ValueError(
            "Forecast must be a pandas DataFrame."
        )

    if "yhat" not in forecast.columns:

        raise ValueError(
            "Forecast does not contain 'yhat'."
        )

    if forecast.empty:

        raise ValueError(
            "Forecast contains no demand values."
        )

    # =====================================================
    # CLEAN FORECAST DEMAND
    # =====================================================

    daily_demand = pd.to_numeric(
        forecast["yhat"],
        errors="coerce"
    )

    daily_demand = (
        daily_demand
        .fillna(0)
        .clip(lower=0)
        .values
    )

    if len(daily_demand) == 0:

        raise ValueError(
            "Forecast contains no valid demand values."
        )

    # =====================================================
    # EXPECTED DEMAND BEFORE EXPIRY
    # =====================================================

    # Current forecast contains 7 days.
    # Therefore, if expiry is more than 7 days away,
    # we use the complete available 7-day forecast.

    expiry_days = max(
        0,
        min(
            days_to_expiry,
            len(daily_demand)
        )
    )

    if expiry_days == 0:

        expected_demand = 0.0

    else:

        expected_demand = float(
            daily_demand[
                :expiry_days
            ].sum()
        )

    # =====================================================
    # POTENTIAL SURPLUS
    # =====================================================

    surplus = max(
        0,
        current_stock - expected_demand
    )

    # =====================================================
    # AVERAGE DAILY DEMAND
    # =====================================================

    average_daily_demand = float(
        daily_demand.mean()
    )

    # =====================================================
    # STOCK COVERAGE
    # =====================================================

    if average_daily_demand > 0:

        stock_coverage_days = (
            current_stock
            /
            average_daily_demand
        )

    else:

        stock_coverage_days = 999.0

    # =====================================================
    # EXPIRY SCORE
    # =====================================================

    if days_to_expiry <= 1:

        expiry_score = 100

    elif days_to_expiry <= 3:

        expiry_score = 80

    elif days_to_expiry <= 5:

        expiry_score = 60

    elif days_to_expiry <= 7:

        expiry_score = 40

    elif days_to_expiry <= 14:

        expiry_score = 20

    else:

        expiry_score = 5

    # =====================================================
    # INVENTORY SURPLUS SCORE
    # =====================================================

    if current_stock <= 0:

        inventory_score = 0

    elif expected_demand <= 0:

        inventory_score = 100

    else:

        surplus_ratio = (
            surplus
            /
            current_stock
        )

        inventory_score = min(
            100,
            surplus_ratio * 100
        )

    # =====================================================
    # DEMAND MISMATCH SCORE
    # =====================================================

    if current_stock <= 0:

        demand_score = 0

    elif expected_demand <= 0:

        demand_score = 100

    else:

        coverage_ratio = (
            current_stock
            /
            expected_demand
        )

        if coverage_ratio >= 3:

            demand_score = 100

        elif coverage_ratio >= 2:

            demand_score = 80

        elif coverage_ratio >= 1.5:

            demand_score = 60

        elif coverage_ratio >= 1:

            demand_score = 30

        else:

            demand_score = 10

    # =====================================================
    # FINAL WASTE RISK SCORE
    # =====================================================

    risk_score = (

        0.40 * expiry_score

        +

        0.35 * inventory_score

        +

        0.25 * demand_score
    )

    risk_score = round(

        min(
            100,
            max(
                0,
                risk_score
            )
        ),

        2
    )

    # =====================================================
    # RISK LEVEL
    # =====================================================

    if risk_score >= 75:

        risk_level = "CRITICAL"

    elif risk_score >= 50:

        risk_level = "HIGH"

    elif risk_score >= 25:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    # =====================================================
    # RECOMMENDATION
    # =====================================================

    if risk_level == "CRITICAL":

        recommendation = (
            "Immediate redistribution or donation recommended."
        )

    elif risk_level == "HIGH":

        recommendation = (
            "Prioritize donation and reduce new purchases."
        )

    elif risk_level == "MEDIUM":

        recommendation = (
            "Monitor inventory and consider promotional sales."
        )

    else:

        recommendation = (
            "Inventory is within acceptable waste-risk levels."
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

        "days_to_expiry":
            days_to_expiry,

        "average_daily_demand":
            round(
                average_daily_demand,
                2
            ),

        "expected_demand_before_expiry":
            round(
                expected_demand,
                2
            ),

        "potential_surplus":
            round(
                surplus,
                2
            ),

        "stock_coverage_days":
            round(
                stock_coverage_days,
                2
            ),

        "expiry_score":
            round(
                expiry_score,
                2
            ),

        "inventory_score":
            round(
                inventory_score,
                2
            ),

        "demand_score":
            round(
                demand_score,
                2
            ),

        "waste_risk_score":
            risk_score,

        "risk_level":
            risk_level,

        "recommendation":
            recommendation
    }


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    result = calculate_waste_risk(

        product_id="ITEM_001",

        current_stock=20,

        days_to_expiry=3

    )

    print("\n")

    print("=" * 60)

    print(
        "WASTE RISK ANALYSIS"
    )

    print("=" * 60)

    for key, value in result.items():

        print(
            f"{key}: {value}"
        )