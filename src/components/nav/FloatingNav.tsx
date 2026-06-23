'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ShieldAlert, Cpu } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useDrone } from '@/contexts/DroneContext';

const NAV_CHAMBERS = [
  { index: 0, label: 'LOBBY', href: '#home' },
  { index: 1, label: 'IDENTITY', href: '#about' },
  { index: 2, label: 'TECH STACK', href: '#tech-stack' },
  { index: 3, label: 'GALAXY', href: '#projects' },
  { index: 4, label: 'CORRIDOR', href: '#timeline' },
  { index: 5, label: 'VAULT', href: '#achievements' },
  { index: 6, label: 'VISION', href: '#vision' },
  { index: 7, label: 'TERMINAL', href: '#contact' },
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
        <div className="relative glass flex items-center justify-between px-6 py-3 rounded-full pointer-events-auto border border-blue-500/25 bg-black/75 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          
          {/* Left: Brand + Drone Status */}
          <div className="flex items-center gap-3">
            <Link href="#home" data-cursor-magnetic className="flex items-center gap-2">
              <span className="font-mono text-sm tracking-[0.2em] text-white font-bold">NOVA LAB</span>
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

          {/* Center: HUD Chamber dots */}
          <div className="flex items-center gap-3 md:gap-4">
            {NAV_CHAMBERS.map((chamber) => {
              const isActive = currentSection === chamber.index;
              const isHovered = hoveredIdx === chamber.index;
              return (
                <a
                  key={chamber.href}
                  href={chamber.href}
                  className="relative group p-2 md:p-1 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-blue-500"
                  onMouseEnter={() => setHoveredIdx(chamber.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  data-cursor-magnetic
                  aria-label={`Go to ${chamber.label}`}
                >
                  {/* Invisible touch target expander for mobile accessibility */}
                  <span className="absolute inset-[-6px] md:inset-0" />

                  {/* Glowing dot */}
                  <div
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] scale-110'
                        : 'bg-white/20 group-hover:bg-white/50 group-hover:scale-105'
                    }`}
                  />

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-blue-500/30 text-[9px] font-mono text-blue-400 px-2.5 py-0.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none"
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
              className="p-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 text-white/60 hover:text-blue-400 transition-all duration-300"
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
