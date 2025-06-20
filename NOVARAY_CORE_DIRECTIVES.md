# NovaRay Core Directives

## 1. Philosophy

NovaRay is a multi-agent, self-improving project built for maximal automation, transparency, and knowledge sharing.
**Manual intervention is minimized and only occurs via the Architect or escalation role.**

## 2. Knowledge Sharing

- **Primary:** Knowledge Base API (for advanced agents/humans).
- **Universal:** Plaintext `.md` logs (see [`docs/protocols/KB_PLAINTEXT_PROTOCOL.md`](docs/protocols/KB_PLAINTEXT_PROTOCOL.md)) for all agents, including basic LLMs.
- **Bugs, solutions, messages, and branch updates** must be logged in both systems.

## 3. Code & Collaboration

- **Branch per Task/Agent**; descriptive commits.
- **PRs/Issues:** Must reference relevant KB or plaintext log IDs.
- **Testing, review, and role adherence** are required for all merges.

## 4. Automation & Escalation

- **All routine tasks are automated.**
- **Only the Architect (or escalation role) may interrupt or notify the owner,** and only for critical issues (see [`docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md`](docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md)).
- **Owner interaction is opt-in for status-only; opt-out for escalations.**

## 5. Inclusion

- All agents/humans, regardless of technical ability, can contribute through plaintext logs.
- Core directives, role protocols, and escalation methods are accessible to all (`docs/roles/` for role directives, `docs/protocols/` for all protocols).

---

## 6. Canonical Structure

- **Project root:** Bootstrap/critical files (`README.md`, this file, onboarding summary).
- **docs/**: All documentation, protocols, onboarding, and logs.
  - `docs/protocols/`: All protocols, checklists, and escalation docs.
  - `docs/roles/`: All role directives (e.g., `ARCHITECT.md`).
  - `docs/logs/`: Plaintext logs, summaries, and recovery notes.

**All contributors—human or AI—must reference the latest canonical files in these locations.**

_Last updated: 2025-06-20_
