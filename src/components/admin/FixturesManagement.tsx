import { useState, useEffect, useCallback } from 'react'
import { buildApiUrl, authFetch } from '../../config/api'
import {
  Calendar,
  MapPin,
  Trophy,
  Plus,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  Shield,
  Flag,
  Clock,
  RefreshCw
} from 'lucide-react'
import './FixturesManagement.css'

interface Team {
  id: number | string
  name: string
  logo_url?: string
  primary_color?: string
  city?: string
}

interface City {
  id: number | string
  name: string
}

interface Venue {
  id: number | string
  name: string
  city_id?: number | string
}

interface Fixture {
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
  city_id?: number | string
  city_name?: string
  venue_id?: number | string
  venue_name?: string
  match_status?: 'scheduled' | 'completed' | 'drawn' | 'abandoned'
  winner_team?: number | string | null
  team_first_points_earned?: number | null
  team_second_points_earned?: number | null
}

interface FixturesManagementProps {
  onLogout?: () => void
}

function getTeamName(fixture: Fixture, side: 'first' | 'second', teams: Team[]): string {
  const id = side === 'first' ? fixture.team_first : fixture.team_second
  const name = side === 'first' ? fixture.team_first_name : fixture.team_second_name
  if (name) return name
  const t = teams.find(t => String(t.id) === String(id))
  return t?.name || `Team ${id}`
}

function TeamLogo({
  name,
  logoUrl,
  color,
  size = 36,
  showInitials = true
}: {
  name: string
  logoUrl?: string
  color?: string
  size?: number
  showInitials?: boolean
}) {
  const [err, setErr] = useState(false)
  const initials = showInitials ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : ''
  const bg = color || '#0575E6'

  if (logoUrl && !err) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${bg}18`, border: `2px solid ${bg}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
      fontWeight: 800, fontSize: size * 0.36, color: bg, flexShrink: 0
    }}>
      {showInitials ? initials : null}
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function parseMatchDate(dateStr: string) {
  if (!dateStr) return { dayName: 'TBD', dayNum: '--', month: 'TBD' }
  try {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const monthIdx = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, monthIdx, day)
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
      const dayNum = String(day).padStart(2, '0')
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      return { dayName, dayNum, month }
    }
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return { dayName: 'TBD', dayNum: '--', month: 'TBD' }
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const dayNum = String(d.getDate()).padStart(2, '0')
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    return { dayName, dayNum, month }
  } catch {
    return { dayName: 'TBD', dayNum: '--', month: 'TBD' }
  }
}

export function FixturesManagement({ onLogout }: FixturesManagementProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])

  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingVenues, setIsLoadingVenues] = useState(false)
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [view, setView] = useState<'list' | 'create'>('list')
  const [resultModal, setResultModal] = useState<Fixture | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [form, setForm] = useState({
    team_first: '',
    team_second: '',
    match_date: '',
    city_id: '',
    venue_id: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [resultForm, setResultForm] = useState({
    winner_team: '',
    match_status: 'completed',
    team_first_points_earned: '',
    team_second_points_earned: ''
  })
  const [resultErrors, setResultErrors] = useState<Record<string, string>>({})

  const loadTeams = useCallback(async () => {
    setIsLoadingTeams(true)
    try {
      const res = await authFetch(buildApiUrl('/teams'))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setError('Failed to load teams.'); return }
      const json = await res.json()
      let list: Team[] = []
      if (Array.isArray(json)) list = json
      else if (Array.isArray(json.data?.teams)) list = json.data.teams
      else if (Array.isArray(json.data)) list = json.data
      else if (Array.isArray(json.teams)) list = json.teams
      setTeams(Array.isArray(list) ? list : [])
    } catch {
      setError('Failed to load teams.')
    } finally {
      setIsLoadingTeams(false)
    }
  }, [onLogout])

  const loadCities = useCallback(async () => {
    setIsLoadingCities(true)
    try {
      const res = await authFetch(buildApiUrl('/cities'))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setError('Failed to load cities.'); return }
      const json = await res.json()
      let list: City[] = []
      if (Array.isArray(json)) list = json
      else if (Array.isArray(json.data?.cities)) list = json.data.cities
      else if (Array.isArray(json.data)) list = json.data
      else if (Array.isArray(json.cities)) list = json.cities
      setCities(Array.isArray(list) ? list : [])
    } catch {
      setError('Failed to load cities.')
    } finally {
      setIsLoadingCities(false)
    }
  }, [onLogout])

  const loadVenues = useCallback(async (cityId: string) => {
    if (!cityId) { setVenues([]); return }
    setIsLoadingVenues(true)
    try {
      const res = await authFetch(buildApiUrl(`/venues/${cityId}`))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setVenues([]); return }
      const json = await res.json()
      let list: Venue[] = []
      if (Array.isArray(json)) {
        list = json
      } else if (Array.isArray(json.data)) {
        list = json.data
      } else if (Array.isArray(json.data?.venues)) {
        list = json.data.venues
      } else if (Array.isArray(json.venues)) {
        list = json.venues
      } else if (json.data && typeof json.data === 'object' && 'id' in json.data) {
        // Backend returns single venue object for a city e.g. { success: true, data: { id: 1, name: "...", city_id: 1 } }
        list = [json.data as Venue]
      }
      setVenues(Array.isArray(list) ? list : [])
    } catch {
      setVenues([])
    } finally {
      setIsLoadingVenues(false)
    }
  }, [onLogout])

  const loadFixtures = useCallback(async () => {
    setIsLoadingFixtures(true)
    try {
      const res = await authFetch(buildApiUrl('/fixtures'))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { setError('Failed to load fixtures.'); return }
      const json = await res.json()
      let list: Fixture[] = []
      if (Array.isArray(json)) list = json
      else if (Array.isArray(json.data?.fixtures)) list = json.data.fixtures
      else if (Array.isArray(json.data)) list = json.data
      else if (Array.isArray(json.fixtures)) list = json.fixtures
      setFixtures(Array.isArray(list) ? list : [])
    } catch {
      setError('Failed to load fixtures.')
    } finally {
      setIsLoadingFixtures(false)
    }
  }, [onLogout])

  useEffect(() => {
    loadTeams()
    loadCities()
    loadFixtures()
  }, [loadTeams, loadCities, loadFixtures])

  useEffect(() => {
    if (form.city_id) {
      loadVenues(form.city_id)
      setForm(prev => ({ ...prev, venue_id: '' }))
    } else {
      setVenues([])
    }
  }, [form.city_id, loadVenues])

  function validateForm(): boolean {
    const errs: Record<string, string> = {}
    if (!form.team_first) errs.team_first = 'Please select Team 1'
    if (!form.team_second) errs.team_second = 'Please select Team 2'
    if (form.team_first && form.team_second && form.team_first === form.team_second) {
      errs.team_second = 'Team 1 and Team 2 cannot be the same'
    }
    if (!form.match_date) errs.match_date = 'Please select a match date'
    if (!form.city_id) errs.city_id = 'Please select a city'
    if (!form.venue_id) errs.venue_id = 'Please select a venue'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    setIsCreating(true)
    setError(null)
    try {
      const res = await authFetch(buildApiUrl('/fixtures'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_first: Number(form.team_first),
          team_second: Number(form.team_second),
          match_date: form.match_date,
          city_id: Number(form.city_id),
          venue_id: Number(form.venue_id)
        })
      })
      if (res.status === 401 && onLogout) { onLogout(); return }
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || json.error?.message || 'Failed to create fixture.')
      showSuccess('Fixture created successfully!')
      setForm({ team_first: '', team_second: '', match_date: '', city_id: '', venue_id: '' })
      setFormErrors({})
      setView('list')
      await loadFixtures()
    } catch (err: any) {
      setError(err.message || 'Failed to create fixture.')
    } finally {
      setIsCreating(false)
    }
  }

  function openResultModal(fixture: Fixture) {
    setResultModal(fixture)
    const initialStatus = fixture.match_status && fixture.match_status !== 'scheduled' ? fixture.match_status : 'completed'
    let winner = fixture.winner_team ? String(fixture.winner_team) : ''
    let p1 = fixture.team_first_points_earned != null ? String(fixture.team_first_points_earned) : ''
    let p2 = fixture.team_second_points_earned != null ? String(fixture.team_second_points_earned) : ''

    // Automatically assign points based on status & winner if not already saved
    if (p1 === '' || p2 === '') {
      if (initialStatus === 'drawn') {
        p1 = '1'
        p2 = '1'
        winner = ''
      } else if (initialStatus === 'abandoned') {
        p1 = '0'
        p2 = '0'
        winner = ''
      } else {
        // completed: default winner to team 1, winner gets 3, loser gets 0
        winner = winner || String(fixture.team_first)
        const isTeam1 = String(winner) === String(fixture.team_first)
        p1 = isTeam1 ? '3' : '0'
        p2 = isTeam1 ? '0' : '3'
      }
    }

    setResultForm({
      winner_team: winner,
      match_status: initialStatus,
      team_first_points_earned: p1,
      team_second_points_earned: p2
    })
    setResultErrors({})
  }

  function handleWinnerSelect(winnerId: number | string) {
    if (!resultModal) return
    const isTeam1 = String(winnerId) === String(resultModal.team_first)
    setResultForm(p => ({
      ...p,
      winner_team: String(winnerId),
      team_first_points_earned: isTeam1 ? '3' : '0',
      team_second_points_earned: isTeam1 ? '0' : '3'
    }))
    setResultErrors(errs => {
      const copy = { ...errs }
      delete copy.winner_team
      delete copy.team_first_points_earned
      delete copy.team_second_points_earned
      return copy
    })
  }

  function handleStatusChange(status: string) {
    if (!resultModal) return
    if (status === 'drawn') {
      setResultForm(prev => ({
        ...prev,
        match_status: status,
        winner_team: '',
        team_first_points_earned: '1',
        team_second_points_earned: '1'
      }))
    } else if (status === 'abandoned') {
      setResultForm(prev => ({
        ...prev,
        match_status: status,
        winner_team: '',
        team_first_points_earned: '0',
        team_second_points_earned: '0'
      }))
    } else if (status === 'completed') {
      const winnerId = resultForm.winner_team || String(resultModal.team_first)
      const isTeam1 = String(winnerId) === String(resultModal.team_first)
      setResultForm(prev => ({
        ...prev,
        match_status: status,
        winner_team: winnerId,
        team_first_points_earned: isTeam1 ? '3' : '0',
        team_second_points_earned: isTeam1 ? '0' : '3'
      }))
    }
    setResultErrors(errs => {
      const copy = { ...errs }
      delete copy.match_status
      return copy
    })
  }

  function validateResult(): boolean {
    const errs: Record<string, string> = {}
    if (!resultForm.match_status) errs.match_status = 'Please select a match status'
    if (resultForm.match_status === 'completed' && !resultForm.winner_team) {
      errs.winner_team = 'Please select the winner'
    }
    if (resultForm.team_first_points_earned === '') errs.team_first_points_earned = 'Required'
    if (resultForm.team_second_points_earned === '') errs.team_second_points_earned = 'Required'
    setResultErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleUpdateResult(e: React.FormEvent) {
    e.preventDefault()
    if (!resultModal || !validateResult()) return
    setIsUpdating(true)
    setError(null)
    try {
      const body: Record<string, unknown> = {
        match_status: resultForm.match_status,
        team_first_points_earned: Number(resultForm.team_first_points_earned),
        team_second_points_earned: Number(resultForm.team_second_points_earned)
      }
      if (resultForm.winner_team) {
        body.winner_team = Number(resultForm.winner_team)
      }
      const res = await authFetch(buildApiUrl(`/fixtures/${resultModal.id}/results`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.status === 401 && onLogout) { onLogout(); return }
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || json.error?.message || 'Failed to update result.')
      showSuccess('Match result updated!')
      setResultModal(null)
      await loadFixtures()
    } catch (err: any) {
      setError(err.message || 'Failed to update result.')
    } finally {
      setIsUpdating(false)
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  const scheduled = (Array.isArray(fixtures) ? fixtures : []).filter(f => !f.match_status || f.match_status === 'scheduled')
  const completed = (Array.isArray(fixtures) ? fixtures : []).filter(f => f.match_status && f.match_status !== 'scheduled')

  return (
    <div className="apl-fx-wrapper animate-fade-in">

      {successMsg && (
        <div className="apl-fx-toast apl-fx-toast--success">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="apl-fx-toast apl-fx-toast--error">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="apl-fx-toast-close">
            <X size={14} />
          </button>
        </div>
      )}

      <header className="apl-ts-header">
        <div className="apl-ts-title-wrap">
          <h1 className="apl-ts-title">
            FIXTURE <span className="gold-text">SCHEDULE</span>
          </h1>
          <p className="apl-ts-sub">Schedule matches, update results and track the points table</p>
        </div>

        <div className="apl-fx-view-controls">
          <button
            type="button"
            className={`apl-fx-view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => { setView('list'); setFormErrors({}) }}
          >
            <Calendar size={15} />
            All Fixtures
          </button>
          <div className="apl-ts-tab-divider" />
          <button
            type="button"
            className={`apl-fx-view-btn ${view === 'create' ? 'active' : ''}`}
            onClick={() => setView('create')}
          >
            <Plus size={15} />
            Create Fixture
          </button>
        </div>
      </header>

      {view === 'create' && (
        <div className="apl-fx-form-card">
          <div className="apl-fx-form-card-header">
            <Plus size={20} style={{ color: '#F8C800' }} />
            <div>
              <h2 className="apl-fx-form-title">Schedule a New Match</h2>
              <p className="apl-fx-form-sub">Fill in the match details to create a fixture</p>
            </div>
          </div>

          <form onSubmit={handleCreate} noValidate>
            <div className="apl-fx-form-grid">

              <div className="apl-fx-field">
                <label className="apl-fx-label">
                  <Shield size={13} /> Team 1
                </label>
                <div className="apl-fx-select-wrap">
                  <select
                    className={`apl-fx-select ${formErrors.team_first ? 'error' : ''}`}
                    value={form.team_first}
                    onChange={e => setForm(p => ({ ...p, team_first: e.target.value }))}
                    disabled={isLoadingTeams}
                  >
                    <option value="">Select Team 1...</option>
                    {(Array.isArray(teams) ? teams : []).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="apl-fx-select-icon" />
                </div>
                {formErrors.team_first && <span className="apl-fx-field-error">{formErrors.team_first}</span>}
              </div>

              <div className="apl-fx-field">
                <label className="apl-fx-label">
                  <Shield size={13} /> Team 2
                </label>
                <div className="apl-fx-select-wrap">
                  <select
                    className={`apl-fx-select ${formErrors.team_second ? 'error' : ''}`}
                    value={form.team_second}
                    onChange={e => setForm(p => ({ ...p, team_second: e.target.value }))}
                    disabled={isLoadingTeams}
                  >
                    <option value="">Select Team 2...</option>
                    {(Array.isArray(teams) ? teams : []).map(t => (
                      <option key={t.id} value={t.id} disabled={String(t.id) === form.team_first}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="apl-fx-select-icon" />
                </div>
                {formErrors.team_second && <span className="apl-fx-field-error">{formErrors.team_second}</span>}
              </div>

              <div className="apl-fx-field">
                <label className="apl-fx-label">
                  <Calendar size={13} /> Match Date
                </label>
                <input
                  type="date"
                  className={`apl-fx-input ${formErrors.match_date ? 'error' : ''}`}
                  value={form.match_date}
                  onChange={e => setForm(p => ({ ...p, match_date: e.target.value }))}
                />
                {formErrors.match_date && <span className="apl-fx-field-error">{formErrors.match_date}</span>}
              </div>

              <div className="apl-fx-field">
                <label className="apl-fx-label">
                  <MapPin size={13} /> City
                </label>
                <div className="apl-fx-select-wrap">
                  <select
                    className={`apl-fx-select ${formErrors.city_id ? 'error' : ''}`}
                    value={form.city_id}
                    onChange={e => setForm(p => ({ ...p, city_id: e.target.value }))}
                    disabled={isLoadingCities}
                  >
                    <option value="">Select City...</option>
                    {(Array.isArray(cities) ? cities : []).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="apl-fx-select-icon" />
                </div>
                {formErrors.city_id && <span className="apl-fx-field-error">{formErrors.city_id}</span>}
              </div>

              <div className="apl-fx-field">
                <label className="apl-fx-label">
                  <MapPin size={13} /> Venue
                  {isLoadingVenues && <Loader2 size={12} className="animate-spin" style={{ marginLeft: 4 }} />}
                </label>
                <div className="apl-fx-select-wrap">
                  <select
                    className={`apl-fx-select ${formErrors.venue_id ? 'error' : ''}`}
                    value={form.venue_id}
                    onChange={e => setForm(p => ({ ...p, venue_id: e.target.value }))}
                    disabled={!form.city_id || isLoadingVenues}
                  >
                    <option value="">
                      {!form.city_id ? 'Select a city first...' : isLoadingVenues ? 'Loading venues...' : 'Select Venue...'}
                    </option>
                    {(Array.isArray(venues) ? venues : []).map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="apl-fx-select-icon" />
                </div>
                {formErrors.venue_id && <span className="apl-fx-field-error">{formErrors.venue_id}</span>}
              </div>

            </div>

            {form.team_first && form.team_second && form.team_first !== form.team_second && (
              <div className="apl-fx-preview">
                {(() => {
                  const t1 = (Array.isArray(teams) ? teams : []).find(t => String(t.id) === form.team_first)
                  const t2 = (Array.isArray(teams) ? teams : []).find(t => String(t.id) === form.team_second)
                  const venue = (Array.isArray(venues) ? venues : []).find(v => String(v.id) === form.venue_id)
                  const city = (Array.isArray(cities) ? cities : []).find(c => String(c.id) === form.city_id)
                  return (
                    <>
                      <div className="apl-fx-preview-matchup">
                        {t1 && <TeamLogo name={t1.name} color={t1.primary_color} size={40} />}
                        <div className="apl-fx-preview-vs">
                          <span className="apl-fx-preview-team">{t1?.name || '—'}</span>
                          <span className="apl-fx-vs-badge">VS</span>
                          <span className="apl-fx-preview-team">{t2?.name || '—'}</span>
                        </div>
                        {t2 && <TeamLogo name={t2.name} color={t2.primary_color} size={40} />}
                      </div>
                      {(form.match_date || city || venue) && (
                        <div className="apl-fx-preview-meta">
                          {form.match_date && <span><Calendar size={12} /> {formatDate(form.match_date)}</span>}
                          {city && <span><MapPin size={12} /> {city.name}</span>}
                          {venue && <span><MapPin size={12} /> {venue.name}</span>}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            <div className="apl-fx-form-actions">
              <button
                type="button"
                className="apl-fx-btn-secondary"
                onClick={() => { setView('list'); setFormErrors({}) }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="apl-fx-btn-primary"
                disabled={isCreating}
              >
                {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {isCreating ? 'Creating...' : 'Create Fixture'}
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="apl-fx-list-section">

          {isLoadingFixtures ? (
            <div className="apl-fx-loading-state">
              <Loader2 size={28} className="animate-spin" style={{ color: '#F8C800' }} />
              <span>Loading fixtures...</span>
            </div>
          ) : fixtures.length === 0 ? (
            <div className="apl-fx-empty-state">
              <Calendar size={48} style={{ opacity: 0.25, marginBottom: '1rem' }} />
              <p>No fixtures scheduled yet.</p>
              <button
                type="button"
                className="apl-fx-btn-primary"
                onClick={() => setView('create')}
              >
                <Plus size={14} /> Create First Fixture
              </button>
            </div>
          ) : (
            <>
              {scheduled.length > 0 && (
                <div className="apl-fx-group">
                  <div className="apl-fx-group-header">
                    <h3 className="apl-fx-group-title">
                      <Clock size={16} /> Upcoming Fixtures
                    </h3>
                    <div className="apl-fx-group-meta">
                      <div className="apl-fx-counts-inline">
                        <span className="apl-fx-count-chip">
                          <Clock size={13} />
                          {scheduled.length} Scheduled
                        </span>
                        <span className="apl-fx-count-dot">•</span>
                        <span className="apl-fx-count-chip">
                          <Trophy size={13} />
                          {completed.length} Completed
                        </span>
                      </div>
                      <button
                        type="button"
                        className="apl-fx-refresh-btn"
                        onClick={loadFixtures}
                        disabled={isLoadingFixtures}
                        title="Refresh fixtures"
                      >
                        <RefreshCw size={13} className={isLoadingFixtures ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                  <div className="apl-fx-cards">
                    {scheduled.map(fx => (
                      <FixtureCard
                        key={fx.id}
                        fixture={fx}
                        teams={teams}
                        cities={cities}
                        venues={venues}
                        onEnterResult={() => openResultModal(fx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completed.length > 0 && (
                <div className="apl-fx-group">
                  <div className="apl-fx-group-header">
                    <h3 className="apl-fx-group-title">
                      <Trophy size={16} /> Results
                    </h3>
                    {scheduled.length === 0 && (
                      <div className="apl-fx-group-meta">
                        <div className="apl-fx-counts-inline">
                          <span className="apl-fx-count-chip">
                            <Clock size={13} />
                            0 Scheduled
                          </span>
                          <span className="apl-fx-count-dot">•</span>
                          <span className="apl-fx-count-chip">
                            <Trophy size={13} />
                            {completed.length} Completed
                          </span>
                        </div>
                        <button
                          type="button"
                          className="apl-fx-refresh-btn"
                          onClick={loadFixtures}
                          disabled={isLoadingFixtures}
                          title="Refresh fixtures"
                        >
                          <RefreshCw size={13} className={isLoadingFixtures ? 'animate-spin' : ''} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="apl-fx-cards">
                    {completed.map(fx => (
                      <FixtureCard
                        key={fx.id}
                        fixture={fx}
                        teams={teams}
                        cities={cities}
                        venues={venues}
                        onEnterResult={() => openResultModal(fx)}
                        showResult
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {resultModal && (
        <div className="apl-fx-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setResultModal(null) }}>
          <div className="apl-fx-modal animate-fade-in">
            <div className="apl-fx-modal-header">
              <div>
                <h2 className="apl-fx-modal-title">
                  <Edit3 size={18} style={{ color: '#F8C800' }} />
                  Update Match Result
                </h2>
                <p className="apl-fx-modal-sub">
                  {getTeamName(resultModal, 'first', teams)} vs {getTeamName(resultModal, 'second', teams)}
                  <span style={{ opacity: 0.5, marginLeft: 8 }}>· {formatDate(resultModal.match_date)}</span>
                </p>
              </div>
              <button type="button" className="apl-fx-modal-close" onClick={() => setResultModal(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateResult} noValidate className="apl-fx-result-form">

              <div className="apl-fx-field">
                <label className="apl-fx-label"><Flag size={13} /> Match Status</label>
                <div className="apl-fx-status-pills">
                  {(['completed', 'drawn', 'abandoned'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`apl-fx-status-pill ${resultForm.match_status === s ? 'active' : ''} apl-fx-status-pill--${s}`}
                      onClick={() => handleStatusChange(s)}
                    >
                      {s === 'completed' && <Trophy size={13} />}
                      {s === 'drawn' && <Flag size={13} />}
                      {s === 'abandoned' && <X size={13} />}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                {resultErrors.match_status && <span className="apl-fx-field-error">{resultErrors.match_status}</span>}
              </div>

              {resultForm.match_status === 'completed' && (
                <div className="apl-fx-field">
                  <label className="apl-fx-label"><Trophy size={13} /> Winner</label>
                  <div className="apl-fx-winner-pills">
                    {[
                      { id: resultModal.team_first, name: getTeamName(resultModal, 'first', teams) },
                      { id: resultModal.team_second, name: getTeamName(resultModal, 'second', teams) }
                    ].map(team => (
                      <button
                        key={team.id}
                        type="button"
                        className={`apl-fx-winner-pill ${String(resultForm.winner_team) === String(team.id) ? 'active' : ''}`}
                        onClick={() => handleWinnerSelect(team.id)}
                      >
                        <TeamLogo name={team.name} size={24} />
                        {team.name}
                      </button>
                    ))}
                  </div>
                  {resultErrors.winner_team && <span className="apl-fx-field-error">{resultErrors.winner_team}</span>}
                </div>
              )}

              <div className="apl-fx-points-row">
                <div className="apl-fx-field">
                  <label className="apl-fx-label">
                    {getTeamName(resultModal, 'first', teams)} Score / Points
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className={`apl-fx-input ${resultErrors.team_first_points_earned ? 'error' : ''}`}
                    value={resultForm.team_first_points_earned}
                    onChange={e => setResultForm(p => ({ ...p, team_first_points_earned: e.target.value }))}
                    placeholder="0"
                  />
                  {resultErrors.team_first_points_earned && <span className="apl-fx-field-error">{resultErrors.team_first_points_earned}</span>}
                </div>
                <div className="apl-fx-points-divider">pts</div>
                <div className="apl-fx-field">
                  <label className="apl-fx-label">
                    {getTeamName(resultModal, 'second', teams)} Score / Points
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className={`apl-fx-input ${resultErrors.team_second_points_earned ? 'error' : ''}`}
                    value={resultForm.team_second_points_earned}
                    onChange={e => setResultForm(p => ({ ...p, team_second_points_earned: e.target.value }))}
                    placeholder="0"
                  />
                  {resultErrors.team_second_points_earned && <span className="apl-fx-field-error">{resultErrors.team_second_points_earned}</span>}
                </div>
              </div>

              <p className="apl-fx-points-hint">
                Automatically calculated: Win = <strong>3 pts</strong>, Loss = <strong>0 pts</strong> · Draw = <strong>1 pt each</strong> · Abandoned = <strong>0 pts each</strong>
              </p>

              <div className="apl-fx-form-actions">
                <button type="button" className="apl-fx-btn-secondary" onClick={() => setResultModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="apl-fx-btn-primary" disabled={isUpdating}>
                  {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {isUpdating ? 'Saving...' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FixtureCard({
  fixture,
  teams,
  cities = [],
  venues = [],
  onEnterResult,
  showResult = false
}: {
  fixture: Fixture
  teams: Team[]
  cities?: City[]
  venues?: Venue[]
  onEnterResult: () => void
  showResult?: boolean
}) {
  const t1Name = getTeamName(fixture, 'first', teams)
  const t2Name = getTeamName(fixture, 'second', teams)
  const t1 = (Array.isArray(teams) ? teams : []).find(t => String(t.id) === String(fixture.team_first))
  const t2 = (Array.isArray(teams) ? teams : []).find(t => String(t.id) === String(fixture.team_second))

  const isT1Winner = fixture.winner_team && String(fixture.winner_team) === String(fixture.team_first)
  const isT2Winner = fixture.winner_team && String(fixture.winner_team) === String(fixture.team_second)
  const winnerName = isT1Winner ? t1Name : isT2Winner ? t2Name : null

  const venueName = fixture.venue_name || (Array.isArray(venues) ? venues : []).find(v => String(v.id) === String(fixture.venue_id))?.name || ''
  const cityName = fixture.city_name || (Array.isArray(cities) ? cities : []).find(c => String(c.id) === String(fixture.city_id))?.name || ''
  const location = [venueName, cityName].filter(Boolean).join(', ')

  const dateParts = parseMatchDate(fixture.match_date)

  return (
    <div className={`apl-fx-match-card ${showResult ? 'is-completed' : ''}`}>
      {/* 1. LEFT: Date Column */}
      <div className="apl-fx-date-col">
        <span className="apl-fx-day-name">{dateParts.dayName}</span>
        <span className="apl-fx-day-num">{dateParts.dayNum}</span>
        <span className="apl-fx-month">{dateParts.month}</span>
      </div>

      {/* 2. RIGHT: Content Wrapper */}
      <div className="apl-fx-content-wrap">
        {/* Top Side Ribbon (only for completed results) */}
        {showResult && (
          <div className="apl-fx-ribbon apl-fx-ribbon--completed">
            <span>
              {winnerName ? `🏆 ${winnerName} WON` : fixture.match_status === 'drawn' ? '🤝 DRAW' : 'COMPLETED'}
            </span>
          </div>
        )}

        {/* LOGOS COLUMN */}
        <div className="apl-fx-logos-col">
          <TeamLogo name={t1Name} logoUrl={t1?.logo_url} color={t1?.primary_color} size={48} showInitials={false} />
          <span className="apl-fx-vs-badge-round">VS</span>
          <TeamLogo name={t2Name} logoUrl={t2?.logo_url} color={t2?.primary_color} size={48} showInitials={false} />
        </div>

        {/* CENTER: Main Info with meta & stacked team names */}
        <div className="apl-fx-main-info">
          <div className="apl-fx-meta-pill">
            <span className="apl-fx-meta-stage">GROUP STAGE</span>
            {location && (
              <>
                <span className="apl-fx-meta-dot">•</span>
                <span className="apl-fx-meta-venue">
                  <MapPin size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                  {location}
                </span>
              </>
            )}
          </div>

          <div className="apl-fx-teams-stacked">
            <div className={`apl-fx-team-row ${isT1Winner ? 'is-winner' : ''}`}>
              <span className="apl-fx-team-name-text">{t1Name}</span>
              {isT1Winner && <span className="apl-fx-winner-badge">WINNER</span>}
            </div>
            <div className={`apl-fx-team-row apl-fx-team-row--vs ${isT2Winner ? 'is-winner' : ''}`}>
              <span className="apl-fx-vs-label">VS </span>
              <span className="apl-fx-team-name-text">{t2Name}</span>
              {isT2Winner && <span className="apl-fx-winner-badge">WINNER</span>}
            </div>
          </div>
        </div>

        {/* RIGHT-CENTER: Score / Status Column */}
        <div className="apl-fx-score-col">
          {showResult ? (
            <div className="apl-fx-score-box">
              <span className="apl-fx-score-pts">
                {fixture.team_first_points_earned ?? 0} <span className="apl-fx-score-v">v</span> {fixture.team_second_points_earned ?? 0}
              </span>
              <span className="apl-fx-score-pts-label">POINTS EARNED</span>
            </div>
          ) : (
            <div className="apl-fx-score-box">
              <span className="apl-fx-score-tbp">TO BE PLAYED</span>
              <span className="apl-fx-score-status-tag">SCHEDULED</span>
            </div>
          )}
        </div>

        {/* RIGHT: Actions Column */}
        <div className="apl-fx-actions-col">
          <button
            type="button"
            className="apl-fx-action-btn"
            onClick={onEnterResult}
            title={showResult ? 'Edit result' : 'Enter result'}
          >
            {showResult ? 'Edit Result' : 'Enter Result'}
          </button>
        </div>
      </div>
    </div>
  )
}
