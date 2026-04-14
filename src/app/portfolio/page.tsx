'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Portfolio {
  id: string
  name: string
  bio: string | null
}

function PortfolioContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') === 'tattoo' ? 'tattoo' : 'painting'
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const table = tab === 'tattoo' ? 'portfolio_tattoo' : 'portfolio'
    supabase.from(table).select('*').single().then(({ data }) => {
      setPortfolio(data)
    })
  }, [tab])

  useEffect(() => {
    document.body.setAttribute('data-theme', tab === 'tattoo' ? 'dark' : 'light')
  }, [tab])

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'currentColor',
          textDecoration: 'none',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}>
          ← Назад
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
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

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '40vh' }} aria-hidden />}>
      <PortfolioContent />
    </Suspense>
  )
}
