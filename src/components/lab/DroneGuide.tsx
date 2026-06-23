'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrone } from '@/contexts/DroneContext';
import { experienceConfig } from '@/config/experience.config';

// Coordinates of drone targets for each section chamber
const CHAMBER_TARGETS = [
  new THREE.Vector3(0, 1.2, 2.5),    // Section 0: Hero lobby (centered, hovering close)
  new THREE.Vector3(-2.8, 0.8, 0.5), // Section 1: About identity (to the left of display)
  new THREE.Vector3(2.5, 1.3, -4.5), // Section 2: Tech stack (guiding right side pillars)
  new THREE.Vector3(-3.2, 0.5, -12), // Section 3: Project galaxy (hovering near planets)
  new THREE.Vector3(0, 0.5, -22),    // Section 4: Corridor portals (flying down center)
  new THREE.Vector3(-2.0, 1.2, -31), // Section 5: Vault doors (unlocking left panels)
  new THREE.Vector3(2.5, 0.6, -42),  // Section 6: Vision room starfield
  new THREE.Vector3(0, 0.2, -49),    // Section 7: Contact finale (close in front of camera)
];

export function DroneGuide() {
  const { currentSection, scrollProgress, droneMode } = useDrone();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const scannerLightRef = useRef<THREE.SpotLight>(null);

  // Position interpolation state
  const currentPos = useMemo(() => new THREE.Vector3(0, 1.2, 2.5), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 1.2, 0), []);

  useFrame((state) => {
    if (!experienceConfig.features.droneSystem || !groupRef.current) return;

    const t = state.clock.getElapsedTime();

    // 1. Interpolate target position based on scroll transitions between chambers
    const currentTargetIndex = Math.min(CHAMBER_TARGETS.length - 1, currentSection);
    const nextTargetIndex = Math.min(CHAMBER_TARGETS.length - 1, currentSection + 1);
    
    const targetA = CHAMBER_TARGETS[currentTargetIndex];
    const targetB = CHAMBER_TARGETS[nextTargetIndex];
    
    const interpolatedTarget = new THREE.Vector3().lerpVectors(targetA, targetB, scrollProgress);

    // Apply procedural hover noise (Perlin-like hover wobble)
    const hoverY = sinNoise(t * 1.5) * 0.12;
    const hoverX = cosNoise(t * 1.2) * 0.08;
    const hoverZ = sinNoise(t * 0.9) * 0.08;

    interpolatedTarget.y += hoverY;
    interpolatedTarget.x += hoverX;
    interpolatedTarget.z += hoverZ;

    // Smooth ease toward interpolated position
    currentPos.lerp(interpolatedTarget, 0.07);
    groupRef.current.position.copy(currentPos);

    // 2. Drone Rotation / LookAt Behavior
    const cameraPos = state.camera.position;
    let targetLook = new THREE.Vector3();

    if (currentSection === 7) {
      // In the contact chamber, drone turns directly toward the user camera
      targetLook.copy(cameraPos);
    } else {
      // Look slightly ahead of its movement direction
      targetLook.copy(interpolatedTarget).add(new THREE.Vector3(0, 0, -2));
    }

    currentLookAt.lerp(targetLook, 0.05);
    groupRef.current.lookAt(currentLookAt);

    // 3. Sub-mesh rotation (mechanical spin)
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 2.0;
      coreRef.current.rotation.z = t * 1.0;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 1.5;
      ringRef1.current.rotation.y = t * 0.5;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = -t * 1.8;
      ringRef2.current.rotation.z = t * 0.8;
    }
  });

  // Helper noises
  const sinNoise = (val: number) => Math.sin(val) * Math.cos(val * 0.7);
  const cosNoise = (val: number) => Math.cos(val) * Math.sin(val * 1.3);

  return (
    <group ref={groupRef}>
      {/* Volumetric scanner beam cone */}
      <spotLight
        ref={scannerLightRef}
        color="#60a5fa"
        intensity={8.0}
        distance={12}
        angle={Math.PI / 6}
        penumbra={0.6}
        castShadow
        position={[0, 0, 0]}
      />

      {/* Volumetric cone mesh helper */}
      <mesh position={[0, 0, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 1.2, 3.6, 16, 1, true]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thruster Bottom Glow */}
      <pointLight color="#3b82f6" intensity={15} distance={3} position={[0, -0.4, 0]} />

      {/* Main Core (Octahedron style floating brain) */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial
          color="#16161d"
          roughness={0.1}
          metalness={0.9}
          emissive="#3b82f6"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Core lights/lenses */}
      <mesh position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Orbiting Gyro Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[0.38, 0.02, 8, 32]} />
        <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Orbiting Gyro Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[0.44, 0.015, 8, 32]} />
        <meshStandardMaterial
          color="#1d4ed8"
          metalness={0.9}
          roughness={0.2}
          emissive="#2563eb"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Drone Small Solar Wings/Antennae */}
      <group position={[0, 0, 0]}>
        {/* Left Antenna */}
        <mesh position={[-0.48, 0.05, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.25, 0.02, 0.08]} />
          <meshStandardMaterial color="#0d0d12" metalness={0.8} />
        </mesh>
        {/* Right Antenna */}
        <mesh position={[0.48, 0.05, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.25, 0.02, 0.08]} />
          <meshStandardMaterial color="#0d0d12" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
