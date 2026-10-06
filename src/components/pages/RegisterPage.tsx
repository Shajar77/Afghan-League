import './RegisterPage.css'

export function RegisterPage() {
  return (
    <div className="register-page-container">
      {/* Hero Section */}
      <section className="register-hero">
        <div className="register-hero-grid-bg" />
        <div className="register-hero-glow" />
        <div className="register-hero-top-row">
          <div className="register-hero-title-wrap">
            <span className="register-live-badge">APL 2026 SEASON</span>
            <h1 className="register-main-title">
              PLAYER REGISTRATION<span className="dot-accent">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Registrations Closed Notice */}
      <section className="register-content-section">
        <div className="register-form-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>

          <h2 style={{
            fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#0d1e52',
            letterSpacing: '0.02em',
            margin: '0 0 1rem'
          }}>
            Player Registration Window Is Closed
          </h2>

          <p style={{
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '1rem',
            color: '#475569',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 1.75rem'
          }}>
            Player registrations for the APL 2026 Draft have officially closed. Thank you to everyone who applied — we received an overwhelming response from players all across the globe.
          </p>

          <p style={{
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.92rem',
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto 2rem'
          }}>
            If you have already registered, you can check your registration status and submit your player video using the links below.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center' }}>
            <a
              href="#register-status"
              style={{
                display: 'inline-block',
                background: 'var(--brand-gold, #faa718)',
                color: '#0d1e52',
                fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.85rem 2rem',
                borderRadius: '4px',
                textDecoration: 'none',
                minWidth: '220px',
                minHeight: '48px',
                lineHeight: '1.4'
              }}
            >
              Check Registration Status
            </a>
            <a
              href="#home"
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.88rem',
                color: '#64748b',
                textDecoration: 'none',
                fontWeight: 600
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0d1e52')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              ← Back to APL Homepage
            </a>
          </div>

        </div>
      </section>
    </div>
  )
}
