import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-[var(--page-border)] bg-[var(--page-header-bg)] transition-[background-color,border-color] duration-[400ms] ease-out">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-8 text-center sm:py-10">
        <Link
          href="/"
          className="font-heading text-4xl leading-none tracking-wide text-[var(--page-text)] uppercase transition-opacity hover:opacity-80 sm:text-5xl"
        >
          Danil Art
        </Link>
        <p className="mt-2 text-xs font-normal tracking-[0.2em] text-[var(--page-muted)] uppercase">
          Живопись · Татуировки
        </p>
      </div>
    </header>
  )
}
