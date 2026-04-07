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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-12 px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Картины &amp; Тату&nbsp;эскизы
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-zinc-500">
            Авторские работы — живопись, графика и уникальные эскизы для татуировок
          </p>
        </div>

        <Gallery works={works} />

        <div className="w-full border-t border-zinc-200 pt-12 text-center">
          <h2 className="mb-6 text-lg font-semibold text-zinc-900">Связаться со мной</h2>
          <ContactButtons />
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} Danil Art
      </footer>
    </>
  )
}
