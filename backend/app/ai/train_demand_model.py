import pandas as pd
import numpy as np
import joblib

from pathlib import Path
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "restaurant_inventory_processed.csv"
)

MODEL_DIR = (
    BASE_DIR
    / "models"
)

MAPPING_PATH = (
    BASE_DIR
    / "data"
    / "product_mapping.csv"
)

MODEL_DIR.mkdir(
    exist_ok=True
)


# =========================================================
# SETTINGS
# =========================================================

TEST_DAYS = 14


# =========================================================
# TRAIN ALL MODELS
# =========================================================

def train_models():

    print(
        "Loading processed restaurant inventory dataset..."
    )

    # =====================================================
    # LOAD DATA
    # =====================================================

    if not DATA_PATH.exists():

        raise FileNotFoundError(
            f"\nProcessed dataset not found:\n"
            f"{DATA_PATH}\n\n"
            "Run preprocessing first."
        )

    df = pd.read_csv(
        DATA_PATH
    )

    df["Date"] = pd.to_datetime(
        df["Date"]
    )

    print(
        f"Total records: {len(df)}"
    )

    products = sorted(
        df["Item_ID"].unique()
    )

    print(
        f"Products to train: {len(products)}"
    )

    # =====================================================
    # TRAINING RESULTS
    # =====================================================

    results = []

    trained_models = []

    product_mappings = []

    # =====================================================
    # TRAIN EACH PRODUCT
    # =====================================================

    for item_id in products:

        print("\n" + "=" * 60)

        print(
            f"Training Prophet model for Item ID: {item_id}"
        )

        print("=" * 60)

        # -------------------------------------------------
        # Select product
        # -------------------------------------------------

        product_df = df[
            df["Item_ID"] == item_id
        ].copy()

        product_df = product_df.sort_values(
            "Date"
        )

        # -------------------------------------------------
        # Get product name
        # -------------------------------------------------

        product_name = (
            product_df["Item_Name"]
            .iloc[0]
        )

        print(
            f"Product name: {product_name}"
        )

        # -------------------------------------------------
        # Convert to Prophet format
        # -------------------------------------------------

        prophet_df = product_df[
            [
                "Date",
                "Daily_Usage"
            ]
        ].rename(
            columns={
                "Date": "ds",
                "Daily_Usage": "y"
            }
        )

        # -------------------------------------------------
        # Convert demand to numeric
        # -------------------------------------------------

        prophet_df["y"] = pd.to_numeric(
            prophet_df["y"],
            errors="coerce"
        )

        prophet_df = prophet_df.dropna()

        # -------------------------------------------------
        # Remove negative demand
        # -------------------------------------------------

        prophet_df = prophet_df[
            prophet_df["y"] >= 0
        ]

        # -------------------------------------------------
        # Check data size
        # -------------------------------------------------

        if len(prophet_df) <= TEST_DAYS:

            print(
                f"Skipping {item_id}: "
                f"not enough records."
            )

            continue

        # -------------------------------------------------
        # Train / Test split
        # -------------------------------------------------

        train = prophet_df.iloc[
            :-TEST_DAYS
        ].copy()

        test = prophet_df.iloc[
            -TEST_DAYS:
        ].copy()

        print(
            f"Training records: {len(train)}"
        )

        print(
            f"Testing records : {len(test)}"
        )

        # -------------------------------------------------
        # Create Prophet model
        # -------------------------------------------------

        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=False
        )

        # -------------------------------------------------
        # Train model
        # -------------------------------------------------

        print(
            "Training model..."
        )

        model.fit(
            train
        )

        # -------------------------------------------------
        # Predict test period
        # -------------------------------------------------

        future = model.make_future_dataframe(
            periods=TEST_DAYS,
            freq="D"
        )

        forecast = model.predict(
            future
        )

        # -------------------------------------------------
        # Get predictions for test period
        # -------------------------------------------------

        predictions = forecast[
            [
                "ds",
                "yhat"
            ]
        ].tail(
            TEST_DAYS
        )

        # -------------------------------------------------
        # Evaluation
        # -------------------------------------------------

        actual = test[
            "y"
        ].values

        predicted = predictions[
            "yhat"
        ].values

        # Demand cannot be negative

        predicted = np.maximum(
            predicted,
            0
        )

        # -------------------------------------------------
        # MAE
        # -------------------------------------------------

        mae = mean_absolute_error(
            actual,
            predicted
        )

        # -------------------------------------------------
        # RMSE
        # -------------------------------------------------

        rmse = np.sqrt(
            mean_squared_error(
                actual,
                predicted
            )
        )

        # -------------------------------------------------
        # MAPE
        # -------------------------------------------------

        non_zero = actual != 0

        if non_zero.any():

            mape = (
                np.mean(
                    np.abs(
                        (
                            actual[non_zero]
                            -
                            predicted[non_zero]
                        )
                        /
                        actual[non_zero]
                    )
                )
                * 100
            )

        else:

            mape = np.nan

        # -------------------------------------------------
        # Print performance
        # -------------------------------------------------

        print(
            "\nModel performance:"
        )

        print(
            f"MAE  : {mae:.2f}"
        )

        print(
            f"RMSE : {rmse:.2f}"
        )

        if np.isnan(mape):

            print(
                "MAPE : N/A"
            )

        else:

            print(
                f"MAPE : {mape:.2f}%"
            )

        # -------------------------------------------------
        # Model filename
        # -------------------------------------------------

        model_name = (
            f"ITEM_{int(item_id):03d}_prophet.pkl"
        )

        model_path = (
            MODEL_DIR
            / model_name
        )

        # -------------------------------------------------
        # Save model
        # -------------------------------------------------

        joblib.dump(
            model,
            model_path
        )

        print(
            "\nModel saved:"
        )

        print(
            model_path
        )

        # =================================================
        # CREATE PRODUCT -> MODEL MAPPING
        # =================================================

        product_mappings.append(
            {
                "product_id":
                    f"ITEM_{int(item_id):03d}",

                "dataset_item_id":
                    int(item_id),

                "dataset_product_name":
                    product_name,

                "model_file":
                    model_name
            }
        )

        print(
            "Product mapping created:"
        )

        print(
            f"  {product_name} "
            f"-> ITEM_{int(item_id):03d} "
            f"-> {model_name}"
        )

        # -------------------------------------------------
        # Remember trained model
        # -------------------------------------------------

        trained_models.append(
            model_name
        )

        # -------------------------------------------------
        # Save performance
        # -------------------------------------------------

        results.append(
            {
                "Item ID":
                    item_id,

                "Item Name":
                    product_name,

                "Training Records":
                    len(train),

                "Test Records":
                    len(test),

                "MAE":
                    round(mae, 2),

                "RMSE":
                    round(rmse, 2),

                "MAPE":
                    round(mape, 2)
                    if not np.isnan(mape)
                    else np.nan
            }
        )

    # =====================================================
    # SAVE PRODUCT -> MODEL MAPPING
    # =====================================================

    mapping_df = pd.DataFrame(
        product_mappings
    )

    mapping_df.to_csv(
        MAPPING_PATH,
        index=False
    )

    print(
        "\n" + "=" * 60
    )

    print(
        "PRODUCT -> MODEL MAPPING SAVED"
    )

    print(
        "=" * 60
    )

    print(
        f"Mapping file:\n{MAPPING_PATH}"
    )

    if not mapping_df.empty:

        print(
            "\nProduct -> Model mapping:"
        )

        print(
            mapping_df.to_string(
                index=False
            )
        )

    else:

        print(
            "No product mappings were created."
        )

    # =====================================================
    # SAVE PERFORMANCE RESULTS
    # =====================================================

    results_df = pd.DataFrame(
        results
    )

    performance_path = (
        MODEL_DIR
        / "model_performance.csv"
    )

    results_df.to_csv(
        performance_path,
        index=False
    )

    # =====================================================
    # FINAL OUTPUT
    # =====================================================

    print("\n")

    print("=" * 60)

    print(
        "ALL MODELS TRAINED"
    )

    print("=" * 60)

    if not results_df.empty:

        print(
            results_df.to_string(
                index=False
            )
        )

    else:

        print(
            "No models were trained."
        )

    print(
        f"\nPerformance file:"
        f"\n{performance_path}"
    )

    # =====================================================
    # RETURN RESULT TO FASTAPI
    # =====================================================

    return {

        "models_trained":
            len(trained_models),

        "models":
            trained_models,

        "mapping_file":
            str(
                MAPPING_PATH
            ),

        "performance_file":
            str(
                performance_path
            )
    }


# =========================================================
# RUN DIRECTLY
# =========================================================

if __name__ == "__main__":

    result = train_models()

    print("\n")

    print("=" * 60)

    print(
        "TRAINING RESULT"
    )

    print("=" * 60)

    print(
        f"Models trained: "
        f"{result['models_trained']}"
    )

    print(
        "\nModels:"
    )

    for model in result["models"]:

        print(
            f"  - {model}"
        )

    print(
        "\nMapping file:"
    )

    print(
        result["mapping_file"]
    )

    print(
        "\nPerformance file:"
    )

    print(
        result["performance_file"]
    )