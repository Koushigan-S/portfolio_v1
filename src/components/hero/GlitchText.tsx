'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function GlitchText({ text, className = '', delay = 0 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    // 1. Matrix reconstruction animation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const runAnimation = () => {
      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        });

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text);
        }

        iteration += 1 / 2; // slow down progression
      }, 35);
    };

    const startTimeout = setTimeout(runAnimation, delay * 1000);

    // 2. Occasional random glitch flash
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [text, delay]);

  return (
    <span 
      className={`relative inline-block ${className} ${isGlitching ? 'glitch-active' : ''}`}
      data-text={text}
    >
      {displayText}
      
      {/* Glitch Overlay effects */}
      {isGlitching && (
        <>
          <span className="absolute inset-0 text-red-500/80 mix-blend-screen glitch-slice-1 pointer-events-none select-none">
            {displayText}
          </span>
          <span className="absolute inset-0 text-blue-500/80 mix-blend-screen glitch-slice-2 pointer-events-none select-none">
            {displayText}
          </span>
        </>
      )}

      <style jsx>{`
        .glitch-active {
          animation: shake 0.2s infinite;
        }
        .glitch-slice-1 {
          clip-path: inset(40% 0 30% 0);
          transform: translate(-3px, -2px);
          animation: glitch-anim 0.25s infinite;
        }
        .glitch-slice-2 {
          clip-path: inset(10% 0 60% 0);
          transform: translate(3px, 2px);
          animation: glitch-anim2 0.25s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(2px, 2px); }
        }
        @keyframes glitch-anim {
          0% { clip-path: inset(40% 0 30% 0); }
          30% { clip-path: inset(80% 0 5% 0); }
          60% { clip-path: inset(5% 0 80% 0); }
          100% { clip-path: inset(15% 0 55% 0); }
        }
        @keyframes glitch-anim2 {
          0% { clip-path: inset(10% 0 60% 0); }
          30% { clip-path: inset(60% 0 20% 0); }
          60% { clip-path: inset(20% 0 60% 0); }
          100% { clip-path: inset(90% 0 2% 0); }
        }
      `}</style>
    </span>
  );
}
