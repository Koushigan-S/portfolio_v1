'use client';

import { useState } from 'react';
import { Preloader } from '@/components/preloader/Preloader';
import { HeroContent } from '@/components/hero/HeroContent';
import { AboutTimeline } from '@/components/about/AboutTimeline';
import { TechOrbit } from '@/components/tech-stack/TechOrbit';
import { ProjectGalaxy } from '@/components/projects/ProjectGalaxy';
import { JourneyMap } from '@/components/journey/JourneyMap';
import { AchievementsVault } from '@/components/achievements/AchievementsVault';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { ContactSection } from '@/components/contact/ContactSection';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { LabCanvas } from '@/components/lab/LabCanvas';
import { VisionRoom } from '@/components/vision/VisionRoom';
import { useLenis } from '@/hooks/useLenis';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  
  // Initialize smooth scroll Lenis
  useLenis();

  // Initialize the scroll-to-chamber monitoring context hook
  useScrollProgress();

  return (
    <>
      {/* Cinematic intro preloader screen */}
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Main layout overlay */}
      <main
        className="transition-opacity duration-1000 relative z-10"
        style={{ opacity: loaded ? 1 : 0 }}
        aria-label="NOVA LAB chambers"
      >
        {/* Persistent 3D Background canvas space */}
        <LabCanvas />

        {/* Section 0: Lobby Entrance */}
        <HeroContent />

        {/* Section 1: Identity Chamber */}
        <AboutTimeline />

        {/* Section 2: Tech Stack Chamber */}
        <TechOrbit />

        {/* Section 3: Project Galaxy */}
        <ProjectGalaxy />

        {/* Section 4: Timeline Corridor Portals */}
        <JourneyMap />

        {/* Section 5: Achievements Vault */}
        <AchievementsVault />

        {/* Section 6: Future Vision Observation Deck */}
        <VisionRoom />

        {/* Section 7: Resume document card */}
        <ResumeCard />

        {/* Section 8: Exit contact finale */}
        <ContactSection />

        {/* HUD footer dashboard */}
        <footer
          className="py-12 text-center border-t border-white/5 bg-[#020204]/90"
          aria-label="Footer"
        >
          <p className="text-xs font-mono text-[#6b6b7b]">
            NOVA LAB OPERATIONAL · SYSTEM_VERSION: V4.0.0 · © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
