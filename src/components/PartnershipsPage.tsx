import { AnimatedCounter } from './AnimatedCounter'
import introImg from '../assets/gallery-6.webp'
import acbLogo from '../assets/ACBlogo.webp'
import aplLogo from '../assets/Asset 2@2x.png'
import './PartnershipsPage.css'
import './About.css'

export function PartnershipsPage() {
  return (
    <div className="partnerships-page-container about-page">

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

      {/* APL Split Intro Section - Global Reach */}
      <section className="about-intro-section">
        <div className="about-intro-container">
          {/* Left Panel: Description */}
          <div className="about-intro-left">
            <span className="about-intro-label">Global Reach</span>
            <h2 className="about-intro-heading">Built for fans, brands, and owners</h2>
            <div className="about-intro-divider"></div>

            <p className="about-intro-text" style={{ fontSize: '1.1rem', fontWeight: 500, color: '#ffffff' }}>
              Engage a young audience aged 15-25, a passionate 10M+ diaspora, and cricket fans across more than 10 regions through sponsorship, media, and franchise ownership pathways.
            </p>
            <p className="about-intro-text">
              The Afghanistan Premier League (APL) is a powerful, high-growth T20 commercial ecosystem designed to link premium global brands with an incredibly passionate cricket fanbase. Our strategic partnerships deliver value beyond borders, creating a lasting legacy for the sport.
            </p>
          </div>

          {/* Right Panel: Image with Overlay & Centered Logo */}
          <div className="about-intro-right">
            <div className="about-intro-img-wrapper">
              <img src={introImg} alt="Afghanistan cricket crowd waving flags in the stands" className="about-intro-img" />
              <div className="about-intro-img-overlay">
                <img src={aplLogo} alt="APL Logo" className="about-intro-centered-logo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tender Process Section */}
      <section className="about-vision-section">
        <div className="about-vision-container">
          <div className="vision-bottom-row">
            <span className="vision-pillars-label" style={{ marginBottom: '2.5rem' }}>Partnership Tender Process</span>
            
            <div className="vision-pillars-grid">
              {/* Step 01 */}
              <div className="vision-pillar-item">
                <span className="pillar-num" style={{ color: 'var(--brand-gold)' }}>01</span>
                <h3 className="pillar-title">Expression of Interest</h3>
                <p className="pillar-desc">
                  Initial submission of corporate credentials and licensing interest. Submit queries to obtain request for proposal (RFP) documentation.
                </p>
              </div>

              {/* Step 02 */}
              <div className="vision-pillar-item">
                <span className="pillar-num" style={{ color: 'var(--brand-gold)' }}>02</span>
                <h3 className="pillar-title">Technical Pre-qualification</h3>
                <p className="pillar-desc">
                  Rigorous evaluation of operational capability, sports media track records, and brand synergy to qualify for commercial rights.
                </p>
              </div>

              {/* Step 03 */}
              <div className="vision-pillar-item">
                <span className="pillar-num" style={{ color: 'var(--brand-gold)' }}>03</span>
                <h3 className="pillar-title">Financial and Technical Bidding</h3>
                <p className="pillar-desc">
                  Final competitive financial proposal submission, tender finalization, and commercial execution plans for franchise or kit rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider-line" />

      {/* Partners Section (ACBlogo) */}
      <section className="about-partners-section">
        <div className="about-partners-container">
          <h2 className="section-heading partners-heading">Official <span>Partners</span></h2>
          <div className="acb-bottom-logo-container" style={{ borderTop: 'none', paddingTop: 0 }}>
            <img src={acbLogo} alt="ACB Logo – Official Partner" className="acb-bottom-logo" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  )
}
