import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import WorkForm from '@/components/WorkForm'
import { updateWork } from '../../../actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditWorkPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('works').select('*').eq('id', id).single()

  if (!data) notFound()

  const work = data as Work

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateWork(work.id, formData)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-zinc-900">
        Редактировать: {work.title}
      </h1>
      <WorkForm work={work} action={handleUpdate} />
    </div>
  )
}
