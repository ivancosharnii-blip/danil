import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '../actions'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <Link
            href="/admin/works"
            className="text-base font-semibold text-zinc-900"
          >
            Админ-панель
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <Link
            href="/admin/works"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            <LayoutDashboard size={16} />
            Работы
          </Link>
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            <User size={16} />
            Портфолио
          </Link>
        </nav>
        <form action={logout} className="border-t border-zinc-200 px-3 py-3">
          <button
            type="submit"
            className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-8">{children}</main>
    </div>
  )
}
