import { motion } from 'framer-motion'
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CaseStudy, Lang } from '../../data/types'
import { getSortedCaseStudies } from '../../data/validate'
import { ProjectRow, type RowState } from './ProjectRow'
import { ProjectModal } from './ProjectModal'

type WorksSectionProps = {
  caseStudies: CaseStudy[]
  lang: Lang
  /** 滚轮驱动的当前选中索引（劫持模式） */
  activeIndex: number
  /** reduced-motion / 降级模式：渲染普通可滚动列表 */
  reduced: boolean
  onModalOpenChange?: (open: boolean) => void
}

const itemTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
}

const itemEnterVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function getRowState(i: number, activeIndex: number): RowState {
  if (i === activeIndex) return 'active'
  return i < activeIndex ? 'reached' : 'upcoming'
}

const categoryHeading: Record<CaseStudy['category'], Record<Lang, string>> = {
  work: { zh: '工作项目', en: 'Work Projects' },
  personal: { zh: '个人项目', en: 'Personal Projects' },
}

type ListEntry =
  | { kind: 'separator'; id: string; label: string }
  | { kind: 'project'; project: CaseStudy; index: number }

function buildListEntries(caseStudies: CaseStudy[], lang: Lang): ListEntry[] {
  const entries: ListEntry[] = []
  let lastCategory: CaseStudy['category'] | null = null

  caseStudies.forEach((project, index) => {
    if (project.category !== lastCategory) {
      entries.push({
        kind: 'separator',
        id: `sep-${project.category}`,
        label: categoryHeading[project.category][lang],
      })
      lastCategory = project.category
    }
    entries.push({ kind: 'project', project, index })
  })

  return entries
}

function CategorySeparator({ label }: { label: string }) {
  return (
    <li aria-hidden className="pointer-events-none list-none">
      <div className="flex items-center gap-3 py-1">
        <span className="shrink-0 text-caption uppercase tracking-widest text-ink-muted">
          {label}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </li>
  )
}

export function WorksSection({
  caseStudies,
  lang,
  activeIndex,
  reduced,
  onModalOpenChange,
}: WorksSectionProps) {
  const sorted = useMemo(() => getSortedCaseStudies(caseStudies), [caseStudies])
  const listEntries = useMemo(() => buildListEntries(sorted, lang), [sorted, lang])

  const [open, setOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [trackY, setTrackY] = useState(0)

  const openAt = useCallback(
    (index: number) => {
      setModalIndex(index)
      setOpen(true)
      onModalOpenChange?.(true)
    },
    [onModalOpenChange],
  )

  const close = useCallback(() => {
    setOpen(false)
    onModalOpenChange?.(false)
  }, [onModalOpenChange])

  const goPrev = useCallback(() => {
    setModalIndex((i) => (i - 1 + sorted.length) % sorted.length)
  }, [sorted.length])

  const goNext = useCallback(() => {
    setModalIndex((i) => (i + 1) % sorted.length)
  }, [sorted.length])

  // 将当前选中项垂直居中：测量其在轨道内的位置并平移轨道
  useLayoutEffect(() => {
    if (reduced) return
    const measure = () => {
      const container = containerRef.current
      const item = itemRefs.current[activeIndex]
      if (!container || !item) return
      const target =
        container.clientHeight / 2 - (item.offsetTop + item.offsetHeight / 2)
      setTrackY(target)
    }
    const raf = requestAnimationFrame(measure)
    const timer = window.setTimeout(measure, 540)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [activeIndex, reduced])

  if (reduced) {
    return (
      <div id="works">
        <header className="mb-10">
          <h2 className="font-display text-h2 text-ink">
            {lang === 'zh' ? '作品' : 'Works'}
          </h2>
          <p className="mt-4 max-w-xl text-body text-ink-muted">
            {lang === 'zh'
              ? '2 个工作项目与 5 个个人项目。点击查看详情。'
              : '2 work projects and 5 personal projects. Click to view details.'}
          </p>
        </header>
        <ul className="divide-y divide-line border-y border-line">
          {listEntries.map((entry) =>
            entry.kind === 'separator' ? (
              <CategorySeparator key={entry.id} label={entry.label} />
            ) : (
              <li key={entry.project.id}>
                <ProjectRow
                  project={entry.project}
                  index={entry.index}
                  lang={lang}
                  state="reached"
                  reduced
                  onOpen={() => openAt(entry.index)}
                />
              </li>
            ),
          )}
        </ul>
        <ProjectModal
          projects={sorted}
          activeIndex={modalIndex}
          open={open}
          onClose={close}
          onPrev={goPrev}
          onNext={goNext}
          lang={lang}
        />
      </div>
    )
  }

  return (
    <div
      id="works"
      ref={containerRef}
      className="relative h-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-0"
        animate={{ y: trackY }}
        transition={itemTransition}
      >
        <motion.ul
          className="mx-auto max-w-content space-y-2 px-6 sm:px-10 lg:px-16"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {listEntries.map((entry) => {
            if (entry.kind === 'separator') {
              return <CategorySeparator key={entry.id} label={entry.label} />
            }

            const { project, index } = entry
            const state = getRowState(index, activeIndex)
            return (
              <motion.li
                key={project.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                layout
                variants={itemEnterVariants}
                transition={itemTransition}
              >
                <ProjectRow
                  project={project}
                  index={index}
                  lang={lang}
                  state={state}
                  reduced={false}
                  onOpen={() => openAt(index)}
                />
              </motion.li>
            )
          })}
        </motion.ul>
      </motion.div>

      <ProjectModal
        projects={sorted}
        activeIndex={modalIndex}
        open={open}
        onClose={close}
        onPrev={goPrev}
        onNext={goNext}
        lang={lang}
      />
    </div>
  )
}
