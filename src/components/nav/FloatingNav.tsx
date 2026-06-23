'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Cpu, 
  Home, 
  User, 
  Layers, 
  GitCommit, 
  Award, 
  Eye, 
  Mail 
} from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useDrone } from '@/contexts/DroneContext';

const NAV_CHAMBERS = [
  { index: 0, label: 'LOBBY', shortLabel: 'LOBBY', href: '#home', Icon: Home },
  { index: 1, label: 'IDENTITY', shortLabel: 'ABOUT', href: '#about', Icon: User },
  { index: 2, label: 'TECH STACK', shortLabel: 'TECH', href: '#tech-stack', Icon: Cpu },
  { index: 3, label: 'GALAXY', shortLabel: 'PROJECTS', href: '#projects', Icon: Layers },
  { index: 4, label: 'CORRIDOR', shortLabel: 'JOURNEY', href: '#timeline', Icon: GitCommit },
  { index: 5, label: 'VAULT', shortLabel: 'VAULT', href: '#achievements', Icon: Award },
  { index: 6, label: 'VISION', shortLabel: 'VISION', href: '#vision', Icon: Eye },
  { index: 7, label: 'TERMINAL', shortLabel: 'CONTACT', href: '#contact', Icon: Mail },
];

export function FloatingNav() {
  const { currentSection, isMuted, toggleMute, deviceTier, totalScrollProgress } = useDrone();
  const { scrollDir, atTop } = useScrollDirection();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const hidden = !atTop && scrollDir === 'down';

  return (
    <>
      {/* HUD Layout Navbar */}
      <motion.nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[92vw] max-w-[1100px] pointer-events-none"
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        aria-label="NOVA LAB HUD"
      >
        <div className="relative liquid-nav flex items-center justify-between px-4 py-2.5 sm:px-8 sm:py-3.5 pointer-events-auto">
          
          {/* Left: Brand + Drone Status */}
          <div className="flex items-center gap-3">
            <Link href="#home" data-cursor-magnetic className="flex items-center gap-1">
              <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white font-bold hidden min-[480px]:inline">NOVA LAB</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 text-[10px] font-mono text-blue-400 hidden sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              DRONE: ACTIVE
            </div>
          </div>

          {/* Center: Liquid Navigation Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {NAV_CHAMBERS.map((chamber) => {
              const isActive = currentSection === chamber.index;
              const isHovered = hoveredIdx === chamber.index;
              return (
                <a
                  key={chamber.href}
                  href={chamber.href}
                  className="relative px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-1.5 text-xs font-mono transition-all duration-300 focus-visible:ring-1 focus-visible:ring-blue-500 z-10 select-none group"
                  onMouseEnter={() => setHoveredIdx(chamber.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  data-cursor-magnetic
                  aria-label={`Go to ${chamber.label}`}
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  <chamber.Icon 
                    size={14} 
                    className={`transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/70'}`} 
                  />
                  <span className="hidden md:inline text-[10px] tracking-wider font-semibold">
                    {chamber.shortLabel}
                  </span>

                  {/* Sliding active pill (liquid spring effect) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-blue-500/10 border border-blue-500/30 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Tooltip on hover (for non-desktop where label is hidden) */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-blue-500/30 text-[9px] font-mono text-blue-400 px-2.5 py-0.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none md:hidden"
                      >
                        {chamber.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </div>

          {/* Right: Sound Controls + Dev Tier info */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 text-[9px] font-mono text-white/50">
              <Cpu size={10} className="text-white/40" />
              <span>TIER: {deviceTier.toUpperCase()}</span>
            </div>
            
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/35 text-white/60 hover:text-blue-400 transition-all duration-300"
              data-cursor-magnetic
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          {/* Subtle scroll progress line at bottom of HUD pill */}
          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
              style={{ scaleX: totalScrollProgress, transformOrigin: 'left' }}
            />
          </div>

        </div>
      </motion.nav>
    </>
  );
}
