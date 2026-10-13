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
- **Weather & Geocoding Integration**: Integrated with the Open-Meteo Public API (free, open, no mandatory key required; supports optional `OPEN_METEO_API_KEY` environment variable).
- **Functionality**: Provides real-time destination geocoding and current weather/forecast conditions to allow the Route & Pace Optimizer to calibrate outdoor vs. indoor pacing.
