## [2025-06-19 16:17] Explicit buffer cleanup after async passes
- **ID:** KB-Solution-47
- **Linked Bug:** KB-BugReport-112
- **Proposed by:** Jules-Alpha
- **Confidence:** 0.95 (verified by Architect review & memory profiling)
- **Patch/Code:**  
  ```js
  // After render pass:
  buffer.destroy();
  ```
- **Verification:** verified