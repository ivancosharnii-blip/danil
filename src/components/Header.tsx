'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const GALLERY_TABS = [
  { key: 'painting' as const, label: 'Картины' },
  { key: 'tattoo' as const, label: 'Тату эскизы' },
]

function HeaderInner() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isHome = pathname === '/'
  const tabParam = searchParams.get('tab')
  const activeGalleryTab = tabParam === 'tattoo' ? 'tattoo' : 'painting'

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--page-text)]/10 bg-[var(--page-header-bg)] py-4 backdrop-blur-md transition-[background-color,border-color] duration-[400ms] ease-out">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-block shrink-0 text-[var(--page-text)] transition-opacity hover:opacity-80"
          >
            <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="32" fontFamily="serif" fontSize="36" fontWeight="700" fill="currentColor" letterSpacing="-1">DA</text>
              <line x1="0" y1="42" x2="120" y2="42" stroke="currentColor" strokeWidth="1.5"/>
              <text x="0" y="48" fontFamily="sans-serif" fontSize="8" fill="currentColor" letterSpacing="4">ART STUDIO</text>
            </svg>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-6 text-sm font-medium tracking-wide text-[var(--page-muted)]">
            <Link
              href="/portfolio"
              className="text-[var(--page-text)] transition-colors hover:text-[var(--page-accent)]"
            >
              Портфолио
            </Link>
            <Link
              href="/contacts"
              className="text-[var(--page-text)] transition-colors hover:text-[var(--page-accent)]"
            >
              Контакты
            </Link>
          </nav>
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
                {tab.label}
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
