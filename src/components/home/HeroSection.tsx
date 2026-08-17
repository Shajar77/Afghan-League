import { MatchTicker } from './MatchTicker'
import { FEATURES } from '../../constants/features'
import aboutVideoWebm from '../../assets/about-video (1).webm'
import aboutVideo from '../../assets/about-video (1).mp4'

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
          preload="metadata"
        >
          <source src={aboutVideoWebm} type="video/webm" />
          <source src={aboutVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Matches Scorecard docked below the navbar (over the video background) */}
      {FEATURES.SHOW_MATCH_TICKER && (
        <div className="hero-matches-ticker-wrapper">
          <MatchTicker />
        </div>
      )}
      <div className="hero-content">
        <h1 className="hero-title">A Legacy<br />in the Making!</h1>
        <p className="hero-status-subtitle">REGISTRATIONS ARE OPEN NOW</p>
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
