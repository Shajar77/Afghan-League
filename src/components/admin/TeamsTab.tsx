import { useState, useEffect, type ChangeEvent, type FormEvent, type Dispatch, type SetStateAction } from 'react'
import { buildApiUrl, authFetch, normalizeMediaUrl } from '../../config/api'
import { compressImageFile } from '../../utils/imageCompression'
import {
  Shield,
  X,
  UploadCloud,
  MapPin,
  Building,
  Loader2,
  Palette
} from 'lucide-react'

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

function parseServerError(errJson: Record<string, unknown>, fallback: string): string {
  if (errJson.error && typeof errJson.error === 'object') {
    const sub = errJson.error as Record<string, unknown>
    if (Array.isArray(sub.details) && sub.details.length > 0) {
      const msgs = sub.details.map((d: any) => d.message || d.msg || '').filter(Boolean)
      if (msgs.length > 0) return msgs.join('. ')
    }
    if (typeof sub.message === 'string') return sub.message
  }
  if (Array.isArray(errJson.details) && errJson.details.length > 0) {
    const msgs = (errJson.details as any[]).map((d: any) => d.message || d.msg || '').filter(Boolean)
    if (msgs.length > 0) return msgs.join('. ')
  }
  if (typeof errJson.message === 'string') return errJson.message
  return fallback
}

interface TeamsTabProps {
  teams: Team[]
  setTeams: Dispatch<SetStateAction<Team[]>>
  showTeamModal: boolean
  setShowTeamModal: (show: boolean) => void
  setSuccessMessage: (msg: string | null) => void
  setError: (msg: string | null) => void
  onLogout?: () => void
}

export function TeamsTab({
  teams,
  setTeams,
  showTeamModal,
  setShowTeamModal,
  setSuccessMessage,
  setError,
  onLogout
}: TeamsTabProps) {
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

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (teamLogoPreview) {
        URL.revokeObjectURL(teamLogoPreview)
      }
    }
  }, [teamLogoPreview])

  const resetTeamForm = () => {
    if (teamLogoPreview) {
      URL.revokeObjectURL(teamLogoPreview)
    }
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

  const handleTeamNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTeamName(val)
    if (!isSlugUserModified) {
      setTeamSlug(slugify(val))
    }
  }

  const handleTeamSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamSlug(e.target.value)
    setIsSlugUserModified(true)
  }

  const uploadLogoFile = async (file: File): Promise<string> => {
    const compressedFile = await compressImageFile(file, { maxSizeMB: 0.3, maxWidthOrHeight: 1200 })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const uploadRes = await authFetch(buildApiUrl('/uploads/image'), {
      method: 'POST',
      body: formData
    })

    if (!uploadRes.ok) {
      const errJson = await uploadRes.json().catch(() => ({}))
      throw new Error(parseServerError(errJson, 'Failed to upload team logo image.'))
    }

    const uploadJson = await uploadRes.json()
    const uploadedUrl = uploadJson.data?.url || uploadJson.data?.file_url || uploadJson.url || ''
    if (!uploadedUrl) {
      throw new Error('Upload succeeded but server did not return image URL.')
    }
    return uploadedUrl
  }

  const handleCreateTeamSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!teamName.trim()) {
      setError('Please provide a valid team name.')
      return
    }

    if (!teamLogoFile) {
      setError('Please upload a team logo image.')
      return
    }

    setIsSubmittingTeam(true)

    try {
      const uploadedLogoUrl = await uploadLogoFile(teamLogoFile)
      const fullLogoUrl = normalizeMediaUrl(uploadedLogoUrl) || uploadedLogoUrl

      const teamPayload = {
        name: teamName.trim(),
        slug: (teamSlug.trim() || slugify(teamName)).toLowerCase(),
        city: teamCity.trim() || 'Kabul',
        logo_url: fullLogoUrl,
        primary_color: teamColor || '#0575E6',
        home_venue: teamHomeVenue.trim() || 'Kabul International Cricket Stadium',
        description: teamDescription.trim() || 'Official APL franchise team.'
      }

      const res = await authFetch(buildApiUrl('/teams'), {
        method: 'POST',
        headers: {
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

      setSuccessMessage(`Team "${teamName}" created successfully!`)
      setShowTeamModal(false)
      resetTeamForm()
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while creating the team.'
      setError(errorMsg)
    } finally {
      setIsSubmittingTeam(false)
    }
  }

  return (
    <>
      {/* ── TEAMS GRID ── */}
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
    </>
  )
}
