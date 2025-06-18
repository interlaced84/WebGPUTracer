// raymarcher.wgsl - Volumetric cloud raymarcher with lighting and self-shadowing

// --- Structs ---
struct Ray {
    origin: vec3<f32>,
    direction: vec3<f32>,
}

struct Uniforms {
    camera_pos: vec3<f32>,
    _padding1: f32,                     // Offset 0, size 16

    inv_proj_matrix: mat4x4<f32>,       // Offset 16, size 64
    inv_view_matrix: mat4x4<f32>,       // Offset 80, size 64

    viewport_size: vec2<f32>,
    _padding2: vec2<f32>,               // Offset 144, size 16

    cloud_bounds_min: vec3<f32>,
    _padding3: f32,                     // Offset 160, size 16
    cloud_bounds_max: vec3<f32>,
    _padding4: f32,                     // Offset 176, size 16

    // Raymarching & Base Noise parameters
    max_steps: u32,                     // Offset 192
    step_size: f32,                     // Offset 196
    time: f32,                          // Offset 200
    noise_scale: f32,                   // Offset 204 (Primary detail noise scale)
                                        // Block ends at 208

    fbm_octaves: u32,                   // Offset 208 (For primary detail noise)
    fbm_persistence: f32,               // Offset 212
    fbm_lacunarity: f32,                // Offset 216
    base_density_threshold_min: f32,    // Offset 220 (Remapping base_noise)
                                        // Block ends at 224

    base_density_threshold_max: f32,    // Offset 224
    density_multiplier: f32,            // Offset 228
    absorption_coefficient: f32,        // Offset 232
    scattering_coefficient: f32,        // Offset 236
                                        // Block ends at 240

    henyey_g: f32,                      // Offset 240
    coverage_noise_scale: f32,          // Offset 244
    coverage_fbm_octaves: u32,          // Offset 248
    coverage_fbm_persistence: f32,      // Offset 252
                                        // Block ends at 256

    coverage_fbm_lacunarity: f32,       // Offset 256
    coverage_threshold: f32,            // Offset 260
    cloud_base_height: f32,             // Offset 264
    cloud_top_height: f32,              // Offset 268
                                        // Block ends at 272

    height_density_falloff: f32,        // Offset 272
    // Shadow parameters
    shadow_max_steps: u32,              // Offset 276
    shadow_step_size: f32,              // Offset 280
    shadow_absorption_coefficient: f32, // Offset 284
                                        // Block ends at 288.

    // Lighting
    light_dir: vec3<f32>,               // Offset 288
    _padding6: f32,                     // For alignment
                                        // Block ends at 304
    light_color: vec3<f32>,             // Offset 304
    _padding7: f32,                     // For alignment
                                        // Block ends at 320
    ambient_light_color: vec3<f32>,     // Offset 320
    _padding8: f32,                     // For alignment
                                        // Block ends at 336
} // Total size: 336 bytes (as before, shadow params fit into previous padding)


// --- Uniforms Binding ---
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// --- Noise Function Placeholder ---
// Content of noise.wgsl (including perlinNoise3D, fBm3D, hash functions, fade, lerp)
// is expected to be prepended here by the JavaScript runner.


// --- Ray Generation ---
fn get_ray_dir_ndc(ndc_xy: vec2<f32>) -> vec3<f32> {
    let near_plane_ndc = vec4<f32>(ndc_xy.x, ndc_xy.y, 0.0, 1.0);
    var p_view = uniforms.inv_proj_matrix * near_plane_ndc;
    p_view = p_view / p_view.w;
    let p_world_near = uniforms.inv_view_matrix * vec4<f32>(p_view.xyz, 1.0);
    let ray_dir_world = p_world_near.xyz - uniforms.camera_pos;
    return normalize(ray_dir_world);
}

// --- AABB Intersection ---
fn intersect_aabb(ray_origin: vec3<f32>, ray_dir: vec3<f32>, box_min: vec3<f32>, box_max: vec3<f32>) -> vec2<f32> {
    let inv_dir = 1.0 / ray_dir;
    let t1 = (box_min - ray_origin) * inv_dir;
    let t2 = (box_max - ray_origin) * inv_dir;
    let t_min_vec = min(t1, t2);
    let t_max_vec = max(t1, t2);
    var t_enter = max(t_min_vec.x, max(t_min_vec.y, t_min_vec.z));
    var t_exit = min(t_max_vec.x, min(t_max_vec.y, t_max_vec.z));
    if (t_enter > t_exit || t_exit < 0.0) {
        return vec2<f32>(1.0, 0.0);
    }
    t_enter = max(t_enter, 0.0);
    return vec2<f32>(t_enter, t_exit);
}

// --- Density Function ---
fn sample_density(world_pos: vec3<f32>) -> f32 {
    let coverage_coord = world_pos * uniforms.coverage_noise_scale;
    var coverage_noise_raw = fBm3D(coverage_coord, uniforms.coverage_fbm_octaves, uniforms.coverage_fbm_persistence, uniforms.coverage_fbm_lacunarity);
    coverage_noise_raw = (coverage_noise_raw / 1.505) * 0.5 + 0.5;

    let coverage_factor = smoothstep(uniforms.coverage_threshold - 0.1, uniforms.coverage_threshold + 0.1, coverage_noise_raw);
    if (coverage_factor < 0.01) { return 0.0; }

    let base_noise_coord = world_pos * uniforms.noise_scale + vec3<f32>(uniforms.time * 0.03, uniforms.time * 0.01, uniforms.time * 0.005);
    var base_noise_raw = fBm3D(base_noise_coord, uniforms.fbm_octaves, uniforms.fbm_persistence, uniforms.fbm_lacunarity);
    let remapped_base_noise = smoothstep(uniforms.base_density_threshold_min, uniforms.base_density_threshold_max, base_noise_raw);

    let height_factor_bottom = smoothstep(uniforms.cloud_base_height, uniforms.cloud_base_height + uniforms.height_density_falloff, world_pos.y);
    let height_factor_top = 1.0 - smoothstep(uniforms.cloud_top_height - uniforms.height_density_falloff, uniforms.cloud_top_height, world_pos.y);
    let height_mask = height_factor_bottom * height_factor_top;
    if (height_mask < 0.01) { return 0.0; }

    let shaped_density = remapped_base_noise * height_mask * coverage_factor;
    return clamp(shaped_density, 0.0, 1.0);
}

// --- Henyey-Greenstein Phase Function ---
const PI: f32 = 3.1415926535;
fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {
    let g2 = g * g;
    let term_denominator_sq = 1.0 + g2 - 2.0 * g * cos_theta;
    if (term_denominator_sq <= 0.00001) { return (1.0 - g2) / ( (4.0 * PI) * pow(0.0001, 1.5) ) ; }
    return (1.0 - g2) / ( (4.0 * PI) * term_denominator_sq * sqrt(term_denominator_sq) );
}

// --- Shadow Transmittance Function ---
fn get_shadow_transmittance(current_ray_pos: vec3<f32>, normalized_light_dir: vec3<f32>) -> f32 {
    var S_transmittance: f32 = 1.0;
    // Start shadow ray slightly offset from the current point to avoid self-intersection artifacts
    let shadow_ray_start_offset = normalized_light_dir * uniforms.step_size * 0.5; // Or a small fixed value
    var shadow_sample_pos = current_ray_pos + shadow_ray_start_offset;

    for (var i: u32 = 0u; i < uniforms.shadow_max_steps; i = i + 1u) {
        // AABB Check for shadow ray (check if current sample point is within cloud bounds)
        // This uses the main cloud AABB. More advanced techniques might use a tighter bound or no bound if clouds are global.
        let in_bounds_min = shadow_sample_pos >= uniforms.cloud_bounds_min;
        let in_bounds_max = shadow_sample_pos <= uniforms.cloud_bounds_max;
        if (!all(in_bounds_min) || !all(in_bounds_max)) {
            // If shadow ray exits the main cloud AABB, assume it's fully lit from that point onwards towards the light source
            break;
        }

        let density_along_shadow_ray = sample_density(shadow_sample_pos);
        let effective_shadow_density = max(0.0, density_along_shadow_ray * uniforms.density_multiplier);

        if (effective_shadow_density > 0.01) {
            S_transmittance *= exp(-effective_shadow_density * uniforms.shadow_absorption_coefficient * uniforms.shadow_step_size);
            if (S_transmittance < 0.01) {
                S_transmittance = 0.0; // Fully occluded
                break;
            }
        }
        shadow_sample_pos = shadow_sample_pos + normalized_light_dir * uniforms.shadow_step_size;
    }
    return S_transmittance;
}


// --- Main Fragment Shader ---
@fragment
fn main(@builtin(position) frag_coord: vec4<f32>) -> @location(0) vec4<f32> {
    let ndc = ( (frag_coord.xy / uniforms.viewport_size) * 2.0 - 1.0 ) * vec2<f32>(1.0, -1.0);

    let ray_origin_world = uniforms.camera_pos;
    let ray_dir_world = get_ray_dir_ndc(ndc);

    let intersection = intersect_aabb(ray_origin_world, ray_dir_world, uniforms.cloud_bounds_min, uniforms.cloud_bounds_max);
    let t_min = intersection.x;
    let t_max = intersection.y;

    let background_color_rgb = vec3<f32>(0.1, 0.15, 0.3);

    if (t_min >= t_max) {
        return vec4<f32>(background_color_rgb, 1.0);
    }

    var accumulated_color = vec3<f32>(0.0);
    var transmittance = 1.0;

    let max_march_distance = min(t_max, t_min + (f32(uniforms.max_steps) * uniforms.step_size));
    var current_t = t_min + uniforms.step_size * hash3D(ray_dir_world + vec3<f32>(uniforms.time, uniforms.time * 1.3, uniforms.time * 1.7)).x;

    for (var i: u32 = 0u; i < uniforms.max_steps; i = i + 1u) {
        if (current_t >= max_march_distance) {
            break;
        }

        let current_pos = ray_origin_world + ray_dir_world * current_t;
        let raw_density = sample_density(current_pos);
        let effective_density = max(0.0, raw_density * uniforms.density_multiplier);

        if (effective_density > 0.01) {
            let segment_transmittance = exp(-effective_density * uniforms.absorption_coefficient * uniforms.step_size);

            // Get shadow transmittance from this point towards the light source
            let S_sun = get_shadow_transmittance(current_pos, uniforms.light_dir); // light_dir must be normalized

            if (S_sun > 0.01) { // Only calculate scattering if not fully in shadow
                let cos_theta = dot(uniforms.light_dir, -ray_dir_world);
                let phase_val = henyey_greenstein(cos_theta, uniforms.henyey_g);
                let direct_light_intensity_at_point = effective_density * uniforms.scattering_coefficient * phase_val * uniforms.light_color;
                accumulated_color += direct_light_intensity_at_point * S_sun * transmittance * uniforms.step_size;
            }

            transmittance *= segment_transmittance;

            if (transmittance < 0.01) {
                transmittance = 0.0; // Clamp to ensure full opacity if threshold is reached
                break;
            }
        }
        current_t += uniforms.step_size;
    }

    // Add ambient contribution to the cloud itself, modulated by how much cloud mass was encountered (1.0 - transmittance)
    let ambient_cloud_contribution = uniforms.ambient_light_color * (1.0 - transmittance); // Ambient applied to the cloud's perceived "thickness"

    let final_color = accumulated_color + ambient_cloud_contribution + background_color_rgb * transmittance;

    return vec4<f32>(final_color, 1.0);
}
