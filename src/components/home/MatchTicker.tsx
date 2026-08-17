import { useRef, useCallback, useEffect } from 'react'
import './MatchTicker.css'

import londonSpiritLogo from '../../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../../assets/sunrisers-leeds.svg'
import welshFireLogo from '../../assets/welsh-fire-white.svg'
import southernBraveLogo from '../../assets/southern-brave-alt.svg'

const teamMetaInfo: { [key: string]: { bg: string, text: string, logo: string, initials: string } } = {
  'Kabul Knights': { bg: '#2c32aa', text: '#ffffff', logo: londonSpiritLogo, initials: 'KK' },
  'Kandahar Kings': { bg: '#805ad5', text: '#ffffff', logo: birminghamPhoenixLogo, initials: 'KK' },
  'Balkh Legends': { bg: '#F8C800', text: '#000000', logo: manchesterSuperGiantsLogo, initials: 'BL' },
  'Paktia Panthers': { bg: '#e53e3e', text: '#ffffff', logo: sunrisersLeedsLogo, initials: 'PP' },
  'Amo Sharks': { bg: '#dd6b20', text: '#ffffff', logo: welshFireLogo, initials: 'AS' },
  'Band-e-Amir Dragons': { bg: '#017a37', text: '#ffffff', logo: southernBraveLogo, initials: 'BD' },
  'TBD': { bg: '#718096', text: '#ffffff', logo: '', initials: 'TBD' }
};

function getTeamMeta(label: string) {
  const cleanLabel = label.trim();
  return teamMetaInfo[cleanLabel] || { bg: '#718096', text: '#ffffff', logo: '', initials: 'TBD' };
}

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
    result: 'Kabul Knights need 3 runs off 10 balls',
    team1: { label: 'Kabul Knights', score: '178/4', overs: '18.2' },
    team2: { label: 'Balkh Legends', score: '175/8', overs: '20' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm2',
    dateStr: 'THU, 26 OCT · 14:45',
    status: 'FINAL',
    result: 'Band-e-Amir Dragons won by 34 runs',
    team1: { label: 'Band-e-Amir Dragons', score: '192/3', overs: '20' },
    team2: { label: 'Paktia Panthers', score: '158', overs: '17.4' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm3',
    dateStr: 'THU, 22 OCT · 18:30',
    status: 'FINAL',
    result: 'Kabul Knights won by 8 wickets',
    team1: { label: 'Kandahar Kings', score: '141/9', overs: '20' },
    team2: { label: 'Kabul Knights', score: '142/2', overs: '15.1' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm4',
    dateStr: 'FRI, 04 NOV · 15:00',
    status: 'VS',
    result: 'Match starts at 15:00 AFT',
    team1: { label: 'Balkh Legends', score: '-' },
    team2: { label: 'Band-e-Amir Dragons', score: '-' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm5',
    dateStr: 'TUE, 08 NOV · 19:00',
    status: 'VS',
    result: 'Match starts at 19:00 AFT',
    team1: { label: 'Paktia Panthers', score: '-' },
    team2: { label: 'Kandahar Kings', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm6',
    dateStr: 'SAT, 12 OCT · 18:30',
    status: 'FINAL',
    result: 'Band-e-Amir Dragons won by 7 wickets',
    team1: { label: 'Kabul Knights', score: '185/6' },
    team2: { label: 'Band-e-Amir Dragons', score: '186/3' },
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
    result: 'Kandahar Kings won by 47 runs',
    team1: { label: 'Kandahar Kings', score: '201/2' },
    team2: { label: 'Amo Sharks', score: '154/9' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm9',
    dateStr: 'MON, 02 NOV · 18:30',
    status: 'LIVE',
    result: 'Kabul Knights need 97 runs',
    team1: { label: 'Amo Sharks', score: '198/7' },
    team2: { label: 'Kabul Knights', score: '102/1' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm10',
    dateStr: 'THU, 05 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Balkh Legends', score: '-' },
    team2: { label: 'Kandahar Kings', score: '-' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm11',
    dateStr: 'SAT, 07 NOV · 14:45',
    status: 'VS',
    result: 'Match starts at 14:45 AFT',
    team1: { label: 'Amo Sharks', score: '-' },
    team2: { label: 'Band-e-Amir Dragons', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm12',
    dateStr: 'SUN, 08 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Paktia Panthers', score: '-' },
    team2: { label: 'Amo Sharks', score: '-' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm13',
    dateStr: 'WED, 16 OCT · 18:30',
    status: 'FINAL',
    result: 'Balkh Legends won by 3 wickets',
    team1: { label: 'Amo Sharks', score: '164/7' },
    team2: { label: 'Balkh Legends', score: '165/7' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm14',
    dateStr: 'FRI, 18 OCT · 14:45',
    status: 'FINAL',
    result: 'Paktia Panthers won by 22 runs',
    team1: { label: 'Paktia Panthers', score: '183/5' },
    team2: { label: 'Kabul Knights', score: '161/8' },
    venue: 'Ghazi Amanullah Khan Stadium · Jalalabad'
  },
  {
    id: 'm15',
    dateStr: 'SUN, 20 OCT · 18:30',
    status: 'FINAL',
    result: 'Band-e-Amir Dragons won by 6 wickets',
    team1: { label: 'Balkh Legends', score: '155/9' },
    team2: { label: 'Band-e-Amir Dragons', score: '156/4' },
    venue: 'Khost Cricket Stadium · Khost'
  },
  {
    id: 'm16',
    dateStr: 'TUE, 21 OCT · 18:30',
    status: 'FINAL',
    result: 'Kandahar Kings won by 9 runs',
    team1: { label: 'Paktia Panthers', score: '178/5' },
    team2: { label: 'Kandahar Kings', score: '187/3' },
    venue: 'Kandahar International Stadium · Kandahar'
  },
  {
    id: 'm17',
    dateStr: 'WED, 10 NOV · 14:45',
    status: 'VS',
    result: 'Match starts at 14:45 AFT',
    team1: { label: 'Kabul Knights', score: '-' },
    team2: { label: 'Balkh Legends', score: '-' },
    venue: 'Kabul International Stadium · Kabul'
  },
  {
    id: 'm18',
    dateStr: 'SAT, 14 NOV · 18:30',
    status: 'VS',
    result: 'Match starts at 18:30 AFT',
    team1: { label: 'Band-e-Amir Dragons', score: '-' },
    team2: { label: 'Kandahar Kings', score: '-' },
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
    result: 'Amo Sharks won by 1 wicket',
    team1: { label: 'Kabul Knights', score: '201/4' },
    team2: { label: 'Amo Sharks', score: '202/9' },
    venue: 'Khost Cricket Stadium · Khost'
  }
]

// Render result text with highlighted team name in gold
function renderResultText(result: string, team1Label: string, team2Label: string) {
  if (result.startsWith(team1Label)) {
    const rest = result.slice(team1Label.length);
    return (
      <>
        <span className="mc-result-team">{team1Label}</span>
        <span className="mc-result-desc">{rest}</span>
      </>
    );
  }
  if (result.startsWith(team2Label)) {
    const rest = result.slice(team2Label.length);
    return (
      <>
        <span className="mc-result-team">{team2Label}</span>
        <span className="mc-result-desc">{rest}</span>
      </>
    );
  }
  return <span className="mc-result-desc">{result}</span>;
}

function formatOvers(overs: string) {
  if (overs === '20') return '20.0';
  return overs;
}

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
  // Native drag state
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })
  const isHovered = useRef(false)
  const isTouching = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return // Let mobile browser handle native swipe scrolling
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      scrollLeft: container.scrollLeft,
    }
    container.style.cursor = 'grabbing'
    track.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging) return
    const container = containerRef.current
    if (!container) return
    const dx = e.clientX - dragState.current.startX
    let targetScroll = dragState.current.scrollLeft - dx

    // Infinite loop wrap-around logic during dragging
    const halfWidth = container.scrollWidth / 2
    if (targetScroll >= halfWidth) {
      targetScroll -= halfWidth
      dragState.current.startX += halfWidth
      dragState.current.scrollLeft -= halfWidth
    } else if (targetScroll < 0) {
      targetScroll += halfWidth
      dragState.current.startX -= halfWidth
      dragState.current.scrollLeft += halfWidth
    }

    container.scrollLeft = targetScroll
  }, [])

  const onPointerUp = useCallback(() => {
    dragState.current.isDragging = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }, [])

  // Auto-scroll loop effect
  useEffect(() => {
    let animationFrameId: number
    let lastTime = performance.now()
    const speed = 30 // Smooth slow drift speed (pixels per second)

    const scroll = (time: number) => {
      const container = containerRef.current
      if (!container) return

      // Pause scroll if dragging, hovered, or actively swiping
      if (dragState.current.isDragging || isHovered.current || isTouching.current) {
        lastTime = time
        animationFrameId = requestAnimationFrame(scroll)
        return
      }

      const delta = (time - lastTime) / 1000
      lastTime = time

      // Increment scroll
      container.scrollLeft += speed * delta

      // Wrap around seamlessly
      const halfWidth = container.scrollWidth / 2
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Prevent text selection during drag
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const prevent = (e: Event) => { if (dragState.current.isDragging) e.preventDefault() }
    el.addEventListener('selectstart', prevent)
    return () => el.removeEventListener('selectstart', prevent)
  }, [])

  return (
    <div className="mc-section">
      <div
        className="mc-carousel-wrapper"
        ref={containerRef}
        style={{ overflowX: 'auto', cursor: 'grab', scrollBehavior: 'auto' }}
        onMouseEnter={() => { isHovered.current = true }}
        onMouseLeave={() => { isHovered.current = false }}
        onTouchStart={() => { isTouching.current = true }}
        onTouchEnd={() => { isTouching.current = false }}
        onTouchCancel={() => { isTouching.current = false }}
      >
        <div
          ref={trackRef}
          className="mc-drag-track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {[...mockMatches, ...mockMatches].map((match, index) => {
            const meta1 = getTeamMeta(match.team1.label)
            const meta2 = getTeamMeta(match.team2.label)
            const winner = getWinner(match)
            const t1Won = winner === 'team1'
            const t2Won = winner === 'team2'

            return (
              <div
                key={`${match.id}-dup-${index}`}
                className="mc-card-motion-wrapper"
                style={{ animationDelay: `${index * -0.7}s` }}
              >
                <div
                  className="mc-card-horizontal mc-card-fade-in"
                  style={{ animationDelay: `${(index % mockMatches.length) * 0.04}s` }}
                >
                  {/* Team 1 (Left) */}
                  <div className="mc-horizontal-team left">
                    <div className="mc-team-logo-circle" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                      {meta1.logo ? (
                        <img src={meta1.logo} alt={match.team1.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        meta1.initials
                      )}
                    </div>
                    <div className="mc-score-overs-block">
                      <span className={`mc-score-big ${t1Won ? 'mc-winner' : t2Won ? 'mc-loser' : ''}`}>
                        {match.team1.score || '-'}
                      </span>
                      {match.team1.overs && (
                        <span className="mc-overs-count">
                          ({formatOvers(match.team1.overs)})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Match Details */}
                  <div className="mc-horizontal-center">
                    <div className="mc-center-details">
                      <div className="mc-details-default">
                        VS
                      </div>
                      <div className="mc-details-hover" title={match.result || match.venue}>
                        {renderResultText(match.result || match.venue.split('·')[0], match.team1.label, match.team2.label)}
                      </div>
                    </div>
                  </div>

                  {/* Team 2 (Right) */}
                  <div className="mc-horizontal-team right">
                    <div className="mc-score-overs-block align-right">
                      <span className={`mc-score-big ${t2Won ? 'mc-winner' : t1Won ? 'mc-loser' : ''}`}>
                        {match.team2.score || '-'}
                      </span>
                      {match.team2.overs && (
                        <span className="mc-overs-count">
                          ({formatOvers(match.team2.overs)})
                        </span>
                      )}
                    </div>
                    <div className="mc-team-logo-circle" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                      {meta2.logo ? (
                        <img src={meta2.logo} alt={match.team2.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        meta2.initials
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
