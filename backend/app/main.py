"""
Application entrypoint. Run with:
    uvicorn app.main:app --reload
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import close_client, ensure_indexes
from app.routes import auth, dashboard

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await ensure_indexes()
        print("Database indexes successfully ensured.")
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB or ensure indexes on startup: {e}")
    yield
    await close_client()


app = FastAPI(
    title="Search Analytics Platform API",
    description="Backend for the Google Search Analysis Platform.",
    version="0.1.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.frontend_origin.split(",") if o.strip()]
if "*" in origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router)
app.include_router(dashboard.router)


@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok", "environment": settings.environment}
