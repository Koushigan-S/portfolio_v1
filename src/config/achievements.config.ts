export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  category: 'certificate' | 'hackathon' | 'award' | 'academic' | 'competition';
  link?: string;
  icon?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '[CERTIFICATE TITLE]',
    issuer: '[ISSUING ORGANIZATION]',
    date: '[YEAR]',
    description: '[Description of what you learned or achieved]',
    category: 'certificate',
    link: 'https://certificate-link.com',
    icon: '🏅',
  },
  {
    id: 'ach-2',
    title: '[HACKATHON NAME]',
    issuer: '[ORGANIZER]',
    date: '[YEAR]',
    description: '[What you built, what rank you achieved]',
    category: 'hackathon',
    icon: '🚀',
  },
  {
    id: 'ach-3',
    title: '[AWARD NAME]',
    issuer: '[AWARDING BODY]',
    date: '[YEAR]',
    description: '[What the award recognizes]',
    category: 'award',
    icon: '🏆',
  },
  {
    id: 'ach-4',
    title: 'CGPA [X.XX]',
    issuer: '[YOUR UNIVERSITY]',
    date: '[YEAR]',
    description: 'Maintained a top CGPA throughout [PROGRAM NAME]',
    category: 'academic',
    icon: '📚',
  },
  {
    id: 'ach-5',
    title: '[COMPETITION NAME]',
    issuer: '[ORGANIZER]',
    date: '[YEAR]',
    description: '[What you competed in, your result]',
    category: 'competition',
    icon: '⚡',
  },
];

export const achievementCategories = [
  { key: 'all', label: 'All' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'award', label: 'Awards' },
  { key: 'academic', label: 'Academic' },
  { key: 'competition', label: 'Competitions' },
] as const;
