from fastapi import FastAPI
import torch
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware

from model import FailureModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load scaler
scaler = joblib.load("scaler.pkl")


# Load PyTorch model
model = FailureModel()

model.load_state_dict(
    torch.load("vehicle_failure_model.pth", map_location=torch.device("cpu"))
)

model.eval()


@app.get("/")
def home():

    return {
        "message": "Vehicle Maintenance Prediction API running"
    }


@app.post("/predict")
def predict(data: dict):

    # Convert input → numpy array

    features = np.array([[
        data["air_temp"],
        data["process_temp"],
        data["rpm"],
        data["torque"],
        data["tool_wear"],
        data["type_H"],
        data["type_L"],
        data["type_M"]
    ]])

    # Scale input
    features_scaled = scaler.transform(features)

    # Convert to tensor
    tensor = torch.tensor(features_scaled).float()

    # Predict
    with torch.no_grad():

        prediction = model(tensor).item()

    return {

        "failure_probability": float(prediction)

    }