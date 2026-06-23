'use client';

import { useEffect, useState } from 'react';
import { type PerformanceTier } from '@/types';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('high');

  useEffect(() => {
    // Check for low-end device signals
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const isLowPower = isMobile && (hardwareConcurrency <= 4 || deviceMemory <= 4);

    // Measure rough frame rate
    let frames = 0;
    let startTime = performance.now();
    let rafId: number;

    const measure = () => {
      frames++;
      const elapsed = performance.now() - startTime;
      if (elapsed < 500) {
        rafId = requestAnimationFrame(measure);
      } else {
        const fps = (frames / elapsed) * 1000;
        cancelAnimationFrame(rafId);

        if (isLowPower || fps < 30) {
          setTier('low');
        } else if (isMobile || fps < 50) {
          setTier('medium');
        } else {
          setTier('high');
        }
      }
    };

    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return tier;
}
