import Image from 'next/image'
import Link from 'next/link'
import type { Work } from '@/types'

interface WorkCardProps {
  work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <Link
      href={`/work/${work.id}`}
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md hover:ring-zinc-300"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
        <Image
          src={work.image_url}
          alt={work.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!work.is_available && (
          <span className="absolute top-3 right-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Продана
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">
          {work.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          {work.price != null ? `${work.price} ₴` : 'Цену уточнять'}
        </p>
      </div>
    </Link>
  )
}
