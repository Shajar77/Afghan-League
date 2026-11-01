import { useState, useEffect, useCallback } from 'react'
import { buildApiUrl, authFetch } from '../../config/api'
import {
  Users,
  UserPlus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Shield,
  ChevronRight
} from 'lucide-react'

interface Team {
  id: number | string
  name: string
  slug?: string
  city?: string
  logo_url?: string
  primary_color?: string
}

interface AvailablePlayer {
  id: number | string
  registration_code?: string
  full_name?: string
  first_name?: string
  last_name?: string
  nationality?: string
  playing_role?: string
  player_status?: string
  category?: string
  photo_url?: string
}

interface AssignedPlayer {
  id: number | string
  registration_code?: string
  full_name?: string
  first_name?: string
  last_name?: string
  nationality?: string
  playing_role?: string
  player_status?: string
  category?: string
  photo_url?: string
}

function getFullName(p: AvailablePlayer | AssignedPlayer): string {
  if (p.full_name) return p.full_name
  const parts = [p.first_name, p.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown Player'
}

function PlayerAvatar({
  name,
  photoUrl,
  size = 36
}: {
  name: string
  photoUrl?: string
  size?: number
}) {
  const [err, setErr] = useState(false)
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (photoUrl && !err) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setErr(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(5, 117, 230, 0.18)',
        border: '1.5px solid rgba(5, 117, 230, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
        fontWeight: 800,
        fontSize: size * 0.38,
        color: '#0575E6',
        flexShrink: 0
      }}
    >
      {initials}
    </div>
  )
}

interface TeamManagementProps {
  onLogout?: () => void
  onViewPlayer?: (player: { id: number | string; [key: string]: unknown }) => void
}

export function TeamManagement({ onLogout, onViewPlayer }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>([])
  const [teamPlayers, setTeamPlayers] = useState<AssignedPlayer[]>([])

  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false)
  const [isLoadingTeamPlayers, setIsLoadingTeamPlayers] = useState(false)
  const [assigningId, setAssigningId] = useState<number | string | null>(null)

  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Load teams
  useEffect(() => {
    const load = async () => {
      setIsLoadingTeams(true)
      try {
        const res = await authFetch(buildApiUrl('/teams'))
        if (res.status === 401 && onLogout) { onLogout(); return }
        if (!res.ok) { setError('Failed to load teams.'); return }
        const json = await res.json()
        const list: Team[] = Array.isArray(json)
          ? json
          : (json.data?.teams || json.data || json.teams || [])
        setTeams(list)
      } catch {
        setError('Network error loading teams.')
      } finally {
        setIsLoadingTeams(false)
      }
    }
    load()
  }, [onLogout])

  // Load available players (approved, unassigned)
  const loadAvailablePlayers = useCallback(async () => {
    setIsLoadingAvailable(true)
    try {
      const res = await authFetch(buildApiUrl('/team-players/available'))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setError('Failed to load available players.'); return }
      const json = await res.json()
      const list: AvailablePlayer[] = Array.isArray(json)
        ? json
        : (json.data?.players || json.data || json.players || [])
      setAvailablePlayers(list)
    } catch {
      setError('Network error loading available players.')
    } finally {
      setIsLoadingAvailable(false)
    }
  }, [onLogout])

  // Load players already assigned to selected team
  const loadTeamPlayers = useCallback(async (teamId: number | string) => {
    setIsLoadingTeamPlayers(true)
    try {
      const res = await authFetch(buildApiUrl(`/team-players/team/${teamId}`))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setTeamPlayers([]); return }
      const json = await res.json()
      const list: AssignedPlayer[] = Array.isArray(json)
        ? json
        : (json.data?.players || json.data || json.players || [])
      setTeamPlayers(list)
    } catch {
      setTeamPlayers([])
    } finally {
      setIsLoadingTeamPlayers(false)
    }
  }, [onLogout])

  // When team is selected, load both lists
  const handleSelectTeam = useCallback((team: Team) => {
    setSelectedTeam(team)
    setSearch('')
    setError(null)
    loadAvailablePlayers()
    loadTeamPlayers(team.id)
  }, [loadAvailablePlayers, loadTeamPlayers])

  // Assign player to selected team
  const handleAssign = async (player: AvailablePlayer) => {
    if (!selectedTeam) return
    setAssigningId(player.id)
    setError(null)
    try {
      const res = await authFetch(buildApiUrl('/team-players/assign'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: selectedTeam.id, player_id: player.id })
      })
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || errJson.error?.message || 'Failed to assign player.')
      }
      // Optimistically move player from available to team list
      setAvailablePlayers(prev => prev.filter(p => p.id !== player.id))
      setTeamPlayers(prev => [player as AssignedPlayer, ...prev])
      setSuccessMsg(`${getFullName(player)} assigned to ${selectedTeam.name}`)
      setTimeout(() => setSuccessMsg(null), 3500)
    } catch (err: any) {
      setError(err.message || 'Assignment failed.')
    } finally {
      setAssigningId(null)
    }
  }

  // Filtered available players by search
  const filteredAvailable = availablePlayers.filter(p => {
    const q = search.toLowerCase()
    return (
      getFullName(p).toLowerCase().includes(q) ||
      (p.registration_code || '').toLowerCase().includes(q) ||
      (p.nationality || '').toLowerCase().includes(q) ||
      (p.playing_role || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="apl-ts-wrapper animate-fade-in">

      {/* ── Toast Notifications ── */}
      {successMsg && (
        <div className="apl-ts-toast success animate-slide-down">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="apl-ts-toast error animate-slide-down">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Page Header ── */}
      <header className="apl-ts-header">
        <div className="apl-ts-title-wrap">
          <h1 className="apl-ts-title">
            TEAM <span className="gold-text">MANAGEMENT</span>
          </h1>
          <p className="apl-ts-sub">
            Select a franchise team, then assign approved players from the draft pool
          </p>
        </div>
      </header>

      {/* ── Team Selector Grid ── */}
      {isLoadingTeams ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
          <Loader2 size={30} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#F8C800' }} />
          <p style={{ fontWeight: 600 }}>Loading teams...</p>
        </div>
      ) : (
        <>
          {/* Team Pills Row */}
          <div className="apl-tm-team-selector">
            {teams.slice(0, 5).map(team => {
              const isActive = selectedTeam?.id === team.id
              const accentColor = team.primary_color || '#0575E6'
              return (
                <button
                  key={team.id}
                  type="button"
                  className={`apl-tm-team-pill${isActive ? ' active' : ''}`}
                  style={{ '--team-color': accentColor } as React.CSSProperties}
                  onClick={() => handleSelectTeam(team)}
                >
                  <span className="apl-tm-pill-name">{team.name}</span>
                  {isActive && <ChevronRight size={14} style={{ opacity: 0.7 }} />}
                </button>
              )
            })}
          </div>

          {/* ── Main Content: Available Players + Assigned Players ── */}
          {selectedTeam ? (
            <div className="apl-tm-panels">

              {/* LEFT: Available Players Pool */}
              <div className="apl-tm-panel">
                <div className="apl-tm-panel-header">
                  <div className="apl-tm-panel-title-row">
                    <UserPlus size={18} style={{ color: '#0575E6' }} />
                    <h2 className="apl-tm-panel-title">Available Players</h2>
                    <span className="apl-tm-count-badge">({filteredAvailable.length})</span>
                  </div>
                  <p className="apl-tm-panel-sub">Approved & unassigned players from the draft pool</p>

                  {/* Search */}
                  <div className="apl-tm-search-wrap">
                    <Search size={15} className="apl-tm-search-icon" />
                    <input
                      type="text"
                      className="apl-tm-search-input"
                      placeholder="Search by name, ID, role, nationality..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="apl-tm-search-clear"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="apl-tm-player-list">
                  {isLoadingAvailable ? (
                    <div className="apl-tm-list-state">
                      <Loader2 size={24} className="animate-spin" style={{ color: '#0575E6' }} />
                      <span>Loading players...</span>
                    </div>
                  ) : filteredAvailable.length === 0 ? (
                    <div className="apl-tm-list-state">
                      <Users size={32} style={{ opacity: 0.35 }} />
                      <span>{search ? 'No players match your search.' : 'No available players found.'}</span>
                    </div>
                  ) : (
                    filteredAvailable.map(player => {
                      const name = getFullName(player)
                      const isAssigning = assigningId === player.id
                      return (
                        <div
                          key={player.id}
                          className="apl-tm-player-row"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            // Don't open dossier when clicking the assign button
                            if ((e.target as HTMLElement).closest('.apl-tm-assign-btn')) return
                            onViewPlayer?.(player as unknown as { id: number | string; [key: string]: unknown })
                          }}
                        >
                          <PlayerAvatar name={name} photoUrl={player.photo_url} />
                          <div className="apl-tm-player-info">
                            <span className="apl-tm-player-name">{name}</span>
                            <span className="apl-tm-player-meta">
                              {[player.registration_code, player.playing_role, player.nationality]
                                .filter(Boolean).join(' · ')}
                            </span>
                            {player.category && (
                              <span className="apl-tm-player-cat">{player.category}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="apl-tm-assign-btn"
                            disabled={isAssigning || !!assigningId}
                            onClick={() => handleAssign(player)}
                            title={`Assign ${name} to ${selectedTeam.name}`}
                            aria-label={`Assign ${name} to ${selectedTeam.name}`}
                          >
                            {isAssigning ? (
                              <Loader2 size={20} className="animate-spin" />
                            ) : (
                              <UserPlus size={20} strokeWidth={2.2} />
                            )}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* RIGHT: Current Team Roster */}
              <div className="apl-tm-panel apl-tm-panel--roster">
                <div className="apl-tm-panel-header">
                  <div className="apl-tm-panel-title-row">
                    <Shield
                      size={18}
                      style={{ color: selectedTeam.primary_color || '#0575E6' }}
                    />
                    <h2 className="apl-tm-panel-title">{selectedTeam.name} Squad</h2>
                    <span className="apl-tm-count-badge apl-tm-count-badge--roster">
                      ({teamPlayers.length})
                    </span>
                  </div>
                  <p className="apl-tm-panel-sub">Players currently assigned to this franchise</p>
                </div>

                <div className="apl-tm-player-list">
                  {isLoadingTeamPlayers ? (
                    <div className="apl-tm-list-state">
                      <Loader2 size={24} className="animate-spin" style={{ color: selectedTeam.primary_color || '#0575E6' }} />
                      <span>Loading squad...</span>
                    </div>
                  ) : teamPlayers.length === 0 ? (
                    <div className="apl-tm-list-state">
                      <Shield size={32} style={{ opacity: 0.3 }} />
                      <span>No players assigned yet.</span>
                    </div>
                  ) : (
                    teamPlayers.map((player, idx) => {
                      const name = getFullName(player)
                      return (
                        <div
                          key={player.id ?? idx}
                          className="apl-tm-player-row apl-tm-player-row--assigned"
                          style={{ cursor: 'pointer' }}
                          onClick={() => onViewPlayer?.(player as unknown as { id: number | string; [key: string]: unknown })}
                        >
                          <PlayerAvatar name={name} photoUrl={player.photo_url} />
                          <div className="apl-tm-player-info">
                            <span className="apl-tm-player-name">{name}</span>
                            <span className="apl-tm-player-meta">
                              {[player.registration_code, player.playing_role, player.nationality]
                                .filter(Boolean).join(' · ')}
                            </span>
                            {player.category && (
                              <span className="apl-tm-player-cat">{player.category}</span>
                            )}
                          </div>
                          <span className="apl-tm-assigned-badge" title="Assigned to squad">
                            <CheckCircle2 size={20} />
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* No team selected state */
            <div className="apl-tm-empty-state">
              <Shield size={48} style={{ opacity: 0.25, marginBottom: '1rem' }} />
              <p>Select a team above to manage its player roster</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
