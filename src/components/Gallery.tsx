'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import type { Work, WorkType } from '@/types'
import InkTransition from './SymbioteTransition'

interface GalleryProps {
  works: Work[]
}

export function BodyThemeFromWorkType({ type }: { type: WorkType }) {
  useEffect(() => {
    document.body.setAttribute(
      'data-theme',
      type === 'painting' ? 'light' : 'dark',
    )
    return () => {
      document.body.setAttribute('data-theme', 'light')
    }
  }, [type])
  return null
}

export default function Gallery({ works }: GalleryProps) {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<WorkType>('painting')
  const [transitioning, setTransitioning] = useState(false)
  const [pendingTab, setPendingTab] = useState<WorkType | null>(null)
  const isFirstUrlSync = useRef(true)
  const activeTabRef = useRef<WorkType>(activeTab)
  const transitioningRef = useRef(false)

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  useEffect(() => {
    transitioningRef.current = transitioning
  }, [transitioning])

  useEffect(() => {
    document.body.setAttribute(
      'data-theme',
      activeTab === 'painting' ? 'light' : 'dark',
    )
  }, [activeTab])

  useEffect(() => {
    const t = searchParams.get('tab') === 'tattoo' ? 'tattoo' : 'painting'
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false
      setActiveTab(t)
      activeTabRef.current = t
      return
    }
    if (t === activeTabRef.current) return
    if (transitioningRef.current) return
    setPendingTab(t)
    setTransitioning(true)
  }, [searchParams])

  const filtered = works.filter((w) => w.type === activeTab)

  return (
    <>
      <InkTransition
        onMidpoint={() => { if (pendingTab) setActiveTab(pendingTab) }}
        onComplete={() => { setTransitioning(false); setPendingTab(null) }}
        active={transitioning}
        color={pendingTab === 'tattoo' ? '#0a0a0a' : '#f5f5f3'}
      />

      <section id="gallery" className="mt-8 w-full max-w-none">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-[var(--page-muted)]">
            {t(locale, 'noWorks')}
          </p>
        ) : (
          <div
            className={`${
              activeTab === 'painting'
                ? 'flex w-full flex-col gap-[2px] md:px-16 lg:px-24'
                : 'grid grid-cols-2 md:grid-cols-3 gap-1 px-4'
            }`}
          >
            {filtered.map((work, index) => (
              <FeedItem
                key={work.id}
                work={work}
                isTattoo={activeTab === 'tattoo'}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function FeedItem({ work, isTattoo, index }: { work: Work; isTattoo: boolean; index: number }) {
  const { locale } = useLocale()
  return (
    <Link
      href={`/work/${work.id}?tab=${isTattoo ? 'tattoo' : 'painting'}`}
      className="group relative block w-full animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      <div
        className={`relative w-full bg-zinc-200 ${isTattoo ? 'aspect-square' : 'aspect-video'}`}
      >
        <Image
          src={work.image_url}
          alt={work.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        {!work.is_available && (
          <span className="absolute top-3 right-3 z-10 bg-black/75 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white uppercase">
            {t(locale, 'sold')}
          </span>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-16 pb-4 pl-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:pt-20 sm:pb-5 sm:pl-6"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-[2] px-4 pb-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:px-6 sm:pb-5">
          <h2 className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl md:text-4xl">
            {work.title}
          </h2>
          <p className="mt-0.5 font-heading text-lg tracking-wide text-white/90 sm:text-xl">
            {work.price != null ? `${work.price} ₴` : t(locale, 'priceOnRequest')}
          </p>
        </div>
      </div>
    </Link>
  )
}
