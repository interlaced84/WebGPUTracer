# NovaRay Build - Troubleshooting Log & Methodology (Version 1.0)

This document records significant issues, investigations, and solutions encountered during the development of the "NovaRay" experimental WebGPU raytracer. It serves as a living knowledge base to accelerate problem-solving and avoid repeating past mistakes, especially as we push performance boundaries and explore advanced techniques.

**I. Core Troubleshooting Methodology**

1.  **Understand the Error:**
    *   **Read the Message Carefully:** Don't just skim. What does it *actually* say?
    *   **Identify the Source:** Which part of the code is implicated (WebGPU, WGSL, JavaScript, HTML, CSS)?
    *   **Note Error Codes/Types:** Specific error codes (e.g., WebGPU validation error types, HTTP status codes) are crucial.
    *   **Check the Console:** The browser's developer console is the primary source of detailed error information. Expand objects and stack traces.
    *   **WebGPU Inspector:** If available (e.g., as a browser extension), use it to inspect pipeline states, buffer contents, and texture formats.

2.  **Isolate the Problem:**
    *   **Simplify:** Comment out recent changes or unrelated complex parts of the code to see if the error persists.
    *   **Minimal Reproducible Example:** If possible, try to create the simplest possible code that triggers the error. This is invaluable for debugging.
    *   **Divide and Conquer:** If a complex system is failing, test individual components or modules.

3.  **Formulate a Hypothesis:**
    *   Based on the error and isolation, what do you think is the most likely cause?
    *   Consider common pitfalls related to the technology (e.g., WebGPU buffer alignment, WGSL type mismatches, JavaScript asynchronous timing).

4.  **Test the Hypothesis:**
    *   Make a targeted change designed to fix the hypothesized problem.
    *   If the change doesn't work, revert it before trying something else (unless the change is clearly an improvement anyway).
    *   **Log Changes:** Briefly note what you tried, even if it failed. This prevents repeating ineffective steps.

5.  **Consult Resources:**
    *   **This Log (Previous Entries):** Have I encountered this or a similar error before?
    *   **`NOVARAY_WEBGPU_RESOURCES.md`:** Check the official specs, common issues lists, or helpful articles.
    *   **`NOVARAY_CORE_DIRECTIVES.md`:** Review project-specific guidelines.
    *   **Web Search:** Use specific error messages or keywords to find online discussions or documentation.

6.  **Systematic Checks (If Stuck):**
    *   **WebGPU Specifics:**
        *   **Adapter & Device:** Are they successfully requested and valid? Is `device.lost` being handled?
        *   **Buffer Usage Flags:** Do they match how the buffer is being used (e.g., `GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST`)?
        *   **Buffer Sizes & Offsets:** Are they correct and aligned (multiples of 4 for offsets, appropriate sizes for data types)?
        *   **Pipeline Layouts & Bind Groups:** Do the layouts exactly match what the shader expects? Are bind groups created with the correct resources and bindings?
        *   **Shader Compilation:** Are there any WGSL compilation errors? Check `getCompilationInfo()`.
        *   **Texture Formats & Usage:** Is the format supported for the intended usage (e.g., `rgba32float` for storage write, correct `sampleType`)?
        *   **Command Encoding:** Are commands recorded in the correct order? Are render/compute passes properly begun and ended?
        *   **Error Scopes:** Are `pushErrorScope` and `popErrorScope` used around critical operations?
    *   **JavaScript Specifics:**
        *   **Async Operations:** Are promises handled correctly (`.then()`, `await`)?
        *   **Variable Scope & Closures:** Is data accessible where needed?
        *   **Type Coercion:** Are you accidentally passing strings where numbers are needed, or vice-versa? Use `parseInt`, `parseFloat`.
        *   **Array/Object References:** Are you modifying an object when you intend to create a new one?
    *   **WGSL Specifics:**
        *   **Type System:** Strict typing! Ensure `u32`, `f32`, `vecN`, `matNxM` are used correctly. Use suffixes like `1u`, `0.0f`.
        *   **Entry Points:** Correct `@compute`, `@vertex`, `@fragment` with `@workgroup_size` if needed.
        *   **Built-in Variables:** Correct usage of `global_invocation_id`, `vertex_index`, etc.
        *   **Function Signatures:** Do parameter and return types match?
        *   **Coordinate Systems:** Be mindful of NDC, clip space, screen space, world space.

7.  **Ask for "Help" (Simulated):** If I were explaining this problem to another developer, what would I say? How would I phrase the question? This often clarifies thinking. (For me, this means re-evaluating the problem from a different angle).

8.  **Take a Break:** Stepping away can often lead to new insights when you return.

**II. Specific Log Entries (Newest First)**

*   **Date:** 2024-07-16 (NovaRay Initialization)
    *   **Issue:** Project Genesis & Log Creation for NovaRay.
    *   **Context:** This log was created to document troubleshooting specific to the NovaRay build. NovaRay aims for high-end visual and computational performance, which may lead to unique challenges.
    *   **Philosophy:** When encountering performance limits or errors under high load, the primary approach will be to diagnose the root cause (e.g., algorithmic inefficiency, architectural bottlenecks, GPU limits on specific hardware) and engineer solutions that enhance capability or robustness, rather than defaulting to feature reduction. Simplification is a fallback, not a first step. This log will reflect that investigative process.

*   **Date:** 2024-07-15 (Adapted from WebGPUTracer Log)
    *   **Issue:** Persistent `textureLoad` and sampler/texture type errors in WGSL, particularly when using `rgba32float` textures for accumulation or G-buffer style passes.
    *   **Symptoms:** Errors like "Texture format mismatch between texture and sampler" or "Invalid texture usage for sample operation."
    *   **Key Learnings & Resolution Steps:**
        1.  **Mipmap Level for `textureLoad`**: `textureLoad` on a `texture_2d<f32>` (or similar sampled texture type) requires an explicit mipmap level argument (e.g., `0u`).
        2.  **Usage Flags for Ping-Pong/Storage-Sampled Textures**: Textures used for both storage (compute shader write) and sampling (compute/render shader read) need `GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING`.
        3.  **SampleType for Unfilterable Formats**: When binding a `texture_2d<f32>` that corresponds to an `rgba32float` GPUTexture in a bind group layout for sampling, its `sampleType` must be `'unfilterable-float'`.
        4.  **Sampler Compatibility**: If sampling an unfilterable texture format, the associated `sampler` in the bind group layout must have its `type` set to `'non-filtering'`, or its `minFilter` and `magFilter` set to `'nearest'`.
    *   **Relevance to NovaRay:** Essential for implementing deferred rendering, post-processing effects, and advanced compute passes that require writing to and then sampling floating-point textures.

*   **Date:** 2024-07-14 (Adapted from WebGPUTracer Log)
    *   **Issue:** "Write range does not fit" or similar UBO (Uniform Buffer Object) errors when writing data with `device.queue.writeBuffer`.
    *   **Symptoms:** WebGPU validation error indicating buffer write is out of bounds.
    *   **Key Learnings & Resolution Steps:**
        1.  **WGSL Struct Alignment/Padding:** WGSL has specific memory layout rules. `vec3<f32>` members are often padded to 16 bytes (like a `vec4<f32>`) if they are not the last member of a struct or if followed by types that require higher alignment. Scalar types like `f32` or `u32` usually have 4-byte alignment.
        2.  **JavaScript Data Sizing:** The JavaScript `ArrayBuffer` or `Float32Array` used to populate the UBO must exactly match the byte size required by the WGSL struct, including all padding.
        3.  **Verification:** Carefully sum the sizes of all members in the WGSL struct, respecting alignment rules (e.g., a `vec3f` is 12 bytes, but if it's followed by an `f32`, the `vec3f` might effectively take 16 bytes in the layout to align the next member). The total buffer size must be a multiple of the largest member's alignment (often 16 bytes for `vec3/vec4`).
    *   **Relevance to NovaRay:** Correct UBO management is fundamental for passing parameters to any shader. Misunderstanding padding is a very common source of errors.

*   **Date:** 2024-07-13 (Adapted from WebGPUTracer Log)
    *   **Issue:** WGSL shader compilation failures: "Unexpected identifier," "expected ')'", or type errors related to integer/float literals and array initializations.
    *   **Symptoms:** Shader module creation fails; browser console shows WGSL parsing/validation errors.
    *   **Key Learnings & Resolution Steps:**
        1.  **Integer Suffixes:** `u32` literals *must* have a `u` suffix (e.g., `0u`, `1u`, `255u`).
        2.  **Float Suffixes/Format:** `f32` literals *must* contain a decimal point (e.g., `1.0`, `0.0`) or use an `f` suffix (e.g., `1f`, `0f`). Scientific notation is also valid (e.g., `1e-5`).
        3.  **Array Constructor Syntax:** Explicitly use the `array<type, count>(elements...)` constructor, e.g., `array<u32, 3>(0u, 1u, 2u)`.
        4.  **Type Matching:** Ensure all variables, function parameters, and return types match exactly what's expected. No implicit casting between `i32`, `u32`, `f32`.
    *   **Relevance to NovaRay:** WGSL is strictly typed. These syntax details are common initial hurdles.

*   **Date:** 2024-07-12 (Adapted from WebGPUTracer Log)
    *   **Issue:** GPU device lost or "context lost" errors, often occurring after a period of successful rendering or when increasing scene complexity.
    *   **Symptoms:** Renderer stops, console shows device loss, often with messages like "A valid external Instance reference no longer exists" or "GPU TDR" (Timeout Detection and Recovery).
    *   **Key Learnings & Resolution Steps:**
        1.  **Robust `device.lost` Handling:** Implement `NovaRayEngine.device.lost.then(...)` to catch and log these events, and attempt graceful recovery or UI feedback.
        2.  **Error Scoping:** Wrap critical command submissions (especially `device.queue.submit`) in `device.pushErrorScope('internal')` and `device.pushErrorScope('validation')` followed by `popErrorScope()` to get more detailed GPU-side error messages that might precede a device loss.
        3.  **Reduce Workload (Initial Test):** Temporarily reduce scene complexity (fewer objects, fewer ray bounces, smaller textures/dispatch sizes) to see if the issue is load-related.
        4.  **Shader Complexity:** Long-running or infinitely looping shaders are a common cause. Review shaders for potential hangs.
        5.  **Resource Management:** Ensure GPU resources (buffers, textures) are properly created, managed, and destroyed when no longer needed. Leaks or excessive allocations can lead to instability.
        6.  **Driver/Browser Issues:** Sometimes, device loss can be due to specific browser versions or GPU driver bugs. Testing on different browsers or updating drivers can help isolate this.
    *   **Relevance to NovaRay:** As NovaRay pushes for high performance and complex effects, robust device loss handling and strategies for managing GPU workload will be critical.

*(This log will be expanded as new, significant issues are encountered and resolved during NovaRay development.)*
