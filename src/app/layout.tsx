//'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { ClientProviders } from '@/components/layout/ClientProviders';
import { ClientAuthProvider } from '@/components/layout/ClientAuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap', preload: true });

export const metadata: Metadata = {
  title: {
    default: 'QarabBabyShop',
    template: '%s | Future Babies'
  },
  description: 'Premium baby clothing and accessories',
  keywords: ['baby clothes', 'children fashion', 'kids wear'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://futurebabies.com',
    siteName: 'Future Babies',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background antialiased ${inter.variable}`}>
        <ClientProviders>
          <ClientAuthProvider>
            <Header />
            {children}
            <Toaster />
          </ClientAuthProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
