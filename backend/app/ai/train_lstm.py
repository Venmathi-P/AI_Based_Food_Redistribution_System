import os
import numpy as np
import pandas as pd

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping
import joblib


# =========================================================
# PATHS
# =========================================================

DATA_PATH = "data/restaurant_inventory_100days.csv"
MODEL_DIR = "models/lstm"

os.makedirs(MODEL_DIR, exist_ok=True)


# =========================================================
# LOAD DATASET
# =========================================================

print("=" * 60)
print("        LSTM DEMAND FORECASTING")
print("=" * 60)

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(
    f"Dataset loaded successfully: "
    f"{len(df)} records"
)


# =========================================================
# DATA PREPROCESSING
# =========================================================

df["Date"] = pd.to_datetime(df["Date"])

# Select required columns from the actual dataset
df = df[
    [
        "Date",
        "Item_Name",
        "Daily_Usage"
    ]
].copy()

# Rename columns for the LSTM workflow
df = df.rename(
    columns={
        "Item_Name": "Product_Name",
        "Daily_Usage": "Quantity"
    }
)

df = df.sort_values("Date")

print("Data preprocessing completed")

print(
    f"Products found: "
    f"{df['Product_Name'].nunique()}"
)


# =========================================================
# START LSTM TRAINING
# =========================================================

print("\nStarting LSTM training...")
print("-" * 60)


# =========================================================
# TRAIN MODEL FOR EACH PRODUCT
# =========================================================

for product in df["Product_Name"].unique():

    product_df = df[
        df["Product_Name"] == product
    ].copy()

    print(
        f"\nProduct: {product} | "
        f"Records: {len(product_df)}"
    )


    # =====================================================
    # DAILY DEMAND
    # =====================================================

    daily = (
        product_df
        .groupby("Date")["Quantity"]
        .sum()
        .reset_index()
        .sort_values("Date")
    )

    values = daily["Quantity"].values.reshape(-1, 1)

    print(
        f"Daily records: {len(values)}"
    )

    # -----------------------------------------------------
    # CHECK WHETHER ENOUGH DATA EXISTS
    # -----------------------------------------------------

    if len(values) < 30:

        print(
            f"Skipping {product}: "
            f"not enough daily data"
        )

        continue


    # =====================================================
    # NORMALIZATION
    # =====================================================

    scaler = MinMaxScaler()

    scaled = scaler.fit_transform(values)

    print(
        "Data normalization completed"
    )


    # =====================================================
    # CREATE LSTM SEQUENCES
    # =====================================================

    LOOKBACK = 7

    X = []
    y = []

    for i in range(
        LOOKBACK,
        len(scaled)
    ):

        X.append(
            scaled[
                i - LOOKBACK:i
            ]
        )

        y.append(
            scaled[i]
        )

    X = np.array(X)
    y = np.array(y)

    print(
        f"Training sequences created: "
        f"{len(X)}"
    )

    print(
        f"Input shape: {X.shape}"
    )

    print(
        f"Output shape: {y.shape}"
    )


    # =====================================================
    # BUILD LSTM MODEL
    # =====================================================

    print(
        f"\nBuilding LSTM model for {product}..."
    )

    model = Sequential(
        [
            LSTM(
                64,
                input_shape=(
                    LOOKBACK,
                    1
                )
            ),

            Dense(
                32,
                activation="relu"
            ),

            Dense(1)
        ]
    )


    # =====================================================
    # COMPILE MODEL
    # =====================================================

    model.compile(
        optimizer="adam",
        loss="mse"
    )


    # =====================================================
    # DISPLAY MODEL
    # =====================================================

    model.summary()


    # =====================================================
    # TRAIN MODEL
    # =====================================================

    print(
        f"\nTraining LSTM for {product}..."
    )

    early_stopping = EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True
    )

    history = model.fit(
        X,
        y,

        epochs=30,

        batch_size=16,

        validation_split=0.2,

        callbacks=[
            early_stopping
        ],

        verbose=1
    )


    # =====================================================
    # SAVE MODEL
    # =====================================================

    safe_name = (
        product
        .replace(" ", "_")
        .upper()
    )

    model_path = (
        f"{MODEL_DIR}/"
        f"{safe_name}_lstm.keras"
    )

    scaler_path = (
        f"{MODEL_DIR}/"
        f"{safe_name}_scaler.pkl"
    )


    model.save(model_path)

    joblib.dump(
        scaler,
        scaler_path
    )


    # =====================================================
    # TRAINING RESULT
    # =====================================================

    final_loss = history.history[
        "loss"
    ][-1]

    final_val_loss = history.history[
        "val_loss"
    ][-1]

    print(
        f"\nLSTM trained successfully: "
        f"{product}"
    )

    print(
        f"Training Loss: "
        f"{final_loss:.6f}"
    )

    print(
        f"Validation Loss: "
        f"{final_val_loss:.6f}"
    )

    print(
        f"Model saved: "
        f"{model_path}"
    )

    print(
        f"Scaler saved: "
        f"{scaler_path}"
    )

    print("-" * 60)


# =========================================================
# COMPLETION
# =========================================================

print("\n")
print("=" * 60)
print("        LSTM TRAINING COMPLETED")
print("=" * 60)

print(
    f"Models saved in: {MODEL_DIR}"
)

print(
    "Demand forecasting models are ready."
)

print("=" * 60)