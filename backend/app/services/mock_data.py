"""
TrendLens data service using SerpAPI Google Trends.
"""

from __future__ import annotations

import os
import time
import random
from datetime import date

import numpy as np
import pandas as pd
import requests

from fastapi import HTTPException
from requests.exceptions import ReadTimeout

from app.config import get_settings

# -----------------------------
# Configuration
# -----------------------------

settings = get_settings()
SERPAPI_KEY = settings.serpapi_key

session = requests.Session()
cache = {}

CATEGORIES = [
    "Technology",
    "Entertainment",
    "Sports",
    "Finance",
    "Health",
    "Travel",
    "Education",
    "Shopping",
]


def _seeded_rng(keyword: str) -> np.random.Generator:
    seed = abs(hash(keyword)) % (2**32)
    return np.random.default_rng(seed)


# ==========================================================
# Interest Over Time
# ==========================================================


def interest_over_time(keyword: str, days: int = 90):

    print(">>> interest_over_time() called <<<", keyword)

    url = "https://serpapi.com/search"

    if days <= 30:
        date_range = "today 1-m"
    elif days <= 90:
        date_range = "today 3-m"
    elif days <= 365:
        date_range = "today 12-m"
    else:
        date_range = "today 5-y"

    params = {
        "engine": "google_trends",
        "data_type": "TIMESERIES",
        "q": keyword,
        "geo": "",
        "date": date_range,
        "api_key": SERPAPI_KEY,
    }

    try:

        start = time.time()

        response = session.get(
            url,
            params=params,
            timeout=60,
        )

        print(f"Interest request took {time.time()-start:.2f} seconds")

        response.raise_for_status()

    except ReadTimeout:
        print("SerpAPI timed out")
        return []

    except requests.RequestException as e:
        print("SerpAPI error:", e)
        return []

    data = response.json()

    if "error" in data:
        print(data["error"])
        return []

    timeline = (
        data.get("interest_over_time", {}).get("timeline_data")
        or data.get("interest_over_time", {}).get("timeline")
        or []
    )

    series = []

    for item in timeline:

        values = item.get("values", [])

        if values:
            value = values[0].get("extracted_value", 0)
        else:
            value = 0

        series.append(
            {
                "date": item.get("date", ""),
                "value": value,
            }
        )

    return series
# ==========================================================
# Compare Keywords
# ==========================================================


def compare_keywords(keywords: list[str], days: int = 90) -> dict:

    series = {}

    for kw in keywords:
        series[kw] = interest_over_time(kw, days)

    if not keywords:
        return {
            "keywords": [],
            "data": [],
        }

    if not series.get(keywords[0]):
        return {
            "keywords": keywords,
            "data": [],
        }

    rows = []

    dates = [item["date"] for item in series[keywords[0]]]

    for i, d in enumerate(dates):

        row = {
            "date": d,
        }

        for kw in keywords:

            if i < len(series[kw]):
                row[kw] = series[kw][i]["value"]
            else:
                row[kw] = 0

        rows.append(row)

    return {
        "keywords": keywords,
        "data": rows,
    }


# ==========================================================
# Region Breakdown
# ==========================================================


def region_breakdown(keyword: str):

    print(">>> region_breakdown() called <<<", keyword)

    keyword = keyword.strip().lower()

    if keyword in cache:
        print("Returning cached region data")
        return cache[keyword]

    url = "https://serpapi.com/search"

    params = {
        "engine": "google_trends",
        "data_type": "GEO_MAP_0",
        "q": keyword,
        "geo": "",
        "date": "today 3-m",
        "api_key": SERPAPI_KEY,
    }

    try:

        start = time.time()

        response = session.get(
            url,
            params=params,
            timeout=60,
        )

        print(f"Region request took {time.time()-start:.2f} seconds")

        response.raise_for_status()

    except ReadTimeout:
        print("SerpAPI timed out in region_breakdown")
        return []

    except requests.RequestException as e:
        print("SerpAPI error:", e)
        return []

    data = response.json()

    if "error" in data:
        print(data["error"])
        return []

    print("========== REGION RESPONSE ==========")
    print(data)
    print("====================================")

    regions = data.get("interest_by_region", [])

    result = []

    for item in regions:

        result.append(
            {
                "region": item.get("location", ""),
                "score": item.get("extracted_value", 0),
            }
        )

    cache[keyword] = result

    return result
# ==========================================================
# Related Queries
# ==========================================================


def related_queries(keyword: str) -> dict:

    print(">>> related_queries() called <<<", keyword)

    url = "https://serpapi.com/search"

    params = {
        "engine": "google_trends",
        "data_type": "RELATED_QUERIES",
        "q": keyword,
        "geo": "",
        "date": "today 3-m",
        "api_key": SERPAPI_KEY,
    }

    try:

        start = time.time()

        response = session.get(
            url,
            params=params,
            timeout=60,
        )

        print(f"Related request took {time.time()-start:.2f} seconds")

        response.raise_for_status()

    except ReadTimeout:
        print("SerpAPI timed out in related_queries")
        return {
            "top": [],
            "rising": [],
        }

    except requests.RequestException as e:
        print("SerpAPI error:", e)
        return {
            "top": [],
            "rising": [],
        }

    data = response.json()

    if "error" in data:
        print(data["error"])
        return {
            "top": [],
            "rising": [],
        }

    print("========== RELATED RESPONSE ==========")
    print(data)
    print("======================================")

    related = data.get("related_queries", {})

    top = related.get("top", [])
    rising = related.get("rising", [])

    return {
        "top": [
            {
                "query": item.get("query", ""),
                "value": item.get("extracted_value", item.get("value", 0)),
            }
            for item in top
        ],
        "rising": [
            {
                "query": item.get("query", ""),
                "growth_pct": item.get("value", ""),
            }
            for item in rising
        ],
    }
# ==========================================================
# Trending Now
# ==========================================================


def trending_now(n: int = 8) -> list[dict]:

    seed_terms = [
        "ChatGPT",
        "iPhone 18",
        "IPL 2026",
        "World Cup",
        "Bitcoin",
        "Tesla",
        "Olympics",
        "NASA",
        "Climate Summit",
        "AI Regulation",
        "F1",
        "Netflix Series",
    ]

    random.seed(date.today().toordinal())

    picks = random.sample(seed_terms, k=min(n, len(seed_terms)))

    return [
        {
            "keyword": kw,
            "category": random.choice(CATEGORIES),
            "change_pct": random.randint(15, 480),
        }
        for kw in picks
    ]


# ==========================================================
# Summary Statistics
# ==========================================================


def summary_stats(keyword: str) -> dict:

    data = interest_over_time(keyword, 90)

    if not data:
        return {
            "keyword": keyword,
            "average_interest": 0,
            "peak_interest": 0,
            "growth_pct": 0,
            "trend_direction": "stable",
        }

    series = pd.DataFrame(data)

    values = series["value"]

    average_interest = round(float(values.mean()), 1)
    peak_interest = round(float(values.max()), 1)

    midpoint = len(values) // 2

    first_half = values.iloc[:midpoint].mean()
    second_half = values.iloc[midpoint:].mean()

    if first_half == 0:
        growth_pct = 0
    else:
        growth_pct = ((second_half - first_half) / first_half) * 100

    if growth_pct > 5:
        trend = "rising"
    elif growth_pct < -5:
        trend = "falling"
    else:
        trend = "stable"

    return {
        "keyword": keyword,
        "average_interest": average_interest,
        "peak_interest": peak_interest,
        "growth_pct": round(float(growth_pct), 1),
        "trend_direction": trend,
    }
# ==========================================================
# AI Insights
# ==========================================================


def ai_insights(keyword: str) -> list[dict]:

    stats = summary_stats(keyword)

    return [
        {
            "title": "Momentum",
            "detail": (
                f"'{keyword}' interest is currently "
                f"{stats['trend_direction']} with a "
                f"{stats['growth_pct']}% change over the selected period."
            ),
        },
        {
            "title": "Peak Interest",
            "detail": (
                f"The highest search interest reached "
                f"{stats['peak_interest']}/100 with an average "
                f"interest score of {stats['average_interest']}/100."
            ),
        },
        {
            "title": "SEO Opportunity",
            "detail": (
                f"Create content around '{keyword}' together with "
                "related and rising search queries to capture "
                "emerging search demand."
            ),
        },
    ]
