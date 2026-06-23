'use client';

import { useEffect, useRef, useState } from 'react';
import { experienceConfig } from '@/config/experience.config';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorCurrent = useRef({ x: 0, y: 0 });
  const trailPoints = useRef<TrailPoint[]>([]);
  const isHovered = useRef(false);
  const isClicking = useRef(false);
  const hoverType = useRef<'normal' | 'magnetic' | 'canvas3d'>('normal');

  useEffect(() => {
    // Avoid running cursor on touch-only devices
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!canvas || !ring) return;

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
      if (ring) ring.style.transform = 'translate(-50%, -50%) scale(0.7)';
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      if (ring) ring.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Handles magnetic effect
    let magneticElement: HTMLElement | null = null;
    let magneticBounds: DOMRect | null = null;

    const handleElementHover = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      isHovered.current = true;
      ring?.classList.add('expanded');

      if (target.hasAttribute('data-cursor-magnetic')) {
        hoverType.current = 'magnetic';
        magneticElement = target;
        magneticBounds = target.getBoundingClientRect();
      } else if (target.hasAttribute('data-cursor-3d')) {
        hoverType.current = 'canvas3d';
        ring?.classList.add('crosshair');
      } else {
        hoverType.current = 'normal';
      }
    };

    const handleElementLeave = () => {
      isHovered.current = false;
      hoverType.current = 'normal';
      magneticElement = null;
      magneticBounds = null;
      ring?.classList.remove('expanded');
      ring?.classList.remove('crosshair');
    };

    // Main animation loop
    let rafId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle magnetic snapping
      if (hoverType.current === 'magnetic' && magneticElement && magneticBounds) {
        const centerX = magneticBounds.left + magneticBounds.width / 2;
        const centerY = magneticBounds.top + magneticBounds.height / 2;
        
        // Snap cursor target closer to element center
        cursorTarget.current.x = centerX + (mousePos.current.x - centerX) * 0.35;
        cursorTarget.current.y = centerY + (mousePos.current.y - centerY) * 0.35;

        // Also magnetic pull visual element itself
        const deltaX = (mousePos.current.x - centerX) * 0.2;
        const deltaY = (mousePos.current.y - centerY) * 0.2;
        magneticElement.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      } else if (magneticElement) {
        // Reset transformation when element is no longer snapped
        magneticElement.style.transform = '';
        magneticElement = null;
      }

      // Smooth current cursor position
      cursorCurrent.current.x += (cursorTarget.current.x - cursorCurrent.current.x) * 0.12;
      cursorCurrent.current.y += (cursorTarget.current.y - cursorCurrent.current.y) * 0.12;

      // Update HTML ring position
      if (ring) {
        ring.style.left = `${cursorCurrent.current.x}px`;
        ring.style.top = `${cursorCurrent.current.y}px`;
      }

      // Generate tail points if not hover screen corners
      if (experienceConfig.features.particleSystem && cursorCurrent.current.x > 0 && cursorCurrent.current.y > 0) {
        trailPoints.current.push({
          x: cursorCurrent.current.x,
          y: cursorCurrent.current.y,
          alpha: 1.0,
          size: isClicking.current ? 3 : 5,
        });
      }

      // Draw and decay particle trails
      trailPoints.current.forEach((pt, idx) => {
        pt.alpha -= 0.05; // Fade over time
        pt.size *= 0.95; // Shrink
        
        if (pt.alpha > 0) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${pt.alpha * 0.4})`; // Electric blue
          ctx.fill();
        }
      });

      // Filter out faded points
      trailPoints.current = trailPoints.current.filter((pt) => pt.alpha > 0);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Apply event listeners to interactive items
    const setupInteractions = () => {
      const els = document.querySelectorAll('a, button, [role="button"], [data-cursor-magnetic], [data-cursor-3d]');
      els.forEach((el) => {
        el.addEventListener('mouseenter', handleElementHover as any);
        el.addEventListener('mouseleave', handleElementLeave as any);
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
      const els = document.querySelectorAll('a, button, [role="button"], [data-cursor-magnetic]');
      els.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementHover as any);
        el.removeEventListener('mouseleave', handleElementLeave as any);
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
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          border: '1.5px solid rgba(59, 130, 246, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s, border-color 0.3s',
        }}
      />
      <style jsx global>{`
        body {
          cursor: none !important;
        }
        a, button, [role="button"], input, select, textarea {
          cursor: none !important;
        }
        .cursor-ring.expanded {
          width: 56px;
          height: 56px;
          background-color: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.9);
        }
        .cursor-ring.crosshair::before,
        .cursor-ring.crosshair::after {
          content: '';
          position: absolute;
          background: rgba(59, 130, 246, 0.8);
        }
        .cursor-ring.crosshair::before {
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
        }
        .cursor-ring.crosshair::after {
          left: 50%;
          top: 0;
          width: 1px;
          height: 100%;
        }
      `}</style>
    </>
  );
}
