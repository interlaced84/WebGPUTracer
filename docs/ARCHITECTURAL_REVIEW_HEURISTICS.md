# Architectural Review Heuristics (NovaRay, Nightly)

## 1. Plaintext Mirroring Responsibility
- Only Architect, sync-bot, or designated logger agents with approved permissions mirror KB API updates to plaintext logs.
- General contributing AIs do not require file system write access.
- “Immediate” means within the next sync cycle (typically 1–5 minutes).

## 2. confidence_weight Policy
- Required for all GeneralMessages.
- Set to 1.0 for purely factual or unambiguous interrogative messages.
- Calibrate below 1.0 when uncertainty or subjectivity is present.

## 3. Architect & GitOps
- Architect AI prepares merge recommendations, diffs, and PRs for Nightly.
- Actual Git operations (fetch/merge/commit/push) are executed by a human or privileged GitOps bot, unless Architect is explicitly granted such permissions.

## 4. Digest Bot Use
- Digest Bot summarizes plaintext logs for both simpler LLMs and Architect AI.
- Digests are written to a dedicated file and optionally indexed in KB API.

## 5. Sync Error Handling
- Architect AI monitors and processes KB_SYNC_REPORTS.md.
- Attempts automated corrections; only escalates unresolved or ambiguous issues to User/Owner.

## 6. Initial Log Seeding
- Sync-bot or Architect performs initial bulk mirroring of KB API entries to plaintext logs.
- All actions are logged for traceability.

_Last updated: 2025-06-19_