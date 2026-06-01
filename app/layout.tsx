import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'DigitalStackHub - Premium Digital Resources',
    template: '%s | DigitalStackHub',
  },
  description:
    'Access thousands of premium WordPress themes, plugins, PHP scripts, and video courses. Start your free trial today!',
  keywords: [
    'digital resources',
    'wordpress themes',
    'plugins',
    'php scripts',
    'video courses',
    'membership',
    'subscription',
  ],
  authors: [{ name: 'DigitalStackHub' }],
  creator: 'DigitalStackHub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'DigitalStackHub',
    title: 'DigitalStackHub - Premium Digital Resources',
    description:
      'Access thousands of premium WordPress themes, plugins, PHP scripts, and video courses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DigitalStackHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigitalStackHub - Premium Digital Resources',
    description:
      'Access thousands of premium WordPress themes, plugins, PHP scripts, and video courses.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Theme script – prevents flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: 
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            ,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
