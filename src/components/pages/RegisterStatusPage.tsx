import { useState } from 'react'
import { buildApiUrl } from '../../config/api'
import './RegisterStatusPage.css'

interface StatusResult {
  id: string
  status: string
  date: string
  assignee: string
  remarks: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterStatusPage() {
  const [appId, setAppId] = useState('')
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedId = appId.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedId || !trimmedEmail) return

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      setSearched(true)
      setStatusResult(null)
      return
    }

    const formattedId = trimmedId.toUpperCase().replace(/\s+/g, '')

    setIsLoading(true)
    setErrorMessage('')
    setSearched(false)
    setStatusResult(null)

    try {
      const url = buildApiUrl(`/player-registrations/lookup?code=${encodeURIComponent(formattedId)}&email=${encodeURIComponent(trimmedEmail)}`)
      const response = await fetch(url)
      const json = await response.json()

      if (response.ok) {
        const record = json.data || json
        setStatusResult({
          id: record.registration_code || record.code || formattedId,
          status: record.status || 'Under Review',
          date: record.created_at ? new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'August 8, 2026',
          assignee: record.assignee || 'APL Cricket Operations',
          remarks: record.remarks || 'Your document validation is complete. Reviewing draft category eligibility based on ESPNcricinfo / matches history.'
        })
      } else {
        setErrorMessage(json.message || 'Reference Code or Email not found.')
      }
    } catch {
      setErrorMessage('Could not connect to the tracking server. Please try again later.')
    } finally {
      setIsLoading(false)
      setSearched(true)
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
            Enter your registration reference number and registered email address to check the current status of your draft application.
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
                  type="email"
                  placeholder="Enter Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="status-search-input"
                  required
                />
                <p className="status-otp-hint">Enter the email used during registration</p>
              </div>
            </div>
             <button 
               type="submit" 
               className="status-search-btn status-search-btn--full"
               disabled={isLoading}
             >
               {isLoading ? 'Tracking Application...' : 'Track Application'}
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
                   <span className="result-value status-badge-track">
                      {statusResult.status
                        ? statusResult.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                        : 'Pending'}
                   </span>
                 </div>
               </div>
 
             </div>
           )}
 
           {searched && errorMessage && (
             <div className="status-result-box error animate-fade-in">
               <h3 className="result-header text-red">Search Failed</h3>
               <p className="error-desc">
                 {errorMessage}
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
