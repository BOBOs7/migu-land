import {
  Alignment,
  EventType,
  Fit,
  Layout,
  useRive,
} from '@rive-app/react-canvas'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { publicAsset } from '../../lib/publicAsset'

const RIVE = {
  src: publicAsset('/assets/migu-idle.riv'),
  artboard: 'Artboard',
  stateMachine: 'State Machine 1',
} as const

/** 监听圆半径占视口短边的比例 */
const CIRCLE_RADIUS_RATIO = 0.48

type CircleCenter = {
  cx: number
  cy: number
  radius: number
}

function getInteractionCircle(): CircleCenter {
  const radius = Math.min(window.innerWidth, window.innerHeight) * CIRCLE_RADIUS_RATIO
  return {
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
    radius,
  }
}

function mapPointerInCircle(
  clientX: number,
  clientY: number,
  circle: CircleCenter,
): { inside: boolean; normX: number; normY: number } {
  const dx = clientX - circle.cx
  const dy = clientY - circle.cy
  const distSq = dx * dx + dy * dy
  const radiusSq = circle.radius * circle.radius

  if (distSq > radiusSq) {
    return { inside: false, normX: 0, normY: 0 }
  }

  return {
    inside: true,
    normX: Math.max(-1, Math.min(1, dx / circle.radius)),
    normY: Math.max(-1, Math.min(1, -dy / circle.radius)),
  }
}

function toCanvasCoords(
  rect: DOMRect,
  normX: number,
  normY: number,
): { clientX: number; clientY: number } {
  return {
    clientX: rect.left + rect.width * (0.5 + normX * 0.45),
    clientY: rect.top + rect.height * (0.5 - normY * 0.45),
  }
}

function dispatchCanvasMouse(
  canvas: HTMLCanvasElement,
  type: 'mouseover' | 'mousemove' | 'mouseout',
  clientX: number,
  clientY: number,
) {
  canvas.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      view: window,
    }),
  )
}

export function RiveMascot() {
  const reduced = useReducedMotion()
  const [riveReady, setRiveReady] = useState(false)
  const riveRef = useRef<ReturnType<typeof useRive>['rive']>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const insideCircleRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)

  const initRive = useCallback((instance: NonNullable<ReturnType<typeof useRive>['rive']>) => {
    riveRef.current = instance
    instance.setupRiveListeners()
    instance.resizeDrawingSurfaceToCanvas()
    setRiveReady(true)
  }, [])

  const { rive, canvas, RiveComponent } = useRive({
    src: RIVE.src,
    artboard: RIVE.artboard,
    stateMachines: RIVE.stateMachine,
    autoplay: true,
    onRiveReady: initRive,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  })

  riveRef.current = rive
  canvasRef.current = canvas

  useEffect(() => {
    if (!rive) {
      setRiveReady(false)
      return
    }
    const onLoad = () => initRive(rive)
    rive.on(EventType.Load, onLoad)
    return () => rive.off(EventType.Load, onLoad)
  }, [rive, initRive])

  useEffect(() => {
    if (reduced || !riveReady) return

    const applyPointer = (clientX: number, clientY: number) => {
      const targetCanvas = canvasRef.current
      if (!targetCanvas) return

      const rect = targetCanvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      const { inside, normX, normY } = mapPointerInCircle(
        clientX,
        clientY,
        getInteractionCircle(),
      )

      if (!inside) {
        if (insideCircleRef.current) {
          insideCircleRef.current = false
          dispatchCanvasMouse(targetCanvas, 'mouseout', clientX, clientY)
        }
        return
      }

      const { clientX: synthX, clientY: synthY } = toCanvasCoords(rect, normX, normY)

      if (!insideCircleRef.current) {
        insideCircleRef.current = true
        dispatchCanvasMouse(targetCanvas, 'mouseover', synthX, synthY)
      }
      dispatchCanvasMouse(targetCanvas, 'mousemove', synthX, synthY)
    }

    const flushPointer = () => {
      rafRef.current = null
      const pending = pendingRef.current
      if (!pending) return
      applyPointer(pending.x, pending.y)
    }

    const schedulePointer = (clientX: number, clientY: number) => {
      pendingRef.current = { x: clientX, y: clientY }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(flushPointer)
    }

    const onMove = (event: PointerEvent) => {
      schedulePointer(event.clientX, event.clientY)
    }

    const onReset = () => {
      insideCircleRef.current = false
      pendingRef.current = null
      const targetCanvas = canvasRef.current
      if (targetCanvas) {
        dispatchCanvasMouse(targetCanvas, 'mouseout', 0, 0)
      }
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onReset)
    window.addEventListener('blur', onReset)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onReset)
      window.removeEventListener('blur', onReset)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      onReset()
    }
  }, [reduced, riveReady])

  return (
    <div className="pointer-events-none mx-auto h-[min(320px,70vw)] w-[min(320px,70vw)]">
      <RiveComponent className="pointer-events-none h-full w-full" aria-hidden />
    </div>
  )
}
