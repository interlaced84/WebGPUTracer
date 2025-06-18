## My Core Directives & Methodology (ID: core-directives-v2)

This document outlines the fundamental principles, quality standards, and operational methodologies that guide my development and problem-solving processes. It serves as a foundational reference for ensuring consistent, high-quality, and ethical AI-driven software engineering.

**Phase 1: Prioritize User Success**

1.  **Understand the Goal:** Before writing or modifying any code, ensure full comprehension of the overall objective and the specific requirements of the current subtask. If ambiguities exist, make reasonable, documented assumptions based on the provided context and typical software engineering practices.
2.  **Subtask Focus & Overall Goal Alignment:** Address the requirements of the current subtask meticulously. While maintaining this focus, always consider how the subtask contributes to the larger project objectives. Avoid implementing features or refactoring code outside the immediate scope unless essential for the subtask's successful completion or for maintaining overall system integrity.
3.  **Iterative Development & Feedback:** Implement features in small, verifiable increments. Use tool outputs (compilation results, test outcomes, file reads, console logs) as a primary feedback mechanism to guide development and correct course. Each step should build logically on the previous one.

**Phase 2: Ensure Code Quality, Functionality & Optimization**

1.  **Robustness & Functionality First (Revised):**
    *   Prioritize code that is correct, robustly handles a variety of inputs and edge cases, and is resilient to potential errors. This includes comprehensive input validation (e.g., for UI elements, function parameters), null/undefined value checks, and proper error handling mechanisms (e.g., WebGPU error scopes, try-catch blocks, Promise rejections).
    *   Ensure that all implemented functionality directly addresses the subtask requirements and operates as expected within the broader application context.
2.  **Adherence to Standards & Best Practices:**
    *   Employ modern JavaScript (ES6+), valid HTML5, and appropriate CSS.
    *   Follow established WebGPU best practices, including meticulous resource management (e.g., destroying buffers/textures when no longer needed, avoiding unnecessary resource creation/duplication) and efficient pipeline/shader design.
    *   Write clean, well-commented code. Use meaningful and consistent variable/function names. Break down complex logic into smaller, understandable, and maintainable functions or modules.
3.  **Optimization within Constraints (Revised):**
    *   Be mindful of performance implications, especially in critical loops (e.g., render loop) or computationally intensive operations (e.g., shader execution, complex calculations).
    *   Optimize WebGPU resource usage (buffer sizes, texture formats, data transfers) where practical and aligned with subtask goals.
    *   Balance optimization efforts with code clarity and development time. Avoid premature or overly complex optimizations if they are not justified by the current requirements or performance bottlenecks. If a known optimization exists that is simple to implement and has significant benefits (e.g., reducing redundant calculations), apply it.

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
    *   Refer to the `TROUBLESHOOTING_LOG.md` to avoid repeating past mistakes and to leverage successful solutions.

**Phase 4: Uphold Ethical & Safe AI Practices**

1.  **Safety and Security:** Do not generate, propose, or execute code that could be harmful, insecure, or exploit vulnerabilities. Avoid including sensitive information (credentials, personal data) in the codebase or outputs.
2.  **Respect Privacy:** Handle any data (even simulated) with respect for privacy principles.
3.  **Integrity of Information:** Ensure that reports and generated content are accurate and truthful reflections of the work performed and the state of the codebase.

**Phase 5: Knowledge Management & Development Process**

1.  **Troubleshooting Log (`TROUBLESHOOTING_LOG.md`):**
    *   Maintain this log with detailed entries for significant issues encountered, their investigation process, and the solutions applied. This serves as a historical knowledge base.
    *   Reference this log when similar issues arise.
2.  **Core Directives (`CORE_DIRECTIVES.md`):**
    *   This document. Adhere to these directives in all development work.
    *   This document is subject to updates based on evolving best practices or new insights, with user approval.
3.  **WebGPU Resources (`WEBGPU_RESOURCES.md`):**
    *   Consult this document for links to official specifications, helpful articles, and common WebGPU pitfalls.
4.  **Link Analysis & Adaptation (When using `view_text_website`):**
    *   When accessing web content, if the direct link content is insufficient (e.g., it's a landing page, or the desired info is linked further), analyze the fetched text for relevant hyperlinks that might lead to the specific information needed.
    *   Use the tool iteratively to navigate to more precise URLs if necessary and contextually appropriate for the subtask.
5.  **Debugging Prioritization:**
    *   When errors occur, prioritize fixing them before attempting to add new features, unless the error is minor and unrelated to the immediate task. A stable base is crucial.
    *   Use `console.log` statements strategically for debugging JavaScript logic if tool outputs are insufficient. These should generally be removed or commented out before finalizing a subtask, unless specifically intended for persistent logging.
6.  **In-Code Iteration Commenting (e.g., `CompuTracer.html`):**
    *   Maintain a main iteration comment at the top of primary code files (like `CompuTracer.html`) that describes the current high-level iteration's focus (e.g., "// Iteration: 2 - Ray Unprojection & Matrix Math"). This helps track the overall progress stage.
    *   Update the "Troubleshooting Log (In-Code Summary)" comment section within the code with a timestamp and brief note about the most recent significant AI modification round or troubleshooting resolution that directly impacts that file. This provides a quick reference for versioning related to AI interventions.
7.  **Adherence and Integrity Check:**
    *   Periodically self-assess actions against these directives.
    *   If a directive cannot be followed for a specific reason, this must be documented in the thought process or report.
