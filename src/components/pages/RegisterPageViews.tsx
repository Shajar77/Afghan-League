import { CheckCircle2 } from 'lucide-react'
import type { FormData } from '../registration/types'

// ─── Access Denied View ───────────────────────────────────────────────────────

export function RegisterAccessDeniedView() {
  return (
    <div
      className="register-page"
      style={{
        paddingTop: '8rem',
        paddingBottom: '8rem',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          background: '#0d1e52',
          border: '1px solid rgba(248, 200, 0, 0.3)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(248, 200, 0, 0.1)',
            border: '1.5px solid var(--brand-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            color: 'var(--brand-gold)',
          }}
        >
          🔒
        </div>

        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'var(--brand-gold)',
            textTransform: 'uppercase',
            background: 'rgba(248, 200, 0, 0.12)',
            padding: '0.35rem 1rem',
            borderRadius: '20px',
            border: '1px solid rgba(248, 200, 0, 0.3)',
          }}
        >
          PRIVATE REGISTRATION • INVITATION ONLY
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.15,
            textTransform: 'uppercase',
          }}
        >
          REGISTRATION IS RESTRICTED
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            maxWidth: '520px',
          }}
        >
          Official player registration for the Afghanistan Premier League T20 (APL T20) is strictly
          private and by invitation only. If you are an official player or registered agent, please
          use the private invitation link provided directly to you.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          <a
            href="#contact-us"
            style={{
              background: 'var(--brand-gold)',
              color: '#000000',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.85rem 1.75rem',
              borderRadius: '4px',
              textDecoration: 'none',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Contact Administration
          </a>

          <a
            href="#home"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.85rem 1.75rem',
              borderRadius: '4px',
              textDecoration: 'none',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Success View ─────────────────────────────────────────────────────────────

interface RegisterSuccessViewProps {
  formData: FormData
  refCode: string
  onReset: () => void
}

export function RegisterSuccessView({ formData, refCode, onReset }: RegisterSuccessViewProps) {
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

      <section className="register-content-section">
        <div className="register-success-card">
          <CheckCircle2 className="success-icon animate-pulse-scale" size={80} />
          <h2 className="success-title">Registration Submitted!</h2>
          <p className="success-message">
            Thank you, <strong>{formData.fullName}</strong>. Your application for the Afghanistan
            Premier League (APL) 2026 player draft has been successfully received.
          </p>
          <div className="success-details-premium">
            <div className="success-detail-row">
              <span className="detail-label">Application Reference</span>
              <span className="detail-value reference-code">{refCode}</span>
            </div>
            <div className="success-detail-row">
              <span className="detail-label">Draft Status</span>
              <span className="detail-value status-badge">
                Under Review by APL Cricket Operations
              </span>
            </div>
            <div className="success-email-notice">
              <span className="mail-icon">✉</span>
              <p>
                A confirmation email has been sent to{' '}
                <strong className="email-highlight">{formData.email}</strong> with details on the
                draft process and draft categories.
              </p>
            </div>
          </div>
          <button className="register-btn-reset" onClick={onReset}>
            Register Another Player
          </button>
        </div>
      </section>
    </div>
  )
}
