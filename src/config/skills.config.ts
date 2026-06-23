export type SkillCategory = {
  name: string;
  value: number; // 0–100
  color: string;
};

export type TechCategory = {
  name: string;
  icon: string;
  color: string;
  items: { name: string; icon?: string; proficiency?: number }[];
};

/** Radar chart data */
export const skillsRadar: SkillCategory[] = [
  { name: 'Frontend', value: 90, color: '#6366f1' },
  { name: 'Backend', value: 80, color: '#8b5cf6' },
  { name: 'UI/UX', value: 85, color: '#06b6d4' },
  { name: 'Cloud', value: 70, color: '#f59e0b' },
  { name: 'Security', value: 65, color: '#ef4444' },
  { name: 'DSA', value: 75, color: '#10b981' },
  { name: 'AI', value: 80, color: '#ec4899' },
  { name: 'Leadership', value: 70, color: '#f97316' },
];

/** 3D Tech Stack Orbital categories */
export const techStack: TechCategory[] = [
  {
    name: 'Frontend',
    icon: '⚡',
    color: '#6366f1',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
      { name: '[TECH 3]' },
      { name: '[TECH 4]' },
    ],
  },
  {
    name: 'Backend',
    icon: '🔧',
    color: '#8b5cf6',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
      { name: '[TECH 3]' },
    ],
  },
  {
    name: 'Database',
    icon: '🗄️',
    color: '#06b6d4',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
      { name: '[TECH 3]' },
    ],
  },
  {
    name: 'Cloud',
    icon: '☁️',
    color: '#f59e0b',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
    ],
  },
  {
    name: 'AI',
    icon: '🤖',
    color: '#ec4899',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
      { name: '[TECH 3]' },
    ],
  },
  {
    name: 'Security',
    icon: '🔒',
    color: '#ef4444',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
    ],
  },
  {
    name: 'Tools',
    icon: '🛠️',
    color: '#10b981',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
      { name: '[TECH 3]' },
    ],
  },
  {
    name: 'Robotics',
    icon: '🤖',
    color: '#f97316',
    items: [
      { name: '[TECH 1]' },
      { name: '[TECH 2]' },
    ],
  },
];
