import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, format }: { value: number; format: (value: number) => string }) {
  const [display, setDisplay] = useState(0)
  const frame = useRef(0)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return
    const start = performance.now()
    const duration = 620
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, reduceMotion])

  return <span aria-label={format(value)}>{format(reduceMotion ? value : display)}</span>
}
