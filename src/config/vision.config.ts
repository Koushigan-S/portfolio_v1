export type VisionItem = {
  id: string;
  title: string;
  category: 'goal' | 'company' | 'startup' | 'chapter';
  description: string;
  icon: string;
  status: string;
};

export const visionItems: VisionItem[] = [
  {
    id: 'vision-1',
    title: '[FUTURE GOAL]',
    category: 'goal',
    description: '[Your future goal details — e.g. mastering robotics, building AI systems, or contributing to open source.]',
    icon: '🚀',
    status: 'In Progress',
  },
  {
    id: 'vision-2',
    title: '[DREAM COMPANY]',
    category: 'company',
    description: '[The companies you aspire to collaborate with or work at, and why their mission inspires you.]',
    icon: '🏢',
    status: 'Planned',
  },
  {
    id: 'vision-3',
    title: '[STARTUP IDEA]',
    category: 'startup',
    description: '[A futuristic concept or startup idea that you want to bring to life in the next decade.]',
    icon: '💡',
    status: 'Brainstorming',
  },
  {
    id: 'vision-4',
    title: '[NEXT CHAPTER]',
    category: 'chapter',
    description: '[What lies immediately ahead in your journey — e.g. grad school, research publications, or a new venture.]',
    icon: '📖',
    status: 'Upcoming',
  },
];
