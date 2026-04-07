import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-tight text-zinc-900">
          Danil&nbsp;Art
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-zinc-600">
          <Link href="/#gallery" className="transition hover:text-zinc-900">
            Работы
          </Link>
          <Link href="/#contacts" className="transition hover:text-zinc-900">
            Контакты
          </Link>
        </nav>
      </div>
    </header>
  )
}
