'use client'
import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface Props {
  work: { id: string; title: string }
  onClose: () => void
}

export default function InquiryModal({ work, onClose }: Props) {
  const { locale } = useLocale()
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.phone) {
      setError(t(locale, 'errorRequired'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, workTitle: work.title, workId: work.id }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || t(locale, 'errorSend'))
      }
    } catch {
      setError(t(locale, 'errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', color: '#1a1a1a', padding: '2rem', maxWidth: '480px', width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1a1a1a' }}>×</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '0.1em' }}>{t(locale, 'sent')}</p>
            <p style={{ marginTop: '0.5rem', color: '#666' }}>{t(locale, 'sentMessage')}</p>
            <button onClick={onClose} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>{t(locale, 'close')}</button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>{t(locale, 'inquiryTitle')}: {work.title.toUpperCase()}</p>

            {['name', 'surname', 'email', 'phone'].map((field) => (
              <div key={field} style={{ marginBottom: '1rem' }}>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  placeholder={field === 'name' ? t(locale, 'fieldName') : field === 'surname' ? t(locale, 'fieldSurname') : field === 'email' ? t(locale, 'fieldEmail') : t(locale, 'fieldPhone')}
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #1a1a1a', background: 'transparent', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <textarea
                placeholder={t(locale, 'fieldMessage')}
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #1a1a1a', background: 'transparent', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', background: '#1a1a1a', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-heading)', fontSize: '1rem', letterSpacing: '0.15em', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? t(locale, 'sending') : t(locale, 'send')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
