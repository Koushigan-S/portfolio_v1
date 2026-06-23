export const experienceConfig = {
  features: {
    droneSystem: true,
    particleSystem: true,
    bloom: true,
    depthOfField: true,
    motionBlur: true,
    audio: true,
    projectGalaxy: true,
    timelineCorridor: true,
    achievementVault: true,
    resumeExperience: true,
    developerTerminal: true,
    drone404Scene: true,
  },
  audio: {
    ambientVolume: 0.3,
    sfxVolume: 0.5,
    // Future audio URLs can be added here
    ambientUrl: '',
    droneHoverUrl: '',
    transitionUrl: '',
    hoverUrl: '',
    clickUrl: '',
  },
  resume: {
    pdfPath: '/resume.pdf',
  },
  performance: {
    fpsSamplingInterval: 1000,
    fpsTarget: 60,
    lowFpsThreshold: 35,
    midFpsThreshold: 50,
  }
} as const;

export type ExperienceConfig = typeof experienceConfig;
