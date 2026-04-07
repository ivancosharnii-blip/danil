'use client'

import { useState } from 'react'
import type { Work, WorkType } from '@/types'
import WorkCard from './WorkCard'

interface GalleryProps {
  works: Work[]
}

const tabs: { key: WorkType; label: string }[] = [
  { key: 'painting', label: 'Картины' },
  { key: 'tattoo', label: 'Тату эскизы' },
]

export default function Gallery({ works }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<WorkType>('painting')

  const filtered = works.filter((w) => w.type === activeTab)

  return (
    <section id="gallery" className="w-full">
      <div className="mb-8 flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          Пока нет работ в этой категории
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </section>
  )
}
