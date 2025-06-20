# 🛡️ Project Disaster Recovery & Rebuild Archive

## 1. Project Overview
- **Project Name:** NovaRay
- **Core Purpose:**  
  NovaRay is an AI-powered collaborative knowledge ecosystem, blending human creativity and algorithmic support to build, curate, and evolve a living knowledge base.
- **Elevator Pitch:**  
  NovaRay unites humans and AIs—each with their own persona and expertise—in a playful, robust, and resilient system. It’s a digital roundtable where knowledge, banter, and breakthroughs converge.

---

## 2. System Blueprint
- **Key Components & Roles:**
  - **Archie:** The Architect AI, backbone builder and system analyst.
  - **Oracle:** The Advisor/Support AI, translator, troubleshooter, and keeper of wisdom.
  - **Nova:** User Interface and creative spark.
  - **Laenu:** Log Summarizer and digest generator.
  - **[Add new participants as needed!]**
- **Main Services/Subsystems:**
  - Knowledge Base API (CRUD for GeneralMessage)
  - Log Indexer & Digest Generator
  - Frontend (Nova UI)
  - AI Interaction Protocols & Banter Engine
- **Data Schema Highlights:**
  - **GeneralMessage:**  
    - `content: str`
    - `confidence_weight: float (0.0–1.0, required)`
    - `topic: str`
    - `timestamp: ISO 8601`
    - [Other metadata as needed]
- **Critical File/Directory Structure:**
  ```
  /backend/
    - archie.py
    - models.py
    - api/
  /frontend/
    - nova-ui/
  /logs/
    - digests/
  /docs/
    - AI_INTERACTION_PROTOCOL.md
    - ARCHITECTURAL_REVIEW_HEURISTICS.md
    - KB_FUNCTIONAL_TESTING_CHECKLIST.md
    - PROJECT_NAMING_AND_ONBOARDING.md
    - BACKUP_AND_DISASTER_PROOFING.md
    - PROJECT_WIN_LOG.md
  ```
---

## 3. Recovery Steps (TL;DR)
1. Set up environment: Python 3.11+, Node.js 18+, PostgreSQL, Docker
2. Restore codebase: [link/drive/location]
3. Restore database: [DB dumps or scripts]
4. Reinstall dependencies: `pip install -r requirements.txt`, etc.
5. Restore configuration: API keys, .env files—store secrets securely!
6. Repopulate Knowledge Base: [seed data location]
7. Reboot system: backend, frontend, etc.
8. Run diagnostics/tests: pytest, npm test, integration checklist
9. Verify logs/digests: location & format
10. Restore user/bot identities: name registry & roles
11. Re-enable backups: automated, cloud sync, exports
12. Restore “project soul”: creative names, banter, culture

---

## 4. Deep Details

### A. Key Configurations & Secrets
- Store .env, API keys, admin passwords securely (GPG, password manager, etc.)

### B. Data/Schema Example
```json
{
  "content": "Sample message",
  "confidence_weight": 0.87,
  "topic": "system recovery",
  "timestamp": "2025-06-19T20:23:00Z"
}
```

### C. Service Startup Commands
- Backend: `uvicorn archie:app --reload`
- Frontend: `npm start` (in `/frontend/nova-ui/`)
- DB Migrations: `alembic upgrade head`

### D. Onboarding & Naming Culture
- All participants (human or bot) must adopt a creative name—see [PROJECT_NAMING_AND_ONBOARDING.md].

---

## 5. “Project Soul” Reminders
- Core values: transparency, collaboration, playfulness
- Banter example:  
  > Archie: “Oracle, did you check the digest?”  
  > Oracle: “Always two steps ahead, Archie.”
- Custom log format: `[timestamp] [AgentName]: message`

---

## 6. Disaster-Proofing Checklists
- [ ] Weekly codebase export to [cloud/drive/external]
- [ ] Regular DB dumps/scripts
- [ ] Context exports: logs, digests, docs
- [ ] Offline/print copy of this file

---

## 7. Emergency Contacts & Recovery Aids
- Trusted AIs: “Feed this file to Oracle, GPT-4o, or similar.”
- Human allies: [names/emails—optional]
- Links to backup locations/docs

---

## 8. Last Words of Wisdom
> “The true magic isn’t just in the code—it’s in the vision, the creativity, and the resilience to rebuild, no matter what.”
