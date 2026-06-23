'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  'Loading possibilities…',
  'Constructing the laboratory…',
  'Generating ideas…',
  'Initializing systems…',
  'Rendering imagination…',
  'Preparing the future…',
];

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Progress simulator
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        const increment = p < 60 ? Math.random() * 6 + 3 : Math.random() * 12 + 6;
        return Math.min(p + increment, 100);
      });
    }, 100);

    // 2. Cycle loading messages
    const messageTimer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 850);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 800); // Wait for fade exit transition
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // 3. Canvas animation (orbiting particles trails around ∞ symbol)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 150;

    let rafId: number;
    let time = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 4, 0.15)'; // Trail fade back
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw orbiting points on figure-eight infinity lemniscate path
      // Lemniscate formula: x = a*cos(t)/(1+sin^2(t)), y = a*sin(t)*cos(t)/(1+sin^2(t))
      time += 0.05;
      const a = 80;

      // Draw primary glowing drone core light
      const droneT = time * 0.8;
      const denom = 1 + Math.pow(Math.sin(droneT), 2);
      const droneX = cx + (a * Math.cos(droneT)) / denom;
      const droneY = cy + (a * Math.sin(droneT) * Math.cos(droneT)) / denom;

      // Draw scanning rays
      ctx.beginPath();
      ctx.arc(droneX, droneY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Orbiting dust/gravity particles
      const pCount = 12;
      for (let i = 0; i < pCount; i++) {
        const offsetT = time * 0.5 + (i * Math.PI * 2) / pCount;
        const pDenom = 1 + Math.pow(Math.sin(offsetT), 2);
        const px = cx + (a * 1.1 * Math.cos(offsetT)) / pDenom + Math.sin(time + i) * 6;
        const py = cy + (a * 1.1 * Math.sin(offsetT) * Math.cos(offsetT)) / pDenom + Math.cos(time + i) * 6;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.45 + Math.sin(time + i) * 0.35})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020204]"
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Outer Ring & Canvas */}
          <div className="relative w-[300px] h-[150px] flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0" />
            
            {/* Holographic infinity core symbol */}
            <span className="font-mono text-3xl text-white/10 font-thin pointer-events-none select-none tracking-[0.2em] z-10">
              ∞
            </span>
          </div>

          {/* Loading status message */}
          <div className="mt-8 h-6 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                className="text-xs font-mono tracking-[0.15em] text-[#a0a0b0]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Percentage indicator */}
          <motion.div 
            className="mt-2 text-[10px] font-mono text-blue-400/50"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {Math.round(progress)}% STATUS: CONSTRUCTING_LAB
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
