import { createClient } from '@/lib/supabase/server'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: portfolio } = await supabase.from('portfolio').select('*').single()

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{
          width: '220px', height: '220px',
          background: '#e8e8e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#999', fontSize: '0.85rem', letterSpacing: '0.1em',
          fontFamily: 'var(--font-sans)'
        }}>
          ФОТО
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', letterSpacing: '0.15em', textAlign: 'center' }}>
          {portfolio?.name?.toUpperCase() || 'DANIL'}
        </h1>
        <div style={{ width: '60px', height: '1px', background: 'currentColor', opacity: 0.3 }} />
        <p style={{ textAlign: 'center', lineHeight: 1.8, maxWidth: '560px', opacity: 0.8, fontSize: '1rem' }}>
          {portfolio?.bio || ''}
        </p>
      </div>
    </main>
  )
}
