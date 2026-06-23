'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, GitBranch, ExternalLink, ChevronRight, Compass } from 'lucide-react';
import { projects, type Project } from '@/config/projects.config';
import { useDrone } from '@/contexts/DroneContext';
import { experienceConfig } from '@/config/experience.config';
import { GlitchText } from '../hero/GlitchText';
import dynamic from 'next/dynamic';

function Planet({
  project,
  orbitRadius,
  orbitSpeed,
  onClick,
  isSelected,
  shouldReduceMotion,
}: {
  project: Project;
  orbitRadius: number;
  orbitSpeed: number;
  onClick: () => void;
  isSelected: boolean;
  shouldReduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef((project.orbitAngle ?? 0) * (Math.PI / 180));
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    angleRef.current += (shouldReduceMotion ? 0.005 * orbitSpeed : orbitSpeed) * delta;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += shouldReduceMotion ? 0 : delta * 0.4;
      const targetScale = isSelected ? 1.7 : hovered ? 1.35 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const color = project.planetColor ?? '#3b82f6';

  return (
    <group ref={groupRef}>
      {/* Interactive Planet Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[project.planetSize ? project.planetSize * 0.75 : 0.6, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.0 : hovered ? 0.6 : 0.15}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting text node */}
      <Billboard position={[0, (project.planetSize ? project.planetSize * 0.75 : 0.6) + 0.35, 0]}>
        <Text
          fontSize={0.16}
          color={hovered || isSelected ? '#ffffff' : '#a0a0b0'}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgpw53lhZyv42Q9g.woff"
          anchorX="center"
          anchorY="bottom"
        >
          {project.name}
        </Text>
      </Billboard>
    </group>
  );
}

function Sun({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = shouldReduceMotion ? 0 : state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={4.5} color="#3b82f6" distance={25} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={1.8}
          metalness={0}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function OrbitPath({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function GalaxyScene({
  selectedId,
  onSelect,
  shouldReduceMotion,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  shouldReduceMotion: boolean;
}) {
  const orbits = [3.2, 4.8, 6.2, 7.8, 9.2];
  const speeds = [0.15, 0.11, 0.08, 0.06, 0.04];

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={0.2} color="#ffffff" />
      <Sun shouldReduceMotion={shouldReduceMotion} />

      {projects.map((project, i) => (
        <group key={project.id}>
          <OrbitPath radius={orbits[i] ?? 3.5} color={project.planetColor ?? '#3b82f6'} />
          <Planet
            project={project}
            orbitRadius={orbits[i] ?? 3.5}
            orbitSpeed={speeds[i] ?? 0.05}
            onClick={() => onSelect(project.id)}
            isSelected={selectedId === project.id}
            shouldReduceMotion={shouldReduceMotion}
          />
        </group>
      ))}
    </>
  );
}

function GalaxyCanvas({ selectedId, onSelect, shouldReduceMotion }: { selectedId: string | null; onSelect: (id: string) => void; shouldReduceMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 8, 14], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <GalaxyScene selectedId={selectedId} onSelect={onSelect} shouldReduceMotion={shouldReduceMotion} />
    </Canvas>
  );
}

const GalaxyCanvasDynamic = dynamic(
  () => Promise.resolve(GalaxyCanvas),
  { ssr: false }
);

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const color = project.planetColor || '#3b82f6';

  // Lock body scroll when project modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#020204]/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Apple-style Showcase Modal */}
      <motion.div
        className="relative z-10 w-full max-w-3xl bg-[#0d0d12]/95 border border-blue-500/20 rounded-xl p-10 md:p-14 overflow-y-auto max-h-[85vh] shadow-[0_0_50px_rgba(59,130,246,0.15)]"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color }}>
              {project.category.toUpperCase()}{' // SCAN_ACTIVE'}
            </span>
            <h3 className="text-2xl font-mono font-bold text-white mt-1">
              {project.name}
            </h3>
            <p className="font-mono text-xs text-[#a0a0b0] mt-1">
              {project.tagline}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative p-3 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
            data-cursor-magnetic
            aria-label="Close modal"
          >
            <span className="absolute inset-[-8px] md:inset-0" />
            <X size={16} />
          </button>
        </div>

          <hr className="border-white/5 mb-6" />

          {/* Body Description */}
          <p className="font-mono text-xs text-[#a0a0b0] leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Features */}
          {project.features.length > 0 && (
            <div className="mb-6">
              <h4 className="font-mono text-[10px] tracking-widest text-white/50 mb-3 uppercase">
                KEY_CAPABILITIES
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-mono text-[11px] text-[#a0a0b0]">
                    <ChevronRight size={12} style={{ color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          <div className="mb-6">
            <h4 className="font-mono text-[10px] tracking-widest text-white/50 mb-3 uppercase">
              RECOGNIZED_STACK
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-white/5 text-[10px] font-mono text-white/60 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-white/5 mb-6" />

          {/* Links */}
          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white/10 hover:border-white/30 rounded text-xs font-mono text-white/80 hover:text-white flex items-center gap-2 transition-all"
                data-cursor-magnetic
              >
                <GitBranch size={12} />
                SOURCE_CODE
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-mono text-white flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                data-cursor-magnetic
              >
                <ExternalLink size={12} />
                LIVE_DEPLOYMENT
              </a>
            )}
          </div>

        </motion.div>
      </div>
  );
}

export function ProjectGalaxy() {
  const { deviceTier } = useDrone();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const selectedProject = projects.find((p) => p.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projects" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Project Galaxy">
      <div className="container relative z-10">
        
        {/* Chamber Header */}
        <motion.div
          className="text-center mb-12"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_03 // GALAXY</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="PROJECT GALAXY" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            Orbits of major engineering deployments. Pick an coordinates node sector to trigger visual core display.
          </p>
        </motion.div>

        {/* 3D Space Canvas View / High quality 2D layout list */}
        <motion.div
          className="relative h-[450px] md:h-[620px] rounded border border-blue-500/10 bg-black/40 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Compass grid HUD decoration */}
          <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9px] text-blue-400/40 pointer-events-none">
            <Compass size={12} className={shouldReduceMotion ? '' : 'animate-spin-slow'} />
            SEC_ORBIT_DETECTION: ON
          </div>

          {experienceConfig.features.projectGalaxy && deviceTier !== 'low' ? (
            <GalaxyCanvasDynamic selectedId={selectedId} onSelect={handleSelect} shouldReduceMotion={shouldReduceMotion} />
          ) : (
            // High quality fallback list layout
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 md:p-14 h-full overflow-y-auto">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="p-8 rounded border border-blue-500/10 bg-black/30 hover:bg-[#0d0d12]/50 hover:border-blue-500/30 text-left transition-all duration-300 relative group focus-visible:ring-2 focus-visible:ring-blue-500"
                  data-cursor-magnetic
                >
                  <span className="font-mono text-[9px] text-blue-400/50 uppercase tracking-widest">
                    {p.category}{' // PORT_ACTIVE'}
                  </span>
                  <h3 className="font-mono text-base font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-mono text-xs text-[#a0a0b0] mt-2 line-clamp-2">
                    {p.tagline}
                  </p>
                </button>
              ))}
            </div>
          )}

          {!selectedId && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-[9px] font-mono tracking-widest text-[#a0a0b0] px-4 py-2 border border-blue-500/25 bg-black/80 rounded shadow-md">
                TAP_WORLD_COORDINATES_TO_EXPAND
              </span>
            </div>
          )}
        </motion.div>

        {/* Orbit index nodes list */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="px-4 py-2 rounded font-mono text-[10px] tracking-wider transition-all duration-300 border bg-[#0d0d12]/60 hover:bg-[#16161d] focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                borderColor: selectedId === p.id ? p.planetColor : 'rgba(255, 255, 255, 0.05)',
                color: selectedId === p.id ? p.planetColor : '#a0a0b0',
                boxShadow: selectedId === p.id ? `0 0 10px ${p.planetColor}15` : 'none',
              }}
              data-cursor-magnetic
              aria-pressed={selectedId === p.id}
            >
              {'// '}{p.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
