'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrone } from '@/contexts/DroneContext';

export function ParticleField() {
  const { deviceTier } = useDrone();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Determine particle count based on device tier
  const count = useMemo(() => {
    switch (deviceTier) {
      case 'high':
        return 1200;
      case 'medium':
        return 500;
      case 'low':
      default:
        return 100;
    }
  }, [deviceTier]);

  // Generate randomized positions and speeds
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread across a box
      pos[i * 3] = (Math.random() - 0.5) * 30; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40; // Z

      rand[i * 3] = Math.random();
      rand[i * 3 + 1] = Math.random();
      rand[i * 3 + 2] = Math.random();
    }
    return [pos, rand];
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const vertexShader = `
    uniform float uTime;
    attribute vec3 aRandom;
    varying vec3 vRandom;
    varying float vAlpha;

    void main() {
      vRandom = aRandom;
      vec3 pos = position;

      // Add gentle drift movement
      pos.x += sin(uTime * 0.2 + aRandom.x * 6.28) * 0.5;
      pos.y += cos(uTime * 0.15 + aRandom.y * 6.28) * 0.3;
      pos.z += sin(uTime * 0.1 + aRandom.z * 6.28) * 0.8;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Volumetric point sizing by distance
      gl_PointSize = (12.0 + aRandom.x * 12.0) * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;

      // Fade out particles that are too close to camera
      vAlpha = smoothstep(-1.0, -4.0, mvPosition.z);
    }
  `;

  const fragmentShader = `
    varying vec3 vRandom;
    varying float vAlpha;

    void main() {
      // Convert square particle to smooth circular glow
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      // Soft glow falloff
      float glow = smoothstep(0.5, 0.0, dist);
      
      // Electric blue glow with silver tint
      vec3 color = mix(vec3(0.23, 0.51, 0.96), vec3(0.9, 0.9, 0.95), vRandom.y * 0.5);

      gl_FragColor = vec4(color, glow * vAlpha * 0.45);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </points>
  );
}
