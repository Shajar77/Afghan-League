import {
  Search,
  SlidersHorizontal,
  Star,
  Globe,
  Calendar,
  X,
  Download,
  Camera,
  Loader2
} from 'lucide-react'
import { formatStatus } from './adminUtils'

interface AdminFiltersBarProps {
  search: string
  setSearch: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  statusFilters: string[]
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  categoryFilters: string[]
  nationalityFilter: string
  setNationalityFilter: (val: string) => void
  uniqueNationalities: string[]
  dateFrom: string
  setDateFrom: (val: string) => void
  dateTo: string
  setDateTo: (val: string) => void
  hasActiveFilters: boolean | string
  clearAllFilters: () => void
  filteredCount: number
  totalCount: number
  handleExportXLSX: () => void
  isExportingXLSX: boolean
  handleExportPhotos: () => void
  isExportingPhotos: boolean
}

export function AdminFiltersBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  statusFilters,
  categoryFilter,
  setCategoryFilter,
  categoryFilters,
  nationalityFilter,
  setNationalityFilter,
  uniqueNationalities,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  hasActiveFilters,
  clearAllFilters,
  filteredCount,
  totalCount,
  handleExportXLSX,
  isExportingXLSX,
  handleExportPhotos,
  isExportingPhotos
}: AdminFiltersBarProps) {
  return (
    <>
      {/* ── HEADER ACTION ROW ── */}
      <section id="player-registrations-section" className="apl-admin-section-header">
        <div className="apl-admin-header-title">
          <h2 className="apl-admin-h2">
            PLAYER <span>REGISTRATIONS</span>
          </h2>
          <p className="apl-admin-h2-sub">
            Showing {filteredCount} of {totalCount} registered cricketers
          </p>
        </div>

        <div className="apl-export-buttons-group">
          <button
            type="button"
            className="apl-export-excel-btn"
            onClick={handleExportXLSX}
            disabled={isExportingXLSX || totalCount === 0}
            title="Download full player dossier spreadsheet as Excel (.xlsx) from server"
          >
            {isExportingXLSX ? (
              <>
                <Loader2 size={16} className="apl-btn-spin" />
                <span>EXPORTING...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>EXPORT EXCEL (.XLSX)</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="apl-export-excel-btn"
            onClick={handleExportPhotos}
            disabled={isExportingPhotos || totalCount === 0}
            title="Download ZIP folder of all player photos from server"
          >
            {isExportingPhotos ? (
              <>
                <Loader2 size={16} className="apl-btn-spin" />
                <span>EXPORTING PHOTOS...</span>
              </>
            ) : (
              <>
                <Camera size={16} />
                <span>EXPORT PHOTOS (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── ADVANCED FILTERS BAR ── */}
      <section className="apl-admin-filter-panel">
        <div className="apl-filter-row">
          {/* Search */}
          <div className="apl-search-box">
            <Search size={17} className="apl-search-icon" />
            <input
              type="text"
              placeholder="Search name or registration code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="apl-search-clear"
                onClick={() => setSearch('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="apl-select-wrap">
            <SlidersHorizontal size={14} className="apl-select-icon" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="apl-filter-select"
            >
              {statusFilters.map(s => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : `Status: ${formatStatus(s)}`}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="apl-select-wrap">
            <Star size={14} className="apl-select-icon" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="apl-filter-select"
            >
              {categoryFilters.map(c => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : `Category: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Nationality Filter */}
          <div className="apl-select-wrap">
            <Globe size={14} className="apl-select-icon" />
            <select
              value={nationalityFilter}
              onChange={e => setNationalityFilter(e.target.value)}
              className="apl-filter-select"
            >
              <option value="All">All Nationalities</option>
              {uniqueNationalities.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="apl-date-range-box">
            <Calendar size={14} className="apl-date-icon" />
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              placeholder="From"
              className="apl-date-input"
            />
            <span className="apl-date-sep">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              placeholder="To"
              className="apl-date-input"
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              className="apl-filter-reset-btn"
              onClick={clearAllFilters}
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </section>
    </>
  )
}
