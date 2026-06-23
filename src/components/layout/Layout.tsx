import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { siteContent } from '../../data'
import { AnimatedPage } from '../motion/AnimatedPage'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen text-ink">
      <ScrollToTop />
      <Header nav={siteContent.nav} />
      <AnimatePresence initial={false}>
        <AnimatedPage key={location.pathname}>
          <Outlet />
        </AnimatedPage>
      </AnimatePresence>
    </div>
  )
}