import { t } from '../../i18n'
import type { LocalizedString } from '../../data/types'

const tagClass =
  'rounded-sm bg-accent-soft px-2.5 py-0.5 text-caption text-accent-strong'

function splitTagLabel(label: LocalizedString): string[] {
  return t(label)
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
}

type ProjectTagsProps = {
  label: LocalizedString
  className?: string
}

export function ProjectTags({ label, className }: ProjectTagsProps) {
  const tags = splitTagLabel(label)

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
