import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { normalizeMediaUrl } from '../../config/api'
import { formatStatus, statusClass } from './adminUtils'
import { scrollToElement } from '../../utils/lenis'
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

export interface Registration {
  id: number | string
  full_name?: string
  name?: string
  email?: string
  phone?: string
  nationality?: string
  country_of_residence?: string
  representing_country?: string
  player_category?: string
  category?: string
  playing_role?: string
  role?: string
  status?: string
  registration_status?: string  // alternate field name from some API versions
  registration_code?: string
  code?: string
  photo_url?: string
  photo?: string
  headshot_url?: string
  profile_photo_url?: string
  passport_url?: string
  action_shot_url?: string
  action_photo_url?: string
  created_at?: string
  date?: string
  [key: string]: unknown
}

function PlayerAvatar({
  photoUrl,
  name
}: {
  photoUrl?: string | null
  name?: string
}) {
  const [src, setSrc] = useState<string>(normalizeMediaUrl(photoUrl || ''))
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setSrc(normalizeMediaUrl(photoUrl || ''))
    setLoaded(false)
    setError(false)
  }, [photoUrl])

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const initials = (name || '')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || 'PL'

  return (
    <div className="apl-player-avatar-mini apl-avatar-wrap">
      {src && !error ? (
        <>
          {!loaded && <div className="apl-avatar-shimmer" />}
          <img
            ref={imgRef}
            src={src}
            alt={name || 'Player'}
            className={`apl-avatar-img ${loaded ? 'loaded' : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
            decoding="async"
          />
        </>
      ) : (
        <div className="apl-avatar-fallback">{initials}</div>
      )}
    </div>
  )
}

interface AdminRegistrationsTableProps {
  isLoading: boolean
  paginated: Registration[]
  filtered: Registration[]
  onViewPlayer: (reg: Registration, playerList?: Registration[]) => void
  adminToken: string
  safeCurrentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  totalPages: number
  totalCount?: number
  itemsPerPage: number
  setItemsPerPage: (num: number) => void
}

export function AdminRegistrationsTable({
  isLoading,
  paginated,
  filtered,
  onViewPlayer,
  adminToken: _adminToken,
  safeCurrentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  setItemsPerPage
}: AdminRegistrationsTableProps) {
  const effectiveTotal = totalCount ?? filtered.length
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const scrollToTableTop = () => {
    requestAnimationFrame(() => {
      scrollToElement(tableContainerRef.current, -90, false)
    })
  }

  return (
    <>
      {/* ── TABLE VIEW ── */}
      <div ref={tableContainerRef} className="apl-admin-table-card">
        <div className="apl-table-responsive">
          <table className="apl-admin-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th>PLAYER &amp; IDENTITY</th>
                <th>REG CODE</th>
                <th>CATEGORY</th>
                <th>PLAYING ROLE</th>
                <th>STATUS</th>
                <th className="th-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i} className="apl-admin-row apl-admin-row-skel">
                    <td colSpan={7}>
                      <div className="apl-skeleton-bar" />
                    </td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="apl-td-empty">
                    <div className="apl-empty-state-wrap">
                      <Users size={36} className="apl-empty-icon" />
                      <div className="apl-empty-title">No Player Registrations Match Your Filter</div>
                      <p className="apl-empty-sub">
                        Try broadening your search query or selecting a different category/status tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    id={`player-row-${reg.id || reg.registration_code}`}
                    className="apl-admin-row"
                    onClick={() => onViewPlayer(reg, filtered)}
                    title="Click to view complete player dossier"
                  >
                    <td className="td-num">
                      {(safeCurrentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="td-player">
                      <div className="apl-player-cell">
                        <PlayerAvatar
                          photoUrl={
                            reg.photo_url ||
                            (reg as any).photo ||
                            (reg as any).photoUrl ||
                            (reg as any).headshot_image_url ||
                            (reg as any).headshot_url ||
                            (reg as any).profile_photo_url ||
                            reg.passport_url ||
                            (reg as any).passportUrl ||
                            reg.action_shot_url ||
                            (reg as any).avatar ||
                            (reg as any).image_url
                          }
                          name={reg.full_name}
                        />
                        <div className="apl-player-text">
                          <div className="apl-player-name-row">
                            <span className="apl-player-full-name">{reg.full_name || '—'}</span>
                            {reg.nationality && (
                              <span className="apl-player-nat-tag">{reg.nationality}</span>
                            )}
                          </div>
                          <div className="apl-player-contact-sub">
                            <span className="apl-player-sub-email">{reg.email || '—'}</span>
                            {reg.phone && (
                              <span className="apl-player-sub-phone">· {reg.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-code">
                      <span className="apl-code-chip">
                        {reg.registration_code || `APL-${reg.id}`}
                      </span>
                    </td>
                    <td className="td-category">
                      <span className={`apl-cat-badge cat-${(reg.player_category || 'emerging').toLowerCase()}`}>
                        {reg.player_category 
                          ? reg.player_category.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                          : 'Emerging'}
                      </span>
                    </td>
                    <td className="td-role">
                      <span className="apl-role-chip">{reg.playing_role || '—'}</span>
                    </td>
                    <td className="td-status">
                      <span className={`apl-status-pill ${statusClass(reg.status || reg.registration_status)}`}>
                        {formatStatus(reg.status || reg.registration_status)}
                      </span>
                    </td>

                    <td className="td-action" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="apl-btn-table-action"
                        onClick={() => onViewPlayer(reg, filtered)}
                        title="Inspect Player Details"
                      >
                        <span>Inspect</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION CONTROLS ── */}
      {!isLoading && effectiveTotal > 0 && (
        <div className="apl-pagination-bar">
          <div className="apl-pagination-count">
            Showing <strong>{Math.min((safeCurrentPage - 1) * itemsPerPage + 1, effectiveTotal)}</strong> –{' '}
            <strong>{Math.min(safeCurrentPage * itemsPerPage, effectiveTotal)}</strong> of{' '}
            <strong>{effectiveTotal}</strong> cricketers
          </div>

          <div className="apl-pagination-nav">
            <button
              type="button"
              className="apl-page-nav-btn"
              disabled={safeCurrentPage === 1}
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1))
                scrollToTableTop()
              }}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <div className="apl-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="apl-page-dots">…</span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`apl-page-number-btn ${safeCurrentPage === p ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(p as number)
                        scrollToTableTop()
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              type="button"
              className="apl-page-nav-btn"
              disabled={safeCurrentPage === totalPages}
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1))
                scrollToTableTop()
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="apl-per-page-selector">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value))
                scrollToTableTop()
              }}
              className="apl-per-page-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </>
  )
}
