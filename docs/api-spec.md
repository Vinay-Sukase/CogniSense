# API Specification

Base path: `/api`

## Auth

### `POST /auth/signup`

Request:

```json
{
  "name": "Jane Student",
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "mongo-id",
    "name": "Jane Student",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

### `POST /auth/login`

Authenticates both users and admins.

### `GET /auth/me`

Protected route returning the current profile.

## Sessions

### `POST /sessions`

Protected route creating a cognitive assessment session.

Request:

```json
{
  "testMetrics": {
    "reaction_time_mean": 420,
    "reaction_time_variance": 18,
    "missed_clicks": 1,
    "nback_accuracy": 74,
    "nback_false_positives": 2,
    "nback_response_time": 610,
    "memory_span": 6,
    "recall_accuracy": 78,
    "reverse_recall_accuracy": 65,
    "reading_accuracy": 80,
    "reading_time": 95,
    "hesitation_count": 3,
    "stroop_response_time": 720,
    "stroop_interference_score": 42
  },
  "questionnaireAnswers": [3, 3, 4, 3, 4, 4, 2, 3, 4, 3, 2, 3]
}
```

Response includes:

- stored session
- rule-based score components
- ML prediction
- suggestions
- disclaimer

### `GET /sessions`

Returns the authenticated user's session history.

### `GET /sessions/:sessionId`

Returns a single session belonging to the authenticated user.

## Admin

All admin routes require a JWT with role `admin`.

### `GET /admin/stats`

Returns system counts, score aggregates, and recent sessions.

### `GET /admin/users`

Returns all users excluding password hashes.

### `GET /admin/sessions`

Returns all saved assessment sessions with user references populated.

### `DELETE /admin/users/:userId`

Deletes a user and all linked sessions.

### `GET /admin/export`

Returns a CSV dataset suitable for ML training and analysis.

## ML Service

Base URL default: `http://localhost:8000`

### `POST /train`

Trains multiple classifiers and persists the best-performing one by weighted F1 score.

### `POST /predict`

Scores one feature vector and returns:

```json
{
  "label": "Moderate Load",
  "model": "random_forest",
  "probabilities": {
    "Low Cognitive Load": 0.15,
    "Moderate Load": 0.63,
    "High Load": 0.18,
    "Severe Cognitive Fatigue": 0.04
  }
}
```

