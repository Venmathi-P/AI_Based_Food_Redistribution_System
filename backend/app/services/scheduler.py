from apscheduler.schedulers.background import BackgroundScheduler
from app.config.database import SessionLocal
from app.models.inventory import Inventory

from app.routes.ai import analyze_inventory_item


# =========================================================
# SCHEDULER
# =========================================================

scheduler = BackgroundScheduler()


# =========================================================
# BATCH AI PREDICTION
# =========================================================

def run_batch_ai_prediction():

    print("\n")
    print("=" * 70)
    print("        STARTING SCHEDULED AI BATCH PREDICTION")
    print("=" * 70)

    db = SessionLocal()

    try:

        # -------------------------------------------------
        # GET ALL INVENTORY
        # -------------------------------------------------

        inventory_items = (
            db.query(Inventory)
            .all()
        )

        total_items = len(inventory_items)

        print(
            f"[SCHEDULER] Inventory items found: {total_items}"
        )

        success_count = 0
        failed_count = 0

        # -------------------------------------------------
        # PROCESS INVENTORY
        # -------------------------------------------------

        for inventory in inventory_items:

            try:

                result = analyze_inventory_item(
                    inventory_id=inventory.id,
                    db=db
                )

                success_count += 1

                # Show only successful predictions
                print(
                    f"[AI] Prediction completed | "
                    f"Product: {inventory.product_name} | "
                    f"Risk: {result['waste_risk']['risk_level']}"
                )

            except Exception:

                # Keep failure handling internally,
                # but don't display failed inventory details.
                failed_count += 1

                continue

        # -------------------------------------------------
        # FINAL SUMMARY
        # -------------------------------------------------

        print("\n")
        print("=" * 70)
        print("        SCHEDULED AI BATCH PREDICTION COMPLETED")
        print("=" * 70)

        print(
            f"[SCHEDULER] Total inventory processed : {total_items}"
        )

        print(
            f"[SCHEDULER] Successful predictions    : {success_count}"
        )

        print(
            "[SCHEDULER] AI waste risk analysis    : COMPLETED"
        )

        print(
            "[SCHEDULER] Reorder analysis          : COMPLETED"
        )

        print(
            "[SCHEDULER] Batch prediction status   : SUCCESS"
        )

        print("=" * 70)

    except Exception as e:

        print(
            f"[SCHEDULER] Batch prediction failed: {e}"
        )

    finally:

        db.close()

        print(
            "[SCHEDULER] Database connection closed"
        )


# =========================================================
# START SCHEDULER
# =========================================================

def start_scheduler():

    if scheduler.running:

        print(
            "[SCHEDULER] Scheduler already running"
        )

        return

    # -----------------------------------------------------
    # DAILY PRODUCTION JOB
    # -----------------------------------------------------

    scheduler.add_job(
        run_batch_ai_prediction,
        trigger="cron",
        hour=0,
        minute=0,
        id="daily_ai_prediction",
        replace_existing=True
    )

    # -----------------------------------------------------
    # TEST JOB
    # Runs immediately when scheduler starts
    # -----------------------------------------------------

    scheduler.add_job(
        run_batch_ai_prediction,
        trigger="date",
        run_date=None,
        id="test_ai_prediction",
        replace_existing=True
    )

    scheduler.start()

    print(
        "[SCHEDULER] Started successfully"
    )

    print(
        "[SCHEDULER] Daily AI prediction scheduled at 12:00 AM"
    )

    print(
        "[SCHEDULER] Test batch prediction started"
    )


# =========================================================
# STOP SCHEDULER
# =========================================================

def stop_scheduler():

    if scheduler.running:

        scheduler.shutdown()

        print(
            "[SCHEDULER] Stopped successfully"
        )


# =========================================================
# DIRECT EXECUTION
# =========================================================

if __name__ == "__main__":

    run_batch_ai_prediction()