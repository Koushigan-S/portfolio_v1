'use client';

import { useEffect, useState } from 'react';
import { features } from '@/config/features.config';

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    if (!features.navScrollBehavior) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      setAtTop(scrollY < 10);

      if (scrollY < lastScrollY) {
        setScrollDir('up');
      } else if (scrollY > lastScrollY + 4) {
        setScrollDir('down');
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDir, atTop };
}
