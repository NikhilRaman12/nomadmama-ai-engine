"""
NomadMama AI Function Tools
================================================================================
Free Public API Integration: Open-Meteo Public Weather & Geocoding API
Category: Weather & Travel Logistics (https://github.com/public-apis/public-apis)

Provides real-time destination geocoding, current weather conditions, and
temperature/precipitation forecasts to calibrate outdoor vs. indoor pacing.
================================================================================
"""

import os
import time
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional


def get_destination_weather(destination: str) -> Dict[str, Any]:
    """
    Fetches real-time weather conditions and 3-day forecast for a travel destination
    using the Open-Meteo Public API. Reads optional OPEN_METEO_API_KEY from environment.

    Args:
        destination: City or metropolitan destination (e.g., 'Tokyo', 'Rome', 'Kyoto').

    Returns:
        Structured dictionary with coordinates, timezone, current temperature,
        precipitation risk, and multi-day temperature ranges.
    """
    api_key = os.getenv("OPEN_METEO_API_KEY")
    user_agent = "NomadMama-Engine/1.0 (Travel Logistics Optimizer)"

    # 1. Geocode destination to obtain coordinates
    encoded_query = urllib.parse.quote(destination.strip())
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded_query}&count=1&language=en&format=json"
    
    headers = {"User-Agent": user_agent}
    if api_key:
        headers["apikey"] = api_key

    geo_data = None
    for attempt in range(3):
        try:
            geo_req = urllib.request.Request(geo_url, headers=headers)
            with urllib.request.urlopen(geo_req, timeout=10) as response:
                geo_data = json.loads(response.read().decode("utf-8"))
            break
        except Exception:
            if attempt < 2:
                time.sleep(1)
            else:
                return {
                    "status": "error",
                    "destination": destination,
                    "message": f"Could not reach geocoding service for '{destination}'."
                }

    results = geo_data.get("results") if geo_data else None
    if not results:
        return {
            "status": "error",
            "message": f"Could not geocode destination '{destination}'."
        }

    target = results[0]
    latitude = target.get("latitude")
    longitude = target.get("longitude")
    resolved_name = f"{target.get('name')}, {target.get('country', '')}"
    timezone_id = target.get("timezone", "auto")

    # 2. Fetch live weather & forecast
    weather_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": timezone_id
    }
    if api_key:
        weather_params["apikey"] = api_key

    query_string = urllib.parse.urlencode(weather_params)
    weather_url = f"https://api.open-meteo.com/v1/forecast?{query_string}"

    weather_data = None
    for attempt in range(3):
        try:
            weather_req = urllib.request.Request(weather_url, headers=headers)
            with urllib.request.urlopen(weather_req, timeout=10) as response:
                weather_data = json.loads(response.read().decode("utf-8"))
            break
        except Exception:
            if attempt < 2:
                time.sleep(1.5)
            else:
                return {
                    "status": "error",
                    "destination": destination,
                    "message": f"Weather service temporarily unavailable for '{destination}'."
                }

    current = weather_data.get("current_weather", {})
    daily = weather_data.get("daily", {})

    return {
        "status": "success",
        "destination": resolved_name,
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "current_conditions": {
            "temperature_celsius": current.get("temperature"),
            "windspeed_kmh": current.get("windspeed"),
            "is_day": bool(current.get("is_day")),
            "weather_code": current.get("weathercode")
        },
        "three_day_forecast": {
            "dates": daily.get("time", [])[:3],
            "max_temperatures_celsius": daily.get("temperature_2m_max", [])[:3],
            "min_temperatures_celsius": daily.get("temperature_2m_min", [])[:3],
            "max_precipitation_probabilities_pct": daily.get("precipitation_probability_max", [])[:3]
        }
    }


if __name__ == "__main__":
    test_cities = ["Tokyo", "Kyoto"]
    print("Testing get_destination_weather tool with auto-retry...")
    for city in test_cities:
        res = get_destination_weather(city)
        print(f"\n[{city}] Status: {res.get('status')}")
        if res.get("status") == "success":
            print(f"  Resolved: {res.get('destination')}")
            print(f"  Current Temp: {res['current_conditions'].get('temperature_celsius')}°C")
            print(f"  Precipitation Risk: {res['three_day_forecast'].get('max_precipitation_probabilities_pct')}%")
        else:
            print(f"  Error: {res.get('message')}")
