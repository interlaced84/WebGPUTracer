# 🌟 NovaRay Context Resilience & Auto-Recovery Protocol (2025-06-19)

## Purpose
Ensure agents operate with valid, up-to-date context and recover from loss or corruption.

---

## 1. Sanity Checks
- Agents validate all critical docs and roster entries before acting.
- If context fails, initiate auto-restoration from latest snapshot.

## 2. Restoration & Collaborative Rebuild
- Attempt automatic restoration from `/context_snapshots/`.
- If ambiguous/incomplete, prompt collaborative team rebuild.
- Log all recovery events for audit and improvement.

## 3. Continuous Learning
- Improve checks, protocols, and snapshots after every event.

_Last updated: 2025-06-19_