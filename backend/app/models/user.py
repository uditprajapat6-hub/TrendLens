"""
Shape of a user document stored in MongoDB.

Mongo is schemaless, so this class is a lightweight helper for building
consistent documents rather than an ORM model.
"""
from datetime import datetime, timezone
from typing import Any


def new_user_document(name: str, email: str, hashed_password: str) -> dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "name": name,
        "email": email.lower(),
        "hashed_password": hashed_password,
        "xp": 0,
        "level": 1,
        "streak_days": 0,
        "achievements": [],
        "favorites": [],
        "created_at": now,
        "updated_at": now,
    }


def user_to_public(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "xp": doc.get("xp", 0),
        "level": doc.get("level", 1),
        "created_at": doc["created_at"],
    }
