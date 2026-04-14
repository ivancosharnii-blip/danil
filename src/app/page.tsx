import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import Gallery from '@/components/Gallery'

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })

  const works: Work[] = data ?? []

  return (
    <div className="flex w-full flex-1 flex-col transition-[color] duration-[400ms]">
      <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
        <Gallery works={works} />
      </Suspense>
    </div>
  )
}
