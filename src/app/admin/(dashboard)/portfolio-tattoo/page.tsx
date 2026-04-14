import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortfolioTattooForm from './portfolio-tattoo-form'

export default async function AdminPortfolioTattooPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: portfolio } = await supabase.from('portfolio_tattoo').select('*').single()
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '2rem' }}>ПОРТФОЛИО ТАТУ</h1>
      <PortfolioTattooForm portfolio={portfolio} />
    </div>
  )
}
