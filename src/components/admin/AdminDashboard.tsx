import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { buildApiUrl } from '../../config/api'
import { registerAdminCacheClearer } from './adminUtils'
import { AdminStatsSection, type AdminStats } from './AdminStatsSection'
import { AdminFiltersBar } from './AdminFiltersBar'
import { AdminRegistrationsTable, type Registration } from './AdminRegistrationsTable'
import { UserManagement } from './UserManagement'
import { TeamSponsorManagement } from './TeamSponsorManagement'
import {
  AlertCircle,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react'
import './AdminDashboard.css'

export type { Registration }

const CRICKETING_NATIONS = [
  'Afghanistan',
  'Australia',
  'Bangladesh',
  'Canada',
  'England',
  'India',
  'Ireland',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Oman',
  'Pakistan',
  'Papua New Guinea',
  'Scotland',
  'South Africa',
  'Sri Lanka',
  'Uganda',
  'United Arab Emirates',
  'United States',
  'West Indies',
  'Zimbabwe'
]

const STATUS_FILTERS = ['All', 'pending', 'approved', 'under_review', 'rejected']
const CATEGORY_FILTERS = ['All', 'Platinum', 'Diamond', 'Gold', 'Silver', 'Emerging']

let registrationsCache: Registration[] | null = null

registerAdminCacheClearer(() => {
  registrationsCache = null
})

interface AdminDashboardProps {
  adminEmail: string
  adminToken: string
  onLogout: () => void
  onViewPlayer: (reg: Registration) => void
}

export function AdminDashboard({
  adminEmail: _adminEmail,
  adminToken,
  onLogout,
  onViewPlayer
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teams' | 'users'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine if the current admin token grants super_admin role (user management access)
  const isSuperAdmin = (() => {
    try {
      const token = adminToken || localStorage.getItem('apl_admin_token') || ''
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        const role = (payload.role || payload.roles?.[0] || '').toLowerCase()
        return role === 'super_admin' || role === 'superadmin' || role === 'admin'
      }
    } catch { /* invalid token format */ }
    return false
  })()

  // Data & Loading states
  const [registrations, setRegistrations] = useState<Registration[]>(() => registrationsCache || [])
  const [isLoading, setIsLoading] = useState(!registrationsCache)
  const [error, setError] = useState<string | null>(null)

  // Advanced Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [nationalityFilter, setNationalityFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Export states
  const [isExportingXLSX, setIsExportingXLSX] = useState(false)
  const [isExportingPhotos, setIsExportingPhotos] = useState(false)

  // Debounce search input
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 300)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [search])

  const fetchRegistrations = useCallback(async () => {
    if (!registrationsCache) {
      setIsLoading(true)
    }
    setError(null)
    const token = adminToken

    try {
      const searchBody = {
        search: debouncedSearch.trim(),
        status: '',
        category: '',
        startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
        endDate: dateTo ? `${dateTo}T23:59:59.000Z` : '',
        page: 1,
        limit: 50
      }

      const res = await fetch(buildApiUrl('/admin/players/search'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody)
      })
      const json = await res.json()
      if (res.ok) {
        const data = Array.isArray(json)
          ? json
          : (json.data?.players || json.data?.registrations || json.data || json.players || [])
        registrationsCache = data
        setRegistrations(data)
      } else if (res.status === 401) {
        onLogout()
      } else {
        setError(json.message || 'Failed to load registrations from backend server.')
        if (!registrationsCache) {
          setRegistrations([])
        }
      }
    } catch {
      setError('Network error: Unable to connect to administration server.')
      if (!registrationsCache) {
        setRegistrations([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [adminToken, onLogout, debouncedSearch, dateFrom, dateTo])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Filter Pipeline (Client-side)
  const filtered = useMemo(() => {
    return registrations.filter(r => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const fullName = (r.full_name || r.name || '').toLowerCase()
        const code = (r.registration_code || r.code || '').toLowerCase()
        const email = (r.email || '').toLowerCase()
        const nat = (r.nationality || '').toLowerCase()
        const role = (r.playing_role || r.role || '').toLowerCase()
        const cat = (r.player_category || r.category || '').toLowerCase()
        const matches =
          fullName.includes(q) ||
          code.includes(q) ||
          email.includes(q) ||
          nat.includes(q) ||
          role.includes(q) ||
          cat.includes(q)
        if (!matches) return false
      }

      // 2. Status Filter
      if (statusFilter !== 'All') {
        const itemStatus = (r.status || 'pending').toLowerCase()
        if (statusFilter === 'pending') {
          if (itemStatus !== 'pending' && itemStatus !== 'submitted' && itemStatus !== '') return false
        } else if (itemStatus !== statusFilter.toLowerCase()) {
          return false
        }
      }

      // 3. Category Filter
      if (categoryFilter !== 'All') {
        const cat = (r.player_category || r.category || '').toLowerCase()
        const target = categoryFilter.toLowerCase()
        if (target === 'platinum' && !cat.includes('platinum') && cat !== '1') return false
        if (target === 'diamond' && !cat.includes('diamond') && cat !== '2') return false
        if (target === 'gold' && !cat.includes('gold') && cat !== '7') return false
        if (target === 'silver' && !cat.includes('silver') && cat !== '8') return false
        if (target === 'emerging' && !cat.includes('emerging') && !cat.includes('under-23') && cat !== '9' && cat !== '') return false
      }

      // 4. Nationality Filter
      if (nationalityFilter !== 'All') {
        const nat = (r.nationality || r.representing_country || r.country_of_residence || '').toLowerCase()
        if (!nat.includes(nationalityFilter.toLowerCase())) return false
      }

      // 5. Date Range Filter
      if (dateFrom || dateTo) {
        const createdDate = r.created_at || (r as any).createdAt || (r as any).date
        if (createdDate) {
          const itemDate = new Date(createdDate)
          if (dateFrom) {
            const start = new Date(dateFrom)
            start.setHours(0, 0, 0, 0)
            if (itemDate < start) return false
          }
          if (dateTo) {
            const end = new Date(dateTo)
            end.setHours(23, 59, 59, 999)
            if (itemDate > end) return false
          }
        }
      }

      return true
    })
  }, [registrations, search, statusFilter, categoryFilter, nationalityFilter, dateFrom, dateTo])

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, safeCurrentPage, itemsPerPage])

  // Extract unique nationalities for dropdown
  const uniqueNationalities = useMemo(() => {
    const set = new Set<string>()
    registrations.forEach(r => {
      let nat = (r.nationality || r.representing_country || r.country_of_residence || '').trim()
      if (nat && nat !== '—' && nat.toLowerCase() !== 'none') {
        nat = nat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        set.add(nat)
      }
    })
    return Array.from(set).sort()
  }, [registrations])

  const hasActiveFilters = search || statusFilter !== 'All' || categoryFilter !== 'All' || nationalityFilter !== 'All' || dateFrom || dateTo

  const clearAllFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setCategoryFilter('All')
    setNationalityFilter('All')
    setDateFrom('')
    setDateTo('')
  }

  // Calculated Metrics
  const stats: AdminStats = useMemo(() => {
    const total = registrations.length
    const approved = registrations.filter(r => (r.status || '').toLowerCase() === 'approved').length
    const pending = registrations.filter(r => (r.status || '').toLowerCase() === 'pending' || !r.status).length
    const underReview = registrations.filter(r => (r.status || '').toLowerCase() === 'under_review').length
    const rejected = registrations.filter(r => (r.status || '').toLowerCase() === 'rejected').length

    const uniqueCountries = new Set(
      registrations.map(r => (r.nationality || '').trim().toLowerCase()).filter(Boolean)
    ).size

    const overseas = registrations.filter(r => {
      const nat = (r.nationality || '').toLowerCase()
      return nat && nat !== 'afghanistan' && nat !== 'afghan'
    }).length

    return {
      total,
      approved,
      pending,
      underReview,
      rejected,
      overseas,
      uniqueCountries
    }
  }, [registrations])

  // Dynamic Country Registrations
  const registrationsByCountry = useMemo(() => {
    const countsMap: Record<string, number> = {}

    registrations.forEach(r => {
      const country = (r.nationality || r.representing_country || r.country_of_residence || '').trim()
      if (!country || country === '—' || country.toLowerCase() === 'none') return

      const norm = country.toLowerCase()
      let stdName = country
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')

      if (norm.includes('pakistan')) stdName = 'Pakistan'
      else if (norm.includes('afghanistan')) stdName = 'Afghanistan'
      else if (norm.includes('australia')) stdName = 'Australia'
      else if (norm.includes('bangladesh')) stdName = 'Bangladesh'
      else if (norm.includes('england') || norm.includes('uk')) stdName = 'England'
      else if (norm.includes('india')) stdName = 'India'
      else if (norm.includes('ireland')) stdName = 'Ireland'
      else if (norm.includes('zealand')) stdName = 'New Zealand'
      else if (norm.includes('south africa')) stdName = 'South Africa'
      else if (norm.includes('sri lanka')) stdName = 'Sri Lanka'
      else if (norm.includes('west indies')) stdName = 'West Indies'
      else if (norm.includes('zimbabwe')) stdName = 'Zimbabwe'
      else if (norm.includes('emirates') || norm.includes('uae')) stdName = 'UAE'
      else if (norm.includes('states') || norm.includes('usa')) stdName = 'USA'

      countsMap[stdName] = (countsMap[stdName] || 0) + 1
    })

    const activeCountries = Object.entries(countsMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country))

    const activeSet = new Set(activeCountries.map(c => c.country.toLowerCase()))

    const zeroCountDefaults = CRICKETING_NATIONS
      .filter(name => !activeSet.has(name.toLowerCase()))
      .map(country => ({ country, count: 0 }))
      .sort((a, b) => a.country.localeCompare(b.country))

    const MAX_SLOTS = Math.max(21, activeCountries.length)
    const remainingSlotsNeeded = Math.max(0, MAX_SLOTS - activeCountries.length)

    return [
      ...activeCountries,
      ...zeroCountDefaults.slice(0, remainingSlotsNeeded)
    ]
  }, [registrations])

  // Draft Trend Data for Chart
  const draftTrendData = useMemo(() => {
    const dateCounts: Record<string, number> = {}

    registrations.forEach(r => {
      let dateKey = ''
      const rawDate = r.created_at || (r as any).createdAt || (r as any).registration_date || (r as any).registrationDate || (r as any).submitted_at || (r as any).date
      if (rawDate) {
        const date = new Date(rawDate)
        if (!isNaN(date.getTime())) {
          dateKey = date.toISOString().split('T')[0]
        }
      }

      if (!dateKey) {
        dateKey = new Date().toISOString().split('T')[0]
      }

      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1
    })

    const sortedDates = Object.keys(dateCounts).sort()

    if (sortedDates.length > 15) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      const monthlyCounts = Array(12).fill(0)

      registrations.forEach(r => {
        const dateStr = r.created_at
        if (dateStr) {
          const date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            const monthIdx = date.getMonth()
            monthlyCounts[monthIdx]++
          }
        } else {
          monthlyCounts[7]++
        }
      })

      let cumulative = 0
      const trend = months.map((month, idx) => {
        cumulative += monthlyCounts[idx]
        return { name: month, value: cumulative }
      })

      const currentMonthIdx = new Date().getMonth()
      const endIdx = Math.max(4, currentMonthIdx)
      return trend.slice(0, endIdx + 1)
    }

    if (sortedDates.length === 1) {
      const singleDateStr = sortedDates[0]
      const singleDate = new Date(singleDateStr)
      const list = []

      for (let i = 4; i >= 0; i--) {
        const prevDate = new Date(singleDate)
        prevDate.setDate(singleDate.getDate() - i)
        const prevDateStr = prevDate.toISOString().split('T')[0]
        list.push({
          dateStr: prevDateStr,
          count: prevDateStr === singleDateStr ? dateCounts[singleDateStr] : 0
        })
      }

      let cumulative = 0
      return list.map(item => {
        cumulative += item.count
        const dObj = new Date(item.dateStr)
        const formattedLabel = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return { name: formattedLabel, value: cumulative }
      })
    }

    let cumulative = 0
    return sortedDates.map(dateStr => {
      cumulative += dateCounts[dateStr]
      const dObj = new Date(dateStr)
      const formattedLabel = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return { name: formattedLabel, value: cumulative }
    })
  }, [registrations])

  // Category Chart Breakdown Data
  const categoryChartData = useMemo(() => {
    const platinum = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '1' || cat.includes('platinum')
    }).length
    const diamond = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '2' || cat.includes('diamond')
    }).length
    const gold = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '7' || cat.includes('gold')
    }).length
    const silver = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '8' || cat.includes('silver')
    }).length
    const emerging = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      if (!cat) return true
      return cat === '9' || cat.includes('emerging') || cat.includes('under-23')
    }).length

    return [
      { name: 'PLATINUM', value: platinum, fill: '#3DDF4B' },
      { name: 'DIAMOND', value: diamond, fill: '#3DDF4B' },
      { name: 'GOLD', value: gold, fill: '#3DDF4B' },
      { name: 'SILVER', value: silver, fill: '#3DDF4B' },
      { name: 'EMERGING', value: emerging, fill: '#3DDF4B' },
    ]
  }, [registrations])

  // Excel (.XLSX) Export Handler
  const handleExportXLSX = async () => {
    if (isExportingXLSX) return
    setIsExportingXLSX(true)

    try {
      const token = adminToken || localStorage.getItem('apl_admin_token') || ''
      const res = await fetch(buildApiUrl('/admin/players/export'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: search.trim(),
          status: statusFilter === 'All' ? '' : statusFilter,
          category: categoryFilter === 'All' ? '' : categoryFilter,
          startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
          endDate: dateTo ? `${dateTo}T23:59:59.000Z` : ''
        })
      })

      if (!res.ok) {
        throw new Error('Export service returned an error.')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `APL_Player_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      setError('Unable to download Excel export. Please try again.')
    } finally {
      setIsExportingXLSX(false)
    }
  }

  // Photos (.ZIP) Export Handler
  const handleExportPhotos = async () => {
    if (isExportingPhotos) return
    setIsExportingPhotos(true)

    try {
      const token = adminToken || localStorage.getItem('apl_admin_token') || ''
      const res = await fetch(buildApiUrl('/admin/players/export-photos'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: search.trim(),
          status: statusFilter === 'All' ? '' : statusFilter,
          category: categoryFilter === 'All' ? '' : categoryFilter,
          startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
          endDate: dateTo ? `${dateTo}T23:59:59.000Z` : ''
        })
      })

      if (!res.ok) {
        throw new Error('Photo export service returned an error.')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `APL_Player_Photos_${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      setError('Unable to download Photos ZIP export. Please try again.')
    } finally {
      setIsExportingPhotos(false)
    }
  }

  return (
    <div className="apl-admin-dashboard-layout">
      {/* ── TOP ADMIN COMPACT HEADER & LOGOUT ── */}
      <header className="apl-admin-top-bar">
        <div className="apl-admin-top-inner">
          <div className="apl-admin-brand-left">
            <img src="/apl-logo.png" alt="APL Logo" className="apl-admin-top-logo" />
          </div>

          {/* Top Navigation Tabs */}
          <div className="apl-admin-nav-tabs desktop-only-nav">
            <button
              type="button"
              className={`apl-admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Player Registrations
            </button>
            <button
              type="button"
              className={`apl-admin-nav-tab ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              Teams & Sponsors
            </button>
            {isSuperAdmin && (
              <button
                type="button"
                className={`apl-admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                User Management
              </button>
            )}
          </div>

          <div className="apl-admin-brand-right desktop-only-nav">
            <button
              type="button"
              className="apl-btn-back-home"
              onClick={() => {
                window.location.hash = ''
              }}
              title="Go back to public website"
            >
              <Home size={14} />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              className="apl-btn-red-logout"
              onClick={onLogout}
              title="Sign out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="menu-toggle-btn mobile-only-nav"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="apl-admin-brand-left">
            <img src="/apl-logo.png" alt="APL Logo" className="apl-admin-top-logo" />
          </div>
          <button
            type="button"
            className="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <button
              type="button"
              className={`mobile-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard')
                setMobileMenuOpen(false)
              }}
            >
              Player Registrations
            </button>
          </li>
          <li className="mobile-nav-item">
            <button
              type="button"
              className={`mobile-nav-link ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('teams')
                setMobileMenuOpen(false)
              }}
            >
              Teams & Sponsors
            </button>
          </li>
          {isSuperAdmin && (
            <li className="mobile-nav-item">
              <button
                type="button"
                className={`mobile-nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('users')
                  setMobileMenuOpen(false)
                }}
              >
                User Management
              </button>
            </li>
          )}
          <li className="mobile-nav-item">
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => {
                setMobileMenuOpen(false)
                window.location.hash = ''
              }}
            >
              Back to Home
            </button>
          </li>
          <li className="mobile-nav-item">
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => {
                setMobileMenuOpen(false)
                onLogout()
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <main className="apl-admin-main-container">
        {activeTab === 'users' ? (
          <UserManagement onLogout={onLogout} />
        ) : activeTab === 'teams' ? (
          <TeamSponsorManagement onLogout={onLogout} />
        ) : (
          <>
            {/* 1. KPI Cards & Trends Charts */}
            <AdminStatsSection
              stats={stats}
              draftTrendData={draftTrendData}
              categoryChartData={categoryChartData}
              registrationsByCountry={registrationsByCountry}
            />

            {/* 2. Filters & Export Actions */}
            <AdminFiltersBar
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              statusFilters={STATUS_FILTERS}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categoryFilters={CATEGORY_FILTERS}
              nationalityFilter={nationalityFilter}
              setNationalityFilter={setNationalityFilter}
              uniqueNationalities={uniqueNationalities}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              hasActiveFilters={Boolean(hasActiveFilters)}
              clearAllFilters={clearAllFilters}
              filteredCount={filtered.length}
              totalCount={registrations.length}
              handleExportXLSX={handleExportXLSX}
              isExportingXLSX={isExportingXLSX}
              handleExportPhotos={handleExportPhotos}
              isExportingPhotos={isExportingPhotos}
            />

            {/* Error banner */}
            {error && (
              <div className="apl-admin-error-box">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* 3. Registrations Data Table & Pagination */}
            <AdminRegistrationsTable
              isLoading={isLoading}
              paginated={paginated}
              filtered={filtered}
              onViewPlayer={onViewPlayer}
              adminToken={adminToken}
              safeCurrentPage={safeCurrentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </>
        )}
      </main>
    </div>
  )
}
