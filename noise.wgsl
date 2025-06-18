// WGSL Noise Library
// Implements Perlin Noise (2D and 3D) and Fractional Brownian Motion (fBm).

// --- Helper Functions ---

// Quintic interpolation function (smoother than fade(t) = 6t^5 - 15t^4 + 10t^3)
// t should be in [0, 1]
fn fade(t: f32) -> f32 {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Linear interpolation
fn lerp(a: f32, b: f32, t: f32) -> f32 {
    return a + t * (b - a);
}

// --- 2D Perlin Noise ---

// Hash function to pseudo-randomly permute input coordinates.
// Output is a vec2<f32> in the range [0, 1)
// Based on implementations that use fractional parts of dot products.
fn hash2D(p: vec2<f32>) -> vec2<f32> {
    let k1 = vec2<f32>(12.9898, 78.233);
    let k2 = vec2<f32>(26.7, 63.2);
    var p_mut = p; // Make p mutable
    p_mut = vec2<f32>(dot(p_mut, k1), dot(p_mut, k2));
    return fract(sin(p_mut) * 43758.5453); // Common large number for pseudo-randomness
}

// Gradient function for 2D Perlin noise.
// Takes a hashed value (from hash2D, effectively a random direction index)
// and a position vector `p_fract` (fractional part of original coords).
// Returns the dot product of a gradient vector and `p_fract`.
fn grad2D(hash_val: vec2<f32>, p_fract: vec2<f32>) -> f32 {
    // Convert hash_val to an angle (0 to 2*PI)
    let angle = hash_val.x * 2.0 * 3.1415926535; // Using PI approximation
    let gradient = vec2<f32>(cos(angle), sin(angle));
    return dot(gradient, p_fract);
}

// 2D Perlin Noise function
// Input p: vec2<f32> - point at which to evaluate noise
// Output: f32 - noise value, approximately in range [-1, 1] (though classic Perlin can exceed this slightly)
fn perlinNoise2D(p: vec2<f32>) -> f32 {
    let p_floor = floor(p); // Integer part of p
    let p_fract = fract(p); // Fractional part of p

    // Get hash values for the four grid corners
    let h00 = hash2D(p_floor + vec2<f32>(0.0, 0.0)); // Bottom-left
    let h10 = hash2D(p_floor + vec2<f32>(1.0, 0.0)); // Bottom-right
    let h01 = hash2D(p_floor + vec2<f32>(0.0, 1.0)); // Top-left
    let h11 = hash2D(p_floor + vec2<f32>(1.0, 1.0)); // Top-right

    // Calculate gradient contributions from each corner
    // Vectors from corners to the point p_fract:
    // g00: p_fract - (0,0) = p_fract
    // g10: p_fract - (1,0)
    // g01: p_fract - (0,1)
    // g11: p_fract - (1,1)
    let n00 = grad2D(h00, p_fract - vec2<f32>(0.0, 0.0));
    let n10 = grad2D(h10, p_fract - vec2<f32>(1.0, 0.0));
    let n01 = grad2D(h01, p_fract - vec2<f32>(0.0, 1.0));
    let n11 = grad2D(h11, p_fract - vec2<f32>(1.0, 1.0));

    // Apply fade function to the fractional parts (for smooth interpolation)
    let u = fade(p_fract.x);
    let v = fade(p_fract.y);

    // Interpolate along x-axis
    let nx0 = lerp(n00, n10, u);
    let nx1 = lerp(n01, n11, u);

    // Interpolate along y-axis
    let nxy = lerp(nx0, nx1, v);

    // The result is typically in [-sqrt(N)/2, sqrt(N)/2] where N is dimensions.
    // For 2D, this is [-sqrt(2)/2, sqrt(2)/2] approx [-0.707, 0.707].
    // Some implementations multiply by a factor (e.g., 2.0) to bring it closer to [-1, 1].
    // Let's scale it slightly to get a bit closer to the [-1,1] range.
    // A common scaling factor is around 1.0 to 1.414 for 2D.
    // We will return the raw value, often around [-0.7, 0.7].
    // If a strict [-1,1] is needed, the user should scale it.
    return nxy;
}

// --- 3D Perlin Noise ---

// Hash function for 3D. Output is vec3<f32> in [0,1)^3
fn hash3D(p: vec3<f32>) -> vec3<f32> {
    // Using a common hashing technique for 3D noise
    var p_mut = vec3<f32>(dot(p, vec3<f32>(127.1, 311.7, 74.7)),
                          dot(p, vec3<f32>(269.5, 183.3, 246.1)),
                          dot(p, vec3<f32>(113.5, 271.9, 124.6)));
    return fract(sin(p_mut) * 43758.5453123);
}


// Gradient function for 3D Perlin noise.
// Uses 12 standard gradient vectors (edges of a cube centered at origin, plus midpoints of faces).
// This is a common approach for 3D Perlin noise.
fn grad3D(hash_val: vec3<f32>, p_fract: vec3<f32>) -> f32 {
    // Select one of 12 gradient vectors based on hash_val.
    // A simple way to pick: use integer part of hash_val components.
    // Or, more commonly, use a permutation table lookup for gradients.
    // For simplicity here, we'll derive from hash.
    // This is not a standard Perlin gradient selection, but a simpler one for this example.
    // A more robust method would involve a permutation table and pre-defined gradient vectors.

    // Let's use a simpler set of gradients for this example, derived from hash components.
    // This is more like a "value noise" gradient.
    // For true Perlin, one would typically use a set like:
    // (1,1,0),(-1,1,0),(1,-1,0),(-1,-1,0),
    // (1,0,1),(-1,0,1),(1,0,-1),(-1,0,-1),
    // (0,1,1),(0,-1,1),(0,1,-1),(0,-1,-1)
    // And select one based on a hash value.

    // For this implementation, let's use the hash directly as a direction vector (normalized).
    // This is more akin to Simplex noise style gradients but without the simplex grid.
    let gradient_unnormalized = (hash_val * 2.0) - 1.0; // Map [0,1] to [-1,1]
    let gradient = normalize(gradient_unnormalized);
    // Check for zero vector from normalize if hash_val was (0.5, 0.5, 0.5) -> (0,0,0)
    if (length(gradient) < 0.0001) {
        return dot(vec3<f32>(1.0, 0.0, 0.0), p_fract); // Default to a fixed gradient
    }
    return dot(gradient, p_fract);
}

// 3D Perlin Noise function
// Input p: vec3<f32> - point at which to evaluate noise
// Output: f32 - noise value, approximately in range [-1, 1] (classic 3D Perlin is closer to [-0.866, 0.866])
fn perlinNoise3D(p: vec3<f32>) -> f32 {
    let p_floor = floor(p); // Integer part
    let p_fract = fract(p); // Fractional part

    // Hashes for the 8 cube corners
    let h000 = hash3D(p_floor + vec3<f32>(0.0, 0.0, 0.0));
    let h100 = hash3D(p_floor + vec3<f32>(1.0, 0.0, 0.0));
    let h010 = hash3D(p_floor + vec3<f32>(0.0, 1.0, 0.0));
    let h110 = hash3D(p_floor + vec3<f32>(1.0, 1.0, 0.0));
    let h001 = hash3D(p_floor + vec3<f32>(0.0, 0.0, 1.0));
    let h101 = hash3D(p_floor + vec3<f32>(1.0, 0.0, 1.0));
    let h011 = hash3D(p_floor + vec3<f32>(0.0, 1.0, 1.0));
    let h111 = hash3D(p_floor + vec3<f32>(1.0, 1.0, 1.0));

    // Gradient contributions
    let n000 = grad3D(h000, p_fract - vec3<f32>(0.0, 0.0, 0.0));
    let n100 = grad3D(h100, p_fract - vec3<f32>(1.0, 0.0, 0.0));
    let n010 = grad3D(h010, p_fract - vec3<f32>(0.0, 1.0, 0.0));
    let n110 = grad3D(h110, p_fract - vec3<f32>(1.0, 1.0, 0.0));
    let n001 = grad3D(h001, p_fract - vec3<f32>(0.0, 0.0, 1.0));
    let n101 = grad3D(h101, p_fract - vec3<f32>(1.0, 0.0, 1.0));
    let n011 = grad3D(h011, p_fract - vec3<f32>(0.0, 1.0, 1.0));
    let n111 = grad3D(h111, p_fract - vec3<f32>(1.0, 1.0, 1.0));

    // Interpolation weights
    let u = fade(p_fract.x);
    let v = fade(p_fract.y);
    let w = fade(p_fract.z);

    // Interpolate along x
    let nx00 = lerp(n000, n100, u);
    let nx10 = lerp(n010, n110, u);
    let nx01 = lerp(n001, n101, u);
    let nx11 = lerp(n011, n111, u);

    // Interpolate along y
    let nxy0 = lerp(nx00, nx10, v);
    let nxy1 = lerp(nx01, nx11, v);

    // Interpolate along z
    let nxyz = lerp(nxy0, nxy1, w);

    // Output is typically in [-sqrt(3)/2, sqrt(3)/2] approx [-0.866, 0.866].
    // No scaling applied here by default.
    return nxyz;
}


// --- Fractional Brownian Motion (fBm) ---
// Sums multiple octaves of noise for a more detailed, fractal appearance.

// fBm 2D
// p: point
// octaves: number of noise layers to sum
// persistence: amplitude multiplier for each subsequent octave (typically ~0.5)
// lacunarity: frequency multiplier for each subsequent octave (typically ~2.0)
// Output range depends on octaves and persistence. If Perlin is [-1,1],
// max possible sum is sum(persistence^i) for i=0 to octaves-1.
// E.g. 4 octaves, persistence 0.5: 1 + 0.5 + 0.25 + 0.125 = 1.875. So range can be [-1.875, 1.875].
// Often normalized or mapped to [0,1] by the caller.
fn fBm2D(p: vec2<f32>, octaves: u32, persistence: f32, lacunarity: f32) -> f32 {
    var total: f32 = 0.0;
    var frequency: f32 = 1.0;
    var amplitude: f32 = 1.0;
    var maxValue: f32 = 0.0; // Used for normalizing to approx [0,1] if desired, but Perlin is already ~[-1,1]

    for (var i: u32 = 0u; i < octaves; i = i + 1u) {
        total += perlinNoise2D(p * frequency) * amplitude;
        maxValue += amplitude; // Accumulate max possible amplitude if noise was [0,1]
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    // If perlinNoise2D output is in [-1, 1], then total is roughly in [-maxValue, maxValue].
    // To map to [0, 1] (common for textures): (total / maxValue) * 0.5 + 0.5;
    // For now, returning the raw sum.
    return total;
}

// fBm 3D
// Parameters and output range considerations similar to fBm2D.
fn fBm3D(p: vec3<f32>, octaves: u32, persistence: f32, lacunarity: f32) -> f32 {
    var total: f32 = 0.0;
    var frequency: f32 = 1.0;
    var amplitude: f32 = 1.0;
    var maxValue: f32 = 0.0;

    for (var i: u32 = 0u; i < octaves; i = i + 1u) {
        total += perlinNoise3D(p * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    // Raw sum, typically in [-maxValue, maxValue] if perlinNoise3D is [-1,1].
    return total;
}

// Example of how one might use fBm to generate a value for texturing, mapped to [0,1]
// fn normalized_fBm3D(p: vec3<f32>, octaves: u32, persistence: f32, lacunarity: f32) -> f32 {
//     var total: f32 = 0.0;
//     var frequency: f32 = 1.0;
//     var amplitude: f32 = 1.0;
//     var maxValue: f32 = 0.0; // This is to normalize the result to a [0,1] range
//
//     for (var i: u32 = 0u; i < octaves; i = i + 1u) {
//         // Assuming perlinNoise3D returns in [-1, 1]. We map it to [0, 1] for this summation.
//         total += (perlinNoise3D(p * frequency) * 0.5 + 0.5) * amplitude;
//         maxValue += amplitude;
//         amplitude *= persistence;
//         frequency *= lacunarity;
//     }
//
//     if (maxValue == 0.0) { return 0.0; } // Avoid division by zero
//     return total / maxValue; // Normalize to [0,1]
// }
