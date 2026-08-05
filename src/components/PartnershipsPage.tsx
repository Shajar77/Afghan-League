import { useState, useEffect } from 'react'
import './PartnershipsPage.css'

interface AnimatedCounterProps {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      const easeVal = percentage * (2 - percentage)
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

export function PartnershipsPage() {
  return (
    <div className="partnerships-page-container">

      {/* ── HERO ── */}
      <div className="partnerships-hero">
        <div className="partnerships-hero-grid-bg" />
        <div className="partnerships-hero-glow-left" />
        <div className="partnerships-hero-glow-right" />

        <div className="partnerships-hero-inner">
          <div className="partnerships-hero-left">
            <div className="partnerships-live-badge">
              <span className="partnerships-live-dot" />
              <span className="partnerships-live-text">PARTNERSHIP OPPORTUNITIES</span>
            </div>

            <div className="partnerships-hero-heading-wrap">
              <h1 className="partnerships-hero-title">PARTNER<span className="dot-accent">.</span></h1>
              <div className="partnerships-hero-underline" />
            </div>

            <p className="partnerships-hero-subtitle">
              Connect with a global audience. Sponsorship, media, franchise ownership, and brand partnerships for a young, passionate, global cricket fanbase.
            </p>
          </div>

          {/* Hero stats */}
          <div className="partnerships-hero-stats">
            <div className="partnerships-stat-item">
              <span className="partnerships-stat-number">
                <AnimatedCounter target={10} suffix="M+" />
              </span>
              <span className="partnerships-stat-label">DIASPORA</span>
            </div>
            <div className="partnerships-stat-divider" />
            <div className="partnerships-stat-item">
              <span className="partnerships-stat-number">
                <AnimatedCounter target={25} prefix="15–" />
              </span>
              <span className="partnerships-stat-label">CORE FAN AGE</span>
            </div>
            <div className="partnerships-stat-divider" />
            <div className="partnerships-stat-item">
              <span className="partnerships-stat-number">
                <AnimatedCounter target={10} suffix="+" />
              </span>
              <span className="partnerships-stat-label">REGIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMING SOON SECTION ── */}
      <div className="partnerships-coming-soon-container">
        <div className="partnerships-coming-soon-content">
          <h2 className="partnerships-coming-soon-title">
            COMING <span className="partnerships-title-gold">SOON</span>
          </h2>
          <p className="partnerships-coming-soon-subtitle">
            Official partnership packages and commercial opportunities will be announced shortly.
          </p>
        </div>
      </div>
    </div>
  )
}
