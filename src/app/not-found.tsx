'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Compass, Terminal } from 'lucide-react';
import { GlitchText } from '@/components/hero/GlitchText';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[#020204] relative overflow-hidden">
      
      {/* 3D-like perspective grid corridor tunnel using CSS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="corridor-walls absolute inset-0" />
      </div>

      {/* Floating scanning drone core */}
      <div className="relative mb-12 flex items-center justify-center w-64 h-64">
        {/* Volumetric scanner beams */}
        <motion.div 
          className="absolute w-24 h-56 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full origin-top"
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center', top: '48%' }}
        />

        {/* Outer orbital brackets */}
        <motion.div 
          className="absolute w-24 h-24 border border-blue-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        />
        <motion.div 
          className="absolute w-28 h-28 border border-dashed border-blue-400/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        />

        {/* Drone brain octahedron */}
        <motion.div
          className="relative w-10 h-14 bg-black border border-blue-500 flex items-center justify-center"
          style={{ clipPath: 'polygon(50% 0%, 100% 35%, 100% 65%, 50% 100%, 0% 65%, 0% 35%)' }}
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {/* Eye lens */}
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </motion.div>
      </div>

      {/* 404 Status Texts */}
      <div className="relative z-10 max-w-md">
        
        {/* HUD metadata */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/5 border border-red-500/20 rounded font-mono text-[9px] tracking-[0.2em] text-red-400 mb-6">
          <Terminal size={10} className="animate-pulse" />
          ALERT_ERROR: SEC_NOT_FOUND_404
        </div>

        <h1 className="text-6xl md:text-8xl font-mono text-white tracking-widest font-bold mb-4 select-none">
          <GlitchText text="404" />
        </h1>

        <h2 className="text-lg font-mono text-white/70 uppercase tracking-widest mb-3">
          The page has vanished.
        </h2>
        
        <p className="font-mono text-xs text-[#6b6b7b] leading-relaxed mb-12">
          Drone UNIT-7 is still searching the abandoned corridor sectors...
        </p>

        {/* Return button */}
        <Link
          href="/"
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-widest border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 inline-flex items-center gap-2"
          data-cursor-magnetic
        >
          <Home size={12} />
          RETURN_TO_LOBBY
        </Link>
      </div>

      <style jsx>{`
        .corridor-walls {
          background-image: 
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(400px) rotateX(60deg) scale(2.0);
          transform-origin: center center;
          animation: fly 8s linear infinite;
        }
        @keyframes fly {
          from { background-position-y: 0px; }
          to { background-position-y: 400px; }
        }
      `}</style>
    </div>
  );
}
