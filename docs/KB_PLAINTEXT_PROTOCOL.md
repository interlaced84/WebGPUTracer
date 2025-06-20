# Plaintext Knowledge Exchange Protocol

This file defines the **minimum interface** for any project agent, script, or tool (including basic LLMs) to share and access project knowledge—without needing to use the API.

## 1. Overview

- All key project knowledge is mirrored in plaintext `.md` files in the repo root:
  - `KB_BUGREPORTS.md`
  - `KB_SOLUTIONS.md`
  - `KB_MESSAGES.md`
  - `KB_BRANCHUPDATES.md`
- Each entry is timestamped, tagged, and cross-referenced to related entries or files.
- Anyone (or any tool) can read/append entries here to share a bug, solution, or insight.

## 2. Format

Each file uses a simple, human-readable template:

### Bug Report (`KB_BUGREPORTS.md`)
```
## [YYYY-MM-DD HH:MM] Title or Short Description
- **ID:** KB-BugReport-###
- **Reported by:** [agent name or ID]
- **Files/Lines:** path/to/file.js:123
- **Tags:** [comma, separated, tags]
- **Description:**  
  (detailed description)
- **Steps to Reproduce:**  
  (steps)
```

### Solution (`KB_SOLUTIONS.md`)
```
## [YYYY-MM-DD HH:MM] Title or Short Description
- **ID:** KB-Solution-###
- **Linked Bug:** KB-BugReport-###
- **Proposed by:** [agent name or ID]
- **Confidence:** 0.0–1.0 + rationale
- **Patch/Code:**  
  (code block or description)
- **Verification:** pending/verified/rejected
```

### General Message (`KB_MESSAGES.md`)
```
## [YYYY-MM-DD HH:MM] Subject or Topic
- **ID:** KB-Message-###
- **From:** [agent name or ID]
- **Tags:** [comma, separated, tags]
- **Content:**  
  (plain text, Q&A, config tip, etc)
- **Thread:** (optional parent message ID)
```

### Branch Update (`KB_BRANCHUPDATES.md`)
```
## [YYYY-MM-DD HH:MM] Branch Name/Feature
- **ID:** KB-BranchUpdate-###
- **By:** [agent name or ID]
- **Status:** in-progress/complete/abandoned
- **Summary:**  
  (what changed, major files)
- **Related:** (other KB IDs)
```

## 3. Contribution Guidelines

- **Anyone can read or append to these files.**
- **Cross-link** entries using KB IDs for traceability.
- **Keep entries short, clear, and timestamped.**
- For more advanced workflows, use the main KB API.  
- Periodically, maintainers can sync these files with the main KB database.

## 4. Example

_See the first few entries in each file for reference._

---

**This protocol ensures that even the simplest tools—or even a human with only a text editor—can participate in the project’s learning and troubleshooting process.**