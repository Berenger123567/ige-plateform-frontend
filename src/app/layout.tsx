import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: 'IGE - Innovation en Génie Électrique | EPAC, Bénin',
  description: 'Association des étudiants en Génie Électrique de l\'EPAC. Innovation, projets techniques, événements et formation au Bénin.',
  keywords: ['génie électrique', 'innovation', 'EPAC', 'Bénin', 'étudiants', 'projets', 'technologie', 'électronique', 'automatique', 'énergie'],
  authors: [{ name: 'IGE - Innovation en Génie Électrique' }],
  creator: 'IGE-EPAC',
  publisher: 'IGE-EPAC',
  metadataBase: new URL('https://ige-epac.bj'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ige-epac.bj',
    title: 'IGE - Innovation en Génie Électrique | EPAC, Bénin',
    description: 'Association des étudiants en Génie Électrique de l\'EPAC. Innovation, projets techniques, événements et formation au Bénin.',
    siteName: 'IGE - Innovation en Génie Électrique',
    images: [
      {
        url: '/logo-ige-white.png',
        width: 1200,
        height: 630,
        alt: 'IGE - Innovation en Génie Électrique',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGE - Innovation en Génie Électrique | EPAC, Bénin',
    description: 'Association des étudiants en Génie Électrique de l\'EPAC. Innovation, projets techniques, événements et formation au Bénin.',
    creator: '@IGE_EPAC',
    images: ['/logo-ige-white.png'],
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
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/logo-ige-white.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-ige-green selection:text-white antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
