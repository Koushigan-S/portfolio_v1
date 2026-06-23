'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useDrone } from '@/contexts/DroneContext';
import { experienceConfig } from '@/config/experience.config';
import { LaserGrid } from './LaserGrid';
import { ParticleField } from './ParticleField';
import { DroneGuide } from './DroneGuide';

// Camera position targets for each section chamber
const CAMERA_TARGETS = [
  new THREE.Vector3(0, 1.2, 5.0),     // Chamber 0: Hero
  new THREE.Vector3(1.2, 1.0, 3.2),    // Chamber 1: About (shifted to side to see holographic panel)
  new THREE.Vector3(-1.8, 1.5, -2.5),  // Chamber 2: Tech stack (overview of categories)
  new THREE.Vector3(0.0, 0.0, -8.0),   // Chamber 3: Projects (focused on planet field center)
  new THREE.Vector3(0.0, 0.5, -17.5),  // Chamber 4: Timeline Corridor
  new THREE.Vector3(1.8, 1.2, -26.5),  // Chamber 5: Vault doors
  new THREE.Vector3(-1.5, 0.8, -37.0), // Chamber 6: Vision room (looking at glass wall starfield)
  new THREE.Vector3(0.0, 0.2, -45.5),  // Chamber 7: Contact exit
];

const CAMERA_LOOKATS = [
  new THREE.Vector3(0, 1.2, 0),
  new THREE.Vector3(-2.8, 0.8, 0.5),
  new THREE.Vector3(2.5, 1.3, -4.5),
  new THREE.Vector3(0, 0, -12),
  new THREE.Vector3(0, 0.5, -25),
  new THREE.Vector3(-2.0, 1.2, -31),
  new THREE.Vector3(2.5, 0.6, -42),
  new THREE.Vector3(0, 0.2, -49),
];

function CameraRig() {
  const { currentSection, scrollProgress } = useDrone();
  const currentPos = useMemo(() => new THREE.Vector3(0, 1.2, 5.0), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 1.2, 0), []);

  useFrame((state) => {
    const currentTargetIdx = Math.min(CAMERA_TARGETS.length - 1, currentSection);
    const nextTargetIdx = Math.min(CAMERA_TARGETS.length - 1, currentSection + 1);

    const posA = CAMERA_TARGETS[currentTargetIdx];
    const posB = CAMERA_TARGETS[nextTargetIdx];

    const lookA = CAMERA_LOOKATS[currentTargetIdx];
    const lookB = CAMERA_LOOKATS[nextTargetIdx];

    // Lerp positions and look-ats between the active sections
    const targetPos = new THREE.Vector3().lerpVectors(posA, posB, scrollProgress);
    const targetLook = new THREE.Vector3().lerpVectors(lookA, lookB, scrollProgress);

    currentPos.lerp(targetPos, 0.05);
    currentLookAt.lerp(targetLook, 0.05);

    state.camera.position.copy(currentPos);
    state.camera.lookAt(currentLookAt);
  });

  return null;
}

export function LabCanvas() {
  const { deviceTier, isMobile } = useDrone();

  // If low tier or WebGL is disabled, bypass canvas entirely for smooth 2D alternative styles
  if (deviceTier === 'low') {
    return (
      <div 
        className="fixed inset-0 z-[-1] bg-[#020204]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #0c1a30 0%, #020204 100%)',
          opacity: 0.8
        }}
      />
    );
  }

  // Determine post-processing based on config + device capability score
  const isPostprocessingEnabled = 
    experienceConfig.features.bloom || 
    experienceConfig.features.depthOfField || 
    experienceConfig.features.motionBlur;

  const showBloom = experienceConfig.features.bloom;
  const showDof = experienceConfig.features.depthOfField && deviceTier === 'high';
  const showChromatic = deviceTier === 'high';

  return (
    <div className="fixed inset-0 z-[-1] w-screen h-screen pointer-events-none bg-[#020204] overflow-hidden">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows={deviceTier === 'high'}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={deviceTier === 'high' ? [1, 2] : [1, 1.5]}
      >
        <color attach="background" args={['#020204']} />
        
        {/* Lights */}
        <ambientLight intensity={0.12} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.4} 
          castShadow={deviceTier === 'high'} 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Persistent Environments */}
        <LaserGrid />
        <ParticleField />
        
        {/* AI Drone Protagonist */}
        <DroneGuide />

        {/* Camera Scroll Rig */}
        <CameraRig />

        {/* Cinematic Post-Processing Composers */}
        {isPostprocessingEnabled ? (
          <EffectComposer>
            {showDof ? (
              <DepthOfField 
                focusDistance={0.012} 
                focalLength={0.02} 
                bokehScale={3.0} 
                height={480} 
              />
            ) : <></>}
            {showBloom ? (
              <Bloom 
                intensity={0.65} 
                luminanceThreshold={0.15} 
                luminanceSmoothing={0.9} 
                mipmapBlur 
              />
            ) : <></>}
            {showChromatic ? (
              <ChromaticAberration 
                offset={new THREE.Vector2(0.0012, 0.0012)} 
                radialModulation={false}
                modulationOffset={0}
              />
            ) : <></>}
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
}
