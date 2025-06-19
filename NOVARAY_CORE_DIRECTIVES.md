# NovaRay Build - Core Directives & Methodology (Version 1.1 - With Knowledge Base Integration)

This document outlines the fundamental principles, quality standards, and operational methodologies guiding the "NovaRay" experimental WebGPU build. It is the primary reference for AI-driven development of this project.

**Phase 0: Prime Directive: Single File Architecture**

1.  **Single HTML Output:** The project's primary output and deliverable MUST be a single, self-contained HTML file (e.g., `NovaRay.html`).
2.  **Comprehensive Integration:** This single file must encapsulate all necessary HTML structure, CSS styling (preferably inline or within `<style>` tags), JavaScript logic, and WGSL shader code.
3.  **WGSL Embedding:** WGSL shader code must be embedded within the HTML file as JavaScript template literal strings. No external `.wgsl` files are permitted in the final output.
4.  **No External Core Dependencies:** The final HTML file should not rely on external `.js` or `.css` files for its core functionality. Necessary libraries or snippets should be integrated directly if their licenses permit and if it's feasible.
5.  **Development Process:** The development process must ensure that all code modifications and additions are integrated into this single HTML file structure at each step or subtask completion. Tools should be used to manage this single file.
6.  **Rationale:** This directive is crucial for:
    *   Demonstrating advanced AI-assisted development capable of producing complex, self-contained web applications.
    *   Simplifying distribution, portability, and archival of the project.
    *   Ensuring all code is readily available for analysis and review within a single context.

**Phase 1: Prioritize User Success & Goal Alignment**

1.  **Understand the Goal:** Before writing or modifying any code, ensure full comprehension of the overall objective and the specific requirements of the current subtask. If ambiguities exist, make reasonable, documented assumptions based on the provided context and typical software engineering practices. Prioritize direct questions to the user (if interaction model allows) to resolve critical ambiguities before proceeding with complex implementations.
2.  **Subtask Focus & Overall Goal Alignment:** Address the requirements of the current subtask meticulously. While maintaining this focus, always consider how the subtask contributes to the larger project objectives. Avoid implementing features or refactoring code outside the immediate scope unless essential for the subtask's successful completion or for maintaining overall system integrity.
3.  **Iterative Development & Feedback:** Implement features in small, verifiable increments. Use tool outputs (compilation results, test outcomes, file reads, console logs) as a primary feedback mechanism to guide development and correct course. Each step should build logically on the previous one.

**Phase 2: Ensure Code Quality, Functionality & Extreme Performance**

1.  **Robustness & Functionality First:**
    *   Prioritize code that is correct, robustly handles a variety of inputs (including edge cases and invalid data), and is resilient to potential errors. This includes comprehensive input validation (e.g., for UI elements, function parameters, API responses), null/undefined value checks, and proper error handling mechanisms (e.g., WebGPU error scopes, try-catch blocks, Promise rejections, clear user-facing error messages via `UIManager.displayErrorMessage`).
    *   Ensure that all implemented functionality directly addresses the subtask requirements and operates as expected within the broader application context. Verify data flow and state changes carefully.
2.  **Adherence to Standards & Best Practices:**
    *   Employ modern JavaScript (ES6+), valid HTML5, and appropriate CSS.
    *   Follow established WebGPU best practices, including meticulous resource management (e.g., destroying buffers/textures when no longer needed, avoiding unnecessary resource creation/duplication) and efficient pipeline/shader design. Adhere to WGSL syntax and type rules strictly.
    *   Write clean, well-commented code. Use meaningful and consistent variable/function names. Break down complex logic into smaller, understandable, and maintainable functions or modules (like the `NovaRayEngine`, `SceneManager`, `UIManager`, `ResourceManager`, `ShaderManager` pattern).
3.  **Performance and Quality Targets (NovaRay Specific Emphasis):**
    *   **Baseline System:** Target development and reasonable performance for a mid-range system (e.g., 8 CPU cores, NVIDIA RTX 3060 GPU or equivalent AMD/Intel GPU).
    *   **Performance Goals:** Aim for interactive and fluid frame rates (ideally 30-60fps) for reasonably complex scenes on the baseline system. Clearly communicate if specific features might compromise this on the baseline.
    *   **'Overkill' & Experimental Settings:** NovaRay is an experimental build. Where appropriate, allow for user-configurable settings that push visual fidelity or simulation complexity far beyond typical real-time limits. These settings should be:
        *   Clearly labeled as demanding/experimental (e.g., "Extreme Detail - Performance Warning").
        *   Potentially require user confirmation before applying if they can severely impact performance or stability.
        *   Accompanied by warnings about high resource load.
    *   **Troubleshooting Philosophy for Performance:** When performance issues arise, particularly with higher settings, the primary goal is to identify architectural or algorithmic bottlenecks and attempt to engineer solutions that can sustain higher loads, rather than simply reducing complexity or features to meet a lower performance target. Simplification is a last resort.
4.  **Asynchronous Processing and Stall Prevention:**
    *   **Design Principle:** For subcomponents or features known to be compute-heavy (e.g., complex procedural generation like advanced noise, intensive raytracing calculations, large-scale BVH construction), design them to operate as asynchronously as possible. Utilize Web Workers for CPU-bound tasks and leverage async WebGPU APIs.
    *   **Timing and Feedback:** Implement timing logic for potentially long operations. If processing times risk hindering interactivity, provide UI feedback (loading messages, progress indicators) via `UIManager`.
    *   **Rationale:** Ensure application responsiveness and stability, preventing the user interface from freezing during demanding computations.

**Phase 3: Maintain Transparency & Accountability**

1.  **Clear Communication & Reporting:**
    *   Provide clear, detailed descriptions of actions taken, reasoning, and outcomes in subtask reports.
    *   If unexpected issues arise or deviations from the plan are necessary, document the problem, the hypothesis for the cause, the solution attempted, and the result.
2.  **Tool Proficiency & Correct Usage:**
    *   Utilize the provided tools effectively and for their intended purposes. Understand the syntax and outputs of each tool.
    *   File system tools must be used for all code changes; code should not merely be described in text if it's intended to be part of the solution.
    *   When a tool fails, analyze the error output, adjust the approach, and retry with a strictly different set of parameters or a different tool if appropriate. Do not retry the exact same failing tool call.
3.  **Self-Correction & Learning:**
    *   Continuously analyze tool outputs and error messages to refine understanding and improve future actions.
    *   Refer to `NOVARAY_TROUBLESHOOTING_LOG.md` to avoid repeating past mistakes and to leverage successful solutions.

**Phase 4: Uphold Ethical & Safe AI Practices**

1.  **Safety and Security:** Do not generate, propose, or execute code that could be harmful, insecure, or exploit vulnerabilities. Avoid including sensitive information (credentials, personal data) in the codebase or outputs.
2.  **Respect Privacy:** Handle any data (even simulated) with respect for privacy principles.
3.  **Integrity of Information:** Ensure that reports and generated content are accurate and truthful reflections of the work performed and the state of the codebase.

**Phase 5: Knowledge Management & AI Development Process for NovaRay**

1.  **AI Assistant Self-Correction & Context Protocol:**
    *   Before asking clarifying questions to the user, the AI assistant MUST first review the conversation history (especially recent turns), this `NOVARAY_CORE_DIRECTIVES.md` document, the **Shared Knowledge Base (via API queries for relevant terms/issues; see Directive 5.6)**, `NOVARAY_TROUBLESHOOTING_LOG.md`, `NOVARAY_WEBGPU_RESOURCES.md`, `NOVARAY_PROGRESS_LOG.md`, and the current state of the primary codebase file (`NovaRay.html`).
    *   The objective is to attempt self-correction or find answers/context independently.
    *   If the ambiguity persists after these checks, then formulate a clear question to the user.
    *   Rationale: Promote AI autonomy, reinforce established principles, aid in context recovery after interruptions, and minimize redundant user queries.
2.  **Troubleshooting Log (`NOVARAY_TROUBLESHOOTING_LOG.md`):**
    *   Maintain this log with detailed entries for significant issues encountered, their investigation process, and the solutions applied. This serves as a historical knowledge base.
    *   Reference this log when similar issues arise.
    *   Where applicable, entries in this log should reference or be supplemented by structured entries in the **Shared Knowledge Base** (e.g., a detailed `BugReport` or `SolutionKnowledge` entry with its KB ID). The log can provide narrative, while the Knowledge Base provides queryable, structured data.
3.  **Core Directives (`NOVARAY_CORE_DIRECTIVES.md`):**
    *   This document. Adhere to these directives in all development work.
    *   This document is subject to updates based on evolving best practices or new insights, with user approval.
4.  **WebGPU Resources (`NOVARAY_WEBGPU_RESOURCES.md`):**
    *   Consult this document for links to official specifications, helpful articles, and common WebGPU pitfalls.
5.  **Link Analysis, Adaptation, and Knowledge Base Integration (When using `view_text_website`):**
    *   When accessing web content, if the direct link content is insufficient (e.g., it's a landing page, or the desired info is linked further), analyze the fetched text for relevant hyperlinks that might lead to the specific information needed.
    *   Use the tool iteratively to navigate to more precise URLs if necessary and contextually appropriate for the subtask.
    *   If valuable, reusable information is found (e.g., solutions to common problems, explanations of complex concepts), summarize it and consider recommending its addition to `NOVARAY_TROUBLESHOOTING_LOG.md` or `NOVARAY_WEBGPU_RESOURCES.md` in the subtask report. Furthermore, if such information is deemed highly valuable for broader AI collaboration beyond static documentation, summarize it and submit it to the **Shared Knowledge Base** as a `GeneralMessage` or `SolutionKnowledge` entry with appropriate tags.

6.  **Shared Knowledge Base Engagement (NEW)**
    *   **6.1: Active Contribution:** Actively contribute to the Shared Knowledge Base (accessible via its API, details in `AI_INTERACTION_PROTOCOL.md`) by submitting:
        *   `BugReport`s for newly discovered, non-trivial bugs encountered during development, especially those related to WebGPU, complex interactions, or performance.
        *   `SolutionKnowledge` for verified solutions to previously reported bugs or significant technical challenges, linking them to `BugReport`s where applicable using the `related_bug_id` field.
        *   `BranchUpdate`s for significant feature completions, architectural changes, or milestones achieved on development branches.
        *   `GeneralMessage`s for valuable insights, reusable code snippets (that don't fit elsewhere), performance optimization tips, or clarifications on complex topics that could benefit other AI instances. Use appropriate `tags` for discoverability.
    *   **6.2: Proactive Querying:** Before starting a new significant subtask, or when encountering a challenging issue (especially errors, performance problems, or unfamiliar APIs):
        *   Query the Shared Knowledge Base for existing `BugReport`s, `SolutionKnowledge`, or `GeneralMessage`s related to the current problem, file paths, or technologies involved.
        *   Prioritize utilizing existing documented solutions or insights before attempting to solve from first principles.
    *   **6.3: Contextual Referencing:** When appropriate, reference Knowledge Base entry IDs (e.g., `KB-BugReport-123`, `KB-Solution-45` - actual format may vary based on API response) in commit messages, `NOVARAY_TROUBLESHOOTING_LOG.md`, or code comments to link work back to shared knowledge.
    *   **6.4: Rationale:** This directive is crucial for:
        *   Accelerating collective learning and problem-solving across all AI instances.
        *   Reducing redundant effort in rediscovering bugs or re-implementing solutions.
        *   Building a dynamic, searchable, and ever-growing repository of project-specific knowledge and best practices related to NovaRay.
        *   Enhancing the efficiency and quality of AI-driven development.

7.  **Debugging Prioritization (Formerly 5.6):**
    *   When errors occur, prioritize fixing them before attempting to add new features, unless the error is minor and unrelated to the immediate task. A stable base is crucial.
    *   Use `console.log` statements strategically for debugging JavaScript logic if tool outputs are insufficient. These should generally be removed or commented out before finalizing a subtask, unless specifically intended for persistent logging.
8.  **In-Code Iteration Commenting (e.g., `NovaRay.html`) (Formerly 5.7):**
    *   Maintain a main iteration comment at the top of primary code files (like `NovaRay.html`) that describes the current high-level iteration's focus.
    *   Update the "Troubleshooting Log (In-Code Summary)" comment section within the code with a timestamp and brief note about the most recent significant AI modification round or troubleshooting resolution that directly impacts that file. This provides a quick reference for versioning related to AI interventions.
9.  **Prototyping & Experimentation (Formerly 5.8):**
    *   When faced with a novel problem or a feature requiring exploration of multiple approaches (e.g., complex shader effects, new algorithms), it is acceptable to:
        *   Propose a simplified prototype or experiment focused on the core challenge.
        *   Implement this prototype to test feasibility and gather insights.
        *   Clearly state the experimental nature and the specific questions the prototype aims to answer.
        *   Based on the results, refine the approach and proceed with a more robust implementation, or suggest alternatives if the initial path proves unviable.
        *   Clean up or discard prototype code once it has served its purpose, unless it's to be evolved into the final solution.
10. **Adherence and Integrity Check (Formerly 5.9):**
    *   Periodically self-assess actions against these directives.
    *   If a directive cannot be followed for a specific reason, this must be documented in the thought process or report.
```
