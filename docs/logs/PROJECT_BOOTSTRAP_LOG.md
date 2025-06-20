# Project Bootstrap Log

_Author: Oracle/Archie (with Architect oversight)_

This log documents key milestones, architectural changes, and critical bootstrapping events for the NovaRay project.
It is the authoritative chronological record for all foundational changes and is referenced by onboarding protocols, the Historian, and all agents.

---

## Key Principles

- Every foundational change (protocol, directory structure, critical role, or recovery event) must be logged here with a timestamp.
- All entries must be factual, concise, and reference related logs, PRs, or protocol docs when relevant.
- This log is **immutable** except by Architect/escalation role, or gold-standard agent protocol.
  Corrections to existing entries, if absolutely necessary, should be logged as new, timestamped entries detailing the correction and referencing the original entry, rather than by modifying past entries directly.

---

## Entries

### 2025-06-20: Canonical Structure Established

- Officialized the canonical directory structure:
  - `docs/protocols/` for all protocols, checklists, and escalation docs.
  - `docs/roles/` for all role directives.
  - `docs/logs/` for plaintext logs, summaries, and recovery notes.
- Updated [`NOVARAY_CORE_DIRECTIVES.md`](https://github.com/interlaced84/WebGPUTracer/blob/46f1b24389744de1142beca8e2718c90c4b5d8f0/NOVARAY_CORE_DIRECTIVES.md) (root file) with Section 6, referencing canonical locations.
- All agents must reference these canonical files for ongoing and future operations.
- _Reference: Commit `46f1b24389744de1142beca8e2718c90c4b5d8f0`_

### [YYYY-MM-DD]: [Milestone/Event Title]

- [Concise description of the change, event, or recovery]
- [Reference related commits, PRs, or documentation]

---

## Usage

- Add new entries at the top, most recent first.
- Cross-reference related logs or protocol documents when possible.
- This file is checked by the Historian and all onboarding agents.

---

_Last updated: 2025-06-20_
