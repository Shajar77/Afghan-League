import { useState, useEffect } from 'react'

interface AnimatedCounterProps {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      const easeVal = percentage * (2 - percentage) // Quad ease-out
      setCount(Math.floor(easeVal * target))

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration])

  return (
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  )
}
