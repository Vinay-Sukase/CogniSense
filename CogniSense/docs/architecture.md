# System Architecture

## Overview

The platform is split into three deployable services:

1. React frontend for test delivery, dashboards, and admin workflows.
2. Express backend for authentication, persistence, scoring, suggestions, and orchestration.
3. FastAPI ML microservice for model training and cognitive state prediction.

## High-Level Flow

1. A student signs up or logs in through the React client.
2. The client runs five cognitive tests and a 12-question Likert questionnaire.
3. The frontend submits normalized test metrics and questionnaire answers to the Express backend.
4. The backend:
   - Validates the authenticated user
   - Aggregates questionnaire dimension scores
   - Computes the rule-based cognitive load score
   - Calls the ML service `/predict` endpoint
   - Generates supportive suggestions
   - Saves the session in MongoDB
5. The frontend renders the result dashboard and session history with Chart.js.
6. Admins can inspect system-wide statistics, view users and sessions, and export CSV datasets.

## Backend Modules

- `controllers/`: Request orchestration for auth, sessions, and admin flows
- `models/`: Mongoose schemas for `User` and `Session`
- `middleware/`: JWT protection, role authorization, error handling
- `services/`: Token generation, scoring engine, questionnaire aggregation, suggestions, ML client, admin bootstrap
- `routes/`: Resource-oriented API routing

## Data Model

### User

- `_id`
- `name`
- `email`
- `passwordHash`
- `role`
- `created_at`

### Session

- `session_id`
- `user_id`
- `timestamp`
- flattened key metrics for reporting
- nested `test_metrics`
- `questionnaire_scores`
- `cognitive_load_score`
- `cognitive_load_classification`
- `ml_prediction`
- `suggestions`

## Security

- bcrypt password hashing with cost factor 12
- JWT-based route protection
- role-based access control for admin-only APIs
- admin bootstrap credentials supplied only through environment variables
- CORS restricted to configured frontend origin

## Ethical Safeguards

- The platform avoids direct diagnostic claims.
- The questionnaire measures indirect study-related indicators instead of explicit stress diagnosis.
- Result pages include non-medical disclaimers.
- Dataset export should be restricted to authorized administrators and handled using secure storage policies.

