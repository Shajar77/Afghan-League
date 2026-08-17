import React, { useState, useEffect, useCallback } from 'react'
import { buildApiUrl, normalizeMediaUrl } from '../../config/api'
import { MOCK_TOKEN, MOCK_TEAMS, MOCK_SPONSORS } from './mockData'
import {
  Shield,
  Award,
  Plus,
  X,
  UploadCloud,
  ExternalLink,
  MapPin,
  Building,
  Loader2,
  Check,
  AlertCircle,
  Palette,
  Hash,
  Globe,
  User
} from 'lucide-react'
import './TeamSponsorManagement.css'

export interface Team {
  id: number | string
  name: string
  slug: string
  city?: string
  logo_url?: string
  primary_color?: string
  home_venue?: string
  description?: string
}

export interface Sponsor {
  id: number | string
  name: string
  logo_url?: string
  tier: string
  website_url?: string
  display_order?: number
  is_active?: boolean
}

const SPONSOR_TIERS = [
  { label: 'Title Sponsor', value: 'title_sponsor' },
  { label: 'Official Partner', value: 'official_partner' },
  { label: 'Media Partner', value: 'media_partner' },
  { label: 'Technical Partner', value: 'technical_partner' }
]

function TeamLogo({ name, logoUrl, color }: { name: string; logoUrl?: string; color?: string }) {
  const [error, setError] = useState(false)
  const initials = (name || '').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'APL'
  const brandColor = color || '#0575E6'

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="apl-team-logo-img"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${brandColor}15`,
      color: brandColor,
      fontWeight: 900,
      fontSize: '1.25rem',
      fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
      letterSpacing: '0.04em'
    }}>
      {initials}
    </div>
  )
}

function SponsorLogo({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const [error, setError] = useState(false)
  const initials = (name || '').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'SP'

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="apl-sponsor-logo-img"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      color: '#475569',
      fontWeight: 800,
      fontSize: '1rem',
      fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
      letterSpacing: '0.04em'
    }}>
      {initials}
    </div>
  )
}

export function TeamSponsorManagement({ onLogout }: { onLogout?: () => void }) {
  const [subTab, setSubTab] = useState<'teams' | 'sponsors'>('teams')

  // Teams & Sponsors State
  const [teams, setTeams] = useState<Team[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Modals visibility
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showSponsorModal, setShowSponsorModal] = useState(false)

  // Create Team Form State
  const [teamName, setTeamName] = useState('')
  const [teamSlug, setTeamSlug] = useState('')
  const [isSlugUserModified, setIsSlugUserModified] = useState(false)
  const [teamCity, setTeamCity] = useState('')
  const [teamHomeVenue, setTeamHomeVenue] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [teamColor, setTeamColor] = useState('#0575E6')
  const [teamLogoFile, setTeamLogoFile] = useState<File | null>(null)
  const [teamLogoPreview, setTeamLogoPreview] = useState<string>('')
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false)

  // Create Sponsor Form State
  const [sponsorName, setSponsorName] = useState('')
  const [sponsorTier, setSponsorTier] = useState('official_partner')
  const [sponsorWebsite, setSponsorWebsite] = useState('')
  const [sponsorDisplayOrder, setSponsorDisplayOrder] = useState<number>(1)
  const [sponsorIsActive, setSponsorIsActive] = useState<boolean>(true)
  const [sponsorLogoFile, setSponsorLogoFile] = useState<File | null>(null)
  const [sponsorLogoPreview, setSponsorLogoPreview] = useState<string>('')
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false)

  // Auto-slug derivation helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTeamName(val)
    if (!isSlugUserModified) {
      setTeamSlug(slugify(val))
    }
  }

  const handleTeamSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamSlug(e.target.value)
    setIsSlugUserModified(true)
  }

  // Fetch Teams and Sponsors from API
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const token = localStorage.getItem('apl_admin_token') || ''

    if (token === MOCK_TOKEN) {
      await new Promise(r => setTimeout(r, 300))
      setTeams(MOCK_TEAMS as Team[])
      setSponsors(MOCK_SPONSORS as Sponsor[])
      setIsLoading(false)
      return
    }

    try {
      // 1. Fetch Teams
      const teamsRes = await fetch(buildApiUrl('/teams'), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (teamsRes.ok) {
        const teamsJson = await teamsRes.json()
        const teamsList = Array.isArray(teamsJson)
          ? teamsJson
          : (teamsJson.data?.teams || teamsJson.data || teamsJson.teams || [])
        setTeams(teamsList)
      } else {
        setTeams([])
        setError('Failed to load teams from backend server.')
      }

      // 2. Fetch Sponsors
      const sponsorsRes = await fetch(buildApiUrl('/sponsors'), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (sponsorsRes.ok) {
        const sponsorsJson = await sponsorsRes.json()
        const sponsorsList = Array.isArray(sponsorsJson)
          ? sponsorsJson
          : (sponsorsJson.data?.sponsors || sponsorsJson.data || sponsorsJson.sponsors || [])
        setSponsors(sponsorsList)
      } else {
        setSponsors([])
      }
    } catch {
      setError('Network error: Unable to connect to administration server for teams & sponsors.')
      setTeams([])
      setSponsors([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Clear toast notifications
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle Logo Upload Helper
  const uploadLogoFile = async (file: File): Promise<string> => {
    const token = localStorage.getItem('apl_admin_token') || ''
    if (token === MOCK_TOKEN) {
      return 'https://api-staging.chaptersquare.com/uploads/images/action_sample.jpg'
    }

    const formData = new FormData()
    formData.append('file', file) // Enforcing exact key name requested by Bilal

    const uploadRes = await fetch(buildApiUrl('/uploads/image'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!uploadRes.ok) {
      if (uploadRes.status === 401 && onLogout) {
        onLogout()
      }
      const errJson = await uploadRes.json().catch(() => ({}))
      const msg = typeof errJson.error === 'string' ? errJson.error : errJson.error?.message || errJson.message || 'Invalid or expired authentication token. Please log in again.'
      throw new Error(msg)
    }

    const uploadJson = await uploadRes.json()
    const url = uploadJson.data?.url || uploadJson.url || (typeof uploadJson.data === 'string' ? uploadJson.data : '')
    if (!url) {
      return 'https://api-staging.chaptersquare.com/uploads/images/action_sample.jpg'
    }
    return normalizeMediaUrl(url)
  }

  // Helper to extract detailed server error messages
  const parseServerError = (errJson: any, fallback: string): string => {
    if (!errJson) return fallback
    if (Array.isArray(errJson.error?.details) && errJson.error.details.length > 0) {
      return errJson.error.details.map((d: any) => d.message || d.field).join(', ')
    }
    if (Array.isArray(errJson.details) && errJson.details.length > 0) {
      return errJson.details.map((d: any) => d.message || d.field).join(', ')
    }
    if (typeof errJson.error === 'string') return errJson.error
    if (typeof errJson.error?.message === 'string') return errJson.error.message
    if (typeof errJson.message === 'string') return errJson.message
    if (Array.isArray(errJson.message)) return errJson.message.join(', ')
    if (Array.isArray(errJson.errors)) return errJson.errors.join(', ')
    return fallback
  }

  // Submit Create Team
  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) {
      setError('Team name is required.')
      return
    }

    setIsSubmittingTeam(true)
    setError(null)

    try {
      let uploadedLogoUrl = 'https://example.com/images/kk-logo.png'
      if (teamLogoFile) {
        uploadedLogoUrl = await uploadLogoFile(teamLogoFile)
      }

      const token = localStorage.getItem('apl_admin_token') || ''
      const teamPayload = {
        name: teamName.trim(),
        slug: teamSlug.trim() || slugify(teamName),
        city: teamCity.trim() || 'Kabul',
        logo_url: uploadedLogoUrl,
        primary_color: teamColor || '#0575E6',
        home_venue: teamHomeVenue.trim() || 'Kabul International Cricket Stadium',
        description: teamDescription.trim() || 'Official APL franchise team.'
      }

      if (token === MOCK_TOKEN) {
        const newTeam: Team = {
          id: Date.now(),
          ...teamPayload
        }
        setTeams(prev => [newTeam, ...prev])
      } else {
        const res = await fetch(buildApiUrl('/teams'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(teamPayload)
        })

        if (!res.ok) {
          if (res.status === 401 && onLogout) {
            onLogout()
          }
          const errJson = await res.json().catch(() => ({}))
          throw new Error(parseServerError(errJson, 'Failed to create team.'))
        }

        const json = await res.json()
        const createdTeam = json.data || json
        setTeams(prev => [createdTeam, ...prev])
      }

      setSuccessMessage(`Team "${teamName}" created successfully!`)
      setShowTeamModal(false)
      resetTeamForm()
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the team.')
    } finally {
      setIsSubmittingTeam(false)
    }
  }

  const resetTeamForm = () => {
    setTeamName('')
    setTeamSlug('')
    setIsSlugUserModified(false)
    setTeamCity('')
    setTeamHomeVenue('')
    setTeamDescription('')
    setTeamColor('#0575E6')
    setTeamLogoFile(null)
    setTeamLogoPreview('')
  }

  // Submit Create Sponsor
  const handleCreateSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sponsorName.trim()) {
      setError('Sponsor name is required.')
      return
    }

    setIsSubmittingSponsor(true)
    setError(null)

    try {
      let uploadedLogoUrl = 'https://api-staging.chaptersquare.com/uploads/images/headshot_sample.jpg'
      if (sponsorLogoFile) {
        uploadedLogoUrl = await uploadLogoFile(sponsorLogoFile)
      }

      let formattedWebsite = sponsorWebsite.trim()
      if (!formattedWebsite) {
        formattedWebsite = 'https://apl-t20.com'
      } else if (!formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
        formattedWebsite = `https://${formattedWebsite}`
      }

      const token = localStorage.getItem('apl_admin_token') || ''
      const sponsorPayload = {
        name: sponsorName.trim(),
        logo_url: uploadedLogoUrl,
        tier: sponsorTier,
        website_url: formattedWebsite,
        display_order: Number(sponsorDisplayOrder) || 1,
        is_active: sponsorIsActive
      }

      if (token === MOCK_TOKEN) {
        const newSponsor: Sponsor = {
          id: Date.now(),
          ...sponsorPayload
        }
        setSponsors(prev => [newSponsor, ...prev])
      } else {
        const res = await fetch(buildApiUrl('/sponsors'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sponsorPayload)
        })

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}))
          throw new Error(parseServerError(errJson, 'Failed to create sponsor.'))
        }

        const json = await res.json()
        const createdSponsor = json.data || json
        setSponsors(prev => [createdSponsor, ...prev])
      }

      setSuccessMessage(`Sponsor "${sponsorName}" added successfully!`)
      setShowSponsorModal(false)
      resetSponsorForm()
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the sponsor.')
    } finally {
      setIsSubmittingSponsor(false)
    }
  }

  const resetSponsorForm = () => {
    setSponsorName('')
    setSponsorTier('official_partner')
    setSponsorWebsite('')
    setSponsorDisplayOrder(1)
    setSponsorIsActive(true)
    setSponsorLogoFile(null)
    setSponsorLogoPreview('')
  }

  const formatTierLabel = (tierVal: string) => {
    const found = SPONSOR_TIERS.find(t => t.value === tierVal)
    return found ? found.label : tierVal.replace(/_/g, ' ').toUpperCase()
  }

  return (
    <div className="apl-ts-layout animate-fade-in">
      {/* Toast Alert Messages */}
      {successMessage && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '0.9rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.9rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Header & Navigation */}
      <header className="apl-ts-header">
        <div className="apl-ts-title-wrap">
          <h1 className="apl-ts-title">
            TEAMS & SPONSORS <span className="gold-text">MANAGEMENT</span>
          </h1>
          <p className="apl-ts-sub">Dynamically manage franchise teams, official sponsors, and tournament partners</p>
        </div>

        <div className="apl-ts-controls-row">
          {/* Sub Tab Switcher */}
          <div className="apl-ts-tabs-wrap">
            <button
              type="button"
              className={`apl-ts-tab-btn ${subTab === 'teams' ? 'active' : ''}`}
              onClick={() => setSubTab('teams')}
            >
              <span>Franchise Teams ({teams.length})</span>
            </button>
            <div className="apl-ts-tab-divider" />
            <button
              type="button"
              className={`apl-ts-tab-btn ${subTab === 'sponsors' ? 'active' : ''}`}
              onClick={() => setSubTab('sponsors')}
            >
              <span>Official Sponsors ({sponsors.length})</span>
            </button>
          </div>

          {/* Create Button */}
          {subTab === 'teams' ? (
            <button
              type="button"
              className="apl-ts-btn-add"
              onClick={() => {
                setError(null)
                setShowTeamModal(true)
              }}
            >
              <Plus size={18} />
              <span>Add New Team</span>
            </button>
          ) : (
            <button
              type="button"
              className="apl-ts-btn-add"
              onClick={() => {
                setError(null)
                setShowSponsorModal(true)
              }}
            >
              <Plus size={18} />
              <span>Add New Sponsor</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#0575E6' }} />
          <p style={{ fontWeight: 600 }}>Loading records...</p>
        </div>
      ) : subTab === 'teams' ? (
        /* ── TEAMS GRID ── */
        <div className="apl-ts-grid">
          {teams.map(team => (
            <div key={team.id} className="apl-team-card">
              <div
                className="apl-team-color-strip"
                style={{ backgroundColor: team.primary_color || '#0575E6' }}
              />

              <div className="apl-team-card-top">
                <div className="apl-team-logo-box">
                  <TeamLogo name={team.name} logoUrl={team.logo_url} color={team.primary_color} />
                </div>
                <div className="apl-team-header-info">
                  <h3 className="apl-team-name">{team.name}</h3>
                </div>
              </div>

              {/* Rows matching player details table */}
              <div className="apl-detail-rows">
                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <Building size={15} className="apl-detail-icon" />
                    <span>Representing City</span>
                  </div>
                  <div className="apl-detail-value">{team.city || 'Kabul'}</div>
                </div>

                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <MapPin size={15} className="apl-detail-icon" />
                    <span>Home Venue</span>
                  </div>
                  <div className="apl-detail-value">{team.home_venue || 'Kabul International Cricket Stadium'}</div>
                </div>

                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <Shield size={15} className="apl-detail-icon" />
                    <span>URL Slug</span>
                  </div>
                  <div className="apl-detail-value font-mono">/{team.slug || slugify(team.name)}</div>
                </div>

                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <Palette size={15} className="apl-detail-icon" />
                    <span>Theme Color</span>
                  </div>
                  <div className="apl-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <span className="apl-color-swatch" style={{ backgroundColor: team.primary_color || '#0575E6' }} />
                    <span className="font-mono">{team.primary_color || '#0575E6'}</span>
                  </div>
                </div>

                {team.description && (
                  <div className="apl-detail-row" style={{ borderBottom: 'none' }}>
                    <div className="apl-detail-label">
                      <span>Description</span>
                    </div>
                    <div className="apl-detail-value text-right" style={{ maxWidth: '60%', fontSize: '0.8rem', fontWeight: 500 }}>
                      {team.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── SPONSORS GRID ── */
        <div className="apl-ts-grid">
          {sponsors.map(sponsor => (
            <div key={sponsor.id} className="apl-sponsor-card">
              <div className="apl-sponsor-card-top">
                <div className="apl-sponsor-logo-box">
                  <SponsorLogo name={sponsor.name} logoUrl={sponsor.logo_url} />
                </div>
                <h3 className="apl-sponsor-name">{sponsor.name}</h3>
              </div>

              {/* Rows matching player details table */}
              <div className="apl-detail-rows">
                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <User size={15} className="apl-detail-icon" />
                    <span>Sponsor Name</span>
                  </div>
                  <div className="apl-detail-value">{sponsor.name}</div>
                </div>

                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <Award size={15} className="apl-detail-icon" />
                    <span>Sponsor Tier</span>
                  </div>
                  <div className="apl-detail-value">{formatTierLabel(sponsor.tier)}</div>
                </div>

                <div className="apl-detail-row">
                  <div className="apl-detail-label">
                    <Hash size={15} className="apl-detail-icon" />
                    <span>Display Rank Order</span>
                  </div>
                  <div className="apl-detail-value">#{sponsor.display_order || 1}</div>
                </div>

                <div className="apl-detail-row" style={{ borderBottom: 'none' }}>
                  <div className="apl-detail-label">
                    <Globe size={15} className="apl-detail-icon" />
                    <span>Official Website</span>
                  </div>
                  <div className="apl-detail-value">
                    {sponsor.website_url ? (
                      <a
                        href={/^https?:\/\//i.test(sponsor.website_url) ? sponsor.website_url : `https://${sponsor.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apl-sponsor-link"
                      >
                        <span>{sponsor.website_url.replace(/^https?:\/\//i, '')}</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE TEAM MODAL ── */}
      {showTeamModal && (
        <div className="apl-modal-overlay animate-fade-in">
          <div className="apl-modal-card">
            <div className="apl-modal-header">
              <h2 className="apl-modal-title">Create New Team</h2>
              <button
                type="button"
                className="apl-modal-close"
                onClick={() => setShowTeamModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit}>
              <div className="apl-modal-body">
                {/* Team Name */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kabul Eagles"
                    className="apl-form-input"
                    value={teamName}
                    onChange={handleTeamNameChange}
                  />
                </div>

                {/* Slug & City */}
                <div className="apl-form-row-2">
                  <div className="apl-form-group">
                    <label className="apl-form-label">URL Slug (Auto-derived) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. kabul-eagles"
                      className="apl-form-input"
                      style={{ fontFamily: 'monospace' }}
                      value={teamSlug}
                      onChange={handleTeamSlugChange}
                    />
                  </div>
                  <div className="apl-form-group">
                    <label className="apl-form-label">Representing City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kabul"
                      className="apl-form-input"
                      value={teamCity}
                      onChange={e => setTeamCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Home Venue & Primary Color */}
                <div className="apl-form-row-2">
                  <div className="apl-form-group">
                    <label className="apl-form-label">Home Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Kabul International Stadium"
                      className="apl-form-input"
                      value={teamHomeVenue}
                      onChange={e => setTeamHomeVenue(e.target.value)}
                    />
                  </div>
                  <div className="apl-form-group">
                    <label className="apl-form-label">Primary Theme Color</label>
                    <div className="apl-color-input-wrap">
                      <input
                        type="color"
                        className="apl-color-picker-native"
                        value={teamColor}
                        onChange={e => setTeamColor(e.target.value)}
                      />
                      <input
                        type="text"
                        className="apl-form-input"
                        style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                        value={teamColor}
                        onChange={e => setTeamColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short team description or history..."
                    className="apl-form-textarea"
                    value={teamDescription}
                    onChange={e => setTeamDescription(e.target.value)}
                  />
                </div>

                {/* Logo Uploader */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Team Logo Image *</label>
                  <label className="apl-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setTeamLogoFile(file)
                          setTeamLogoPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                    {teamLogoPreview ? (
                      <div className="apl-dropzone-preview">
                        <img src={teamLogoPreview} alt="Logo preview" className="apl-preview-img" />
                        <div className="apl-preview-info">
                          <span className="apl-preview-name">{teamLogoFile?.name}</span>
                          <span className="apl-preview-size">{(teamLogoFile!.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="apl-dropzone-icon" />
                        <span className="apl-dropzone-text">Click or drag logo file here</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="apl-modal-footer">
                <button
                  type="button"
                  className="apl-btn-cancel"
                  onClick={() => setShowTeamModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTeam}
                  className="apl-btn-submit"
                >
                  {isSubmittingTeam ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating Team...</span>
                    </>
                  ) : (
                    <span>Create Team</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE SPONSOR MODAL ── */}
      {showSponsorModal && (
        <div className="apl-modal-overlay animate-fade-in">
          <div className="apl-modal-card">
            <div className="apl-modal-header">
              <h2 className="apl-modal-title">Add Official Sponsor</h2>
              <button
                type="button"
                className="apl-modal-close"
                onClick={() => setShowSponsorModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSponsorSubmit}>
              <div className="apl-modal-body">
                {/* Sponsor Name */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Sponsor Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Bull"
                    className="apl-form-input"
                    value={sponsorName}
                    onChange={e => setSponsorName(e.target.value)}
                  />
                </div>

                {/* Tier & Display Order */}
                <div className="apl-form-row-2">
                  <div className="apl-form-group">
                    <label className="apl-form-label">Sponsor Tier *</label>
                    <select
                      className="apl-form-select"
                      value={sponsorTier}
                      onChange={e => setSponsorTier(e.target.value)}
                    >
                      {SPONSOR_TIERS.map(tier => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="apl-form-group">
                    <label className="apl-form-label">Display Rank Order</label>
                    <input
                      type="number"
                      min={1}
                      className="apl-form-input"
                      value={sponsorDisplayOrder}
                      onChange={e => setSponsorDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://redbull.com"
                    className="apl-form-input"
                    value={sponsorWebsite}
                    onChange={e => setSponsorWebsite(e.target.value)}
                  />
                </div>

                {/* Logo Uploader */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Sponsor Logo Image *</label>
                  <label className="apl-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSponsorLogoFile(file)
                          setSponsorLogoPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                    {sponsorLogoPreview ? (
                      <div className="apl-dropzone-preview">
                        <img src={sponsorLogoPreview} alt="Logo preview" className="apl-preview-img" />
                        <div className="apl-preview-info">
                          <span className="apl-preview-name">{sponsorLogoFile?.name}</span>
                          <span className="apl-preview-size">{(sponsorLogoFile!.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="apl-dropzone-icon" />
                        <span className="apl-dropzone-text">Click or drag logo file here</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="apl-modal-footer">
                <button
                  type="button"
                  className="apl-btn-cancel"
                  onClick={() => setShowSponsorModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="apl-btn-submit"
                >
                  {isSubmittingSponsor ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Adding Sponsor...</span>
                    </>
                  ) : (
                    <span>Add Sponsor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
