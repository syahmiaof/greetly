import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              let theme = localStorage.getItem('app-theme') || 'aurora';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col md:flex-row text-slate-100 bg-transparent">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 z-10 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
