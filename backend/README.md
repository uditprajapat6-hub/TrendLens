# Trendlens — Backend (FastAPI)

Phase 1 backend: authentication + a mock-data dashboard API with the exact
response shapes Phase 2 will keep when it switches to a real Google Trends
source (pytrends or a paid API).

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then edit .env with real values
```

You need a running MongoDB instance. Easiest local option:

```bash
docker run -d -p 27017:27017 --name trendlens-mongo mongo:7
```

Then set `MONGO_URI=mongodb://localhost:27017` in `.env` (already the default).

## Run

```bash
uvicorn app.main:app --reload
```

API docs (auto-generated): http://localhost:8000/docs

## Endpoints (Phase 1)

| Method | Path                  | Auth | Description                          |
|--------|-----------------------|------|---------------------------------------|
| POST   | /api/auth/register    | no   | Create account, returns JWT pair      |
| POST   | /api/auth/login       | no   | Log in, returns JWT pair              |
| GET    | /api/auth/me          | yes  | Current user profile                  |
| GET    | /api/dashboard/trending | no | Trending keywords right now           |
| GET    | /api/dashboard/interest | no | Interest-over-time series for a keyword |
| GET    | /api/dashboard/compare  | no | Compare up to 5 keywords              |
| GET    | /api/dashboard/regions  | no | Regional interest breakdown           |
| GET    | /api/dashboard/related  | no | Top & rising related queries          |
| GET    | /api/dashboard/summary  | no | Growth %, peak, average for a keyword |
| GET    | /api/dashboard/insights | no | AI-style insight cards for a keyword  |
| GET    | /api/dashboard/overview | yes | Personalized dashboard-home data     |

All `/dashboard/*` data currently comes from `app/services/mock_data.py`,
seeded deterministically per keyword so charts stay stable between calls.
Phase 2 swaps the internals of that module for pytrends / a real API without
changing any route or response shape.

## Project structure

```
app/
  main.py          # FastAPI app, CORS, router wiring, lifespan
  config.py        # Settings from environment variables
  database.py      # Motor (async MongoDB) client + indexes
  core/
    security.py    # Password hashing, JWT create/verify
    deps.py        # get_current_user dependency
  models/
    user.py        # Mongo document shape helpers
  schemas/
    auth.py        # Pydantic request/response models
  routes/
    auth.py
    dashboard.py
  services/
    mock_data.py   # Deterministic synthetic trend data (swap point for Phase 2)
```
