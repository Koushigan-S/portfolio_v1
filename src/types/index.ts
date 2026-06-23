export type PerformanceTier = 'high' | 'medium' | 'low';

export interface SectionId {
  home: 'home';
  journey: 'journey';
  projects: 'projects';
  skills: 'skills';
  achievements: 'achievements';
  resume: 'resume';
  contact: 'contact';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TerminalCommand {
  command: string;
  output: string | string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}
