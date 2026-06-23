'use client';

import { useEffect, useRef } from 'react';
import { experienceConfig } from '@/config/experience.config';

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  sparkleSpeed: number;
  angle: number;
  rotationSpeed: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorCurrent = useRef({ x: 0, y: 0 });
  const trailPoints = useRef<TrailPoint[]>([]);
  const isHovered = useRef(false);
  const isClicking = useRef(false);
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

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursorTarget.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      isClicking.current = true;
    };

    const handleMouseUp = () => {
      isClicking.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      isHovered.current = true;

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
      isHovered.current = false;
      hoverType.current = 'normal';
    };

    // Main animation loop
    let rafId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth current cursor position
      cursorCurrent.current.x += (cursorTarget.current.x - cursorCurrent.current.x) * 0.12;
      cursorCurrent.current.y += (cursorTarget.current.y - cursorCurrent.current.y) * 0.12;

      // Generate tail silver glitter particles if not hover screen corners and not in text input
      if (experienceConfig.features.particleSystem && hoverType.current !== 'textInput' && cursorCurrent.current.x > 0 && cursorCurrent.current.y > 0) {
        const count = isClicking.current ? 4 : 2;
        for (let i = 0; i < count; i++) {
          trailPoints.current.push({
            x: cursorCurrent.current.x + (Math.random() - 0.5) * 8,
            y: cursorCurrent.current.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6 - 0.4, // Slight upward float
            alpha: 0.8 + Math.random() * 0.2,
            size: Math.random() * 4 + 1.2, // Glitter size range
            sparkleSpeed: 0.08 + Math.random() * 0.15,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.15,
          });
        }
      }

      // Draw and decay particle trails
      trailPoints.current.forEach((pt) => {
        // Physics update
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.97;
        pt.vy *= 0.97;
        pt.alpha -= 0.025; // Gentler decay
        pt.size *= 0.95; // Shrink slightly
        pt.angle += pt.rotationSpeed;

        if (pt.alpha > 0) {
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.angle);

          // Draw custom 4-pointed silver star/diamond glitter flake
          ctx.beginPath();
          const r = pt.size * (0.55 + Math.sin(Date.now() * pt.sparkleSpeed) * 0.45); // Active shimmer
          
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.35, -r * 0.35);
          ctx.lineTo(r, 0);
          ctx.lineTo(r * 0.35, r * 0.35);
          ctx.lineTo(0, r);
          ctx.lineTo(-r * 0.35, r * 0.35);
          ctx.lineTo(-r, 0);
          ctx.lineTo(-r * 0.35, -r * 0.35);
          ctx.closePath();

          // Premium silver/white gradient fill
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          gradient.addColorStop(0, '#ffffff'); // bright center
          gradient.addColorStop(0.25, '#f1f5f9'); // white/silver
          gradient.addColorStop(0.6, '#cbd5e1'); // silver metal
          gradient.addColorStop(0.9, '#94a3b8'); // steel shadow
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.globalAlpha = pt.alpha;
          ctx.fill();
          ctx.restore();
        }
      });

      // Filter out faded points
      trailPoints.current = trailPoints.current.filter((pt) => pt.alpha > 0);

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
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
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
          cursor: url('/cursor-glass-32.png') 0 0, default !important;
        }
        a, button, [role="button"], [data-cursor-magnetic] {
          cursor: url('/cursor-glass-32.png') 0 0, pointer !important;
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
