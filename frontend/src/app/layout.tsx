import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DevSphere Academy — Master Programming',
    template: '%s | DevSphere Academy',
  },
  description:
    'The most comprehensive platform for learning programming languages, DSA, and competitive coding. Master C, C++, Java, Python, JavaScript with 200+ curated problems.',
  keywords: ['programming', 'DSA', 'LeetCode', 'algorithms', 'coding interview', 'C++', 'Python', 'Java'],
  authors: [{ name: 'DevSphere Academy' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'DevSphere Academy',
    title: 'DevSphere Academy — Master Programming',
    description: 'Structured programming education with 200+ DSA problems, interactive compiler, and language tutorials.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DevSphere Academy' }],
  },
  twitter: { card: 'summary_large_image', title: 'DevSphere Academy', description: 'Master programming with structured courses and 200+ problems.' },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(220, 16%, 12%)',
                color: 'hsl(220, 15%, 92%)',
                border: '1px solid hsl(220, 12%, 20%)',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
