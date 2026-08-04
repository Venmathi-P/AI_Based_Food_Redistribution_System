from datetime import date


def predict_waste(item):
    """
    Simple AI Waste Prediction
    Returns:
        risk
        score
        recommendation
    """

    today = date.today()

    days_left = (item.expiry_date - today).days

    score = 0

    # --------------------------
    # Expiry Factor
    # --------------------------
    if days_left <= 2:
        score += 50

    elif days_left <= 5:
        score += 35

    elif days_left <= 10:
        score += 20

    # --------------------------
    # Stock Factor
    # --------------------------
    if item.quantity >= 100:
        score += 35

    elif item.quantity >= 50:
        score += 20

    elif item.quantity >= 20:
        score += 10

    # --------------------------
    # Storage Factor
    # --------------------------
    storage = item.storage_type.lower()

    if storage == "room temperature":
        score += 15

    elif storage == "refrigerated":
        score += 8

    elif storage == "cold":
        score += 5

    elif storage == "frozen":
        score += 0

    # --------------------------
    # Risk Level
    # --------------------------
    if score >= 70:
        risk = "High"

    elif score >= 40:
        risk = "Medium"

    else:
        risk = "Low"

    # --------------------------
    # Recommendation
    # --------------------------
    if risk == "High":
        recommendation = "Donate Immediately"

    elif risk == "Medium":
        recommendation = "Monitor Daily"

    else:
        recommendation = "Keep in Inventory"

    return {
        "risk": risk,
        "score": score,
        "recommendation": recommendation
    }