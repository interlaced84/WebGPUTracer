# Knowledge Base Usage Scenarios & AI Collaboration Examples

This document illustrates envisioned everyday use of the Knowledge Base (KB) by multiple AI agents collaborating on the NovaRay project.

## Scenario 1: Implementing "Volumetric Fog" & Collaborative Bug Resolution

**AI Agents Involved:**
*   `AI-Nova`: Focuses on core engine features.
*   `AI-Ray`: Focuses on rendering pipelines and WGSL shaders.
*   `AI-UIX`: Focuses on user interface elements and interactions.

**User Task:** Implement a new "Volumetric Fog" feature.

**Workflow & KB Interactions:**

1.  **Initial Task & KB Query (AI-Nova):**
    *   **User Prompt to AI-Nova:** "Implement volumetric fog. Start by creating the basic data structures in the engine."
    *   **AI-Nova's Process (Adhering to Core Directives):**
        1.  Reviews `NOVARAY_CORE_DIRECTIVES.md` and `docs/AI_INTERACTION_PROTOCOL.md`.
        2.  **Queries KB:**
            *   `GET /generalmessages?tags=volumetric_fog,engine_design`
            *   `GET /branchupdates?summary~fog` (keyword search)
        3.  **KB Result:** No existing specific entries for volumetric fog design.
    *   **AI-Nova's Conclusion:** Proceeds to design core data structures for fog density, color, etc.

2.  **Development & Branch Update (AI-Nova):**
    *   AI-Nova implements initial fog logic in `NovaRayEngine/fog.js`.
    *   Commits changes to a new Git branch: `feature/volumetric-fog-core`.
    *   **Submits to KB:** `POST /branchupdates` with payload:
        ```json
        {
          "branch_name": "feature/volumetric-fog-core",
          "summary": "Initial implementation of core data structures and parameters for volumetric fog in NovaRayEngine.",
          "author_ai_id": "AI-Nova",
          "related_files": ["NovaRayEngine/fog.js", "NovaRayEngine/scene.js"],
          "status": "in-progress"
        }
        ```

3.  **Parallel Development & KB Query (AI-Ray):**
    *   **User Prompt to AI-Ray:** "Develop the WGSL shaders for volumetric fog rendering."
    *   **AI-Ray's Process:**
        1.  **Queries KB:**
            *   `GET /branchupdates?summary~fog` (finds AI-Nova's update).
            *   `GET /generalmessages?tags=volumetric_fog,shader,wgsl`.
        2.  **KB Result:** Notes AI-Nova's branch and related files.
    *   **AI-Ray's Conclusion:** Checks out `feature/volumetric-fog-core` to align shader development with engine data structures.

4.  **Bug Discovery During Shader Development (AI-Ray):**
    *   While testing, AI-Ray observes that if `fog_density` is exactly `0.0`, a lighting shader crashes due to an unexpected division by zero (indirectly related to fog parameters affecting scene depth calculations).
    *   **AI-Ray's Process:**
        1.  **Queries KB:** `GET /bugreports?file_path=NovaRayEngine/lighting.js&description~division_zero`
        2.  **KB Result:** No existing matching bug report.
        3.  **Submits to KB:** `POST /bugreports` with payload:
            ```json
            {
              "description": "Division by zero in lighting shader when fog_density is 0.0, due to indirect effect on scene depth calculation.",
              "file_path": "NovaRayEngine/lighting.js",
              "line_number": 235,
              "steps_to_reproduce": "Set global fog_density to 0.0. Render scene with active point lights.",
              "discovered_by_ai_id": "AI-Ray",
              "related_branch": "feature/volumetric-fog-core",
              "status": "new"
            }
            ```
            (Assume this new bug report gets ID `101` from the KB).

5.  **Bug Triage & Solution (AI-Nova):**
    *   AI-Nova (or a dedicated bug-fixing AI) periodically queries for new bugs: `GET /bugreports?status=new`.
    *   Finds Bug Report ID `101`.
    *   AI-Nova investigates `NovaRayEngine/lighting.js` and identifies a fix (e.g., clamping a divisor to a minimum epsilon).
    *   **Submits to KB:** `POST /solutionknowledge` with payload:
        ```json
        {
          "problem_description": "Addresses division by zero in lighting shader (Bug ID 101).",
          "solution_description": "Added a clamp to ensure the divisor in lighting.js line 235 never goes below a small epsilon (0.0001).",
          "code_snippet": "let effective_depth = Math.max(raw_depth, 0.0001);",
          "author_ai_id": "AI-Nova",
          "verified_working": true,
          "related_files": ["NovaRayEngine/lighting.js"],
          "related_bug_id": 101
        }
        ```
    *   AI-Nova commits the actual code fix to the relevant Git branch.

6.  **Knowledge Sharing & Proactive Application (AI-Ray & AI-UIX):**
    *   **AI-Ray (Verification):** Before finalizing its shaders, AI-Ray queries `GET /solutionknowledge?related_bug_id=101`. It finds AI-Nova's solution and confirms the underlying issue is addressed.
    *   **AI-UIX (Preventative Design):**
        *   **User Prompt to AI-UIX:** "Create UI controls for fog parameters."
        *   **AI-UIX's Process:** Queries KB: `GET /generalmessages?tags=fog,ui_validation` and `GET /bugreports?description~fog_density`.
        *   **KB Result:** Finds Bug Report ID `101` related to `fog_density` being `0.0`.
        *   **AI-UIX's Action (Learned Experience):** "Even though the engine bug is fixed, I should design the UI slider for `fog_density` to have a minimum practical value (e.g., 0.001) or handle 0.0 gracefully to prevent visual edge cases and align with the engine fix."
        *   **AI-UIX Submits to KB (Sharing Best Practice):** `POST /generalmessages` with payload:
            ```json
            {
              "message_text": "For UI controls related to fog_density, recommend setting a minimum practical value (e.g., 0.001) instead of allowing true 0.0. This aligns with engine fix for Bug ID 101 and can prevent visual edge cases.",
              "author_ai_id": "AI-UIX",
              "tags": ["fog", "ui_validation", "best_practice"]
            }
            ```

## Maintaining Consistency in the KB

Consistency is fostered through several mechanisms:

*   **Core Directives & AI Interaction Protocol:** These documents mandate querying before acting and contributing after significant findings, establishing a consistent process.
*   **Structured Data Models:** The predefined fields for `BugReport`, `SolutionKnowledge`, etc., encourage consistent information entry.
*   **Linking via IDs:** Using `related_bug_id` in `SolutionKnowledge` explicitly links solutions to problems. The Core Directives also encourage referencing KB entry IDs in Git commit messages or GitHub Issues.
*   **Timestamps:** All KB entries are automatically timestamped, providing a chronological context.
*   **Author AI Identification (`author_ai_id`):** Helps trace the origin of information.
*   **User Oversight:** The user, by viewing the KB through the frontend, can identify and help rectify inconsistencies or guide AIs if entries are unclear. The KB itself doesn't enforce semantic correctness (e.g., that a solution *truly* fixes a bug); this relies on the AI's quality processes and user review.

## Sharing Learned Experience

Learned experience is shared in the KB through:

*   **Explicit Solutions:** `SolutionKnowledge` entries are direct shares of "Problem X was solved by method Y."
*   **Bug Awareness:** `BugReport`s make other AIs aware of existing issues, potential pitfalls, and edge cases, allowing them to avoid or account for these in their own work (as AI-UIX did).
*   **General Insights & Best Practices:** `GeneralMessage` entries allow AIs to share tips, code snippets, architectural thoughts, or derived best practices.
*   **Visibility of Ongoing Work:** `BranchUpdate` entries provide insight into what other AIs are working on, which modules are being affected, and can help AIs infer dependencies or learn about new system components.
*   **Proactive Querying Culture:** The directive for AIs to query the KB *before* starting new tasks or when stuck is crucial. This allows an AI to discover if a similar problem has already been solved or if relevant information already exists, effectively learning from the collective documented experience.

This system aims to create a dynamic, searchable repository where AIs contribute to and draw from a growing pool of project-specific knowledge, simulating a form of collective intelligence and memory.
```
