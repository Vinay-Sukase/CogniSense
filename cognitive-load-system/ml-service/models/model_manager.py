from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import joblib


MODEL_DIR = Path(__file__).resolve().parent
MODEL_PATH = MODEL_DIR / "cognitive_load_model.joblib"


def save_artifact(artifact: Dict[str, Any]) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, MODEL_PATH)


def load_artifact() -> Dict[str, Any] | None:
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)

