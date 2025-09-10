import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthSessionProvider from '@/components/providers/SessionProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Springz Nutrition - Science-grade nutrition. Everyday taste.',
  description: 'Clean, high-digestibility plant protein for real-world performance. DIAAS-100% formulation for superior amino acid availability.',
  keywords: 'plant protein, nutrition, supplements, health, fitness, clean label',
  authors: [{ name: 'Springz Nutrition' }],
  openGraph: {
    title: 'Springz Nutrition',
    description: 'Science-grade nutrition. Everyday taste.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          {children}
          <ToasterProvider />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
