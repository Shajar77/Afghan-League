import aboutVideoWebm from '../../assets/about-video (1).webm'
import aboutVideo from '../../assets/about-video (1).mp4'
import aplLogo from '../../assets/Asset 2@2x.png'
import londonSpiritLogo from '../../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../../assets/sunrisers-leeds.svg'
import welshFireLogo from '../../assets/welsh-fire-white.svg'
import southernBraveLogo from '../../assets/southern-brave-alt.svg'

export function TeamsGridSection() {
  return (
    <section className="teams-section">
      <h2 className="section-heading">Choose <br />your <span>team</span></h2>
      <p className="section-description">Explore the official competing franchises and access their club pages.</p>

      <div className="teams-layout">
        {/* Left side: Teams Grid */}
        <div className="teams-left">
          <div className="teams-grid">
            <a href="#teams" className="team-card" title="Kabul Knights">
              <img src={londonSpiritLogo} alt="Kabul Knights Logo" className="team-logo-img" />
            </a>
            <a href="#teams" className="team-card" title="Kandahar Kings">
              <img src={birminghamPhoenixLogo} alt="Kandahar Kings Logo" className="team-logo-img" />
            </a>
            <a href="#teams" className="team-card" title="Balkh Legends">
              <img src={manchesterSuperGiantsLogo} alt="Balkh Legends Logo" className="team-logo-img" />
            </a>
            <a href="#teams" className="team-card" title="Paktia Panthers">
              <img src={sunrisersLeedsLogo} alt="Paktia Panthers Logo" className="team-logo-img" />
            </a>
            <a href="#teams" className="team-card" title="Amo Sharks">
              <img src={welshFireLogo} alt="Amo Sharks Logo" className="team-logo-img" />
            </a>
            <a href="#teams" className="team-card" title="Band-e-Amir Dragons">
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
  )
}
