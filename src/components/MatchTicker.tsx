import { useRef, useState, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import './MatchTicker.css'

interface Team {
  label: string;
  score?: string;
  overs?: string;
}

interface Match {
  id: string;
  dateStr: string;
  status: 'LIVE' | 'FINAL' | 'VS';
  result: string;
  team1: Team;
  team2: Team;
  venue: string;
  winner?: 'team1' | 'team2';
}

const mockMatches: Match[] = [
  {
    id: 'm1',
    dateStr: 'WED, 30 OCT · 18:30',
    status: 'LIVE',
    result: 'Kabul Zwanan need 3 runs off 10 balls',
    team1: { label: 'Kabul Zwanan', score: '178/4', overs: '18.2' },
    team2: { label: 'Balkh Legends', score: '175/8', overs: '20' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm2',
    dateStr: 'THU, 26 OCT · 14:45',
    status: 'FINAL',
    result: 'Nangarhar Leopards won by 34 runs',
    team1: { label: 'Nangarhar Leopards', score: '192/3', overs: '20' },
    team2: { label: 'Paktia Panthers', score: '158', overs: '17.4' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm3',
    dateStr: 'THU, 22 OCT · 18:30',
    status: 'FINAL',
    result: 'Kabul Zwanan won by 8 wickets',
    team1: { label: 'Kandahar Knights', score: '141/9', overs: '20' },
    team2: { label: 'Kabul Zwanan', score: '142/2', overs: '15.1' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm4',
    dateStr: 'FRI, 04 NOV · 15:00',
    status: 'VS',
    result: 'Match starts at 15:00 AFT',
    team1: { label: 'Balkh Legends', score: '-' },
    team2: { label: 'Nangarhar Leopards', score: '-' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm5',
    dateStr: 'TUE, 08 NOV · 19:00',
    status: 'VS',
    result: 'Match starts at 19:00 AFT',
    team1: { label: 'Paktia Panthers', score: '-' },
    team2: { label: 'Kandahar Knights', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm6',
    dateStr: 'SAT, 12 OCT · 18:30',
    status: 'FINAL',
    result: 'Nangarhar Leopards won by 7 wickets',
    team1: { label: 'Kabul Zwanan', score: '185/6' },
    team2: { label: 'Nangarhar Leopards', score: '186/3' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm7',
    dateStr: 'SUN, 13 OCT · 14:45',
    status: 'FINAL',
    result: 'Paktia Panthers won by 5 wickets',
    team1: { label: 'Balkh Legends', score: '160' },
    team2: { label: 'Paktia Panthers', score: '164/5' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm8',
    dateStr: 'TUE, 15 OCT · 18:30',
    status: 'FINAL',
    result: 'Kandahar Knights won by 47 runs',
    team1: { label: 'Kandahar Knights', score: '201/2' },
    team2: { label: 'Herat Warriors', score: '154/9' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm9',
    dateStr: 'MON, 02 NOV · 18:30',
    status: 'LIVE',
    result: 'Kabul Zwanan need 97 runs',
    team1: { label: 'Herat Warriors', score: '198/7' },
    team2: { label: 'Kabul Zwanan', score: '102/1' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm10',
    dateStr: 'THU, 05 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Balkh Legends', score: '-' },
    team2: { label: 'Kandahar Knights', score: '-' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm11',
    dateStr: 'SAT, 07 NOV · 14:45',
    status: 'VS',
    result: 'Match starts at 14:45 AFT',
    team1: { label: 'Herat Warriors', score: '-' },
    team2: { label: 'Nangarhar Leopards', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm12',
    dateStr: 'SUN, 08 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Paktia Panthers', score: '-' },
    team2: { label: 'Herat Warriors', score: '-' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm13',
    dateStr: 'WED, 16 OCT · 18:30',
    status: 'FINAL',
    result: 'Balkh Legends won by 3 wickets',
    team1: { label: 'Herat Warriors', score: '164/7' },
    team2: { label: 'Balkh Legends', score: '165/7' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm14',
    dateStr: 'FRI, 18 OCT · 14:45',
    status: 'FINAL',
    result: 'Paktia Panthers won by 22 runs',
    team1: { label: 'Paktia Panthers', score: '183/5' },
    team2: { label: 'Kabul Zwanan', score: '161/8' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm15',
    dateStr: 'SUN, 20 OCT · 18:30',
    status: 'FINAL',
    result: 'Nangarhar Leopards won by 6 wickets',
    team1: { label: 'Balkh Legends', score: '155/9' },
    team2: { label: 'Nangarhar Leopards', score: '156/4' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm16',
    dateStr: 'TUE, 21 OCT · 18:30',
    status: 'FINAL',
    result: 'Kandahar Knights won by 9 runs',
    team1: { label: 'Paktia Panthers', score: '178/5' },
    team2: { label: 'Kandahar Knights', score: '187/3' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm17',
    dateStr: 'WED, 10 NOV · 14:45',
    status: 'VS',
    result: 'Match starts at 14:45 AFT',
    team1: { label: 'Kabul Zwanan', score: '-' },
    team2: { label: 'Balkh Legends', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm18',
    dateStr: 'SAT, 14 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Nangarhar Leopards', score: '-' },
    team2: { label: 'Kandahar Knights', score: '-' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm19',
    dateStr: 'MON, 16 NOV · 18:30',
    status: 'VS',
    result: 'APL Grand Final',
    team1: { label: 'TBD', score: '-' },
    team2: { label: 'TBD', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm20',
    dateStr: 'SUN, 23 OCT · 14:45',
    status: 'FINAL',
    result: 'Herat Warriors won by 1 wicket',
    team1: { label: 'Kabul Zwanan', score: '201/4' },
    team2: { label: 'Herat Warriors', score: '202/9' },
    venue: 'Khost Cricket Stadium · Khost'
  }
]

// Derive which team won by checking if team label appears in result string before "won"
function getWinner(match: Match): 'team1' | 'team2' | null {
  if (match.status !== 'FINAL') return null
  if (match.winner) return match.winner
  const result = match.result.toLowerCase()
  if (result.includes(match.team1.label.toLowerCase())) return 'team1'
  if (result.includes(match.team2.label.toLowerCase())) return 'team2'
  return null
}

export function MatchTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(0)

  const updateConstraints = () => {
    if (containerRef.current && trackRef.current) {
      const gap = trackRef.current.scrollWidth - containerRef.current.offsetWidth
      setMaxDrag(Math.max(0, gap))
    }
  }

  useLayoutEffect(() => {
    const timer = setTimeout(updateConstraints, 100)
    
    let resizeFrameId: number
    const handleResize = () => {
      cancelAnimationFrame(resizeFrameId)
      resizeFrameId = requestAnimationFrame(updateConstraints)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(resizeFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="mc-section">
      <div className="mc-carousel-wrapper" ref={containerRef}>
        <motion.div
          ref={trackRef}
          className="mc-drag-track"
          drag="x"
          dragConstraints={{ right: 0, left: -maxDrag }}
          dragElastic={0.05}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
          onPointerDown={updateConstraints}
          whileTap={{ cursor: 'grabbing' }}
        >
          {mockMatches.map((match, index) => (
            <motion.div
              key={match.id}
              className="mc-card-stacked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              {/* Top Left Small White Date Header */}
              <div className="mc-card-top-meta">
                <span className="mc-top-date">{match.dateStr}</span>
                {match.status === 'LIVE' && (
                  <span className="mc-live-badge-sm">LIVE</span>
                )}
              </div>

              {/* Team rows with winner/loser styling */}
              {(() => {
                const winner = getWinner(match)
                const t1Won = winner === 'team1'
                const t2Won = winner === 'team2'
                return (
                  <>
                    <div className="mc-team-line">
                      <div className="mc-team-info">
                        <div className="mc-team-logo" />
                        <span className={`mc-team-name${t1Won ? ' mc-team-winner' : t2Won ? ' mc-team-loser' : ''}`}>
                          {match.team1.label.split(' ').map((word, wIdx) => (
                            <span key={wIdx} className="mc-team-name-word">{word}</span>
                          ))}
                        </span>
                      </div>
                      <div className="mc-team-score-block">
                        <span className={`mc-score-num${t1Won ? ' mc-score-winner' : t2Won ? ' mc-score-loser' : ''}`}>{match.team1.score}</span>
                      </div>
                    </div>

                    <div className="mc-team-line">
                      <div className="mc-team-info">
                        <div className="mc-team-logo" />
                        <span className={`mc-team-name${t2Won ? ' mc-team-winner' : t1Won ? ' mc-team-loser' : ''}`}>
                          {match.team2.label.split(' ').map((word, wIdx) => (
                            <span key={wIdx} className="mc-team-name-word">{word}</span>
                          ))}
                        </span>
                      </div>
                      <div className="mc-team-score-block">
                        <span className={`mc-score-num${t2Won ? ' mc-score-winner' : t1Won ? ' mc-score-loser' : ''}`}>{match.team2.score}</span>
                      </div>
                    </div>
                  </>
                )
              })()}

              {/* Bottom Result Line */}
              <div className="mc-card-bottom-result">
                <span className="mc-result-text">{match.result}</span>
                <span className="mc-venue-text">{match.venue}</span>
                <button className="mc-watch-btn">WATCH HIGHLIGHTS</button>
                <button className="mc-buy-tickets-btn">BUY TICKETS</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
