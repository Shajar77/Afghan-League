import { MatchTicker } from './MatchTicker'
import { HeroCountdown } from './HeroCountdown'
import { FEATURES } from '../../constants/features'
import './HeroSection.css'

// Cloudflare R2 Stream URL
const HERO_VIDEO_MP4 = 'https://pub-5470ece9eb504ca495abf5262e87e048.r2.dev/hero_compressed.mp4'

// High-priority Poster: first frame extracted as lightweight WebP
const HERO_POSTER = 'https://res.cloudinary.com/ihuz5bq6/video/upload/so_0,w_1280,q_auto,f_webp/v1787984907/APL_Trophy_v6_FHD_1.webp'

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
        <p className="hero-status-subtitle">REGISTRATIONS ARE OPEN</p>
        <div className="hero-actions">
          <a href="#register-player" className="btn-register-now hero-btn">
            <span className="skew-unskew-text">PLAYER REGISTRATION</span>
          </a>

          <a href="#register-status" className="btn-contact hero-btn">
            <span>REGISTRATION STATUS</span>
          </a>
        </div>
      </div>
    </section>
  )
}
