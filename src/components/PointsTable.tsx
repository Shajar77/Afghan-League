import { useState } from 'react'
import londonSpiritLogo from '../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../assets/sunrisers-leeds.svg'
import welshFireLogo from '../assets/welsh-fire-white.svg'
import southernBraveLogo from '../assets/southern-brave-alt.svg'
import './PointsTable.css'

interface TeamMeta {
  name: string
  logo: string
  invertLogo?: boolean
}

const teamsMeta: Record<string, TeamMeta> = {
  'Kabul Knights': { name: 'Kabul Knights', logo: londonSpiritLogo, invertLogo: true },
  'Kandahar Kings': { name: 'Kandahar Kings', logo: birminghamPhoenixLogo },
  'Balkh Legends': { name: 'Balkh Legends', logo: manchesterSuperGiantsLogo },
  'Paktia Panthers': { name: 'Paktia Panthers', logo: sunrisersLeedsLogo },
  'Amo Sharks': { name: 'Amo Sharks', logo: welshFireLogo, invertLogo: true },
  'Band-e-Amir Dragons': { name: 'Band-e-Amir Dragons', logo: southernBraveLogo },
}

interface TeamStanding {
  pos: number
  teamName: string
  played: number
  won: number
  lost: number
  tied: number
  noResult: number
  nrr: string
  pts: number
  top: boolean
}

const mockStandings: TeamStanding[] = [
  { pos: 1, teamName: 'Kabul Knights', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: true },
  { pos: 2, teamName: 'Kandahar Kings', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: true },
  { pos: 3, teamName: 'Balkh Legends', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: true },
  { pos: 4, teamName: 'Paktia Panthers', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: true },
  { pos: 5, teamName: 'Amo Sharks', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: false },
  { pos: 6, teamName: 'Band-e-Amir Dragons', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, nrr: '+0.000', pts: 0, top: false },
]

export function PointsTable() {
  const [standings] = useState<TeamStanding[]>(mockStandings)

  return (
    <div className="points-table-page">
      {/* ── HERO BANNER ── */}
      <section className="points-hero">
        <div className="points-hero-bg-grid" />
        <div className="points-hero-glow" />

        <div className="points-hero-top-row">
          <div className="points-hero-title-wrap">
            <span className="points-live-badge">APL 2026 STANDINGS</span>
            <h1 className="points-main-title">POINTS TABLE<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* ── POINTS TABLE CONTAINER ── */}
      <section className="points-table-section">
        <div className="points-table-wrapper">
          <table className="points-table">
            <thead>
              <tr>
                <th className="pt-rank">POS</th>
                <th className="pt-club">TEAM</th>
                <th className="pt-col-pld" title="Matches Played">PLD</th>
                <th className="pt-col-won" title="Won">WON</th>
                <th className="pt-col-lost" title="Lost">LOST</th>
                <th className="pt-col-tied" title="Tied">TIED</th>
                <th className="pt-col-nr" title="No Result">N/R</th>
                <th className="pt-col-nrr" title="Net Run Rate">NRR</th>
                <th className="pt-pts" title="Points">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => {
                const meta = teamsMeta[row.teamName] || { name: row.teamName, logo: '' }
                return (
                  <tr key={row.teamName} className={`pt-row ${row.top ? 'pt-row-top' : 'pt-row-lower'}`}>
                    <td className={`pt-rank-cell ${row.top ? 'pt-rank-gold' : 'pt-rank-blue'}`}>
                      {row.pos}
                    </td>
                    <td className="pt-club-cell">
                      <img 
                        src={meta.logo} 
                        alt={`${meta.name} Logo`} 
                        className={`pt-team-logo ${meta.invertLogo ? 'logo-invert-dark' : ''}`} 
                      />
                      <span className="pt-team-name">{meta.name}</span>
                    </td>
                    <td className="pt-stat pt-col-pld">{row.played}</td>
                    <td className="pt-stat pt-stat-w pt-col-won">{row.won}</td>
                    <td className="pt-stat pt-stat-l pt-col-lost">{row.lost}</td>
                    <td className="pt-stat pt-col-tied">{row.tied}</td>
                    <td className="pt-stat pt-col-nr">{row.noResult}</td>
                    <td className="pt-stat pt-nrr pt-col-nrr">
                      {row.nrr}
                    </td>
                    <td className="pt-pts-cell">{row.pts}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SECTION DIVIDER ── */}
      <div className="section-divider-line"></div>

      {/* ── POINTS RULES SECTION ── */}
      <section className="points-rules-section">
        <div className="rules-inner">
          <h2 className="rules-section-title">HOW POINTS SYSTEM WORKS</h2>
          <p className="rules-section-subtitle">Official scoring criteria, Net Run Rate calculations, and standings tiebreaker progression rules.</p>

          {/* ── POINTS ALLOCATION STATS ROW (from home page) ── */}
          <div className="stats-container" style={{ marginTop: '2.5rem', marginBottom: '3.5rem' }}>
            <div className="stat-card">
              <div className="stat-value">2 <span className="stat-value-unit">PTS</span></div>
              <div className="stat-divider"></div>
              <div className="stat-label">WIN</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0 <span className="stat-value-unit">PTS</span></div>
              <div className="stat-divider"></div>
              <div className="stat-label">LOSE</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1 <span className="stat-value-unit">PT</span></div>
              <div className="stat-divider"></div>
              <div className="stat-label">DRAW</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0 <span className="stat-value-unit">PTS</span></div>
              <div className="stat-divider"></div>
              <div className="stat-label">NO RESULT</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
