import { AnimatePresence, motion } from 'framer-motion'
import { t } from '../../i18n'
import { publicAsset } from '../../lib/publicAsset'
import type { CaseStudy, Lang } from '../../data/types'
import { ProjectTags } from './ProjectTags'

export type RowState = 'reached' | 'active' | 'upcoming'

type ProjectRowProps = {
  project: CaseStudy
  index: number
  lang: Lang
  state: RowState
  reduced: boolean
  onOpen: () => void
}

const categoryLabel: Record<CaseStudy['category'], Record<Lang, string>> = {
  work: { zh: '工作项目', en: 'Work Project' },
  personal: { zh: '个人项目', en: 'Personal Project' },
}

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

/**
 * 统一项目块模板（工作 / 个人共用）。
 * - active：放大为封面 + 元信息 + 说明的卡片。
 * - reached：常规收起行（已抵达，全不透明）。
 * - upcoming：收起行的预览态（未滚到，半透明 + 缩略，作为占位提示）。
 */
export function ProjectRow({
  project,
  index,
  lang,
  state,
  reduced,
  onOpen,
}: ProjectRowProps) {
  if (state === 'active') {
    return (
      <motion.div
        layout={!reduced}
        className="overflow-hidden rounded-card border border-line bg-surface shadow-float"
      >
        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label={
            lang === 'zh'
              ? `查看 ${t(project.title, lang)} 详情`
              : `View details for ${t(project.title, lang)}`
          }
        >
          <div className="grid items-stretch gap-0 md:min-h-[18rem] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="relative aspect-[16/10] min-w-0 overflow-hidden border-b border-line md:aspect-auto md:border-b-0 md:border-r">
              <img
                src={publicAsset(project.coverSrc)}
                alt={t(project.title, lang)}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
                <span className="tabular-nums">{pad(index)}</span>
                <span aria-hidden>·</span>
                <span>{categoryLabel[project.category][lang]}</span>
                <span aria-hidden>·</span>
                <span className="tabular-nums">{project.year}</span>
              </div>

              <h3 className="mt-2 break-words font-display text-h2 leading-tight text-ink">
                {t(project.title, lang)}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ProjectTags label={project.tagLabel} lang={lang} />
                {project.desensitized && (
                  <span className="text-caption text-ink-muted">
                    {lang === 'zh' ? '已脱敏' : 'Redacted'}
                  </span>
                )}
              </div>

              <AnimatePresence initial={false}>
                <motion.p
                  key={project.id}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.32,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-4 max-w-prose text-body text-ink-muted"
                >
                  {t(project.cardIntro, lang)}
                </motion.p>
              </AnimatePresence>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong">
                {lang === 'zh' ? '查看详情' : 'View details'}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </button>
      </motion.div>
    )
  }

  const isUpcoming = state === 'upcoming'

  return (
    <motion.div
      layout={!reduced}
      animate={
        reduced
          ? undefined
          : { opacity: isUpcoming ? 0.42 : 1, scale: isUpcoming ? 0.985 : 1 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center gap-4 rounded-card px-2 py-3.5 text-left outline-none transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent sm:gap-5"
      >
        <span className="w-8 shrink-0 text-caption tabular-nums text-ink-muted">
          {pad(index)}
        </span>

        <span
          className={`hidden h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-background sm:block ${
            isUpcoming ? 'grayscale-[20%]' : ''
          }`}
        >
          <img
            src={publicAsset(project.coverSrc)}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
        </span>

        <span
          className={`min-w-0 flex-1 truncate font-display ${
            isUpcoming ? 'text-lead' : 'text-lead-lg'
          } text-ink`}
        >
          {t(project.title, lang)}
        </span>

        <ProjectTags
          label={project.tagLabel}
          lang={lang}
          className="hidden shrink-0 flex-wrap items-center justify-end gap-1 lg:flex lg:max-w-[14rem]"
        />

        <span className="w-12 shrink-0 text-right text-caption tabular-nums text-ink-muted">
          {project.year}
        </span>
      </button>
    </motion.div>
  )
}
