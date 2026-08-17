import { useState } from 'react'
import { X } from 'lucide-react'
import londonSpiritLogo from '../../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../../assets/sunrisers-leeds.svg'
import welshFireLogo from '../../assets/welsh-fire-white.svg'
import southernBraveLogo from '../../assets/southern-brave-alt.svg'
import './TeamsPage.css'

interface TeamDetail {
  id: string
  name: string
  shortName: string
  logo: string
  color: string
  invertLogo?: boolean
  stadium: string
  captain: string
  coach: string
  assistantCoach: string
  founded: string
}

interface Player {
  name: string
  role: string
  nationality: string
  isCaptain?: boolean
}

const teamsList: TeamDetail[] = [
  {
    id: 'team-kk',
    name: 'Kabul Knights',
    shortName: 'KK',
    logo: londonSpiritLogo,
    color: '#0000F7',
    invertLogo: true,
    stadium: 'Kabul International Stadium, Kabul',
    captain: 'Rashid Khan',
    coach: 'Andy Flower',
    assistantCoach: 'Raees Ahmadzai',
    founded: '2018',
  },
  {
    id: 'team-knk',
    name: 'Kandahar Kings',
    shortName: 'KNK',
    logo: birminghamPhoenixLogo,
    color: '#FF4B32',
    stadium: 'Kandahar Cricket Stadium, Kandahar',
    captain: 'Mujeeb Ur Rahman',
    coach: 'Stephen Fleming',
    assistantCoach: 'Kabir Khan',
    founded: '2018',
  },
  {
    id: 'team-bl',
    name: 'Balkh Legends',
    shortName: 'BL',
    logo: manchesterSuperGiantsLogo,
    color: '#A01728',
    stadium: 'Mazari Sharif Stadium, Balkh',
    captain: 'Mohammad Nabi',
    coach: 'Herschelle Gibbs',
    assistantCoach: 'Dawlat Ahmadzai',
    founded: '2018',
  },
  {
    id: 'team-pp',
    name: 'Paktia Panthers',
    shortName: 'PP',
    logo: sunrisersLeedsLogo,
    color: '#FAA718',
    stadium: 'Zurmatt Stadium, Paktia',
    captain: 'Rahmanullah Gurbaz',
    coach: 'Phil Simmons',
    assistantCoach: 'Hasti Gul Abid',
    founded: '2018',
  },
  {
    id: 'team-as',
    name: 'Amo Sharks',
    shortName: 'AS',
    logo: welshFireLogo,
    color: '#f70014',
    invertLogo: true,
    stadium: 'Ghazi Amanullah Stadium, Jalalabad',
    captain: 'Azmatullah Omarzai',
    coach: 'Lance Klusener',
    assistantCoach: 'Nawroz Mangal',
    founded: '2018',
  },
  {
    id: 'team-bd',
    name: 'Band-e-Amir Dragons',
    shortName: 'BD',
    logo: southernBraveLogo,
    color: '#E10B15',
    stadium: 'Band-e-Amir Cricket Stadium, Bamyan',
    captain: 'Fazalhaq Farooqi',
    coach: 'Tom Moody',
    assistantCoach: 'Khaliqdad Noori',
    founded: '2018',
  },
]

const squadData: Record<string, Player[]> = {
  'team-kk': [
    { name: 'Rashid Khan', role: 'Bowling All-rounder', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Hazratullah Zazai', role: 'Opening Batsman', nationality: 'Afghanistan' },
    { name: 'Andy Balbirnie', role: 'Batsman', nationality: 'Ireland' },
    { name: 'Brandon King', role: 'Batsman', nationality: 'West Indies' },
    { name: 'Harry Tector', role: 'Batsman', nationality: 'Ireland' },
    { name: 'Qais Ahmad', role: 'Leg Spinner', nationality: 'Afghanistan' },
    { name: 'Naveen-ul-Haq', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Luke Wood', role: 'Fast Bowler', nationality: 'England' },
    { name: 'Litton Das', role: 'Wicketkeeper-Batsman', nationality: 'Bangladesh' },
    { name: 'Karim Janat', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Waqar Salamkheil', role: 'Spinner', nationality: 'Afghanistan' },
    { name: 'Zahir Khan', role: 'Wrist Spinner', nationality: 'Afghanistan' },
    { name: 'Richard Gleeson', role: 'Fast Bowler', nationality: 'England' },
    { name: 'Usman Shinwari', role: 'Fast Bowler', nationality: 'Pakistan' },
    { name: 'Paul Stirling', role: 'Opening Batsman', nationality: 'Ireland' },
  ],
  'team-knk': [
    { name: 'Mujeeb Ur Rahman', role: 'Off Spinner', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Najibullah Zadran', role: 'Batsman', nationality: 'Afghanistan' },
    { name: 'Alex Hales', role: 'Opening Batsman', nationality: 'England' },
    { name: 'Colin Munro', role: 'Batsman', nationality: 'New Zealand' },
    { name: 'Tom Kohler-Cadmore', role: 'Wicketkeeper-Batsman', nationality: 'England' },
    { name: 'Karim Janat', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Mohammad Saleem', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Richard Gleeson', role: 'Fast Bowler', nationality: 'England' },
    { name: 'Ish Sodhi', role: 'Leg Spinner', nationality: 'New Zealand' },
    { name: 'Gulbadin Naib', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Fareed Ahmad', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Ben Laughlin', role: 'Fast Bowler', nationality: 'Australia' },
    { name: 'Evin Lewis', role: 'Opening Batsman', nationality: 'West Indies' },
    { name: 'Shakib Al Hasan', role: 'All-rounder', nationality: 'Bangladesh' },
    { name: 'Riaz Hassan', role: 'Batsman', nationality: 'Afghanistan' },
  ],
  'team-bl': [
    { name: 'Mohammad Nabi', role: 'All-rounder', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Darwish Rasooli', role: 'Batsman', nationality: 'Afghanistan' },
    { name: 'Chris Gayle', role: 'Opening Batsman', nationality: 'West Indies' },
    { name: 'Dawid Malan', role: 'Batsman', nationality: 'England' },
    { name: 'Ravi Bopara', role: 'All-rounder', nationality: 'England' },
    { name: 'Sharafuddin Ashraf', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Gulbadin Naib', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Usman Shinwari', role: 'Fast Bowler', nationality: 'Pakistan' },
    { name: 'Ben Laughlin', role: 'Fast Bowler', nationality: 'Australia' },
    { name: 'Qais Ahmad', role: 'Leg Spinner', nationality: 'Afghanistan' },
    { name: 'Litton Das', role: 'Wicketkeeper-Batsman', nationality: 'Bangladesh' },
    { name: 'Hazratullah Zazai', role: 'Opening Batsman', nationality: 'Afghanistan' },
    { name: 'Ziaur Rahman', role: 'Spinner', nationality: 'Afghanistan' },
    { name: 'Sheldon Cottrell', role: 'Fast Bowler', nationality: 'West Indies' },
    { name: 'Roelof van der Merwe', role: 'All-rounder', nationality: 'Netherlands' },
  ],
  'team-pp': [
    { name: 'Rahmanullah Gurbaz', role: 'Wicketkeeper-Batsman', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Ibrahim Zadran', role: 'Opening Batsman', nationality: 'Afghanistan' },
    { name: 'Thisara Perera', role: 'All-rounder', nationality: 'Sri Lanka' },
    { name: 'Luke Wright', role: 'Batsman', nationality: 'England' },
    { name: 'Sikandar Raza', role: 'All-rounder', nationality: 'Zimbabwe' },
    { name: 'Fareed Ahmad', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Zahir Khan', role: 'Wrist Spinner', nationality: 'Afghanistan' },
    { name: 'Ziaur Rahman', role: 'Spinner', nationality: 'Afghanistan' },
    { name: 'Sheldon Cottrell', role: 'Fast Bowler', nationality: 'West Indies' },
    { name: 'Naveen-ul-Haq', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Mohammad Nabi', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Luke Wood', role: 'Fast Bowler', nationality: 'England' },
    { name: 'Bilal Sami', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Colin Munro', role: 'Batsman', nationality: 'New Zealand' },
    { name: 'Brandon King', role: 'Batsman', nationality: 'West Indies' },
  ],
  'team-as': [
    { name: 'Azmatullah Omarzai', role: 'Bowling All-rounder', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Rahmat Shah', role: 'Batsman', nationality: 'Afghanistan' },
    { name: 'Paul Stirling', role: 'Opening Batsman', nationality: 'Ireland' },
    { name: 'Shakib Al Hasan', role: 'All-rounder', nationality: 'Bangladesh' },
    { name: 'Yusuf Pathan', role: 'Batsman', nationality: 'India' },
    { name: 'Ikram Alikhil', role: 'Wicketkeeper', nationality: 'Afghanistan' },
    { name: 'Abdul Rahman', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Bilal Sami', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Wafadar Momand', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Ibrahim Zadran', role: 'Opening Batsman', nationality: 'Afghanistan' },
    { name: 'Qais Ahmad', role: 'Leg Spinner', nationality: 'Afghanistan' },
    { name: 'Andy Balbirnie', role: 'Batsman', nationality: 'Ireland' },
    { name: 'Tom Kohler-Cadmore', role: 'Wicketkeeper-Batsman', nationality: 'England' },
    { name: 'Sikandar Raza', role: 'All-rounder', nationality: 'Zimbabwe' },
    { name: 'Nijat Masood', role: 'Fast Bowler', nationality: 'Afghanistan' },
  ],
  'team-bd': [
    { name: 'Fazalhaq Farooqi', role: 'Left-arm Fast Bowler', nationality: 'Afghanistan', isCaptain: true },
    { name: 'Riaz Hassan', role: 'Batsman', nationality: 'Afghanistan' },
    { name: 'Evin Lewis', role: 'Opening Batsman', nationality: 'West Indies' },
    { name: 'Asghar Afghan', role: 'Batsman', nationality: 'Afghanistan' },
    { name: 'Roelof van der Merwe', role: 'All-rounder', nationality: 'Netherlands' },
    { name: 'Nijat Masood', role: 'Fast Bowler', nationality: 'Afghanistan' },
    { name: 'Waqar Salamkheil', role: 'Spinner', nationality: 'Afghanistan' },
    { name: 'Karim Sadiq', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Hamid Hassan', role: 'Bowler', nationality: 'Afghanistan' },
    { name: 'Hazratullah Zazai', role: 'Opening Batsman', nationality: 'Afghanistan' },
    { name: 'Alex Hales', role: 'Opening Batsman', nationality: 'England' },
    { name: 'Ravi Bopara', role: 'All-rounder', nationality: 'England' },
    { name: 'Gulbadin Naib', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Sharafuddin Ashraf', role: 'All-rounder', nationality: 'Afghanistan' },
    { name: 'Fareed Ahmad', role: 'Fast Bowler', nationality: 'Afghanistan' },
  ],
}

export function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null)

  const handleOpenModal = (team: TeamDetail) => {
    setSelectedTeam(team)
    document.body.classList.add('modal-open-blur')
  }

  const handleCloseModal = () => {
    setSelectedTeam(null)
    document.body.classList.remove('modal-open-blur')
  }

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
          <div className="teams-cards-grid">
            {teamsList.map((team) => (
              <div key={team.id} className="team-profile-card">
                {/* Left Side: Logo & Names */}
                <div className="team-card-left" style={{ borderLeft: `4px solid ${team.color}` }}>
                  <div className="team-logo-wrap">
                    <img 
                      src={team.logo} 
                      alt={`${team.name} Logo`} 
                      className={`team-logo-img-page ${team.invertLogo ? 'logo-invert-dark' : ''}`}
                      loading="lazy"
                      decoding="async"
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

                  <div className="team-card-body">
                    <div className="team-info-row">
                      <span className="info-row-label">Captain</span>
                      <span className="info-row-value">{team.captain}</span>
                    </div>
                    <div className="team-info-row">
                      <span className="info-row-label">Head Coach</span>
                      <span className="info-row-value">{team.coach}</span>
                    </div>
                    <div className="team-info-row">
                      <span className="info-row-label">Home Venue</span>
                      <span className="info-row-value venue-val">{team.stadium}</span>
                    </div>
                    <div className="team-info-row">
                      <span className="info-row-label">Founded</span>
                      <span className="info-row-value">{team.founded}</span>
                    </div>
                  </div>

                  <div className="team-card-footer">
                    <button 
                      className="team-action-btn" 
                      onClick={() => handleOpenModal(team)}
                      style={{ 
                        '--team-theme-color': team.color,
                        '--team-hover-text': team.color === '#FFFFFF' ? '#0a1240' : '#ffffff'
                      } as React.CSSProperties}
                    >
                      View Squad
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              borderTop: `5px solid ${selectedTeam.color}`
            }}
          >
            {/* Modal Header */}
            <div className="squad-modal-header">
              <div className="squad-header-logo-wrap">
                <img 
                  src={selectedTeam.logo} 
                  alt={selectedTeam.name} 
                  className={`squad-header-logo-img ${selectedTeam.invertLogo ? 'logo-invert-dark' : ''}`}
                />
              </div>
              <div className="squad-header-titles">
                <span className="squad-badge" style={{ color: selectedTeam.color }}>APL SQUAD PROFILE</span>
                <h2 className="squad-team-name">{selectedTeam.name}</h2>
              </div>
              <button className="squad-modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="squad-modal-body">
              <h4 className="squad-section-title" style={{ color: selectedTeam.color, borderLeftColor: selectedTeam.color }}>
                ACTIVE ROSTER ({squadData[selectedTeam.id]?.length || 0} PLAYERS)
              </h4>
              <div className="squad-players-grid">
                {(squadData[selectedTeam.id] || []).map((player, idx) => (
                  <div key={idx} className="squad-player-item">
                    <div className="player-number-col" style={{ color: selectedTeam.color }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="player-divider-col" />
                    <div className="player-info-col">
                      <span className="player-name">
                        {player.name}
                        {player.isCaptain && <span className="captain-text-suffix"> (C)</span>}
                        <span className="player-role-inline"> — {player.role}</span>
                      </span>
                    </div>
                    <div className="player-country-col">
                      <span className="country-name-badge">{player.nationality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="squad-modal-footer">
              <div className="squad-coach-row">
                <div className="squad-coach-bar">
                  <span className="footer-label">Head Coach:</span>
                  <span className="footer-value">{selectedTeam.coach}</span>
                </div>
                <div className="squad-coach-bar">
                  <span className="footer-label">Assistant Coach:</span>
                  <span className="footer-value">{selectedTeam.assistantCoach}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
