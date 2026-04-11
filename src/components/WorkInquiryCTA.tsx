'use client'

import { useState } from 'react'
import InquiryModal from '@/components/InquiryModal'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface Props {
  work: { id: string; title: string }
}

export default function WorkInquiryCTA({ work }: Props) {
  const { locale } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border-2 border-[var(--page-accent)] bg-[var(--page-accent)] px-6 py-4 font-heading text-sm tracking-[0.2em] text-[var(--page-bg)] uppercase transition-opacity hover:opacity-90 sm:text-base"
      >
        {t(locale, 'inquiryButton')}
      </button>
      {open ? (
        <InquiryModal work={work} onClose={() => setOpen(false)} />
      ) : null}
    </>
  )
}
