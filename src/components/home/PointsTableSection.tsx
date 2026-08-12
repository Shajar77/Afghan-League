import londonSpiritLogo from '../../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../../assets/sunrisers-leeds.svg'
import welshFireLogo from '../../assets/welsh-fire-white.svg'
import southernBraveLogo from '../../assets/southern-brave-alt.svg'

export function PointsTableSection() {
  return (
    <section className="points-table-section">
      <h2 className="section-heading">Points <span>Table</span></h2>
      <p className="section-description">Current APL 2026 season standings — updated after every match.</p>
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
            {[
              { rank: 1, name: 'Kabul Knights', logo: londonSpiritLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
              { rank: 2, name: 'Kandahar Kings', logo: birminghamPhoenixLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
              { rank: 3, name: 'Balkh Legends', logo: manchesterSuperGiantsLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
              { rank: 4, name: 'Paktia Panthers', logo: sunrisersLeedsLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: true },
              { rank: 5, name: 'Amo Sharks', logo: welshFireLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: false },
              { rank: 6, name: 'Band-e-Amir Dragons', logo: southernBraveLogo, m: 0, w: 0, l: 0, t: 0, nr: 0, nrr: '+0.000', pts: 0, top: false },
            ].map((team) => (
              <tr key={team.rank} className={`pt-row ${team.top ? 'pt-row-top' : 'pt-row-lower'}`}>
                <td className={`pt-rank-cell ${team.top ? 'pt-rank-gold' : 'pt-rank-blue'}`}>{team.rank}</td>
                <td className="pt-club-cell">
                  <img src={team.logo} alt={`${team.name} Logo`} className="pt-team-logo" />
                  <span className="pt-team-name">{team.name}</span>
                </td>
                <td className="pt-stat pt-col-pld">{team.m}</td>
                <td className="pt-stat pt-stat-w pt-col-won">{team.w}</td>
                <td className="pt-stat pt-stat-l pt-col-lost">{team.l}</td>
                <td className="pt-stat pt-col-tied">{team.t}</td>
                <td className="pt-stat pt-col-nr">{team.nr}</td>
                <td className="pt-stat pt-nrr pt-col-nrr">{team.nrr}</td>
                <td className="pt-pts-cell">{team.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pt-qualifier-note">
        <span className="pt-qual-dot top" /> Top 4 qualify for playoffs
      </p>
    </section>
  )
}
