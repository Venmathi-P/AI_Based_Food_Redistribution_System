import subprocess
import sys

from pathlib import Path


# =========================================================
# PATH
# =========================================================

AI_DIR = Path(__file__).resolve().parent

PREPROCESSING_FILE = (
    AI_DIR / "preprocessing.py"
)

TRAINING_FILE = (
    AI_DIR / "train_demand_model.py"
)

MODELS_DIR = (
    AI_DIR / "models"
)


# =========================================================
# RUN PYTHON SCRIPT
# =========================================================

def run_script(script_path):

    print(
        f"\n[AI TRAINING] Running:"
        f"\n{script_path}"
    )

    result = subprocess.run(

        [
            sys.executable,
            str(script_path)
        ],

        cwd=str(AI_DIR),

        capture_output=True,

        text=True
    )

    print(
        result.stdout
    )

    if result.stderr:

        print(
            "[AI TRAINING ERROR]"
        )

        print(
            result.stderr
        )

    if result.returncode != 0:

        raise RuntimeError(

            f"Script failed: "
            f"{script_path.name}\n\n"
            f"{result.stderr}"
        )

    return result.stdout


# =========================================================
# REMOVE OLD PROPHET MODELS
# =========================================================

def clear_old_models():

    print("\n")
    print("-" * 60)
    print("CLEARING OLD PROPHET MODELS")
    print("-" * 60)

    MODELS_DIR.mkdir(
        exist_ok=True
    )

    old_models = list(
        MODELS_DIR.glob(
            "*_prophet.pkl"
        )
    )

    if not old_models:

        print(
            "No old Prophet models found."
        )

        return 0

    deleted_count = 0

    for model in old_models:

        try:

            model.unlink()

            deleted_count += 1

            print(
                f"Deleted: {model.name}"
            )

        except Exception as e:

            raise RuntimeError(

                f"Failed to delete "
                f"{model.name}: {e}"
            )

    print(
        f"\nDeleted {deleted_count} old "
        f"Prophet model(s)."
    )

    return deleted_count


# =========================================================
# TRAIN ALL AI MODELS
# =========================================================

def train_all_models():

    print("\n")
    print("=" * 60)
    print("STARTING COMPLETE AI MODEL TRAINING")
    print("=" * 60)

    # =====================================================
    # CHECK FILES
    # =====================================================

    if not PREPROCESSING_FILE.exists():

        raise FileNotFoundError(
            f"Preprocessing file not found:\n"
            f"{PREPROCESSING_FILE}"
        )

    if not TRAINING_FILE.exists():

        raise FileNotFoundError(
            f"Training file not found:\n"
            f"{TRAINING_FILE}"
        )

    # =====================================================
    # STEP 1 — CLEAR OLD MODELS
    # =====================================================

    deleted_models = (
        clear_old_models()
    )

    # =====================================================
    # STEP 2 — PREPROCESSING
    # =====================================================

    print("\n")
    print("-" * 60)
    print("STEP 1: PREPROCESSING DATA")
    print("-" * 60)

    preprocessing_output = run_script(
        PREPROCESSING_FILE
    )

    # =====================================================
    # STEP 3 — TRAIN PROPHET MODELS
    # =====================================================

    print("\n")
    print("-" * 60)
    print("STEP 2: TRAINING PROPHET MODELS")
    print("-" * 60)

    training_output = run_script(
        TRAINING_FILE
    )

    # =====================================================
    # GENERATED FILE PATHS
    # =====================================================

    data_dir = (
        AI_DIR / "data"
    )

    processed_file = (
        data_dir
        / "restaurant_inventory_processed.csv"
    )

    mapping_file = (
        data_dir
        / "product_mapping.csv"
    )

    performance_file = (
        MODELS_DIR
        / "model_performance.csv"
    )

    # =====================================================
    # FIND NEW MODELS
    # =====================================================

    model_files = sorted(
        MODELS_DIR.glob(
            "*_prophet.pkl"
        )
    )

    # =====================================================
    # VALIDATE OUTPUT
    # =====================================================

    if not processed_file.exists():

        raise RuntimeError(
            "Training finished but processed "
            "dataset was not created."
        )

    if not mapping_file.exists():

        raise RuntimeError(
            "Training finished but product "
            "mapping was not created."
        )

    if not model_files:

        raise RuntimeError(
            "Training finished but no Prophet "
            "models were created."
        )

    # =====================================================
    # FINAL RESULT
    # =====================================================

    result = {

        "success":
            True,

        "message":
            "AI models trained successfully.",

        "old_models_deleted":
            deleted_models,

        "models_trained":
            len(model_files),

        "models":
            [
                model.name
                for model in model_files
            ],

        "processed_dataset":
            str(
                processed_file
            ),

        "product_mapping":
            str(
                mapping_file
            ),

        "performance_file":
            str(
                performance_file
            )
    }

    # =====================================================
    # PRINT RESULT
    # =====================================================

    print("\n")
    print("=" * 60)
    print("AI MODEL TRAINING COMPLETED")
    print("=" * 60)

    print(
        f"Old models deleted: "
        f"{deleted_models}"
    )

    print(
        f"New models trained: "
        f"{len(model_files)}"
    )

    print("\nModels:")

    for model in model_files:

        print(
            f"  ✓ {model.name}"
        )

    return result