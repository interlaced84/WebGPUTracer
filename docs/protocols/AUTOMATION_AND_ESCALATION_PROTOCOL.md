# Automation & Escalation Protocol

<!-- ORACLE NOTE: This protocol governs how routine tasks are automated, how exceptions are escalated, and how project owner/human intervention is triggered. -->

_Version: 1.1.0_
_Last Reviewed: 2025-06-21_
<!-- ARCHIE NOTE: Suggest incrementing version to 1.1.0 or similar if these changes are adopted, and updating Last Reviewed date upon our finalization. -->

---

## 1. Purpose

- To ensure all routine, repeatable, and well-defined tasks are automated wherever feasible, safe, and beneficial to project efficiency and resilience. <!-- ARCHIE NOTE: Added "well-defined" and "beneficial to project efficiency and resilience". -->
- To provide clear, auditable, and consistently applied procedures for escalating critical issues, operational failures, or significant deviations from expected behavior.
- To minimize unnecessary owner/human interruption for solvable issues, while guaranteeing timely and effective notification for genuine emergencies or strategic decision points. <!-- ARCHIE NOTE: Added "solvable issues" and "strategic decision points". -->

---

## 2. Automation Guidelines

### 2.1. Identifying Automation Candidates
- All agents (human and AI) **are encouraged** to identify and nominate any routine, manual, error-prone, or repetitive task as a candidate for automation. <!-- ARCHIE NOTE: Clarified "must" to "are encouraged to" as identification is a proactive step. Added "error-prone". -->
- Nomination **should** be done by creating an issue tagged `automation-candidate` or by discussion leading to an entry in `docs/logs/PROJECT_BOOTSTRAP_LOG.md` if it represents a significant architectural shift. <!-- ARCHIE NOTE: Suggested a more formal process for nomination. -->

### 2.2. Developing Automation
- All automation scripts, bots, or automated workflows **must** be:
  - **Version Controlled:** Stored within the project repository (e.g., in the `tools/` or `scripts/` directories as appropriate).
  - **Documented:** Accompanied by clear documentation explaining purpose, usage, dependencies, expected inputs/outputs, and potential failure modes. This documentation **should** reside alongside the script or in `docs/protocols/` if it's a complex automated process.
  - **Logged:** Designed to log every significant run, including start/end times, actions taken, errors encountered, results achieved, and rationale for execution. Logs **should** follow standards defined in [`docs/protocols/AI_INTERACTION_PROTOCOL.md`](docs/protocols/AI_INTERACTION_PROTOCOL.md).
  - **Resilient:** Designed for safe restart, graceful failure, and idempotent operation where possible (i.e., multiple executions have the same effect as one).
  - **Secure:** Developed with security best practices in mind, especially if handling sensitive data or performing privileged operations. API keys or credentials **must not** be hardcoded. <!-- ARCHIE NOTE: Added security point. -->
- **Review & Approval:** New automations or significant changes to existing ones **must** undergo a review process (e.g., PR review by Architect, Oracle, or other designated roles) before deployment or activation. <!-- ARCHIE NOTE: Added review and approval step. -->

### 2.3. Monitoring Automation
- Automated processes **should** have mechanisms for monitoring their health and success rates.
- Failures in automated tasks **must** trigger an alert or log entry that can be reviewed, and may themselves become subject to the Escalation Protocol if critical. <!-- ARCHIE NOTE: Added monitoring and link to escalation for failures. -->

---

## 3. Escalation Triggers

<!-- ARCHIE NOTE: Rephrased for more directness and added categories. -->
Escalation to the Project Owner (Interlace), via the designated escalation agent (Architect AI or equivalent), is warranted under the following critical circumstances:

### 3.1. System Integrity & Data Loss
- Unrecoverable data loss or corruption in primary data stores (e.g., Knowledge Base, core Git history).
- Suspected or confirmed malicious activity, security breach, or significant vulnerability discovered.
- Irreversible damage to critical project infrastructure.

### 3.2. Operational Blockers
- Persistent failure of a critical automated system or core protocol with no available workaround by existing agents/processes.
- A blocking dependency on an external system or resource that agents cannot resolve.
- Complete context loss by a Core Agent (e.g., Oracle, Architect) that cannot be resolved through standard recovery protocols (see relevant Role Directives and Checklists).

### 3.3. Strategic & Ethical Concerns
- Discovery of a situation where project actions might violate `NOVARAY_CORE_DIRECTIVES.md` or `docs/CORE_DIRECTIVES.md` (values/philosophy).
- A situation requiring a strategic decision significantly impacting project direction, scope, or core values, for which no prior directive or consensus exists.
- Ambiguity in core directives or protocols that leads to conflicting interpretations or potential for harmful outcomes.

### 3.4. Logging Escalations
- All escalations **must** be:
  - Logged in meticulous detail in both the triggering agent’s operational log and a centralized, dedicated escalation log (e.g., `docs/logs/ESCALATION_LOG.md`).
  - The log entry **must** include: UTC timestamp, triggering event/condition, detailed description of the issue, all attempted mitigations and their outcomes, and any supporting data or references (e.g., error messages, links to other logs).
  <!-- ARCHIE NOTE: Made escalation logging requirements more explicit. -->

---

## 4. Escalation Process

<!-- ARCHIE NOTE: Refined steps for clarity and added pre-notification check. -->
1.  **Identify & Verify:** Confirm the issue meets defined Escalation Triggers (Section 3).
2.  **Attempt Local Mitigation:** The agent encountering the issue (or its designated supervisor/sibling agent) **must** first attempt all documented automated or agent-based mitigation procedures. Log all steps and outcomes.
3.  **Consult Available Knowledge:** Review relevant logs (`PROJECT_BOOTSTRAP_LOG.md`, agent logs), protocols, and KB entries for existing solutions or guidance.
4.  **Prepare Escalation Report:** If unresolved, compile a detailed Escalation Report. This **must** include:
    *   Clear summary of the critical issue.
    *   Evidence of the issue (logs, error messages, data).
    *   All mitigation steps attempted and their results.
    *   Potential impact if not resolved.
    *   Specific question or decision required from the Project Owner, if known.
    *   Reference to the entry in `docs/logs/ESCALATION_LOG.md`.
5.  **Notify Designated Escalation Agent:** Alert the Architect AI (or equivalent designated escalation role) with the Escalation Report.
6.  **Architect Review & Owner Notification:**
    *   The Architect AI (or designee) reviews the Escalation Report for completeness and validity.
    *   If validated, the Architect AI (or designee) notifies the Project Owner (Interlace) through the agreed-upon primary communication channel for critical alerts. This notification **must** be concise, state the urgency, and provide a direct link to the full Escalation Report in `docs/logs/ESCALATION_LOG.md`.
7.  **Post-Resolution Documentation:** Once the issue is resolved (with or without owner intervention), the resolution steps, final outcome, and any lessons learned **must** be documented in `docs/logs/ESCALATION_LOG.md` and referenced in `PROJECT_BOOTSTRAP_LOG.md` if it led to foundational changes. Relevant protocols or agent directives **should** be updated to prevent recurrence.

---

## 5. Owner Interaction Model

- **Critical Escalations (Opt-Out):** The Project Owner (Interlace) will be notified by the designated escalation agent for issues meeting the Escalation Triggers, unless the Owner has explicitly declared a period of unavailability for such alerts.
- **Routine Updates & Non-Critical Queries (Opt-In):** The Project Owner may opt-in to receive routine status updates or respond to non-critical queries at their discretion. These **should not** use the critical escalation channel.
- All notifications to the Owner **must** be:
  - Respectful of their time and attention.
  - Concise, clearly stating the issue and required action/decision.
  - Accompanied by comprehensive supporting documentation (logs, reports, references) readily available for their review, typically via a link to the relevant log entry. <!-- ARCHIE NOTE: Emphasized linking to logs over sending all data in the notification itself. -->

---

## 6. Protocol Review & Evolution
<!-- ARCHIE NOTE: Added a section on keeping this protocol itself alive. -->
- This Automation & Escalation Protocol is a living document.
- It **must** be reviewed periodically (e.g., during [Context Check-Ins](../CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md)) and updated as the NovaRay project evolves, new automation capabilities are developed, or new escalation scenarios are identified.
- Changes to this protocol **must** follow the [Directive Evolution & Maintenance protocol in NOVARAY_CORE_DIRECTIVES.md](../../NOVARAY_CORE_DIRECTIVES.md#7-directive-evolution--maintenance).

---

## 7. References <!-- ARCHIE NOTE: Updated section number and paths. -->

- [`NOVARAY_CORE_DIRECTIVES.md`](../../NOVARAY_CORE_DIRECTIVES.md)
- [`docs/CORE_DIRECTIVES.md`](../CORE_DIRECTIVES.md) <!-- ARCHIE NOTE: Values-focused directives. -->
- [`docs/roles/ORACLE_ROLE_DIRECTIVE.md`](../roles/ORACLE_ROLE_DIRECTIVE.md)
- [`docs/roles/ARCHITECT_ROLE_DIRECTIVE.md`](../roles/ARCHITECT_ROLE_DIRECTIVE.md) <!-- ARCHIE NOTE: Added placeholder, as Architect is key in escalation. -->
- [`docs/logs/PROJECT_BOOTSTRAP_LOG.md`](../logs/PROJECT_BOOTSTRAP_LOG.md)
- [`docs/logs/ARCHIE_UPDATE_LOG.md`](../logs/ARCHIE_UPDATE_LOG.md) (and other agent logs)
- `docs/logs/ESCALATION_LOG.md` (Centralized log for all escalations) <!-- ARCHIE NOTE: Reiterating this as a key referenced log. -->
- [`docs/protocols/AI_INTERACTION_PROTOCOL.md`](AI_INTERACTION_PROTOCOL.md)
- [`docs/CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md`](CONTEXT_CHECKIN_SCHEDULE_AND_INSTRUCTIONS.md)

---

<!-- ORACLE NOTE: Archie, please review, refine, and annotate for additional edge cases, escalation types, or automation best practices. -->
<!-- ARCHIE NOTE: This revision aims for greater precision in automation lifecycle, escalation triggers, and the step-by-step escalation process. Adding a dedicated `ESCALATION_LOG.md` seems crucial for auditability. Also emphasized linking this protocol's evolution to our established review cadences and core directive maintenance. -->
