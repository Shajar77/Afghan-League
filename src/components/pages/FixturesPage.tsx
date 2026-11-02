import { useState, useEffect, useCallback } from 'react'
import { buildApiUrl } from '../../config/api'
import './FixturesPage.css'

// ── Types ──────────────────────────────────────────────────────
interface ApiFixture {
  id: number | string
  team_first: number | string
  team_second: number | string
  team_first_name?: string
  team_second_name?: string
  team_first_logo?: string
  team_second_logo?: string
  team_first_color?: string
  team_second_color?: string
  match_date: string
  city_name?: string
  venue_name?: string
  match_status?: 'scheduled' | 'completed' | 'drawn' | 'abandoned'
  winner_team?: number | string | null
  team_first_points_earned?: number | null
  team_second_points_earned?: number | null
}

// ── Helpers ────────────────────────────────────────────────────
function parseMatchDate(dateStr: string) {
  if (!dateStr) return { dayName: 'TBD', dayNum: '--', month: 'TBD', year: '' }
  try {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const monthIdx = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, monthIdx, day)
      return {
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        dayNum: String(day).padStart(2, '0'),
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        year: String(year),
      }
    }
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return { dayName: 'TBD', dayNum: '--', month: 'TBD', year: '' }
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
      dayNum: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: String(d.getFullYear()),
    }
  } catch {
    return { dayName: 'TBD', dayNum: '--', month: 'TBD', year: '' }
  }
}

function getStatusLabel(fixture: ApiFixture): 'UPCOMING' | 'COMPLETED' | 'DRAWN' | 'ABANDONED' {
  const s = fixture.match_status
  if (!s || s === 'scheduled') return 'UPCOMING'
  if (s === 'completed') return 'COMPLETED'
  if (s === 'drawn') return 'DRAWN'
  if (s === 'abandoned') return 'ABANDONED'
  return 'UPCOMING'
}

// ── Team Logo Component ────────────────────────────────────────
function TeamLogo({
  name,
  logoUrl,
  color,
  size = 52,
}: {
  name: string
  logoUrl?: string
  color?: string
  size?: number
}) {
  const [err, setErr] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const bg = color || '#0a1240'

  if (logoUrl && !err) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="fixture-team-logo"
        onError={() => setErr(true)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${bg}22`,
        border: `2px solid ${bg}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
        fontWeight: 800,
        fontSize: size * 0.36,
        color: bg,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export function FixturesPage() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<ApiFixture | null>(null)

  const loadFixtures = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(buildApiUrl('/fixtures'))
      if (!res.ok) throw new Error('Failed to load fixtures.')
      const json = await res.json()
      let list: ApiFixture[] = []
      if (Array.isArray(json)) list = json
      else if (Array.isArray(json.data?.fixtures)) list = json.data.fixtures
      else if (Array.isArray(json.data)) list = json.data
      else if (Array.isArray(json.fixtures)) list = json.fixtures
      setFixtures(list)
    } catch {
      setError('Unable to load fixtures. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFixtures()
  }, [loadFixtures])

  // Sort all fixtures by date ascending
  const sorted = [...fixtures].sort((a, b) =>
    new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  )

  // Group by date key
  interface GroupedDay {
    dateKey: string
    dayName: string
    dayNum: string
    month: string
    year: string
    matches: ApiFixture[]
  }

  const grouped: GroupedDay[] = []
  sorted.forEach((fx) => {
    const dateKey = (fx.match_date || '').split('T')[0]
    const existing = grouped.find((g) => g.dateKey === dateKey)
    if (existing) {
      existing.matches.push(fx)
    } else {
      const parsed = parseMatchDate(fx.match_date)
      grouped.push({ dateKey, ...parsed, matches: [fx] })
    }
  })

  return (
    <div className="fixtures-page-container">

      {/* ── HERO  (title left · filter tabs right) ────────── */}
      <section className="fixtures-hero">
        <div className="fixtures-hero-bg-grid" />
        <div className="fixtures-hero-glow" />
        <div className="fixtures-hero-top-row">
          {/* Left: badge + title */}
          <div className="fixtures-hero-title-wrap">
            <span className="fixtures-live-badge">APL 2026 SEASON</span>
            <h1 className="fixtures-main-title">FIXTURES<span className="dot-accent">.</span></h1>
          </div>


        </div>
      </section>

      {/* ── FIXTURES LIST ─────────────────────────────────── */}
      <section className="fixtures-list-section">
        <div className="fixtures-list-inner">

          {isLoading && (
            <div className="fixtures-state-box">
              <div className="fixtures-spinner" />
              <p>Loading fixtures…</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="fixtures-state-box">
              <p className="fixtures-error-msg">{error}</p>
              <button type="button" className="fixtures-retry-btn" onClick={loadFixtures}>
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && grouped.length === 0 && (
            <div className="fixtures-state-box">
              <p className="fixtures-empty-msg">No fixtures have been scheduled yet.</p>
            </div>
          )}

          {!isLoading && !error && grouped.length > 0 && (
            <>
              {/* Desktop column headers — matches original design */}
              <div className="fixtures-grid-header">
                <div className="gh-col gh-date">DATE</div>
                <div className="gh-teams-wrap">
                  <div className="gh-col gh-teams">TEAMS &amp; VENUE</div>
                  <div className="gh-col gh-score">SCORE</div>
                </div>
                <div className="gh-col gh-streaming">STATUS</div>
              </div>

              {grouped.map((day) => (
                <div key={day.dateKey} className="fixture-card">

                  {/* LEFT: shared date column for all matches on this day */}
                  <div className="fixture-date-col">
                    <span className="fixture-day-name">{day.dayName}</span>
                    <span className="fixture-day-num">{day.dayNum}</span>
                    <span className="fixture-month">{day.month}</span>
                  </div>

                  {/* RIGHT: stacked match rows */}
                  <div className="fixture-right-content-wrapper">
                    <div className="fixture-matches-container">
                      {day.matches.map((fx) => {
                        const team1Name = fx.team_first_name || `Team ${fx.team_first}`
                        const team2Name = fx.team_second_name || `Team ${fx.team_second}`
                        const status = getStatusLabel(fx)
                        const isCompleted =
                          status === 'COMPLETED' || status === 'DRAWN' || status === 'ABANDONED'
                        const winnerIsTeam1 =
                          isCompleted &&
                          fx.winner_team &&
                          String(fx.winner_team) === String(fx.team_first)
                        const winnerIsTeam2 =
                          isCompleted &&
                          fx.winner_team &&
                          String(fx.winner_team) === String(fx.team_second)

                        return (
                          <div
                            key={fx.id}
                            className="fixture-match-row"
                            onClick={() => setActiveModal(fx)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Logos column — two logos side by side */}
                            <div className="fixture-logos-col">
                              <TeamLogo
                                name={team1Name}
                                logoUrl={fx.team_first_logo}
                                color={fx.team_first_color}
                                size={62}
                              />
                              <span className="fixture-mobile-vs">VS</span>
                              <TeamLogo
                                name={team2Name}
                                logoUrl={fx.team_second_logo}
                                color={fx.team_second_color}
                                size={62}
                              />
                            </div>

                            {/* Center: meta pill + stacked team names */}
                            <div className="fixture-main-info">
                              {/* Meta row: venue • city */}
                              <div className="fixture-meta-pill">
                                {fx.venue_name && (
                                  <>
                                    <span className="meta-stage-tag">{fx.venue_name}</span>
                                    {fx.city_name && <span className="meta-dot">•</span>}
                                  </>
                                )}
                                {fx.city_name && (
                                  <span className="meta-venue">{fx.city_name}</span>
                                )}
                              </div>

                              {/* Team names — desktop only (hidden on mobile via CSS) */}
                              <div className="fixture-teams-stacked">
                                <div className={`team-row-item${winnerIsTeam1 ? ' winner-team' : ''}`}>
                                  {team1Name}
                                  {winnerIsTeam1 && <span className="winner-badge"> 🏆</span>}
                                </div>
                                <div className="team-row-item vs-row">
                                  <span className="vs-label">VS </span>
                                  <span className={`team-name-val${winnerIsTeam2 ? ' winner-team' : ''}`}>
                                    {team2Name}
                                    {winnerIsTeam2 && <span className="winner-badge"> 🏆</span>}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Score / result column */}
                            <div className="fixture-score-col">
                              {isCompleted ? (
                                <>
                                  {fx.team_first_points_earned != null &&
                                    fx.team_second_points_earned != null ? (
                                    <span
                                      className="score-live-val"
                                      style={{ color: '#f8c800' }}
                                    >
                                      {fx.team_first_points_earned}
                                      {' – '}
                                      {fx.team_second_points_earned}
                                    </span>
                                  ) : null}
                                  <span className="upcoming-status-text">
                                    {status === 'DRAWN'
                                      ? 'DRAW'
                                      : status === 'ABANDONED'
                                        ? 'ABANDONED'
                                        : 'FINAL'}
                                  </span>
                                </>
                              ) : (
                                <span className="score-tbp-val">TO BE PLAYED</span>
                              )}
                            </div>

                            {/* Status / streaming column */}
                            <div className="fixture-actions-col">
                              {status === 'UPCOMING' ? (
                                <span className="score-tbp-val">UPCOMING</span>
                              ) : (
                                <span className={`fixture-status-pill fixture-status-pill--${status.toLowerCase()}`}>
                                  {status === 'DRAWN'
                                    ? 'Draw'
                                    : status === 'ABANDONED'
                                      ? 'Abandoned'
                                      : 'Completed'}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* ── MATCH DETAIL MODAL ────────────────────────────── */}
      {activeModal && (() => {
        const fx = activeModal
        const team1Name = fx.team_first_name || `Team ${fx.team_first}`
        const team2Name = fx.team_second_name || `Team ${fx.team_second}`
        const parsed = parseMatchDate(fx.match_date)
        const status = getStatusLabel(fx)
        const isCompleted = status !== 'UPCOMING'
        const winnerIsTeam1 =
          isCompleted && fx.winner_team && String(fx.winner_team) === String(fx.team_first)
        const winnerIsTeam2 =
          isCompleted && fx.winner_team && String(fx.winner_team) === String(fx.team_second)

        return (
          <div className="match-modal-backdrop" onClick={() => setActiveModal(null)}>
            <div className="match-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-stage-badge">
                  {status === 'UPCOMING'
                    ? 'Scheduled'
                    : status === 'DRAWN'
                      ? 'Draw'
                      : status === 'ABANDONED'
                        ? 'Abandoned'
                        : 'Completed'}
                </span>
                <h3 className="modal-title">
                  {team1Name} vs {team2Name}
                </h3>
                <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {/* Teams display */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    margin: '1rem 0 1.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <TeamLogo
                      name={team1Name}
                      logoUrl={fx.team_first_logo}
                      color={fx.team_first_color}
                      size={56}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: winnerIsTeam1 ? '#f8c800' : '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {team1Name} {winnerIsTeam1 ? '🏆' : ''}
                    </span>
                    {isCompleted && fx.team_first_points_earned != null && (
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          color: winnerIsTeam1 ? '#f8c800' : '#aaa',
                        }}
                      >
                        {fx.team_first_points_earned}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    VS
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <TeamLogo
                      name={team2Name}
                      logoUrl={fx.team_second_logo}
                      color={fx.team_second_color}
                      size={56}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: winnerIsTeam2 ? '#f8c800' : '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {team2Name} {winnerIsTeam2 ? '🏆' : ''}
                    </span>
                    {isCompleted && fx.team_second_points_earned != null && (
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          color: winnerIsTeam2 ? '#f8c800' : '#aaa',
                        }}
                      >
                        {fx.team_second_points_earned}
                      </span>
                    )}
                  </div>
                </div>

                <div className="modal-info-row">
                  <strong>Date:</strong> {parsed.dayName} {parsed.dayNum} {parsed.month}{' '}
                  {parsed.year}
                </div>
                {fx.venue_name && (
                  <div className="modal-info-row">
                    <strong>Venue:</strong> {fx.venue_name}
                  </div>
                )}
                {fx.city_name && (
                  <div className="modal-info-row">
                    <strong>City:</strong> {fx.city_name}
                  </div>
                )}
                <div className="modal-info-row">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`fixture-status-pill fixture-status-pill--${status.toLowerCase()}`}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {status}
                  </span>
                </div>

                {!isCompleted && (
                  <div className="modal-actions-row">
                    <a
                      href="#contact-us"
                      className="modal-btn-gold"
                      onClick={() => setActiveModal(null)}
                    >
                      Ticket &amp; Hospitality Inquiries
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
