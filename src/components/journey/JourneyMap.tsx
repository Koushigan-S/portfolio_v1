'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { journeyPhases } from '@/config/timeline.config';
import { useDrone } from '@/contexts/DroneContext';
import { ChevronDown } from 'lucide-react';
import { GlitchText } from '../hero/GlitchText';

const STATUS_COLORS = {
  completed: '#3b82f6',
  current: '#60a5fa',
  upcoming: '#4b5563',
};

const STATUS_LABELS = {
  completed: 'SECTOR_ARCHIVED',
  current: 'CURRENT_SECTOR',
  upcoming: 'LOCKED_SECTOR',
};

export function JourneyMap() {
  const { currentSection } = useDrone();
  const [expandedId, setExpandedId] = useState<string | null>(journeyPhases[2].id); // default current phase open
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="timeline" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Timeline Corridor">
      
      {/* Decorative portal grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_04 // PORTALS</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="TIMELINE CORRIDOR" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            The drone navigates down the dimensional corridor, unlocking chronological database files.
          </p>
        </motion.div>

        {/* Narrative Nodes */}
        <div className="relative max-w-2xl mx-auto">
          {/* Corridor pathway guide rail */}
          <div
            className="absolute left-8 top-8 bottom-8 w-[1px] md:left-1/2 md:-translate-x-px bg-gradient-to-b from-blue-500/0 via-blue-500/25 to-blue-500/0"
            aria-hidden
          />

          {journeyPhases.map((phase, index) => {
            const isExpanded = expandedId === phase.id;
            const color = STATUS_COLORS[phase.status];
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={phase.id}
                className={`relative flex mb-12 flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-85px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                {/* Holographic Portal Door Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 flex flex-col items-center mt-6">
                  <motion.button
                    className="w-10 h-10 rounded border flex items-center justify-center text-sm font-mono transition-all duration-300 bg-[#0d0d12]/90 hover:bg-[#16161d] focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      borderColor: color,
                      boxShadow: phase.status === 'current' ? `0 0 15px ${color}50` : 'none',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    data-cursor-magnetic
                    aria-expanded={isExpanded}
                    aria-controls={`phase-details-${phase.id}`}
                  >
                    <span>{phase.icon}</span>
                  </motion.button>
                </div>

                {/* Left/Right spacer helper */}
                <div className="hidden md:block w-1/2" />

                {/* Corridor Record Box */}
                <div className={`ml-20 md:ml-0 w-full md:w-1/2 ${isLeft ? 'md:pl-16' : 'md:pr-16'}`}>
                  <button
                    className="w-full text-left p-6 rounded border glass hover:border-blue-500/35 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group relative focus-visible:ring-2 focus-visible:ring-blue-500"
                    onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full mb-2 inline-block border"
                          style={{
                            background: `${color}10`,
                            color: color,
                            borderColor: `${color}25`,
                          }}
                        >
                          {STATUS_LABELS[phase.status]}
                        </span>
                        
                        <p className="text-[10px] font-mono tracking-widest text-[#8c8c9c] uppercase mb-1">
                          {phase.phase}
                        </p>
                        
                        <h3 className="font-mono text-base font-bold text-white">
                          {phase.title}
                        </h3>
                        
                        <p className="text-[10px] font-mono text-[#a0a0b0] mt-0.5">
                          {phase.subtitle}
                        </p>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        aria-hidden
                        className="text-[#8c8c9c] group-hover:text-blue-400"
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`phase-details-${phase.id}`}
                          initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-xs font-mono text-[#8c8c9c] mb-4 leading-relaxed">
                              {phase.description}
                            </p>
                            <ul className="space-y-1.5">
                              {phase.details.map((d, i) => (
                                <li key={i} className="text-xs font-mono flex items-center gap-2 text-[#a0a0b0]">
                                  <span style={{ color }}>▸</span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
