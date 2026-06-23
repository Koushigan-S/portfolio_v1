'use client';

import { useEffect } from 'react';
import { useDrone } from '@/contexts/DroneContext';

export function useScrollProgress() {
  const {
    setCurrentSection,
    setScrollProgress,
    setTotalScrollProgress,
  } = useDrone();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate total progress
      const totalProg = docHeight > 0 ? scrollY / docHeight : 0;
      setTotalScrollProgress(totalProg);

      // Identify active section and section progress
      const sectionIds = [
        'home',
        'about',
        'tech-stack',
        'projects',
        'timeline',
        'achievements',
        'vision',
        'contact',
      ];

      const elements = sectionIds.map(id => document.getElementById(id));
      
      let activeIndex = 0;
      let minDistance = Infinity;

      elements.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        // Find the section that covers the center of the viewport
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          activeIndex = index;
        } else if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      // Calculate progress within active section
      const activeEl = elements[activeIndex];
      let activeProg = 0;

      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        const start = scrollY + rect.top - window.innerHeight;
        const end = scrollY + rect.bottom;
        const totalHeight = end - start;
        
        if (totalHeight > 0) {
          activeProg = Math.max(0, Math.min(1, (scrollY - start) / totalHeight));
        }
      }

      setCurrentSection(activeIndex);
      setScrollProgress(activeProg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setCurrentSection, setScrollProgress, setTotalScrollProgress]);
}
