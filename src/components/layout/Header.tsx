import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { t } from '../../i18n'
import type { Lang, NavItem } from '../../data/types'

type HeaderProps = {
  nav: NavItem[]
  lang: Lang
  onLangChange: (lang: Lang) => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm font-medium transition-colors',
    isActive
      ? 'text-ink underline decoration-accent decoration-2 underline-offset-8'
      : 'text-ink-muted hover:text-ink',
  ].join(' ')

export function Header({ nav, lang, onLangChange }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const nextLang: Lang = lang === 'en' ? 'zh' : 'en'
  const toggleLabel = lang === 'en' ? '切换到中文' : 'Switch to English'
  const mobileNavLabel = lang === 'en' ? 'Mobile navigation' : '移动端导航'
  const primaryNavLabel = lang === 'en' ? 'Primary navigation' : '主导航'
  const openMenuLabel = lang === 'en' ? 'Open menu' : '打开菜单'
  const closeMenuLabel = lang === 'en' ? 'Close menu' : '关闭菜单'

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line bg-background/90 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6 sm:px-10 lg:px-16">
        <NavLink
          to="/"
          className="font-display text-caption font-semibold uppercase tracking-widest text-accent-strong"
        >
          MING.ST
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex" aria-label={primaryNavLabel}>
          {nav.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkClass}>
              {t(item.label, lang)}
            </NavLink>
          ))}
          <button
            type="button"
            className="text-caption text-ink-muted transition-colors hover:text-ink"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={() => onLangChange(nextLang)}
          >
            <span className={lang === 'zh' ? 'text-ink' : undefined}>中</span>
            <span aria-hidden> / </span>
            <span className={lang === 'en' ? 'text-ink' : undefined}>EN</span>
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex flex-col gap-1.5 md:hidden"
          aria-label={open ? closeMenuLabel : openMenuLabel}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-background px-6 py-6 sm:px-10 md:hidden"
          aria-label={mobileNavLabel}
        >
          <ul className="flex flex-col gap-5">
            {nav.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {t(item.label, lang)}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                aria-label={toggleLabel}
                onClick={() => {
                  onLangChange(nextLang)
                  setOpen(false)
                }}
              >
                <span className={lang === 'zh' ? 'text-ink' : undefined}>中</span>
                <span aria-hidden> / </span>
                <span className={lang === 'en' ? 'text-ink' : undefined}>EN</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
