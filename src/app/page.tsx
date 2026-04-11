import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import Header from '@/components/Header'
import ContactButtons from '@/components/ContactButtons'
import Gallery from '@/components/Gallery'

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })

  const works: Work[] = data ?? []

  return (
    <>
      <Header />
      <main className="flex w-full flex-1 flex-col transition-[color] duration-[400ms]">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 text-center">
          <h1 className="font-heading text-3xl tracking-wide text-[var(--page-text)] uppercase sm:text-4xl">
            Картины &amp; Тату&nbsp;эскизы
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-[var(--page-muted)]">
            Авторские работы — живопись, графика и уникальные эскизы для
            татуировок
          </p>
        </div>

        <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
          <Gallery works={works} />
        </Suspense>

        <div className="mx-auto w-full max-w-6xl border-t border-[var(--page-border)] px-6 pt-12 pb-12 text-center transition-[border-color] duration-[400ms]">
          <h2 className="mb-6 font-heading text-2xl tracking-wide text-[var(--page-text)] uppercase sm:text-3xl">
            Связаться со мной
          </h2>
          <ContactButtons />
        </div>
      </main>

      <footer className="border-t border-[var(--page-border)] py-6 text-center text-xs text-[var(--page-muted)] transition-[border-color,color] duration-[400ms]">
        &copy; {new Date().getFullYear()} Danil Art
      </footer>
    </>
  )
}
