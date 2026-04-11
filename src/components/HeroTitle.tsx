'use client'

import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export default function HeroTitle() {
  const { locale } = useLocale()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 text-center">
      <h1 className="font-heading text-3xl tracking-wide text-[var(--page-text)] uppercase sm:text-4xl">
        {t(locale, 'heroTitle')}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-base text-[var(--page-muted)]">
        {t(locale, 'heroSubtitle')}
      </p>
    </div>
  )
}
