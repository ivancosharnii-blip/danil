'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { Locale } from './i18n'

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
}>({ locale: 'ua', setLocale: () => {} })

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ua')
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
