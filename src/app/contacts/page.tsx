import { Instagram, Facebook } from 'lucide-react'
import Header from '@/components/Header'

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', letterSpacing: '0.15em' }}>КОНТАКТЫ</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="https://www.instagram.com/_hd.tt?igsh=ZnpjZmRmZ2tiOG1h" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid currentColor', padding: '0.75rem 1.5rem', textDecoration: 'none', color: 'inherit', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
          <Instagram size={20} /> INSTAGRAM
        </a>
        <a href="https://www.facebook.com/share/1BdxN8hgu4/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid currentColor', padding: '0.75rem 1.5rem', textDecoration: 'none', color: 'inherit', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
          <Facebook size={20} /> FACEBOOK
        </a>
      </div>
    </main>
    </>
  )
}
