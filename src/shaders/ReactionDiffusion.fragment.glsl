uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uFeed;
uniform float uKill;
uniform float uDt;
uniform vec3 uColor;

varying vec2 vUv;

// Laplacian 3x3 kernel
vec2 laplacian(vec2 uv) {
    float dx = 1.0 / uResolution.x;
    float dy = 1.0 / uResolution.y;
    
    vec2 sum = vec2(0.0);
    
    // Center
    sum += texture2D(uTexture, uv).rg * -1.0;
    
    // Neighbors
    sum += texture2D(uTexture, uv + vec2(dx, 0.0)).rg * 0.2;
    sum += texture2D(uTexture, uv + vec2(-dx, 0.0)).rg * 0.2;
    sum += texture2D(uTexture, uv + vec2(0.0, dy)).rg * 0.2;
    sum += texture2D(uTexture, uv + vec2(0.0, -dy)).rg * 0.2;
    
    // Diagonals
    sum += texture2D(uTexture, uv + vec2(dx, dy)).rg * 0.05;
    sum += texture2D(uTexture, uv + vec2(-dx, dy)).rg * 0.05;
    sum += texture2D(uTexture, uv + vec2(dx, -dy)).rg * 0.05;
    sum += texture2D(uTexture, uv + vec2(-dx, -dy)).rg * 0.05;
    
    return sum;
}

void main() {
    // Current state
    vec2 uv = vUv;
    vec2 val = texture2D(uTexture, uv).rg;
    
    // Laplacian
    vec2 lap = laplacian(uv);
    
    // Gray-Scott formulas
    // A' = A + (Da * lapA - A*B*B + f * (1-A)) * dt
    // B' = B + (Db * lapB + A*B*B - (k+f) * B) * dt
    
    float da = 1.0;
    float db = 0.5;
    float feed = uFeed;
    float kill = uKill;
    
    float a = val.r;
    float b = val.g;
    
    float newA = a + (da * lap.x - a * b * b + feed * (1.0 - a)) * uDt;
    float newB = b + (db * lap.y + a * b * b - (kill + feed) * b) * uDt;
    
    gl_FragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
}
