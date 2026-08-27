import { MatchTicker } from './MatchTicker'
import { FEATURES } from '../../constants/features'

const HERO_VIDEO_MP4 = 'https://res.cloudinary.com/ihuz5bq6/video/upload/q_auto,f_mp4/v1787816012/APL_TROPHY_V7_1_1.mp4'
const HERO_VIDEO_WEBM = 'https://res.cloudinary.com/ihuz5bq6/video/upload/q_auto,f_webm/v1787816012/APL_TROPHY_V7_1_1.webm'
const HERO_VIDEO_RAW = 'https://res.cloudinary.com/ihuz5bq6/video/upload/v1787816012/APL_TROPHY_V7_1_1.mp4'

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
          src={HERO_VIDEO_RAW}
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
          <source src={HERO_VIDEO_RAW} type="video/mp4" />
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
          <a href="#contact-us" className="btn-contact hero-btn">
            <span>CONTACT US</span>
          </a>
        </div>
      </div>
    </section>
  )
}
