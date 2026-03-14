from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Tuple

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline

from pipeline.preprocess import FEATURE_COLUMNS, create_preprocessing_pipeline


MODEL_LABELS = {
    "logistic_regression": LogisticRegression(max_iter=2000),
    "random_forest": RandomForestClassifier(n_estimators=300, random_state=42),
    "gradient_boosting": GradientBoostingClassifier(random_state=42),
}


@dataclass
class TrainResult:
    model_name: str
    pipeline: Pipeline
    metrics: Dict


def train_models(dataframe: pd.DataFrame, target_column: str = "target_label") -> TrainResult:
    features = dataframe[FEATURE_COLUMNS]
    target = dataframe[target_column]

    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )

    best_result: TrainResult | None = None

    for model_name, estimator in MODEL_LABELS.items():
        pipeline = Pipeline(
            steps=[
                ("preprocess", create_preprocessing_pipeline()),
                ("model", estimator),
            ]
        )
        pipeline.fit(x_train, y_train)

        predictions = pipeline.predict(x_test)
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(pipeline, features, target, cv=cv, scoring="accuracy")

        metrics = {
            "accuracy": float(accuracy_score(y_test, predictions)),
            "precision": float(precision_score(y_test, predictions, average="weighted", zero_division=0)),
            "recall": float(recall_score(y_test, predictions, average="weighted", zero_division=0)),
            "f1_score": float(f1_score(y_test, predictions, average="weighted", zero_division=0)),
            "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
            "k_fold_accuracy_mean": float(np.mean(cv_scores)),
            "k_fold_accuracy_std": float(np.std(cv_scores)),
        }

        if best_result is None or metrics["f1_score"] > best_result.metrics["f1_score"]:
            best_result = TrainResult(model_name=model_name, pipeline=pipeline, metrics=metrics)

    if best_result is None:
        raise RuntimeError("Model training did not produce a valid result.")

    return best_result

