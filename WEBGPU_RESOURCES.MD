WebGPU Troubleshooting Resources (ID: webgpu-troubleshooting-resources)

**1. Official Specifications & Documentation:**

*   **WebGPU Specification:** [https://gpuweb.github.io/gpuweb/](https://gpuweb.
github.io/gpuweb/)
    *   The ultimate source of truth. Can be dense, but essential for nuanced qu
estions.
*   **WGSL Specification:** [https://gpuweb.github.io/gpuweb/wgsl/](https://gpuw
eb.github.io/gpuweb/wgsl/)
    *   The official specification for the WebGPU Shading Language.
*   **MDN Web Docs - WebGPU API:** [https://developer.mozilla.org/en-US/docs/Web
/API/WebGPU_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
    *   Generally more approachable than the spec, with examples and higher-leve
l explanations.

**2. Key Concepts & Potential Pitfall Areas:**

*   **Adapter & Device:** Understanding the process of requesting these and hand
ling `device.lost`.
*   **Pipeline Creation (Render & Compute):**
    *   **Layouts (BindGroupLayout, PipelineLayout):** Must perfectly match shad
er expectations. Mismatches are a common error source.
    *   **Shader Modules:** Ensure WGSL compiles without errors (`getCompilation
Info()`).
    *   **Vertex State:** For render pipelines, ensure `vertexBuffers` in the de
scriptor correctly define `arrayStride`, `attributes` (format, offset, shaderLoc
ation).
    *   **Primitive State:** `topology`, `cullMode`, `frontFace`.
    *   **Depth/Stencil State:** If using depth or stencil buffers.
    *   **Multisample State:** If using MSAA.
    *   **Fragment State:** `targets` (color attachment formats must match).
*   **Bind Groups:**
    *   Resources (buffers, textures, samplers) must match the types and binding
 numbers defined in the `GPUBindGroupLayout`.
    *   Buffers need correct `usage` flags set at creation.
    *   Texture views must be compatible with shader (e.g., `texture_2d` vs `tex
ture_storage_2d`).
    *   Samplers need compatible `type` (e.g. `filtering`, `non-filtering`, `com
parison`).
*   **Buffers:**
    *   **Usage Flags:** Critical (e.g., `UNIFORM`, `STORAGE`, `VERTEX`, `INDEX`
, `COPY_SRC`, `COPY_DST`).
    *   **Size & Alignment:** `writeBuffer` offsets and sizes must be multiples
of 4. Data structures in JS must map to WGSL struct padding/alignment rules (oft
en `vec3` pads to 16 bytes).
    *   **`mappedAtCreation` and `mapAsync`:** For CPU-GPU data transfer. Unders
tand the implications of mapping.
*   **Textures:**
    *   **Usage Flags:** `TEXTURE_BINDING`, `STORAGE_BINDING`, `COPY_SRC`, `COPY
_DST`, `RENDER_ATTACHMENT`.
    *   **Formats:** Choose appropriate formats (e.g., `rgba8unorm`, `rgba32floa
t`).
    *   **`sampleType`:** For textures used with `TEXTURE_BINDING`, this is cruc
ial and must match shader expectations and pipeline layout (e.g., `float`, `unfi
lterable-float`, `depth`).
    *   **Storage Textures (`texture_storage_2d`):** Have specific format requir
ements and access modes (`write-only`, `read-only`, `read-write` - note: `read-w
rite` often requires an extension).
*   **Command Encoding (CommandEncoder, RenderPassEncoder, ComputePassEncoder):*
*
    *   Passes must be ended (`end()`).
    *   Correct pipelines and bind groups must be set.
    *   `draw()` or `dispatchWorkgroups()` calls with correct parameters.
*   **WGSL:**
    *   **Strict Typing:** No implicit casts. Use `f32()`, `u32()`, etc.
    *   **Numeric Suffixes:** `1.0f` (or `1.f`), `1u`, `1i`.
    *   **Struct Layout & Alignment:** Matches CPU-side expectations if transfer
ring data.
    *   **Built-ins:** `@builtin(position)`, `@builtin(global_invocation_id)`, e
tc.
    *   **Entry Points:** `@vertex`, `@fragment`, `@compute`. `@workgroup_size`
for compute.
*   **Error Handling:**
    *   `device.lost.then(...)`.
    *   `device.pushErrorScope('validation' | 'out-of-memory' | 'internal')` and
 `device.popErrorScope()`.
    *   `GPUDevice.onuncapturederror`. (Less common now with scopes, but can be
a fallback).
    *   Shader `compilationInfo()`.

**3. Online Resources & Communities:**

*   **WebGPU Samples:** [https://austin-eng.com/webgpu-samples/](https://austin-
eng.com/webgpu-samples/)
    *   Excellent source of working examples for various features.
*   **WebGPU CTS (Conformance Test Suite):** [https://github.com/gpuweb/cts](htt
ps://github.com/gpuweb/cts)
    *   Can be useful to see how specific features are tested.
*   **Stack Overflow (WebGPU tag):** [https://stackoverflow.com/questions/tagged
/webgpu](https://stackoverflow.com/questions/tagged/webgpu)
    *   Search for existing questions or ask new ones.
*   **WebGPU Matrix/Discord/IRC:**
    *   WebGPU Community Group discussions (see [https://www.w3.org/community/gp
u/](https://www.w3.org/community/gpu/)) often have links to real-time chat. Good
 for specific, hard-to-debug questions.
*   **Browser Specific Debugging:**
    *   **Chrome:** `chrome://gpu` can provide insights into GPU process status
and feature support. DevTools often have WebGPU-specific debugging features unde
r "Experiments" or directly available.
    *   **Firefox:** `about:config` for WebGPU flags, `about:support` for graphi
cs info. DevTools may have similar features.
    *   **Safari:** Develop menu, Web Inspector.

**4. Tools:**

*   **WebGPU Inspector (Browser Extension):**
    *   (If available for your browser) Allows inspecting GPU state, objects, an
d commands. Can be very helpful for visualizing what's happening.
    *   Example (may vary): [https://github.com/brendan-duncan/webgpu_inspector]
(https://github.com/brendan-duncan/webgpu_inspector) (Chrome)

**5. Common Error Messages & Potential Meanings:**

*   **"Validation error":** You've likely used the API incorrectly (e.g., wrong
buffer usage, mismatched bind group layout, invalid texture format for operation
). The detailed message is key.
*   **"Internal error":** May indicate a driver bug, browser bug, or a very unus
ual/complex scenario the implementation couldn't handle.
*   **"Out-of-memory error":** You're trying to allocate too much GPU memory (la
rge buffers, many textures).
*   **"Context lost" / "Device lost":** The GPU has become unavailable. Often du
e to excessive workload, driver crash, system sleep, or explicit destruction.
*   **WGSL compilation errors:** Syntax errors, type mismatches, function signat
ure issues in your shader code. The error message usually points to the line and
 problem.
*   **"Binding mismatch":** The bind group layout in the pipeline doesn't match
what the shader expects for a given `@group(X) @binding(Y)`.
*   **"Buffer/texture usage missing":** You're trying to use a resource in a way
 not declared in its `usage` flags at creation.
*   **"Offset X is not a multiple of Y":** Buffer offsets or data sizes often ne
ed to be aligned (e.g., to 4 or 256 bytes for UBOs depending on hardware).

*(Remember to keep this updated with new valuable resources as they are found.)*


## Real-time Volumetric Clouds (C/OpenGL Example)

*   **Link:** [`https://raw.githubusercontent.com/Jaysmito101/cgl/main/examples/
c/realtime_volumetric_clouds.c`](https://raw.githubusercontent.com/Jaysmito101/c
gl/main/examples/c/realtime_volumetric_clouds.c)
*   **Source:** Jaysmito101/cgl GitHub Repository
*   **Description:** A C language example using OpenGL (via CGL library) to rend
er real-time volumetric clouds. It demonstrates a common approach involving raym
arching through a volume defined by 3D noise textures.
*   **Key Concepts/Techniques:**
    *   Volumetric raymarching for cloud rendering.
    *   Density sampling from 3D noise textures (combines Perlin and Worley nois
e for shape and detail).
    *   Use of Curl noise for potential animation/distortion effects.
    *   Henyey-Greenstein phase function for simulating light scattering within
clouds.
    *   Calculation of light absorption and transmittance through the cloud volu
me.
    *   Generation of 3D noise textures (shape, detail, curl) using GLSL compute
 shaders.
    *   Multi-pass rendering: opaque scene pass (providing depth for occlusion)
followed by a cloud rendering pass composited on top.
*   **Relevance/Potential for Our WebGPU Project:**
    *   Provides a strong algorithmic and conceptual base for implementing a vol
umetric cloud feature.
    *   Noise generation techniques (Perlin, Worley, Curl) are translatable to W
GSL compute shaders. Our current Perlin noise could be augmented or replaced by
these more specialized versions for clouds.
    *   The raymarching logic, density sampling, and lighting model (phase funct
ion, transmittance) for participating media can be adapted to WGSL for a cloud r
endering pass.
    *   The example lists many controllable parameters (density, scale, absorpti
on, phase parameters, noise weights, animation speed, etc.) which would be valua
ble to expose in our UI.
    *   Demonstrates a practical approach to compositing volumetric effects with
 an existing opaque scene using depth information.


## Official WebGPU Samples Repository

*   **Link:** [`https://github.com/webgpu/webgpu-samples`](https://github.com/we
bgpu/webgpu-samples)
*   **Live Samples:** [`https://webgpu.github.io/webgpu-samples/`](https://webgp
u.github.io/webgpu-samples/)
*   **Description:** The official collection of samples and demonstrations for t
he WebGPU API, maintained by the WebGPU working group. Primarily TypeScript with
 WGSL shaders.
*   **Key Offerings:** Authoritative API usage examples, diverse WGSL shaders, T
ypeScript logic for various graphics techniques.
*   **Relevance:** Primary reference for correct API patterns, WGSL inspiration,
 and learning specific WebGPU features.
*   **Action:** Requires user browsing of `samples/` and `shaders/` subdirectori
es to identify specific files for detailed analysis by the AI.
