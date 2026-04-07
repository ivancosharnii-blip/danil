import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types'
import DeleteWorkButton from './delete-button'

export default async function AdminWorksPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })

  const works: Work[] = data ?? []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Работы</h1>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
        >
          <Plus size={16} />
          Добавить
        </Link>
      </div>

      {works.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          Работ пока нет. Добавьте первую!
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left">
                <th className="px-4 py-3 font-medium text-zinc-600">Фото</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Название</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Тип</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Цена</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Статус</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr
                  key={work.id}
                  className="border-b border-zinc-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                      <Image
                        src={work.image_url}
                        alt={work.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {work.title}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {work.type === 'painting' ? 'Картина' : 'Тату'}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {work.price != null ? `${work.price} ₴` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        work.is_available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {work.is_available ? 'Доступна' : 'Продана'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/works/${work.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100"
                      >
                        Изменить
                      </Link>
                      <DeleteWorkButton id={work.id} title={work.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
