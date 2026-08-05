import { useState, useEffect, useRef } from 'react'
import { Navbar } from './components/Navbar'
import { MatchTicker } from './components/MatchTicker'
import { About } from './components/About'
import { Moments } from './components/Moments'
import { News } from './components/News'
import { GalleryPage } from './components/GalleryPage'
import { FixturesPage } from './components/FixturesPage'
import { PointsTable } from './components/PointsTable'
import { PartnershipsPage } from './components/PartnershipsPage'
import { Ticket, VolumeX } from 'lucide-react'
import aboutVideoWebm from './assets/about-video (1).webm'
import aboutVideo from './assets/about-video (1).mp4'
import aplLogo from './assets/APL Logo - White.webp'
import acbLogo from './assets/ACBlogo.webp'
import chairmanImg from './assets/333452.webp'
import aplMainLogo from './assets/logo.webp'
import londonSpiritLogo from './assets/london-spirit-white.svg'
import birminghamPhoenixLogo from './assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from './assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from './assets/sunrisers-leeds.svg'
import welshFireLogo from './assets/welsh-fire-white.svg'
import southernBraveLogo from './assets/southern-brave-alt.svg'
import fomImg1 from './assets/2166774277.webp'
import fomImg2 from './assets/AD1_2727_zQkE8coH_20230809060237-1610761.webp'
import fomImg3 from './assets/SunRisers-Leeds-fans-at-Headingley.webp'
import fomImg4 from './assets/GettyImages-2230120408.webp'
import fomImg5 from './assets/AD1_0256-2130422.webp'
import fomImg6 from './assets/GettyImages-1335413950.webp'
import fomImg7 from './assets/GettyImages-2163231267.webp'
import { gsap } from 'gsap'
import './App.css'

/** Shared GSAP bouncing cricket ball animation attached to a ref */
function useCricketBallAnimation(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!ref.current) return
    const ball = ref.current
    const sphere = ball.querySelector('.seam-ball-sphere')
    const tl = gsap.timeline({ repeat: -1 })
    let trackWidth = window.innerWidth + 80
    tl.set(ball, { x: -60, y: 0, scaleY: 1, scaleX: 1 })
    tl.set(sphere, { rotation: 0 })
    tl.to(ball, { x: trackWidth, duration: 3.8, ease: 'none' }, 0)
    tl.to(sphere, { rotation: 1440, duration: 3.8, ease: 'none' }, 0)
    tl.to(ball, { y: -34, scaleY: 1.06, scaleX: 0.94, duration: 0.4, ease: 'power1.out' }, 0)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.4, ease: 'power1.in' }, 0.4)
      .to(ball, { y: 0, scaleY: 0.76, scaleX: 1.24, duration: 0.08, ease: 'power1.out' }, 0.8)
      .to(ball, { y: -12, scaleY: 1.03, scaleX: 0.97, duration: 0.24, ease: 'power1.out' }, 0.88)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.24, ease: 'power1.in' }, 1.12)
      .to(ball, { y: 0, scaleY: 0.86, scaleX: 1.14, duration: 0.08, ease: 'power1.out' }, 1.36)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.08, ease: 'power1.out' }, 1.44)
    const handleResize = () => {
      trackWidth = window.innerWidth + 80
      const xTween = tl.getChildren(false, true, false).find(t => t.vars && t.vars.x !== undefined)
      if (xTween) xTween.vars.x = trackWidth
      tl.invalidate().restart()
    }
    window.addEventListener('resize', handleResize)
    return () => { tl.kill(); window.removeEventListener('resize', handleResize) }
  }, [])
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [launchMuted, setLaunchMuted] = useState(true)
  const [side1Muted, setSide1Muted] = useState(true)
  const [side2Muted, setSide2Muted] = useState(true)
  const [side3Muted, setSide3Muted] = useState(true)
  const ballRef = useRef<HTMLDivElement>(null)
  const ballRef2 = useRef<HTMLDivElement>(null)

  useCricketBallAnimation(ballRef)
  useCricketBallAnimation(ballRef2)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#about') {
        setCurrentPage('about')
        window.scrollTo(0, 0)
      } else if (hash === '#news') {
        setCurrentPage('news')
        window.scrollTo(0, 0)
      } else if (hash === '#gallery') {
        setCurrentPage('gallery')
        window.scrollTo(0, 0)
      } else if (hash === '#fixtures') {
        setCurrentPage('fixtures')
        window.scrollTo(0, 0)
      } else if (hash === '#points-table') {
        setCurrentPage('points-table')
        window.scrollTo(0, 0)
      } else if (hash === '#partnerships') {
        setCurrentPage('partnerships')
        window.scrollTo(0, 0)
      } else {
        setCurrentPage('home')
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  /** Unmutes a YouTube iframe and triggers playback */
  const handleUnmute = (iframeId: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false)
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*')
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*')
    }
  }

  return (
    <div className="app-container">
      <Navbar />

      {currentPage === 'home' ? (
        <>
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
            <div className="hero-matches-ticker-wrapper">
              <MatchTicker />
            </div>
            <div className="hero-content">
              <h1 className="hero-title">A Legacy<br />in the Making!</h1>
              <p className="hero-status-subtitle">REGISTRATIONS ARE OPEN</p>
              <div className="hero-actions">
                <a href="#register-player" className="btn-register-now hero-btn">
                  <span className="skew-unskew-text">PLAYER REGISTRATION</span>
                </a>

                <a href="#buy-tickets" className="btn-contact hero-btn">
                  <span>BUY TICKETS</span>
                  <Ticket size={16} />
                </a>
              </div>
            </div>
          </section>

          {/* Stats Bar Section */}
          <section className="stats-section">
            {/* Background Decorative Patterns */}
            <div className="stats-bg-pattern-grid"></div>
            <div className="stats-bg-glow-orb orb-1"></div>
            <div className="stats-bg-glow-orb orb-2"></div>

            <div className="stats-watermark">APL LIVE STATS PERFORMANCE • APL LIVE STATS PERFORMANCE • APL LIVE STATS PERFORMANCE •</div>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-value">6</div>
                <div className="stat-label">Elite Teams</div>
                <div className="stat-divider"></div>
              </div>
              <div className="stat-card">
                <div className="stat-value">18</div>
                <div className="stat-label">Thrilling Matches</div>
                <div className="stat-divider"></div>
              </div>
              <div className="stat-card">
                <div className="stat-value">17K+</div>
                <div className="stat-label">Stadium Capacity</div>
                <div className="stat-divider"></div>
              </div>
              <div className="stat-card">
                <div className="stat-value">10M+</div>
                <div className="stat-label">Fans</div>
                <div className="stat-divider"></div>
              </div>
            </div>
          </section>

          <main className="app-main">
            <section className="teams-section">
              <h2 className="section-heading">Choose <br />your <span>team</span></h2>
              <p className="section-description">Explore the official competing franchises and access their club pages.</p>

              <div className="teams-layout">
                {/* Left side: Teams Grid */}
                <div className="teams-left">
                  <div className="teams-grid">
                    <a href="#team-kabul" className="team-card" title="Kabul Knights">
                      <img src={londonSpiritLogo} alt="Kabul Knights Logo" className="team-logo-img" />
                    </a>
                    <a href="#team-kandahar" className="team-card" title="Kandahar Kings">
                      <img src={birminghamPhoenixLogo} alt="Kandahar Kings Logo" className="team-logo-img" />
                    </a>
                    <a href="#team-balkh" className="team-card" title="Balkh Legends">
                      <img src={manchesterSuperGiantsLogo} alt="Balkh Legends Logo" className="team-logo-img" />
                    </a>
                    <a href="#team-paktia" className="team-card" title="Paktia Panthers">
                      <img src={sunrisersLeedsLogo} alt="Paktia Panthers Logo" className="team-logo-img" />
                    </a>
                    <a href="#team-amo" className="team-card" title="Amo Sharks">
                      <img src={welshFireLogo} alt="Amo Sharks Logo" className="team-logo-img" />
                    </a>
                    <a href="#team-bandeamir" className="team-card" title="Band-e-Amir Dragons">
                      <img src={southernBraveLogo} alt="Band-e-Amir Dragons Logo" className="team-logo-img" />
                    </a>
                  </div>
                </div>

                {/* Right side: Video Widget */}
                <div className="teams-right">
                  <div className="teams-video-container">
                    <div className="teams-video-wrapper">
                      <video
                        className="teams-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      >
                        <source src={aboutVideoWebm} type="video/webm" />
                        <source src={aboutVideo} type="video/mp4" />
                      </video>
                      <div className="teams-video-overlay"></div>
                      <div className="teams-video-logo-wrapper">
                        <img src={aplLogo} alt="APL Logo Overlay" className="teams-video-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cricket Ball Seam Separator — above Points Table */}
            <div className="cricket-seam-separator">
              <div className="cricket-seam-track">
                <div className="cricket-seam-stitch top-stitch"></div>
                <div className="cricket-seam-center-white-line"></div>
                <div className="cricket-seam-stitch bottom-stitch"></div>
              </div>
              <div ref={ballRef} className="seam-ball-container">
                <div className="seam-ball-sphere">
                  <div className="seam-ball-inner-line left-line"></div>
                  <div className="seam-ball-inner-split"></div>
                  <div className="seam-ball-inner-line right-line"></div>
                  <div className="seam-ball-gloss"></div>
                  <div className="seam-ball-scuffs"></div>
                </div>
              </div>
            </div>

            {/* Points Table Section */}
            <section className="points-table-section">
              <h2 className="section-heading">Points <span>Table</span></h2>
              <p className="section-description">Current APL 2026 season standings — updated after every match.</p>
              <div className="points-table-wrapper">
                <table className="points-table">
                  <thead>
                    <tr>
                      <th className="pt-rank">POS</th>
                      <th className="pt-club">TEAM</th>
                      <th className="pt-col-pld" title="Matches Played">PLD</th>
                      <th className="pt-col-won" title="Won">WON</th>
                      <th className="pt-col-lost" title="Lost">LOST</th>
                      <th className="pt-col-tied" title="Tied">TIED</th>
                      <th className="pt-col-nr" title="No Result">N/R</th>
                      <th className="pt-col-nrr" title="Net Run Rate">NRR</th>
                      <th className="pt-pts" title="Points">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: 'Kabul Knights', logo: londonSpiritLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
                      { rank: 2, name: 'Kandahar Kings', logo: birminghamPhoenixLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
                      { rank: 3, name: 'Balkh Legends', logo: manchesterSuperGiantsLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
                      { rank: 4, name: 'Paktia Panthers', logo: sunrisersLeedsLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
                      { rank: 5, name: 'Amo Sharks', logo: welshFireLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: false },
                      { rank: 6, name: 'Band-e-Amir Dragons', logo: southernBraveLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: false },
                    ].map((team) => (
                      <tr key={team.rank} className={`pt-row ${team.top ? 'pt-row-top' : 'pt-row-lower'}`}>
                        <td className={`pt-rank-cell ${team.top ? 'pt-rank-gold' : 'pt-rank-blue'}`}>{team.rank}</td>
                        <td className="pt-club-cell">
                          <img src={team.logo} alt={`${team.name} Logo`} className="pt-team-logo" />
                          <span className="pt-team-name">{team.name}</span>
                        </td>
                        <td className="pt-stat pt-col-pld">{team.m}</td>
                        <td className="pt-stat pt-stat-w pt-col-won">{team.w}</td>
                        <td className="pt-stat pt-stat-l pt-col-lost">{team.l}</td>
                        <td className="pt-stat pt-col-tied">{team.t}</td>
                        <td className="pt-stat pt-col-nr">{team.nr}</td>
                        <td className="pt-stat pt-nrr pt-col-nrr">{team.nrr}</td>
                        <td className="pt-pts-cell">{team.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="pt-qualifier-note">
                <span className="pt-qual-dot top" /> Top 4 qualify for playoffs
              </p>
            </section>

            <div className="section-divider-line" />

            <Moments />

            <div className="section-divider-line" />

            <section className="launch-section">
              <h2 className="section-heading">Apl Grand <span>Launch</span> Event</h2>
              <p className="section-description">Relive the highlights and spectacular event celebrations from the league opening.</p>

              <div className="launch-grid-container">
                {/* Left Panel: Main Large Video */}
                <div className="launch-main-video-panel">
                  <div className="launch-video-glow-container">
                    <div className="launch-video-wrapper">
                      <iframe
                        id="launch-video-iframe"
                        className="launch-video-iframe"
                        src="https://www.youtube.com/embed/sq00E0Rmyjs?autoplay=1&mute=1&enablejsapi=1&rel=0&controls=1&playlist=sq00E0Rmyjs&loop=1"
                        title="The APL Grand Launch Event"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                      {launchMuted && (
                        <div className="launch-video-overlay" onClick={() => handleUnmute('launch-video-iframe', setLaunchMuted)}>
                          <div className="launch-unmute-button-container">
                            <div className="launch-unmute-icon-ring">
                              <VolumeX size={44} className="launch-unmute-icon" />
                            </div>
                            <h3 className="launch-unmute-title">TAP TO UNMUTE & WATCH</h3>
                            <p className="launch-unmute-subtitle">APL GRAND LAUNCH CEREMONY</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel: 3 Stacked Side Videos */}
                <div className="launch-side-videos-panel">
                  <div className="side-video-card animate-side-card">
                    <iframe
                      id="side-video-1"
                      className="side-video-iframe"
                      src="https://www.youtube.com/embed/ePIpdbzDgM4?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=ePIpdbzDgM4&loop=1"
                      title="APL Launch Highlights 1"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    {side1Muted && (
                      <div className="side-video-overlay" onClick={() => handleUnmute('side-video-1', setSide1Muted)}>
                        <div className="side-unmute-button-container">
                          <div className="side-unmute-icon-ring">
                            <VolumeX size={24} className="side-unmute-icon" />
                          </div>
                          <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                          <p className="side-unmute-subtitle">Players Reviews</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="side-video-card animate-side-card">
                    <iframe
                      id="side-video-2"
                      className="side-video-iframe"
                      src="https://www.youtube.com/embed/OPLRXDmteCE?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=OPLRXDmteCE&loop=1"
                      title="APL Launch Highlights 2"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    {side2Muted && (
                      <div className="side-video-overlay" onClick={() => handleUnmute('side-video-2', setSide2Muted)}>
                        <div className="side-unmute-button-container">
                          <div className="side-unmute-icon-ring">
                            <VolumeX size={24} className="side-unmute-icon" />
                          </div>
                          <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                          <p className="side-unmute-subtitle">Moments of appreciation</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="side-video-card animate-side-card">
                    <iframe
                      id="side-video-3"
                      className="side-video-iframe"
                      src="https://www.youtube.com/embed/6PZfy6YCw88?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=6PZfy6YCw88&loop=1"
                      title="APL Launch Highlights 3"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    {side3Muted && (
                      <div className="side-video-overlay" onClick={() => handleUnmute('side-video-3', setSide3Muted)}>
                        <div className="side-unmute-button-container">
                          <div className="side-unmute-icon-ring">
                            <VolumeX size={24} className="side-unmute-icon" />
                          </div>
                          <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                          <p className="side-unmute-subtitle">APL celebrations</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="section-divider-line" />

            <section className="vision-section">
              <h2 className="section-heading">The <span>Vision</span></h2>
              <p className="section-description">Pioneering the future of cricket, fostering domestic talents, and uniting global audiences.</p>

              <div className="acb-split-layout">
                {/* Left Column: Text + Logo */}
                <div className="acb-left-panel">
                  <div className="acb-brand-header">
                    <img src={aplMainLogo} alt="APL Logo" className="acb-brand-logo-apl" loading="lazy" />
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
                    <img src={chairmanImg} alt="Mirwais Ashraf – Chairman, Afghan Cricket Board" className="acb-chairman-img" loading="lazy" />
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

            <div className="section-divider-line" />

            {/* Cricket Ball Seam Separator — below Gallery */}
            <div className="cricket-seam-separator">
              <div className="cricket-seam-track">
                <div className="cricket-seam-stitch top-stitch"></div>
                <div className="cricket-seam-center-white-line"></div>
                <div className="cricket-seam-stitch bottom-stitch"></div>
              </div>
              <div ref={ballRef2} className="seam-ball-container">
                <div className="seam-ball-sphere">
                  <div className="seam-ball-inner-line left-line"></div>
                  <div className="seam-ball-inner-split"></div>
                  <div className="seam-ball-inner-line right-line"></div>
                  <div className="seam-ball-gloss"></div>
                  <div className="seam-ball-scuffs"></div>
                </div>
              </div>
            </div>

            <section className="find-out-more-section">
              <h2 className="section-heading">More about <span>APL</span></h2>
              <p className="section-description">Dive deeper into the tournament structure, regulations, and historical records.</p>
              <div className="fom-grid">
                <div className="fom-card fom-card-r1-c1">
                  <img src={fomImg1} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">WHAT IS THE APL?</h3>
                </div>
                <div className="fom-card fom-card-r1-c2">
                  <img src={fomImg2} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">THE APL RULES EXPLAINED</h3>
                </div>
                <div className="fom-card fom-card-r2-c1">
                  <img src={fomImg3} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">HOW TO BUY TICKETS FOR THE APL?</h3>
                </div>
                <div className="fom-card fom-card-r2-c2">
                  <img src={fomImg4} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">WHO WILL PLAY IN THE APL IN 2026?</h3>
                </div>
                <div className="fom-card fom-card-r3-c1">
                  <img src={fomImg5} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">PAST WINNERS OF APL</h3>
                </div>
                <div className="fom-card fom-card-r3-c2">
                  <img src={fomImg6} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">WHEN IS THE APL FINAL?</h3>
                </div>
                <div className="fom-card fom-card-r3-c3">
                  <img src={fomImg7} alt="" className="fom-card-bg-img" loading="lazy" />
                  <div className="fom-card-img-overlay"></div>
                  <h3 className="fom-card-title">WHAT IS THE APL ELIMINATOR?</h3>
                </div>
              </div>
            </section>

            <div className="section-divider-line" />

            {/* Partners Section (ACBlogo) */}
            <section className="partners-section">
              <h2 className="section-heading partners-heading">Official <span>Partners</span></h2>
              <div className="acb-bottom-logo-container" style={{ borderTop: 'none', paddingTop: 0 }}>
                <img src={acbLogo} alt="ACB Logo – Official Partner" className="acb-bottom-logo" loading="lazy" />
              </div>
            </section>
          </main>
        </>
      ) : currentPage === 'news' ? (
        <News />
      ) : currentPage === 'gallery' ? (
        <GalleryPage />
      ) : currentPage === 'fixtures' ? (
        <FixturesPage />
      ) : currentPage === 'points-table' ? (
        <PointsTable />
      ) : currentPage === 'partnerships' ? (
        <PartnershipsPage />
      ) : (
        <About />
      )}

      <footer className="app-footer">
        <div className="footer-container">

          {/* Main Footer Columns Grid */}
          <div className="footer-grid">

            {/* Column 1: Brand Info Block */}
            <div className="footer-col brand-col">
              <img src={aplLogo} alt="APL Logo" className="footer-logo-main" loading="lazy" />
              <p className="footer-brand-desc">
                The premier T20 cricket league of Afghanistan. Experience raw domestic talents, global superstars, and electrifying matches.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="footer-col links-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li><a href="#hero">Home</a></li>
                <li><a href="#teams">Teams</a></li>
                <li><a href="#launch">Launch</a></li>
                <li><a href="#gallery">Gallery</a></li>
              </ul>
            </div>

            {/* Column 3: Info & Support Links */}
            <div className="footer-col links-col">
              <h4 className="footer-col-title">Information</h4>
              <ul className="footer-links-list">
                <li><a href="#about">About APL</a></li>
                <li><a href="#tickets">Buy Tickets</a></li>
                <li><a href="#acb">ACB Governance</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 4: Connect & Socials */}
            <div className="footer-col socials-col">
              <h4 className="footer-col-title">Follow the Action</h4>
              <div className="footer-social-list">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle facebook" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle instagram" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle twitter" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-circle youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
                    <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#000000" />
                  </svg>
                </a>
                <button className="chat-bubble-round" aria-label="Chat Support">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Legal Disclaimer */}
          <div className="footer-bottom-bar">
            <p className="copyright-text">
              © {new Date().getFullYear()} Afghanistan Premier League. All Rights Reserved. Governed under the ACB.
            </p>
            <div className="footer-legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
