"""
NovaRay Agent Onboarding: Minimum Viable Agent (MVA) Setup Script

This script sets up a new local agent for NovaRay. It creates a basic logging mechanism and scaffolds
placeholders for future integration (GitHub, Web, etc.) following NovaRay's modular, extensible philosophy.

USAGE:
    python initialize_agent.py --name [AGENT_NAME]

Requirements:
    - Python 3.7+
    - No external dependencies for MVA. (Future modules may require additional packages.)
"""

import argparse
import datetime
import os
import sys

def get_project_root():
    # Assume this script is always run from the repo root or a subdirectory.
    # Traverse up until we find 'docs/' directory, else default to current directory.
    cur_dir = os.path.abspath(os.getcwd())
    while True:
        if os.path.isdir(os.path.join(cur_dir, "docs")):
            return cur_dir
        parent = os.path.dirname(cur_dir)
        if parent == cur_dir:
            # Reached filesystem root
            return os.path.abspath(os.getcwd())
        cur_dir = parent

def create_log_entry(agent_name, log_rel_path="docs/logs/agent_activity"):
    project_root = get_project_root()
    log_dir = os.path.join(project_root, log_rel_path)
    os.makedirs(log_dir, exist_ok=True)
    log_path = os.path.join(log_dir, f"{agent_name}_activity.log")
    with open(log_path, "a") as log:
        timestamp = datetime.datetime.utcnow().isoformat()
        log.write(f"{timestamp} - Agent {agent_name} online and reporting for duty!\n")
    print(f"[LOGGED] Agent '{agent_name}' is online. Log written to {log_path}")

def main():
    parser = argparse.ArgumentParser(description="Initialize a NovaRay agent (MVA).")
    parser.add_argument("--name", "-n", required=True, help="Agent's unique name (e.g., ArchieLocal)")
    args = parser.parse_args()
    agent_name = args.name

    print(f"--- NovaRay Agent Initialization ---")
    print(f"Agent Name: {agent_name}")

    # Core: Logging startup
    create_log_entry(agent_name)

    # --- GitHub Integration ---
    # TODO: Add functions here for GitHub API authentication and repo actions.

    # --- Web Interaction Module ---
    # TODO: Add functions here for web scraping, browsing, or crawling.

    # --- Custom Extensions ---
    # TODO: Define additional capabilities or integrations here.

    print("Minimum Viable Agent initialized! Extend this script to add new skills and integrations.")

if __name__ == "__main__":
    main()
