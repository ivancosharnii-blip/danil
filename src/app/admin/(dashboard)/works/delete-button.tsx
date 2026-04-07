'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteWork } from '../../actions'
import { Loader2 } from 'lucide-react'

interface DeleteWorkButtonProps {
  id: string
  title: string
}

export default function DeleteWorkButton({ id, title }: DeleteWorkButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm(`Удалить «${title}»?`)) return

    startTransition(async () => {
      await deleteWork(id)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {isPending && <Loader2 size={12} className="animate-spin" />}
      Удалить
    </button>
  )
}
