import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Real-time Student Attendance',
  description: 'A monitoring dashboard for student attendance using Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col md:flex-row text-slate-100 bg-transparent relative">
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              let theme = localStorage.getItem('app-theme') || 'startup';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          `}
        </Script>
        
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 z-10 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
