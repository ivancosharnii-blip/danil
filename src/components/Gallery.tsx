'use client'

import { useEffect, useState } from 'react'
import type { Work, WorkType } from '@/types'
import WorkCard from './WorkCard'

interface GalleryProps {
  works: Work[]
}

const tabs: { key: WorkType; label: string }[] = [
  { key: 'painting', label: 'Картины' },
  { key: 'tattoo', label: 'Тату эскизы' },
]

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
  const [activeTab, setActiveTab] = useState<WorkType>('painting')

  useEffect(() => {
    document.body.setAttribute(
      'data-theme',
      activeTab === 'painting' ? 'light' : 'dark',
    )
  }, [activeTab])

  const filtered = works.filter((w) => w.type === activeTab)

  return (
    <section id="gallery" className="w-full">
      <div className="mb-8 flex flex-wrap justify-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative rounded-none border-0 bg-transparent px-1 py-2 text-sm font-medium tracking-wide transition-colors ${
              activeTab === tab.key
                ? "text-[var(--page-text)] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--page-accent)] after:content-['']"
                : 'text-[var(--page-muted)] hover:text-[var(--page-text)]'
            } `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-[var(--page-muted)]">
          Пока нет работ в этой категории
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </section>
  )
}
