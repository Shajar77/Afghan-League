import { useState } from 'react'
import './RegisterStatusPage.css'

export function RegisterStatusPage() {
  const [appId, setAppId] = useState('')
  const [searched, setSearched] = useState(false)
  const [statusResult, setStatusResult] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appId.trim()) return

    setSearched(true)
    let formattedId = appId.trim().toUpperCase().replace(/\s+/g, '')

    // Normalize flexible user inputs like "64297" or "2026-64297" into "APL-2026-64297"
    if (/^\d{5}$/.test(formattedId)) {
      formattedId = `APL-2026-${formattedId}`
    } else if (/^2026-\d{5}$/.test(formattedId)) {
      formattedId = `APL-${formattedId}`
    }

    if (formattedId.startsWith('APL-')) {
      setStatusResult({
        id: formattedId,
        status: 'Under Review',
        date: 'August 8, 2026',
        assignee: 'ACB Cricket Operations',
        remarks: 'Your document validation is complete. Reviewing draft category eligibility based on ESPNcricinfo / Cricbuzz matches history.'
      })
    } else {
      setStatusResult(null)
    }
  }

  return (
    <div className="status-page-container">
      {/* ── TOP HERO HEADER BANNER ── */}
      <section className="status-hero">
        <div className="status-hero-bg-grid" />
        <div className="status-hero-glow" />

        <div className="status-hero-top-row">
          <div className="status-hero-title-wrap">
            <span className="status-live-badge">APL 2026 SEASON</span>
            <h1 className="status-main-title">REGISTRATION STATUS<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* ── SEARCH AREA ── */}
      <section className="status-content-section">
        <div className="status-card">
          <h2 className="status-section-title">Check Application Status</h2>
          <p className="status-section-subtitle">
            Enter your registration reference number below to check the current review status of your draft application.
          </p>

          <form onSubmit={handleSearch} className="status-search-form">
            <div className="status-fields-stack">
              <div className="status-field-group">
                <input
                  type="text"
                  placeholder="e.g. APL-2026-64297"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="status-search-input"
                  required
                />
              </div>
              <div className="status-field-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="status-search-input"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <p className="status-otp-hint">Enter the code sent to you in the verification email</p>
              </div>
            </div>
            <button type="submit" className="status-search-btn status-search-btn--full">
              Track Application
            </button>
          </form>

          {searched && statusResult && (
            <div className="status-result-box success animate-fade-in">
              <h3 className="result-header">Application Found</h3>
              <div className="result-detail-grid">
                <div className="result-row">
                  <span className="result-label">Application Reference</span>
                  <span className="result-value code-value">{statusResult.id}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Submission Date</span>
                  <span className="result-value">{statusResult.date}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Reviewing Authority</span>
                  <span className="result-value">{statusResult.assignee}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Current Status</span>
                  <span className="result-value status-badge-track">{statusResult.status}</span>
                </div>
              </div>

            </div>
          )}

          {searched && !statusResult && (
            <div className="status-result-box error animate-fade-in">
              <h3 className="result-header text-red">Reference Code Not Found</h3>
              <p className="error-desc">
                We couldn't find any record matching the ID "<strong>{appId}</strong>". Please make sure it matches the pattern <strong>APL-2026-XXXXX</strong>.
              </p>
            </div>
          )}

          <div className="status-footer-action">
            <p className="no-id-text">Don't have an Application Reference ID?</p>
            <a href="#register-player" className="status-register-btn">
              Register Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
