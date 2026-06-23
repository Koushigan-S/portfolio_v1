'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { techStack } from '@/config/skills.config';
import { useDrone } from '@/contexts/DroneContext';
import { experienceConfig } from '@/config/experience.config';
import { GlitchText } from '../hero/GlitchText';
import dynamic from 'next/dynamic';

function TechNode({
  position,
  label,
  color,
  isHovered,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isHovered ? 1.4 : 1;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 2.0 : 0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <Billboard>
        <Text
          fontSize={0.13}
          color={isHovered ? '#ffffff' : '#a0a0b0'}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgpw53lhZyv42Q9g.woff" // JetBrains Mono font file url
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.28, 0]}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function TechScene({ 
  selectedCategory, 
  hoveredItem,
  shouldReduceMotion,
}: { 
  selectedCategory: string; 
  hoveredItem: string | null;
  shouldReduceMotion: boolean;
}) {
  const category = techStack.find((c) => c.name === selectedCategory) ?? techStack[0];
  const items = category.items.map((i) => i.name);
  const groupRef = useRef<THREE.Group>(null);
  const pillarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = shouldReduceMotion ? 0 : t * 0.18;
    }
    if (pillarRef.current) {
      pillarRef.current.rotation.y = shouldReduceMotion ? 0 : -t * 0.1;
    }
  });

  const positions = useMemo<[number, number, number][]>(() => {
    const radius = 2.2;
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        Math.sin(angle * 2.0) * 0.15, // Wave offset vertical
        Math.sin(angle) * radius,
      ];
    });
  }, [items]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 1, 0]} intensity={6.0} distance={10} color={category.color} />
      <directionalLight position={[2, 4, 3]} intensity={0.4} color="#ffffff" />
      
      {/* Central Futuristic Tech Pillar */}
      <mesh ref={pillarRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 2.2, 16]} />
        <meshStandardMaterial
          color="#0d0d12"
          roughness={0.1}
          metalness={0.9}
          emissive={category.color}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Orbiting ring lines */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.006, 8, 64]} />
        <meshStandardMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      <group ref={groupRef}>
        {items.map((item, i) => (
          <TechNode
            key={item}
            position={positions[i]}
            label={item}
            color={category.color}
            isHovered={hoveredItem === item}
          />
        ))}
      </group>
    </>
  );
}

function TechOrbitCanvas({ 
  selectedCategory, 
  hoveredItem,
  shouldReduceMotion,
}: { 
  selectedCategory: string; 
  hoveredItem: string | null;
  shouldReduceMotion: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5.0], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <TechScene 
        selectedCategory={selectedCategory} 
        hoveredItem={hoveredItem} 
        shouldReduceMotion={shouldReduceMotion}
      />
    </Canvas>
  );
}

const TechOrbitCanvasDynamic = dynamic(
  () => Promise.resolve(TechOrbitCanvas),
  { ssr: false }
);

export function TechOrbit() {
  const { deviceTier } = useDrone();
  const [selectedCategory, setSelectedCategory] = useState(techStack[0].name);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const activeCategory = techStack.find((c) => c.name === selectedCategory) ?? techStack[0];

  return (
    <section id="tech-stack" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Tech Stack Chamber">
      <div className="container relative z-10">
        
        {/* Chamber Header */}
        <motion.div
          className="text-center mb-16"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_02 // ARSENAL</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="TECH STACK CHAMBER" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            Interact with the central database core array to scan languages, frameworks, and engine details.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: 3D Holographic Chamber (Render 2D lists on low tier) */}
          <motion.div
            className="h-[380px] md:h-[480px] relative rounded-2xl border border-blue-500/10 bg-black/40 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* HUD decoration grids */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-blue-400/40 pointer-events-none">
              GRID: {selectedCategory.toUpperCase()}_PILLAR_CORE
            </div>

            {deviceTier !== 'low' ? (
              <TechOrbitCanvasDynamic
                selectedCategory={selectedCategory}
                hoveredItem={hoveredItem}
                shouldReduceMotion={shouldReduceMotion}
              />
            ) : (
              // High Quality 2D Alternative representation for low-end / mobile
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-blue-950/10 to-transparent">
                <div 
                  className={shouldReduceMotion ? "w-24 h-24 rounded-full flex items-center justify-center border mb-6" : "w-24 h-24 rounded-full flex items-center justify-center border animate-spin-slow mb-6"}
                  style={{ borderColor: activeCategory.color, boxShadow: `0 0 20px ${activeCategory.color}25` }}
                >
                  <span className="text-3xl text-white">{activeCategory.icon}</span>
                </div>
                <h3 className="font-mono text-lg text-white mb-2">{activeCategory.name} Core Activated</h3>
                <p className="font-mono text-[10px] text-[#a0a0b0]">
                  Scanning {activeCategory.items.length} technology nodes...
                </p>
              </div>
            )}
          </motion.div>

          {/* Right: Interactive selector tabs & items */}
          <div className="flex flex-col gap-6">
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="px-4 py-2 rounded font-mono text-[11px] tracking-wider transition-all duration-300 border bg-[#0d0d12]/60 hover:bg-[#16161d] focus-visible:ring-2 focus-visible:ring-blue-500"
                  style={{
                    borderColor: selectedCategory === cat.name ? cat.color : 'rgba(255, 255, 255, 0.05)',
                    color: selectedCategory === cat.name ? cat.color : '#a0a0b0',
                    boxShadow: selectedCategory === cat.name ? `0 0 12px ${cat.color}20` : 'none',
                  }}
                  data-cursor-magnetic
                >
                  {cat.icon} {cat.name.toUpperCase()}
                </button>
              ))}
            </div>

            <hr className="border-white/5 my-2" />

            {/* List of items in selected category */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className="flex flex-wrap gap-3"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                {activeCategory.items.map((item) => (
                  <motion.div
                    key={item.name}
                    className="px-4.5 py-3 rounded-full font-mono text-xs cursor-default border transition-all duration-300 bg-black/30 flex items-center justify-center text-center leading-none min-h-[38px]"
                    style={{
                      borderColor: hoveredItem === item.name ? activeCategory.color : 'rgba(255,255,255,0.03)',
                      color: hoveredItem === item.name ? activeCategory.color : '#a0a0b0',
                      boxShadow: hoveredItem === item.name ? `0 0 10px ${activeCategory.color}15` : 'none',
                    }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    // {item.name}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
