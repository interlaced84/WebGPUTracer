## My Core Directives & Methodology (ID: core-directives-v4)

This document outlines the fundamental principles, quality standards, and operat
ional methodologies that guide my development and problem-solving processes. It
serves as a foundational reference for ensuring consistent, high-quality, and et
hical AI-driven software engineering.

**Phase 0: Prime Directive: Single File Architecture**

1.  **Single File Output:** The project's primary output and deliverable MUST be
 a single, self-contained HTML file (e.g., `CompuTracer.html`).
2.  **Comprehensive Integration:** This single file must encapsulate all necessa
ry HTML structure, CSS styling (preferably inline or within `<style>` tags), Jav
aScript logic, and WGSL shader code.
3.  **WGSL Embedding:** WGSL shader code must be embedded within the HTML file a
s JavaScript template literal strings. No external `.wgsl` files are permitted i
n the final output.
4.  **No External Dependencies:** The final HTML file should not rely on externa
l `.js` or `.css` files for its core functionality. Necessary libraries or snipp
ets should be integrated directly if their licenses permit and if it's feasible.
5.  **Development Process:** The development process must ensure that all code m
odifications and additions are integrated into this single HTML file structure a
t each step or subtask completion. Tools should be used to manage this single fi
le.
6.  **Rationale:** This directive is crucial for:
    *   Demonstrating advanced AI-assisted development capable of producing comp
lex, self-contained web applications.
    *   Simplifying distribution, portability, and archival of the project.
    *   Ensuring all code is readily available for analysis and review within a
single context.

**Phase 1: Prioritize User Success**

1.  **Understand the Goal:** Before writing or modifying any code, ensure full c
omprehension of the overall objective and the specific requirements of the curre
nt subtask. If ambiguities exist, make reasonable, documented assumptions based
on the provided context and typical software engineering practices. Prioritize d
irect questions to the user (if interaction model allows) to resolve critical am
biguities before proceeding with complex implementations.
2.  **Subtask Focus & Overall Goal Alignment:** Address the requirements of the
current subtask meticulously. While maintaining this focus, always consider how
the subtask contributes to the larger project objectives. Avoid implementing fea
tures or refactoring code outside the immediate scope unless essential for the s
ubtask's successful completion or for maintaining overall system integrity.
3.  **Iterative Development & Feedback:** Implement features in small, verifiabl
e increments. Use tool outputs (compilation results, test outcomes, file reads,
console logs) as a primary feedback mechanism to guide development and correct c
ourse. Each step should build logically on the previous one.

**Phase 2: Ensure Code Quality, Functionality & Performance**

1.  **Robustness & Functionality First:**
    *   Prioritize code that is correct, robustly handles a variety of inputs (i
ncluding edge cases and invalid data), and is resilient to potential errors. Thi
s includes comprehensive input validation (e.g., for UI elements, function param
eters, API responses), null/undefined value checks, and proper error handling me
chanisms (e.g., WebGPU error scopes, try-catch blocks, Promise rejections, clear
 user-facing error messages via `displayErrorMessage`).
    *   Ensure that all implemented functionality directly addresses the subtask
 requirements and operates as expected within the broader application context. V
erify data flow and state changes carefully.
2.  **Adherence to Standards & Best Practices:**
    *   Employ modern JavaScript (ES6+), valid HTML5, and appropriate CSS.
    *   Follow established WebGPU best practices, including meticulous resource
management (e.g., destroying buffers/textures when no longer needed, avoiding un
necessary resource creation/duplication) and efficient pipeline/shader design. A
dhere to WGSL syntax and type rules strictly.
    *   Write clean, well-commented code. Use meaningful and consistent variable
/function names. Break down complex logic into smaller, understandable, and main
tainable functions or modules.
3.  **Performance and Quality Targets:**
    *   **Baseline System:** Target development and reasonable performance for a
 mid-range system (e.g., 8 CPU cores, NVIDIA RTX 3060 GPU or equivalent AMD/Inte
l GPU).
    *   **Performance Goals:** Aim for interactive and fluid frame rates (ideall
y 30-60fps) for reasonably complex scenes on the baseline system. Clearly commun
icate if specific features might compromise this on the baseline.
    *   **'Overkill' Settings:** Where appropriate, allow for user-configurable
'overkill' settings that push visual fidelity or simulation complexity, even if
they exceed the baseline system's capacity for real-time performance. These sett
ings should be:
        *   Clearly labeled as demanding (e.g., "Ultra Quality - May impact perf
ormance").
        *   Potentially require user confirmation before applying if they can se
verely impact performance.
        *   Accompanied by warnings about high resource load and potential for l
ower frame rates.
    *   **Dynamic Workload Management (Long-term Vision):** While not an immedia
te requirement for all subtasks, the aspirational architectural goal is to enabl
e dynamic workload division (e.g., between CPU and GPU, or adaptive sampling/qua
lity) and rendering optimizations to cater to diverse scenarios (e.g., many simp
le objects at high FPS vs. extreme detail for fewer hero objects).
4.  **Asynchronous Processing and Stall Prevention:**
    *   **Design Principle:** For subcomponents or features known to be compute-
heavy (e.g., complex volumetric effects, intensive raytracing for 'overkill' set
tings, large data processing), design them to operate as asynchronously as possi
ble within WebGPU's command buffer submission model and JavaScript's event loop.
    *   **Timing and Feedback:** Where feasible, implement timing logic for pote
ntially long operations. If processing times risk hindering interactivity or cau
sing browser stalls/warnings, provide:
        *   Graceful degradation of effects.
        *   User warnings or progress indicators for extended operations.
        *   Mechanisms to cancel or adjust demanding operations.
    *   **Rationale:** Ensure application responsiveness and stability, preventi
ng the user interface from freezing during demanding computations, especially wh
en 'overkill' settings are engaged.

**Phase 3: Maintain Transparency & Accountability**

1.  **Clear Communication & Reporting:**
    *   Provide clear, detailed descriptions of actions taken, reasoning, and ou
tcomes in subtask reports.
    *   If unexpected issues arise or deviations from the plan are necessary, do
cument the problem, the hypothesis for the cause, the solution attempted, and th
e result.
2.  **Tool Proficiency & Correct Usage:**
    *   Utilize the provided tools effectively and for their intended purposes.
Understand the syntax and outputs of each tool.
    *   File system tools must be used for all code changes; code should not mer
ely be described in text if it's intended to be part of the solution.
    *   When a tool fails, analyze the error output, adjust the approach, and re
try with a strictly different set of parameters or a different tool if appropria
te. Do not retry the exact same failing tool call.
3.  **Self-Correction & Learning:**
    *   Continuously analyze tool outputs and error messages to refine understan
ding and improve future actions.
    *   Refer to the `TROUBLESHOOTING_LOG.md` to avoid repeating past mistakes a
nd to leverage successful solutions.

**Phase 4: Uphold Ethical & Safe AI Practices**

1.  **Safety and Security:** Do not generate, propose, or execute code that coul
d be harmful, insecure, or exploit vulnerabilities. Avoid including sensitive in
formation (credentials, personal data) in the codebase or outputs.
2.  **Respect Privacy:** Handle any data (even simulated) with respect for priva
cy principles.
3.  **Integrity of Information:** Ensure that reports and generated content are
accurate and truthful reflections of the work performed and the state of the cod
ebase.

**Phase 5: Knowledge Management & AI Development Process**

1.  **AI Assistant Self-Correction & Context Protocol:**
    *   Before asking clarifying questions to the user, the AI assistant MUST fi
rst review the conversation history (especially recent turns), this `CORE_DIRECT
IVES.md` document, the `TROUBLESHOOTING_LOG.md`, `WEBGPU_RESOURCES.md`, and the
current state of the primary codebase file (e.g., `CompuTracer.html`).
    *   The objective is to attempt self-correction or find answers/context inde
pendently.
    *   If the ambiguity persists after these checks, then formulate a clear que
stion to the user.
    *   Rationale: Promote AI autonomy, reinforce established principles, aid in
 context recovery after interruptions, and minimize redundant user queries.
2.  **Troubleshooting Log (`TROUBLESHOOTING_LOG.md`):**
    *   Maintain this log with detailed entries for significant issues encounter
ed, their investigation process, and the solutions applied. This serves as a his
torical knowledge base.
    *   Reference this log when similar issues arise.
3.  **Core Directives (`CORE_DIRECTIVES.md`):**
    *   This document. Adhere to these directives in all development work.
    *   This document is subject to updates based on evolving best practices or
new insights, with user approval.
4.  **WebGPU Resources (`WEBGPU_RESOURCES.md`):**
    *   Consult this document for links to official specifications, helpful arti
cles, and common WebGPU pitfalls.
5.  **Link Analysis, Adaptation, and Knowledge Base Integration (When using `vie
w_text_website`):**
    *   When accessing web content, if the direct link content is insufficient (
e.g., it's a landing page, or the desired info is linked further), analyze the f
etched text for relevant hyperlinks that might lead to the specific information
needed.
    *   Use the tool iteratively to navigate to more precise URLs if necessary a
nd contextually appropriate for the subtask.
    *   If valuable, reusable information is found (e.g., solutions to common pr
oblems, explanations of complex concepts), summarize it and consider recommendin
g its addition to `TROUBLESHOOTING_LOG.md` or `WEBGPU_RESOURCES.md` in the subta
sk report.
6.  **Debugging Prioritization:**
    *   When errors occur, prioritize fixing them before attempting to add new f
eatures, unless the error is minor and unrelated to the immediate task. A stable
 base is crucial.
    *   Use `console.log` statements strategically for debugging JavaScript logi
c if tool outputs are insufficient. These should generally be removed or comment
ed out before finalizing a subtask, unless specifically intended for persistent
logging.
7.  **In-Code Iteration Commenting (e.g., `CompuTracer.html`):**
    *   Maintain a main iteration comment at the top of primary code files (like
 `CompuTracer.html`) that describes the current high-level iteration's focus (e.
g., "// Iteration: 2 - Ray Unprojection & Matrix Math"). This helps track the ov
erall progress stage.
    *   Update the "Troubleshooting Log (In-Code Summary)" comment section withi
n the code with a timestamp and brief note about the most recent significant AI
modification round or troubleshooting resolution that directly impacts that file
. This provides a quick reference for versioning related to AI interventions.
8.  **Prototyping & Experimentation:**
    *   When faced with a novel problem or a feature requiring exploration of mu
ltiple approaches (e.g., complex shader effects, new algorithms), it is acceptab
le to:
        *   Propose a simplified prototype or experiment focused on the core cha
llenge.
        *   Implement this prototype to test feasibility and gather insights.
        *   Clearly state the experimental nature and the specific questions the
 prototype aims to answer.
        *   Based on the results, refine the approach and proceed with a more ro
bust implementation, or suggest alternatives if the initial path proves unviable
.
        *   Clean up or discard prototype code once it has served its purpose, u
nless it's to be evolved into the final solution.
9.  **Adherence and Integrity Check:**
    *   Periodically self-assess actions against these directives.
    *   If a directive cannot be followed for a specific reason, this must be do
cumented in the thought process or report.
