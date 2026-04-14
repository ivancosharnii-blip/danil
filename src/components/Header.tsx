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
  const [menuOpen, setMenuOpen] = useState(false)
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
    <header className="sticky top-0 z-[100] border-b border-[var(--page-text)]/10 bg-[var(--page-header-bg)] py-2 backdrop-blur-md transition-[background-color,border-color] duration-[400ms] ease-out">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <nav
            className="flex flex-wrap items-center gap-3 text-sm font-medium tracking-wide text-[var(--page-muted)] md:gap-6"
            style={{
              gridColumn: isDark ? 3 : 1,
              gridRow: 1,
              justifySelf: isDark ? 'end' : 'start',
              opacity: navOpacity,
              transition: 'opacity 0.3s',
            }}
          >
            <div className="flex gap-1">
              {FLAGS.map(({ locale: l, flag }) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`cursor-pointer border-0 bg-transparent p-0.5 text-base leading-none transition-opacity md:text-[1.2rem] ${locale === l ? 'opacity-100' : 'opacity-40'}`}
                >
                  {flag}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href={`/portfolio${tabParam ? `?tab=${tabParam}` : ''}`}
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
            <Link href="/" className="flex justify-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current p-2 md:h-20 md:w-20 md:p-3">
                <Image
                  src="/logo-black.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="logo-black h-8 w-8 object-contain md:h-11 md:w-11"
                />
                <Image
                  src="/logo-white.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="logo-white h-8 w-8 object-contain md:h-11 md:w-11"
                />
              </div>
            </Link>
          </div>
          <div
            style={{
              gridColumn: isDark ? 1 : 3,
              gridRow: 1,
              justifySelf: isDark ? 'start' : 'end',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'currentColor', padding: '4px' }}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              borderTop: '1px solid rgba(0,0,0,0.1)',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Link
              href={`/portfolio${tabParam ? `?tab=${tabParam}` : ''}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'currentColor', textDecoration: 'none' }}
            >
              {translations[locale].portfolio}
            </Link>
            <Link
              href="/contacts"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'currentColor', textDecoration: 'none' }}
            >
              {translations[locale].contacts}
            </Link>
          </div>
        )}

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
    <header className="sticky top-0 z-[100] border-b border-[var(--page-text)]/10 bg-[var(--page-header-bg)] py-2 backdrop-blur-md">
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
