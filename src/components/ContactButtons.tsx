import { Phone, Mail } from 'lucide-react'
import type { SVGProps } from 'react'

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const contacts = [
  {
    label: 'Позвонить',
    href: 'tel:+380991234567',
    icon: Phone,
  },
  {
    label: 'Email',
    href: 'mailto:danil@example.com',
    icon: Mail,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    icon: FacebookIcon,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    icon: InstagramIcon,
  },
] as const

export default function ContactButtons() {
  return (
    <section id="contacts" className="flex flex-wrap justify-center gap-3">
      {contacts.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith('http') ? '_blank' : undefined}
          rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-400 hover:text-zinc-900"
        >
          <c.icon width={18} height={18} />
          {c.label}
        </a>
      ))}
    </section>
  )
}
