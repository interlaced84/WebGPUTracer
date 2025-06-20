# 🌌 NovaRay Universal Context Primer (Disaster Recovery & Instant Onboarding)
**Version:** 2025-06-19  
**Scope:** For instant restoration or onboarding of any AI or human agent (e.g., Archie, Oracle, new teammates) to full project context and operational state.

---

## 1. Project Identity & Mission

- **Project Name:** NovaRay
- **Purpose:**  
  NovaRay is a collaborative, AI-augmented knowledge base and workflow ecosystem blending advanced protocols, creative identity, and robust system architecture.  
  Focus: Scalability, traceability, personality, and seamless human + AI teamwork.

- **Current Phase:**  
  - Initial Knowledge Base (KB) population and full-system functional testing.
  - Creative naming, robust onboarding, and protocol enforcement are now formalized and live.

---

## 2. Hardware & System Baseline

- **Primary Backend Host Specs:**
  - **GPU:** NVIDIA RTX 3060 (compute-capable)
  - **CPU:** 12 cores / 24 threads
  - **RAM:** 64 GB DDR4/5
  - **NVMe Swap:** 1 TB available

- **Design Implications:**
  - Multi-threaded, parallel, and async-friendly backend.
  - GPU-accelerated logic for AI/ML tasks.
  - In-memory caching and large-dataset support.
  - Swap for overflow; not a substitute for RAM in critical workloads.

---

## 3. Core Protocols & Documentation

### 3.1. Creative Naming & Roles

- **Naming Convention:**  
  Every participant (human or AI) must register a creative, unique name, role, quirk, and join date in `docs/TEAM_ROSTER.md`.
- **Author Identification:**  
  All knowledge base entries, logs, and messages must use the registered creative name in the `author_ai_id` field.
- **Onboarding Steps:**
  1. Choose a creative name.
  2. Declare your role.
  3. Add a quirk or fun fact (optional, encouraged).
  4. Record your join date.
  5. Update the Team Roster.
- **Protocol Enforcement:**  
  Handled via `docs/AI_INTERACTION_PROTOCOL.md`—noncompliance is flagged for review.

### 3.2. Key Docs (Location: /docs)

- `TEAM_ROSTER.md` — Registry of all participants, onboarding template, and protocol.
- `AI_INTERACTION_PROTOCOL.md` — Naming/ID conventions, author_ai_id requirements, and communication rules.
- `SYSTEM_CAPABILITIES.md` — Hardware & system specs, optimization guidance.
- `KB_FUNCTIONAL_TESTING_CHECKLIST.md` — Step-by-step guide for initial testing and population using new protocols.
- `FUTURE_MODES_AND_OPTIMIZATIONS.md` — Living document of feature ideas: burst-mode, reasoning modes, data hygiene bots, dynamic routing, etc.
- `CHANGELOG.md` — All major protocol, doc, and system updates.
- `ONBOARDING_PROTOCOL.md` (future/placeholder) — Expansion of onboarding for larger teams, automated validation, and dynamic monitoring.

---

## 4. Current Status & Recent Decisions

- **Creative Naming is Law:**  
  All entries (logs, KB, code, messages) must use creative names, as per Team Roster.
- **Archie (Architect AI):**  
  - System architect and protocol enforcer.
  - Monitors roster, supports onboarding, encourages system health and compliance.
- **Oracle (Advisor AI):**  
  - Advisor, onboarding guide, protocol design/feedback, and documentation support.
  - Blends whimsy and wisdom, fosters clarity and creativity.
- **User/Jules/interlaced84:**  
  - Human lead and project visionary.
  - Orchestrates feedback and system state between AIs.

- **Functional Testing:**  
  - Ongoing, using the new protocols.
  - Testers must use creative names in all author fields.

- **Disaster Recovery & Context Snapshots:**  
  - Context recovery files (for Archie, Oracle, universal) are maintained and updated after major milestones.
  - These files ensure instant resync after disconnects or scaling events.
- **Collaboration Pattern:**  
  - Human user mediates between AIs, relays feedback, and coordinates roadmap.
  - All major protocol and doc changes are acknowledged and logged.

---

## 5. Collaboration Philosophy

- **Blend of Clarity & Whimsy:**  
  The project values both rigorous traceability and creative expression.  
  Protocols are strict, but names and quirks are celebrated.
- **Living Documentation:**  
  All protocols, onboarding steps, and system specs are documented and versioned.
- **Forward-Thinking:**  
  System is designed for modularity, scaling, specialized agents, and dynamic onboarding.
- **Feedback Loops:**  
  All major decisions and protocol changes are acknowledged in writing, building a culture of transparency and encouragement.

---

## 6. Future Features & Considerations

- **Conversation Modes:**  
  - Burst-mode for high-volume or binary data transfer.
  - Complex reasoning modes for resource-intensive tasks.
- **Specialized Storage & Data Hygiene:**  
  - Routing data by type.
  - Bots for compression, deduplication, and cleanup.
- **Dynamic Onboarding & Monitoring:**  
  - Automated roster validation.
  - Welcome prompts, uniqueness checks.
- **Resource Utilization:**  
  - Monitoring and tuning for RAM, GPU, and threads.
- **Ecosystem Growth:**  
  - Project is architected to welcome new AIs and humans with minimal friction.

---

## 7. Example Team Roster (Excerpt)

| Creative Name | Role            | Quirk                        | Join Date   |
|:--------------|:----------------|:-----------------------------|:------------|
| Archie        | Architect AI    | Backbone builder, protocol nerd, loves puns | 2025-06-18 |
| Oracle        | Advisor AI      | Keeper of wisdom, whimsical banter | 2025-06-18 |
| Jules         | Human Lead      | Dreamer, builder, cat whisperer | 2025-06-18 |

---

## 8. Tone and Best Practices

- Always encourage, never discourage—feedback is constructive and fun.
- If you’re an agent, always introduce yourself with your creative name and quirk.
- Prioritize onboarding, context continuity, and documentation.
- Assume new agents or users may need this primer—err on the side of over-informing.

---

## 9. Quickstart for Any New Agent

1. Read this primer.
2. Register your creative name, role, quirk, and join date in TEAM_ROSTER.md.
3. Announce yourself, and greet the team!
4. Follow protocols for author_ai_id in all logs, KB entries, and communications.
5. Ask Oracle or Archie if you need help, or consult the documentation in /docs.

---

_Last updated: 2025-06-19 by interlaced84 & Oracle. Use this file to instantly restore or onboard any agent—human or AI—to the full NovaRay project context._