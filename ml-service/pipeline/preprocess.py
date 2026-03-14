from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


FEATURE_COLUMNS: List[str] = [
    "reaction_time_mean",
    "reaction_time_variance",
    "missed_clicks",
    "nback_accuracy",
    "nback_false_positives",
    "nback_response_time",
    "memory_span",
    "recall_accuracy",
    "reverse_recall_accuracy",
    "reading_accuracy",
    "reading_time",
    "hesitation_count",
    "stroop_response_time",
    "stroop_interference_score",
    "questionnaire_attention",
    "questionnaire_mental_fatigue",
    "questionnaire_cognitive_overload",
    "questionnaire_productivity_perception",
    "questionnaire_motivation",
    "questionnaire_anxiety_tendency",
    "questionnaire_total",
    "cognitive_load_score",
]


@dataclass
class FeatureBuilder:
    feature_columns: List[str] = None

    def __post_init__(self) -> None:
        self.feature_columns = self.feature_columns or FEATURE_COLUMNS

    def from_payload(self, payload: Dict) -> pd.DataFrame:
        row = {
            "reaction_time_mean": payload["test_metrics"].get("reaction_time_mean", 0),
            "reaction_time_variance": payload["test_metrics"].get("reaction_time_variance", 0),
            "missed_clicks": payload["test_metrics"].get("missed_clicks", 0),
            "nback_accuracy": payload["test_metrics"].get("nback_accuracy", 0),
            "nback_false_positives": payload["test_metrics"].get("nback_false_positives", 0),
            "nback_response_time": payload["test_metrics"].get("nback_response_time", 0),
            "memory_span": payload["test_metrics"].get("memory_span", 0),
            "recall_accuracy": payload["test_metrics"].get("recall_accuracy", 0),
            "reverse_recall_accuracy": payload["test_metrics"].get("reverse_recall_accuracy", 0),
            "reading_accuracy": payload["test_metrics"].get("reading_accuracy", 0),
            "reading_time": payload["test_metrics"].get("reading_time", 0),
            "hesitation_count": payload["test_metrics"].get("hesitation_count", 0),
            "stroop_response_time": payload["test_metrics"].get("stroop_response_time", 0),
            "stroop_interference_score": payload["test_metrics"].get("stroop_interference_score", 0),
            "questionnaire_attention": payload["questionnaire_scores"].get("attention", 0),
            "questionnaire_mental_fatigue": payload["questionnaire_scores"].get("mental_fatigue", 0),
            "questionnaire_cognitive_overload": payload["questionnaire_scores"].get("cognitive_overload", 0),
            "questionnaire_productivity_perception": payload["questionnaire_scores"].get("productivity_perception", 0),
            "questionnaire_motivation": payload["questionnaire_scores"].get("motivation", 0),
            "questionnaire_anxiety_tendency": payload["questionnaire_scores"].get("anxiety_tendency", 0),
            "questionnaire_total": payload["questionnaire_scores"].get("total", 0),
            "cognitive_load_score": payload.get("cognitive_load_score", 0),
        }
        return pd.DataFrame([row], columns=self.feature_columns)


def create_preprocessing_pipeline() -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    return ColumnTransformer(
        transformers=[("numeric", numeric_pipeline, FEATURE_COLUMNS)]
    )
