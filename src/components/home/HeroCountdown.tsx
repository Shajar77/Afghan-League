import { useState, useEffect } from 'react'

// Target: 27 December 2026 at 5:00 PM Dubai Time (GST: UTC+4)
const TARGET_DATE = new Date('2026-12-27T17:00:00+04:00').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const difference = TARGET_DATE - Date.now()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero-countdown-card">
      <div className="hero-countdown-header">
        <div className="hero-countdown-badge">
          <span>APL FIRST MATCH COUNTDOWN</span>
        </div>
        <span className="hero-countdown-date">27 DEC 2026 • 5:00 PM (DUBAI TIME)</span>
      </div>

      <div className="hero-countdown-timer">
        <div className="hero-countdown-item">
          <span className="hero-countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="hero-countdown-unit">DAYS</span>
        </div>
        <span className="hero-countdown-divider">:</span>
        <div className="hero-countdown-item">
          <span className="hero-countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="hero-countdown-unit">HOURS</span>
        </div>
        <span className="hero-countdown-divider">:</span>
        <div className="hero-countdown-item">
          <span className="hero-countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="hero-countdown-unit">MINS</span>
        </div>
        <span className="hero-countdown-divider">:</span>
        <div className="hero-countdown-item">
          <span className="hero-countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="hero-countdown-unit">SECS</span>
        </div>
      </div>
    </div>
  )
}
