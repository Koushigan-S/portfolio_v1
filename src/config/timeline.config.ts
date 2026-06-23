export type TimelineEntry = {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
  classified?: boolean;
};

export type JourneyPhase = {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  details: string[];
  icon?: string;
};

/** About section timeline */
export const aboutTimeline: TimelineEntry[] = [
  {
    id: 'birth',
    year: '[BIRTH YEAR]',
    title: 'The Beginning',
    subtitle: '[CITY, COUNTRY]',
    description:
      '[A short story about your early life, first encounter with computers, or what sparked your curiosity.]',
    icon: '🌟',
  },
  {
    id: 'education-1',
    year: '[YEAR]',
    title: '[SCHOOL / EARLY EDUCATION]',
    subtitle: '[LOCATION]',
    description: '[What you learned, discovered, or accomplished during this time.]',
    icon: '📖',
  },
  {
    id: 'college',
    year: '[YEAR]',
    title: '[COLLEGE / UNIVERSITY]',
    subtitle: '[DEGREE PROGRAM]',
    description:
      '[Your college journey — projects, clubs, breakthroughs, and the skills you built.]',
    icon: '🎓',
  },
  {
    id: 'project-milestone',
    year: '[YEAR]',
    title: '[MAJOR PROJECT / INTERNSHIP]',
    subtitle: '[COMPANY / TEAM]',
    description:
      '[The project or role that changed how you think about engineering and design.]',
    icon: '🚀',
  },
  {
    id: 'future',
    year: '[FUTURE]',
    title: '[YOUR AMBITION]',
    subtitle: '[WHERE YOU ARE HEADED]',
    description: '[The problem you want to solve, the company you want to build, or the impact you want to make.]',
    icon: '🔭',
  },
  {
    id: 'classified',
    year: '????',
    title: 'CLASSIFIED',
    subtitle: 'LEVEL 5 CLEARANCE REQUIRED',
    description: 'This information is classified.',
    icon: '🔒',
    classified: true,
  },
];

/** Journey section roadmap phases */
export const journeyPhases: JourneyPhase[] = [
  {
    id: 'phase-1',
    phase: 'Phase 01',
    title: '[PHASE 1 TITLE]',
    subtitle: '[YEAR RANGE]',
    description: '[What this phase represents in your journey]',
    status: 'completed',
    details: ['[KEY ACHIEVEMENT 1]', '[KEY ACHIEVEMENT 2]', '[KEY ACHIEVEMENT 3]'],
    icon: '⚡',
  },
  {
    id: 'phase-2',
    phase: 'Phase 02',
    title: '[PHASE 2 TITLE]',
    subtitle: '[YEAR RANGE]',
    description: '[What this phase represents]',
    status: 'completed',
    details: ['[KEY ACHIEVEMENT 1]', '[KEY ACHIEVEMENT 2]'],
    icon: '🛠️',
  },
  {
    id: 'phase-3',
    phase: 'Phase 03',
    title: '[PHASE 3 TITLE]',
    subtitle: '[CURRENT YEAR]',
    description: '[What you are doing right now]',
    status: 'current',
    details: ['[CURRENT FOCUS 1]', '[CURRENT FOCUS 2]', '[CURRENT FOCUS 3]'],
    icon: '🚀',
  },
  {
    id: 'phase-4',
    phase: 'Phase 04',
    title: '[PHASE 4 TITLE]',
    subtitle: '[FUTURE YEAR]',
    description: '[Your near-term goal]',
    status: 'upcoming',
    details: ['[PLANNED MILESTONE 1]', '[PLANNED MILESTONE 2]'],
    icon: '🔭',
  },
  {
    id: 'phase-5',
    phase: 'Phase 05',
    title: '[PHASE 5 TITLE]',
    subtitle: '[FUTURE YEAR]',
    description: '[Your long-term vision]',
    status: 'upcoming',
    details: ['[VISION 1]', '[VISION 2]'],
    icon: '🌌',
  },
];
