# Cognitive Load Detection and Mental Well-being Assistant

Production-style MERN + FastAPI repository for detecting cognitive load, mental fatigue, anxiety tendency, and related well-being indicators from cognitive tests and indirect questionnaire responses.

## Stack

- Frontend: React, TailwindCSS, React Router, Chart.js
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- ML service: FastAPI, scikit-learn, pandas, numpy

## Modules

- Secure user and admin authentication
- Cognitive test battery
- Questionnaire-based behavioral assessment
- Rule-based cognitive load scoring
- ML-assisted cognitive load classification
- External benchmark dataset import and reference-model training
- Suggestions engine for actionable, non-medical well-being guidance
- Admin analytics, dataset export, and user management

## Ethical Safeguards

- This system is not a medical diagnosis tool.
- Results are intended for educational self-awareness and workload monitoring.
- Feedback is phrased responsibly and does not make clinical claims.
- Data handling should follow least-privilege access, encryption in transit, and secure secret management.

## Quick Start

1. Configure the environment files from the included examples.
2. Start MongoDB locally or point to MongoDB Atlas.
3. Run the backend, frontend, and ML service independently, or use Docker Compose.
4. Optionally import benchmark data with `database/importReferenceData.js`. This also creates separate labeled training datasets for each test module.

See [docs/deployment.md](./docs/deployment.md) for deployment details.
