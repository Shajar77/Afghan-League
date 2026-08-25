import { useState, useEffect, useCallback } from 'react'
import { buildApiUrl } from '../../config/api'
import { TeamsTab, type Team } from './TeamsTab'
import { SponsorsTab, type Sponsor } from './SponsorsTab'
import { Plus, Loader2, Check, AlertCircle } from 'lucide-react'
import './TeamSponsorManagement.css'

export type { Team, Sponsor }

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

  // Fetch Teams and Sponsors from API
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const token = localStorage.getItem('apl_admin_token') || ''

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

  return (
    <div className="apl-ts-wrapper animate-fade-in">
      {/* Toast notifications */}
      {successMessage && (
        <div className="apl-ts-toast success animate-slide-down">
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="apl-ts-toast error animate-slide-down">
          <AlertCircle size={18} />
          <span>{error}</span>
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
        <TeamsTab
          teams={teams}
          setTeams={setTeams}
          showTeamModal={showTeamModal}
          setShowTeamModal={setShowTeamModal}
          setSuccessMessage={setSuccessMessage}
          setError={setError}
          onLogout={onLogout}
        />
      ) : (
        <SponsorsTab
          sponsors={sponsors}
          setSponsors={setSponsors}
          showSponsorModal={showSponsorModal}
          setShowSponsorModal={setShowSponsorModal}
          setSuccessMessage={setSuccessMessage}
          setError={setError}
        />
      )}
    </div>
  )
}
