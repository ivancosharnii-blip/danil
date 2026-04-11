import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import Header from '@/components/Header'
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
      </main>

      <footer className="border-t border-[var(--page-border)] py-6 text-center text-xs text-[var(--page-muted)] transition-[border-color,color] duration-[400ms]">
        &copy; {new Date().getFullYear()} Danil Art
      </footer>
    </>
  )
}
