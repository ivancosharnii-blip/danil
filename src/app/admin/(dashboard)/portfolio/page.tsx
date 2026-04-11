import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortfolioForm from './portfolio-form'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: portfolio } = await supabase.from('portfolio').select('*').single()
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '2rem' }}>ПОРТФОЛИО</h1>
      <PortfolioForm portfolio={portfolio} />
    </div>
  )
}
