'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Work } from '@/types'
import ContactButtons from '@/components/ContactButtons'
import WorkInquiryCTA from '@/components/WorkInquiryCTA'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export default function WorkDetail({ work }: { work: Work }) {
  const { locale } = useLocale()

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 transition-[color] duration-[400ms]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--page-muted)] transition-colors hover:text-[var(--page-text)]"
      >
        <ArrowLeft size={16} />
        {t(locale, 'back')}
      </Link>

      <div className="overflow-hidden rounded-none border border-[var(--page-border)] bg-[var(--page-bg)] transition-[border-color,background-color] duration-[400ms]">
        <div className="relative aspect-[4/3] w-full bg-black/5">
          <Image
            src={work.image_url}
            alt={work.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <WorkInquiryCTA work={{ id: work.id, title: work.title }} />

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-heading text-3xl leading-tight tracking-wide text-[var(--page-text)] uppercase sm:text-4xl">
            {work.title}
          </h1>
          {!work.is_available && (
            <span className="shrink-0 border border-[var(--page-border)] bg-transparent px-3 py-1 text-[10px] font-medium tracking-wider text-[var(--page-muted)] uppercase">
              {t(locale, 'sold')}
            </span>
          )}
        </div>

        <p className="text-xl font-semibold text-[var(--page-text)] sm:text-2xl">
          {work.price != null ? `${work.price} ₴` : t(locale, 'priceOnRequest')}
        </p>

        {work.description && (
          <p className="leading-relaxed text-[var(--page-muted)]">
            {work.description}
          </p>
        )}
      </div>

      <div className="border-t border-[var(--page-border)] pt-8 transition-[border-color] duration-[400ms]">
        <h2 className="mb-4 text-center font-heading text-xl tracking-wide text-[var(--page-text)] uppercase sm:text-2xl">
          Заинтересовала работа?
        </h2>
        <ContactButtons />
      </div>
    </main>
  )
}
