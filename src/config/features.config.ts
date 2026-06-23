/**
 * FEATURE FLAGS
 * Toggle any major feature without modifying component code.
 * Set to false to disable an animation/feature entirely.
 */
export const features = {
  /** Full-screen preloader with ∞ symbol */
  preloader: true,

  /** Custom magnetic cursor (disabled on touch devices automatically) */
  customCursor: true,

  /** 3D animated sphere in hero section */
  heroSphere: true,

  /** Hero particle system (name dissolve on scroll) */
  heroParticles: true,

  /** Project Galaxy: solar system experience */
  projectGalaxy: true,

  /** Tech stack 3D orbital carousel */
  techOrbit: true,

  /** Skills radar SVG animation */
  skillsRadar: true,

  /** Journey metro-map SVG path animation */
  journeyMap: true,

  /** Resume 3D unfold animation */
  resumeUnfold: true,

  /** Developer terminal Easter egg (Ctrl + `) */
  developerTerminal: true,

  /** Wireframe mode Easter egg (secret key sequence) */
  wireframeMode: true,

  /** Skeleton runner on 404 page */
  skeleton404: true,

  /** Smooth scroll via Lenis */
  lenisScroll: true,

  /** Floating nav hide/show on scroll */
  navScrollBehavior: true,

  /** Page section reveal animations (Framer Motion whileInView) */
  sectionReveal: true,

  /** GSAP ScrollTrigger for featured showcase */
  scrollTrigger: true,
} as const;

export type FeatureKey = keyof typeof features;

/** Performance tiers for adaptive rendering */
export const performanceTiers = {
  /** Particle count multiplier per tier */
  particles: {
    high: 1.0,
    medium: 0.5,
    low: 0.2,
  },
  /** Enable post-processing effects */
  postProcessing: {
    high: true,
    medium: false,
    low: false,
  },
  /** Shadow quality */
  shadows: {
    high: true,
    medium: false,
    low: false,
  },
  /** Anti-aliasing */
  antialias: {
    high: true,
    medium: true,
    low: false,
  },
} as const;

export type PerformanceTier = 'high' | 'medium' | 'low';
