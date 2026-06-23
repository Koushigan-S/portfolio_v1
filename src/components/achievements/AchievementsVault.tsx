'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { achievements, achievementCategories, type Achievement } from '@/config/achievements.config';
import { X, ExternalLink, DoorClosed, DoorOpen } from 'lucide-react';
import { GlitchText } from '../hero/GlitchText';

const CATEGORY_COLORS: Record<string, string> = {
  certificate: '#3b82f6',
  hackathon: '#60a5fa',
  award: '#94a3b8',
  academic: '#4b5563',
  competition: '#2563eb',
};

function AchievementCard({ 
  achievement, 
  onClick, 
  isSelected, 
  shouldReduceMotion 
}: { 
  achievement: Achievement; 
  onClick: () => void; 
  isSelected: boolean;
  shouldReduceMotion: boolean;
}) {
  const color = CATEGORY_COLORS[achievement.category] ?? '#3b82f6';
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      layoutId={shouldReduceMotion ? undefined : `achievement-${achievement.id}`}
      className="w-full text-left p-[15px] rounded-xl border bg-[#0d0d12]/75 border-blue-500/20 hover:border-blue-500/35 transition-all duration-300 relative overflow-hidden group shadow-[0_0_12px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-blue-500"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      data-cursor-magnetic
      aria-label={`Unlock vault cell details for ${achievement.title}`}
    >
      {/* Corner indicators */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-blue-500/30 group-hover:border-blue-500/70" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-blue-500/30 group-hover:border-blue-500/70" />

      {/* Floating status icon */}
      <div className="absolute top-4 right-4 text-white/20 group-hover:text-blue-400 transition-colors">
        {hovered ? <DoorOpen size={16} /> : <DoorClosed size={16} />}
      </div>

      <div className="flex items-start gap-4">
        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{achievement.icon}</span>
        <div className="flex-1 min-w-0 font-mono">
          <span
            className="text-[9px] tracking-widest px-2 py-0.5 rounded border mb-2 inline-block"
            style={{
              background: `${color}10`,
              color,
              borderColor: `${color}30`,
            }}
          >
            {achievement.category.toUpperCase()}
          </span>
          <h3 className="text-sm font-bold text-white mt-1 truncate">
            {achievement.title}
          </h3>
          <p className="text-[10px] text-[#8c8c9c] mt-0.5">
            {achievement.issuer} · {achievement.date}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function AchievementModal({
  achievement,
  onClose,
  shouldReduceMotion,
}: {
  achievement: Achievement;
  onClose: () => void;
  shouldReduceMotion: boolean;
}) {
  const color = CATEGORY_COLORS[achievement.category] ?? '#3b82f6';

  // Lock body scroll when achievement modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[8000] bg-[#020204]/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      
      {/* Chamber Vault Unlock popup */}
      <motion.div
        layoutId={shouldReduceMotion ? undefined : `achievement-${achievement.id}`}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[8001] p-[15px] md:p-[20px] rounded-xl border bg-[#0d0d12]/95"
        style={{ borderColor: `${color}40`, boxShadow: `0 0 40px ${color}15` }}
        role="dialog"
        aria-modal="true"
        aria-label={achievement.title}
      >
        {/* Decorative holographic grid lines */}
        <div className="absolute top-2 left-2 text-[8px] font-mono text-blue-400/20">
          VAULT_SEC_DECRYPTED
        </div>

        <div className="flex justify-between items-start mb-6">
          <span className="text-5xl filter drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">{achievement.icon}</span>
          <button
            onClick={onClose}
            className="relative p-3 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
            data-cursor-magnetic
            aria-label="Lock vault cell"
          >
            <span className="absolute inset-[-8px] md:inset-0" />
            <X size={16} />
          </button>
        </div>

        <span
          className="text-[9px] font-mono tracking-widest px-2.5 py-1 rounded border mb-4 inline-block"
          style={{ background: `${color}10`, color, borderColor: `${color}30` }}
        >
          {achievement.category.toUpperCase()}
        </span>

        <h3 className="text-xl font-mono font-bold text-white mt-2 mb-1">
          {achievement.title}
        </h3>
        
        <p className="text-xs font-mono mb-4" style={{ color }}>
          {achievement.issuer} · {achievement.date}
        </p>
        
        <p className="text-xs font-mono text-[#a0a0b0] leading-relaxed mb-6">
          {achievement.description}
        </p>

        {achievement.link && (
          <a
            href={achievement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/30 rounded text-xs font-mono text-white/80 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-white"
            data-cursor-magnetic
            aria-label="Inspect credentials"
          >
            <ExternalLink size={12} />
            VERIFY_DECRYPTED_CREDENTIAL
          </a>
        )}
      </motion.div>
    </>
  );
}

export function AchievementsVault() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const filtered = activeCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const selected = achievements.find((a) => a.id === selectedId);

  return (
    <section id="achievements" className="relative min-h-screen py-24 bg-transparent border-b border-blue-500/10" aria-label="Achievements Vault">
      <div className="container relative z-10">
        
        {/* Chamber Header */}
        <motion.div
          className="text-center mb-16"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_05 // VAULT</p>
          <h2 className="text-display font-display text-white font-bold select-none mb-4">
            <GlitchText text="ACHIEVEMENT VAULT" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#8c8c9c]">
            Secure vault chambers containing verified certifications, academic records, and challenge codes.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {achievementCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="px-4 py-2 rounded font-mono text-[10px] tracking-wider transition-all duration-300 border bg-[#0d0d12]/60 hover:bg-[#16161d] focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                borderColor: activeCategory === cat.key ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                color: activeCategory === cat.key ? '#3b82f6' : '#a0a0b0',
                boxShadow: activeCategory === cat.key ? '0 0 10px rgba(59,130,246,0.15)' : 'none',
              }}
              data-cursor-magnetic
              aria-pressed={activeCategory === cat.key}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          layout={!shouldReduceMotion}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((ach, i) => (
              <motion.div
                key={ach.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
              >
                <AchievementCard
                  achievement={ach}
                  onClick={() => setSelectedId(ach.id)}
                  isSelected={selectedId === ach.id}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selected && (
          <AchievementModal
            achievement={selected}
            onClose={() => setSelectedId(null)}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
