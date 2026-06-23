'use client';

import { useEffect, useRef } from 'react';
import { experienceConfig } from '@/config/experience.config';

interface TubePoint {
  x: number;
  y: number;
}

interface Tube {
  color: string;
  speed: number;
  width: number;
  history: TubePoint[];
  current: TubePoint;
}

interface LightParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorCurrent = useRef({ x: 0, y: 0 });
  
  const tubesRef = useRef<Tube[]>([]);
  const lightParticlesRef = useRef<LightParticle[]>([]);
  const hoverType = useRef<'normal' | 'magnetic' | 'canvas3d' | 'textInput'>('normal');

  useEffect(() => {
    // Avoid running cursor on touch-only devices
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize the neon tubes
    tubesRef.current = [
      {
        color: '#f967fb', // Neon Pink
        speed: 0.22,
        width: 8,
        history: [],
        current: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      },
      {
        color: '#6958d5', // Neon Purple/Blue
        speed: 0.15,
        width: 7,
        history: [],
        current: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      },
      {
        color: '#53bc28', // Neon Green
        speed: 0.10,
        width: 6,
        history: [],
        current: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      },
    ];

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursorTarget.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        hoverType.current = 'textInput';
      } else if (target.hasAttribute('data-cursor-magnetic')) {
        hoverType.current = 'magnetic';
      } else if (target.hasAttribute('data-cursor-3d')) {
        hoverType.current = 'canvas3d';
      } else {
        hoverType.current = 'normal';
      }
    };

    const handleElementLeave = () => {
      hoverType.current = 'normal';
    };

    // Main animation loop
    let rafId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth current cursor position
      cursorCurrent.current.x += (cursorTarget.current.x - cursorCurrent.current.x) * 0.12;
      cursorCurrent.current.y += (cursorTarget.current.y - cursorCurrent.current.y) * 0.12;

      // Update tubes positions and histories
      if (hoverType.current !== 'textInput' && cursorCurrent.current.x > 0 && cursorCurrent.current.y > 0) {
        tubesRef.current.forEach((tube) => {
          // Slide head towards mouse
          tube.current.x += (cursorCurrent.current.x - tube.current.x) * tube.speed;
          tube.current.y += (cursorCurrent.current.y - tube.current.y) * tube.speed;

          // Push into history
          tube.history.unshift({ x: tube.current.x, y: tube.current.y });
          if (tube.history.length > 25) {
            tube.history.pop();
          }
        });
      } else {
        // Decay histories when in textInput or inactive
        tubesRef.current.forEach((tube) => {
          if (tube.history.length > 0) {
            tube.history.pop();
          }
        });
      }

      // Draw tubes (Double pass: Outer Glow, then Inner Bright Core)
      if (experienceConfig.features.particleSystem) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // PASS 1: Outer Glow
        tubesRef.current.forEach((tube) => {
          if (tube.history.length < 2) return;

          ctx.save();
          ctx.shadowBlur = 25;
          ctx.shadowColor = tube.color;

          for (let i = 0; i < tube.history.length - 1; i++) {
            const p1 = tube.history[i];
            const p2 = tube.history[i + 1];

            const ratio = 1 - i / tube.history.length;
            ctx.lineWidth = tube.width * 1.8 * ratio;
            ctx.strokeStyle = tube.color;
            ctx.globalAlpha = 0.25 * ratio;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
          ctx.restore();
        });

        // PASS 2: Inner Core
        tubesRef.current.forEach((tube) => {
          if (tube.history.length < 2) return;

          ctx.save();
          for (let i = 0; i < tube.history.length - 1; i++) {
            const p1 = tube.history[i];
            const p2 = tube.history[i + 1];

            const ratio = 1 - i / tube.history.length;
            ctx.lineWidth = tube.width * 0.7 * ratio;
            ctx.strokeStyle = '#ffffff'; // Bright core
            ctx.globalAlpha = 0.9 * ratio;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Overlay thin accent colored stroke to blend
            ctx.lineWidth = tube.width * 0.5 * ratio;
            ctx.strokeStyle = tube.color;
            ctx.globalAlpha = 0.5 * ratio;
            ctx.stroke();
          }
          ctx.restore();
        });

        // Spawn Light Sparkles along the fastest moving tubes
        const mouseDelta = Math.hypot(
          cursorCurrent.current.x - cursorTarget.current.x,
          cursorCurrent.current.y - cursorTarget.current.y
        );
        if (mouseDelta > 2 && Math.random() < 0.4 && hoverType.current !== 'textInput') {
          const lightColors = ["#83f36e", "#fe8a2e", "#ff608a", "#68aed5"];
          const randColor = lightColors[Math.floor(Math.random() * lightColors.length)];
          
          // Spawn near the primary tube head
          const head = tubesRef.current[0].current;
          lightParticlesRef.current.push({
            x: head.x + (Math.random() - 0.5) * 12,
            y: head.y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.4,
            color: randColor,
            alpha: 1.0,
            size: Math.random() * 3 + 1.5,
          });
        }

        // Draw and update light particles
        lightParticlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= 0.035;

          if (p.alpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.restore();
          }
        });

        // Filter active particles
        lightParticlesRef.current = lightParticlesRef.current.filter((p) => p.alpha > 0);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Apply event listeners to interactive items
    const setupInteractions = () => {
      const els = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-cursor-magnetic], [data-cursor-3d]');
      els.forEach((el) => {
        el.addEventListener('mouseenter', handleElementHover as EventListener);
        el.addEventListener('mouseleave', handleElementLeave as EventListener);
      });
    };

    setupInteractions();

    // Mutation observer for dynamically added items
    const observer = new MutationObserver(setupInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      const els = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-cursor-magnetic]');
      els.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementHover as EventListener);
        el.removeEventListener('mouseleave', handleElementLeave as EventListener);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <style jsx global>{`
        body {
          cursor: default !important;
        }
        a, button, [role="button"], [data-cursor-magnetic] {
          cursor: pointer !important;
        }
        input, select, textarea {
          cursor: auto !important;
        }
        input[type="text"], input[type="email"], textarea {
          cursor: text !important;
        }
      `}</style>
    </>
  );
}
