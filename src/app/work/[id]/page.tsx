import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import WorkDetail from '@/components/WorkDetail'
import { BodyThemeFromWorkType } from '@/components/Gallery'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function WorkPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { tab } = await searchParams
  const supabase = await createClient()
  const { data: work } = await supabase.from('works').select('*').eq('id', id).single()

  if (work === null) notFound()

  const typedWork = work as Work

  return (
    <>
      <BodyThemeFromWorkType type={typedWork.type} />
      <WorkDetail work={typedWork} tab={tab} />
    </>
  )
}
