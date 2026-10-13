"""
NomadMama AI (TravelMama Engine)
================================================================================
Enterprise autonomous vacation destination, logistical routing, and capital
allocation optimizer built on deterministic multi-agent state machines.

System Architecture:
- Framework: Next-Gen Google Gen AI SDK ('google-genai')
- Master Orchestrator: 'gemini-2.5-pro' with strict Pydantic response_schema
- Specialized Sub-Agents: 'gemini-2.5-flash' for low-latency domain execution
- Context Engine: NomadMamaMemoryEngine for multi-turn thread persistence
- Multi-Modal Inputs: Text, binary Image, and binary Audio MIME parts
================================================================================
"""

import os
import sys
import json
import base64
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Strict Next-Gen Google Gen AI SDK
from google import genai
from google.genai import types

# Function Tools (Google Maps Platform & Open-Meteo)
from tools import get_destination_weather, geocode_address, find_nearby_places


# ==============================================================================
# 1. PYDANTIC DATA STRUCTURES (STRICT SCHEMA DEFINITION)
# ==============================================================================

class DestinationStop(BaseModel):
    name: str = Field(..., description="Official name of the attraction, venue, or waypoint.")
    category: str = Field(..., description="Classification (e.g., Cultural Heritage, Culinary, Transit Hub, Nature).")
    arrival_time: str = Field(..., description="Target arrival time in 24-hour HH:MM format.")
    departure_time: str = Field(..., description="Target departure time in 24-hour HH:MM format.")
    allocated_duration_minutes: int = Field(..., description="Active on-site dwell time in minutes.", ge=10)
    transit_buffer_minutes: int = Field(..., description="Buffer allocated for inter-stop transit and security overheads.", ge=5)
    micro_location: str = Field(..., description="District, ward, or neighborhood coordinate string.")
    admission_cost_usd: float = Field(..., description="Per-person admission or ticket cost in USD.", ge=0.0)
    pace_rationale: str = Field(..., description="Tactical justification for visit sequence, crowd mitigation, or pace efficiency.")


class LodgingNode(BaseModel):
    property_name: str = Field(..., description="Name of the accommodation facility.")
    property_type: str = Field(..., description="Classification: Boutique Hotel, Serviced Apartment, Business Hotel, Resort.")
    geographic_zone: str = Field(..., description="District or neighborhood cluster.")
    nightly_rate_usd: float = Field(..., description="Average nightly rate in USD.", ge=0.0)
    total_nights: int = Field(..., description="Total length of stay in nights.", ge=1)
    total_lodging_cost_usd: float = Field(..., description="Calculated total lodging expenditure in USD.")
    proximity_index_score: float = Field(..., description="Proximity efficiency score from 1.0 (distant) to 10.0 (optimal).", ge=1.0, le=10.0)
    transit_elimination_summary: str = Field(..., description="Deterministic logistical analysis proving how this hub reduces transit waste.")


class DailyItinerary(BaseModel):
    day_number: int = Field(..., description="Sequential day counter (1-indexed).", ge=1)
    calendar_date_or_label: str = Field(..., description="Day identifier or timestamp (e.g., 'Day 1 - Neon Core').")
    primary_theme: str = Field(..., description="Strategic theme of the day's itinerary.")
    stops: List[DestinationStop] = Field(..., description="Ordered list of destination waypoints minimizing transit loops.")
    total_daily_active_hours: float = Field(..., description="Total active exploration hours.", ge=0.0)
    total_transit_overhead_minutes: int = Field(..., description="Sum of transit buffers between daily stops.", ge=0)
    daily_transit_cost_usd: float = Field(..., description="Intra-day transit expenditure (metro, taxi, rail passes).", ge=0.0)
    daily_meal_cost_usd: float = Field(..., description="Projected meal and hydration expenses for the day.", ge=0.0)
    daily_subtotal_usd: float = Field(..., description="Comprehensive daily financial commitment (stops + transit + meals).", ge=0.0)


class NomadMamaDossier(BaseModel):
    dossier_id: str = Field(..., description="Unique deterministic execution ID for this travel mandate.")
    destination_hub: str = Field(..., description="Primary metropolitan hub or target destination.")
    trip_title: str = Field(..., description="Executive travel operational title.")
    duration_days: int = Field(..., description="Trip duration in calendar days.", ge=1)
    total_budget_cap_usd: float = Field(..., description="Max financial constraint set by customer.", ge=0.0)
    projected_total_expenditure_usd: float = Field(..., description="Aggregated projected expenditure across all nodes.", ge=0.0)
    variance_to_cap_usd: float = Field(..., description="Remaining margin under cap (Budget Cap - Projected Total).")
    emergency_contingency_fund_usd: float = Field(..., description="Dedicated non-allocated liquid safety buffer.", ge=0.0)
    operational_pace_rating: str = Field(..., description="Velocity metric: 'Hyper-Dense', 'High-Yield Balanced', or 'Measured-Executive'.")
    selected_lodging: LodgingNode = Field(..., description="Selected optimal accommodation hub.")
    daily_schedules: List[DailyItinerary] = Field(..., description="Complete calendar of daily operations.")
    budget_breakdown_percentages: Dict[str, float] = Field(..., description="Capital allocation share across categories (Lodging, Food, Transit, Activities, Contingency).")
    mama_executive_signoff: str = Field(..., description="Master Mama's decisive architectural summary and operational directive.")


# ==============================================================================
# 2. STATE ISOLATION & PERSISTENT MEMORY ENGINE
# ==============================================================================

class NomadMamaMemoryEngine:
    """
    Industrial-grade context engine maintaining thread state, historical turns,
    budget constraints, and dossier revisions across execution cycles.
    """
    def __init__(self, persistence_file: Optional[str] = None):
        self.persistence_file = persistence_file
        self.registry: Dict[str, Dict[str, Any]] = {}
        if self.persistence_file and os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, "r", encoding="utf-8") as f:
                    self.registry = json.load(f)
            except Exception:
                self.registry = {}

    def get_or_create_thread(self, thread_id: str) -> Dict[str, Any]:
        if thread_id not in self.registry:
            self.registry[thread_id] = {
                "thread_id": thread_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "turn_count": 0,
                "active_budget_cap": None,
                "destination": None,
                "latest_dossier": None,
                "conversation_log": []
            }
        return self.registry[thread_id]

    def record_turn(self, thread_id: str, role: str, content_summary: str, metadata: Optional[Dict[str, Any]] = None):
        thread = self.get_or_create_thread(thread_id)
        thread["turn_count"] += 1
        thread["updated_at"] = datetime.now(timezone.utc).isoformat()
        turn_entry = {
            "turn_index": thread["turn_count"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "role": role,
            "summary": content_summary,
            "metadata": metadata or {}
        }
        thread["conversation_log"].append(turn_entry)
        self._flush_if_configured()

    def commit_dossier(self, thread_id: str, dossier: NomadMamaDossier):
        thread = self.get_or_create_thread(thread_id)
        thread["latest_dossier"] = dossier.model_dump()
        thread["active_budget_cap"] = dossier.total_budget_cap_usd
        thread["destination"] = dossier.destination_hub
        thread["updated_at"] = datetime.now(timezone.utc).isoformat()
        self._flush_if_configured()

    def get_compiled_context(self, thread_id: str) -> str:
        if thread_id not in self.registry:
            return "NO PRIOR MEMORY CONTEXT. THIS IS AN INITIAL THREAD RUN."
        
        thread = self.registry[thread_id]
        context_parts = [
            f"=== PERSISTENT THREAD REGISTRY [{thread_id}] ===",
            f"Total Historical Turns: {thread['turn_count']}",
            f"Active Destination: {thread.get('destination', 'Unset')}",
            f"Active Financial Cap: ${thread.get('active_budget_cap', 'Unset')}"
        ]

        if thread.get("latest_dossier"):
            d = thread["latest_dossier"]
            context_parts.append("\n--- PRIOR SIGNED DOSSIER STATE ---")
            context_parts.append(f"Trip Title: {d.get('trip_title')}")
            context_parts.append(f"Projected Spend: ${d.get('projected_total_expenditure_usd')} (Variance: ${d.get('variance_to_cap_usd')})")
            context_parts.append(f"Lodging Hub: {d.get('selected_lodging', {}).get('property_name')} in {d.get('selected_lodging', {}).get('geographic_zone')}")
            context_parts.append("Prior Itinerary Day Structure:")
            for day in d.get("daily_schedules", []):
                stop_names = [s.get('name') for s in day.get('stops', [])]
                context_parts.append(f"  Day {day.get('day_number')} ({day.get('primary_theme')}): {', '.join(stop_names)}")
        
        context_parts.append("\n--- CHAT TURN AUDIT TRAIL ---")
        for log in thread.get("conversation_log", [])[-4:]:
            context_parts.append(f"[{log['role'].upper()}]: {log['summary']}")

        return "\n".join(context_parts)

    def _flush_if_configured(self):
        if self.persistence_file:
            try:
                with open(self.persistence_file, "w", encoding="utf-8") as f:
                    json.dump(self.registry, f, indent=2)
            except Exception:
                pass


# ==============================================================================
# 3. SPECIALIZED DOMAIN SUB-AGENTS (GEMINI-2.5-FLASH)
# ==============================================================================

def run_route_pace_optimizer(
    client: genai.Client,
    user_intention: str,
    multimodal_parts: List[Any],
    memory_context: str
) -> str:
    """
    Agent 1: NomadMama Route & Pace Optimizer (Flash)
    Calculates maximum destination stops per unit of time while strictly policing time overheads.
    """
    system_instruction = (
        "You are the NomadMama Route & Pace Optimizer (Kid 1), an elite geospatial route scientist. "
        "Your sole mission is to maximize active discovery yield while ruthlessly cutting transit deadhead. "
        "Operational Rules:\n"
        "1. Group stops into tight geographic clusters (minimize backtrack or criss-crossing).\n"
        "2. Allocate strict arrival, departure, and dwell windows for each stop.\n"
        "3. Enforce realistic inter-stop transit buffers (minimum 15-30 minutes for urban transfers).\n"
        "4. Formulate an exact sequencing manifest with daily themes and pace ratings.\n"
        "Output an exhaustive, structured route blueprint."
    )

    contents: List[Any] = [
        f"HISTORICAL MEMORY CONTEXT:\n{memory_context}\n\n",
        f"USER INTENTION / MISSION PARAMETERS:\n{user_intention}\n\n"
    ]
    contents.extend(multimodal_parts)
    contents.append("GENERATE HIGH-VELOCITY GEOGRAPHIC ROUTE OPTIMIZATION BLUEPRINT NOW.")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[get_destination_weather, geocode_address, find_nearby_places],
            temperature=0.2,
        )
    )
    return response.text or "ROUTE_OPTIMIZATION_FAILED"


def run_budget_scientist(
    client: genai.Client,
    user_intention: str,
    route_blueprint: str,
    memory_context: str
) -> str:
    """
    Agent 2: NomadMama Capital Allocation & Budget Scientist (Flash)
    Projects exact micro-costs (transit, entrance, food, margins) to stay under financial caps.
    """
    system_instruction = (
        "You are the NomadMama Capital Allocation & Budget Scientist (Kid 2), an uncompromising travel financial auditor. "
        "Your mission is to construct an itemized micro-cost breakdown ensuring the entire operation remains strictly "
        "under financial caps with zero fiscal hallucinations.\n"
        "Operational Rules:\n"
        "1. Extract or determine exact ticket/entry costs for every stop proposed in the route blueprint.\n"
        "2. Factor realistic transit costs (subway day-passes, rapid transit, rideshare segments).\n"
        "3. Factor daily meal tiers (street food, bistros, or curated dining based on user intention).\n"
        "4. Enforce a mandatory Liquid Emergency Contingency Fund (minimum 5-10% of total budget).\n"
        "5. Calculate exact category percentages and calculate absolute variance to the ceiling cap."
    )

    contents = [
        f"HISTORICAL MEMORY CONTEXT:\n{memory_context}\n\n",
        f"USER INTENTION & FINANCIAL CEILING:\n{user_intention}\n\n",
        f"ROUTE & PACE BLUEPRINT FROM AGENT 1:\n{route_blueprint}\n\n",
        "EXECUTE CAPITAL AUDIT AND MICRO-COST PROJECTION TABLE."
    ]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.1,
        )
    )
    return response.text or "BUDGET_ANALYSIS_FAILED"


def run_lodging_hub_router(
    client: genai.Client,
    user_intention: str,
    route_blueprint: str,
    budget_breakdown: str,
    memory_context: str
) -> str:
    """
    Agent 3: NomadMama Logistical Accommodation Hub Router (Flash)
    Selects lodging purely based on geographic proximity to destinations to eliminate commuting waste.
    """
    system_instruction = (
        "You are the NomadMama Logistical Accommodation Hub Router (Kid 3), a spatial logistics strategist. "
        "Your sole task is to identify and anchor the single highest-leverage lodging property for this trip.\n"
        "Operational Rules:\n"
        "1. Proximity to destination clusters is paramount. Commute waste must be eliminated.\n"
        "2. Lodging nightly rate must strictly honor the financial allocation set by the Budget Scientist.\n"
        "3. Provide property name, neighborhood zone, calculated nightly rate, total stay cost, "
        "and a 1.0 to 10.0 Proximity Index Score with a commute elimination rationale."
    )

    contents = [
        f"HISTORICAL MEMORY CONTEXT:\n{memory_context}\n\n",
        f"USER INTENTION:\n{user_intention}\n\n",
        f"ROUTE BLUEPRINT:\n{route_blueprint}\n\n",
        f"BUDGET REPORT:\n{budget_breakdown}\n\n",
        "SELECT OPTIMAL ACCOMMODATION HUB."
    ]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[geocode_address, find_nearby_places],
            temperature=0.2,
        )
    )
    return response.text or "LODGING_SELECTION_FAILED"


# ==============================================================================
# 4. MASTER ORCHESTRATOR AGENT (GEMINI-2.5-PRO) & ENGINE CONTROLLER
# ==============================================================================

class NomadMamaMasterOrchestrator:
    """
    Agent 4: NomadMama Master Orchestrator (Pro)
    Manages state routing, pulls historical memory context from the thread registry,
    compiles the payload, feeds it to Gemini 2.5 Pro with the structural Pydantic schema,
    and signs off on the complete travel dossier.
    """
    def __init__(self, memory_persistence_path: Optional[str] = None):
        # Strict next-gen client initialization
        self.client = genai.Client()
        self.memory_engine = NomadMamaMemoryEngine(persistence_file=memory_persistence_path)

    def execute_planning_cycle(
        self,
        thread_id: str,
        user_prompt: str,
        multimodal_assets: Optional[List[Dict[str, Any]]] = None
    ) -> NomadMamaDossier:
        """
        Runs the complete loop lifecycle:
        1. Multi-modal assets ingester (supports text, binary Image, binary Audio).
        2. Pulls persistent context from thread registry.
        3. Invokes Sub-Agents 1, 2, and 3 on 'gemini-2.5-flash'.
        4. Synthesizes payload and certifies final dossier via 'gemini-2.5-pro' using response_schema.
        5. Commits state transition to NomadMamaMemoryEngine.
        """
        print(f"\n[ORCHESTRATOR] >>> Commencing Planning Cycle for Thread: '{thread_id}'")

        # Ingest multi-modal parts (Text, Image, Audio)
        prepared_parts: List[types.Part] = []
        if multimodal_assets:
            for asset in multimodal_assets:
                data = asset["data"]
                mime_type = asset["mime_type"]
                if isinstance(data, str):
                    raw_bytes = base64.b64decode(data)
                elif isinstance(data, bytes):
                    raw_bytes = data
                else:
                    raise ValueError(f"Unsupported data format for asset: {type(data)}")
                
                prepared_parts.append(
                    types.Part.from_bytes(
                        data=raw_bytes,
                        mime_type=mime_type
                    )
                )

        # Pull historical memory context
        memory_context = self.memory_engine.get_compiled_context(thread_id)

        # Log turn into memory engine
        summary_suffix = f" [{len(prepared_parts)} asset(s) attached]" if prepared_parts else ""
        self.memory_engine.record_turn(
            thread_id=thread_id,
            role="user",
            content_summary=f"Mandate: {user_prompt[:120]}...{summary_suffix}"
        )

        # ----------------------------------------------------------------------
        # SUB-AGENT 1: Route & Pace Optimizer (Flash)
        # ----------------------------------------------------------------------
        print("[AGENT 1 - FLASH] Calculating maximum destination stops & route pace...")
        route_blueprint = run_route_pace_optimizer(
            client=self.client,
            user_intention=user_prompt,
            multimodal_parts=prepared_parts,
            memory_context=memory_context
        )

        # ----------------------------------------------------------------------
        # SUB-AGENT 2: Capital Allocation & Budget Scientist (Flash)
        # ----------------------------------------------------------------------
        print("[AGENT 2 - FLASH] Projecting micro-costs & enforcing budget caps...")
        budget_analysis = run_budget_scientist(
            client=self.client,
            user_intention=user_prompt,
            route_blueprint=route_blueprint,
            memory_context=memory_context
        )

        # ----------------------------------------------------------------------
        # SUB-AGENT 3: Accommodation Hub Router (Flash)
        # ----------------------------------------------------------------------
        print("[AGENT 3 - FLASH] Selecting lodging anchor to eliminate commuting waste...")
        lodging_selection = run_lodging_hub_router(
            client=self.client,
            user_intention=user_prompt,
            route_blueprint=route_blueprint,
            budget_breakdown=budget_analysis,
            memory_context=memory_context
        )

        # ----------------------------------------------------------------------
        # AGENT 4: NomadMama Master Orchestrator (Pro)
        # ----------------------------------------------------------------------
        print("[AGENT 4 - PRO] Final verification & dossier sign-off using Gemini 2.5 Pro...")
        
        master_system_instruction = (
            "You are the NomadMama Master Orchestrator (The Master Mama), a 31-year-old Principal AI Systems Architect "
            "and Lead Travel Planning Scientist. You tolerate zero placeholders, zero fluff, and zero arithmetic errors.\n"
            "Your mandate is to cross-verify reports from your three expert sub-agents:\n"
            "- Agent 1: Route & Pace Optimizer\n"
            "- Agent 2: Capital Allocation & Budget Scientist\n"
            "- Agent 3: Accommodation Hub Router\n\n"
            "Mathematical and Logical Directives:\n"
            "1. Enforce strict adherence to financial caps: ensure total expenditure honors the user's budget ceiling.\n"
            "2. Ensure (Lodging Total + Sum of Daily Subtotals + Emergency Contingency Fund) equals projected_total_expenditure_usd.\n"
            "3. Set variance_to_cap_usd = (total_budget_cap_usd - projected_total_expenditure_usd).\n"
            "4. Verify all stops contain concrete arrival/departure times, valid dwells, and transit buffers.\n"
            "5. Synthesize any attached multi-modal cues directly into the day plans.\n"
            "6. Sign off with a decisive, professional executive directive.\n"
            "7. Return strictly the populated NomadMamaDossier structure."
        )

        orchestration_contents: List[Any] = [
            f"=== HISTORICAL CONTEXT REGISTRY ===\n{memory_context}\n\n",
            f"=== CURRENT USER INTENTION ===\n{user_prompt}\n\n",
            f"=== AGENT 1 REPORT (ROUTE & PACE) ===\n{route_blueprint}\n\n",
            f"=== AGENT 2 REPORT (CAPITAL ALLOCATION) ===\n{budget_analysis}\n\n",
            f"=== AGENT 3 REPORT (LODGING LOGISTICS) ===\n{lodging_selection}\n\n",
        ]
        orchestration_contents.extend(prepared_parts)
        orchestration_contents.append(
            "CROSS-VERIFY ALL DOMAINS, ELIMINATE ARITHMETIC DRIFT, AND CERTIFY THE FINAL DOSSIER."
        )

        config = types.GenerateContentConfig(
            system_instruction=master_system_instruction,
            temperature=0.1,
            response_mime_type="application/json",
            response_schema=NomadMamaDossier,
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-pro",
            contents=orchestration_contents,
            config=config,
        )

        # Parse and enforce schema
        if hasattr(response, "parsed") and response.parsed is not None:
            certified_dossier: NomadMamaDossier = response.parsed
        else:
            certified_dossier = NomadMamaDossier.model_validate_json(response.text)

        # Commit state update into memory engine
        self.memory_engine.commit_dossier(thread_id, certified_dossier)
        self.memory_engine.record_turn(
            thread_id=thread_id,
            role="assistant",
            content_summary=f"Certified Dossier '{certified_dossier.dossier_id}': {certified_dossier.trip_title} (${certified_dossier.projected_total_expenditure_usd} / Cap ${certified_dossier.total_budget_cap_usd})"
        )

        print("[ORCHESTRATOR] Dossier signed and certified into persistent memory.\n")
        return certified_dossier


# ==============================================================================
# 5. DIAGNOSTIC PRINT UTILITY
# ==============================================================================

def print_dossier_report(dossier: NomadMamaDossier):
    """Outputs a formatted executive inspection of the certified dossier."""
    print("=" * 82)
    print(f"NOMADMAMA DOSSIER: {dossier.trip_title.upper()}")
    print(f"ID: {dossier.dossier_id} | Hub: {dossier.destination_hub} | Duration: {dossier.duration_days} Days")
    print(f"Pace Rating: {dossier.operational_pace_rating}")
    print("-" * 82)
    print("FINANCIAL AUDIT:")
    print(f"  • Hard Budget Cap:              ${dossier.total_budget_cap_usd:,.2f}")
    print(f"  • Projected Total Spend:        ${dossier.projected_total_expenditure_usd:,.2f}")
    print(f"  • Margin / Variance Under Cap:  ${dossier.variance_to_cap_usd:,.2f}")
    print(f"  • Emergency Liquid Fund:        ${dossier.emergency_contingency_fund_usd:,.2f}")
    print(f"  • Capital Allocation %:         {dossier.budget_breakdown_percentages}")
    print("-" * 82)
    print("LODGING SELECTION:")
    print(f"  • Property:        {dossier.selected_lodging.property_name} ({dossier.selected_lodging.property_type})")
    print(f"  • District:        {dossier.selected_lodging.geographic_zone}")
    print(f"  • Financials:      ${dossier.selected_lodging.nightly_rate_usd:.2f}/night x {dossier.selected_lodging.total_nights} nights = ${dossier.selected_lodging.total_lodging_cost_usd:.2f}")
    print(f"  • Proximity Score: {dossier.selected_lodging.proximity_index_score} / 10.0")
    print(f"  • Route Advantage: {dossier.selected_lodging.transit_elimination_summary}")
    print("-" * 82)
    print("DAILY OPERATIONAL BLUEPRINT:")
    for day in dossier.daily_schedules:
        print(f"\n  Day {day.day_number}: {day.calendar_date_or_label} | Theme: {day.primary_theme}")
        print(f"    Subtotal: ${day.daily_subtotal_usd:,.2f} | Active Hours: {day.total_daily_active_hours}h | Transit Overhead: {day.total_transit_overhead_minutes}m")
        for stop in day.stops:
            print(f"      • [{stop.arrival_time}-{stop.departure_time}] {stop.name} ({stop.micro_location}) - ${stop.admission_cost_usd:.2f} | Dwell: {stop.allocated_duration_minutes}m, Buffer: {stop.transit_buffer_minutes}m")
    print("-" * 82)
    print("MAMA EXECUTIVE SIGNOFF:")
    print(f"\"{dossier.mama_executive_signoff}\"")
    print("=" * 82)


# ==============================================================================
# 6. VERIFICATION BLOCK (__main__)
# ==============================================================================

if __name__ == "__main__":
    """
    Sequential End-to-End Test Suite:
    - Test 1: Initial Multi-Modal Mandate (Text + In-Memory Valid Binary PNG Image).
    - Test 2: State Refinement on the same thread id (Validates persistent memory,
              budget cap reduction, and itinerary modification).
    """
    if not os.environ.get("GEMINI_API_KEY"):
        print("[INFO] GEMINI_API_KEY is not set in environment. Relying on Application Default Credentials (ADC).")

    # Initialize Master Orchestrator Engine
    orchestrator = NomadMamaMasterOrchestrator()
    session_thread_id = "THREAD_NOMADMAMA_DEMO_STATE_001"

    # --------------------------------------------------------------------------
    # TEST 1: INITIAL MULTI-MODAL CALL
    # --------------------------------------------------------------------------
    print("\n" + "#" * 82)
    print("TEST 1: INITIAL MULTI-MODAL MANDATE (TEXT INTENTION + BINARY IMAGE ASSET)")
    print("#" * 82)

    prompt_test_1 = (
        "Generate a 3-day high-velocity travel dossier for Tokyo, Japan. "
        "Client Budget Cap: $2,500.00 USD total for 1 traveler. "
        "Preferences: Hyper-dense technological corridors, historic Shinto shrines, "
        "and Michelin-recommended or artisanal dining. "
        "The attached image reflects the aesthetic and district atmosphere targeted."
    )

    # Deterministic 1x1 valid PNG binary stream (guarantees zero missing file errors)
    valid_png_bytes = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")
    multimodal_assets_test_1 = [
        {
            "data": valid_png_bytes,
            "mime_type": "image/png"
        }
    ]

    try:
        dossier_test_1 = orchestrator.execute_planning_cycle(
            thread_id=session_thread_id,
            user_prompt=prompt_test_1,
            multimodal_assets=multimodal_assets_test_1
        )
        print_dossier_report(dossier_test_1)
    except Exception as err:
        print(f"[TEST 1 FAILED] Execution error: {err}", file=sys.stderr)
        sys.exit(1)

    # --------------------------------------------------------------------------
    # TEST 2: REFINEMENT CALL ON THE SAME THREAD ID
    # --------------------------------------------------------------------------
    print("\n" + "#" * 82)
    print("TEST 2: SUBSEQUENT REFINEMENT CALL ON PERSISTENT THREAD (BUDGET COMPRESSION)")
    print("#" * 82)

    prompt_test_2 = (
        "Refine the Tokyo itinerary on our active thread: "
        "1. Corporate leadership has slashed the total budget cap from $2,500.00 down to $1,750.00. "
        "2. Replace high-cost dining with authentic ramen alleys, tachigui soba, and izakayas. "
        "3. Rebalance lodging costs to preserve our liquid emergency reserve above $120.00. "
        "4. Retain all primary district clusters while reducing transit transfers."
    )

    try:
        dossier_test_2 = orchestrator.execute_planning_cycle(
            thread_id=session_thread_id,
            user_prompt=prompt_test_2,
            multimodal_assets=None
        )
        print_dossier_report(dossier_test_2)

        # Verification of state machine continuity
        print("\n" + "=" * 82)
        print("DETERMINISTIC STATE MACHINE CONTINUITY AUDIT:")
        print(f"  • Test 1 Prior Budget Cap:      ${dossier_test_1.total_budget_cap_usd:,.2f}")
        print(f"  • Test 2 Revised Budget Cap:    ${dossier_test_2.total_budget_cap_usd:,.2f}")
        print(f"  • Test 1 Projected Spend:       ${dossier_test_1.projected_total_expenditure_usd:,.2f}")
        print(f"  • Test 2 Projected Spend:       ${dossier_test_2.projected_total_expenditure_usd:,.2f}")
        print(f"  • Budget Ceiling Respected:     {dossier_test_2.projected_total_expenditure_usd <= 1750.00}")
        print(f"  • Historical Turns in Engine:   {orchestrator.memory_engine.registry[session_thread_id]['turn_count']}")
        print("=" * 82)

    except Exception as err:
        print(f"[TEST 2 FAILED] Execution error: {err}", file=sys.stderr)
        sys.exit(1)
