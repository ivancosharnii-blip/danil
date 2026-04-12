'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'
import { translations, type Locale } from '@/lib/i18n'

const GALLERY_TABS = [
  { key: 'painting' as const, labelKey: 'paintings' as const },
  { key: 'tattoo' as const, labelKey: 'tattoo' as const },
]

const FLAGS: { locale: Locale; flag: string }[] = [
  { locale: 'ru', flag: '🇷🇺' },
  { locale: 'en', flag: '🇬🇧' },
  { locale: 'cs', flag: '🇨🇿' },
]

function HeaderInner() {
  const { locale, setLocale } = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isHome = pathname === '/'
  const tabParam = searchParams.get('tab')
  const activeGalleryTab = tabParam === 'tattoo' ? 'tattoo' : 'painting'

  const [isDark, setIsDark] = useState(false)
  const [navOpacity, setNavOpacity] = useState(1)
  const prevIsDarkRef = useRef<boolean | null>(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] })
    setIsDark(document.body.getAttribute('data-theme') === 'dark')
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (prevIsDarkRef.current === null) {
      prevIsDarkRef.current = isDark
      return
    }
    if (prevIsDarkRef.current === isDark) return
    prevIsDarkRef.current = isDark
    setNavOpacity(0)
    const id = window.setTimeout(() => setNavOpacity(1), 300)
    return () => clearTimeout(id)
  }, [isDark])

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--page-text)]/10 bg-[var(--page-header-bg)] py-4 backdrop-blur-md transition-[background-color,border-color] duration-[400ms] ease-out">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <nav
            className="flex flex-wrap items-center gap-6 text-sm font-medium tracking-wide text-[var(--page-muted)]"
            style={{
              gridColumn: isDark ? 3 : 1,
              gridRow: 1,
              justifySelf: isDark ? 'end' : 'start',
              opacity: navOpacity,
              transition: 'opacity 0.3s',
            }}
          >
            <Link
              href="/portfolio"
              className="text-[var(--page-text)] transition-colors hover:text-[var(--page-accent)]"
            >
              {translations[locale].portfolio}
            </Link>
            <Link
              href="/contacts"
              className="text-[var(--page-text)] transition-colors hover:text-[var(--page-accent)]"
            >
              {translations[locale].contacts}
            </Link>
            <div style={{ display: 'flex', gap: '4px' }}>
              {FLAGS.map(({ locale: l, flag }) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: locale === l ? 1 : 0.4,
                    padding: '2px 4px',
                  }}
                >
                  {flag}
                </button>
              ))}
            </div>
          </nav>
          <div
            style={{
              gridColumn: 2,
              gridRow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link href="/" style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '1.5px solid currentColor',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/logo-black.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                  className="logo-black"
                />
                <Image
                  src="/logo-white.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                  className="logo-white"
                />
              </div>
            </Link>
          </div>
          <div style={{ gridColumn: isDark ? 1 : 3, gridRow: 1 }} aria-hidden />
        </div>

        {isHome ? (
          <nav className="flex flex-wrap justify-center gap-8 border-t border-[var(--page-text)]/10 pt-4 text-sm font-medium tracking-wide">
            {GALLERY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => router.push(`/?tab=${tab.key}`)}
                className={`relative rounded-none border-0 bg-transparent px-1 py-2 transition-colors ${
                  activeGalleryTab === tab.key
                    ? "text-[var(--page-text)] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--page-accent)] after:content-['']"
                    : 'text-[var(--page-muted)] hover:text-[var(--page-text)]'
                } `}
              >
                {translations[locale][tab.labelKey]}
              </button>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--page-text)]/10 bg-[var(--page-header-bg)] py-4 backdrop-blur-md">
      <div className="mx-auto h-12 max-w-6xl px-6" aria-hidden />
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderInner />
    </Suspense>
  )
}
