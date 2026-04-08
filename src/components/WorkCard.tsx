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
      className="group relative block w-full overflow-hidden rounded-none bg-zinc-900"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={work.image_url}
          alt={work.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        {!work.is_available && (
          <span className="absolute top-3 right-3 z-10 bg-black/75 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white uppercase">
            Продана
          </span>
        )}
        <div
          className="absolute inset-x-0 bottom-0 z-[1] flex flex-col gap-0.5 px-3 pb-3 pt-12 text-white"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, transparent 100%)',
          }}
        >
          <h3 className="font-heading text-xl leading-tight tracking-wide uppercase sm:text-2xl">
            {work.title}
          </h3>
          <p className="text-sm text-white/85">
            {work.price != null ? `${work.price} ₴` : 'Цену уточнять'}
          </p>
        </div>
      </div>
    </Link>
  )
}
