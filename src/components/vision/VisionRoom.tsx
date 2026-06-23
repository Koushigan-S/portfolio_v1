'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { visionItems } from '@/config/vision.config';
import { GlitchText } from '../hero/GlitchText';

export function VisionRoom() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="vision" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Vision Room">
      
      {/* High-quality 2D star particles drifting in background for low-tier fallbacks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-2/3 left-1/5 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container relative z-10">
        
        {/* Chamber Header */}
        <motion.div
          className="text-center mb-16"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_06 // FUTURE</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="VISION ROOM" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            The final panoramic outlook viewing star coordinates of active future goals, targets, and goals parameters.
          </p>
        </motion.div>

        {/* Panoramic Glass Framing container */}
        <div className="relative border border-blue-500/10 rounded-xl bg-black/45 p-8 md:p-12 shadow-[0_0_30px_rgba(59,130,246,0.05)] overflow-hidden">
          
          {/* Panoramic Reticle HUD lines */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-blue-400/40">
            OBSERVATION_DECK: ACTIVATED // STAR_MAP_ALIGN: TRUE
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[9px] text-blue-400/20">
            AZIMUTH: 184.22 // ELEVATION: 42.8
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {visionItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass p-6 rounded border transition-all duration-300 hover:border-blue-500/35 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] group shadow-md"
                data-cursor-magnetic
              >
                {/* Visual state headers */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl filter drop-shadow-[0_0_6px_rgba(59,130,246,0.2)]">
                    {item.icon}
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-blue-400/70 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 uppercase">
                    {item.status}
                  </span>
                </div>

                <p className="text-[9px] font-mono text-blue-400/50 uppercase tracking-widest mb-1">
                  COORD_INDEX_0{index + 1}
                </p>
                
                <h3 className="font-mono text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {item.title}
                </h3>
                
                <p className="font-mono text-[11px] text-[#a0a0b0] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
