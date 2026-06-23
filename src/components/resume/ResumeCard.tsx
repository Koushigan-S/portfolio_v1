'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Download, FileText, X, Briefcase, GraduationCap, Code } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { experienceConfig } from '@/config/experience.config';
import { GlitchText } from '../hero/GlitchText';

export function ResumeCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Lock body scroll when resume modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    
    // Simulate high-tech download delay
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = experienceConfig.resume.pdfPath;
      link.download = `${siteConfig.name.replace(/\s+/g, '_')}_Resume.pdf`;
      link.click();
      setIsDownloading(false);
    }, 1000);
  };

  return (
    <section id="resume" className="relative py-24 bg-transparent border-b border-blue-500/10" aria-label="Resume Section">
      <div className="container text-center relative z-10">
        
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">SCHEDULER // RECORD</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-12">
            <GlitchText text="RESUME CARD" />
          </h2>
        </motion.div>

        {/* Outer 3D card layout */}
        <motion.div
          className="max-w-md mx-auto relative group focus-visible:ring-2 focus-visible:ring-blue-500 outline-none rounded"
          tabIndex={0}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          transition={{ duration: 0.6 }}
          role="button"
          aria-label="View Resume Details"
        >
          {/* Card body */}
          <div
            className="p-[15px] rounded-xl border bg-black/60 border-blue-500/20 group-hover:border-blue-500/35 transition-all duration-300 relative cursor-pointer shadow-[0_0_25px_rgba(59,130,246,0.1)]"
            data-cursor-magnetic
          >
            {/* HUD lines */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[8px] text-blue-400/40">FILE_RECORD: #092812</span>
              <FileText size={20} className="text-blue-500" />
            </div>

            <div className="space-y-2 mb-6" aria-hidden>
              {[0.4, 0.3, 0.2, 0.1].map((opacity, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    height: '2px',
                    background: `rgba(59, 130, 246, ${opacity})`,
                    width: `${100 - i * 15}%`,
                  }}
                />
              ))}
            </div>

            <h3 className="text-lg font-mono font-bold text-white mb-1">
              {siteConfig.name}
            </h3>
            <p className="text-xs font-mono text-[#8c8c9c] mb-8">
              {siteConfig.title}
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-mono tracking-widest text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)] focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              UNFOLD_RESUME_VIEW
            </button>
          </div>

          {/* Floating layers behind */}
          <div className="absolute inset-0 -z-10 rounded border border-white/5 bg-black/40 translate-y-2.5 scale-95" />
          <div className="absolute inset-0 -z-20 rounded border border-white/5 bg-black/20 translate-y-5 scale-90" />
        </motion.div>
      </div>

      {/* Holographic expanded PDF viewer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#020204]/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Document body container */}
            <motion.div
              className="relative z-10 w-full max-w-3xl bg-[#0d0d12]/95 border border-blue-500/20 rounded-xl p-[15px] md:p-[20px] overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(59,130,246,0.15)] font-mono text-xs text-[#a0a0b0]"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] tracking-[0.2em] text-blue-400 uppercase">
                    SECURE_DOC_UNFOLDED // CLEARANCE_LEVEL_5
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{siteConfig.name}</h3>
                  <p className="text-xs text-[#a0a0b0] mt-0.5">{siteConfig.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-[10px] text-white flex items-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                    data-cursor-magnetic
                  >
                    <Download size={12} />
                    {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD_PDF'}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="relative p-3 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                    data-cursor-magnetic
                    aria-label="Close resume view"
                  >
                    <span className="absolute inset-[-8px] md:inset-0" />
                    <X size={16} />
                  </button>
                </div>
              </div>

              <hr className="border-white/5 mb-6" />

              {/* Resume Details Grid */}
              <div className="space-y-6">
                {/* Profile Summary */}
                <div>
                  <h4 className="text-[10px] font-bold text-white tracking-widest uppercase mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    PROFILE_SUMMARY
                  </h4>
                  <p className="leading-relaxed">
                    {siteConfig.description}
                  </p>
                </div>

                {/* Professional History */}
                <div>
                  <h4 className="text-[10px] font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-blue-400" />
                    PROFESSIONAL_HISTORY
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-white font-bold text-xs">
                        <span>[YOUR WORK EXP TITLE]</span>
                        <span>[YEARS]</span>
                      </div>
                      <div className="text-[10px] text-blue-400/80 mt-0.5">[COMPANY] · [LOCATION]</div>
                      <p className="mt-1 leading-relaxed">
                        [Description of key projects, architecture designs, and achievements.]
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic History */}
                <div>
                  <h4 className="text-[10px] font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-blue-400" />
                    ACADEMIC_RECORD
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-white font-bold text-xs">
                        <span>[DEGREE PROGRAM]</span>
                        <span>[YEARS]</span>
                      </div>
                      <div className="text-[10px] text-blue-400/80 mt-0.5">[UNIVERSITY NAME] · [CGPA]</div>
                    </div>
                  </div>
                </div>

                {/* technical competencies */}
                <div>
                  <h4 className="text-[10px] font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <Code size={12} className="text-blue-400" />
                    TECHNICAL_COMPETENCIES
                  </h4>
                  <p className="leading-relaxed">
                    [Languages, libraries, databases, security tooling, cloud providers, and robotics parameters.]
                  </p>
                </div>
              </div>

              <hr className="border-white/5 mt-6 mb-6" />

              <div className="flex justify-end text-[9px] text-blue-400/30">
                SYSTEM_TIMESTAMP: {new Date().toLocaleDateString()}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
