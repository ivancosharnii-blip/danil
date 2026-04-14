'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Work } from '@/types'
import WorkInquiryCTA from '@/components/WorkInquiryCTA'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface Props {
  work: Work
  tab?: string
}

export default function WorkDetail({ work, tab }: Props) {
  const { locale } = useLocale()
  const backHref = tab === 'tattoo' ? '/?tab=tattoo' : '/?tab=painting'

  return (
    <>
      <style>{`
        @keyframes workDetailInfoSlide {
          from {
            opacity: 0;
            transform: translateY(1.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .work-detail-info-animate {
          animation: workDetailInfoSlide 500ms ease-out forwards;
        }
      `}</style>
      <main className="flex min-h-0 flex-1 flex-col transition-[color] duration-[400ms]">
        <div className="relative h-[70vh] w-full shrink-0">
          <Image
            src={work.image_url}
            alt={work.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 pt-24 md:px-10 md:pb-12">
            <h1 className="font-heading text-4xl leading-none tracking-wide text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {work.title}
            </h1>
            {!work.is_available && (
              <span className="mt-3 inline-flex w-fit border border-white/50 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-wider text-white uppercase backdrop-blur-sm">
                {t(locale, 'sold')}
              </span>
            )}
          </div>
        </div>

        <div className="work-detail-info-animate border-t border-[var(--page-border)] bg-[var(--page-bg)] text-[var(--page-text)]">
          <div className="mx-auto max-w-[600px] px-8 py-8">
            <p className="font-heading text-3xl tracking-wide sm:text-4xl">
              {work.price != null ? `${work.price} ₴` : t(locale, 'priceOnRequest')}
            </p>

            {work.description ? (
              <p className="mt-6 leading-relaxed text-[var(--page-muted)]">{work.description}</p>
            ) : null}

            <div className="mt-8">
              <WorkInquiryCTA work={{ id: work.id, title: work.title }} />
            </div>

            <Link
              href={backHref}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--page-muted)] transition-colors hover:text-[var(--page-text)]"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              {t(locale, 'back')}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
