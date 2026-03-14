from __future__ import annotations

from pathlib import Path

import pandas as pd


DEFAULT_REFERENCE_DATASET = (
    Path(__file__).resolve().parents[2] / "database" / "exports" / "reference-benchmark-data.csv"
)


def load_reference_dataset(dataset_path: str | None = None) -> pd.DataFrame:
    resolved_path = Path(dataset_path) if dataset_path else DEFAULT_REFERENCE_DATASET

    if not resolved_path.exists():
        raise FileNotFoundError(f"Reference dataset not found: {resolved_path}")

    dataframe = pd.read_csv(resolved_path)
    if "target_label" not in dataframe.columns:
        raise ValueError("Reference dataset must include target_label.")

    return dataframe

