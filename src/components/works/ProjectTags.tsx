import { t } from '../../i18n'
import type { Lang, LocalizedString } from '../../data/types'

const tagClassBySize = {
  sm: 'rounded-sm bg-accent-soft px-2.5 py-0.5 text-caption text-accent-strong',
  md: 'rounded-sm bg-accent-soft px-3 py-1 text-sm text-accent-strong',
} as const

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
  size?: keyof typeof tagClassBySize
}

export function ProjectTags({
  label,
  lang,
  className,
  size = 'sm',
}: ProjectTagsProps) {
  const tags = splitTagLabel(label, lang)
  const tagClass = tagClassBySize[size]

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
