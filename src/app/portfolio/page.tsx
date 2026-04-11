import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import { BodyThemeFromWorkType } from '@/components/Gallery'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: portfolio } = await supabase.from('portfolio').select('*').single()

  return (
    <>
      <BodyThemeFromWorkType type="painting" />
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '96px' }}>
            <Image
              src="/Danylo_Black_2x.png"
              alt="Danil Art"
              width={120}
              height={96}
              style={{ objectFit: 'contain', width: '100%', height: '100%', mixBlendMode: 'multiply' }}
              priority
            />
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
    </>
  )
}
