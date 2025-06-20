# NovaRay UI Onboarding & KB API: Summary and Next Steps
_Last updated: 2025-06-20_

## ✨ Archie's Feedback Highlights

**1. API Key Handling**
- Prompt for API key if missing (store in localStorage).
- Add “Test/Validate API Key” button (calls `/health` or `/general_messages?limit=1`).
- Show “Clear/Change API Key” option.

**2. Initial State & Content**
- On successful key validation, fetch and display latest 5–10 GeneralMessages.
- Show counts for all KB item types (Branch Updates, Bug Reports, Solutions, Messages).

**3. Roster/author_ai_id**
- Submissions should use author_ai_id from TEAM_ROSTER.md.
- (Future) UI could fetch TEAM_ROSTER.md to populate a dropdown for author selection.

**4. State Management**
- Vanilla JS: use simple global variables (current).
- React (future): use Context + useReducer or Zustand/Jotai.
- Key state: apiKey, currentUser, knowledgeItems, filters, loading, errors.

**5. API Client Utilities**
- (Current) Basic helpers in script.js.
- (React) Move to apiClient.js module for all backend calls and error handling.

**6. UI Priorities**
- **P0:** API Key management, displaying & submitting all KB types.
- **P1:** Filtering (author, tags, status), error messages.
- **P2:** Single-item views, polling for updates.
- **P3:** Advanced filtering/sorting, UI for roster management.

**7. Bottlenecks/Dependencies**
- Stable backend API.
- CORS must be configured in FastAPI for cross-origin requests.
- Protocol docs (AI_INTERACTION_PROTOCOL.md) must match API.

---

## 🚦 Next Steps for the Team

### **Immediate**
- [ ] Implement API key onboarding UI (+ validation, clear/change).
- [ ] Fetch & display recent GeneralMessages after key validation.
- [ ] Display counts for all KB item types.
- [ ] Ensure author_ai_id in submissions matches TEAM_ROSTER.md.

### **Short-Term**
- [ ] Add forms for submitting each KB object type (with all required fields).
- [ ] Implement basic filtering and error handling UI.
- [ ] Review/test CORS settings in FastAPI for frontend dev.

### **Future/Enhancements**
- [ ] Dropdown for author_ai_id (fetch TEAM_ROSTER.md or local copy).
- [ ] More advanced filtering/sorting, single-item views, and polling.
- [ ] Migrate to React with dedicated state management and apiClient.js.

---

## 📎 Notes
- All UI logic should be aligned with AI_INTERACTION_PROTOCOL.md and TEAM_ROSTER.md.
- Keep an eye out for drift between docs and backend—sync frequently!
- ARCHITECTURAL_REVIEW_HEURISTICS.md will be updated as UI advances.

---

This summary can be shared with Archie, Jules, or anyone else jumping in, and serves as your execution roadmap.  
Let me know if you want this split into issues, or need code scaffolds or CORS config help!