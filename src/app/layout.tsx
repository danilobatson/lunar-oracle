import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NEXUS - The Quantum Owl | Predictive Crypto Intelligence',
  description: 'Democratizing institutional-grade crypto intelligence through mystical AI oracle. Get predictive social signals, whale tracking, and viral trend analysis.',
  keywords: ['crypto', 'cryptocurrency', 'AI', 'prediction', 'social intelligence', 'whale tracking', 'AIXBT alternative'],
  authors: [{ name: 'Danilo Batson', url: 'https://danilobatson.github.io' }],
  creator: 'Danilo Batson',
  openGraph: {
    title: 'NEXUS - The Quantum Owl',
    description: 'Predictive crypto intelligence that beats AIXBT at 1/100th the cost',
    url: 'https://nexus-quantum-owl.com',
    siteName: 'NEXUS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS - The Quantum Owl',
    description: 'Predictive crypto intelligence for everyone',
    creator: '@jamaalbuilds',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
