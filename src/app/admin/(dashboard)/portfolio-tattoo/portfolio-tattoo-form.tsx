'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PortfolioTattoo {
  id: string
  name: string
  bio: string | null
}

export default function PortfolioTattooForm({ portfolio }: { portfolio: PortfolioTattoo | null }) {
  const [name, setName] = useState(portfolio?.name || '')
  const [bio, setBio] = useState(portfolio?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = portfolio?.id
      ? await supabase
          .from('portfolio_tattoo')
          .update({ name, bio, updated_at: new Date().toISOString() })
          .eq('id', portfolio.id)
      : await supabase
          .from('portfolio_tattoo')
          .insert({ name, bio })

    if (error) {
      console.error('Ошибка сохранения:', error)
      alert('Ошибка: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>ИМЯ</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1a1a1a', background: 'transparent', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>БИО</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={6} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1a1a1a', background: 'transparent', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
      </div>
      <button onClick={handleSave} disabled={saving} style={{ padding: '0.85rem', background: '#1a1a1a', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-heading)', fontSize: '1rem', letterSpacing: '0.15em', opacity: saving ? 0.6 : 1 }}>
        {saved ? 'СОХРАНЕНО ✓' : saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
      </button>
    </div>
  )
}
