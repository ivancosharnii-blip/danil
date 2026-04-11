'use client'

import { Suspense } from 'react'
import Image from 'next/image'
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo-black.png"
              alt="Logo"
              width={48}
              height={40}
              style={{ objectFit: 'contain', display: 'block' }}
              className="logo-black"
            />
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={48}
              height={40}
              style={{ objectFit: 'contain', display: 'none' }}
              className="logo-white"
            />
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
