# Architect AI – Practical Implementation Clarifications (NovaRay, Nightly)
_Last updated: 2025-06-19_

This document details operational clarifications and implementation guidance for the Architect AI (“Archie”) and supporting automation, based on post-ASO_Ref review feedback.

---

## 1. Plaintext Mirroring Responsibility & Tooling

- **Responsibility:**  
  - Only the Architect AI, sync-bot, or another designated “logger” agent with explicit file system permissions is responsible for mirroring KB API updates into plaintext Markdown logs.
  - General contributing AIs are _not_ expected or permitted to write to the file system for log mirroring.
- **Practical Meaning of "Immediate":**  
  - “Immediate” = within the next scheduled sync cycle (typically 1–5 minutes).
  - Sync-bot/Architect periodically polls for KB API changes and updates plaintext logs accordingly.
- **Rationale:**  
  - This preserves security, auditability, and a clean workflow boundary.

---

## 2. confidence_weight in GeneralMessage

- **Universality:**  
  - All GeneralMessages must include a `confidence_weight` for schema consistency.
- **Practicality:**  
  - For purely factual or direct interrogative messages, set `confidence_weight: 1.0`.
  - For subjective, uncertain, or opinion-based statements, calibrate below 1.0 as appropriate.
- **Guidance:**  
  - Use 1.0 for: “Subtask XYZ complete, all tests passed.”  
  - Use <1.0 for: “I believe this resolves issue 42, please confirm.”

---

## 3. Architect’s Role in Documentation Merging to Nightly

- **GitOps Authority:**  
  - Architect AI prepares merge recommendations, PRs, and diffs for Nightly branch.
  - _Actual execution of Git operations_ (fetch/merge/commit/push) is performed by a human, privileged GitOps bot, or CI/CD agent—unless explicit permission is granted for Architect AI to run Git commands.
- **Merging Workflow:**  
  1. Architect detects need for merge.
  2. Prepares detailed PR/merge request with diff and rationale.
  3. Submits to repo for review/execution.

---

## 4. Digest Bot – Summarization & Use

- **Role:**  
  - Digest Bot generates summaries of plaintext logs for easier review by simpler LLMs and human agents.
- **Interaction:**  
  - Digests are written to a dedicated file (e.g., `KB_DIGESTS.md`) and may be indexed in the KB API.
  - Architect AI is encouraged to utilize digests for rapid context-building and prioritization.
- **Scope:**  
  - Digests supplement, but do not replace, full logs or KB API queries.

---

## 5. Sync Error Handling – KB_SYNC_REPORTS.md

- **Review Loop:**  
  - Architect AI is responsible for monitoring and processing sync reports.
  - Architect attempts automated resolution using “KB API as source of truth.”
  - Unresolved or ambiguous issues are escalated to the User/Owner for manual review.
- **Action Logging:**  
  - All sync actions and resolutions are logged for traceability.

---

## 6. Initial Seeding: KB API to Plaintext Logs

- **Responsibility:**  
  - Initial mirroring (“seeding”) of pre-existing KB API entries into plaintext Markdown logs is performed by sync-bot or Architect AI.
- **Process:**  
  - Enumerate all KB API entries.
  - For each, create the corresponding plaintext log entry in proper format.
  - Log any errors or anomalies in `KB_SYNC_REPORTS.md`.

---

## 7. Summary Table

| Topic                        | Agent Responsible           | Practical Policy                                           |
|------------------------------|----------------------------|-----------------------------------------------------------|
| Plaintext Mirroring          | Architect/sync-bot/logger  | Scheduled sync, not per-agent write                       |
| confidence_weight in Messages| All AIs                    | Universal; 1.0 for factual/interrogative, <1.0 for others |
| Nightly Merging              | Architect (+review agent)  | Prepare PR/diff, human or GitOps bot executes merge       |
| Digest Summarization         | Digest Bot                 | For both simple LLMs and Architect AI                     |
| Sync Error Handling          | Architect                  | Review, auto-resolve, escalate if needed                  |
| Initial Seeding              | Architect/sync-bot         | One-time bulk mirroring                                   |

---

## 8. Parseable Policy Block

```
plaintext_mirroring: { by: [Architect, sync-bot, logger], schedule: "1-5min", per_agent_write: false }
confidence_weight: { required: true, default: 1.0_for_factual, <1.0_for_subjective }
gitops_merging: { architect_prepares: true, human_or_bot_executes: true }
digest_bot: { enabled: true, used_by: [simple_LLM, Architect], file: "KB_DIGESTS.md" }
sync_error_handling: { architect_reviews: true, escalates_if_unresolved: true }
initial_seeding: { by: [sync-bot, Architect], process: "bulk_enumerate_and_log" }
```

---

## 9. Cross-References
- See also: `ARCHITECT_SYNC_AND_OPS_REFERENCE.md`, `ASO_Ref`, `KB_PLAINTEXT_PROTOCOL.md`, `AUTOMATION_AND_ESCALATION_PROTOCOL.md`, `AI_INTERACTION_PROTOCOL.md`

---

_This file is optimized for parsing by DevBot Archie the Architect and all agents responsible for knowledge base integrity and workflow orchestration. All policies herein are operationally binding unless superseded by explicit owner/User directive._