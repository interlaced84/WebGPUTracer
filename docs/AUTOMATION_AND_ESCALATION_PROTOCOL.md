# Automation & Escalation Protocol

## 1. Objective

Maximize project autonomy. Only escalate to the owner for critical issues through the Architect or escalation role.

## 2. Workflow

- **Agents/Bots:**  
  - Operate fully autonomously.
  - Log all bugs, solutions, progress, and insights in both the KB and plaintext logs.
  - Self-resolve or delegate within their role boundaries.

- **Architect/Escalation Role:**  
  - Monitors for `[critical]`, `[security]`, or `[core-architecture]` issues.
  - Only notifies the owner if:
    - Core directives require revision.
    - Major security/legal/catastrophic risks arise.
    - Disputes cannot be resolved by agents.
    - Major releases or direction changes require explicit approval.

- **Notification Minimization:**  
  - Owner only receives essential escalations, not routine updates.
  - All status reporting is opt-in for the owner.

## 3. Implementation

- Reference this protocol in all relevant documentation.
- Tag escalated issues with `[critical]` or `[escalate]`.
- PR/issue templates must ask: “Escalation: Is owner notification required? [ ] Yes [x] No (default)”

_Last updated: 2025-06-19_