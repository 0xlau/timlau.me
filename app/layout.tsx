import './globals.css'
import './clerk.css'
import './prism.css'
import './timlau.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { ThemeProvider } from '~/app/(main)/ThemeProvider'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { zhCN } from '~/lib/clerkLocalizations'
import { sansFont } from '~/lib/font'
import { seo } from '~/lib/seo'

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | Timothy Lau',
    default: seo.title,
  },
  description: seo.description,
  keywords:
    'Timothy,Timothy Lau,码农小易,刘沛强,全栈开发,开发者,开源,细节控,创新',
  manifest: '/site.webmanifest',
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
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | Timothy Lau',
    },
    description: seo.description,
    siteName: 'Timothy Lau',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://timlau.me',
  },
  twitter: {
    site: '@thetimothylau',
    creator: '@thetimothylau',
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  alternates: {
    canonical: url('/'),
    types: {
      'application/rss+xml': [{ url: 'rss', title: 'RSS 订阅' }],
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html
        lang="zh-CN"
        className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
        suppressHydrationWarning
      >
        <body className="flex h-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
        {env.VERCEL_ENV === 'production' &&
          env.NEXT_PUBLIC_UMAMI_URL &&
          env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              defer
              src={env.NEXT_PUBLIC_UMAMI_URL}
              data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            />
          )}
      </html>
    </ClerkProvider>
  )
}
