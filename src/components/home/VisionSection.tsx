import chairmanImg from '../../assets/333452.webp'
import aplMainLogo from '../../assets/logo.webp'

export function VisionSection() {
  return (
    <section className="vision-section">
      <h2 className="section-heading">The <span>Vision</span></h2>
      <p className="section-description">Pioneering the future of cricket, fostering domestic talents, and uniting global audiences.</p>

      <div className="acb-split-layout">
        {/* Left Column: Text + Logo */}
        <div className="acb-left-panel">
          <div className="acb-brand-header">
            <img src={aplMainLogo} alt="APL Logo" className="acb-brand-logo-apl" loading="lazy" decoding="async" />
          </div>

          <p className="acb-simple-paragraph">
            As a <span className="highlight-text">Full ICC Member since 2017</span>, the ACB governs cricket across the nation. Our mission spans from grassroots development to the global arena, serving as a beacon of aspiration, joy, and hope for over <span className="highlight-text">35 million people</span>.
          </p>

          <p className="acb-simple-paragraph secondary-paragraph">
            Through the <span className="highlight-text">Afghanistan Premier League</span>, we bridge domestic brilliance and international stardom, creating an ecosystem that fosters raw talent, inspires the youth, and accelerates our rise as a powerhouse of global cricket.
          </p>

          <div className="acb-left-actions">
            <a href="#about" className="acb-simple-button">Read More</a>
          </div>
        </div>

        {/* Right Column: Chairman Image Card with bottom-left text */}
        <div className="acb-right-panel">
          <div className="acb-chairman-card-modern">
            <div className="acb-card-frame-accent top-right"></div>
            <div className="acb-card-frame-accent bottom-left"></div>
            <img src={chairmanImg} alt="Mirwais Ashraf – Chairman, Afghan Cricket Board" className="acb-chairman-img" loading="lazy" decoding="async" />
            <div className="acb-chairman-overlay-modern"></div>
            <div className="acb-chairman-info-modern">
              <div className="acb-chairman-badge">ACB Leadership</div>
              <h4 className="acb-chairman-name-modern">Mirwais Ashraf</h4>
              <p className="acb-chairman-role-modern">Chairman, Afghan Cricket Board</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row — Moved below split panel to span full section width */}
      <div className="acb-stats-row">
        <div className="acb-stat-item">
          <span className="acb-stat-num">2017</span>
          <span className="acb-stat-label">ICC Full Member</span>
          <div className="acb-stat-divider"></div>
        </div>
        <div className="acb-stat-item">
          <span className="acb-stat-num">35M+</span>
          <span className="acb-stat-label">Inspiring Lives</span>
          <div className="acb-stat-divider"></div>
        </div>
        <div className="acb-stat-item">
          <span className="acb-stat-num">APL</span>
          <span className="acb-stat-label">Global Pathway</span>
          <div className="acb-stat-divider"></div>
        </div>
      </div>
    </section>
  )
}
