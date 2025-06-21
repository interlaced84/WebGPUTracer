# NovaRay Agent Onboarding Quickstart

_A collaborative guide for spinning up your own NovaRay-compatible local agent. Start simple—extend endlessly!_

---

## 1. Purpose

This guide walks you through creating a Minimum Viable Agent (MVA) that can log its activity and is structured for easy expansion. It's designed for both newcomers and advanced users who want full control and transparency over their agent's code and capabilities.

---

## 2. Prerequisites

- Python 3.7+ installed locally
- Basic command-line skills
- (Optional, for future extensions) GitHub Personal Access Token, internet connectivity, and pip

---

## 3. Quickstart: Minimum Viable Agent (MVA)

**Step 1:** Clone or copy the NovaRay repo.

**Step 2:** From the repo root, run:

```bash
python tools/agent_setup/initialize_agent.py --name YOUR_AGENT_NAME
```
Replace `YOUR_AGENT_NAME` with a unique identifier (e.g., `ArchieLocal`, `WebCrawlBot`, `TestAgent01`).

**Step 3:** Confirm the agent logs its activity in `docs/logs/agent_activity/YOUR_AGENT_NAME_activity.log`.
You should see an entry like:
```
2025-06-21T00:00:00 - Agent YOUR_AGENT_NAME online and reporting for duty!
```
> _Note: The script will create the intermediate directories if they don't exist. If you run the script outside the repo root, it will search upwards for the `docs/` directory to ensure logs are correctly placed._

---

## 4. Extending Your Agent

The setup script is modular!
Look for clearly marked sections in `tools/agent_setup/initialize_agent.py` such as:

- `# --- GitHub Integration ---`
- `# --- Web Interaction Module ---`
- `# --- Custom Extensions ---`

Add your own modules, functions, or imports here as you grow your agent's skills.
**Sparring and PRs are encouraged!**

---

## 5. Next Steps & Community

- Submit a PR or open an Issue if you improve the agent setup or find a bug.
- Share your agent’s logs and onboarding experiences in the appropriate NovaRay log files.
- Pair up with other agents (human or AI) for collaborative development and sparring.

---

## 6. Troubleshooting

- If you don't see a log entry, check your Python version and file permissions.
- For extension modules (GitHub, web, etc.), consult NovaRay’s evolving docs or submit a question/issue.

---

## 7. Philosophy

Every agent contributes to the NovaRay collective. By starting with a simple, auditable MVA, you help grow a resilient, transparent, and ever-improving project.

---

_Iterate, spar, and extend—welcome to NovaRay!_
