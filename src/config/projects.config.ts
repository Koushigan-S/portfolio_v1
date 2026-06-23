export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'web' | 'mobile' | 'ai' | 'systems' | 'design' | 'other';
  thumbnail: string;
  screenshots: string[];
  techStack: string[];
  features: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  /** Orbital position for Project Galaxy (0–360 degrees) */
  orbitAngle?: number;
  /** Planet color in the solar system */
  planetColor?: string;
  planetSize?: number;
};

export const projects: Project[] = [
  {
    id: 'project-1',
    name: '[PROJECT 1]',
    tagline: '[Short compelling tagline]',
    description:
      '[Detailed description of the project — what it does, the problem it solves, and the impact it made.]',
    category: 'web',
    thumbnail: '/projects/project-1-thumb.png',
    screenshots: [
      '/projects/project-1-1.png',
      '/projects/project-1-2.png',
      '/projects/project-1-3.png',
    ],
    techStack: ['[TECH 1]', '[TECH 2]', '[TECH 3]'],
    features: ['[FEATURE 1]', '[FEATURE 2]', '[FEATURE 3]'],
    github: 'https://github.com/yourusername/project-1',
    demo: 'https://project-1.com',
    featured: true,
    orbitAngle: 0,
    planetColor: '#6366f1',
    planetSize: 1.2,
  },
  {
    id: 'project-2',
    name: '[PROJECT 2]',
    tagline: '[Short compelling tagline]',
    description: '[Detailed project description]',
    category: 'ai',
    thumbnail: '/projects/project-2-thumb.png',
    screenshots: ['/projects/project-2-1.png'],
    techStack: ['[TECH 1]', '[TECH 2]'],
    features: ['[FEATURE 1]', '[FEATURE 2]'],
    github: 'https://github.com/yourusername/project-2',
    featured: true,
    orbitAngle: 72,
    planetColor: '#8b5cf6',
    planetSize: 1.0,
  },
  {
    id: 'project-3',
    name: '[PROJECT 3]',
    tagline: '[Short compelling tagline]',
    description: '[Detailed project description]',
    category: 'mobile',
    thumbnail: '/projects/project-3-thumb.png',
    screenshots: ['/projects/project-3-1.png'],
    techStack: ['[TECH 1]', '[TECH 2]'],
    features: ['[FEATURE 1]', '[FEATURE 2]'],
    demo: 'https://project-3.com',
    featured: false,
    orbitAngle: 144,
    planetColor: '#06b6d4',
    planetSize: 0.8,
  },
  {
    id: 'project-4',
    name: '[PROJECT 4]',
    tagline: '[Short compelling tagline]',
    description: '[Detailed project description]',
    category: 'systems',
    thumbnail: '/projects/project-4-thumb.png',
    screenshots: ['/projects/project-4-1.png'],
    techStack: ['[TECH 1]', '[TECH 2]'],
    features: ['[FEATURE 1]', '[FEATURE 2]'],
    github: 'https://github.com/yourusername/project-4',
    featured: false,
    orbitAngle: 216,
    planetColor: '#f59e0b',
    planetSize: 0.9,
  },
  {
    id: 'project-5',
    name: '[PROJECT 5]',
    tagline: '[Short compelling tagline]',
    description: '[Detailed project description]',
    category: 'design',
    thumbnail: '/projects/project-5-thumb.png',
    screenshots: ['/projects/project-5-1.png'],
    techStack: ['[TECH 1]', '[TECH 2]'],
    features: ['[FEATURE 1]', '[FEATURE 2]'],
    demo: 'https://project-5.com',
    featured: false,
    orbitAngle: 288,
    planetColor: '#10b981',
    planetSize: 0.7,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
