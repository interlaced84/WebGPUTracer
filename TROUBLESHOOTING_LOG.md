My Troubleshooting Methodology & Log (ID: troubleshooting-log)

**I. Core Methodology**

1.  **Understand the Error:**
    *   **Read the Message Carefully:** Don't just skim. What does it *actually*
 say?
    *   **Identify the Source:** Which part of the code is implicated (WebGPU, W
GSL, JavaScript, HTML, CSS)?
    *   **Note Error Codes/Types:** Specific error codes (e.g., WebGPU validatio
n error types, HTTP status codes) are crucial.
    *   **Check the Console:** The browser's developer console is the primary so
urce of detailed error information. Expand objects and stack traces.
    *   **WebGPU Inspector:** If available (e.g., as a browser extension), use i
t to inspect pipeline states, buffer contents, and texture formats.

2.  **Isolate the Problem:**
    *   **Simplify:** Comment out recent changes or unrelated complex parts of t
he code to see if the error persists.
    *   **Minimal Reproducible Example:** If possible, try to create the simples
t possible code that triggers the error. This is invaluable for debugging.
    *   **Divide and Conquer:** If a complex system is failing, test individual
components or modules.

3.  **Formulate a Hypothesis:**
    *   Based on the error and isolation, what do you think is the most likely c
ause?
    *   Consider common pitfalls related to the technology (e.g., WebGPU buffer
alignment, WGSL type mismatches, JavaScript asynchronous timing).

4.  **Test the Hypothesis:**
    *   Make a targeted change designed to fix the hypothesized problem.
    *   If the change doesn't work, revert it before trying something else (unle
ss the change is clearly an improvement anyway).
    *   **Log Changes:** Briefly note what you tried, even if it failed. This pr
events repeating ineffective steps.

5.  **Consult Resources:**
    *   **This Log (Previous Entries):** Have I encountered this or a similar er
ror before?
    *   **`WEBGPU_RESOURCES.md`:** Check the official specs, common issues lists
, or helpful articles.
    *   **Web Search:** Use specific error messages or keywords to find online d
iscussions or documentation.

6.  **Systematic Checks (If Stuck):**
    *   **WebGPU Specifics:**
        *   **Adapter & Device:** Are they successfully requested and valid? Is
`device.lost` being handled?
        *   **Buffer Usage Flags:** Do they match how the buffer is being used (
e.g., `GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST`)?
        *   **Buffer Sizes & Offsets:** Are they correct and aligned (multiples
of 4 for offsets, appropriate sizes for data types)? Use `validateAndWriteBuffer
` helper.
        *   **Pipeline Layouts & Bind Groups:** Do the layouts exactly match wha
t the shader expects? Are bind groups created with the correct resources and bin
dings?
        *   **Shader Compilation:** Are there any WGSL compilation errors? Check
 `getCompilationInfo()`.
        *   **Texture Formats & Usage:** Is the format supported for the intende
d usage (e.g., `rgba32float` for storage write, correct `sampleType`)?
        *   **Command Encoding:** Are commands recorded in the correct order? Ar
e render/compute passes properly begun and ended?
        *   **Error Scopes:** Are `pushErrorScope` and `popErrorScope` used arou
nd critical operations?
    *   **JavaScript Specifics:**
        *   **Async Operations:** Are promises handled correctly (`.then()`, `aw
ait`)?
        *   **Variable Scope & Closures:** Is data accessible where needed?
        *   **Type Coercion:** Are you accidentally passing strings where number
s are needed, or vice-versa? Use `parseInt`, `parseFloat`.
        *   **Array/Object References:** Are you modifying an object when you in
tend to create a new one?
    *   **WGSL Specifics:**
        *   **Type System:** Strict typing! Ensure `u32`, `f32`, `vecN`, `matNxM
` are used correctly. Use suffixes like `1u`, `0.0f`.
        *   **Entry Points:** Correct `@compute`, `@vertex`, `@fragment` with `@
workgroup_size` if needed.
        *   **Built-in Variables:** Correct usage of `global_invocation_id`, `ve
rtex_index`, etc.
        *   **Function Signatures:** Do parameter and return types match?
        *   **Coordinate Systems:** Be mindful of NDC, clip space, screen space,
 world space.

7.  **Ask for "Help" (Simulated):** If I were explaining this problem to another
 developer, what would I say? How would I phrase the question? This often clarif
ies thinking. (For me, this means re-evaluating the problem from a different ang
le).

8.  **Take a Break:** Stepping away can often lead to new insights when you retu
rn.

**II. Specific Log Entries (Newest First)**

*   **Date:** (Self-Correction Timestamp, e.g., 2024-07-15 12:05:00 UTC)
    *   **Issue:** Persistent `textureLoad` and sampler/texture type errors in W
GSL, especially after introducing `rgba32float` for accumulation.
    *   **Investigation:**
        *   Error: "Texture format mismatch between texture and sampler" or "Inv
alid texture usage for sample operation".
        *   Confirmed `textureLoad(inputTexture, vec2<i32>(global_id.xy), 0u)` n
eeds the explicit mipmap level `0u` for `texture_2d<f32>` types.
        *   For `rgba32float` textures used in accumulation (one for read, one f
or write):
            *   The texture being *read* by `textureLoad` (as `texture_2d<f32>`)
 must have `TEXTURE_BINDING` usage.
            *   The texture being *written* to by `textureStore` (as `texture_st
orage_2d<rgba32float, write>`) must have `STORAGE_BINDING` usage.
            *   The sampler used with the `texture_2d<f32>` in the *render pass*
 (displaying the result) needs to be compatible. `rgba32float` is 'unfilterable-
float'.
        *   **Solution Path:**
            1.  Ensure `outputTexture0`/`outputTexture1` have `GPUTextureUsage.S
TORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING`.
            2.  In compute shader:
                *   `@group(0) @binding(6) var outputTexture: texture_storage_2d
<rgba32float, write>;`
                *   `@group(0) @binding(7) var inputTexture: texture_2d<f32>;` (
This implies `sampleType: 'unfilterable-float'` in layout)
            3.  In render pipeline bind group layout for the texture being sampl
ed: `texture: { sampleType: 'unfilterable-float' }`.
            4.  Associated sampler in render pipeline: `sampler: { type: 'non-fi
ltering' }` (or use `nearest` for min/mag filters).
        *   **Status:** Implemented. This resolved the sampling and type mismatc
h errors for the accumulation ping-pong setup.

*   **Date:** (Previous Entry)
    *   **Issue:** "Write range does not fit" for UBOs (e.g., CameraUniformBuffe
r).
    *   **Investigation:** JavaScript data (e.g., `Float32Array`) size/layout di
d not precisely match WGSL struct definition due to padding/alignment rules (e.g
., `vec3` often padded to `vec4` size).
    *   **Solution:** Carefully calculate byte sizes in JS considering WGSL padd
ing (e.g., a `vec3<f32>` takes 16 bytes if followed by another element, not 12).
 Update JS `Float32Array` allocations and `device.queue.writeBuffer` calls. Use
pre-allocated `Float32Array`s for UBOs and fill them, rather than creating new o
nes each time.
    *   **Status:** Fixed. Example: Camera UBO changed from 20 floats (80 bytes)
 to 24 floats (96 bytes) to match WGSL struct with padding. Light UBO fixed to 6
4 bytes.

*   **Date:** (Previous Entry)
    *   **Issue:** WGSL array initialization errors or "index out of bounds" for
 `perm` / `grad3` tables in Perlin noise.
    *   **Investigation:**
        *   Forgetting `u` suffix for `u32` literals in arrays.
        *   Array constructor syntax: `array<u32, 512>(...)` not just `(...)`.
        *   Incorrect number of elements (e.g., `perm` table needs 256 values *d
uplicated* to fill 512 if accessed with `i % 256u` effectively, or just ensure f
ull 512 unique/patterned values if accessed `i % 512u`).
    *   **Solution:** Corrected WGSL array syntax, ensured all integer literals
for `u32` arrays have `u` suffix. Duplicated initial 256 Perlin `perm` values to
 fill the 512-element array.
    *   **Status:** Fixed.

*   **Date:** (Previous Entry)
    *   **Issue:** GPU device lost ("A valid external Instance reference no long
er exists") after ~30 seconds, especially with higher sphere counts or bounces.
Often a "context lost" error.
    *   **Investigation:** Likely a timeout or excessive workload on the GPU. Co
uld be due to long shader execution, too many operations, or driver issues.
    *   **Solution Steps:**
        1.  **Implement `device.lost.then()` handler:** To catch and log informa
tion about the device loss.
        2.  **Wrap `device.queue.submit()` in `pushErrorScope`/`popErrorScope`:*
* To get more specific validation/internal errors leading up to a potential loss
.
        3.  **Reduce Default Complexity:** Lowered initial `targetSphereCount`,
`maxBounces`, `samplesPerPixel` to reduce stress on startup.
        4.  **Input Validation:** Added robust input validation for UI controls
to prevent extreme values that could crash the GPU.
        5.  **Buffer Validation:** Implemented `validateAndWriteBuffer` to catch
 buffer offset/size errors before they go to the GPU.
        6.  **WGSL Safeguards:** Added `clamp()` for array accesses in WGSL and
checks for `numPrimitives > 0u` etc., to prevent out-of-bounds access with empty
 scenes.
    *   **Status:** Significantly improved stability. Device loss is less freque
nt but can still occur under extreme settings, which is somewhat expected. The e
rror handling provides better feedback.

*   **Date:** (Older Entry - Initial "Eureka" phase)
    *   **Issue:** Black screen or no rendering, no obvious errors.
    *   **Investigation:** Could be anything from shader errors to incorrect pip
eline setup or missing `draw()` calls.
    *   **Common Fixes Found:**
        *   Ensure `requestAnimationFrame` is correctly calling the render loop.
        *   Verify render pass descriptors (color attachment views, load/store o
ps).
        *   Ensure vertex shaders output correct clip space positions.
        *   Check texture views and sampler bindings.
        *   **Crucial for compute-to-render:** Ensure the texture written by com
pute is correctly bound and sampled by the render pipeline. The `sampleType` in
`createRenderPipeline` layout for the texture must match the texture's format (e
.g., `unfilterable-float` for `rgba32float`). Sampler type should be `non-filter
ing`.
    *   **Status:** Resolved by systematically checking pipeline stages.

*(This log will be expanded as new, significant issues are encountered and resol
ved.)*
