import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { FloatingNav } from '@/components/nav/FloatingNav';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { DeveloperTerminal } from '@/components/easter-eggs/DeveloperTerminal';


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Portfolio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    siteConfig.title,
    'portfolio',
    'developer',
    'designer',
    'full-stack',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.og.title,
    description: siteConfig.og.description,
    images: [
      {
        url: siteConfig.og.image,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Portfolio`,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card as 'summary_large_image',
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    creator: siteConfig.twitter.creator,
    images: [siteConfig.twitter.image],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

import { DroneProvider } from '@/contexts/DroneContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Clash Display via CDN */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteConfig.structuredData),
          }}
        />
      </head>
      <body>
        <DroneProvider>
          <CustomCursor />
          <FloatingNav />
          {children}
          <DeveloperTerminal />
        </DroneProvider>
      </body>
    </html>
  );
}
