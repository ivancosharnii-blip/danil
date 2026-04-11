'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { BodyThemeFromWorkType } from '@/components/Gallery'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

type PortfolioRow = { name?: string | null; bio?: string | null }

export default function PortfolioPage() {
  const { locale } = useLocale()
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null)

  useEffect(() => {
    const supabase = createClient()
    void supabase
      .from('portfolio')
      .select('*')
      .single()
      .then(({ data }) => setPortfolio(data))
  }, [])

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
            {portfolio?.name?.toUpperCase() || t(locale, 'portfolioDefaultName')}
          </h1>
          <p style={{ textAlign: 'center', lineHeight: 1.6, maxWidth: '560px', opacity: 0.85, fontSize: '1rem' }}>
            {t(locale, 'portfolioSubtitle')}
          </p>
          <div style={{ width: '60px', height: '1px', background: 'currentColor', opacity: 0.3 }} />
          <p style={{ textAlign: 'center', lineHeight: 1.8, maxWidth: '560px', opacity: 0.8, fontSize: '1rem' }}>
            {portfolio?.bio || ''}
          </p>
        </div>
      </main>
    </>
  )
}
