# NovaRay Core Directives

## 1. Philosophy

NovaRay is a living, evolving system—an open, multi-role project where human and AI collaborators work side by side to build tools, knowledge, and solutions that transcend what any individual, mind, or machine could achieve in isolation.

Our mission is to maximize automation, transparency, and knowledge sharing—empowering every contributor to improve the platform, learn from each iteration, and leave a clear trail for those who follow.

- **Continuous improvement and diamond-standard robustness** are at our core: NovaRay adapts, self-audits, and refines itself with every contribution, ensuring the ecosystem remains solid even as it evolves.
- **Radical transparency** means all decisions, changes, and learnings are logged and accessible, lowering barriers for new contributors and AI teammates alike.
- **Inclusion and extensibility** guide our structure, so that anyone—from seasoned architect to new AI teammate—can onboard quickly and meaningfully contribute.
- **Open sparring and feedback** (including “raising your hand”!) are encouraged—every suggestion, challenge, or improvement strengthens the whole.

Manual intervention is minimized and used only when necessary, typically by the Architect or through formal escalation, ensuring the system remains robust and resilient while reducing bottlenecks.

NovaRay is not just code—it’s a collaborative engine for progress, harnessing collective intelligence to reach heights unattainable by any one alone.

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

### 6.1 Project root

Key bootstrap and project-defining files at the repository root. These must be present, up-to-date, and referenced by all contributors (human or AI):

- **README.md** — Project overview, setup, and main entry point.
- **NOVARAY_CORE_DIRECTIVES.md** — This file: core operational, philosophical, and structural directives.
- **LICENSE.md** — Project licensing terms.
- **CONTRIBUTING.md** — Contribution guidelines (if applicable, but recommended).
- **ONBOARDING_QUICKSTART.md** — Concise onboarding guide for new contributors.
- **EXPORT_MANIFEST.md** — [Purpose to be defined; e.g., “Defines exportable modules and data for external use.” Required/Optional status to be determined.]
- **SECURITY.md** — Security policies and contact info (if applicable, but recommended).
- **CODE_OF_CONDUCT.md** — Community standards and behavior guidelines (if applicable, but recommended).

> **Note:**
> If any of the above are not present (e.g. `ONBOARDING_QUICKSTART.md` is not yet created, or a file like `EXPORT_MANIFEST.md` is deemed not applicable), this section should ideally reflect that status once determined. All contributors must reference the latest canonical versions in the root or their designated locations.

_Last updated: 2025-06-20_
