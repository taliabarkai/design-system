import type { Metadata, Viewport } from 'next';
import { Work_Sans } from 'next/font/google';
import '@/styles/globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Tenengroup Sites Design System',
  description:
    'Multi-brand design system: OAL (Oak & Luna), LAL (Lime & Lou), IB, TGR, MNN',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={workSans.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vle4ewv.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
