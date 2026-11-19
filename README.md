# Trendlens — Google Search Analysis Platform

A full-stack search-trend analytics platform: React/Vite/Tailwind frontend,
FastAPI/MongoDB backend, Python (pandas/numpy) for analysis, built to be
extended module by module.

**This delivery is Phase 1** — architecture, auth, homepage, dashboard
layout, and navigation, fully wired and runnable end to end on mock data
that mirrors the real Google Trends response shape.

## Quick start

Terminal 1 — backend:
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # edit with real secrets
# start MongoDB locally, e.g.: docker run -d -p 27017:27017 mongo:7
uvicorn app.main:app --reload
```

Terminal 2 — frontend:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Register an account, log in, and you'll land
on the dashboard.

> **No internet access was available while generating this project**, so
> none of the install/build/run commands above have been executed here —
> they've been written and reviewed carefully, but run them locally to
> confirm, and open an issue-style note back to me if anything doesn't
> come up clean so I can fix it fast.

## Roadmap

| Phase | Contents | Status |
|---|---|---|
| 1 | Setup, folder structure, JWT auth, homepage, dashboard layout, responsive UI, mock data, navigation | ✅ this delivery |
| 2 | Real data source integration (pytrends or API), interactive analytics endpoints beyond the current mock set, richer charts (heatmap, radar, bubble) | next |
| 3 | Saved reports, PDF/CSV export, search history, favorites, AI insights, forecasting | planned |
| 4 | Gamification: Trend Detective, Keyword Battle, SEO Quiz, achievements, XP/levels, streaks, leaderboard | planned |
| 5 | Performance optimization, testing, deployment, docs | planned |

## Repo layout

```
backend/    FastAPI app (see backend/README.md)
frontend/   React app (see frontend/README.md)
```

Say the word and I'll start Phase 2 — that's where the real Google Trends
data source (pytrends, or another provider if you have one) plugs into
`backend/app/services/mock_data.py`'s current interface.
