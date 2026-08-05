import { useState } from 'react'
import londonSpiritLogo from '../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../assets/sunrisers-leeds.svg'
import welshFireLogo from '../assets/welsh-fire-white.svg'
import southernBraveLogo from '../assets/southern-brave-alt.svg'
import skySportsLogo from '../assets/sky-sports.svg'
import bbcLogo from '../assets/bbc.svg'
import './FixturesPage.css'

interface TeamMeta {
  name: string
  shortName: string
  logo: string
  color: string
  invertLogo?: boolean
}

const teamsMeta: Record<string, TeamMeta> = {
  'Kabul Knights': { name: 'Kabul Knights', shortName: 'KK', logo: londonSpiritLogo, color: '#2c32aa', invertLogo: true },
  'Kandahar Kings': { name: 'Kandahar Kings', shortName: 'KNK', logo: birminghamPhoenixLogo, color: '#805ad5' },
  'Balkh Legends': { name: 'Balkh Legends', shortName: 'BL', logo: manchesterSuperGiantsLogo, color: '#F8C800' },
  'Paktia Panthers': { name: 'Paktia Panthers', shortName: 'PP', logo: sunrisersLeedsLogo, color: '#e53e3e' },
  'Amo Sharks': { name: 'Amo Sharks', shortName: 'AS', logo: welshFireLogo, color: '#dd6b20', invertLogo: true },
  'Band-e-Amir Dragons': { name: 'Band-e-Amir Dragons', shortName: 'BD', logo: southernBraveLogo, color: '#017a37' },
}

interface MatchFixture {
  id: string
  dayName: string
  dayNum: string
  month: string
  isDoubleHeader?: boolean
  badge?: string
  team1: string
  team2: string
  time: string
  venue: string
  stage: string
  score1?: string
  score2?: string
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED'
  ticketsAvailable: boolean
  broadcasters: string[]
}

const mockFixtures: MatchFixture[] = [
  {
    id: 'f_pre1',
    dayName: 'SATURDAY',
    dayNum: '10',
    month: 'OCTOBER',
    team1: 'Kabul Knights',
    team2: 'Kandahar Kings',
    time: '18:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '162/6',
    score2: '160/9',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f_pre2',
    dayName: 'SUNDAY',
    dayNum: '11',
    month: 'OCTOBER',
    team1: 'Balkh Legends',
    team2: 'Paktia Panthers',
    time: '19:00 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '189/3',
    score2: '190/5',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports'],
  },
  {
    id: 'f_pre3',
    dayName: 'MONDAY',
    dayNum: '12',
    month: 'OCTOBER',
    team1: 'Band-e-Amir Dragons',
    team2: 'Amo Sharks',
    time: '19:00 IST',
    venue: 'Kandahar Cricket Stadium, Kandahar',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '145/8',
    score2: '148/4',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports', 'SuperSport'],
  },
  {
    id: 'f_pre4',
    dayName: 'TUESDAY',
    dayNum: '13',
    month: 'OCTOBER',
    team1: 'Kandahar Kings',
    team2: 'Balkh Legends',
    time: '18:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '202/5',
    score2: '198/7',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f_pre5',
    dayName: 'WEDNESDAY',
    dayNum: '14',
    month: 'OCTOBER',
    team1: 'Paktia Panthers',
    team2: 'Amo Sharks',
    time: '19:00 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '170/6',
    score2: '172/2',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports', 'BBC Sport'],
  },
  {
    id: 'f1',
    dayName: 'THURSDAY',
    dayNum: '15',
    month: 'OCTOBER',
    team1: 'Kabul Knights',
    team2: 'Balkh Legends',
    time: '18:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'COMPLETED',
    score1: '178/4',
    score2: '175/8',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f2',
    dayName: 'FRIDAY',
    dayNum: '16',
    month: 'OCTOBER',
    team1: 'Kandahar Kings',
    team2: 'Paktia Panthers',
    time: '19:00 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'LIVE',
    score1: '235/2',
    score2: '0/0',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'BBC Sport'],
  },
  {
    id: 'f3',
    dayName: 'SATURDAY',
    dayNum: '17',
    month: 'OCTOBER',
    isDoubleHeader: true,
    team1: 'Amo Sharks',
    team2: 'Band-e-Amir Dragons',
    time: '14:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports'],
  },
  {
    id: 'f4',
    dayName: 'SATURDAY',
    dayNum: '17',
    month: 'OCTOBER',
    team1: 'Balkh Legends',
    team2: 'Kandahar Kings',
    time: '19:00 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f5',
    dayName: 'SUNDAY',
    dayNum: '18',
    month: 'OCTOBER',
    team1: 'Paktia Panthers',
    team2: 'Kabul Knights',
    time: '18:30 IST',
    venue: 'Kandahar Cricket Stadium, Kandahar',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports'],
  },
  {
    id: 'f5b',
    dayName: 'MONDAY',
    dayNum: '19',
    month: 'OCTOBER',
    team1: 'Amo Sharks',
    team2: 'Kandahar Kings',
    time: '19:00 IST',
    venue: 'Kandahar Cricket Stadium, Kandahar',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f6',
    dayName: 'TUESDAY',
    dayNum: '20',
    month: 'OCTOBER',
    team1: 'Band-e-Amir Dragons',
    team2: 'Amo Sharks',
    time: '19:00 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: false,
    broadcasters: ['RTA Sports', 'SuperSport'],
  },
  {
    id: 'f7',
    dayName: 'WEDNESDAY',
    dayNum: '21',
    month: 'OCTOBER',
    isDoubleHeader: true,
    team1: 'Kabul Knights',
    team2: 'Amo Sharks',
    time: '14:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports'],
  },
  {
    id: 'f8',
    dayName: 'WEDNESDAY',
    dayNum: '21',
    month: 'OCTOBER',
    team1: 'Balkh Legends',
    team2: 'Paktia Panthers',
    time: '19:00 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f8b',
    dayName: 'THURSDAY',
    dayNum: '22',
    month: 'OCTOBER',
    team1: 'Band-e-Amir Dragons',
    team2: 'Balkh Legends',
    time: '19:00 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports', 'BBC Sport'],
  },
  {
    id: 'f8c',
    dayName: 'FRIDAY',
    dayNum: '23',
    month: 'OCTOBER',
    team1: 'Paktia Panthers',
    team2: 'Amo Sharks',
    time: '18:30 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports'],
  },
  {
    id: 'f8d',
    dayName: 'SATURDAY',
    dayNum: '24',
    month: 'OCTOBER',
    isDoubleHeader: true,
    team1: 'Kabul Knights',
    team2: 'Kandahar Kings',
    time: '14:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'BBC Sport'],
  },
  {
    id: 'f8e',
    dayName: 'SATURDAY',
    dayNum: '24',
    month: 'OCTOBER',
    team1: 'Balkh Legends',
    team2: 'Band-e-Amir Dragons',
    time: '19:00 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f9',
    dayName: 'SUNDAY',
    dayNum: '25',
    month: 'OCTOBER',
    badge: 'ELIMINATOR',
    team1: 'Kabul Knights',
    team2: 'Kandahar Kings',
    time: '18:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Playoffs',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports', 'BBC Sport'],
  },
  {
    id: 'f10',
    dayName: 'TUESDAY',
    dayNum: '27',
    month: 'OCTOBER',
    badge: 'QUALIFIER',
    team1: 'Balkh Legends',
    team2: 'Band-e-Amir Dragons',
    time: '19:00 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Playoffs',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f8f',
    dayName: 'MONDAY',
    dayNum: '26',
    month: 'OCTOBER',
    team1: 'Paktia Panthers',
    team2: 'Band-e-Amir Dragons',
    time: '19:00 IST',
    venue: 'Kandahar Cricket Stadium, Kandahar',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports'],
  },
  {
    id: 'f8g',
    dayName: 'WEDNESDAY',
    dayNum: '28',
    month: 'OCTOBER',
    team1: 'Amo Sharks',
    team2: 'Balkh Legends',
    time: '19:00 IST',
    venue: 'Ghazi Amanullah Stadium, Jalalabad',
    stage: 'Group Stage',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'BBC Sport'],
  },
  {
    id: 'f10b',
    dayName: 'THURSDAY',
    dayNum: '29',
    month: 'OCTOBER',
    badge: 'QUALIFIER 2',
    team1: 'Paktia Panthers',
    team2: 'Band-e-Amir Dragons',
    time: '18:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Playoffs',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports', 'BBC Sport'],
  },
  {
    id: 'f11',
    dayName: 'FRIDAY',
    dayNum: '30',
    month: 'OCTOBER',
    badge: 'GRAND FINAL',
    team1: 'Balkh Legends',
    team2: 'Kabul Knights',
    time: '19:30 IST',
    venue: 'Kabul International Stadium, Kabul',
    stage: 'Final',
    status: 'UPCOMING',
    ticketsAvailable: true,
    broadcasters: ['RTA Sports', 'Sky Sports', 'SuperSport', 'BBC Sport'],
  },
]

export function FixturesPage() {
  const [activeModalMatch, setActiveModalMatch] = useState<MatchFixture | null>(null)
  // Group fixtures by dayNum to support multiple matches per day box
  interface GroupedDay {
    dayName: string
    dayNum: string
    month: string
    matches: MatchFixture[]
  }

  const filteredFixtures = mockFixtures;

  const groupedFixtures: GroupedDay[] = []
  filteredFixtures.forEach(match => {
    const existing = groupedFixtures.find(d => d.dayNum === match.dayNum)
    if (existing) {
      existing.matches.push(match)
    } else {
      groupedFixtures.push({
        dayName: match.dayName,
        dayNum: match.dayNum,
        month: match.month,
        matches: [match]
      })
    }
  })

  return (
    <div className="fixtures-page-container">

      {/* ── TOP HERO HEADER BANNER ── */}
      <section className="fixtures-hero">
        <div className="fixtures-hero-bg-grid" />
        <div className="fixtures-hero-glow" />

        <div className="fixtures-hero-top-row">
          <div className="fixtures-hero-title-wrap">
            <span className="fixtures-live-badge">APL 2026 SEASON</span>
            <h1 className="fixtures-main-title">FIXTURES<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* ── FIXTURES MATCH LIST ── */}
      <section className="fixtures-list-section">

        <div className="fixtures-list-inner">
          {/* ── DESKTOP GRID HEADERS ── */}
          <div className="fixtures-grid-header">
            <div className="gh-col gh-date">DATE</div>
            <div className="gh-teams-wrap">
              <div className="gh-col gh-teams">TEAMS &amp; VENUE</div>
              <div className="gh-col gh-score">SCORE</div>
            </div>
            <div className="gh-col gh-streaming">STREAMING PARTNERS</div>
          </div>

          {groupedFixtures.map((day) => {
            return (
              <div key={day.dayNum} className="fixture-card">
                {/* LEFT: Shared Date Column */}
                <div className="fixture-date-col">
                  <span className="fixture-day-name">{day.dayName}</span>
                  <span className="fixture-day-num">{day.dayNum}</span>
                </div>

                {/* RIGHT CONTENT WRAPPER */}
                <div className="fixture-right-content-wrapper">
                  {/* RIGHT: Stacked Matches in this day box */}
                  <div className="fixture-matches-container">
                    {day.matches.map((match) => {
                      const t1: TeamMeta = teamsMeta[match.team1] || { name: match.team1, shortName: 'TBD', logo: '', color: '#3b4eb8', invertLogo: false }
                      const t2: TeamMeta = teamsMeta[match.team2] || { name: match.team2, shortName: 'TBD', logo: '', color: '#3b4eb8', invertLogo: false }

                      return (
                        <div key={match.id} className="fixture-match-row">
                          {/* Side Ribbon Badge */}
                          {match.badge && (
                            <div className="fixture-side-ribbon">
                              <span>{match.badge}</span>
                            </div>
                          )}

                          {/* LEFT-CENTER: Side-by-side team logos */}
                          <div className="fixture-logos-col">
                            <img
                              src={t1.logo}
                              alt={t1.name}
                              className={`fixture-team-logo ${t1.invertLogo ? 'logo-invert-dark' : ''}`}
                            />
                            <span className="fixture-mobile-vs">VS</span>
                            <img
                              src={t2.logo}
                              alt={t2.name}
                              className={`fixture-team-logo ${t2.invertLogo ? 'logo-invert-dark' : ''}`}
                            />
                          </div>

                          {/* CENTER: Match Info & Teams Stacked */}
                          <div className="fixture-main-info">
                            {/* Meta info header */}
                            <div className="fixture-meta-pill">
                              <span className="meta-stage-tag">{match.stage}</span>
                              <span className="meta-dot">•</span>
                              <span className="meta-time">{match.time}</span>
                              <span className="meta-dot">•</span>
                              <span className="meta-venue">{match.venue}</span>
                            </div>

                            {/* Stacked team names with colorful VS */}
                            <div className="fixture-teams-stacked">
                              <div className="team-row-item">{t1.name}</div>
                              <div className="team-row-item vs-row">
                                <span className="vs-label">VS </span>
                                <span className="team-name-val">{t2.name}</span>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT-CENTER: Score Column */}
                          <div className="fixture-score-col">
                            <span className="score-tbp-val">TO BE PLAYED</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* RIGHT: Shared Broadcast coverage (one per card box) */}
                  <div className="fixture-actions-col">
                    <div className="fixture-watch-on">
                      <span className="watch-label">Watch on:</span>
                      <div className="watch-logos-stacked">
                        <img src={skySportsLogo} alt="Sky Sports" className="watch-broadcaster-logo" />
                        <img src={bbcLogo} alt="BBC" className="watch-broadcaster-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* MATCH CENTRE MODAL POPUP */}
      {activeModalMatch && (
        <div className="match-modal-backdrop" onClick={() => setActiveModalMatch(null)}>
          <div className="match-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-stage-badge">{activeModalMatch.stage}</span>
              <h3 className="modal-title">{activeModalMatch.team1} vs {activeModalMatch.team2}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModalMatch(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-info-row">
                <strong>Date &amp; Time:</strong> {activeModalMatch.dayName} {activeModalMatch.dayNum} {activeModalMatch.month} at {activeModalMatch.time}
              </div>
              <div className="modal-info-row">
                <strong>Venue:</strong> {activeModalMatch.venue}
              </div>
              <div className="modal-info-row">
                <strong>Official Broadcast Partners:</strong> {activeModalMatch.broadcasters.join(', ')}
              </div>

              <div className="modal-squad-preview">
                <h4>Match Day Preview</h4>
                <p>
                  Both teams enter this {activeModalMatch.stage} encounter at full strength.
                  Expect an electric atmosphere at {activeModalMatch.venue.split(',')[0]} as foreign international stars link up with top domestic talent.
                </p>
              </div>

              <div className="modal-actions-row">
                <a href="#tickets" className="modal-btn-gold" onClick={() => setActiveModalMatch(null)}>
                  Book Tickets Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
