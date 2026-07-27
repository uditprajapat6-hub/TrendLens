from datetime import datetime, timezone
from typing import Any


def new_search_document(user_id: str, keyword: str) -> dict[str, Any]:
    return {
        "user_id": user_id,
        "keyword": keyword.strip(),
        "searched_at": datetime.now(timezone.utc).isoformat(),
    }