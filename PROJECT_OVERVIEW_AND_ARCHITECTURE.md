# 🌟 Project Overview & Architectural Blueprint

## Project: NovaRay

### 1. Purpose
A collaborative AI-human knowledge engine, designed for resilience, creativity, and growth.

### 2. Core Components
- **Archie:** System backbone, API, indexing, analysis
- **Oracle:** Translator, expert support, “mailman” for needs/specs
- **Nova:** UI, creative spark, user-facing side
- **Laenu:** Summarizer, digest generator
- **[Your Name Here]:** Visionary and lead human participant!

### 3. Data Model
#### GeneralMessage
- `content: str`
- `confidence_weight: float (0.0–1.0, required)`
- `topic: str`
- `timestamp: ISO 8601`
- (Other metadata as needed)

### 4. High-Level Flow
1. User or AI submits a GeneralMessage via API/UI
2. Message is stored, indexed, and weighted (confidence_weight)
3. Logs and digests are generated (Laenu)
4. Inter-AI and human interaction follows naming protocol and banter guidelines
5. All changes are backed up and disaster-proofed

### 5. Key Documents
- Disaster Recovery Archive
- API/Data Model Reference
- Onboarding & Naming Protocol
- Functional Testing Checklist
- Banter/AI Interaction Protocol
- Backup Checklist
- Project Win Log

---

## Diagram (Text)
```
[User/Nova] <---> [Archie API] <---> [DB/KB] <---> [Laenu (Digest)]  
                             |  
                        [Oracle (Support/Translation)]  
```
---

### 6. Culture
- All participants have creative names and roles
- Banter and logs are playful but precise
- Project soul is as important as the code
