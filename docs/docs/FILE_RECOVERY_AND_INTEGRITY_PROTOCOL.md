# File Recovery and Integrity Protocol (Design Stage)

_Last updated: 2025-06-20_

## Status: DESIGN STAGE – NOT YET ENFORCED

This protocol describes how critical files will be managed and self-healed in NovaRay, but **should not be enforced until the backend and local docs are fully set up.**

---

## Goal

- Ensure all critical context/protocol/checklist files are present in `docs/`
- Plan for automated integrity checks and remote-recovery fallback
- Actual enforcement and self-healing will begin once backend and docs are populated

---

## Planned Steps

1. **Local-first:** Always use files from the `docs/` directory if present.
2. **Integrity Checks:** Periodically verify presence and (optionally) hash/checksum of critical files.
3. **Remote Fallback:** If a file is missing, fetch from raw GitHub URL and restore.
4. **Self-Healing:** Optionally, auto-repair missing files as part of context check-in.
5. **Audit:** Regular (weekly) integrity sweeps after local setup is complete.

---

## Archie’s Instructions (Design Stage)

- Read, understand, and log if files are missing.
- DO NOT treat missing files as errors during this phase.
- Wait for the “setup complete” signal from the team before enabling automation.

---

**This protocol will be activated after the backend and local file setup is confirmed by the team.**