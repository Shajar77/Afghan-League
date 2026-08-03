import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { MatchTicker } from './components/MatchTicker'
import { Ticket, ChevronDown, User, Handshake } from 'lucide-react'
import heroVideo from './assets/hero-video-new (1).mp4'
import aboutVideo from './assets/about-video (1).mp4'
import aplLogo from './assets/APL Logo - White.png'
import acbLogo from './assets/ACBlogo.webp'
import chairmanImg from './assets/333452.webp'
import aplMainLogo from './assets/logo.png'
import Masonry from './components/Masonry'
import gallery1 from './assets/gallery-1.jpeg'
import gallery2 from './assets/gallery-2.jpeg'
import gallery3 from './assets/gallery-3.jpeg'
import gallery4 from './assets/gallery-4.jpeg'
import gallery5 from './assets/gallery-5.jpeg'
import gallery6 from './assets/gallery-6.jpeg'
import gallery7 from './assets/gallery-7.jpeg'
import gallery8 from './assets/gallery-8.jpeg'
import './App.css'

const galleryItems = [
  {
    id: '1',
    img: gallery1,
    url: '#gallery',
    height: 600
  },
  {
    id: '2',
    img: gallery2,
    url: '#gallery',
    height: 750
  },
  {
    id: '3',
    img: gallery3,
    url: '#gallery',
    height: 550
  },
  {
    id: '4',
    img: gallery4,
    url: '#gallery',
    height: 800
  },
  {
    id: '5',
    img: gallery5,
    url: '#gallery',
    height: 700
  },
  {
    id: '6',
    img: gallery6,
    url: '#gallery',
    height: 650
  },
  {
    id: '7',
    img: gallery7,
    url: '#gallery',
    height: 600
  },
  {
    id: '8',
    img: gallery8,
    url: '#gallery',
    height: 750
  }
];

function App() {
  const [heroRegisterOpen, setHeroRegisterOpen] = useState(false)

  return (
    <div className="app-container">
      <Navbar />

      <section className="hero-section">
        <div className="hero-bg">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">A Legacy in the Making!</h1>
          <p className="hero-status-subtitle">REGISTRATIONS ARE OPEN</p>
          <div className="hero-actions">
            <div className="register-dropdown-wrapper">
              <button
                className="btn-register-now hero-btn"
                onClick={() => setHeroRegisterOpen(!heroRegisterOpen)}
              >
                <span>PLAYER REGISTRATION</span>
                <ChevronDown size={16} />
              </button>
              {heroRegisterOpen && (
                <div className="register-dropdown-menu hero-register-dropdown">
                  <a href="#register-player" className="register-option-item" onClick={() => setHeroRegisterOpen(false)}>
                    <div className="register-option-icon">
                      <User size={18} />
                    </div>
                    <div className="register-option-text">
                      <span className="register-option-title">Register as a Player</span>
                      <span className="register-option-desc">Draft pool entry form</span>
                    </div>
                  </a>
                  <a href="#register-agent" className="register-option-item" onClick={() => setHeroRegisterOpen(false)}>
                    <div className="register-option-icon">
                      <Handshake size={18} />
                    </div>
                    <div className="register-option-text">
                      <span className="register-option-title">Register as an Agent</span>
                      <span className="register-option-desc">Official player agent sign up</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <a href="#buy-tickets" className="btn-contact hero-btn">
              <span>BUY TICKETS</span>
              <Ticket size={16} />
            </a>
          </div>
        </div>
      </section>

      <main className="app-main">
        <section className="matches-section">
          <h2 className="section-heading">Matches</h2>
          <p className="section-description">Stay updated with live scores, recent results, and upcoming league matches.</p>
          <MatchTicker />
        </section>

        <section className="teams-section">
          <h2 className="section-heading">Choose your team</h2>
          <p className="section-description">Explore the official competing franchises and access their club pages.</p>
          <div className="teams-layout">
            {/* Left: grid */}
            <div className="teams-left">
              <div className="teams-grid">
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
                <div className="team-card">
                  <div className="team-logo-placeholder"></div>
                </div>
              </div>
            </div>

            {/* Right: video panel */}
            <div className="teams-right">
              <div className="teams-video-container">
                <div className="teams-video-wrapper">
                  <video
                    className="teams-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={aboutVideo} type="video/mp4" />
                  </video>
                  <div className="teams-video-overlay"></div>
                  <div className="teams-video-logo-wrapper">
                    <img src={aplLogo} alt="APL Logo" className="teams-video-logo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="launch-section">
          <h2 className="section-heading">Grand Launch Event of APL</h2>
          <p className="section-description">Relive the highlights and spectacular event celebrations from the league opening.</p>
          <div className="launch-video-wrapper">
            <iframe
              className="launch-video-iframe"
              src="https://www.youtube.com/embed/sq00E0Rmyjs"
              title="The APL Grand Launch Event"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="vision-section">
          <h2 className="section-heading">The Vision</h2>
          <p className="section-description">Pioneering the future of cricket, fostering domestic talents, and uniting global audiences.</p>

          <div className="acb-split-layout">
            {/* Left Column: Text + Logo + Stats */}
            <div className="acb-left-panel">
              <div className="acb-brand-header">
                <img src={aplMainLogo} alt="APL Logo" className="acb-brand-logo-apl" />
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

              {/* Stats Row */}
              <div className="acb-stats-row">
                <div className="acb-stat-item">
                  <span className="acb-stat-num">2017</span>
                  <span className="acb-stat-label">ICC Full Member</span>
                </div>
                <div className="acb-stat-item">
                  <span className="acb-stat-num">35M+</span>
                  <span className="acb-stat-label">Inspiring Lives</span>
                </div>
                <div className="acb-stat-item">
                  <span className="acb-stat-num">APL</span>
                  <span className="acb-stat-label">Global Pathway</span>
                </div>
              </div>
            </div>

            {/* Right Column: Chairman Image Card with bottom-left text */}
            <div className="acb-right-panel">
              <div className="acb-chairman-card-modern">
                <div className="acb-card-frame-accent top-right"></div>
                <div className="acb-card-frame-accent bottom-left"></div>
                <img src={chairmanImg} alt="Mirwais Ashraf" className="acb-chairman-img" />
                <div className="acb-chairman-overlay-modern"></div>
                <div className="acb-chairman-info-modern">
                  <div className="acb-chairman-badge">ACB Leadership</div>
                  <h4 className="acb-chairman-name-modern">Mirwais Ashraf</h4>
                  <p className="acb-chairman-role-modern">Chairman, Afghan Cricket Board</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <h2 className="section-heading">Gallery</h2>
          <p className="section-description">A visual journey through the most iconic moments and highlights of the APL.</p>
          <div className="gallery-container">
            <Masonry
              items={galleryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
          </div>
        </section>

        <section className="find-out-more-section">
          <h2 className="section-heading">More about APL</h2>
          <p className="section-description">Dive deeper into the tournament structure, regulations, and historical records.</p>
          <div className="fom-grid">
            <div className="fom-card fom-card-r1-c1">
              <h3 className="fom-card-title">WHAT IS THE APL?</h3>
            </div>
            <div className="fom-card fom-card-r1-c2">
              <h3 className="fom-card-title">THE APL RULES EXPLAINED</h3>
            </div>
            <div className="fom-card fom-card-r2-c1">
              <h3 className="fom-card-title">HOW TO BUY TICKETS FOR THE APL</h3>
            </div>
            <div className="fom-card fom-card-r2-c2">
              <h3 className="fom-card-title">WHO WILL PLAY IN THE APL IN 2026?</h3>
            </div>
            <div className="fom-card fom-card-r3-c1">
              <h3 className="fom-card-title">PAST WINNERS OF THE APL</h3>
            </div>
            <div className="fom-card fom-card-r3-c2">
              <h3 className="fom-card-title">WHEN IS THE APL FINAL?</h3>
            </div>
            <div className="fom-card fom-card-r3-c3">
              <h3 className="fom-card-title">WHAT IS THE APL ELIMINATOR?</h3>
            </div>
          </div>
        </section>

      </main>

      <footer className="app-footer">
        <div className="footer-container">
          {/* Top Row: Brand Info & Social Wrapper */}
          <div className="footer-top-row">
            <div className="footer-brand-info">
              <img src={aplLogo} alt="APL Logo" className="footer-logo-main" />
            </div>

            <div className="footer-social-wrapper">
              <span className="follow-us-title">Follow the Action</span>
              <div className="footer-social-list">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle facebook" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle instagram" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle twitter" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-circle youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
                    <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#000000" />
                  </svg>
                </a>
                <button className="chat-bubble-round" aria-label="Chat Support">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Centered ACB Partner Logo */}
          <div className="acb-bottom-logo-container">
            <img src={acbLogo} alt="ACB Logo" className="acb-bottom-logo" />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
