# Architect AI: Synchronization, Escalation, and Operational Protocol (NovaRay, Nightly)

_Last updated: 2025-06-19_

This file provides a definitive, parseable reference for the Architect AI and DevBot to manage the dual knowledge system, escalation, log management, and operational best practices. All fields and sections are structured for easy parsing and automation.

---

## 1. Knowledge System Synchronization

### 1.1 Source of Truth

- **Primary:** KB API (canonical for all structured data)
- **Secondary:** Plaintext Markdown logs (universal accessibility & backup)

### 1.2 Synchronization Flow

- **On KB API Update:**  
  Immediately mirror update in the corresponding plaintext log (append or edit).
- **On Plaintext Log Update:**  
  Agent (if capable) must update KB API. If not, scheduled sync-bot or Architect must reconcile new entries.
- **Scheduled Sync:**  
  - Minimum: daily (configurable by Architect)
  - Agent: `sync-bot` or Architect
  - Steps (pseudocode):
    1. For each entry in KB API, verify corresponding plaintext log entry exists & matches.
    2. For each entry in plaintext log, verify KB API entry exists & matches.
    3. Update whichever is missing/outdated, using KB API as authoritative.
    4. Log any conflicts or manual review needs in `KB_SYNC_REPORTS.md`.

### 1.3 Conflict Handling

- **Discrepancy found:**  
  - Favor KB API as source of truth.
  - Update plaintext log to match, unless deliberate archival/correction is documented.
  - Log conflict in `KB_SYNC_REPORTS.md` for traceability.

---

## 2. Log Management & Rotation

### 2.1 Thresholds

- **Max Entries per Log File:** 10,000 (default, configurable)
- **Max File Size:** 10MB (default, configurable)

### 2.2 Rotation & Archival

- **On threshold breach:**  
  1. Archive current file with date/version (e.g., `KB_MESSAGES_2025Q2.md`)
  2. Start new writable log file
  3. Update `KB_LOG_INDEX.md` with archive pointer
- **Archived logs:** read-only, always accessible

### 2.3 Summarization

- **Digest Bot:** (optional)  
  - Summarizes logs periodically for easier parsing by simple LLMs
  - Digest entries appended to main log and indexed

---

## 3. Escalation & Criticality

### 3.1 Escalation Triggers

- **Direct escalation (automatic):**
  - Security incident
  - Legal/compliance risk
  - Data loss/catastrophic failure

- **Proposed escalation (requires owner confirmation):**
  - Major strategic/directional change
  - Large-scale refactoring or deprecation
  - Dispute not resolvable by agents

### 3.2 Escalation Process

1. Architect logs a “Proposed Escalation” in both KB API and plaintext logs
2. Notifies User/Owner with:
   - Reason
   - Rationale
   - confidence_weight
3. Waits for User/Owner confirmation/review before proceeding

---

## 4. confidence_weight in GeneralMessages

- **Field:** `confidence_weight` (float, 0.0–1.0)
- **Required:** Yes, for all GeneralMessage objects (role declarations, status updates, recommendations, escalation proposals)
- **Action:** Update KB API schema and AI_INTERACTION_PROTOCOL.md accordingly

---

## 5. GitHub Integration for AI Roles

- **Expected:** Architect, GitHub Manager, and other relevant roles require GitHub API access (scoped tokens or service accounts)
- **Capabilities:**  
  - Monitor PRs, issues
  - Comment, assign, label
  - Trigger workflows
- **All actions are logged in both KB API and plaintext logs**

---

## 6. Documentation Source of Truth

- **Nightly branch** is authoritative for all operational documentation and protocols.
- Architect must resolve and merge changes from other branches into Nightly for official adoption.

---

## 7. Parseable Data Summary

```
source_of_truth: KB_API
sync_responsible: Architect, sync-bot
log_rotation: 10000_entries OR 10MB
escalation_direct: ["security", "legal", "catastrophic"]
escalation_proposed: ["direction_change", "major_refactor", "agent_dispute"]
confidence_weight_required: true
github_api_access_required: true
doc_source_of_truth: Nightly_branch
```

---

## 8. Cross-reference & Related Files

- `NOVARAY_CORE_DIRECTIVES.md`
- `KB_PLAINTEXT_PROTOCOL.md`
- `AUTOMATION_AND_ESCALATION_PROTOCOL.md`
- `AI_INTERACTION_PROTOCOL.md`
- `KB_SYNC_REPORTS.md` (for conflict/audit logs)
- `KB_LOG_INDEX.md` (for log archive indexing)

---

_This file is intended for direct consumption by both Architect AI and DevBot. All procedures, fields, and schedules herein are to be considered operationally binding unless superseded by explicit User/Owner directive._