import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import '@/styles/globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tenengroup Sites Design System',
  description:
    'Multi-brand design system: OAL (Oak & Luna), LAL (Lime & Lou), IB, TGR, MNN',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={workSans.variable}>
      <body>{children}</body>
    </html>
  );
}
