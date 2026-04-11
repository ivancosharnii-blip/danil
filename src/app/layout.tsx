import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { LocaleProvider } from '@/lib/locale-context'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Danil Art — Картины и тату эскизы',
  description:
    'Портфолио художника и тату-мастера. Авторские картины и уникальные тату эскизы.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body
        data-theme="light"
        className="flex min-h-full flex-col bg-[var(--page-bg)] font-sans text-[var(--page-text)] transition-[background-color,color] duration-[400ms] ease-out"
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
