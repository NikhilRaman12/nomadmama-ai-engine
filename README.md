# NomadMama AI (TravelMama Engine)

[![Google Gen AI SDK](https://img.shields.io/badge/Google%20Gen%20AI%20SDK-google--genai-4285F4?logo=google)](https://github.com/googleapis/python-genai)
[![Models](https://img.shields.io/badge/Orchestrator-Gemini%202.5%20Pro-8E24AA)](https://ai.google.dev/)
[![Sub-Agents](https://img.shields.io/badge/Domain%20Agents-Gemini%202.5%20Flash-00ACC1)](https://ai.google.dev/)
[![Pydantic](https://img.shields.io/badge/Validation-Pydantic%20v2-E92063?logo=pydantic)](https://docs.pydantic.dev/)

**NomadMama AI** (also known as the **TravelMama Engine**) is an autonomous, high-velocity vacation destination and capital optimizer engineered for enterprise travel agencies, tourist boards, and high-frequency consumer travel apps.

The architecture uses a deterministic multi-agent state machine with persistent context memory and strict Pydantic schema validation.

---

## 🏛️ System Architecture

```
                                [Client Request]
                        (Text, Images, Audio Waypoints)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │      NomadMamaMemoryEngine        │
                     │  (Session Registry & State Store) │
                     └─────────────────┬─────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 │                                           │
                 ▼                                           ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│   Agent 1: Route & Pace         │         │   Agent 2: Capital Allocation   │
│   Optimizer (Gemini 2.5 Flash)  │────┐    │   & Budget Scientist            │
└─────────────────────────────────┘    │    │   (Gemini 2.5 Flash)            │
                 │                     │    └────────────────┬────────────────┘
                 ▼                     │                     │
┌─────────────────────────────────┐    │                     │
│   Agent 3: Lodging Hub          │    │                     │
│   Router (Gemini 2.5 Flash)     │◄───┘                     │
└────────────────┬────────────────┘                          │
                 │                                           │
                 └─────────────────────┬─────────────────────┘
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │   Agent 4: Master Orchestrator    │
                     │   (The Master Mama)               │
                     │   • Gemini 2.5 Pro                │
                     │   • Strict Pydantic response_schema│
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                             [NomadMamaDossier]
```

### 1. Specialized Agent Fleet
- **Agent 1: NomadMama Route & Pace Optimizer (Flash)**: Calculates maximum destination stops per unit of time while strictly policing time overheads, dwell times, and inter-stop transit buffers.
- **Agent 2: NomadMama Capital Allocation & Budget Scientist (Flash)**: Projects micro-costs (transit passes, entrance fees, meals, and liquid emergency contingency buffers) ensuring strict adherence to budget caps.
- **Agent 3: NomadMama Logistical Accommodation Hub Router (Flash)**: Selects lodging purely based on geographic proximity to destination clusters to eliminate commuting waste.
- **Agent 4: NomadMama Master Orchestrator (Pro)**: Manages state routing, pulls historical memory context from the thread registry, compiles the payload, feeds it to `gemini-2.5-pro` with `response_schema=NomadMamaDossier`, resolves deltas, and signs off on the certified travel dossier.

### 2. Multi-Modal Interface Capability
Native support for text prompts, binary image files (PNG, JPEG, WebP), and voice/audio assets (WAV, MP3, M4A, OGG) passed directly into the Gemini model contents array via `types.Part.from_bytes(...)`.

### 3. State Isolation & Persistent Memory (`NomadMamaMemoryEngine`)
Industrial-grade thread context registry preserving state transitions, prior signed dossiers, budget constraints, and chat history across refinement cycles.

### 4. External Function Tooling ([`tools.py`](tools.py))
- **Multimodal Image Generation (`generate_destination_image`)**:
  - Uses `gemini-3.1-flash-lite-image` in the global region to generate visual artifacts for itinerary waypoints and culinary stops.
  - Saves in-memory via `tool_context.save_artifact` for the Playground's Artifacts panel.
  - Streams bytes directly to Cloud Storage bucket: `dataguard-ml-agents-pipeline-document-uploads` returning public URL (`https://storage.googleapis.com/dataguard-ml-agents-pipeline-document-uploads/<object>`).
  - Zero local disk IO.
- **Google Maps Geocoding API (`geocode_address`)**: Converts addresses, landmarks, and districts into precise coordinates (`latitude`, `longitude`).
- **Google Maps Places API (New) (`find_nearby_places`)**: Performs high-velocity nearby searches via `places.googleapis.com/v1/places:searchNearby` using `X-Goog-FieldMask` and `X-Goog-Api-Key` to return key fields (`name`, `address`, `location`).
- **Open-Meteo Weather API (`get_destination_weather`)**: Provides real-time temperatures and precipitation risk to dynamically adjust outdoor vs. indoor pacing.
- **Security & Secret Handling**: All API keys are loaded dynamically from environment variables or the local `.env` file (`GOOGLE_MAPS_API_KEY`) and are never hardcoded.

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Valid Google Gemini API Key (`GEMINI_API_KEY`) or Google Cloud Application Default Credentials (ADC)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/NikhilRaman12/nomadmama-ai-engine.git
cd nomadmama-ai-engine
pip install -r requirements.txt
```

### 2. Configure Environment
Set your Gemini API key:
```bash
# On Linux/macOS
export GEMINI_API_KEY="your-gemini-api-key"

# On Windows (PowerShell)
$env:GEMINI_API_KEY="your-gemini-api-key"
```

---

## 🧪 Running the Verification Suite

Run the end-to-end multi-turn verification script:
```bash
python nomadmama_engine.py
```

### Included Tests:
1. **Test 1 (Initial Multi-Modal Mandate)**:
   - Evaluates a text intention combined with an in-memory binary PNG image.
   - Generates a certified 3-day Tokyo high-velocity dossier under a $2,500.00 budget ceiling.
2. **Test 2 (Refinement on Same Thread ID)**:
   - Reduces the budget cap to $1,750.00.
   - Rebalances lodging and dining to street food/izakayas while preserving contingency reserves.
   - Verifies mathematical compliance and memory continuity across session turns.

---

## 📋 Data Structures (Pydantic v2)

- **`DestinationStop`**: Granular waypoint with arrival/departure timestamps, dwell duration, transit buffer, admission fee, and pace rationale.
- **`LodgingNode`**: Optimal accommodation node with nightly rates, stay duration, proximity index score (1.0-10.0), and commute elimination rationale.
- **`DailyItinerary`**: Day plan detailing theme, ordered stops, active hours, transit overheads, and daily subtotal.
- **`NomadMamaDossier`**: Master travel dossier with budget caps, projected spend, contingency funds, capital allocation percentages, and Mama's executive directive.

---

## 📄 License

Apache 2.0 / MIT
