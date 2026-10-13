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


# ==============================================================================
# MULTIMODAL MEDIA GENERATION: GEMINI-3.1-FLASH-LITE-IMAGE & GCS UPLOAD
# ==============================================================================

# Hardcoded bucket name as specified
PUBLIC_GCS_BUCKET_NAME = "dataguard-ml-agents-pipeline-document-uploads"


def create_multimodal_part_from_bytes(data: bytes, mime_type: str) -> Any:
    """
    Creates a native types.Part object from in-memory binary data for images or audio/voice.
    Supports audio/wav, audio/mp3, audio/ogg, audio/m4a, image/png, image/jpeg, etc.
    """
    from google.genai import types
    return types.Part.from_bytes(data=data, mime_type=mime_type)


def generate_destination_image(
    item_name: str,
    visual_description: str,
    tool_context: Optional[Any] = None
) -> Dict[str, Any]:
    """
    Generates a high-fidelity image for a travel destination, attraction, or culinary item
    using the gemini-3.1-flash-lite-image model in the global region.
    
    1. Saves the generated image using tool_context.save_artifact so it renders in the Playground Artifacts panel.
    2. Directly streams/uploads the in-memory image bytes to the public Cloud Storage bucket:
       'dataguard-ml-agents-pipeline-document-uploads'
       and returns its public https URL (https://storage.googleapis.com/<bucket>/<object>).
       Does NOT write the image to a local file.
    
    Args:
        item_name: Name of the destination stop, landmark, or culinary item (e.g. 'Fushimi Inari Shrine').
        visual_description: Visual stylistic and scene prompt for image generation.
        tool_context: Optional ADK / Playground ToolContext holding the save_artifact method.
        
    Returns:
        Dictionary containing item_name, public image_url, and artifact metadata.
    """
    from google import genai
    from google.genai import types
    from google.cloud import storage

    client = genai.Client()
    prompt = f"Professional vibrant cinematic travel photography of {item_name}. {visual_description}. Ultra-detailed, 8k resolution, authentic lighting."

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-image",
            contents=prompt,
        )

        image_bytes: Optional[bytes] = None
        mime_type = "image/png"

        if response.candidates and response.candidates[0].content:
            for part in response.candidates[0].content.parts:
                if getattr(part, "inline_data", None):
                    data = part.inline_data.data
                    if isinstance(data, str):
                        import base64
                        image_bytes = base64.b64decode(data)
                    else:
                        image_bytes = data
                    mime_type = getattr(part.inline_data, "mime_type", "image/png") or "image/png"
                    break

        if not image_bytes:
            return {
                "status": "error",
                "item_name": item_name,
                "message": "No inline image data returned by gemini-3.1-flash-lite-image."
            }

        sanitized_slug = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in item_name.lower())
        filename = f"{sanitized_slug}.png"

        # (1) Save artifact via tool_context for Playground Artifacts panel
        saved_artifact_status = "not_available"
        if tool_context and hasattr(tool_context, "save_artifact"):
            artifact_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            try:
                tool_context.save_artifact(filename=filename, artifact=artifact_part)
                saved_artifact_status = "saved"
            except TypeError:
                try:
                    tool_context.save_artifact(name=filename, data=image_bytes, mime_type=mime_type)
                    saved_artifact_status = "saved"
                except Exception as e:
                    saved_artifact_status = f"error: {str(e)}"
            except Exception as e:
                saved_artifact_status = f"error: {str(e)}"

        # (2) Upload in-memory bytes to the public Cloud Storage bucket
        object_key = f"nomadmama-destinations/{sanitized_slug}_{int(time.time())}.png"
        storage_client = storage.Client(project="dataguard-ml-agents-pipeline")
        bucket = storage_client.bucket(PUBLIC_GCS_BUCKET_NAME)
        blob = bucket.blob(object_key)
        blob.upload_from_string(image_bytes, content_type=mime_type)

        public_https_url = f"https://storage.googleapis.com/{PUBLIC_GCS_BUCKET_NAME}/{object_key}"

        return {
            "status": "success",
            "item_name": item_name,
            "image_url": public_https_url,
            "artifact_saved": saved_artifact_status,
            "filename": filename
        }

    except Exception as exc:
        return {
            "status": "error",
            "item_name": item_name,
            "message": f"Failed to generate and upload image: {str(exc)}"
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

    # 4. GCS Bucket Configuration
    print(f"\n[4] Configured GCS Public Bucket: {PUBLIC_GCS_BUCKET_NAME}")

