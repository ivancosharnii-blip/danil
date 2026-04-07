import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import ContactButtons from '@/components/ContactButtons'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('works').select('*').eq('id', id).single()

  if (!data) notFound()

  const work = data as Work

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Назад
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
        <div className="relative aspect-[4/3] w-full bg-zinc-100">
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

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">{work.title}</h1>
          {!work.is_available && (
            <span className="shrink-0 rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
              Продана
            </span>
          )}
        </div>

        <p className="text-lg font-semibold text-zinc-900">
          {work.price != null ? `${work.price} ₴` : 'Цену уточнять'}
        </p>

        {work.description && (
          <p className="leading-relaxed text-zinc-600">{work.description}</p>
        )}
      </div>

      <div className="border-t border-zinc-200 pt-8">
        <h2 className="mb-4 text-center text-base font-semibold text-zinc-900">
          Заинтересовала работа?
        </h2>
        <ContactButtons />
      </div>
    </main>
  )
}
