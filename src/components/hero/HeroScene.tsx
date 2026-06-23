'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceTier } from '@/hooks/usePerformance';
import { features, performanceTiers } from '@/config/features.config';

function StarField({ count = 3000 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  return (
    <Points positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function HeroSphere({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const tier = usePerformanceTier();

  const particleCount = useMemo(() => {
    const base = 2000;
    return Math.floor(base * performanceTiers.particles[tier]);
  }, [tier]);

  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Slow rotation
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;

    // Mouse parallax
    if (mouse.current) {
      meshRef.current.rotation.y += mouse.current.x * 0.0003;
      meshRef.current.rotation.x += mouse.current.y * 0.0003;
    }

    // Pulse scale
    const scale = 1 + Math.sin(time * 0.8) * 0.01;
    meshRef.current.scale.setScalar(scale);

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a1a"
          wireframe={false}
          roughness={0.1}
          metalness={0.9}
          emissive="#2d2060"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.04}
          roughness={0}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbiting particles */}
      <Points ref={particlesRef} positions={particles} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#818cf8"
          size={0.02}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#6366f1"
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#06b6d4" />
    </>
  );
}

export function HeroScene({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const tier = usePerformanceTier();

  if (!features.heroSphere) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{
          antialias: performanceTiers.antialias[tier],
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, tier === 'high' ? 2 : 1]}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <StarField count={tier === 'low' ? 1000 : tier === 'medium' ? 2000 : 3000} />
        <HeroSphere mouse={mouseRef} />
      </Canvas>
    </div>
  );
}
