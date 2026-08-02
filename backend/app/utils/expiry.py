from datetime import date


def get_expiry_status(expiry_date):

    today = date.today()

    days_left = (expiry_date - today).days


    if days_left < 0:
        status = "Expired"

    elif days_left <= 3:
        status = "Critical"

    elif days_left <= 7:
        status = "Warning"

    else:
        status = "Safe"


    return {
        "days_left": days_left,
        "status": status
    }