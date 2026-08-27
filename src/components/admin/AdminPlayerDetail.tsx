import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { buildApiUrl, normalizeMediaUrl } from '../../config/api'
import { formatStatus, statusClass, isAgentRegistration } from './adminUtils'
import { formatAvailabilityDisplay } from '../registration/types'
import { scrollToTop } from '../../utils/lenis'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Briefcase,
  Globe,
  ExternalLink,
  Copy,
  Check,
  ZoomIn,
  X,
  Award,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  LogOut
} from 'lucide-react'
import type { Registration } from './AdminDashboard'
import './AdminPlayerDetail.css'

interface AdminPlayerDetailProps {
  registration: Registration
  onBack: () => void
  onLogout: () => void
  adminEmail: string
}

// formatStatus and statusClass are now imported from ./adminUtils

function ImageCard({ url, label, icon: Icon }: { url?: string | null; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  const [lightbox, setLightbox] = useState(false)
  const src = normalizeMediaUrl(url)

  if (!src) {
    return (
      <div className="apl-detail-img-card empty">
        <Icon size={26} className="apl-img-empty-icon" />
        <span className="apl-img-empty-label">{label}</span>
        <span className="apl-img-empty-sub">Not Uploaded</span>
      </div>
    )
  }

  return (
    <>
      <div className="apl-detail-img-card" onClick={() => setLightbox(true)}>
        <img src={src} alt={label} loading="lazy" />
        <div className="apl-detail-img-overlay">
          <ZoomIn size={22} />
          <span>Inspect</span>
        </div>
        <div className="apl-detail-img-tag">
          <Icon size={12} />
          <span>{label}</span>
        </div>
      </div>

      {lightbox && (
        <div className="apl-lightbox-backdrop" onClick={() => setLightbox(false)}>
          <div className="apl-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="apl-lightbox-close-btn"
              onClick={() => setLightbox(false)}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <img src={src} alt={label} className="apl-lightbox-image" />
            <div className="apl-lightbox-footer">
              <span>{label}</span>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="apl-lightbox-open-raw"
              >
                Open Original File <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function AdminPlayerDetail({ registration: initialReg, onBack, onLogout, adminEmail: _adminEmail }: AdminPlayerDetailProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const [playerData, setPlayerData] = useState<Registration>(initialReg)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const reg: any = playerData

  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(reg.status || 'pending')
  const [copiedCode, setCopiedCode] = useState(false)

  // Guarantee instant scroll reset to top when viewing player detail page
  useLayoutEffect(() => {
    scrollToTop(true)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (topRef.current) {
      topRef.current.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }, [])

  useEffect(() => {
    const forceTop = () => {
      scrollToTop(true)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      if (topRef.current) {
        topRef.current.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    }

    forceTop()
    const rafId = requestAnimationFrame(forceTop)
    const timerId = setTimeout(forceTop, 30)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('apl_admin_token') || ''
    if (!token) {
      return
    }

    const email = initialReg.email
    const code = initialReg.registration_code || (initialReg as any).code

    if (!email || !code) return

    const fetchFullDetails = async () => {
      setIsDataLoading(true)
      try {
        const url = buildApiUrl(`/player-registrations/lookup?code=${encodeURIComponent(String(code))}&email=${encodeURIComponent(String(email))}`)
        const token = localStorage.getItem('apl_admin_token') || ''
        const res = await fetch(url, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        })
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          if (data && typeof data === 'object') {
            setPlayerData(data)
            if (data.status) {
              setCurrentStatus(data.status)
            }
          }
        }
      } catch {
        // Network error — player data from table row is used as fallback
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchFullDetails()
  }, [initialReg])

  const handleCopyCode = () => {
    if (reg.registration_code) {
      navigator.clipboard.writeText(reg.registration_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const toTitleCase = (str: string | undefined | null) => {
    if (!str) return '—';
    if (
      str.includes('@') || 
      str.startsWith('+') || 
      /^\d{4}-\d{2}-\d{2}/.test(str) ||
      str.length > 50 ||
      /^[A-Z0-9-]{6,20}$/.test(str) && /[0-9]/.test(str)
    ) {
      return str;
    }
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  // Parse backend auto-generated "Key: Value. Key: Value." strings into pairs
  const parseKVString = (raw: string): { label: string; value: string }[] => {
    return raw
      .split(/\.\s+/)
      .map(s => s.replace(/\.$/, '').trim())
      .filter(Boolean)
      .map(part => {
        const colonIdx = part.indexOf(':')
        if (colonIdx === -1) return null
        return { label: part.slice(0, colonIdx).trim(), value: part.slice(colonIdx + 1).trim() }
      })
      .filter((item): item is { label: string; value: string } => item !== null)
  }

  const updateStatus = async (newStatus: string) => {
    setActionLoading(newStatus)
    setActionError(null)
    const token = localStorage.getItem('apl_admin_token') || ''

    try {
      const res = await fetch(buildApiUrl(`/player-registrations/${encodeURIComponent(String(reg.id))}/status`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (res.ok) {
        setCurrentStatus(newStatus)
      } else if (res.status === 401) {
        onLogout()
      } else {
        setActionError(json.message || 'Status update failed. Please check backend connection.')
      }
    } catch {
      setActionError('Network error: Unable to update player status.')
    } finally {
      setActionLoading(null)
    }
  }

  const isIconPlayer = Boolean(reg.icon_player_nomination) || reg.consider_icon_player === 'yes'
  // accept_relegation may arrive as boolean or legacy 'yes'/'no' string from the API
  const acceptsRelegation = reg.accept_relegation === true || (reg.accept_relegation as unknown) === 'yes'

  return (
    <div ref={topRef} className="apl-detail-layout">
      {/* ── TOP ADMIN BAR ── */}
      <header className="apl-admin-top-bar">
        <div className="apl-admin-top-inner">
          <div className="apl-admin-brand-left">
            <img src="/apl-logo.png" alt="APL Logo" className="apl-admin-top-logo" />
          </div>

          <div className="apl-admin-brand-right">
            <button
              type="button"
              className="apl-btn-red-logout"
              onClick={onLogout}
              title="Sign out"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── DOSSIER MAIN BODY ── */}
      <main className="apl-detail-main">
        {/* Navigation Breadcrumb */}
        <div className="apl-detail-breadcrumbs">
          <button type="button" className="apl-detail-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Return to Registrations</span>
          </button>
          {isDataLoading && (
            <span className="apl-admin-loading-badge">
              <span className="apl-loading-pulse-dot" />
              Syncing Full Player Dossier...
            </span>
          )}
        </div>

        {/* ── COMBINED IDENTITY & ADJUDICATION ACTIONS SECTION ── */}
        <div className="apl-hero-card" style={{ marginTop: 0 }}>
          {/* Top Row: Hero profile details */}
          <div className="apl-hero-top-row">
            <div className="apl-hero-card-left">
              <div className="apl-hero-avatar-wrap">
                {reg.photo_url ? (
                  <img
                    src={normalizeMediaUrl(reg.photo_url)}
                    alt={reg.full_name || 'Player'}
                    className="apl-hero-avatar-img"
                  />
                ) : (
                  <div className="apl-hero-avatar-fallback" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#0284c7' }}>
                    <User size={38} />
                  </div>
                )}
              </div>

              <div className="apl-hero-info">
                <div className="apl-hero-name-row">
                  <h1 className="apl-hero-name">{reg.full_name || 'Unknown Cricketer'}</h1>
                </div>

                <div className="apl-hero-tags-row">
                  <span className="apl-hero-meta-item">
                    <Globe size={14} />
                    {reg.nationality || 'Nationality Unspecified'}
                  </span>
                  <span className="apl-hero-meta-item">
                    <Briefcase size={14} />
                    {reg.playing_role || 'Role Unspecified'}
                  </span>
                  <span className="apl-hero-meta-item">
                    <Award size={14} />
                    {reg.player_status || 'Domestic'}
                  </span>
                </div>

                <div className="apl-hero-right-meta">
                  <div className="apl-hero-right-meta-row">
                    <span className="apl-hero-code-label">REGISTRATION ID:</span>
                    <button
                      type="button"
                      className="apl-hero-code-btn"
                      onClick={handleCopyCode}
                      title="Copy Registration Code"
                    >
                      <code>{reg.registration_code || `APL-${reg.id}`}</code>
                      {copiedCode ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <div className="apl-hero-right-meta-row">
                    <span className="apl-status-box-label">CURRENT STATUS:</span>
                    <span className={`apl-status-pill lg ${statusClass(currentStatus)}`}>
                      {formatStatus(currentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="apl-hero-divider" />

          {/* Bottom Row: Adjudication Status Actions */}
          <div className="apl-hero-bottom-row">
            <div className="apl-controller-info">
              <span className="apl-controller-title">Adjudication Action</span>
              <span className="apl-controller-sub">
                Change verification state for draft pool eligibility
              </span>
            </div>

            <div className="apl-controller-buttons">
              <button
                type="button"
                className={`apl-btn-status-action approve ${currentStatus === 'approved' ? 'selected' : ''}`}
                disabled={!!actionLoading}
                onClick={() => updateStatus('approved')}
              >
                {actionLoading === 'approved' ? (
                  <span className="apl-btn-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                <span>Approve for Draft</span>
              </button>

              <button
                type="button"
                className={`apl-btn-status-action review ${currentStatus === 'under_review' ? 'selected' : ''}`}
                disabled={!!actionLoading}
                onClick={() => updateStatus('under_review')}
              >
                {actionLoading === 'under_review' ? (
                  <span className="apl-btn-spin" />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>Under Review</span>
              </button>

              <button
                type="button"
                className={`apl-btn-status-action reject ${currentStatus === 'rejected' ? 'selected' : ''}`}
                disabled={!!actionLoading}
                onClick={() => updateStatus('rejected')}
              >
                {actionLoading === 'rejected' ? (
                  <span className="apl-btn-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                <span>Reject Registration</span>
              </button>
            </div>
          </div>

          {actionError && (
            <div className="apl-controller-error">
              <AlertCircle size={14} />
              <span>{actionError}</span>
            </div>
          )}
        </div>



        {/* ── PHOTO GALLERY SECTION ── */}
        <section className="apl-detail-section">
          <h2 className="apl-section-heading">
            PLAYER MEDIA & DOCUMENTS
          </h2>

          <div className="apl-gallery-grid">
            <ImageCard url={reg.photo_url} label="Official Headshot" icon={User} />
            <ImageCard url={reg.action_shot_url} label="Match Action Shot" icon={Award} />
            <ImageCard url={reg.right_profile_url} label="Right Profile" icon={Sparkles} />
            <ImageCard url={reg.left_profile_url} label="Left Profile" icon={Sparkles} />
            <ImageCard url={reg.passport_url} label="Passport Verification" icon={FileText} />
          </div>
        </section>

        {/* ── DOSSIER DATA MATRICES ── */}
        <section className="apl-matrices-grid">

          {/* ── STEP 1 CARD: PERSONAL INFORMATION ── */}
          <div className="apl-matrix-card">
            <div className="apl-matrix-header">
              <h3>Personal Information</h3>
            </div>
            <div className="apl-matrix-body">
              <div className="apl-data-row">
                <span className="apl-data-label"><User size={13} /> Full Legal Name</span>
                <span className="apl-data-value">{toTitleCase(reg.full_name) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><Calendar size={13} /> Date of Birth</span>
                <span className="apl-data-value">{reg.dob ? reg.dob.split('T')[0] : '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><Globe size={13} /> Nationality</span>
                <span className="apl-data-value highlight">{toTitleCase(reg.nationality) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><FileText size={13} /> Passport Number</span>
                <span className="apl-data-value mono">{reg.passport_number || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><Globe size={13} /> Country of Residence</span>
                <span className="apl-data-value">{toTitleCase(reg.country_of_residence) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><MapPin size={13} /> City</span>
                <span className="apl-data-value">{toTitleCase(reg.city) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><Phone size={13} /> Phone / WhatsApp</span>
                <span className="apl-data-value">{reg.phone || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label"><Mail size={13} /> Email Address</span>
                <span className="apl-data-value email-wrap">{reg.email || '—'}</span>
              </div>
              {/* Availability */}
              <div className="apl-data-row">
                <span className="apl-data-label">Tournament Availability</span>
                <span className="apl-data-value">{formatAvailabilityDisplay(reg.player_availability)}</span>
              </div>
              {(reg as any).availability_details && (
                parseKVString((reg as any).availability_details).map(({ label, value }) => (
                  <div key={label} className="apl-data-row">
                    <span className="apl-data-label">{label}</span>
                    <span className="apl-data-value">{value || '—'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── STEP 2 CARD: CRICKET PROFILE ── */}
          <div className="apl-matrix-card">
            <div className="apl-matrix-header">
              <h3>Cricket Profile</h3>
            </div>
            <div className="apl-matrix-body">
              <div className="apl-data-row">
                <span className="apl-data-label">Playing Role</span>
                <span className="apl-data-value highlight">{toTitleCase(reg.playing_role) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label">Batting Hand</span>
                <span className="apl-data-value">{toTitleCase(reg.batting_hand) || '—'}</span>
              </div>
              {reg.bowling_arm && (
                <>
                  {reg.bowler_category && reg.bowler_category !== 'None' && (
                    <div className="apl-data-row">
                      <span className="apl-data-label">Bowler Category</span>
                      <span className="apl-data-value">
                        {toTitleCase(reg.bowler_category.split(' - ')[0])}
                      </span>
                    </div>
                  )}
                  <div className="apl-data-row">
                    <span className="apl-data-label">Bowling Arm</span>
                    <span className="apl-data-value">{toTitleCase(reg.bowling_arm)}</span>
                  </div>
                  <div className="apl-data-row">
                    <span className="apl-data-label">
                      {reg.bowler_category?.includes('Spin') ? 'Spin Type' : 'Bowling Type'}
                    </span>
                    <span className="apl-data-value">{toTitleCase(reg.bowling_type) || '—'}</span>
                  </div>
                </>
              )}
              <div className="apl-data-row">
                <span className="apl-data-label">Previous Major Teams</span>
                <span className="apl-data-value">{toTitleCase(reg.previous_teams) || '—'}</span>
              </div>
              <div className="apl-data-row">
                <span className="apl-data-label">Player Status</span>
                <span className="apl-data-value">{toTitleCase(reg.player_status) || '—'}</span>
              </div>
              {reg.representing_country && (
                <div className="apl-data-row">
                  <span className="apl-data-label"><Globe size={13} /> Representing Country</span>
                  <span className="apl-data-value">{toTitleCase(reg.representing_country)}</span>
                </div>
              )}
              <div className="apl-data-row">
                <span className="apl-data-label">Total T20 Matches</span>
                <span className="apl-data-value badge-pill">{reg.twtenty_matches_count ?? '—'}</span>
              </div>
              {reg.profile_link && (
                <div className="apl-data-row">
                  <span className="apl-data-label">ESPNcricinfo or Cricbuzz Profile Link</span>
                  <a
                    href={/^https?:\/\//i.test(reg.profile_link) ? reg.profile_link : `https://${reg.profile_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apl-data-link"
                  >
                    View Profile <ExternalLink size={13} />
                  </a>
                </div>
              )}
              {reg.playing_experience && (
                parseKVString(reg.playing_experience).map(({ label, value }) => (
                  <div key={label} className="apl-data-row">
                    <span className="apl-data-label">{label}</span>
                    <span className="apl-data-value">{value || '—'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── STEP 3 CARD: CATEGORY & DRAFT ── */}
          <div className="apl-matrix-card">
            <div className="apl-matrix-header">
              <h3>Category &amp; Draft Preferences</h3>
            </div>
            <div className="apl-matrix-body">
              <div className="apl-data-row">
                <span className="apl-data-label">Player Category</span>
                <span className={`apl-cat-badge cat-${(reg.player_category || 'emerging').toLowerCase()}`}>
                  {toTitleCase(reg.player_category) || 'Emerging'}
                </span>
              </div>

              {/* Icon Player */}
              <div className={`apl-clause-box ${isIconPlayer ? 'active' : ''}`}>
                <div className="apl-clause-header">
                  <span>Icon Player Nomination</span>
                </div>
                <div className="apl-clause-status">
                  {isIconPlayer ? (
                    <span className="badge-clause-yes">Nominated as Icon Player</span>
                  ) : (
                    <span className="badge-clause-no">Standard Draft Entry</span>
                  )}
                </div>
                <p className="apl-clause-desc">
                  Icon players are reserved for marquee status subject to franchise bids.
                </p>
              </div>

              {/* Relegation */}
              <div className={`apl-clause-box ${acceptsRelegation ? 'active' : ''}`}>
                <div className="apl-clause-header">
                  <span>Category Relegation Agreement</span>
                </div>
                <div className="apl-clause-status">
                  {acceptsRelegation ? (
                    <span className="badge-clause-yes">Accepts Category Demotion</span>
                  ) : (
                    <span className="badge-clause-no">Fixed Category Only</span>
                  )}
                </div>
                {acceptsRelegation && (
                  <div className="apl-data-row compact-top">
                    <span className="apl-data-label">Lowest Acceptable Category:</span>
                    <span className={`apl-cat-badge cat-${(reg.relegation_category || reg.relegation_limit || 'emerging').toLowerCase()}`}>
                      {reg.relegation_category || reg.relegation_limit || 'Silver'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── AGENT CARD (Step 1 Agent Details — only shown if agent registered) ── */}
          <div className="apl-matrix-card">
            <div className="apl-matrix-header">
              <h3>Agent &amp; Agency Representation</h3>
            </div>
            <div className="apl-matrix-body">
              {!isAgentRegistration(reg) ? (
                <div className="apl-empty-agent-box">
                  <User size={28} className="apl-agent-empty-icon" />
                  <span>Direct Player Registration</span>
                  <p>No external sports agency or manager attached to this entry.</p>
                </div>
              ) : (
                <>
                  <div className="apl-data-row">
                    <span className="apl-data-label">Agent Full Name</span>
                    <span className="apl-data-value highlight">{toTitleCase(reg.agent_full_name) || 'Authorized Representative'}</span>
                  </div>
                  <div className="apl-data-row">
                    <span className="apl-data-label">Agency / Company Name</span>
                    <span className="apl-data-value">{toTitleCase(reg.agent_company_name) || '—'}</span>
                  </div>
                  <div className="apl-data-row">
                    <span className="apl-data-label">Agent Phone Number</span>
                    <span className="apl-data-value">{reg.agent_phone_number || '—'}</span>
                  </div>
                  <div className="apl-data-row">
                    <span className="apl-data-label">Agent Email Address</span>
                    <span className="apl-data-value email-wrap">{reg.agent_email_address || '—'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </section>



      </main>
    </div>
  )
}

