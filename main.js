// main.js for WebGPU Raymarcher Test with Self-Shadowing

// --- Minimal Matrix/Vector Library ---
function normalizeVector3D(v) { let len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]); if (len > 0.00001) { return [v[0]/len, v[1]/len, v[2]/len]; } return [0,0,0]; }
function crossProduct3D(a,b) { return [ a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0] ]; }
function dotProduct(v1,v2) { return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]; }
function getProjectionMatrix(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy/2); const out = new Float32Array(16);
    out[0]=f/aspect; out[5]=f; out[10]=far/(far-near); out[11]=1; out[14]=-(far*near)/(far-near);
    return out;
}
function getViewMatrix(cameraPosition, cameraForward, cameraUp) {
    const z=normalizeVector3D([-cameraForward[0],-cameraForward[1],-cameraForward[2]]); const x=normalizeVector3D(crossProduct3D(cameraUp,z)); const y=normalizeVector3D(crossProduct3D(z,x));
    const out = new Float32Array(16);
    out[0]=x[0]; out[4]=x[1]; out[8]=x[2]; out[12]=-dotProduct(x,cameraPosition);
    out[1]=y[0]; out[5]=y[1]; out[9]=y[2]; out[13]=-dotProduct(y,cameraPosition);
    out[2]=z[0]; out[6]=z[1]; out[10]=z[2];out[14]=-dotProduct(z,cameraPosition);
    out[15]=1;
    return out;
}
function invertMatrix(m) {
    const o=new Float32Array(16); const M=m;
    const b00=M[0]*M[5]-M[1]*M[4];const b01=M[0]*M[6]-M[2]*M[4];const b02=M[0]*M[7]-M[3]*M[4];const b03=M[1]*M[6]-M[2]*M[5];const b04=M[1]*M[7]-M[3]*M[5];const b05=M[2]*M[7]-M[3]*M[6];
    const b06=M[8]*M[13]-M[9]*M[12];const b07=M[8]*M[14]-M[10]*M[12];const b08=M[8]*M[15]-M[11]*M[12];const b09=M[9]*M[14]-M[10]*M[13];const b10=M[9]*M[15]-M[11]*M[13];const b11=M[10]*M[15]-M[11]*M[14];
    let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;
    if(!d){console.warn("invertMatrix: singular"); o.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]); return o;} d=1/d;
    o[0]=(M[5]*b11-M[6]*b10+M[7]*b09)*d;o[1]=(M[2]*b10-M[1]*b11-M[3]*b09)*d;o[2]=(M[13]*b05-M[14]*b04+M[15]*b03)*d;o[3]=(M[10]*b04-M[9]*b05-M[11]*b03)*d;
    o[4]=(M[6]*b08-M[4]*b11-M[7]*b07)*d;o[5]=(M[0]*b11-M[2]*b08+M[3]*b07)*d;o[6]=(M[14]*b02-M[12]*b05-M[15]*b01)*d;o[7]=(M[8]*b05-M[10]*b02+M[11]*b01)*d;
    o[8]=(M[4]*b10-M[5]*b08+M[7]*b06)*d;o[9]=(M[1]*b08-M[0]*b10-M[3]*b06)*d;o[10]=(M[12]*b04-M[13]*b02+M[15]*b00)*d;o[11]=(M[9]*b02-M[8]*b04-M[11]*b00)*d;
    o[12]=(M[5]*b07-M[4]*b09-M[6]*b06)*d;o[13]=(M[0]*b09-M[1]*b07+M[2]*b06)*d;o[14]=(M[13]*b01-M[12]*b03-M[14]*b00)*d;o[15]=(M[8]*b03-M[9]*b01+M[10]*b00)*d;
    return o;
}
// --- End Matrix/Vector Library ---

async function main() {
    const canvas = document.getElementById('webgpu-canvas');
    if (!canvas) { console.error("Canvas element not found."); return; }
    if (!navigator.gpu) { console.error("WebGPU not supported."); document.body.innerHTML = "WebGPU not supported."; return; }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) { console.error("Failed to get GPU adapter."); return; }
    const device = await adapter.requestDevice();
    if (!device) { console.error("Failed to get GPU device."); return; }

    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    function configureCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        context.configure({ device, format: presentationFormat, alphaMode: 'opaque' });
    }
    configureCanvas();
    window.addEventListener('resize', configureCanvas);

    let noiseWgsl, raymarcherWgsl;
    try {
        noiseWgsl = await (await fetch('noise.wgsl')).text();
        raymarcherWgsl = await (await fetch('raymarcher.wgsl')).text();
    } catch (e) { console.error("Error loading WGSL:", e); return; }

    const combinedShaderSource = noiseWgsl + "\n" + raymarcherWgsl;
    const shaderModule = device.createShaderModule({ label: 'Raymarcher Shader', code: combinedShaderSource });
    shaderModule.getCompilationInfo().then(info => {
        if (info.messages.filter(m=>m.type==='error').length > 0) { console.error("Raymarcher Shader Compilation Errors:", info.messages); info.messages.forEach(m=>console.log(m.message));}
        else { console.log("Raymarcher Shader compiled."); }
    });

    // WGSL Uniforms struct layout from raymarcher.wgsl (total 336 bytes)
    const uniformBufferSize = 336;
    const uniformBuffer = device.createBuffer({ size: uniformBufferSize, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const uniformsData = new ArrayBuffer(uniformBufferSize);
    const uniformsF32 = new Float32Array(uniformsData);
    const uniformsU32 = new Uint32Array(uniformsData);

    const camPos = [0.0, 0.0, 2.5]; const camFwd = [0.0,0.0,-1.0]; const camUp = [0.0,1.0,0.0];
    const aspect = canvas.width/canvas.height; const projMat = getProjectionMatrix(Math.PI/3, aspect, 0.1, 100.0);
    const viewMat = getViewMatrix(camPos, camFwd, camUp);
    const invProjMat = invertMatrix(projMat); const invViewMat = invertMatrix(viewMat);

    let f32Idx = 0;

    // camera_pos: vec3f, _padding1: f32 (16 bytes)
    uniformsF32.set(camPos, f32Idx); f32Idx += 4;
    // inv_proj_matrix: mat4x4f (64 bytes)
    uniformsF32.set(invProjMat, f32Idx); f32Idx += 16;
    // inv_view_matrix: mat4x4f (64 bytes)
    uniformsF32.set(invViewMat, f32Idx); f32Idx += 16;
    // viewport_size: vec2f, _padding2: vec2f (16 bytes)
    const viewportSizeUniformOffsetF32 = f32Idx; // Store offset for dynamic update
    uniformsF32[f32Idx++] = canvas.width; uniformsF32[f32Idx++] = canvas.height; f32Idx += 2;
    // cloud_bounds_min: vec3f, _padding3: f32 (16 bytes)
    uniformsF32.set([-2.0, -0.8, -2.0], f32Idx); f32Idx += 4;
    // cloud_bounds_max: vec3f, _padding4: f32 (16 bytes)
    uniformsF32.set([2.0, 0.8, 2.0], f32Idx); f32Idx += 4;

    // Raymarching & Base Noise block (16 bytes)
    // max_steps: u32, step_size: f32, time: f32, noise_scale: f32
    let currentBlockU32View = new Uint32Array(uniformsData, f32Idx * 4, 4);
    let currentBlockF32View = new Float32Array(uniformsData, f32Idx * 4, 4);
    currentBlockU32View[0] = 96;        // max_steps
    currentBlockF32View[1] = 0.04;      // step_size
    const timeUniformOffsetF32 = f32Idx + 2; // Absolute f32 index for time
    currentBlockF32View[2] = 0.0;       // time (initial)
    currentBlockF32View[3] = 0.25;      // noise_scale (primary detail)
    f32Idx += 4;

    // FBM & Base Density block (16 bytes)
    // fbm_octaves: u32, fbm_persistence: f32, fbm_lacunarity: f32, base_density_threshold_min: f32
    currentBlockU32View = new Uint32Array(uniformsData, f32Idx * 4, 4);
    currentBlockF32View = new Float32Array(uniformsData, f32Idx * 4, 4);
    currentBlockU32View[0] = 5;         // fbm_octaves
    currentBlockF32View[1] = 0.5;       // fbm_persistence
    currentBlockF32View[2] = 2.0;       // fbm_lacunarity
    currentBlockF32View[3] = -0.15;     // base_density_threshold_min
    f32Idx += 4;

    // Density & Material Coefficients block (16 bytes)
    // base_density_threshold_max: f32, density_multiplier: f32, absorption_coefficient: f32, scattering_coefficient: f32
    uniformsF32[f32Idx++] = 0.25;     // base_density_threshold_max
    uniformsF32[f32Idx++] = 25.0;     // density_multiplier
    uniformsF32[f32Idx++] = 2.5;      // absorption_coefficient (for view ray)
    uniformsF32[f32Idx++] = 2.0;      // scattering_coefficient

    // Henyey-G & Coverage Noise block (16 bytes)
    // henyey_g: f32, coverage_noise_scale: f32, coverage_fbm_octaves: u32, coverage_fbm_persistence: f32
    currentBlockU32View = new Uint32Array(uniformsData, f32Idx * 4, 4); // u32 view for mixed types
    currentBlockF32View = new Float32Array(uniformsData, f32Idx * 4, 4);
    currentBlockF32View[0] = 0.2;       // henyey_g
    currentBlockF32View[1] = 0.03;      // coverage_noise_scale
    currentBlockU32View[2] = 3;         // coverage_fbm_octaves (u32)
    currentBlockF32View[3] = 0.5;       // coverage_fbm_persistence
    f32Idx += 4;

    // Coverage & Height Shaping block (16 bytes)
    // coverage_fbm_lacunarity: f32, coverage_threshold: f32, cloud_base_height: f32, cloud_top_height: f32
    uniformsF32[f32Idx++] = 2.0;      // coverage_fbm_lacunarity
    uniformsF32[f32Idx++] = 0.45;     // coverage_threshold
    uniformsF32[f32Idx++] = -0.5;     // cloud_base_height
    uniformsF32[f32Idx++] = 0.5;      // cloud_top_height

    // Height Falloff & Shadow Params block (16 bytes)
    // height_density_falloff: f32, shadow_max_steps: u32, shadow_step_size: f32, shadow_absorption_coefficient: f32
    currentBlockU32View = new Uint32Array(uniformsData, f32Idx * 4, 4); // u32 view for mixed types
    currentBlockF32View = new Float32Array(uniformsData, f32Idx * 4, 4);
    currentBlockF32View[0] = 0.25;      // height_density_falloff
    currentBlockU32View[1] = 24;        // shadow_max_steps (u32)
    currentBlockF32View[2] = 0.1;       // shadow_step_size
    currentBlockF32View[3] = 1.5;       // shadow_absorption_coefficient (was 0.7, trying higher for more noticeable shadows)
    f32Idx += 4;

    // Lighting block 1 (16 bytes) - light_dir + _padding6
    uniformsF32.set(normalizeVector3D([0.8, 0.6, -0.3]), f32Idx); f32Idx += 4;
    // Lighting block 2 (16 bytes) - light_color + _padding7
    uniformsF32.set([1.0, 0.95, 0.9], f32Idx); f32Idx += 4;
    // Lighting block 3 (16 bytes) - ambient_light_color + _padding8
    uniformsF32.set([0.02, 0.03, 0.05], f32Idx); f32Idx += 4;

    if (f32Idx * 4 !== uniformBufferSize) {
        console.warn(`Uniform buffer filling mismatch. Expected ${uniformBufferSize} bytes, filled based on f32Idx: ${f32Idx*4} bytes.`);
    }

    device.queue.writeBuffer(uniformBuffer, 0, uniformsData);

    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding:0, visibility:GPUShaderStage.FRAGMENT, buffer:{type:'uniform'}}]});
    const bindGroup = device.createBindGroup({ layout:bindGroupLayout, entries:[{binding:0, resource:{buffer:uniformBuffer}}]});
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout]});

    const vsModule = device.createShaderModule({ label:"QuadVS", code: `struct VSOut{@builtin(position)p:vec4f};@vertex fn main_vert(@builtin(vertex_index)vi:u32)->VSOut{let pos=array(vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(-1,1),vec2(1,-1),vec2(1,1));return VSOut(vec4(pos[vi],0,1));}`});
    vsModule.getCompilationInfo().then(info=>{if(info.messages.filter(m=>m.type==='error').length > 0)console.error("VS Compile Errors:",info.messages); else console.log("VS compiled.");});

    const renderPipeline = device.createRenderPipeline({
        label: 'RaymarcherPipeline', layout: pipelineLayout,
        vertex: { module: vsModule, entryPoint: 'main_vert' },
        fragment: { module: shaderModule, entryPoint: 'main', targets: [{ format: presentationFormat }] },
        primitive: { topology: 'triangle-list' },
    });

    let startTime = performance.now();
    function renderLoop() {
        if (!device) return;
        const currentTime = (performance.now() - startTime) / 1000.0;

        uniformsF32[timeUniformOffsetF32] = currentTime; // Update time
        uniformsF32[viewportSizeUniformOffsetF32] = canvas.width;
        uniformsF32[viewportSizeUniformOffsetF32 + 1] = canvas.height;

        device.queue.writeBuffer(uniformBuffer, 0, uniformsData);

        const cmdEncoder = device.createCommandEncoder();
        const texView = context.getCurrentTexture().createView();
        const passDesc = { colorAttachments: [{ view:texView, loadOp:'clear', clearValue:{r:0.01,g:0.02,b:0.03,a:1.0}, storeOp:'store' }]};
        const passEnc = cmdEncoder.beginRenderPass(passDesc);
        passEnc.setPipeline(renderPipeline);
        passEnc.setBindGroup(0, bindGroup);
        passEnc.draw(6); passEnc.end();
        device.queue.submit([cmdEncoder.finish()]);
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}
main().catch(err => { console.error(err); document.body.innerHTML = `Error: ${err.message}`; });
