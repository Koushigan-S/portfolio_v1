'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Cpu } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { GlitchText } from './GlitchText';

export function HeroContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
      aria-label="Hero section"
    >
      {/* HUD framing corners */}
      <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-blue-500/30 hidden md:block" />
      <div className="absolute top-12 right-12 w-8 h-8 border-t border-r border-blue-500/30 hidden md:block" />
      <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-blue-500/30 hidden md:block" />
      <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-blue-500/30 hidden md:block" />

      {/* Main Text Content */}
      <div className="relative z-10 container text-center max-w-4xl px-6 py-8">
        
        {/* HUD Subtitle / Clearance Level info */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/5 border border-blue-500/20 rounded font-mono text-[9px] tracking-[0.25em] text-blue-400 mb-4 md:mb-6"
        >
          <Cpu size={10} className={shouldReduceMotion ? '' : 'animate-pulse'} />
          SYSTEM_BOOT_SEQUENCE: SUCCESSFUL
        </motion.div>

        {/* Cinematic Glitched Name */}
        <h1 
          className="font-display text-hero text-white mb-4 md:mb-6 select-none font-bold"
          aria-label={siteConfig.name}
        >
          <GlitchText text={siteConfig.name} delay={0.2} />
        </h1>

        {/* Cinematic Glitched Title */}
        <h2 className="text-xl md:text-3xl font-mono text-white/50 tracking-wider mb-6 md:mb-8">
          <GlitchText text={siteConfig.title} delay={0.5} />
        </h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm md:text-base font-mono max-w-xl mx-auto text-[#a0a0b0] leading-relaxed mb-8 md:mb-12"
        >
          {siteConfig.tagline}
        </motion.p>

        {/* Interactive CTA buttons */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-widest border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500"
            data-cursor-magnetic
          >
            INITIALIZE_EXPLORATION
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-mono text-xs tracking-widest border border-white/10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
            data-cursor-magnetic
          >
            ESTABLISH_CONTACT
          </a>
        </motion.div>
      </div>

      {/* Dynamic Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#8c8c9c] uppercase">
          SCROLL_TO_ENTER_CHAMBERS
        </span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-blue-500/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
