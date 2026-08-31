export function StatsBarSection() {
  return (
    <section className="stats-section">
      {/* Background Decorative Patterns */}
      <div className="stats-bg-pattern-grid"></div>
      <div className="stats-bg-glow-orb orb-1"></div>
      <div className="stats-bg-glow-orb orb-2"></div>

      <div className="stats-watermark">APL LIVE STATS PERFORMANCE • APL LIVE STATS PERFORMANCE • APL LIVE STATS PERFORMANCE •</div>
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Elite Teams</div>
          <div className="stat-divider"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">24</div>
          <div className="stat-label">Thrilling Matches</div>
          <div className="stat-divider"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100+</div>
          <div className="stat-label">Star Players</div>
          <div className="stat-divider"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">10M+</div>
          <div className="stat-label">Fans</div>
          <div className="stat-divider"></div>
        </div>
      </div>
    </section>
  )
}
