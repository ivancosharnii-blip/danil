import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import WorkDetail from '@/components/WorkDetail'
import { BodyThemeFromWorkType } from '@/components/Gallery'

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
    <>
      <BodyThemeFromWorkType type={work.type} />
      <WorkDetail work={work} />
    </>
  )
}
