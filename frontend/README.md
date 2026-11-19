# Trendlens — Frontend (React + Vite + Tailwind)

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173. API calls to `/api/*` are proxied to
`http://localhost:8000` (the FastAPI backend) — see `vite.config.js`.

## What's here (Phase 1)

- **Landing page** — hero with an animated SVG trend line, a scrolling
  trending-keyword ticker, feature grid, learning-hub teaser, testimonials, FAQ.
- **Auth** — `/login` and `/register`, backed by `AuthContext` + JWT stored
  in `localStorage`, talking to the FastAPI `/api/auth/*` endpoints.
- **Dashboard** — protected route (`/dashboard`) with a sidebar, stat cards,
  a line chart (interest over time) and bar chart (interest by region),
  built with Recharts on mock data with skeleton loaders while "loading".
- **Theming** — light/dark mode via `ThemeContext`, persisted and
  respecting `prefers-color-scheme` on first load.

## Design tokens

| Token | Value |
|---|---|
| `brand.blue` | `#4285F4` |
| `brand.green` | `#34A853` |
| `brand.yellow` | `#FBBC05` |
| `brand.red` | `#EA4335` |
| Display font | Space Grotesk |
| Body font | Inter |
| Mono / data font | JetBrains Mono |

Defined in `tailwind.config.js`; fonts loaded via Google Fonts in `index.html`.

## Structure

```
src/
  components/   Navbar, Footer, Sidebar, ThemeToggle, StatCard, FeatureCard,
                HeroChart (signature animated hero visual), TrendTicker
  pages/        Landing, Login, Register, Dashboard
  context/      ThemeContext, AuthContext
  services/     api.js (axios + JWT), mockData.js (local dev data)
  routes/       ProtectedRoute
```

## Not yet wired up (coming in later phases)

- Real Google Trends data (Phase 2) — currently all dashboard data is
  mock/deterministic, matching the backend's response shapes exactly so the
  swap is a backend-only change.
- Saved reports, PDF/CSV export, favorites (Phase 3).
- Gamification pages — Trend Detective, Keyword Battle, SEO Quiz,
  achievements, XP, leaderboard (Phase 4). The landing page previews these
  but the actual game screens aren't built yet.
