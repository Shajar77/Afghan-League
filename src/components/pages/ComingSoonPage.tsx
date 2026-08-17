import './ComingSoonPage.css'

interface ComingSoonPageProps {
  title: string
  subtitle?: string
}

export function ComingSoonPage({ title, subtitle = 'APL 2026 SEASON' }: ComingSoonPageProps) {
  return (
    <div className="coming-soon-page-container">
      {/* ── TOP HERO HEADER BANNER ── */}
      <section className="coming-soon-hero">
        <div className="coming-soon-hero-grid-bg" />
        <div className="coming-soon-hero-glow" />

        <div className="coming-soon-hero-top-row">
          <div className="coming-soon-hero-title-wrap">
            <span className="coming-soon-live-badge">{subtitle}</span>
            <h1 className="coming-soon-main-title">
              {title}
              <span className="dot-accent">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── COMING SOON CONTENT SECTION ── */}
      <section className="coming-soon-content-section">
        <h2 className="coming-soon-big-heading">COMING SOON</h2>
      </section>
    </div>
  )
}
