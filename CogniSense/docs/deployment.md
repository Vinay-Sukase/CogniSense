# Deployment Guide

## Environment Variables

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ML_SERVICE_URL`
- `CLIENT_URL`

### Frontend

- `VITE_API_URL`

## MongoDB Atlas

1. Create a cluster and a database user in MongoDB Atlas.
2. Add the backend host IP to Atlas network access, or allow trusted CIDRs only.
3. Copy the Atlas connection string into `backend/.env` as `MONGODB_URI`.
4. Run `node ../database/seed.js` from the `backend` directory after configuring env vars.

## Local Development

### Backend

1. `cd backend`
2. `npm install`
3. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

### ML Service

1. `cd ml-service`
2. `python -m venv .venv`
3. Activate the environment
4. `pip install -r requirements.txt`
5. `uvicorn app:app --reload`

## Docker Compose

From the repository root:

1. `docker compose up --build`
2. Frontend: `http://localhost:5173`
3. Backend API: `http://localhost:5000/api`
4. ML service: `http://localhost:8000`

## Public Deployment For Students

Recommended stack:

- Frontend: Render Static Site
- Backend: Render Web Service
- ML service: Render Web Service
- Database: MongoDB Atlas

This repo now includes [render.yaml](/C:/Users/Zeb/OneDrive/Documents/New%20project/cognitive-load-system/render.yaml) so you can deploy the full stack from one GitHub repository on Render.

### Steps

1. Push the repository to GitHub.
2. Create a MongoDB Atlas cluster and copy the `mongodb+srv://...` connection string.
3. In Render, create a new Blueprint deployment from the GitHub repo.
4. Render will detect:
   - `cognitive-load-frontend`
   - `cognitive-load-backend`
   - `cognitive-load-ml`
5. In Render, set these secret env vars for the backend:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
6. After deploy, update `CLIENT_URLS` if your final frontend URL differs from the default in the blueprint.
7. Open the frontend URL and share it with students.

### Reference docs

- Render web services: [Render Web Services](https://render.com/docs/web-services)
- Deploy Express on Render: [Render Node/Express](https://render.com/docs/deploy-node-express-app)
- Deploy FastAPI on Render: [Render FastAPI](https://render.com/docs/deploy-fastapi)
- MongoDB Atlas cluster connection: [Atlas Connect to Cluster](https://www.mongodb.com/docs/atlas/connect-to-cluster/)
- MongoDB Atlas connection strings: [Atlas Connection Strings](https://www.mongodb.com/docs/guides/atlas/connection-string/)

## Frontend Hosting

- Build with `npm run build`
- Deploy the static output to Vercel, Netlify, Nginx, or S3 + CloudFront
- Set `VITE_API_URL` to the publicly reachable backend URL

## Backend Hosting

- Suitable targets: Render, Railway, Fly.io, Azure App Service, AWS Elastic Beanstalk, container platforms
- Ensure outbound access to the ML service and MongoDB Atlas
- Store secrets only in the host secret manager

## ML Service Hosting

- Suitable targets: Render, Railway, Fly.io, ECS, Azure Container Apps, GCP Cloud Run
- Persist the `models/` directory if trained artifacts must survive redeployments
- Restrict public access where possible; the preferred topology is private network access from the backend

## Responsible Release Checklist

- Show the non-diagnostic disclaimer in the frontend
- Enable HTTPS on all public services
- Log access only as needed and avoid sensitive payload leakage
- Review data retention and user deletion policies
- Restrict admin accounts using strong secrets and rotation
