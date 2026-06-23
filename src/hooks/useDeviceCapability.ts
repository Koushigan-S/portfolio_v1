'use client';

import { useState, useEffect } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

export function useDeviceCapability() {
  const [tier, setTier] = useState<DeviceTier>('high');
  const [fps, setFps] = useState<number>(60);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Initial rough scoring
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    })();

    if (!hasWebGL) {
      setTier('low');
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    // @ts-ignore
    const ram = navigator.deviceMemory || 8;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pixelRatio = window.devicePixelRatio || 1;
    const screenArea = window.screen.width * window.screen.height * pixelRatio;
    
    // Check user agent for mobile
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /iphone|ipad|ipod|android|blackberry|mini|windows\sphone|iemobile/i.test(ua);
    setIsMobile(isTouch || isMobileUA);

    // Initial Tier assignment based on hardware stats
    let score = 0;
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;

    if (ram >= 8) score += 3;
    else if (ram >= 4) score += 2;
    else score += 1;

    if (screenArea > 2000000) score -= 1; // High res screen needs more power

    if (isTouch || isMobileUA) {
      score -= 2; // Mobile is generally lower capability
    }

    let initialTier: DeviceTier = 'high';
    if (score >= 4) {
      initialTier = 'high';
    } else if (score >= 2) {
      initialTier = 'medium';
    } else {
      initialTier = 'low';
    }

    setTier(initialTier);

    // 2. FPS Sampling during load (2 seconds monitor)
    let frameCount = 0;
    let startTime = performance.now();
    let animationId: number;

    const sampleFps = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - startTime;

      if (elapsed >= 1500) { // sample over 1.5 seconds
        const calculatedFps = Math.round((frameCount * 1000) / elapsed);
        setFps(calculatedFps);

        // Dynamic adjustment based on FPS
        if (calculatedFps < 30) {
          setTier('low');
        } else if (calculatedFps < 48 && initialTier === 'high') {
          setTier('medium');
        }
        return;
      }

      animationId = requestAnimationFrame(sampleFps);
    };

    animationId = requestAnimationFrame(sampleFps);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { tier, fps, isMobile };
}
