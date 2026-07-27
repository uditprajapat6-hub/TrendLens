"""
Synthetic search-trend data generator.

This mirrors the *shape* of real Google Trends data (via pytrends) so the
frontend and API contract can be built now and swapped to a live source
later without changing any response schema. Phase 2 replaces the body of
these functions with real pytrends/API calls behind the same signatures.
"""
from __future__ import annotations

import random
from datetime import date, timedelta

import numpy as np
import pandas as pd
import os
import requests
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

REGIONS = ["India", "United States", "United Kingdom", "Brazil", "Germany", "Japan", "Nigeria", "Australia"]
CATEGORIES = ["Technology", "Entertainment", "Sports", "Finance", "Health", "Travel", "Education", "Shopping"]


def _seeded_rng(keyword: str) -> np.random.Generator:
    seed = abs(hash(keyword)) % (2**32)
    return np.random.default_rng(seed)


import requests
from app.config import get_settings

settings = get_settings()
SERPAPI_KEY = settings.serpapi_key
print("SERPAPI_KEY =", SERPAPI_KEY)
print("SERPAPI_KEY =", SERPAPI_KEY[:8] + "...")
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
        "q": keyword,
        "data_type": "TIMESERIES",
        "geo": "IN",
        "date": date_range,
        "api_key": SERPAPI_KEY,
    }

    response = requests.get(url, params=params)
    data = response.json()

    timeline = data.get("interest_over_time", {}).get("timeline_data", [])

    series = []

    for item in timeline:
        series.append({
            "date": item["date"],
            "value": item["values"][0]["extracted_value"]
        })

    return series
def compare_keywords(keywords: list[str], days: int = 90) -> dict:
    series = {kw: interest_over_time(kw, days) for kw in keywords}
    dates = [point["date"] for point in series[keywords[0]]]
    rows = []
    for i, d in enumerate(dates):
        row = {"date": d}
        for kw in keywords:
            row[kw] = series[kw][i]["value"]
        rows.append(row)
    return {"keywords": keywords, "data": rows}


def region_breakdown(keyword: str):
    print(">>> region_breakdown() called <<<", keyword)
    url = "https://serpapi.com/search"

    params = {
        "engine": "google_trends",
        "data_type": "GEO_MAP_0",
        "q": keyword,
        "geo": "",
        "date": "today 3-m",
        "api_key": SERPAPI_KEY,
    }

    response = requests.get(url, params=params)
    data = response.json()

    regions = data.get("interest_by_region", [])

    return [
    {
        "region": item["location"],
        "score": item["extracted_value"]
    }
    for item in regions[:10]
]
 

def related_queries(keyword: str) -> dict:
    rng = _seeded_rng(keyword)
    rising_pool = [f"{keyword} 2026", f"{keyword} vs alternatives", f"best {keyword}",
                   f"{keyword} tutorial", f"{keyword} price", f"{keyword} review",
                   f"{keyword} near me", f"how does {keyword} work"]
    top_pool = [f"{keyword}", f"{keyword} meaning", f"{keyword} online", f"{keyword} download",
                f"{keyword} app", f"{keyword} free"]
    rising = rng.choice(rising_pool, size=5, replace=False)
    top = rng.choice(top_pool, size=5, replace=False)
    return {
        "top": [{"query": q, "value": int(rng.integers(60, 100))} for q in top],
        "rising": [{"query": q, "growth_pct": int(rng.integers(80, 900))} for q in rising],
    }


def trending_now(n: int = 8) -> list[dict]:
    seed_terms = ["ChatGPT", "iPhone 18", "IPL 2026", "World Cup", "Bitcoin", "Tesla",
                  "Olympics", "NASA", "climate summit", "AI regulation", "F1", "Netflix series"]
    random.seed(date.today().toordinal())
    picks = random.sample(seed_terms, k=min(n, len(seed_terms)))
    return [
        {"keyword": kw, "category": random.choice(CATEGORIES), "change_pct": random.randint(15, 480)}
        for kw in picks
    ]


def summary_stats(keyword: str) -> dict:
    series = pd.DataFrame(interest_over_time(keyword, 90))
    values = series["value"]
    first_half = values.iloc[: len(values) // 2].mean()
    second_half = values.iloc[len(values) // 2 :].mean()
    growth_pct = ((second_half - first_half) / max(first_half, 1)) * 100
    return {
        "keyword": keyword,
        "average_interest": round(float(values.mean()), 1),
        "peak_interest": round(float(values.max()), 1),
        "growth_pct": round(float(growth_pct), 1),
        "trend_direction": "rising" if growth_pct > 5 else "falling" if growth_pct < -5 else "stable",
    }


def ai_insights(keyword: str) -> list[dict]:
    stats = summary_stats(keyword)
    insights = [
        {
            "title": "Momentum",
            "detail": f"'{keyword}' interest is {stats['trend_direction']} with "
                      f"{stats['growth_pct']}% change over the observed window.",
        },
        {
            "title": "Peak performance",
            "detail": f"Peak interest score reached {stats['peak_interest']}/100, "
                      f"averaging {stats['average_interest']}/100 overall.",
        },
        {
            "title": "SEO suggestion",
            "detail": f"Pair '{keyword}' with rising long-tail queries to capture "
                      "early-stage search demand before competition increases.",
        },
    ]
    return insights
