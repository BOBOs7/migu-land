import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { t } from '../../i18n'
import type { NavItem } from '../../data/types'

type HeaderProps = {
  nav: NavItem[]
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm font-medium transition-colors',
    isActive
      ? 'text-ink underline decoration-accent decoration-2 underline-offset-8'
      : 'text-ink-muted hover:text-ink',
  ].join(' ')

export function Header({ nav }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line bg-background/90 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6 sm:px-10 lg:px-16">
        <NavLink
          to="/"
          className="font-display text-caption font-semibold uppercase tracking-widest text-accent-strong"
        >
          MING.ST
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex" aria-label="主导航">
          {nav.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkClass}>
              {t(item.label)}
            </NavLink>
          ))}
          <span
            className="hidden text-caption text-ink-muted/50 lg:inline"
            aria-hidden
            title="语言切换（二期）"
          >
            中 / EN
          </span>
        </nav>

        <button
          type="button"
          className="inline-flex flex-col gap-1.5 md:hidden"
          aria-label={open ? '关闭菜单' : '打开菜单'}
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
          aria-label="移动端导航"
        >
          <ul className="flex flex-col gap-5">
            {nav.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {t(item.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
