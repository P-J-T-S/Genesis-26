import joblib
import pandas as pd

model = joblib.load("rfr_model.pkl")
ward_encoder = joblib.load("ward_encoder.pkl")

def derive_signals(date):
    month = date.month
    weekday = date.weekday()  # 0 = Monday

    if month == 9: 
        festival_intensity = 0.9 #Ganesh Chaturthi
    elif month == 10 or month==11:       # Navratri / Diwali
        festival_intensity = 0.8
    elif month in [3, 8]:   # Holi / local fairs
        festival_intensity = 0.4
    else:
        festival_intensity = 0.0

    is_festival_window = int(festival_intensity > 0)

    # Complaint intensity heuristic (historical pattern proxy)
    complaint_intensity = min(
        0.4 + festival_intensity + (0.2 if weekday >= 5 else 0),
        1.0
    )

    # Crowd pressure
    crowd_index = min(
        0.3 + festival_intensity + (0.3 if weekday >= 5 else 0),
        1.0
    )

    # Mumbai monsoon risk
    weather_risk = 0.8 if month in [6, 7, 8, 9] else 0.3

    return {
        "is_festival_window": is_festival_window,
        "festival_intensity": festival_intensity,
        "complaint_intensity": complaint_intensity,
        "crowd_index": crowd_index,
        "weather_risk": weather_risk,
    }

def predict_wpi(date_str, ward_name, zone):
    date = pd.to_datetime(date_str)
    signals = derive_signals(date)

    # Encode ward EXACTLY like training
    ward_coded = int(ward_encoder.transform([ward_name])[0])

    # One-hot encode zone (Central = all zeros)
    zone_features = {
        "zone_East": int(zone == "East"),
        "zone_North": int(zone == "North"),
        "zone_South": int(zone == "South"),
        "zone_West": int(zone == "West"),
    }

    # Construct model input
    X = pd.DataFrame([{
        "month": date.month,
        "day_of_month": date.day,
        **signals,
        "ward_coded": ward_coded,
        **zone_features,
    }])

    predicted_wpi = float(model.predict(X)[0])

    return round(predicted_wpi, 2), signals
