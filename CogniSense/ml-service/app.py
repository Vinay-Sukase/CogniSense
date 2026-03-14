from __future__ import annotations

from typing import Dict, List

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from models.model_manager import load_artifact, save_artifact
from pipeline.preprocess import FeatureBuilder
from training.reference_loader import load_reference_dataset
from training.trainer import train_models


app = FastAPI(
    title="Cognitive Load ML Service",
    description="FastAPI microservice for training and prediction.",
    version="1.0.0",
)

feature_builder = FeatureBuilder()


class QuestionnaireScores(BaseModel):
    attention: float = 0
    mental_fatigue: float = 0
    cognitive_overload: float = 0
    productivity_perception: float = 0
    motivation: float = 0
    anxiety_tendency: float = 0
    total: float = 0


class TestMetrics(BaseModel):
    reaction_time_mean: float = 0
    reaction_time_variance: float = 0
    missed_clicks: float = 0
    nback_accuracy: float = 0
    nback_false_positives: float = 0
    nback_response_time: float = 0
    memory_span: float = 0
    recall_accuracy: float = 0
    reverse_recall_accuracy: float = 0
    reading_accuracy: float = 0
    reading_time: float = 0
    hesitation_count: float = 0
    stroop_response_time: float = 0
    stroop_interference_score: float = 0


class PredictRequest(BaseModel):
    test_metrics: TestMetrics
    questionnaire_scores: QuestionnaireScores
    cognitive_load_score: float = Field(default=0, ge=0, le=100)


class TrainRequest(BaseModel):
    records: List[Dict]


class TrainReferenceRequest(BaseModel):
    dataset_path: str | None = None


def fallback_prediction(score: float) -> Dict:
    if score <= 25:
        label = "Low Cognitive Load"
    elif score <= 50:
        label = "Moderate Load"
    elif score <= 75:
        label = "High Load"
    else:
        label = "Severe Cognitive Fatigue"

    return {"label": label, "model": "score-fallback", "probabilities": {}}


@app.get("/health")
def health() -> Dict:
    return {"status": "ok", "service": "ml-service"}


@app.post("/train")
def train_model(request: TrainRequest) -> Dict:
    if not request.records:
        raise HTTPException(status_code=400, detail="Training records are required.")

    dataframe = pd.DataFrame(request.records)
    if "target_label" not in dataframe.columns:
        raise HTTPException(status_code=400, detail="Each record must include target_label.")

    result = train_models(dataframe)
    save_artifact(
        {
            "model_name": result.model_name,
            "pipeline": result.pipeline,
            "metrics": result.metrics,
        }
    )

    return {
        "message": "Training completed successfully.",
        "model_name": result.model_name,
        "metrics": result.metrics,
    }


@app.post("/train/reference")
def train_reference_model(request: TrainReferenceRequest | None = None) -> Dict:
    try:
        dataframe = load_reference_dataset(request.dataset_path if request else None)
    except (FileNotFoundError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error))

    result = train_models(dataframe)
    save_artifact(
        {
            "model_name": result.model_name,
            "pipeline": result.pipeline,
            "metrics": result.metrics,
        }
    )

    return {
        "message": "Reference dataset training completed successfully.",
        "model_name": result.model_name,
        "metrics": result.metrics,
        "records_used": int(len(dataframe)),
    }


@app.post("/predict")
def predict(request: PredictRequest) -> Dict:
    artifact = load_artifact()
    payload = request.model_dump()

    if artifact is None:
        return fallback_prediction(request.cognitive_load_score)

    sample = feature_builder.from_payload(payload)
    pipeline = artifact["pipeline"]
    probabilities = {}

    if hasattr(pipeline, "predict_proba"):
        proba_values = pipeline.predict_proba(sample)[0]
        classes = pipeline.named_steps["model"].classes_
        probabilities = {
            str(label): float(score) for label, score in zip(classes, proba_values)
        }

    prediction = pipeline.predict(sample)[0]
    return {
        "label": str(prediction),
        "model": artifact["model_name"],
        "probabilities": probabilities,
    }
