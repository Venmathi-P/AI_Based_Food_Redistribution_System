import joblib

from pathlib import Path


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"


# =========================================================
# NORMALIZE ITEM ID
# =========================================================

def normalize_item_id(item_id):

    item_id = str(
        item_id
    ).strip()

    # -----------------------------------------------------
    # If already formatted:
    #
    # ITEM_001
    # -----------------------------------------------------

    if item_id.upper().startswith(
        "ITEM_"
    ):

        number = item_id.split(
            "_"
        )[-1]

        try:

            return (
                f"ITEM_{int(number):03d}"
            )

        except ValueError:

            return item_id

    # -----------------------------------------------------
    # If numeric:
    #
    # 1 → ITEM_001
    # 2 → ITEM_002
    # -----------------------------------------------------

    try:

        return (
            f"ITEM_{int(float(item_id)):03d}"
        )

    except ValueError:

        return item_id


# =========================================================
# LOAD PROPHET MODEL
# =========================================================

def load_model(item_id: str):

    model_name = normalize_item_id(
        item_id
    )

    model_path = (
        MODEL_DIR
        /
        f"{model_name}_prophet.pkl"
    )

    print(
        f"[AI] Looking for model: "
        f"{model_path}"
    )

    # -----------------------------------------------------
    # Check model exists
    # -----------------------------------------------------

    if not model_path.exists():

        available_models = sorted(
            MODEL_DIR.glob(
                "*_prophet.pkl"
            )
        )

        available_names = [
            model.stem.replace(
                "_prophet",
                ""
            )
            for model in available_models
        ]

        raise FileNotFoundError(

            f"Model not found for "
            f"item '{item_id}'. "

            f"Expected: {model_path}. "

            f"Available models: "
            f"{available_names}"
        )

    # -----------------------------------------------------
    # Load model
    # -----------------------------------------------------

    try:

        model = joblib.load(
            model_path
        )

    except Exception as e:

        raise RuntimeError(

            f"Failed to load Prophet model "
            f"'{model_path}': {str(e)}"
        )

    return model


# =========================================================
# DAILY FORECAST
# =========================================================

def forecast_product(
    item_id: str,
    days: int = 7
):

    # -----------------------------------------------------
    # Validate days
    # -----------------------------------------------------

    if days <= 0:

        raise ValueError(
            "Forecast days must be greater than 0"
        )

    # -----------------------------------------------------
    # Load model
    # -----------------------------------------------------

    model = load_model(
        item_id
    )

    # -----------------------------------------------------
    # Create future dates
    # -----------------------------------------------------

    future = model.make_future_dataframe(
        periods=days,
        freq="D"
    )

    # -----------------------------------------------------
    # Generate forecast
    # -----------------------------------------------------

    forecast = model.predict(
        future
    )

    # -----------------------------------------------------
    # Required columns
    # -----------------------------------------------------

    required_columns = [
        "ds",
        "yhat",
        "yhat_lower",
        "yhat_upper"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in forecast.columns
    ]

    if missing_columns:

        raise ValueError(

            f"Prophet forecast is missing "
            f"columns: {missing_columns}"
        )

    # -----------------------------------------------------
    # Get future predictions
    # -----------------------------------------------------

    future_forecast = forecast[
        required_columns
    ].tail(
        days
    ).copy()

    # -----------------------------------------------------
    # Demand cannot be negative
    # -----------------------------------------------------

    future_forecast[
        "yhat"
    ] = (
        future_forecast[
            "yhat"
        ]
        .clip(lower=0)
    )

    future_forecast[
        "yhat_lower"
    ] = (
        future_forecast[
            "yhat_lower"
        ]
        .clip(lower=0)
    )

    future_forecast[
        "yhat_upper"
    ] = (
        future_forecast[
            "yhat_upper"
        ]
        .clip(lower=0)
    )

    # -----------------------------------------------------
    # Round demand
    # -----------------------------------------------------

    future_forecast[
        "yhat"
    ] = (
        future_forecast[
            "yhat"
        ]
        .round()
        .astype(int)
    )

    future_forecast[
        "yhat_lower"
    ] = (
        future_forecast[
            "yhat_lower"
        ]
        .round()
        .astype(int)
    )

    future_forecast[
        "yhat_upper"
    ] = (
        future_forecast[
            "yhat_upper"
        ]
        .round()
        .astype(int)
    )

    return future_forecast


# =========================================================
# WEEKLY FORECAST
# =========================================================

def weekly_forecast(
    item_id: str
):

    daily = forecast_product(
        item_id=item_id,
        days=7
    )

    # -----------------------------------------------------
    # Total demand
    # -----------------------------------------------------

    total_demand = int(
        daily[
            "yhat"
        ].sum()
    )

    # -----------------------------------------------------
    # Average daily demand
    # -----------------------------------------------------

    average_daily_demand = round(
        daily[
            "yhat"
        ].mean(),
        2
    )

    return {

        "item_id": str(
            item_id
        ),

        "forecast_days": 7,

        "daily_forecast": [

            {
                "date":
                    row["ds"]
                    .strftime(
                        "%Y-%m-%d"
                    ),

                "predicted_demand":
                    int(
                        row["yhat"]
                    ),

                "lower":
                    int(
                        row["yhat_lower"]
                    ),

                "upper":
                    int(
                        row["yhat_upper"]
                    )
            }

            for _, row
            in daily.iterrows()
        ],

        "weekly_demand":
            total_demand,

        "average_daily_demand":
            average_daily_demand
    }


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    # -----------------------------------------------------
    # TEST WITH ITEM 1
    #
    # In the new dataset:
    # Item 1 = Paneer
    # -----------------------------------------------------

    item_id = "1"

    result = weekly_forecast(
        item_id
    )

    print("\n")

    print("=" * 60)
    print("DEMAND FORECAST")
    print("=" * 60)

    print(
        "Item ID:",
        result["item_id"]
    )

    print(
        "Predicted weekly demand:",
        result["weekly_demand"]
    )

    print(
        "Average daily demand:",
        result[
            "average_daily_demand"
        ]
    )

    print("\nDaily forecast:")

    for day in result[
        "daily_forecast"
    ]:

        print(
            day["date"],
            "->",
            day[
                "predicted_demand"
            ]
        )