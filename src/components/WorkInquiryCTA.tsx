'use client'

import { useState } from 'react'
import InquiryModal from '@/components/InquiryModal'

interface Props {
  work: { id: string; title: string }
}

export default function WorkInquiryCTA({ work }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border-2 border-[var(--page-accent)] bg-[var(--page-accent)] px-6 py-4 font-heading text-sm tracking-[0.2em] text-[var(--page-bg)] uppercase transition-opacity hover:opacity-90 sm:text-base"
      >
        Оставить заявку
      </button>
      {open ? (
        <InquiryModal work={work} onClose={() => setOpen(false)} />
      ) : null}
    </>
  )
}
