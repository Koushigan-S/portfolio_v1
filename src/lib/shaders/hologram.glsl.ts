export const hologramVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    // Add dynamic distortion wave based on time
    vec3 pos = position;
    float wave = sin(pos.y * 10.0 + uTime * 5.0) * 0.02;
    pos.x += wave;
    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const hologramFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uFlickerSpeed;

  // Simple pseudo-random hash
  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    // Hologram base color
    vec3 color = uColor;

    // 1. Scanlines
    float scanline = sin(vPosition.y * 50.0 - uTime * 10.0) * 0.5 + 0.5;
    
    // 2. Hologram noise flicker
    float noise = hash(floor(uTime * uFlickerSpeed));
    float flicker = noise > 0.95 ? 0.3 : 1.0;

    // 3. Fresnel / Edge Glow
    float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    float glow = pow(intensity, 3.0);

    // 4. Alpha transparency masking
    float alpha = (scanline * 0.4 + glow * 0.6) * flicker;

    gl_FragColor = vec4(color + vec3(glow * 0.5), alpha);
  }
`;
