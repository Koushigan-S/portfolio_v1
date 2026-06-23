'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LaserGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      // Scale coordinates for grid density
      vec2 coord = vWorldPosition.xz * 0.4;
      
      // Calculate grid line intensites
      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      float line = min(grid.x, grid.y);
      float lineIntensity = 1.0 - min(line, 1.0);

      // Add a sweeping laser line across the grid
      float sweep = sin(vWorldPosition.z * 0.05 - uTime * 2.0) * 0.5 + 0.5;
      sweep = pow(sweep, 25.0); // Make it a thin, sharp line

      // Fade grid as it gets further from center (0,0) to prevent aliasing
      float dist = length(vWorldPosition.xz);
      float fade = exp(-dist * 0.04);

      // Mix grid line and sweep intensity
      float finalIntensity = (lineIntensity * 0.25 + sweep * 0.45) * fade;

      // Color is electric blue mixed with extra white glow in the sweeps
      vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), sweep * 0.5);

      gl_FragColor = vec4(finalColor, finalIntensity);
    }
  `;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#3b82f6') },
        }}
      />
    </mesh>
  );
}
