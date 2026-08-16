import pandas as pd
from pathlib import Path


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "restaurant_inventory_100days.csv"
)

PROCESSED_PATH = (
    BASE_DIR
    / "data"
    / "restaurant_inventory_processed.csv"
)

MAPPING_PATH = (
    BASE_DIR
    / "data"
    / "product_mapping.csv"
)


# =========================================================
# LOAD DATA
# =========================================================

def load_raw_data():

    print("Loading restaurant inventory dataset...")

    if not DATA_PATH.exists():

        raise FileNotFoundError(
            f"\nDataset not found:\n{DATA_PATH}\n\n"
            "Make sure the CSV is inside the data folder "
            "and the filename is exactly:\n"
            "restaurant_inventory_1000days.csv"
        )

    df = pd.read_csv(DATA_PATH)

    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    return df


# =========================================================
# CHECK REQUIRED COLUMNS
# =========================================================

def check_required_columns(df):

    print("\nChecking dataset columns...")

    required_columns = [

        "Date",
        "Item_ID",
        "Item_Name",
        "Category",
        "Subcategory",
        "Unit",
        "Current_Stock",
        "Reorder_Level",
        "Daily_Usage",
        "Lead_Time",
        "Price_per_Unit",
        "Seasonal_Factor",
        "Waste_Percentage"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        print("\nMissing columns:")

        for column in missing_columns:
            print(f"  - {column}")

        print("\nAvailable columns:")

        print(
            df.columns.tolist()
        )

        raise ValueError(
            "\nDataset columns do not match "
            "the preprocessing code."
        )

    print(
        "All required columns are present."
    )


# =========================================================
# CLEAN DATA
# =========================================================

def clean_data(df):

    print("\nCleaning dataset...")

    # -----------------------------------------------------
    # Convert Date
    # -----------------------------------------------------

    df["Date"] = pd.to_datetime(
        df["Date"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Date"]
    )

    # -----------------------------------------------------
    # Remove duplicates
    # -----------------------------------------------------

    df = df.drop_duplicates()

    # -----------------------------------------------------
    # Numeric columns
    # -----------------------------------------------------

    numeric_columns = [

        "Current_Stock",
        "Reorder_Level",
        "Daily_Usage",
        "Lead_Time",
        "Price_per_Unit",
        "Seasonal_Factor",
        "Waste_Percentage"
    ]

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # -----------------------------------------------------
    # Remove rows with missing important values
    # -----------------------------------------------------

    df = df.dropna(
        subset=[
            "Item_ID",
            "Item_Name",
            "Daily_Usage",
            "Current_Stock"
        ]
    )

    # -----------------------------------------------------
    # Remove invalid values
    # -----------------------------------------------------

    df = df[
        df["Daily_Usage"] >= 0
    ]

    df = df[
        df["Current_Stock"] >= 0
    ]

    df = df[
        df["Waste_Percentage"] >= 0
    ]

    print(
        f"Rows after cleaning: {len(df)}"
    )

    return df


# =========================================================
# CREATE PRODUCT MAPPING
# =========================================================

def create_product_mapping(df):

    print("\nCreating product mapping...")

    mapping = (
        df[
            [
                "Item_ID",
                "Item_Name",
                "Category",
                "Subcategory",
                "Unit"
            ]
        ]
        .drop_duplicates()
        .sort_values(
            "Item_ID"
        )
    )

    mapping.to_csv(
        MAPPING_PATH,
        index=False
    )

    print(
        f"Product mapping saved to:\n"
        f"{MAPPING_PATH}"
    )

    print("\nNumber of products:")

    print(
        mapping["Item_ID"].nunique()
    )

    print("\nProduct mapping preview:")

    print(
        mapping.head(20).to_string(
            index=False
        )
    )

    return mapping


# =========================================================
# CREATE DAILY TIME SERIES
# =========================================================

def create_time_series(df):

    print(
        "\nCreating daily demand time series..."
    )

    daily_data = (

        df.groupby(

            [
                "Date",
                "Item_ID",
                "Item_Name",
                "Category",
                "Subcategory",
                "Unit"
            ],

            as_index=False
        )

        .agg(

            {
                "Daily_Usage": "mean",
                "Current_Stock": "mean",
                "Reorder_Level": "mean",
                "Lead_Time": "mean",
                "Price_per_Unit": "mean",
                "Seasonal_Factor": "mean",
                "Waste_Percentage": "mean"
            }
        )
    )

    daily_data = daily_data.sort_values(

        [
            "Item_ID",
            "Date"
        ]
    )

    return daily_data


# =========================================================
# SAVE PROCESSED DATA
# =========================================================

def save_processed_data(df):

    df.to_csv(
        PROCESSED_PATH,
        index=False
    )

    print(
        f"\nProcessed dataset saved to:\n"
        f"{PROCESSED_PATH}"
    )

# =========================================================
# PREPROCESS DATASET
# =========================================================

def preprocess_dataset():

    print("\n")
    print("=" * 60)
    print("FOOD INVENTORY DATA PREPROCESSING")
    print("=" * 60)

    # -----------------------------------------------------
    # 1. Load dataset
    # -----------------------------------------------------

    df = load_raw_data()

    # -----------------------------------------------------
    # 2. Check columns
    # -----------------------------------------------------

    check_required_columns(df)

    # -----------------------------------------------------
    # 3. Clean data
    # -----------------------------------------------------

    df = clean_data(df)

    # -----------------------------------------------------
    # 4. Product mapping
    # -----------------------------------------------------

    mapping = create_product_mapping(df)

    # -----------------------------------------------------
    # 5. Create time series
    # -----------------------------------------------------

    daily_data = create_time_series(df)

    # -----------------------------------------------------
    # 6. Save processed data
    # -----------------------------------------------------

    save_processed_data(daily_data)

    print("\n")
    print("=" * 60)
    print("PREPROCESSING COMPLETED SUCCESSFULLY")
    print("=" * 60)

    return {
        "processed_dataset": str(PROCESSED_PATH),
        "product_mapping": str(MAPPING_PATH),
        "products": int(
            daily_data["Item_ID"].nunique()
        ),
        "dates": int(
            daily_data["Date"].nunique()
        ),
        "records": int(
            len(daily_data)
        )
    }

# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    print("\n")
    print("=" * 60)
    print("FOOD INVENTORY DATA PREPROCESSING")
    print("=" * 60)

    # -----------------------------------------------------
    # 1. Load dataset
    # -----------------------------------------------------

    df = load_raw_data()

    # -----------------------------------------------------
    # 2. Show original columns
    # -----------------------------------------------------

    print("\nOriginal columns:")

    print(
        df.columns.tolist()
    )

    # -----------------------------------------------------
    # 3. Check columns
    # -----------------------------------------------------

    check_required_columns(
        df
    )

    # -----------------------------------------------------
    # 4. Missing values
    # -----------------------------------------------------

    print("\nMissing values:")

    print(
        df.isnull().sum()
    )

    # -----------------------------------------------------
    # 5. Clean
    # -----------------------------------------------------

    df = clean_data(
        df
    )

    # -----------------------------------------------------
    # 6. Product mapping
    # -----------------------------------------------------

    mapping = create_product_mapping(
        df
    )

    # -----------------------------------------------------
    # 7. Create time series
    # -----------------------------------------------------

    daily_data = create_time_series(
        df
    )

    # -----------------------------------------------------
    # 8. Save processed data
    # -----------------------------------------------------

    save_processed_data(
        daily_data
    )

    # -----------------------------------------------------
    # 9. Final information
    # -----------------------------------------------------

    print("\n")
    print("=" * 60)
    print("PREPROCESSING COMPLETED SUCCESSFULLY")
    print("=" * 60)

    print(
        f"\nProducts: "
        f"{daily_data['Item_ID'].nunique()}"
    )

    print(
        f"Dates: "
        f"{daily_data['Date'].nunique()}"
    )

    print(
        f"Records: "
        f"{len(daily_data)}"
    )

    print(
        f"Date range: "
        f"{daily_data['Date'].min().date()} "
        f"to "
        f"{daily_data['Date'].max().date()}"
    )

    print("\nProcessed data preview:")

    print(
        daily_data.head(10).to_string(
            index=False
        )
    )

    print("\n")
    print("Generated files:")

    print(
        f"1. {PROCESSED_PATH}"
    )

    print(
        f"2. {MAPPING_PATH}"
    )