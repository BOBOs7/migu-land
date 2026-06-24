import { t } from '../../i18n'
import type { Lang, Profile } from '../../data/types'
import { RiveMascot } from './RiveMascot'

type HeroSectionProps = {
  profile: Profile
  lang: Lang
  /** 劫持模式下显示「向下滚动」提示 */
  onEnterWorks?: () => void
}

export function HeroSection({ profile, lang, onEnterWorks }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col px-6 pt-16 text-center"
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <RiveMascot />

        <h1 className="mt-8 font-display text-display text-ink">{t(profile.name, lang)}</h1>
        <p className="mt-4 max-w-xl text-body text-ink-muted">{t(profile.tagline, lang)}</p>
      </div>

      {onEnterWorks && (
        <div className="pointer-events-none flex shrink-0 flex-col items-center gap-2 pb-8 pt-6 text-caption uppercase tracking-widest text-ink-muted">
          <span className="animate-pulse">
            {lang === 'zh' ? '向下滚动，查看项目' : 'Scroll down to view projects'}
          </span>
          <span className="h-8 w-px animate-pulse bg-ink-muted/40" aria-hidden />
        </div>
      )}
    </section>
  )
}
