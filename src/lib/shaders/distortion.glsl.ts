export const distortionVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const distortionFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uDistortAmount;
  varying vec2 vUv;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    
    // Wave distortion
    float wave = sin(uv.y * 20.0 + uTime * 15.0) * 0.005 * uDistortAmount;
    uv.x += wave;

    // Split glitch jump
    float glitchTrigger = step(0.98, rand(vec2(floor(uTime * 10.0), 1.0)));
    if (glitchTrigger > 0.5) {
      float yOffset = rand(vec2(floor(uTime * 25.0), 2.0));
      if (uv.y > yOffset && uv.y < yOffset + 0.1) {
        uv.x += rand(vec2(floor(uTime * 5.0), 3.0)) * 0.05 * uDistortAmount;
      }
    }

    // Chromatic aberration split (Red / Blue offset)
    vec4 cr = texture2D(tDiffuse, uv + vec2(0.002 * uDistortAmount, 0.0));
    vec4 cg = texture2D(tDiffuse, uv);
    vec4 cb = texture2D(tDiffuse, uv - vec2(0.002 * uDistortAmount, 0.0));

    gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
  }
`;
