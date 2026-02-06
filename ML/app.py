from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_wpi

app = FastAPI()

class ForecastRequest(BaseModel):
    ward_name: str
    zone: str
    date: str

@app.post("/predict-wpi")
def forecast(req: ForecastRequest):
    wpi, signals = predict_wpi(
        date_str=req.date,
        ward_name=req.ward_name,
        zone=req.zone
    )

    return {
        "ward": req.ward_name,
        "zone": req.zone,
        "date": req.date,
        "predicted_wpi": wpi,
        "features_used": signals
    }
