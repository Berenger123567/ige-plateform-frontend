import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: 'IGE - Innovation en Génie Electrique | EPAC, Bénin',
  description: 'Association des étudiants en génie électrique de l’EPAC. Innovation, projets techniques, événements et formation au Bénin.',
  keywords: ['génie électrique', 'innovation', 'EPAC', 'Bénin', 'étudiants', 'projets', 'technologie', 'électronique', 'automatique', 'énergie'],
  authors: [{ name: 'IGE - Innovation en Génie Electrique' }],
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
    title: 'IGE - Innovation en Génie Electrique | EPAC, Bénin',
    description: 'Association des étudiants en génie électrique de l’EPAC. Innovation, projets techniques, événements et formation au Bénin.',
    siteName: 'IGE - Innovation en Génie Electrique',
    images: [
      {
        url: '/IGE_carre_noir_sur_blanc_new.png',
        width: 1200,
        height: 630,
        alt: 'IGE - Innovation en Génie Electrique',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGE - Innovation en Génie Electrique | EPAC, Bénin',
    description: 'Association des étudiants en génie électrique de l’EPAC. Innovation, projets techniques, événements et formation au Bénin.',
    creator: '@IGE_EPAC',
    images: ['/IGE_carre_noir_sur_blanc_new.png'],
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
    icon: '/IGE_cercle_noir sur_blanc.png',
    shortcut: '/IGE_cercle_noir sur_blanc.png',
    apple: '/IGE_cercle_noir sur_blanc.png',
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
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-ige-teal selection:text-white antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
