import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const STAR_COLOR = '#F6A668'
const AREA_PER_STAR = 18_000
const MIN_STARS = 40
const MAX_STARS = 80
const INFLUENCE_RADIUS = 120
const REPULSION_STRENGTH = 2.5
const SPRING_K = 0.06
const DAMPING = 0.82
const TWINKLE_AMPLITUDE = 0.4
const BASE_OPACITY = 0.45
const BRIGHT_OPACITY = 1
const STATIC_OPACITY = 0.55
const STAR_VIEWBOX = 103
const STAR_SIZE_MIN = 5
const STAR_SIZE_MAX = 11

/** 四角星 path，viewBox 0 0 103 103，中心 (51.5, 51.5) */
const STAR_PATH =
  'M51.5 0C51.5 0 61.6216 20.8357 71.893 31.107C82.1643 41.3784 103 51.5 103 51.5C103 51.5 82.1643 61.6216 71.893 71.893C61.6216 82.1643 51.5 103 51.5 103C51.5 103 41.3784 82.1643 31.107 71.893C20.8357 61.6216 0 51.5 0 51.5C0 51.5 20.8357 41.3784 31.107 31.107C41.3784 20.8357 51.5 0 51.5 0Z'

const starPath = new Path2D(STAR_PATH)

type Star = {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  phase: number
  twinkleSpeed: number
  size: number
}

function starCountForArea(width: number, height: number): number {
  return Math.min(MAX_STARS, Math.max(MIN_STARS, Math.floor((width * height) / AREA_PER_STAR)))
}

function createStar(width: number, height: number): Star {
  const homeX = Math.random() * width
  const homeY = Math.random() * height
  return {
    homeX,
    homeY,
    x: homeX,
    y: homeY,
    vx: 0,
    vy: 0,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.0008 + Math.random() * 0.0012,
    size: STAR_SIZE_MIN + Math.random() * (STAR_SIZE_MAX - STAR_SIZE_MIN),
  }
}

function createStars(width: number, height: number): Star[] {
  const count = starCountForArea(width, height)
  return Array.from({ length: count }, () => createStar(width, height))
}

function drawStar(ctx: CanvasRenderingContext2D, star: Star, opacity: number, dpr: number) {
  const scale = (star.size * dpr) / STAR_VIEWBOX

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = STAR_COLOR
  ctx.translate(star.x * dpr, star.y * dpr)
  ctx.scale(scale, scale)
  ctx.translate(-STAR_VIEWBOX / 2, -STAR_VIEWBOX / 2)
  ctx.fill(starPath)
  ctx.restore()
}

function renderStatic(ctx: CanvasRenderingContext2D, stars: Star[], dpr: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (const star of stars) {
    drawStar(ctx, star, STATIC_OPACITY, dpr)
  }
  ctx.globalAlpha = 1
}

export function StarBackground() {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef(0)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const prev = sizeRef.current
      const areaChanged =
        prev.width > 0 &&
        prev.height > 0 &&
        starCountForArea(width, height) !== starCountForArea(prev.width, prev.height)

      sizeRef.current = { width, height, dpr }

      if (starsRef.current.length === 0 || areaChanged) {
        starsRef.current = createStars(width, height)
      } else {
        const scaleX = width / prev.width
        const scaleY = height / prev.height
        for (const star of starsRef.current) {
          star.homeX *= scaleX
          star.homeY *= scaleY
          star.x *= scaleX
          star.y *= scaleY
        }
      }

      if (reduced) {
        renderStatic(ctx, starsRef.current, dpr)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true }
    }

    const onPointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false }
    }

    const tick = (time: number) => {
      const { dpr } = sizeRef.current
      const stars = starsRef.current
      const mouse = mouseRef.current
      const radiusSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        let opacity =
          BASE_OPACITY + Math.sin(time * star.twinkleSpeed + star.phase) * TWINKLE_AMPLITUDE

        if (mouse.active) {
          const dx = star.x - mouse.x
          const dy = star.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < radiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq)
            const falloff = 1 - dist / INFLUENCE_RADIUS
            const force = REPULSION_STRENGTH * falloff * falloff
            star.vx += (dx / dist) * force
            star.vy += (dy / dist) * force
            opacity = Math.max(opacity, BRIGHT_OPACITY)
          }
        }

        star.vx += (star.homeX - star.x) * SPRING_K
        star.vy += (star.homeY - star.y) * SPRING_K
        star.vx *= DAMPING
        star.vy *= DAMPING
        star.x += star.vx
        star.y += star.vy

        drawStar(ctx, star, Math.max(0, Math.min(1, opacity)), dpr)
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(tick)
    }

    syncSize()
    window.addEventListener('resize', syncSize)

    if (reduced) {
      return () => {
        window.removeEventListener('resize', syncSize)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', syncSize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  )
}
