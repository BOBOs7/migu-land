import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { defaultLang } from './i18n'
import type { Lang } from './data/types'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  const [lang, setLang] = useState<Lang>(defaultLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<Layout lang={lang} onLangChange={setLang} />}>
          <Route index element={<HomePage lang={lang} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
