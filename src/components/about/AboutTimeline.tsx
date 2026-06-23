'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutTimeline } from '@/config/timeline.config';
import { GlitchText } from '../hero/GlitchText';
import { ShieldAlert } from 'lucide-react';

export function AboutTimeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Identity Chamber">
      
      {/* HUD Scanner lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="w-full h-[1px] bg-blue-500 absolute top-1/4 left-0 animate-scanline" />
        <div className="w-full h-[1px] bg-blue-500 absolute top-2/3 left-0 animate-scanline" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10">
        
        {/* Chamber Header */}
        <motion.div
          className="text-center mb-20"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_01 // IDENTITY</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="IDENTITY CHAMBER" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            System logs containing data feeds regarding origin history, educational track, and core records.
          </p>
        </motion.div>

        {/* Timeline Map */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Laser Beam connector line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-[1px] md:left-1/2 bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0"
            aria-hidden
          />

          {aboutTimeline.map((entry, index) => {
            const isEven = index % 2 === 0;
            const isClassified = entry.classified;

            return (
              <motion.div
                key={entry.id}
                className={`relative flex mb-12 md:mb-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                {/* Holographic Pulse Node */}
                <div
                  className="absolute left-6 w-4 h-4 rounded-full -translate-x-1/2 mt-6 md:left-1/2 z-10 border border-blue-400 bg-[#020204] flex items-center justify-center"
                  aria-hidden
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isClassified ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-pulse'
                    }`}
                  />
                </div>

                {/* Alternating Space */}
                <div className="hidden md:block w-1/2" />

                {/* Holographic Data Card */}
                <div className={`ml-12 md:ml-0 w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                  {isClassified ? (
                    <div
                      className="p-8 rounded border bg-gradient-to-br from-red-950/20 to-black/80 border-red-500/30 shadow-[0_0_24px_rgba(239,68,68,0.08)] relative overflow-hidden"
                      data-cursor-magnetic
                    >
                      <div className="absolute top-0 right-0 p-3 text-red-500/30">
                        <ShieldAlert size={20} className={shouldReduceMotion ? '' : 'animate-pulse'} />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2 font-mono">
                        <span className="text-xl">{entry.icon}</span>
                        <span className="text-[10px] tracking-wider text-red-500">
                          YEAR: {entry.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-mono text-red-500 tracking-widest font-bold mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-[11px] font-mono text-red-400/70">
                        {entry.subtitle}
                      </p>
                      <p className="text-xs font-mono text-red-500/50 mt-2 uppercase tracking-wide">
                        CLASSIFIED: ACCESS_DENIED
                      </p>
                    </div>
                  ) : (
                    <div
                      className="glass p-8 rounded border transition-all duration-300 hover:border-blue-500/35 hover:shadow-[0_0_24px_rgba(59,130,246,0.12)] group relative"
                      data-cursor-magnetic
                    >
                      {/* Interactive dot grid corners */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500/20 group-hover:border-blue-500/50 transition-colors" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500/20 group-hover:border-blue-500/50 transition-colors" />

                      <div className="flex items-center gap-3 mb-2 font-mono">
                        <span className="text-xl">{entry.icon}</span>
                        <span className="text-[10px] tracking-wider text-blue-400">{entry.year}</span>
                      </div>
                      
                      <h3 className="text-base font-mono font-bold text-white mb-1">
                        {entry.title}
                      </h3>
                      
                      <p className="text-[11px] font-mono text-blue-500/70 mb-3 uppercase tracking-wider">
                        {entry.subtitle}
                      </p>
                      
                      <p className="text-xs font-mono text-[#a0a0b0] leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
