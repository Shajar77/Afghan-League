import aboutHeroImg from '../assets/about-hero-bg-new.jpg'
import introImg from '../assets/gallery-8.webp'
import acbLogo from '../assets/ACBlogo.webp'
import aplLogo from '../assets/APL Logo - White.webp'
import './About.css'

export function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section about-hero-section">
        <div className="hero-bg">
          <img src={aboutHeroImg} alt="About Us Hero" className="hero-video" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title about-hero-title">ABOUT US</h1>
          <p className="hero-status-subtitle about-hero-subtitle">More than just a league — it's a movement</p>
        </div>
      </section>

      {/* APL Split Intro Section */}
      <section className="about-intro-section">
        <div className="about-intro-container">
          {/* Left Panel: Description */}
          <div className="about-intro-left">
            <span className="about-intro-label">THE LEAGUE</span>
            <h2 className="about-intro-heading">Six provinces. One historic champion.</h2>
            <div className="about-intro-divider"></div>

            <p className="about-intro-text">
              Six province-based franchises will contest fourteen nights of elite T20 cricket at the iconic Kabul International Cricket Stadium. The Afghanistan Premier League (APL) pairs the theatre of world-class cricket with the legendary hospitality of Afghanistan — a celebration of the sport built for families, passionate communities, and travelling fans alike.
            </p>
            <p className="about-intro-text">
              The inaugural season is only the beginning. Iconic owners and world-class squad selections will be revealed ahead of the draft, with fan zones lighting up provincial capitals across the nation throughout the tournament fortnight.
            </p>
          </div>

          {/* Right Panel: Image with Overlay & Centered Logo */}
          <div className="about-intro-right">
            <div className="about-intro-img-wrapper">
              <img src={introImg} alt="APL Match Action" className="about-intro-img" />
              <div className="about-intro-img-overlay">
                <img src={aplLogo} alt="APL Logo" className="about-intro-centered-logo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider-line" />

      {/* APL Vision 2036 Section */}
      <section className="about-vision-section">
        <div className="about-vision-container">

          {/* Top part: 2036 Split */}
          <div className="vision-top-row">
            <div className="vision-year-column">
              <div className="vision-year-number">2036</div>
              <div className="vision-year-label">VISION 2036</div>
            </div>

            <div className="vision-desc-column">
              <h2 className="vision-desc-heading">Built for the next <span>10 editions</span></h2>
              <div className="about-intro-divider"></div>
              <p className="vision-desc-text">
                The APL is managed through a long-term commercial partnership between the Afghanistan Cricket Board (ACB) and the renowned consortium of Trans Group and ITW MEA. With decades of experience in global sports advertising, media planning, and event management, the partnership positions the league for international-standard delivery, driving the future of Afghan cricket forward.
              </p>
            </div>
          </div>

          {/* Bottom part: What We Stand For */}
          <div className="vision-bottom-row">
            <span className="vision-pillars-label">WHAT WE STAND FOR</span>

            <div className="vision-pillars-grid">
              {/* Pillar 01 */}
              <div className="vision-pillar-item">
                <span className="pillar-num">01</span>
                <h3 className="pillar-title">Global Standards</h3>
                <p className="pillar-desc">
                  Delivering world-class television broadcasts, expert sports advertising, and professional event execution for fans globally.
                </p>
              </div>

              {/* Pillar 02 */}
              <div className="vision-pillar-item">
                <span className="pillar-num">02</span>
                <h3 className="pillar-title">Grassroots Growth</h3>
                <p className="pillar-desc">
                  Developing pathways for emerging Afghan cricketers to rise from street level to the national spotlight and professional contracts.
                </p>
              </div>

              {/* Pillar 03 */}
              <div className="vision-pillar-item">
                <span className="pillar-num">03</span>
                <h3 className="pillar-title">Commercial Strength</h3>
                <p className="pillar-desc">
                  Securing long-term sustainability and commercial growth for regional cricket franchises through strategic media planning and corporate partnerships.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="section-divider-line" />

      {/* Partners Section (ACBlogo) - About Page Specific */}
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
