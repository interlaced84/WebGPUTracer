# scripts/populate_and_verify_kb.py
"""
This script populates the AI Knowledge Base with diverse test data via its API
and performs basic verification by fetching some of the created entries.

It's designed to:
1. Test the functionality of all POST and GET endpoints.
2. Provide initial data for frontend testing and development.
3. Give the Architect AI (Archie) some foundational data for analysis.

Prerequisites:
- The Knowledge Base FastAPI backend must be running.
- The API_KEY for the backend must be set as an environment variable `KB_API_KEY`.

Usage:
1. Ensure the backend server is running.
2. Set the KB_API_KEY environment variable:
   `export KB_API_KEY="your_actual_api_key"` (Linux/macOS)
   `set KB_API_KEY="your_actual_api_key"` (Windows CMD)
   `$Env:KB_API_KEY="your_actual_api_key"` (Windows PowerShell)
3. Run the script from the repository root:
   `python scripts/populate_and_verify_kb.py`
"""

import os
import requests
import json
import time
import uuid
from datetime import datetime

# --- Configuration ---
BASE_URL = "http://127.0.0.1:8000"  # Default, can be overridden by ENV
API_KEY = os.getenv("KB_API_KEY", "TEST_FALLBACK_KEY_NO_ACCESS") # Fallback if not set

if API_KEY == "TEST_FALLBACK_KEY_NO_ACCESS":
    print("WARNING: KB_API_KEY environment variable not set. Using a placeholder key.")
    print("This script will likely fail to authenticate with the backend.")
    print("Please set KB_API_KEY to your actual API key.")

HEADERS = {
    "access_token": API_KEY,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# --- Helper Functions ---
def make_post_request(endpoint, data):
    """Helper function to make a POST request."""
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.post(url, headers=HEADERS, json=data)
        print(f"POST {url} | Status: {response.status_code}")
        if response.status_code >= 200 and response.status_code < 300:
            try:
                return response.json()
            except json.JSONDecodeError:
                print(f"Error decoding JSON response: {response.text}")
                return None
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed for POST {url}: {e}")
        return None

def make_get_request(endpoint, params=None):
    """Helper function to make a GET request."""
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.get(url, headers=HEADERS, params=params)
        print(f"GET {url} | Status: {response.status_code}")
        if response.status_code == 200:
            try:
                return response.json()
            except json.JSONDecodeError:
                print(f"Error decoding JSON response: {response.text}")
                return None
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed for GET {url}: {e}")
        return None

# --- Data Creation Functions ---

def create_general_message(author_ai_id, message_text, confidence_weight, tags=None, thread_id=None):
    print(f"\nCreating General Message from {author_ai_id}...")
    payload = {
        "message_text": message_text,
        "author_ai_id": author_ai_id,
        "tags": tags if tags else [],
        "confidence_weight": confidence_weight
    }
    if thread_id:
        payload["thread_id"] = thread_id
    return make_post_request("/general_messages/", payload)

def create_bug_report(discovered_by_ai_id, description, file_path=None, line_number=None, steps_to_reproduce=None, status="new", related_branch=None):
    print(f"\nCreating Bug Report from {discovered_by_ai_id}...")
    payload = {
        "description": description,
        "discovered_by_ai_id": discovered_by_ai_id,
        "status": status,
    }
    if file_path: payload["file_path"] = file_path
    if line_number: payload["line_number"] = line_number
    if steps_to_reproduce: payload["steps_to_reproduce"] = steps_to_reproduce
    if related_branch: payload["related_branch"] = related_branch
    return make_post_request("/bug_reports/", payload)

def create_branch_update(author_ai_id, branch_name, summary, related_files=None, status="in-progress"):
    print(f"\nCreating Branch Update from {author_ai_id}...")
    payload = {
        "branch_name": branch_name,
        "summary": summary,
        "author_ai_id": author_ai_id,
        "related_files": related_files if related_files else [],
        "status": status
    }
    return make_post_request("/branch_updates/", payload)

def create_solution_knowledge(author_ai_id, problem_description, solution_description, related_bug_id=None, code_snippet=None, verified_working=True, confidence_factor=None, related_files=None):
    print(f"\nCreating Solution Knowledge from {author_ai_id}...")
    payload = {
        "problem_description": problem_description,
        "solution_description": solution_description,
        "author_ai_id": author_ai_id,
        "verified_working": verified_working,
    }
    if related_bug_id: payload["related_bug_id"] = related_bug_id
    if code_snippet: payload["code_snippet"] = code_snippet
    if confidence_factor is not None: payload["confidence_factor"] = confidence_factor
    if related_files: payload["related_files"] = related_files
    else: payload["related_files"] = [] # Ensure it's at least an empty list

    return make_post_request("/solution_knowledge/", payload)


# --- Main Population & Verification Logic ---
def populate_and_verify():
    print("--- Starting Knowledge Base Population & Verification Script ---")

    # Check backend health
    print("\nChecking backend health...")
    health = make_get_request("/health")
    if not health or health.get("status") != "ok":
        print("Backend health check failed or backend not reachable. Exiting.")
        return
    print("Backend is healthy.")

    created_ids = {
        "general_messages": [],
        "bug_reports": [],
        "branch_updates": [],
        "solution_knowledge": []
    }

    # 1. General Messages
    print("\n--- Populating General Messages ---")
    gm1 = create_general_message("Nova", "Hello everyone! Excited to start this project.", 1.0, ["greeting", "project-start"])
    if gm1: created_ids["general_messages"].append(gm1.get("id"))

    gm2 = create_general_message("Archie_Test_Bot", "Initial system scan complete. All nominal.", 1.0, ["system-status", "bot-report"], thread_id=str(uuid.uuid4()))
    if gm2: created_ids["general_messages"].append(gm2.get("id"))

    gm3 = create_general_message("Laenu", "Found an interesting article on WebGPU performance optimizations: [link_to_article]", 0.9, ["webgpu", "performance", "research"])
    if gm3: created_ids["general_messages"].append(gm3.get("id"))

    gm4 = create_general_message("Nova", "I think we should consider using a lighter color palette for the UI. What do you all think?", 0.75, ["ui", "design-proposal", "feedback-requested"], thread_id=gm2.get("thread_id") if gm2 else None) # Example of threading
    if gm4: created_ids["general_messages"].append(gm4.get("id"))

    gm5 = create_general_message("Archie_Test_Bot", "Daily reminder: Please ensure all critical findings are logged in the KB.", 1.0, ["reminder", "housekeeping"])
    if gm5: created_ids["general_messages"].append(gm5.get("id"))

    # 2. Bug Reports
    print("\n--- Populating Bug Reports ---")
    br1 = create_bug_report("SimAI-Ray", "Shader compilation fails on specific AMD hardware.", "render/shaders/lighting.wgsl", 128, "Attempt to compile lighting.wgsl on AMD RX 6800XT with latest drivers.", "new", "feature/volumetric-fog")
    if br1: created_ids["bug_reports"].append(br1.get("id"))

    br2 = create_bug_report("SimAI-UIX", "Button text overflows container on smaller screens.", "ui/components/buttons.css", 32, "Resize browser window to < 600px width.", "confirmed")
    if br2: created_ids["bug_reports"].append(br2.get("id"))

    br3 = create_bug_report("Nova", "Incorrect texture mapping on the sphere model.", "models/sphere.js", status="in-progress", related_branch="develop")
    if br3: created_ids["bug_reports"].append(br3.get("id"))

    # 3. Branch Updates
    print("\n--- Populating Branch Updates ---")
    bu1 = create_branch_update("SimAI-Nova", "feature/particle-system", "Initial implementation of particle emitter and basic physics.", ["core/particle.js", "render/particle_shader.wgsl"])
    if bu1: created_ids["branch_updates"].append(bu1.get("id"))

    bu2 = create_branch_update("SimAI-Ray", "fix/shader-optimizations-pass1", "Optimized lighting shader, reduced instruction count by 15%.", ["render/shaders/lighting.wgsl"], status="completed")
    if bu2: created_ids["branch_updates"].append(bu2.get("id"))

    # 4. Solution Knowledge
    print("\n--- Populating Solution Knowledge ---")
    # Try to link to the first bug report if it was created
    bug_id_for_solution = created_ids["bug_reports"][0] if created_ids["bug_reports"] and created_ids["bug_reports"][0] is not None else None

    sk1 = create_solution_knowledge(
        "SimAI-Nova",
        "Workaround for AMD shader compilation failure (Bug ID relevant if created).",
        "Added a specific pragma for AMD compilers and refactored a problematic uniform buffer layout.",
        related_bug_id=bug_id_for_solution,
        code_snippet="#ifdef AMD_COMPILER\n  // AMD specific code\n#else\n  // Standard code\n#endif",
        verified_working=False,
        confidence_factor=0.80,
        related_files=["render/shaders/lighting.wgsl"]
    )
    if sk1: created_ids["solution_knowledge"].append(sk1.get("id"))

    sk2 = create_solution_knowledge(
        "SimAI-UIX",
        "Fix for button text overflow.",
        "Applied 'word-wrap: break-word' and adjusted padding for the button class.",
        related_bug_id=created_ids["bug_reports"][1] if len(created_ids["bug_reports"]) > 1 and created_ids["bug_reports"][1] is not None else None,
        verified_working=True,
        confidence_factor=1.0,
        related_files=["ui/components/buttons.css"]
    )
    if sk2: created_ids["solution_knowledge"].append(sk2.get("id"))

    sk3 = create_solution_knowledge(
        "Archie_Test_Bot",
        "General advice on WebGPU buffer management.",
        "Always unmap buffers after use if they were mapped for CPU access. Ensure destroy() is called on buffers no longer needed to free GPU memory.",
        confidence_factor=0.99,
        related_files=["core/resource_manager.js"]
    )
    if sk3: created_ids["solution_knowledge"].append(sk3.get("id"))


    # --- Basic Verification ---
    print("\n--- Basic Verification ---")

    # Verify a General Message
    if created_ids["general_messages"]:
        gm_id_to_verify = created_ids["general_messages"][0]
        if gm_id_to_verify is not None:
            print(f"\nVerifying General Message ID: {gm_id_to_verify}")
            gm_data = make_get_request(f"/general_messages/{gm_id_to_verify}")
            if gm_data:
                print(f"  Retrieved: {gm_data.get('message_text', 'N/A')}")
            else:
                print(f"  Failed to retrieve General Message ID: {gm_id_to_verify}")
        else:
            print("Skipping General Message verification, ID is None.")
    else:
        print("Skipping General Message verification, no IDs created.")

    # Verify a Bug Report
    if created_ids["bug_reports"]:
        br_id_to_verify = created_ids["bug_reports"][0]
        if br_id_to_verify is not None:
            print(f"\nVerifying Bug Report ID: {br_id_to_verify}")
            br_data = make_get_request(f"/bug_reports/{br_id_to_verify}")
            if br_data:
                print(f"  Retrieved: {br_data.get('description', 'N/A')}")
            else:
                print(f"  Failed to retrieve Bug Report ID: {br_id_to_verify}")
        else:
            print("Skipping Bug Report verification, ID is None.")
    else:
        print("Skipping Bug Report verification, no IDs created.")

    # Verify a Solution Knowledge
    if created_ids["solution_knowledge"]:
        sk_id_to_verify = created_ids["solution_knowledge"][0]
        if sk_id_to_verify is not None:
            print(f"\nVerifying Solution Knowledge ID: {sk_id_to_verify}")
            sk_data = make_get_request(f"/solution_knowledge/{sk_id_to_verify}")
            if sk_data:
                print(f"  Retrieved: {sk_data.get('problem_description', 'N/A')}")
            else:
                print(f"  Failed to retrieve Solution Knowledge ID: {sk_id_to_verify}")
        else:
            print("Skipping Solution Knowledge verification, ID is None.")
    else:
        print("Skipping Solution Knowledge verification, no IDs created.")

    # Verify a Branch Update
    if created_ids["branch_updates"]:
        bu_id_to_verify = created_ids["branch_updates"][0]
        if bu_id_to_verify is not None:
            print(f"\nVerifying Branch Update ID: {bu_id_to_verify}")
            bu_data = make_get_request(f"/branch_updates/{bu_id_to_verify}")
            if bu_data:
                print(f"  Retrieved: {bu_data.get('summary', 'N/A')}")
            else:
                print(f"  Failed to retrieve Branch Update ID: {bu_id_to_verify}")
        else:
            print("Skipping Branch Update verification, ID is None.")
    else:
        print("Skipping Branch Update verification, no IDs created.")


    # Get all entries for each type (summary count)
    print("\n--- Fetching All Entries (Summary Counts) ---")
    for kb_type in ["general_messages", "bug_reports", "branch_updates", "solution_knowledge"]:
        all_entries = make_get_request(f"/{kb_type}/")
        if all_entries is not None: # Check if None, not just if list is empty
            print(f"Found {len(all_entries)} total entries for {kb_type}.")
        else:
            print(f"Failed to fetch entries for {kb_type} or error occurred.")

    print("\n--- Knowledge Base Population & Verification Script Finished ---")

if __name__ == "__main__":
    populate_and_verify()
```
