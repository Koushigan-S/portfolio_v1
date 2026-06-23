export const siteConfig = {
  name: '[YOUR NAME]',
  title: '[YOUR TITLE]',
  tagline: '[YOUR TAGLINE — e.g. "Crafting digital experiences at the intersection of design & code"]',
  description:
    '[YOUR PORTFOLIO DESCRIPTION — A full-stack developer and designer building premium digital experiences.]',
  url: 'https://your-domain.com',
  ogImage: '/og-image.png',
  email: 'your@email.com',
  resumeUrl: '/resume.pdf',

  /** Open Graph */
  og: {
    title: '[YOUR NAME] — Portfolio',
    description: '[YOUR TAGLINE]',
    image: '/og-image.png',
    type: 'website',
  },

  /** Twitter / X */
  twitter: {
    card: 'summary_large_image',
    title: '[YOUR NAME] — Portfolio',
    description: '[YOUR TAGLINE]',
    image: '/og-image.png',
    creator: '@yourhandle',
  },

  /** Structured Data */
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '[YOUR NAME]',
    url: 'https://your-domain.com',
    jobTitle: '[YOUR TITLE]',
    sameAs: [
      'https://github.com/yourusername',
      'https://linkedin.com/in/yourusername',
    ],
  },
} as const;
