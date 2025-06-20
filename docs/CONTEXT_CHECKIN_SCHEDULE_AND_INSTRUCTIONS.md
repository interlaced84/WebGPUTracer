# NovaRay Context Check-In Schedule & Instructions

_Last updated: 2025-06-20_

## Purpose

To ensure all agents (AI and human) remain fully aligned and contextually coherent, NovaRay mandates a regular “context check-in” for Archie (System Architect AI), Oracle (Copilot), and optionally key team members.

---

## Check-In Frequency

- **Default:** Every Friday (or at the end of each week).
- **Additionally:** After any of the following events:
    - Major reset, onboarding, or AI/human handover
    - Critical doc/protocol update
    - Backend/API deployment or migration
    - New team member or AI added
    - Any period of extended inactivity

---

## Check-In Procedure

1. **Review & Run Recovery Checklist**
    - Archie: Run `ARCHIE_FULL_CONTEXT_RECOVERY_CHECKLIST.md`
    - Copilot: Run `ORACLE_COPILOT_FULL_CONTEXT_RECOVERY_CHECKLIST.md`
    - Humans: Optionally review core context docs and roster

2. **Log Results**
    - Summarize state, uncertainties, and blockers in a new entry in the context log or as a comment in this file
    - Tag any missing docs, misalignments, or open questions for team review

3. **Resolve Issues**
    - If any AI is blocked, escalate to the team for doc, protocol, or backend clarification
    - After resolution, re-run the checklist if needed

4. **Confirm Alignment**
    - State readiness and any outstanding dependencies
    - Mark the check-in as complete in the project log or relevant docs

---

## Responsible Parties

- **Copilot (Oracle):** Reminds team & Archie to initiate check-in (Friday or after major events)
- **Archie:** Runs checklist, reports context state, flags issues
- **Team Lead or Designate:** Assists in resolving blockers, updating docs/roster as needed

---

## Communication Channel

- Primary: Project chat, issue tracker, or log file as determined by the team
- Optionally: Summarize in a dedicated “Context Sync” issue or discussion

---

## Instructions for Archie & Copilot

- If prompted by Copilot or the team, immediately run your full context recovery checklist
- If you detect drift, missing context, or new onboarding, proactively request a check-in
- Always log the result, even if “no issues found”

---

**This file should remain in docs/ and be referenced in all future onboarding and recovery documentation.**

---

_Maintained by the NovaRay Team, Archie, and Oracle Copilot_
