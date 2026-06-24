import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { t } from '../../i18n'
import type { CaseStudy, Lang, MediaItem, ModalBlock } from '../../data/types'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useElasticOverscroll } from '../../hooks/useElasticOverscroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { publicAsset } from '../../lib/publicAsset'
import { Gallery } from './Gallery'

type ProjectModalProps = {
  projects: CaseStudy[]
  activeIndex: number
  open: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  lang: Lang
}

const layoutTransition = {
  layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const },
}

const LAYOUT_MS = 400

function syncScrollOverflow(el: HTMLElement) {
  el.style.overflowY =
    el.scrollHeight > el.clientHeight + 1 ? 'auto' : 'hidden'
}

/**
 * 提取 YouTube video id：支持 `youtu.be/<id>` 与 `youtube.com/watch?v=<id>` 形式，
 * 自动剥掉查询参数与时间戳。
 */
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace(/^\//, '').split('/')[0] || null
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const parts = u.pathname.split('/').filter(Boolean)
      const embedIdx = parts.indexOf('embed')
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1]
    }
  } catch {
    // ignore
  }
  return null
}

/** 提取 B 站 BV 号，支持 `bilibili.com/video/BV...` 路径。 */
function extractBilibiliBvid(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('bilibili.com')) return null
    const match = u.pathname.match(/(BV[0-9A-Za-z]+)/i)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

function getVideoEmbedSrc(url: string): string | null {
  const youtubeId = extractYouTubeId(url)
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`

  const bvid = extractBilibiliBvid(url)
  if (bvid) {
    return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`
  }

  return null
}

function MediaTile({
  item,
  pixelArt,
  square,
  lang,
}: {
  item: MediaItem
  pixelArt?: boolean
  square?: boolean
  lang: Lang
}) {
  const aspect = square ? 'aspect-square' : 'aspect-video'
  const fit = pixelArt ? 'object-contain' : 'object-cover'
  const renderingStyle = pixelArt
    ? ({ imageRendering: 'pixelated' } as React.CSSProperties)
    : undefined
  const wrapperBg = pixelArt ? 'bg-ink/[0.03]' : 'bg-ink/[0.04]'

  if (item.kind === 'image') {
    return (
      <div
        className={`relative ${aspect} overflow-hidden rounded-md border border-line ${wrapperBg}`}
      >
        <img
          src={publicAsset(item.src)}
          alt={t(item.alt, lang)}
          className={`absolute inset-0 h-full w-full ${fit}`}
          style={renderingStyle}
          loading="lazy"
        />
      </div>
    )
  }
  return (
    <div
      className={`relative ${aspect} overflow-hidden rounded-md border border-line ${wrapperBg}`}
    >
      <video
        className={`absolute inset-0 h-full w-full ${fit}`}
        style={renderingStyle}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={t(item.alt, lang)}
      >
        {item.webm && <source src={publicAsset(item.webm)} type="video/webm" />}
        <source src={publicAsset(item.mp4)} type="video/mp4" />
      </video>
    </div>
  )
}

function ModalContent({ blocks, lang }: { blocks: ModalBlock[]; lang: Lang }) {
  const firstHeadingIndex = blocks.findIndex((block) => block.type === 'heading')
  const overviewEnd = firstHeadingIndex === -1 ? blocks.length : firstHeadingIndex
  const renderedBlocks: React.ReactNode[] = []

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]

    if (block.type === 'paragraph') {
      const isOverview = i < overviewEnd
      const paragraphs = [block.text]

      while (
        i + 1 < blocks.length &&
        blocks[i + 1].type === 'paragraph' &&
        (i + 1 < overviewEnd) === isOverview
      ) {
        i += 1
        const nextBlock = blocks[i]
        if (nextBlock.type === 'paragraph') paragraphs.push(nextBlock.text)
      }

      if (isOverview) {
        renderedBlocks.push(
          <blockquote
            key={`paragraph-${i}`}
            className="max-w-prose space-y-4 border-l-2 border-line pl-4 text-body italic text-ink-muted"
          >
            {paragraphs.map((text) => (
              <p key={text.zh}>{t(text, lang)}</p>
            ))}
          </blockquote>,
        )
      } else {
        renderedBlocks.push(
          <div
            key={`paragraph-${i}`}
            className="max-w-prose space-y-4 text-body text-ink-muted"
          >
            {paragraphs.map((text) => (
              <p key={text.zh}>{t(text, lang)}</p>
            ))}
          </div>,
        )
      }
      continue
    }

    renderedBlocks.push(
      (() => {
        if (block.type === 'heading') {
          return (
            <h3 key={i} className="font-display text-h2 text-ink">
              {t(block.text, lang)}
            </h3>
          )
        }
        if (block.type === 'list') {
          return (
            <div key={i}>
              {block.title && (
                <h4 className="mb-2 text-sm font-semibold text-ink">
                  {t(block.title, lang)}
                </h4>
              )}
              <ul className="space-y-2 text-body text-ink-muted">
                {block.items.map((item) => (
                  <li key={item.zh} className="flex gap-2">
                    <span className="text-accent" aria-hidden>
                      ·
                    </span>
                    <span>{t(item, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        if (block.type === 'image') {
          return (
            <img
              key={i}
              src={publicAsset(block.src)}
              alt={t(block.alt, lang)}
              className="w-full rounded-card border border-line"
              loading="lazy"
            />
          )
        }
        if (block.type === 'video') {
          const embedSrc = getVideoEmbedSrc(block.url)
          const title = block.caption ? t(block.caption, lang) : 'video'
          return (
            <figure key={i} className="mx-auto w-full">
              <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-card border border-line bg-ink/5">
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/[0.04] transition hover:bg-ink/[0.07]"
                  >
                    <span
                      aria-hidden
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg text-background shadow-float transition group-hover:scale-105"
                    >
                      ▶
                    </span>
                    <span className="text-sm font-medium text-accent-strong">
                      {lang === 'zh' ? '打开视频链接' : 'Open video link'}
                    </span>
                  </a>
                )}
              </div>
              {block.caption && (
                <figcaption className="mt-2 text-center text-caption text-ink-muted">
                  {t(block.caption, lang)}
                </figcaption>
              )}
            </figure>
          )
        }
        if (block.type === 'gallery') {
          return <Gallery key={i} images={block.images} lang={lang} />
        }
        if (block.type === 'mediaGrid') {
          const square = block.layout === 'grid'
          const lockedCols = block.layout === 'row'
          const cols = block.cols ?? block.items.length
          // row：固定列数；grid：auto-fit + 最小宽度，让窄屏自动减列
          const minTileWidth = block.pixelArt ? 64 : 140
          const gridStyle = lockedCols
            ? {
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }
            : {
                gridTemplateColumns: `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
              }
          return (
            <div
              key={i}
              className="rounded-card border border-line bg-surface p-4 md:p-5"
            >
              {block.title && (
                <h4 className="mb-3 text-sm font-semibold text-ink">
                  {t(block.title, lang)}
                </h4>
              )}
              <div className="grid gap-3" style={gridStyle as React.CSSProperties}>
                {block.items.map((item, j) => (
                  <MediaTile
                    key={j}
                    item={item}
                    pixelArt={block.pixelArt}
                    square={square}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          )
        }
        if (block.type === 'download') {
          return (
            <a
              key={i}
              href={publicAsset(block.href)}
              download
              className="inline-flex flex-wrap items-center gap-2 rounded-btn border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition active:scale-[0.98] hover:border-ink"
            >
              <span aria-hidden>↓</span>
              <span>{t(block.label, lang)}</span>
              {block.hint && (
                <span className="text-caption font-normal text-ink-muted">
                  {t(block.hint, lang)}
                </span>
              )}
            </a>
          )
        }
        return null
      })(),
    )
  }

  return <div className="space-y-6">{renderedBlocks}</div>
}

function ProjectBody({ project, lang }: { project: CaseStudy; lang: Lang }) {
  const projectType = project.subtitle
    ? t(project.subtitle, lang)
    : t(project.tagLabel, lang)
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
        .join(' · ')

  const metaRows = [
    { label: lang === 'zh' ? '游戏类型' : 'GAME TYPE', value: projectType },
    { label: lang === 'zh' ? '我的职责' : 'MY ROLE', value: t(project.role, lang) },
    {
      label: lang === 'zh' ? '游玩平台' : 'PLAY PLATFORM',
      value: t(project.platform, lang),
    },
  ] as const

  return (
    <>
      <header className="mb-8 border-b border-line pb-6">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="project-modal-title"
            className="min-w-0 flex-1 break-words font-display text-h2 leading-tight text-ink"
          >
            {t(project.title, lang)}
          </h2>
          <span className="shrink-0 font-display text-h2 leading-tight tabular-nums text-ink-muted">
            {project.year}
          </span>
        </div>

        <div className="mt-5 space-y-2.5">
          {metaRows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-6"
            >
              <span className="shrink-0 text-caption uppercase tracking-widest text-ink-muted">
                {label}
              </span>
              <span className="text-right text-sm text-ink">{value}</span>
            </div>
          ))}
          {project.desensitized && (
            <p className="text-right text-caption text-accent-strong">
              {lang === 'zh' ? '在研项目，已脱敏' : 'In-development project, redacted'}
            </p>
          )}
        </div>

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="relative mt-5 flex w-full items-center justify-between py-1 text-sm font-semibold text-accent-strong after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100"
          >
            <span>{lang === 'zh' ? '点击前往项目' : 'Visit project'}</span>
            <span aria-hidden>→</span>
          </a>
        )}
      </header>

      <ModalContent blocks={project.modalBlocks} lang={lang} />
    </>
  )
}

export function ProjectModal({
  projects,
  activeIndex,
  open,
  onClose,
  onPrev,
  onNext,
  lang,
}: ProjectModalProps) {
  const reduced = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const project = projects[activeIndex]

  useBodyScrollLock(open)
  useElasticOverscroll(scrollRef, open && !reduced, project?.id)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [open, onClose, onPrev, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!open || !el) return

    el.scrollTop = 0
    el.style.overflowY = 'hidden'

    let layoutReady = false
    const enable = () => {
      if (!layoutReady) return
      syncScrollOverflow(el)
    }

    const timer = window.setTimeout(() => {
      layoutReady = true
      syncScrollOverflow(el)
    }, LAYOUT_MS)

    const ro = new ResizeObserver(enable)
    ro.observe(el)

    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [activeIndex, open])

  if (!project) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            aria-label={lang === 'zh' ? '关闭弹窗' : 'Close project modal'}
            onClick={onClose}
          />

          <LayoutGroup id="project-modal">
            <motion.div
              layout
              className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-card border border-line bg-background shadow-float"
              style={{ maxHeight: 'min(85vh, 900px)' }}
              initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                duration: reduced ? 0 : 0.28,
                ease: [0.16, 1, 0.3, 1],
                ...layoutTransition,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-end border-b border-line bg-background px-5 py-3 md:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-btn border border-line px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                  aria-label={lang === 'zh' ? '关闭' : 'Close'}
                >
                  {lang === 'zh' ? '关闭' : 'Close'}
                </button>
              </div>

              <div
                ref={scrollRef}
                className="modal-elastic-scroll min-h-0 flex-1 overflow-y-hidden overscroll-y-contain px-5 py-6 md:px-8 md:py-8"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={project.id}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.18 }}
                  >
                    <ProjectBody project={project} lang={lang} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="shrink-0 border-t border-line bg-background px-5 py-4 md:px-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onPrev}
                    className="rounded-btn border border-line px-4 py-2 text-sm font-medium text-ink transition active:scale-[0.98] hover:border-ink"
                  >
                    {lang === 'zh' ? '上一个' : 'Previous'}
                  </button>
                  <span className="text-caption text-ink-muted">
                    {activeIndex + 1} / {projects.length}
                  </span>
                  <button
                    type="button"
                    onClick={onNext}
                    className="rounded-btn border border-line px-4 py-2 text-sm font-medium text-ink transition active:scale-[0.98] hover:border-ink"
                  >
                    {lang === 'zh' ? '下一个' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
