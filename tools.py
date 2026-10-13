"""
NomadMama AI Function Tools
================================================================================
External Public & Google Maps Platform API Integrations:
1. Google Geocoding API: Converts addresses into precise geographic coordinates.
2. Google Places API (New): Performs nearby search for places of a given type.
3. Open-Meteo API: Real-time climate and forecast retrieval.

Keys are read strictly from local .env or environment variables (never hardcoded).
================================================================================
"""

import os
import time
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional
from pathlib import Path


def _get_env_variable(var_name: str) -> Optional[str]:
    """Retrieves variable from environment or parses local .env file."""
    val = os.getenv(var_name)
    if val:
        return val

    # Fallback to local .env file
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() == var_name:
                            return v.strip().strip("'\"")
        except Exception:
            pass
    return None


# ==============================================================================
# GOOGLE MAPS PLATFORM APIS: GEOCODING & PLACES (NEW)
# ==============================================================================

def geocode_address(address: str) -> Dict[str, Any]:
    """
    Turns a physical address, landmark, or district name into precise geographic coordinates
    using the Google Maps Geocoding REST API.

    Args:
        address: The address, place name, or landmark to geocode (e.g. 'Shibuya Crossing, Tokyo').

    Returns:
        Dictionary containing key fields: name, address (formatted), and location coordinates.
    """
    api_key = _get_env_variable("GOOGLE_MAPS_API_KEY")
    if not api_key or api_key == "PASTE_KEY_HERE":
        return {
            "status": "error",
            "message": "GOOGLE_MAPS_API_KEY is not configured in environment or local .env file."
        }

    encoded_address = urllib.parse.quote(address.strip())
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={encoded_address}&key={api_key}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NomadMama-Engine/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))

        if data.get("status") != "OK" or not data.get("results"):
            return {
                "status": "error",
                "message": f"Geocoding failed for '{address}': {data.get('status', 'NO_RESULTS')}"
            }

        result = data["results"][0]
        geometry_loc = result.get("geometry", {}).get("location", {})

        return {
            "status": "success",
            "name": address,
            "address": result.get("formatted_address", ""),
            "location": {
                "latitude": geometry_loc.get("lat"),
                "longitude": geometry_loc.get("lng")
            }
        }
    except Exception as exc:
        return {
            "status": "error",
            "name": address,
            "message": f"Geocoding request failed: {str(exc)}"
        }


def find_nearby_places(
    latitude: float,
    longitude: float,
    place_type: str = "tourist_attraction",
    radius_meters: float = 1000.0,
    max_results: int = 5
) -> Dict[str, Any]:
    """
    Searches for nearby places of a specified category around given coordinates
    using the Google Maps Places API (New) nearby search REST endpoint.

    Args:
        latitude: Latitude coordinate for search center.
        longitude: Longitude coordinate for search center.
        place_type: Primary place type (e.g., 'tourist_attraction', 'restaurant', 'lodging', 'museum').
        radius_meters: Search radius in meters (default: 1000.0).
        max_results: Maximum number of results to return (1-20, default: 5).

    Returns:
        Dictionary with status and list of places containing key fields: name, address, location.
    """
    api_key = _get_env_variable("GOOGLE_MAPS_API_KEY")
    if not api_key or api_key == "PASTE_KEY_HERE":
        return {
            "status": "error",
            "message": "GOOGLE_MAPS_API_KEY is not configured in environment or local .env file."
        }

    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
    }

    body = {
        "includedTypes": [place_type],
        "maxResultCount": min(max(1, max_results), 20),
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "radius": float(radius_meters)
            }
        }
    }

    try:
        req_data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))

        places_raw = data.get("places", [])
        extracted_places: List[Dict[str, Any]] = []

        for p in places_raw:
            extracted_places.append({
                "name": p.get("displayName", {}).get("text", "Unknown"),
                "address": p.get("formattedAddress", ""),
                "location": {
                    "latitude": p.get("location", {}).get("latitude"),
                    "longitude": p.get("location", {}).get("longitude")
                }
            })

        return {
            "status": "success",
            "search_center": {"latitude": latitude, "longitude": longitude},
            "place_type": place_type,
            "count": len(extracted_places),
            "places": extracted_places
        }
    except Exception as exc:
        return {
            "status": "error",
            "message": f"Places API (New) request failed: {str(exc)}"
        }


# ==============================================================================
# OPEN-METEO PUBLIC WEATHER & FORECAST API
# ==============================================================================

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
    api_key = _get_env_variable("OPEN_METEO_API_KEY")
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
    print("=== Function Tools Self-Test ===")
    
    # 1. Test Weather
    print("\n[1] Testing Open-Meteo Weather for Tokyo...")
    w_res = get_destination_weather("Tokyo")
    print(f"Status: {w_res.get('status')}")
    if w_res.get("status") == "success":
        print(f"Resolved: {w_res.get('destination')} | Temp: {w_res['current_conditions'].get('temperature_celsius')}°C")

    # 2. Test Geocoding API Key Check
    print("\n[2] Testing Google Maps Geocoding API Key Handling...")
    geo_res = geocode_address("Tokyo Tower, Tokyo, Japan")
    print(f"Response: {geo_res}")

    # 3. Test Places API (New) Key Check
    print("\n[3] Testing Google Places API (New) Key Handling...")
    places_res = find_nearby_places(latitude=35.6586, longitude=139.7454, place_type="tourist_attraction")
    print(f"Response: {places_res}")
