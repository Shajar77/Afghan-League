import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { buildApiUrl, authFetch, getApiToken, isJwtExpiringSoon, normalizeMediaUrl } from '../../config/api'
import './TeamsPage.css'

// ── Temporary Auth Token (Read from .env so it is never committed to GitHub)
const TEMP_DEV_TOKEN = import.meta.env.VITE_TEMP_PREVIEW_TOKEN || ''

// Helper to make an authenticated request using active admin session or valid temp token
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const adminToken = getApiToken()
  const validAdminToken = adminToken && !isJwtExpiringSoon(adminToken) ? adminToken : ''
  const validTempToken = TEMP_DEV_TOKEN && !isJwtExpiringSoon(TEMP_DEV_TOKEN) ? TEMP_DEV_TOKEN : ''
  const token = validAdminToken || validTempToken

  const headers = new Headers(options.headers || {})
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return authFetch(url, { ...options, headers })
}

// ── Official Team Theme Brand Colors ────────────────────────────
export const TEAM_BRAND_COLORS: Record<string, string> = {
  akcel: '#DB1F27',
  axcel: '#DB1F27',
  kabul: '#DB1F27',
  balkh: '#FC5F04',
  kandahar: '#D9AD46',
  kandhar: '#D9AD46',
  nangarhar: '#FF001F',
  nanghar: '#FF001F',
  paktia: '#89FB1F',
}

export function getTeamAccentColor(team?: ApiTeam | null): string {
  if (!team) return '#DB1F27'
  const text = `${team.name || ''} ${team.slug || ''} ${team.city || ''}`.toLowerCase()
  if (text.includes('akcel') || text.includes('axcel') || text.includes('kabul')) {
    return '#DB1F27'
  }
  if (text.includes('balkh')) {
    return '#FC5F04'
  }
  if (text.includes('kandahar') || text.includes('kandhar')) {
    return '#D9AD46'
  }
  if (text.includes('nangarhar') || text.includes('nanghar')) {
    return '#FF001F'
  }
  if (text.includes('paktia')) {
    return '#89FB1F'
  }
  return team.primary_color || '#DB1F27'
}

// ── API Types ──────────────────────────────────────────────────
interface ApiTeam {
  id: number | string
  name: string
  slug?: string
  city?: string
  logo_url?: string
  primary_color?: string
  captain?: string
  head_coach?: string
  assistant_coach?: string
  home_venue?: string
  founded?: string | number
}

interface ApiPlayer {
  id: number | string
  full_name?: string
  first_name?: string
  last_name?: string
  nationality?: string
  playing_role?: string
  category?: string
  photo_url?: string
  photo?: string
  headshot_url?: string
  profile_photo_url?: string
  registration_code?: string
  is_captain?: boolean | 0 | 1
}

// ── Helpers ────────────────────────────────────────────────────
function getPlayerName(p: ApiPlayer): string {
  if (p.full_name) return p.full_name
  const parts = [p.first_name, p.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown Player'
}

function getPlayerPhoto(p: ApiPlayer): string {
  const raw =
    p.photo_url ||
    p.photo ||
    p.headshot_url ||
    p.profile_photo_url ||
    (p as any).headshot_image_url ||
    (p as any).image_url ||
    (p as any).avatar ||
    ''
  return normalizeMediaUrl(raw)
}

function isCaptain(p: ApiPlayer): boolean {
  return p.is_captain === true || p.is_captain === 1
}

function PlayerAvatar({
  name,
  photoUrl,
  accentColor = '#0a1240',
}: {
  name: string
  photoUrl?: string
  accentColor?: string
}) {
  const [err, setErr] = useState(false)
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || 'PL'

  return (
    <div className="squad-player-avatar-wrap">
      {photoUrl && !err ? (
        <img
          src={photoUrl}
          alt={name}
          className="squad-player-avatar-img"
          loading="lazy"
          decoding="async"
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className="squad-player-avatar-fallback"
          style={{
            background: `${accentColor}14`,
            color: accentColor,
            borderColor: `${accentColor}30`,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

// ── Team Logo Component ────────────────────────────────────────
function TeamLogoImg({
  name,
  logoUrl,
  accentColor,
  className,
}: {
  name: string
  logoUrl?: string
  accentColor?: string
  className?: string
}) {
  const [err, setErr] = useState(false)
  const normalizedUrl = normalizeMediaUrl(logoUrl)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const color = accentColor || getTeamAccentColor({ name } as ApiTeam)

  if (normalizedUrl && !err) {
    return (
      <img
        src={normalizedUrl}
        alt={`${name} Logo`}
        className={className}
        loading="lazy"
        decoding="async"
        onError={() => setErr(true)}
      />
    )
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `${color}18`,
        border: `2px solid ${color}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
        fontWeight: 800,
        fontSize: '1.25rem',
        color,
      }}
    >
      {initials}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export function TeamsPage() {
  const [teams, setTeams] = useState<ApiTeam[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [teamsError, setTeamsError] = useState<string | null>(null)

  const [selectedTeam, setSelectedTeam] = useState<ApiTeam | null>(null)
  const [squad, setSquad] = useState<ApiPlayer[]>([])
  const [isLoadingSquad, setIsLoadingSquad] = useState(false)

  // Fetch teams list
  const loadTeams = useCallback(async () => {
    setIsLoadingTeams(true)
    setTeamsError(null)
    try {
      const res = await authenticatedFetch(buildApiUrl('/teams'))
      if (!res.ok) throw new Error('Failed to load teams.')
      const json = await res.json()
      const list: ApiTeam[] = Array.isArray(json)
        ? json
        : json.data?.teams || json.data || json.teams || []
      setTeams(list)
    } catch {
      setTeamsError('Unable to load teams.')
    } finally {
      setIsLoadingTeams(false)
    }
  }, [])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Fetch squad for a specific team
  const loadSquad = useCallback(async (teamId: number | string) => {
    setIsLoadingSquad(true)
    setSquad([])
    try {
      const res = await authenticatedFetch(buildApiUrl(`/team-players/team/${teamId}`))
      if (!res.ok) throw new Error('Failed to load squad.')
      const json = await res.json()
      const list: ApiPlayer[] = Array.isArray(json)
        ? json
        : json.data?.players || json.data || json.players || []
      setSquad(list)
    } catch {
      setSquad([])
    } finally {
      setIsLoadingSquad(false)
    }
  }, [])

  const handleOpenModal = (team: ApiTeam) => {
    setSelectedTeam(team)
    loadSquad(team.id)
    document.body.classList.add('modal-open-blur')
  }

  const handleCloseModal = () => {
    setSelectedTeam(null)
    setSquad([])
    document.body.classList.remove('modal-open-blur')
  }

  const accentColor = (team?: ApiTeam | null) => getTeamAccentColor(team)

  return (
    <div className="teams-page-container">
      {/* ── TOP HERO HEADER BANNER ── */}
      <section className="teams-hero">
        <div className="teams-hero-bg-grid" />
        <div className="teams-hero-glow" />
        <div className="teams-hero-top-row">
          <div className="teams-hero-title-wrap">
            <span className="teams-live-badge">APL 2026 SEASON</span>
            <h1 className="teams-main-title">TEAMS<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* ── TEAMS GRID SECTION ── */}
      <section className="teams-grid-section">
        <div className="teams-grid-inner">

          {/* Loading state */}
          {isLoadingTeams && (
            <div className="fixtures-state-box">
              <div className="fixtures-spinner" />
              <p>Loading teams…</p>
            </div>
          )}

          {/* Error state */}
          {!isLoadingTeams && teamsError && (
            <div className="fixtures-state-box">
              <p className="fixtures-error-msg">{teamsError}</p>
              <button type="button" className="fixtures-retry-btn" onClick={loadTeams}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingTeams && !teamsError && teams.length === 0 && (
            <div className="fixtures-state-box">
              <p className="fixtures-empty-msg">No teams found.</p>
            </div>
          )}

          {/* Teams cards grid */}
          {!isLoadingTeams && !teamsError && teams.length > 0 && (
            <div className="teams-cards-grid">
              {teams.map((team) => {
                const teamColor = accentColor(team)
                const isBright = teamColor.toLowerCase() === '#89fb1f'
                return (
                  <div key={team.id} className="team-profile-card">
                    {/* Left Side: Logo */}
                    <div
                      className="team-card-left"
                      style={{ borderLeft: `4px solid ${teamColor}` }}
                    >
                      <div className="team-logo-wrap">
                        <TeamLogoImg
                          name={team.name}
                          logoUrl={team.logo_url}
                          accentColor={teamColor}
                          className="team-logo-img-page"
                        />
                      </div>
                    </div>

                    {/* Center Divider Line */}
                    <div className="team-card-divider" />

                    {/* Right Side: Details & View Squad Button */}
                    <div className="team-card-right">
                      <div className="team-name-wrap">
                        <h3 className="team-full-name">{team.name}</h3>
                      </div>

                      {(team.captain || team.head_coach || team.founded) && (
                        <div className="team-card-body">
                          {team.captain && (
                            <div className="team-info-row">
                              <span className="info-row-label">Captain</span>
                              <span className="info-row-value">{team.captain}</span>
                            </div>
                          )}
                          {team.head_coach && (
                            <div className="team-info-row">
                              <span className="info-row-label">Head Coach</span>
                              <span className="info-row-value">{team.head_coach}</span>
                            </div>
                          )}
                          {team.founded && (
                            <div className="team-info-row">
                              <span className="info-row-label">Founded</span>
                              <span className="info-row-value">{team.founded}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="team-card-footer">
                        <button
                          className="team-action-btn"
                          onClick={() => handleOpenModal(team)}
                          style={{
                            '--team-theme-color': teamColor,
                            '--team-hover-text': isBright ? '#0a1240' : '#ffffff',
                          } as React.CSSProperties}
                        >
                          View Squad
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── SQUAD MODAL DIALOG ── */}
      {selectedTeam && (
        <div className="squad-modal-overlay" onClick={handleCloseModal}>
          <div
            className="squad-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: `5px solid ${accentColor(selectedTeam)}`,
            }}
          >
            {/* Modal Header */}
            <div className="squad-modal-header">
              <div className="squad-header-logo-wrap">
                <TeamLogoImg
                  name={selectedTeam.name}
                  logoUrl={selectedTeam.logo_url}
                  accentColor={accentColor(selectedTeam)}
                  className="squad-header-logo-img"
                />
              </div>
              <div className="squad-header-titles">
                <span className="squad-badge" style={{ color: accentColor(selectedTeam) }}>
                  APL SQUAD PROFILE
                </span>
                <h2 className="squad-team-name">{selectedTeam.name}</h2>
              </div>
              <button
                className="squad-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="squad-modal-body">
              {isLoadingSquad ? (
                <div className="fixtures-state-box" style={{ minHeight: 120 }}>
                  <div className="fixtures-spinner" />
                  <p>Loading squad…</p>
                </div>
              ) : squad.length === 0 ? (
                <div className="fixtures-state-box" style={{ minHeight: 120 }}>
                  <p className="fixtures-empty-msg">No players assigned to this team yet.</p>
                </div>
              ) : (
                <>
                  <h4
                    className="squad-section-title"
                    style={{
                      color: accentColor(selectedTeam),
                      borderLeftColor: accentColor(selectedTeam),
                    }}
                  >
                    ACTIVE ROSTER ({squad.length} PLAYERS)
                  </h4>
                  <div
                    className="squad-players-grid"
                    style={{ '--roster-rows': Math.max(1, Math.ceil(squad.length / 2)) } as React.CSSProperties}
                  >
                    {squad.map((player, idx) => (
                      <div key={player.id ?? idx} className="squad-player-item">
                        <div
                          className="player-number-col"
                          style={{ color: accentColor(selectedTeam) }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="player-divider-col" />
                        <PlayerAvatar
                          name={getPlayerName(player)}
                          photoUrl={getPlayerPhoto(player)}
                          accentColor={accentColor(selectedTeam)}
                        />
                        <div className="player-info-col">
                          <span className="player-name">
                            {getPlayerName(player)}
                            {isCaptain(player) && (
                              <span className="captain-text-suffix"> (C)</span>
                            )}
                          </span>
                        </div>
                        {player.nationality && (
                          <div className="player-country-col">
                            <span className="country-name-badge">{player.nationality}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer — coach info if available */}
            {(selectedTeam.head_coach || selectedTeam.assistant_coach) && (
              <div className="squad-modal-footer">
                <div className="squad-coach-row">
                  {selectedTeam.head_coach && (
                    <div className="squad-coach-bar">
                      <span className="footer-label">Head Coach:</span>
                      <span className="footer-value">{selectedTeam.head_coach}</span>
                    </div>
                  )}
                  {selectedTeam.assistant_coach && (
                    <div className="squad-coach-bar">
                      <span className="footer-label">Assistant Coach:</span>
                      <span className="footer-value">{selectedTeam.assistant_coach}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
