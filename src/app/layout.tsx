import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';

export const metadata: Metadata = {
  title: 'LAN Stream',
  description: 'Internal Video Streaming Network',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <html lang="en" className="h-full">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter&display=swap"
            rel="stylesheet"
          ></link>
        </head>
        <body className="font-body antialiased h-full bg-background">
          {children}
          <Toaster />
        </body>
      </html>
    </AppProvider>
  );
}
