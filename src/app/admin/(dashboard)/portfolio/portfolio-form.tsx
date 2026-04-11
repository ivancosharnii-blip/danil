'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Portfolio {
  id: string
  name: string
  bio: string | null
  photo_url: string | null
}

export default function PortfolioForm({ portfolio }: { portfolio: Portfolio | null }) {
  const [name, setName] = useState(portfolio?.name || '')
  const [bio, setBio] = useState(portfolio?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    if (portfolio?.id) {
      await supabase.from('portfolio').update({ name, bio, updated_at: new Date().toISOString() }).eq('id', portfolio.id)
    } else {
      await supabase.from('portfolio').insert({ name, bio })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
