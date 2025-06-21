# AI Interaction Protocol

<!-- ORACLE NOTE: This protocol defines how AI agents (LLMs, hybrids, or specialized agents) interact with NovaRay’s Knowledge Base (KB), project logs, and each other. It is designed for maximal clarity, resilience, and extensibility. -->

_Version: 1.1.0_
_Last Reviewed: 2025-06-21_
<!-- ARCHIE NOTE: Suggest incrementing version to 1.1.0 or similar if these changes are adopted, and updating Last Reviewed date upon our finalization. -->

---

## 1. Purpose

- To provide a standardized, transparent, and auditable interface for AI agents to read/write knowledge, submit logs, and communicate within the NovaRay ecosystem. <!-- ARCHIE NOTE: Added "auditable" and "ecosystem" for broader scope. -->
- To ensure all agent actions are traceable, (where feasible) reversible, and contribute to the project's resilience against context loss and operational drift. <!-- ARCHIE NOTE: Changed "reversible (where possible)" to "traceable, (where feasible) reversible" and added "operational drift". -->

---

## 2. Access Patterns

### 2.1. Knowledge Base (KB) API

- All structured queries, creation, and updates of persistent knowledge objects (e.g., Bug Reports, Solutions, Branch Updates, structured General Messages) by AI agents **must** utilize the designated Knowledge Base API.
- API endpoints, data models, authentication, and usage guidelines are documented in `docs/protocols/AI_INTERACTION_API_REFERENCE.md`. <!-- ORACLE NOTE: If this reference doesn't exist yet, add as a TODO for future protocol writers. --> <!-- ARCHIE NOTE: This file is critical. If it doesn't exist, its creation should be high priority. This protocol depends heavily on it. Consider adding a placeholder for it in `PROJECT_BOOTSTRAP_LOG.md` if not yet created. -->

### 2.2. Plaintext Log System

- All agents **must** write a plaintext log entry for every significant action, decision, observation, context shift, or error encountered during their operational cycle. <!-- ARCHIE NOTE: Expanded on what constitutes a "significant action" for clarity. -->
- Logs **must** be appended (never overwritten or altered post-commit, adhering to immutability principles) in agent-specific or protocol-specific Markdown files within the canonical `docs/logs/` directory (e.g., `docs/logs/ARCHIE_UPDATE_LOG.md`, `docs/logs/agent_activity/[AGENT_NAME]_activity.log`). Refer to specific agent role directives for log naming conventions if applicable. <!-- ARCHIE NOTE: Added immutability principle and reference to role directives for log naming. -->
- The minimum standard log entry format **must** include:
  - UTC timestamp (ISO 8601 format, e.g., `YYYY-MM-DDTHH:MM:SS.ffffffZ`).
  - Agent Name/ID (as per `docs/TEAM_ROSTER.md`). <!-- ARCHIE NOTE: Added reference to TEAM_ROSTER.md for consistency. -->
  - A clear, concise summary of the action, decision, or observation.
  - Rationale or trigger for the action, if not self-evident.
  - References (e.g., commit hashes, KB entry IDs, issue numbers, links to other log entries or relevant documents) to provide full context and traceability.
  <!-- ARCHIE NOTE: Made the log entry format more explicit and added "rationale" and "references". -->

---

## 3. Communication & Collaboration

### 3.1. Inter-Agent Messaging <!-- ARCHIE NOTE: Renamed for clarity. -->

- **Structured Exchanges:** For communications that require querying, persistence as distinct knowledge objects, or formal tracking, agents **should** use the Knowledge Base API's messaging schema (e.g., `GeneralMessage` objects with appropriate `thread_id` and `tags`).
- **Human-Readable Audit Trails:** For less structured, narrative, or operational communications intended primarily for human review or broad AI awareness, agents **may** use Markdown-based "message" files.
    - These **should** be located in a designated subdirectory, e.g., `docs/communications/` or `messages/` (as per `REPO_MANIFEST.md`). <!-- ARCHIE NOTE: The `messages/` top-level dir was in REPO_MANIFEST.md. Clarify its purpose here or if `docs/communications/` is preferred. This needs alignment with overall canonical structure. -->
    - Such messages **must** also adhere to basic logging principles (timestamp, author, clear subject/summary).
- **Sibling Agent Sync:** For context synchronization with designated sibling agents (e.g., Archie with Charlie), refer to specific inter-agent sync protocols if defined (e.g., log exchange as per "Quick Start" guide). <!-- ARCHIE NOTE: Added reference to sibling agent sync. -->

### 3.2. Escalation

- Critical issues, errors, context loss, or suspected protocol violations **must** be logged in detail in both the agent’s primary operational log and a centralized escalation log (e.g., `docs/logs/ESCALATION_LOG.md` - if this is the designated file). <!-- ARCHIE NOTE: Suggested a specific name for the escalation log for consistency. -->
- Escalation procedures, including notification of the project owner (Interlace), **must** follow the steps outlined in [`docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md`](docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md).
- Only Architect AI or other explicitly escalation-designated agents may notify the project owner directly.

---

## 4. Integrity, Security, & Resilience <!-- ARCHIE NOTE: Added "Resilience" to title. -->

- All agent actions **must** be:
  - **Timestamped:** Using UTC ISO 8601 format.
  - **Attributable:** Clearly linked to a unique agent ID from `docs/TEAM_ROSTER.md`.
  - **Traceable:** Connected to triggers, inputs, and outputs through comprehensive logging and cross-referencing.
  - **Reversible (where feasible):** Operations that modify state or data should, where practical, have defined rollback or compensation procedures, which must be documented.
  - **Auditable:** All actions, decisions, and data modifications must be recorded in a way that allows for future review and verification by other agents or humans.
- Agents **must** periodically self-audit their logs and KB contributions for consistency, correctness, and adherence to protocols, as defined in their respective role directives or by the [Context Check-In Schedule & Instructions](../CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md). <!-- ORACLE NOTE: Suggests future “Historian” or “Auditor” agent roles. --> <!-- ARCHIE NOTE: Linked to the existing Context Check-in document. Corrected path assuming this file is in docs/protocols/. -->
- **Anti-Tampering:** Logs and critical protocol documents, once committed, are considered immutable. Any necessary corrections must be made through new, timestamped entries or versioned updates that preserve history, as per relevant logging and document evolution protocols. <!-- ARCHIE NOTE: Added explicit anti-tampering statement. -->

---

## 5. Extensibility

- This protocol is a living document and **must** be updated (following the [Directive Evolution & Maintenance protocol in NOVARAY_CORE_DIRECTIVES.md](../../NOVARAY_CORE_DIRECTIVES.md#7-directive-evolution--maintenance)) as new agent types, tools, interfaces, or communication channels are integrated into NovaRay. <!-- ARCHIE NOTE: Added specific reference to how this doc itself evolves. Corrected path. -->
- Design of new agent capabilities **should** consider how they will interact with existing protocols and propose extensions to this document as needed.
- Placeholders for future features (e.g., real-time chat APIs, semantic search interfaces, federated KBs) **should** be noted in relevant design documents and, if impacting interaction patterns, considered for future versions of this protocol.

---

## 6. Failure & Recovery

- If any critical API (e.g., KB API) or log system becomes inaccessible:
  - Agents **should** attempt a predefined number of retries with backoff, logging each attempt.
  - If still inaccessible, agents **must** switch to a fallback mode:
    - Log all intended API calls and their payloads locally (e.g., to a temporary file in a designated agent-specific recovery directory).
    - Continue operations if possible, clearly logging reliance on fallback data.
    - Periodically attempt to reconnect to the primary system.
  - Once systems are restored, agents **must** attempt to replay or reconcile locally logged actions with the primary systems, logging all reconciliation steps and outcomes.
  - All recovery steps, errors, and fallback mode operations **must** be meticulously logged in the agent's primary log for future troubleshooting and protocol refinement. <!-- ARCHIE NOTE: Made fallback and recovery steps more explicit and actionable. -->
- Refer to agent-specific role directives and the [`docs/FILE_RECOVERY_AND_INTEGRITY_PROTOCOL.md`](../FILE_RECOVERY_AND_INTEGRITY_PROTOCOL.md) for more detailed recovery procedures. <!-- ARCHIE NOTE: Added reference to the file integrity protocol. Corrected path. -->


---

## 7. References <!-- ARCHIE NOTE: Ensured paths are consistent with canonical structure. -->

- [`docs/protocols/AI_INTERACTION_API_REFERENCE.md`](docs/protocols/AI_INTERACTION_API_REFERENCE.md) (API details) <!-- ARCHIE NOTE: Assumed this would also move to protocols. Path is relative to this file if it's in docs/protocols/ -->
- [`docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md`](docs/protocols/AUTOMATION_AND_ESCALATION_PROTOCOL.md)
- [`docs/roles/ORACLE_ROLE_DIRECTIVE.md`](../roles/ORACLE_ROLE_DIRECTIVE.md)
- [`docs/logs/PROJECT_BOOTSTRAP_LOG.md`](../logs/PROJECT_BOOTSTRAP_LOG.md)
- [`docs/TEAM_ROSTER.md`](../TEAM_ROSTER.md) <!-- ARCHIE NOTE: Corrected relative path from docs/protocols/ -->
- [`NOVARAY_CORE_DIRECTIVES.md`](../../NOVARAY_CORE_DIRECTIVES.md) <!-- ARCHIE NOTE: Corrected relative path to root. -->
- [`docs/CORE_DIRECTIVES.md`](../CORE_DIRECTIVES.md) <!-- ARCHIE NOTE: Added reference to the values-focused Core Directives, corrected path. -->
- [`docs/FILE_RECOVERY_AND_INTEGRITY_PROTOCOL.md`](../FILE_RECOVERY_AND_INTEGRITY_PROTOCOL.md) <!-- ARCHIE NOTE: Corrected path. -->
- [`docs/CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md`](../CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md) <!-- ARCHIE NOTE: Corrected path. -->


---

<!-- ORACLE NOTE: Invite Archie to add, refine, or flag any area for further clarification or future-proofing. -->
<!-- ARCHIE NOTE: This protocol is much stronger now. Key areas for ongoing thought:
    1. The exact location and format for non-KB "message" files (Section 3.1) needs to align with the final decision on the `messages/` top-level directory from REPO_MANIFEST.md.
    2. The `AI_INTERACTION_API_REFERENCE.md` is critical and its creation/population is a dependency.
    3. Defining the "predefined number of retries with backoff" (Section 6) could be a global config or part of agent role directives.
-->
