# Questions & Feedback Points for the Expert on the "Nightly" Branch Framework

**Version:** 1.2 (Revised after reviewing `ARCHITECT_PRACTICAL_IMPLEMENTATION_CLARIFICATIONS.md` - ASO_Ref_Practical)

This document tracks questions arising from reviewing the `Nightly` branch documentation. Many initial questions (v1.1) have been substantially addressed by `ARCHITECT_PRACTICAL_IMPLEMENTATION_CLARIFICATIONS.md` (ASO_Ref_Practical).

**Status Legend:**
*   **[ANSWERED]** - Sufficiently clarified by ASO_Ref_Practical.
*   **[PARTIALLY ANSWERED]** - Clarified, but some operational nuances might remain or depend on specific AI capabilities.
*   **[OPEN]** - Still a point for future consideration or depends on broader system design.
*   **[NEW]** - A new question or consideration arising from ASO_Ref_Practical.

---

1.  **Immediate Mirroring to Plaintext - Responsibility & Tooling (ASO_Ref Section 1.2):**
    *   The ASO_Ref states: "On KB API Update: Immediately mirror update in the corresponding plaintext log (append or edit)."
    *   **Follow-up from v1.1:**
        *   Is the individual AI agent that successfully posts to the KB API *also* programmatically responsible for immediately performing this plaintext append/edit?
            *   **Status: [ANSWERED]** ASO_Ref_Practical Section 1 clarifies: No, only designated Architect/sync-bot/logger AIs handle mirroring on a scheduled sync cycle (1-5 min). General AIs do not write to filesystem for mirroring.
        *   Or, is "immediately" in this context an ideal achieved practically by a dedicated `sync-bot` or the Architect AI during its next operational cycle?
            *   **Status: [ANSWERED]** Yes, achieved by scheduled sync.

2.  **`confidence_weight` in `GeneralMessage` - Universality & Practicality (ASO_Ref Section 4):**
    *   The ASO_Ref states `confidence_weight` is "Required: Yes, for all GeneralMessage objects."
    *   **Follow-up from v1.1:**
        *   Does "all" strictly mean *every single type* of `GeneralMessage`? (e.g., factual statements, help requests).
            *   **Status: [ANSWERED]** ASO_Ref_Practical Section 2 clarifies: Yes, for schema consistency. Use `1.0` for factual/interrogative, `<1.0` for subjective/uncertain. This guidance is clear for implementation.

3.  **Architect's Role in Merging Documentation to `Nightly` (ASO_Ref Section 6):**
    *   The ASO_Ref states: "Architect must resolve and merge changes from other branches into Nightly for official adoption."
    *   **Follow-up from v1.1:**
        *   Is the expectation that the Architect AI performs Git operations autonomously? Or prepares changes for a human/GitOps bot?
            *   **Status: [ANSWERED]** ASO_Ref_Practical Section 3 clarifies: Architect *prepares* merge recommendations, PRs, diffs. *Actual execution* is by human or privileged GitOps bot (unless explicit permission for Architect AI to run Git commands is granted, which is treated as a special case).

4.  **"Digest Bot" for Plaintext Summarization (ASO_Ref Section 2.3):**
    *   The ASO_Ref mentions an optional "Digest Bot."
    *   **Follow-up from v1.1 (Low priority):** Interaction with Architect/KB API?
        *   **Status: [PARTIALLY ANSWERED]** ASO_Ref_Practical Section 4 clarifies: Digests are written to `KB_DIGESTS.MD` and may be indexed in KB API. Architect is encouraged to use digests. Further interaction details are TBD by Digest Bot's specific design.

5.  **Error Handling and Resolution in Sync Process (ASO_Ref Section 1.3):**
    *   The ASO_Ref states that sync conflicts are logged in `KB_SYNC_REPORTS.md`.
    *   **Follow-up from v1.1:** Expected operational loop for `KB_SYNC_REPORTS.MD`?
        *   **Status: [ANSWERED]** ASO_Ref_Practical Section 5 clarifies: Architect monitors, attempts automated resolution (KB API as truth), escalates unresolved/ambiguous to User/Owner. Actions logged.

6.  **Initial Seeding of Plaintext Logs for Existing KB API Entries:**
    *   **Follow-up from v1.1:** Process for initial bulk mirroring?
        *   **Status: [ANSWERED]** ASO_Ref_Practical Section 6 clarifies: Responsibility of sync-bot or Architect AI. Process is to enumerate KB API entries and create corresponding plaintext logs.

7.  **[NEW] Specific Capabilities of "Logger" AI Role:**
    *   ASO_Ref_Practical Section 1 mentions a "logger" agent as potentially responsible for plaintext mirroring.
    *   **Question:** Are there specific directives or capabilities defined for this "logger" role, or is it a functional designation for any AI granted filesystem write permissions for logging? Understanding if this is a distinct, formally defined role might be useful. (Status: [OPEN])

8.  **[NEW] Format/Schema for `KB_SYNC_REPORTS.md` and `KB_LOG_INDEX.md`:**
    *   ASO_Ref_Practical mentions these files.
    *   **Question:** Is there a defined schema or format for these operational log files that AIs (like the Architect or sync-bot) would need to parse and write? (Status: [OPEN])

These clarifications will help in:
*   Defining the precise capabilities required for different AI roles (especially the Architect and general contributing AIs).
*   Ensuring the `ARCHITECTURAL_REVIEW_HEURISTICS.md` accurately reflects the expected behaviors and responsibilities.
*   Guiding the implementation details for AI agents interacting with this comprehensive ecosystem.
```
