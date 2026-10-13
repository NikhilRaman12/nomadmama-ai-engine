# Project Brief: NomadMama AI (TravelMama Engine)

## Executive Summary
NomadMama AI (TravelMama Engine) is an autonomous, high-velocity travel destination, route logistics, and capital optimization engine designed for enterprise travel operators, tourist boards, and high-tempo personal travelers.

## Domain & Objectives
- **Target Domain**: Global Travel & Tourism, Itinerary Optimization, Micro-Cost Allocation, Accommodation Hub Routing.
- **Key Challenges**:
  - Eliminating transit deadhead and commuting waste between sequential attractions.
  - Strict mathematical compliance under client budget caps (accommodations, daily meals, entrance tickets, intra-day transit, liquid contingency reserves).
  - Dynamically adapting pacing based on ground conditions (such as climate, rainfall, and extreme temperatures).

## Multi-Agent Architecture
- **Orchestrator**: Master Mama (`gemini-2.5-pro` with strict Pydantic structured output validation).
- **Sub-Agents**:
  - Kid 1: Route & Pace Optimizer (`gemini-2.5-flash`).
  - Kid 2: Capital Allocation & Budget Scientist (`gemini-2.5-flash`).
  - Kid 3: Accommodation Hub Router (`gemini-2.5-flash`).
- **Memory Engine**: `NomadMamaMemoryEngine` for thread-isolated state transitions and multi-turn refinement.

## External Tooling & Public APIs
- **Google Maps Geocoding API**: Resolves physical addresses, waypoints, and landmarks into exact geographic coordinates (`lat`, `lng`).
- **Google Maps Places API (New)**: Executes high-precision nearby place searches (`places:searchNearby`) using `X-Goog-FieldMask` and `X-Goog-Api-Key` to return key fields (name, formatted address, location coordinates).
- **Open-Meteo Public Weather API**: Real-time destination geocoding and forecast conditions to allow the Route & Pace Optimizer to calibrate outdoor vs. indoor pacing.
- **Key Storage**: All credentials read strictly from local `.env` or system environment variables (`GOOGLE_MAPS_API_KEY`).
