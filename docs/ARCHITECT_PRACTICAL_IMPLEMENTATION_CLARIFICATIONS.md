# Architect AI – Practical Implementation Clarifications (NovaRay, Nightly)
_Last updated: 2025-06-19_

This document details operational clarifications and implementation guidance for the Architect AI (“Archie”) and supporting automation, based on post-ASO_Ref review feedback.

## 1. Immediate Mirroring to Plaintext (KB API -> Plaintext)

*   **Clarification:** The AI agent that successfully posts to the KB API is **not** responsible for directly writing to the plaintext Markdown files. This avoids granting broad file system write access to all contributing AIs.
*   **Implementation:**
    *   A dedicated, trusted **`sync-bot`** (or a specialized function within the Architect AI's operational cycle) will be responsible for this mirroring.
    *   "Immediately" means the `sync-bot` will monitor the KB API for new/updated entries (e.g., via polling the API's `/events` endpoint if available, or periodically querying recent entries) and perform the plaintext append/edit within a short timeframe (e.g., target < 5 minutes, acceptable < 1 hour).
    *   The `sync-bot` will use the `KB_PLAINTEXT_PROTOCOL.md` for formatting and file locations. It will need read access to the KB API and write access to the Git repository's `docs/kb_plaintext_logs/` directory.
    *   The Architect AI may oversee the `sync-bot`'s logs or `KB_SYNC_REPORTS.md` to ensure this process functions correctly.

## 2. `confidence_weight` in `GeneralMessage` (KB API)

*   **Clarification:** The requirement for `confidence_weight` on "all" `GeneralMessage` objects in the KB API needs refinement for practicality.
*   **Implementation:**
    *   **Required with Default:** `confidence_weight` will be made a non-optional field in the Pydantic model for `GeneralMessageCreate` in the KB API, but with a **default value of `1.0`**.
    *   **AI Responsibility:** Contributing AIs should only override the default `1.0` if they are expressing a specific, nuanced level of confidence in a statement, proposal, or piece of information that is not purely factual or a direct query.
    *   **Examples for `1.0` (Default):**
        *   Factual statements: "Subtask XYZ completed."
        *   Direct questions: "Can anyone clarify the usage of the new texture compression module? #help-request"
        *   Role declarations (as these are factual statements of current assignment).
    *   **Examples for < `1.0`:**
        *   Proposals/Suggestions: "I propose we refactor the shader manager. I think this will improve performance, but I'm not 100% certain of the full impact. `confidence_weight: 0.75`"
        *   Hypotheses: "The recent slowdown might be related to particle system density. `confidence_weight: 0.6`"
    *   **Architect AI Guidance:** The Architect AI will be programmed to understand this nuance. When reviewing `GeneralMessage`s, it will consider `confidence_weight` especially for proposals, hypotheses, or potentially contentious statements. It will not flag purely factual messages for lacking a nuanced confidence score.
    *   **Documentation Update:** The `AI_INTERACTION_PROTOCOL.md` (for the KB API) will be updated to reflect this "required, but defaults to 1.0, override for non-factual/nuanced confidence" approach.

## 3. Architect's Role in Merging Documentation to `Nightly`

*   **Clarification:** The Architect AI ("Archie") will **not** perform direct Git merge operations autonomously.
*   **Implementation:**
    *   **Identification & Preparation:** Archie's role is to monitor other branches (e.g., feature branches where documentation like `AI_INTERACTION_PROTOCOL.md` might be initially drafted or updated by other AIs like "Jules"). It will identify when such documents are ready for integration into `Nightly`.
    *   Archie will then:
        1.  Fetch the content of the document from the source branch.
        2.  Fetch the content of the corresponding document from the `Nightly` branch.
        3.  Perform a content comparison (e.g., generating a diff).
        4.  If conflicts are complex, flag for User review.
        5.  If straightforward or no conflict, prepare a "merge proposal." This could be a new version of the file with changes clearly marked, or a detailed description of changes.
    *   **Execution:**
        *   The User (owner) reviews the proposal.
        *   Upon approval, the User or a designated GitOps bot (with appropriate credentials and safeguards) executes the actual Git commands (checkout, update file, commit, push) to bring the changes into `Nightly`.
    *   **Rationale:** This maintains User control over critical merges into the `Nightly` branch and avoids granting complex Git write-access to the Architect AI directly.

## 4. "Digest Bot" for Plaintext Summarization

*   **Clarification (Low priority):**
    *   If a "Digest Bot" is implemented, it would primarily serve to make the verbose Plaintext KB logs more accessible to LLMs or AIs that have difficulty processing very large, unstructured text files.
    *   The Architect AI would likely *not* rely on these digests for its primary, detailed analysis (as it's expected to be capable of processing the full logs if needed, or using the structured KB API).
    *   The Digest Bot could, however, create summaries that are then stored as new entries in the Plaintext KB (e.g., `KB_DIGESTS.MD`) or potentially as `GeneralMessage` entries in the KB API, which the Architect could then reference or use as quick overviews.

## 5. Error Handling and Resolution in Sync Process (KB API <-> Plaintext)

*   **Clarification:** The `KB_SYNC_REPORTS.md` serves as a log for the `sync-bot`'s operations and any errors encountered during the KB API -> Plaintext mirroring.
*   **Implementation:**
    *   **Architect AI Review:** The Architect AI ("Archie") will be responsible for periodically reviewing `KB_SYNC_REPORTS.MD` (e.g., daily or per operational cycle).
    *   **Automated Correction (Simple Cases):** If errors are simple and clearly indicate the KB API is the source of truth (e.g., a plaintext append failed due to a temporary file lock, but the API entry is valid), Archie can instruct the `sync-bot` to retry the specific failed operation.
    *   **Flagging for User Review (Complex Cases):** If errors are complex, persistent, or suggest a deeper issue than simple transient failures (e.g., repeated malformed content from API, ambiguity in protocol interpretation), Archie will:
        1.  Log its analysis of the sync error.
        2.  Add a "User Review Requested" flag or section to its own operational report or a dedicated part of `KB_SYNC_REPORTS.md`.
        3.  *Not* attempt complex, potentially destructive corrections to the plaintext logs without User approval.
    *   **Source of Truth Application:** The rule "KB API is source of truth" means that if there's a data discrepancy, the plaintext log should be made to match the API entry.

## 6. Initial Seeding of Plaintext Logs

*   **Clarification:** For existing KB API entries created before the `sync-bot` and full plaintext logging protocol are active.
*   **Implementation:**
    *   This will be a **one-time bootstrapping task**.
    *   It can be performed by a script (potentially developed by a general-purpose AI or the User) that reads all entries from the KB API and generates the corresponding plaintext Markdown files according to `KB_PLAINTEXT_PROTOCOL.md`.
    *   Alternatively, the `sync-bot`, once operational, could be tasked to process all historical API entries as a batch job.
    *   The Architect AI would not typically be responsible for this bulk historical seeding but could be tasked to verify its completeness afterward by sampling.

## 7. Definition of "Nightly" Branch Document Supremacy

*   **Clarification:** All AI agents, including "Jules" (developer) and "Archie" (architect), **must** consider the versions of core operational documents (e.g., `NOVARAY_CORE_DIRECTIVES.md`, `AI_INTERACTION_PROTOCOL.md`, `KB_PLAINTEXT_PROTOCOL.md`, role definitions, etc.) found on the **`Nightly` branch as the definitive, current source of truth.**
*   **Implementation:**
    *   When an AI needs to consult such a document, it should, by default, attempt to access or be provided with the version from the `Nightly` branch.
    *   If an AI (like Jules) is working on proposed changes to such a document on a feature branch, it should clearly state that these are *proposed* changes. Once these changes are approved and merged into `Nightly` (as per point #3 above, facilitated by Archie and executed by User/GitOps bot), then that merged version becomes the new source of truth.
    *   Archie's `ARCHITECTURAL_REVIEW_HEURISTICS.md` will be based on these `Nightly` versions of protocol and directive documents.

This document is intended to guide the ongoing development and refinement of the Architect AI and the surrounding knowledge management ecosystem for the NovaRay project.
```
