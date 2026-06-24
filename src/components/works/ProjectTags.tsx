import { t } from '../../i18n'
import type { Lang, LocalizedString } from '../../data/types'

const tagClass =
  'rounded-sm bg-accent-soft px-2.5 py-0.5 text-caption text-accent-strong'

function splitTagLabel(label: LocalizedString, lang: Lang): string[] {
  return t(label, lang)
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
}

type ProjectTagsProps = {
  label: LocalizedString
  lang: Lang
  className?: string
}

export function ProjectTags({ label, lang, className }: ProjectTagsProps) {
  const tags = splitTagLabel(label, lang)

  return (
    <span className={className ?? 'flex flex-wrap items-center gap-2'}>
      {tags.map((tag) => (
        <span key={tag} className={tagClass}>
          {tag}
        </span>
      ))}
    </span>
  )
}
