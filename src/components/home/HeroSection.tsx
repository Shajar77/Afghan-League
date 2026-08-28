import { MatchTicker } from './MatchTicker'
import { HeroCountdown } from './HeroCountdown'
import { FEATURES } from '../../constants/features'
import './HeroSection.css'

// Optimized Cloudinary URLs: auto quality, 1280px width cap, 2Mbps bitrate limit
const HERO_VIDEO_WEBM = 'https://res.cloudinary.com/ihuz5bq6/video/upload/q_auto,f_webm,w_1280,br_2m/v1787823840/APL_TROPHY_V7_1_1_1.mp4'
const HERO_VIDEO_MP4 = 'https://res.cloudinary.com/ihuz5bq6/video/upload/q_auto,f_mp4,w_1280,br_2m/v1787823840/APL_TROPHY_V7_1_1_1.mp4'

// High-priority Poster: first frame extracted as lightweight WebP
const HERO_POSTER = 'https://res.cloudinary.com/ihuz5bq6/video/upload/so_0,w_1280,q_auto,f_webp/v1787823840/APL_TROPHY_V7_1_1_1.webp'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Matches Scorecard docked below the navbar */}
      {FEATURES.SHOW_MATCH_TICKER && (
        <div className="hero-matches-ticker-wrapper">
          <MatchTicker />
        </div>
      )}

      {/* Top Countdown Bar */}
      <div className="hero-countdown-top-wrapper">
        <HeroCountdown />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">A Legacy<br />in the Making!</h1>
        <p className="hero-status-subtitle">REGISTRATIONS ARE OPEN NOW</p>
        <div className="hero-actions">
          <a href="#contact-us" className="btn-contact hero-btn">
            <span>CONTACT US</span>
          </a>
        </div>
      </div>
    </section>
  )
}
