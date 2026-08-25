import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'

export interface AdminStats {
  total: number
  approved: number
  pending: number
  underReview: number
  rejected: number
  overseas: number
  uniqueCountries: number
}

interface TrendPoint {
  name: string
  value: number
}

interface CategoryPoint {
  name: string
  value: number
  fill: string
}

interface CountryCount {
  country: string
  count: number
}

interface AdminStatsSectionProps {
  stats: AdminStats
  draftTrendData: TrendPoint[]
  categoryChartData: CategoryPoint[]
  registrationsByCountry: CountryCount[]
}

export function AdminStatsSection({
  stats,
  draftTrendData,
  categoryChartData,
  registrationsByCountry
}: AdminStatsSectionProps) {
  return (
    <section className="exact-kikin-grid">
      {/* ── LEFT COLUMN (Invoice / Draft Pipeline + Verification Score + Category Breakdown) ── */}
      <div className="kikin-left-column">
        {/* 1. UPPER ROW (Timeline Trend & Category Breakdown Cards) */}
        <div className="kikin-bottom-row">
          {/* Card 1: Submissions Timeline & Activity */}
          <div className="kikin-card kikin-card-score-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="apl-card-heading">SUBMISSION TIMELINE & TREND</h2>
              </div>
              <div className="apl-card-divider" style={{ margin: '0.5rem 0 0.75rem' }} />
            </div>

            <div className="kikin-invoice-hero" style={{ marginBottom: '0.25rem' }}>
              <div className="kikin-hero-amount" style={{ color: '#0f172a', fontSize: '2.5rem' }}>{stats.total}</div>
              <div className="kikin-hero-sub" style={{ color: '#64748b' }}>
                Player applications across {stats.uniqueCountries} {stats.uniqueCountries === 1 ? 'country' : 'countries'}
              </div>
            </div>

            <div style={{ height: 110, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={draftTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#021B79" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#021B79" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    {...({
                      dataKey: 'name',
                      stroke: '#94a3b8',
                      tickLine: false,
                      axisLine: false,
                      boundaryGap: false,
                      tick: { fontSize: 11, fontWeight: '500', fill: '#64748b', dy: 4 }
                    } as any)}
                  />
                  <Tooltip
                    contentStyle={{ background: '#021B79', border: '1px solid #1F2E7A', borderRadius: 8, color: '#ffffff' }}
                    labelStyle={{ color: '#F8C800' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#021B79"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#timelineFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Player Category Progress Bars */}
          <div className="kikin-card kikin-card-esg-bars" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <h2 className="apl-card-heading">REGISTRATIONS BY CATEGORY</h2>
              <div className="apl-card-divider" style={{ margin: '0.5rem 0 0.75rem' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {categoryChartData.map(item => {
                const maxVal = Math.max(...categoryChartData.map(d => d.value)) || 1
                const pct = Math.min(100, Math.max(5, (item.value / maxVal) * 100))
                
                return (
                  <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', 
                        fontSize: '1.25rem', 
                        fontWeight: 500, 
                        color: '#334155',
                        letterSpacing: '0.01em',
                        textTransform: 'uppercase'
                      }}>
                        {item.name} <span style={{ 
                          fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', 
                          color: '#334155', 
                          fontWeight: 400,
                          marginLeft: '0.3rem',
                          fontSize: '1.25rem'
                        }}>({item.value})</span>
                      </span>
                    </div>
                    <div style={{ height: '7px', width: '100%', background: '#e2e8f0', borderRadius: '0px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${pct}%`, 
                          background: '#F8C800',
                          transition: 'width 0.6s ease-out',
                          borderRadius: '0px'
                        }} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 2. LOWER ROW - REGISTRATIONS BY ALL CRICKETING NATIONS */}
        <div className="kikin-card kikin-card-invoice" style={{ padding: '1.5rem' }}>
          <div className="kikin-invoice-header" style={{ marginBottom: '0.75rem' }}>
            <div className="kikin-invoice-to">
              <span className="apl-card-heading">PLAYER REGISTRATIONS BY COUNTRIES</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            columnGap: '2rem',
            rowGap: '0.1rem',
            maxHeight: '220px',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {registrationsByCountry.map(({ country, count }) => (
              <div
                key={country}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.45rem 0',
                  borderBottom: '1px solid #cbd5e1',
                  opacity: count > 0 ? 1 : 0.65
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: count > 0 ? '#021B79' : '#94a3b8',
                    display: 'inline-block'
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
                    fontSize: '1.15rem',
                    fontWeight: count > 0 ? 600 : 500,
                    color: count > 0 ? '#0f172a' : '#475569',
                    letterSpacing: '0.01em',
                    textTransform: 'uppercase'
                  }}>
                    {country}
                  </span>
                </div>

                <span style={{
                  fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
                  fontSize: '1.15rem',
                  fontWeight: count > 0 ? 700 : 500,
                  color: count > 0 ? '#021B79' : '#64748b',
                  letterSpacing: '0.01em'
                }}>
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN (Applications Status Card) ── */}
      <div className="kikin-right-column">
        <div className="kikin-card kikin-card-right-tall">
          <div className="kikin-card-tall-content">
            <div>
              <div className="kikin-morning-top">
                <h1 className="apl-card-heading-large">
                  APPLICATIONS STATUS
                </h1>
              </div>
              <div className="apl-card-divider" />
            </div>

            {/* Approved */}
            <div className="kikin-mid-balance-row">
              <div className="kikin-meta-left">
                <div className="kikin-balance-lbl">APPROVED APPLICATIONS:</div>
              </div>
              <div className="kikin-balance-val">
                {stats.approved}
              </div>
            </div>
            <div className="apl-card-divider" style={{ margin: '0.65rem 0' }} />

            {/* Pending */}
            <div className="kikin-mid-balance-row">
              <div className="kikin-meta-left">
                <div className="kikin-balance-lbl">PENDING VERIFICATION:</div>
              </div>
              <div className="kikin-balance-val">
                {stats.pending}
              </div>
            </div>
            <div className="apl-card-divider" style={{ margin: '0.65rem 0' }} />

            {/* Application Pipeline Status */}
            <div className="kikin-ecg-header">
              <div className="apl-card-heading">
                APPLICATION PIPELINE STATUS
              </div>
              <div
                className="kikin-down-circle"
                onClick={() => {
                  const el = document.getElementById('player-registrations-section')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{ cursor: 'pointer' }}
                title="Jump to Registrations"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Pipeline Stats List */}
            <div className="apl-pipeline-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.25rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '0px', background: '#d97706', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>PENDING REVIEW</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', fontSize: '1.35rem', fontWeight: 400, color: '#0f172a' }}>{stats.pending}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>({stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '0px', background: '#22c55e', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>APPROVED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', fontSize: '1.35rem', fontWeight: 400, color: '#0f172a' }}>{stats.approved}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>({stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '0px', background: '#3b82f6', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>UNDER REVIEW</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', fontSize: '1.35rem', fontWeight: 400, color: '#0f172a' }}>{stats.underReview}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>({stats.total > 0 ? Math.round((stats.underReview / stats.total) * 100) : 0}%)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '0px', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>REJECTED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)', fontSize: '1.35rem', fontWeight: 400, color: '#0f172a' }}>{stats.rejected}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>({stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
