from fastapi.testclient import TestClient

from app import app


client = TestClient(app)


def build_record(index: int, label: str):
    return {
        "reaction_time_mean": 300 + index * 10,
        "reaction_time_variance": 20 + index,
        "missed_clicks": index % 3,
        "nback_accuracy": 85 - index,
        "nback_false_positives": index % 4,
        "nback_response_time": 500 + index * 5,
        "memory_span": 7 - (index % 2),
        "recall_accuracy": 80 - index,
        "reverse_recall_accuracy": 70 - index,
        "reading_accuracy": 88 - index,
        "reading_time": 90 + index,
        "hesitation_count": index % 5,
        "stroop_response_time": 650 + index,
        "stroop_interference_score": 25 + index,
        "questionnaire_attention": 4 + (index % 3),
        "questionnaire_mental_fatigue": 5 + (index % 4),
        "questionnaire_cognitive_overload": 4 + (index % 4),
        "questionnaire_productivity_perception": 6 - (index % 3),
        "questionnaire_motivation": 5 + (index % 2),
        "questionnaire_anxiety_tendency": 3 + (index % 3),
        "questionnaire_total": 32 + index,
        "cognitive_load_score": 30 + index,
        "target_label": label,
    }


def test_predict_fallback_when_model_missing():
    response = client.post(
        "/predict",
        json={
            "test_metrics": {"reaction_time_mean": 430},
            "questionnaire_scores": {"total": 34},
            "cognitive_load_score": 44,
        },
    )

    assert response.status_code == 200
    assert response.json()["label"] == "Moderate Load"


def test_train_endpoint():
    records = [
        build_record(1, "Low Cognitive Load"),
        build_record(2, "Low Cognitive Load"),
        build_record(3, "Moderate Load"),
        build_record(4, "Moderate Load"),
        build_record(5, "High Load"),
        build_record(6, "High Load"),
        build_record(7, "Severe Cognitive Fatigue"),
        build_record(8, "Severe Cognitive Fatigue"),
        build_record(9, "Low Cognitive Load"),
        build_record(10, "Moderate Load"),
    ]

    response = client.post("/train", json={"records": records})

    assert response.status_code == 200
    assert "metrics" in response.json()


def test_train_reference_requires_dataset():
    response = client.post("/train/reference", json={})

    assert response.status_code == 400
