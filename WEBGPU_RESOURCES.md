WebGPU Troubleshooting Resources (ID: webgpu-troubleshooting-resources)

**1. Official Specifications & Documentation:**

*   **WebGPU Specification:** [https://gpuweb.github.io/gpuweb/](https://gpuweb.github.io/gpuweb/)
    *   The ultimate source of truth. Can be dense, but essential for nuanced questions.
*   **WGSL Specification:** [https://gpuweb.github.io/gpuweb/wgsl/](https://gpuweb.github.io/gpuweb/wgsl/)
    *   The official specification for the WebGPU Shading Language.
*   **MDN Web Docs - WebGPU API:** [https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
    *   Generally more approachable than the spec, with examples and higher-level explanations.

**2. Key Concepts & Potential Pitfall Areas:**

*   **Adapter & Device:** Understanding the process of requesting these and handling `device.lost`.
*   **Pipeline Creation (Render & Compute):**
    *   **Layouts (BindGroupLayout, PipelineLayout):** Must perfectly match shader expectations. Mismatches are a common error source.
    *   **Shader Modules:** Ensure WGSL compiles without errors (`getCompilationInfo()`).
    *   **Vertex State:** For render pipelines, ensure `vertexBuffers` in the descriptor correctly define `arrayStride`, `attributes` (format, offset, shaderLocation).
    *   **Primitive State:** `topology`, `cullMode`, `frontFace`.
    *   **Depth/Stencil State:** If using depth or stencil buffers.
    *   **Multisample State:** If using MSAA.
    *   **Fragment State:** `targets` (color attachment formats must match).
*   **Bind Groups:**
    *   Resources (buffers, textures, samplers) must match the types and binding numbers defined in the `GPUBindGroupLayout`.
    *   Buffers need correct `usage` flags set at creation.
    *   Texture views must be compatible with shader (e.g., `texture_2d` vs `texture_storage_2d`).
    *   Samplers need compatible `type` (e.g. `filtering`, `non-filtering`, `comparison`).
*   **Buffers:**
    *   **Usage Flags:** Critical (e.g., `UNIFORM`, `STORAGE`, `VERTEX`, `INDEX`, `COPY_SRC`, `COPY_DST`).
    *   **Size & Alignment:** `writeBuffer` offsets and sizes must be multiples of 4. Data structures in JS must map to WGSL struct padding/alignment rules (often `vec3` pads to 16 bytes).
    *   **`mappedAtCreation` and `mapAsync`:** For CPU-GPU data transfer. Understand the implications of mapping.
*   **Textures:**
    *   **Usage Flags:** `TEXTURE_BINDING`, `STORAGE_BINDING`, `COPY_SRC`, `COPY_DST`, `RENDER_ATTACHMENT`.
    *   **Formats:** Choose appropriate formats (e.g., `rgba8unorm`, `rgba32float`).
    *   **`sampleType`:** For textures used with `TEXTURE_BINDING`, this is crucial and must match shader expectations and pipeline layout (e.g., `float`, `unfilterable-float`, `depth`).
    *   **Storage Textures (`texture_storage_2d`):** Have specific format requirements and access modes (`write-only`, `read-only`, `read-write` - note: `read-write` often requires an extension).
*   **Command Encoding (CommandEncoder, RenderPassEncoder, ComputePassEncoder):**
    *   Passes must be ended (`end()`).
    *   Correct pipelines and bind groups must be set.
    *   `draw()` or `dispatchWorkgroups()` calls with correct parameters.
*   **WGSL:**
    *   **Strict Typing:** No implicit casts. Use `f32()`, `u32()`, etc.
    *   **Numeric Suffixes:** `1.0f` (or `1.f`), `1u`, `1i`.
    *   **Struct Layout & Alignment:** Matches CPU-side expectations if transferring data.
    *   **Built-ins:** `@builtin(position)`, `@builtin(global_invocation_id)`, etc.
    *   **Entry Points:** `@vertex`, `@fragment`, `@compute`. `@workgroup_size` for compute.
*   **Error Handling:**
    *   `device.lost.then(...)`.
    *   `device.pushErrorScope('validation' | 'out-of-memory' | 'internal')` and `device.popErrorScope()`.
    *   `GPUDevice.onuncapturederror`. (Less common now with scopes, but can be a fallback).
    *   Shader `compilationInfo()`.

**3. Online Resources & Communities:**

*   **WebGPU Samples:** [https://austin-eng.com/webgpu-samples/](https://austin-eng.com/webgpu-samples/)
    *   Excellent source of working examples for various features.
*   **WebGPU CTS (Conformance Test Suite):** [https://github.com/gpuweb/cts](https://github.com/gpuweb/cts)
    *   Can be useful to see how specific features are tested.
*   **Stack Overflow (WebGPU tag):** [https://stackoverflow.com/questions/tagged/webgpu](https://stackoverflow.com/questions/tagged/webgpu)
    *   Search for existing questions or ask new ones.
*   **WebGPU Matrix/Discord/IRC:**
    *   WebGPU Community Group discussions (see [https://www.w3.org/community/gpu/](https://www.w3.org/community/gpu/)) often have links to real-time chat. Good for specific, hard-to-debug questions.
*   **Browser Specific Debugging:**
    *   **Chrome:** `chrome://gpu` can provide insights into GPU process status and feature support. DevTools often have WebGPU-specific debugging features under "Experiments" or directly available.
    *   **Firefox:** `about:config` for WebGPU flags, `about:support` for graphics info. DevTools may have similar features.
    *   **Safari:** Develop menu, Web Inspector.

**4. Tools:**

*   **WebGPU Inspector (Browser Extension):**
    *   (If available for your browser) Allows inspecting GPU state, objects, and commands. Can be very helpful for visualizing what's happening.
    *   Example (may vary): [https://github.com/brendan-duncan/webgpu_inspector](https://github.com/brendan-duncan/webgpu_inspector) (Chrome)

**5. Common Error Messages & Potential Meanings:**

*   **"Validation error":** You've likely used the API incorrectly (e.g., wrong buffer usage, mismatched bind group layout, invalid texture format for operation). The detailed message is key.
*   **"Internal error":** May indicate a driver bug, browser bug, or a very unusual/complex scenario the implementation couldn't handle.
*   **"Out-of-memory error":** You're trying to allocate too much GPU memory (large buffers, many textures).
*   **"Context lost" / "Device lost":** The GPU has become unavailable. Often due to excessive workload, driver crash, system sleep, or explicit destruction.
*   **WGSL compilation errors:** Syntax errors, type mismatches, function signature issues in your shader code. The error message usually points to the line and problem.
*   **"Binding mismatch":** The bind group layout in the pipeline doesn't match what the shader expects for a given `@group(X) @binding(Y)`.
*   **"Buffer/texture usage missing":** You're trying to use a resource in a way not declared in its `usage` flags at creation.
*   **"Offset X is not a multiple of Y":** Buffer offsets or data sizes often need to be aligned (e.g., to 4 or 256 bytes for UBOs depending on hardware).

*(Remember to keep this updated with new valuable resources as they are found.)*
