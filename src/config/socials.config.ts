export const socials = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourhandle',
  instagram: 'https://instagram.com/yourhandle',
  email: 'your@email.com',
} as const;

export type SocialKey = keyof typeof socials;
