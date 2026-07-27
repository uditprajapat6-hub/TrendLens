"""
Dashboard/analytics endpoints.

All data currently comes from app.services.mock_data. In Phase 2 these
handlers will call a real data source (pytrends or a paid Trends API)
behind the exact same response shapes, so the frontend does not change.
"""
import requests
from fastapi import APIRouter, Depends, Query
from app.database import get_database
from app.models.search_history import new_search_document
from app.core.deps import get_current_user
from app.services import mock_data
from app.config import get_settings

settings = get_settings()
SERPAPI_KEY = settings.serpapi_key
print("MOCK DATA FILE:")
print(mock_data.__file__)
router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/trending")
async def get_trending_now():
    return {"trending": mock_data.trending_now()}


@router.get("/interest")
async def get_interest_over_time(
    keyword: str,
    days: int = 90,
    current_user: dict = Depends(get_current_user),
):
    print("========== ROUTE CALLED ==========")
    db = get_database()
    if not keyword.strip():
        raise HTTPException(status_code=400, detail="Keyword is required")
    await db.search_history.insert_one(
    new_search_document(
        user_id=str(current_user["_id"]),
        keyword=keyword,
    )
)
    
    return {
        "keyword": keyword,
        "series": mock_data.interest_over_time(keyword, days),
    }
@router.get("/compare")
async def get_compare(
    keywords: str = Query(..., description="Comma-separated keywords, max 5"),
    days: int = Query(90, ge=7, le=365),
):
    kw_list = [k.strip() for k in keywords.split(",") if k.strip()][:5]
    return mock_data.compare_keywords(kw_list, days)


@router.get("/regions")
async def get_regions(keyword: str = Query(min_length=1)):
    return {
        "keyword": keyword,
        "regions": mock_data.region_breakdown(keyword),
    }



@router.get("/related")
async def get_related(keyword: str = Query(min_length=1)):
    params = {
        "engine": "google_trends",
        "data_type": "RELATED_QUERIES",
        "q": keyword,
        "api_key": SERPAPI_KEY,
    }

    response = requests.get("https://serpapi.com/search", params=params)
    data = response.json()

    return {
    "top": data.get("related_queries", {}).get("top", []),
    "rising": data.get("related_queries", {}).get("rising", []),
}
@router.get("/insights")
async def get_insights(keyword: str = Query(min_length=1)):
    return {
        "keyword": keyword,
        "insights": mock_data.ai_insights(keyword),
    }

@router.get("/overview")
async def get_overview(current_user: dict = Depends(get_current_user)):
    db = get_database()

    history = (
        await db.search_history.find(
            {"user_id": str(current_user["_id"])}
        )
        .sort("searched_at", -1)
        .limit(5)
        .to_list(5)
    )

    recent_searches = [
        {
            "keyword": item["keyword"],
            "searched_at": item["searched_at"],
        }
        for item in history
    ]

    return {
        "user_xp": current_user.get("xp", 0),
        "user_level": current_user.get("level", 1),
        "trending": mock_data.trending_now(6),
        "recent_searches": recent_searches,
    }
@router.get("/search-stats")
async def get_search_stats(current_user: dict = Depends(get_current_user)):
    db = get_database()

    pipeline = [
        {
            "$match": {
                "user_id": str(current_user["_id"])
            }
        },
        {
            "$group": {
                "_id": "$keyword",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {
                "count": -1
            }
        },
        {
            "$limit": 10
        }
    ]

    stats = await db.search_history.aggregate(pipeline).to_list(10)

    return {
        "stats": [
            {
                "keyword": item["_id"],
                "count": item["count"]
            }
            for item in stats
        ]
    }
@router.delete("/history/{keyword}")
async def delete_search(
    keyword: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()

    await db.search_history.delete_one(
        {
            "user_id": str(current_user["_id"]),
            "keyword": keyword,
        }
    )

    return {"message": "Deleted"}