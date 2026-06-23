import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export type HomePhase = 'hero' | 'works' | 'outro'

type UseHomeStepperResult = {
  /** 是否启用滚轮劫持（reduced-motion 时为 false，降级为普通文档滚动） */
  enabled: boolean
  phase: HomePhase
  /** 作品阶段当前选中项的索引（0 基） */
  activeIndex: number
  total: number
  goNext: () => void
  goPrev: () => void
  /** 从开屏进入作品阶段 */
  enterWorks: () => void
}

/**
 * 累积每 STEP_PIXELS 像素推进一格，让触控板/惯性滚轮等连续小事件可以链式推进多格，
 * 同时硬滚轮一次 deltaY≈100 仍是一格，避免离散冷却带来的「卡手」感。
 */
const STEP_PIXELS = 100
const WHEEL_THRESHOLD = 6
const TOUCH_THRESHOLD = 48
/** 阶段切换后的静默窗口：300ms 内无 wheel/touch 事件方可解锁，吃掉惯性余量 */
const BOUNDARY_SILENCE_MS = 300

/**
 * HOME 页分步舞台状态机。
 *
 * 线性步进：step 0 = 开屏(hero)；step 1..total = 作品(works，activeIndex = step-1)；
 * step total+1 = 收尾(outro，技能/联系)。
 *
 * 边界路径：
 * - hero / 中间作品项：完全劫持，wheel/touch 通过累积器推进。
 * - 末项（step==total）：上滚仍劫持回退；下滚放行 + 同步切 outro + 程序化滚到 outro 起点
 *   （因 body 滚动锁此时仍生效，本次 wheel 事件本身无法产生原生滚动，故主动 scrollTo）。
 * - outro：仅在文档顶部继续向上滚时回到末项。
 *
 * @param total 作品数量
 * @param paused 暂停劫持（如弹窗打开时），暂停期间不挂载事件监听
 */
export function useHomeStepper(total: number, paused = false): UseHomeStepperResult {
  const reduced = useReducedMotion()
  const enabled = !reduced && total > 0

  const [step, setStep] = useState(0)
  const stepRef = useRef(step)
  stepRef.current = step

  const accumRef = useRef(0)
  const outroStep = total + 1

  const boundaryLockRef = useRef(false)
  const silenceTimerRef = useRef<number | null>(null)

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const armSilenceTimer = useCallback(() => {
    clearSilenceTimer()
    silenceTimerRef.current = window.setTimeout(() => {
      boundaryLockRef.current = false
      accumRef.current = 0
      silenceTimerRef.current = null
    }, BOUNDARY_SILENCE_MS)
  }, [clearSilenceTimer])

  const engageBoundaryLock = useCallback(() => {
    boundaryLockRef.current = true
    accumRef.current = 0
    armSilenceTimer()
  }, [armSilenceTimer])

  const clamp = useCallback(
    (s: number) => Math.max(0, Math.min(outroStep, s)),
    [outroStep],
  )

  const advanceBy = useCallback(
    (steps: number) => {
      if (!steps) return
      setStep((s) => clamp(s + steps))
    },
    [clamp],
  )

  const accumulateAndAdvance = useCallback(
    (delta: number) => {
      accumRef.current += delta
      let steps = 0
      while (accumRef.current >= STEP_PIXELS) {
        accumRef.current -= STEP_PIXELS
        steps += 1
      }
      while (accumRef.current <= -STEP_PIXELS) {
        accumRef.current += STEP_PIXELS
        steps -= 1
      }
      if (steps !== 0) advanceBy(steps)
    },
    [advanceBy],
  )

  const releaseToOutro = useCallback(() => {
    accumRef.current = 0
    setStep(outroStep)
    // 等 body 滚动锁随 phase=outro 解除（rAF 后），程序化滚到 outro 起点
    requestAnimationFrame(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    })
    engageBoundaryLock()
  }, [outroStep, engageBoundaryLock])

  const goNext = useCallback(() => {
    accumRef.current = 0
    advanceBy(1)
  }, [advanceBy])

  const goPrev = useCallback(() => {
    accumRef.current = 0
    advanceBy(-1)
  }, [advanceBy])

  const enterWorks = useCallback(() => {
    accumRef.current = 0
    setStep((s) => (s === 0 ? 1 : s))
  }, [])

  useEffect(() => {
    if (!enabled || paused) return

    const onWheel = (e: WheelEvent) => {
      const s = stepRef.current

      // outro：冷却中放行原生滚动；冷却释放后向上滚一次即切回作品末项（下滚仍走原生）
      if (s === outroStep) {
        if (boundaryLockRef.current) return
        if (e.deltaY > -WHEEL_THRESHOLD) return
        e.preventDefault()
        accumRef.current = 0
        setStep(total)
        engageBoundaryLock()
        return
      }

      // 边界冷却（hero/works 阶段）：吃掉本次手势/惯性余量，重置静默计时器
      if (boundaryLockRef.current) {
        e.preventDefault()
        armSilenceTimer()
        return
      }

      // hero(step=0)：边界，单次推进到 step=1，不走累积器
      if (s === 0) {
        e.preventDefault()
        if (e.deltaY > WHEEL_THRESHOLD) {
          accumRef.current = 0
          setStep(1)
          engageBoundaryLock()
        }
        return
      }
      // 中间作品项（1..total-1）：完全劫持，累积器推进
      if (s < total) {
        e.preventDefault()
        if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return
        accumulateAndAdvance(e.deltaY)
        return
      }
      // 末项 step==total：上滚劫持回退；下滚放行 + 主动滚入 outro
      if (s === total) {
        if (e.deltaY < -WHEEL_THRESHOLD) {
          e.preventDefault()
          accumulateAndAdvance(e.deltaY)
          return
        }
        if (e.deltaY > WHEEL_THRESHOLD) {
          e.preventDefault()
          releaseToOutro()
          return
        }
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const s = stepRef.current
      const delta = e.touches[0].clientY - touchStartY

      // outro：冷却中放行原生滚动；冷却释放后向下拉（向上滚等价手势）即切回作品末项
      if (s === outroStep) {
        if (boundaryLockRef.current) return
        if (delta < TOUCH_THRESHOLD) return
        e.preventDefault()
        accumRef.current = 0
        setStep(total)
        engageBoundaryLock()
        touchStartY = e.touches[0].clientY
        return
      }

      // 边界冷却（hero/works 阶段）
      if (boundaryLockRef.current) {
        e.preventDefault()
        armSilenceTimer()
        touchStartY = e.touches[0].clientY
        return
      }

      // hero(step=0)：边界，单次推进到 step=1
      if (s === 0) {
        e.preventDefault()
        if (delta < -TOUCH_THRESHOLD) {
          accumRef.current = 0
          setStep(1)
          engageBoundaryLock()
        }
        touchStartY = e.touches[0].clientY
        return
      }
      if (s < total) {
        e.preventDefault()
        if (Math.abs(delta) < TOUCH_THRESHOLD) return
        // 触控向上滑（手指上滑、delta < 0）= 下一项；累积器仍按像素方向（下=正）
        accumulateAndAdvance(-delta)
        touchStartY = e.touches[0].clientY
        return
      }
      if (s === total) {
        if (delta > TOUCH_THRESHOLD) {
          // 手指下拉 → 回退一项
          e.preventDefault()
          accumulateAndAdvance(-delta)
          touchStartY = e.touches[0].clientY
          return
        }
        if (delta < -TOUCH_THRESHOLD) {
          // 手指上滑 → 进入 outro
          e.preventDefault()
          releaseToOutro()
          touchStartY = e.touches[0].clientY
          return
        }
      }
    }

    const isInteractive = (el: EventTarget | null) => {
      const node = el as HTMLElement | null
      return !!node?.closest('a, button, input, textarea, select, [role="button"]')
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const s = stepRef.current
      if (s >= outroStep) return
      // 焦点在可交互元素上时让位（避免拦截按钮的空格/回车激活与表单输入）
      if (isInteractive(e.target)) return
      const isDown = ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)
      const isUp = ['ArrowUp', 'PageUp'].includes(e.key)
      if (!isDown && !isUp) return
      e.preventDefault()
      if (isDown) {
        if (s === total) releaseToOutro()
        else advanceBy(1)
      } else {
        advanceBy(-1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      clearSilenceTimer()
      boundaryLockRef.current = false
    }
  }, [
    enabled,
    paused,
    total,
    outroStep,
    accumulateAndAdvance,
    advanceBy,
    releaseToOutro,
    engageBoundaryLock,
    armSilenceTimer,
    clearSilenceTimer,
  ])

  const phase: HomePhase = step === 0 ? 'hero' : step <= total ? 'works' : 'outro'
  const activeIndex = Math.max(0, Math.min(total - 1, step - 1))

  return { enabled, phase, activeIndex, total, goNext, goPrev, enterWorks }
}
