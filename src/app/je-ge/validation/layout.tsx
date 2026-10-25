import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Validation du pass JE-GE',
  robots: { index: false, follow: false },
};

export default function ValidationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
