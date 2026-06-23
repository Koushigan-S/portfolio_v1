export const scanlineVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const scanlineFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uScanlineDensity;
  uniform float uScanlineOpacity;
  uniform float uGridOpacity;
  varying vec2 vUv;

  void main() {
    vec4 baseColor = texture2D(tDiffuse, vUv);

    // Apply CRT horizontal scanline overlay
    float scanline = sin(vUv.y * uScanlineDensity + uTime * 5.0) * 0.5 + 0.5;
    vec3 resultColor = mix(baseColor.rgb, baseColor.rgb * scanline, uScanlineOpacity);

    // Apply optional vertical grid lines for terminal look
    float grid = sin(vUv.x * uScanlineDensity * 1.5) * 0.5 + 0.5;
    resultColor = mix(resultColor, resultColor * grid, uGridOpacity);

    gl_FragColor = vec4(resultColor, baseColor.a);
  }
`;
