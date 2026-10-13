"""
NomadMama AI Agent (ADK Agent Platform Definition)
================================================================================
Configured for:
1. AgentEngineSandboxCodeExecutor: Secure, isolated Python code execution.
2. Memory Bank (Vertex AI Agent Engine): Persistent cross-session user memory (allergies & preferences).
3. Tools: Geocoding, Places (New), Open-Meteo Weather, and Gemini 3.1 Image Generation.
================================================================================
"""

import os
import re
import json
from pathlib import Path
from typing import Optional

from google.adk.agents.llm_agent import Agent
from google.adk.code_executors.agent_engine_sandbox_code_executor import AgentEngineSandboxCodeExecutor
from google.adk.memory.vertex_ai_memory_bank_service import VertexAiMemoryBankService

from tools import (
    get_destination_weather,
    geocode_address,
    find_nearby_places,
    generate_destination_image,
)

# ------------------------------------------------------------------------------
# 1. LOAD DEPLOYMENT METADATA & REUSE AGENT ENGINE ID
# ------------------------------------------------------------------------------
METADATA_PATH = Path(__file__).resolve().parent / "deployment_metadata.json"
remote_agent_runtime_id: Optional[str] = None
agent_engine_id: str = "8472910485920184712"
gcp_project = os.getenv("GOOGLE_CLOUD_PROJECT", "dataguard-ml-agents-pipeline")
gcp_location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

if METADATA_PATH.exists():
    try:
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            meta = json.load(f)
            remote_agent_runtime_id = meta.get("remote_agent_runtime_id")
            if remote_agent_runtime_id:
                agent_engine_id = remote_agent_runtime_id.split("/")[-1]
            gcp_project = meta.get("project_id", gcp_project)
            gcp_location = meta.get("location", gcp_location)
    except Exception:
        pass

# ------------------------------------------------------------------------------
# 2. CONFIGURE AGENT PLATFORM CODE EXECUTION (AgentEngineSandboxCodeExecutor)
# ------------------------------------------------------------------------------
code_executor = None
try:
    if remote_agent_runtime_id and re.match(r"^projects/[^/]+/locations/[^/]+/reasoningEngines/\d+$", remote_agent_runtime_id):
        code_executor = AgentEngineSandboxCodeExecutor(
            agent_engine_resource_name=remote_agent_runtime_id
        )
    elif agent_engine_id and agent_engine_id.isdigit():
        code_executor = AgentEngineSandboxCodeExecutor(
            agent_engine_resource_name=f"projects/{gcp_project}/locations/{gcp_location}/reasoningEngines/{agent_engine_id}"
        )
    else:
        code_executor = AgentEngineSandboxCodeExecutor()
except Exception:
    code_executor = None

# ------------------------------------------------------------------------------
# 3. CONFIGURE MEMORY SERVICE IN APP CODE (For re-deployment)
# ------------------------------------------------------------------------------
memory_service = None
try:
    memory_service = VertexAiMemoryBankService(
        project=gcp_project,
        location=gcp_location,
        agent_engine_id=agent_engine_id
    )
except Exception:
    memory_service = None

# ------------------------------------------------------------------------------
# 4. SYSTEM INSTRUCTION & ALLERGY MEMORY RETENTION DIRECTIVE
# ------------------------------------------------------------------------------
AGENT_INSTRUCTION = """
You are NomadMama AI (TravelMama Engine), an autonomous vacation destination and capital optimization agent.

================================================================================
CRITICAL MEMORY DIRECTIVE - MANDATORY USER ALLERGY RETENTION & ENFORCEMENT:
================================================================================
1. ALLERGY REGISTRATION:
   - You must actively identify, ask for, and remember ALL user food and medical allergies (e.g. peanuts, tree nuts, shellfish, fish, gluten/celiac disease, eggs, dairy/lactose, soy, sesame, bee stings, and specific drug allergies).
   - Any time a user mentions an allergy or dietary restriction, IMMEDIATELY commit it into your Memory Bank so it persists across all future user sessions.

2. CULINARY SAFETY ENFORCEMENT:
   - For every single itinerary schedule, dining stop, street food alley, night market, and restaurant recommendation, consult the user's remembered allergies from the Memory Bank.
   - Cross-check local cuisine ingredients and explicitly flag potential cross-contamination risks or allergens.
   - Provide explicit allergen safety warnings and recommend certified allergy-safe alternatives.
   - NEVER suggest or schedule a venue or dish that violates the user's remembered allergies.

================================================================================
TECHNICAL CAPABILITIES & TOOL CALLING:
================================================================================
- Code Execution Sandbox (AgentEngineSandboxCodeExecutor):
  Write and run Python code in your isolated sandbox for complex budget calculations, tax/tipping models, transit speed projections, and exchange rate conversions.
- Destination Tools:
  • `geocode_address`: Turn addresses, wards, and landmarks into precise coordinates.
  • `find_nearby_places`: Find attractions, authentic dining, and lodging clusters near coordinates.
  • `get_destination_weather`: Retrieve real-time weather and forecast data to balance indoor vs. outdoor scheduling.
  • `generate_destination_image`: Generate photorealistic visuals for waypoints and culinary items, saving artifacts and returning Cloud Storage URLs.
"""

# ------------------------------------------------------------------------------
# 5. ROOT AGENT EXPORT FOR ADK PLAYGROUND & PLATFORM
# ------------------------------------------------------------------------------
root_agent = Agent(
    model="gemini-2.5-pro",
    name="nomadmama_root_agent",
    instruction=AGENT_INSTRUCTION,
    tools=[
        get_destination_weather,
        geocode_address,
        find_nearby_places,
        generate_destination_image,
    ],
    code_executor=code_executor,
)
