"""
MongoDB connection handling via Motor (async driver).

Usage:
    from app.database import get_database
    db = get_database()
    await db.users.find_one({"email": email})
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import get_settings

settings = get_settings()

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongo_uri)
    return _client


def get_database() -> AsyncIOMotorDatabase:
    return get_client()[settings.mongo_db_name]


async def ensure_indexes() -> None:
    """Create indexes needed by the app. Safe to call on every startup."""
    db = get_database()
    await db.users.create_index("email", unique=True)
    await db.reports.create_index([("user_id", 1), ("created_at", -1)])
    await db.favorites.create_index([("user_id", 1), ("keyword", 1)], unique=True)
    await db.search_history.create_index(
    [("user_id", 1), ("keyword", 1)],
    
)

    await db.search_history.create_index(
    [("user_id", 1), ("searched_at", -1)]
    )


async def close_client() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
