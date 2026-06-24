import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { t } from '../../i18n'
import { publicAsset } from '../../lib/publicAsset'
import type { GalleryImage, Lang } from '../../data/types'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type GalleryProps = {
  images: GalleryImage[]
  lang: Lang
}

/**
 * 图片流：默认选中第一张大图，下方缩略条切换主图，点击主图打开原图 lightbox。
 * 主图区使用固定 16:10 容器 + object-cover 统一裁切，避免不同原图比例导致行高不一；
 * 原图全貌通过 lightbox（object-contain）查看。多 gallery 在同一弹窗中各自维护独立选中态。
 */
export function Gallery({ images, lang }: GalleryProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // images 列表变化时（不同 gallery 块）重置选中
  useEffect(() => {
    setActive(0)
  }, [images])

  if (!images.length) return null

  const safeIndex = Math.min(Math.max(active, 0), images.length - 1)
  const current = images[safeIndex]
  const single = images.length === 1

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="block w-full overflow-hidden rounded-card border border-line bg-surface outline-none transition focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={
          lang === 'zh'
            ? `查看原图：${t(current.alt, lang)}`
            : `View full image: ${t(current.alt, lang)}`
        }
      >
        <div className="relative w-full overflow-hidden bg-ink/[0.04]" style={{ aspectRatio: '16 / 10' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current.src}
              src={publicAsset(current.src)}
              alt={t(current.alt, lang)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            />
          </AnimatePresence>
        </div>
      </button>

      {!single && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => {
            const isActive = i === safeIndex
            return (
              <button
                key={img.src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={
                  lang === 'zh'
                    ? `切换到第 ${i + 1} 张：${t(img.alt, lang)}`
                    : `Switch to image ${i + 1}: ${t(img.alt, lang)}`
                }
                aria-pressed={isActive}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border outline-none transition focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'border-accent shadow-float'
                    : 'border-line opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={publicAsset(img.src)}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            )
          })}
        </div>
      )}

      <Lightbox
        open={lightbox}
        images={images}
        index={safeIndex}
        onIndexChange={setActive}
        onClose={() => setLightbox(false)}
        lang={lang}
      />
    </div>
  )
}

type LightboxProps = {
  open: boolean
  images: GalleryImage[]
  index: number
  onIndexChange: (i: number) => void
  onClose: () => void
  lang: Lang
}

function Lightbox({
  open,
  images,
  index,
  onIndexChange,
  onClose,
  lang,
}: LightboxProps) {
  const reduced = useReducedMotion()
  useBodyScrollLock(open)

  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1)
  }, [hasPrev, index, onIndexChange])

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1)
  }, [hasNext, index, onIndexChange])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    },
    [open, onClose, goPrev, goNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const image = images[index]

  return createPortal(
    <AnimatePresence>
      {open && image && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'zh' ? '原图查看' : 'Full image viewer'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
            aria-label={lang === 'zh' ? '关闭原图' : 'Close full image'}
            onClick={onClose}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={image.src}
              src={publicAsset(image.src)}
              alt={t(image.alt, lang)}
              className="relative z-10 max-h-[90vh] max-w-[92vw] rounded-md object-contain shadow-float"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          {hasPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              aria-label={lang === 'zh' ? '上一张' : 'Previous image'}
              className="group absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-background/30 bg-background/10 text-background backdrop-blur transition hover:bg-background/20 sm:left-6 sm:h-12 sm:w-12"
            >
              <span aria-hidden className="text-xl leading-none">‹</span>
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              aria-label={lang === 'zh' ? '下一张' : 'Next image'}
              className="group absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-background/30 bg-background/10 text-background backdrop-blur transition hover:bg-background/20 sm:right-6 sm:h-12 sm:w-12"
            >
              <span aria-hidden className="text-xl leading-none">›</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-btn border border-background/30 bg-background/10 px-3 py-1.5 text-sm text-background backdrop-blur transition hover:bg-background/20"
          >
            {lang === 'zh' ? '关闭' : 'Close'}
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-btn bg-background/10 px-3 py-1 text-caption text-background/80 backdrop-blur">
              {index + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
