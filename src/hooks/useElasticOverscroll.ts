import { useEffect, type RefObject } from 'react'

const MAX_PULL = 72
const RESISTANCE = 0.42
const SPRING = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'

function isOverflowing(el: HTMLElement) {
  return el.scrollHeight > el.clientHeight + 1
}

/**
 * 触控滚动到顶/底时的橡皮筋反馈。仅触控；内容未超出容器高度时不启用。
 */
export function useElasticOverscroll(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  contentKey?: string | number,
) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let touchStartY = 0
    let pulling = false

    const resetTransform = () => {
      el.style.transition = SPRING
      el.style.transform = 'translateY(0)'
      const onEnd = () => {
        el.style.transition = ''
        el.removeEventListener('transitionend', onEnd)
      }
      el.addEventListener('transitionend', onEnd)
    }

    const atScrollEdge = (delta: number) => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const atTop = scrollTop <= 0
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2
      return (atTop && delta > 0) || (atBottom && delta < 0)
    }

    const applyPull = (offset: number) => {
      const clamped = Math.max(-MAX_PULL, Math.min(MAX_PULL, offset))
      el.style.transition = ''
      el.style.transform = `translateY(${clamped}px)`
    }

    const onTouchStart = (e: TouchEvent) => {
      if (!isOverflowing(el)) return
      touchStartY = e.touches[0].clientY
      pulling = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isOverflowing(el)) {
        if (pulling) resetTransform()
        pulling = false
        return
      }

      const delta = e.touches[0].clientY - touchStartY
      if (!atScrollEdge(delta)) {
        if (pulling) resetTransform()
        pulling = false
        return
      }
      pulling = true
      applyPull(delta * RESISTANCE)
      e.preventDefault()
    }

    const onTouchEnd = () => {
      if (pulling) resetTransform()
      pulling = false
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)

    const ro = new ResizeObserver(() => {
      if (!isOverflowing(el) && pulling) {
        resetTransform()
        pulling = false
      }
    })
    ro.observe(el)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      ro.disconnect()
      el.style.transform = ''
      el.style.transition = ''
    }
  }, [ref, enabled, contentKey])
}
