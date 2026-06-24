import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { siteContent } from '../../data'
import type { Lang } from '../../data/types'
import { AnimatedPage } from '../motion/AnimatedPage'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

type LayoutProps = {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

export function Layout({ lang, onLangChange }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="relative min-h-screen text-ink">
      <ScrollToTop />
      <Header nav={siteContent.nav} lang={lang} onLangChange={onLangChange} />
      <AnimatePresence initial={false}>
        <AnimatedPage key={location.pathname}>
          <Outlet />
        </AnimatedPage>
      </AnimatePresence>
    </div>
  )
}
