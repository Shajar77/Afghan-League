import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { buildApiUrl, authFetch } from '../../config/api'
import {
  getAdminStatusCountsCache,
  setAdminStatusCountsCache,
  getAdminRole,
  isSuperAdminUser,
  isRegistrationViewerUser,
  isPlayerManagementUser
} from './adminUtils'
import { AdminStatsSection, type AdminStats } from './AdminStatsSection'
import { AdminFiltersBar } from './AdminFiltersBar'
import { AdminRegistrationsTable, type Registration } from './AdminRegistrationsTable'
import { UserManagement } from './UserManagement'
import { TeamSponsorManagement } from './TeamSponsorManagement'
import {
  AlertCircle,
  LogOut,
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

const STATUS_FILTERS = ['All', 'pending', 'approved_draft', 'under_review', 'rejected']
const CATEGORY_FILTERS = ['All', 'Platinum Player', 'Diamond Player', 'Gold Player', 'Silver Player', 'Emerging Under-25']

interface AdminDashboardProps {
  adminEmail: string
  adminToken: string
  onLogout: () => void
  onViewPlayer: (reg: Registration, playerList?: Registration[]) => void
  returnToPlayer?: Registration | null
  onClearReturnToPlayer?: () => void
}

export function AdminDashboard({
  adminEmail: _adminEmail,
  adminToken,
  onLogout,
  onViewPlayer,
  returnToPlayer,
  onClearReturnToPlayer
}: AdminDashboardProps) {
  // Determine current admin role
  const adminRole = getAdminRole()
  const isSuperAdmin = isSuperAdminUser(adminRole)
  const isRegistrationViewer = isRegistrationViewerUser(adminRole)
  const isPlayerManagement = isPlayerManagementUser(adminRole)

  const [activeTab, setActiveTab] = useState<'dashboard' | 'teams' | 'users'>(() => {
    if (isSuperAdmin || isPlayerManagement) return 'dashboard'
    return 'teams'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Safety guard: Ensure users are restricted to their allowed tabs
  useEffect(() => {
    if (isPlayerManagement && activeTab !== 'dashboard') {
      setActiveTab('dashboard')
    } else if (!isSuperAdmin && !isPlayerManagement && activeTab === 'dashboard') {
      setActiveTab('teams')
    } else if (!isSuperAdmin && activeTab === 'users') {
      setActiveTab(isPlayerManagement ? 'dashboard' : 'teams')
    }
  }, [isSuperAdmin, isPlayerManagement, activeTab])

  // Data & Loading states
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // All players data — fetched once for charts/stats (not affected by pagination/filters)
  const [allPlayersData, setAllPlayersData] = useState<Registration[]>([])

  // Status counts (seeded from cache if present for 0ms transition)
  const [statusCounts, setStatusCounts] = useState(() => getAdminStatusCountsCache() || { pending: 0, approved: 0, underReview: 0, rejected: 0, total: 0 })

  // Advanced Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Pagination (server-side)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [serverTotalCount, setServerTotalCount] = useState(0)
  const [serverTotalPages, setServerTotalPages] = useState(1)

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
    setIsLoading(true)
    setError(null)

    try {
      const apiStatus = statusFilter === 'All' ? '' : statusFilter
      const apiCategory = categoryFilter === 'All' ? '' : categoryFilter

      const searchBody = {
        search: debouncedSearch.trim(),
        status: apiStatus,
        category: apiCategory,
        startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
        endDate: dateTo ? `${dateTo}T23:59:59.000Z` : '',
        page: currentPage,
        limit: itemsPerPage
      }

      const res = await authFetch(buildApiUrl('/admin/players/search'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody)
      })
      const json = await res.json()
      if (res.ok) {
        const rawData: any[] = Array.isArray(json)
          ? json
          : (json.data?.players || json.data?.registrations || json.data || json.players || [])

        const data: Registration[] = rawData.map((r: any) => ({
          ...r,
          status: r.status || r.registration_status || ''
        }))

        setRegistrations(data)

        // Read server pagination metadata
        const pagination = json.pagination || json.data?.pagination || {}
        const total = pagination.total ?? json.total ?? data.length
        const totalPages = pagination.totalPages ?? json.totalPages ?? Math.max(1, Math.ceil(total / itemsPerPage))
        setServerTotalCount(total)
        setServerTotalPages(totalPages)
      } else if (res.status === 401) {
        onLogout()
      } else {
        setError(json.message || 'Failed to load registrations from backend server.')
        setRegistrations([])
      }
    } catch {
      setError('Network error: Unable to connect to administration server.')
      setRegistrations([])
    } finally {
      setIsLoading(false)
    }
  }, [adminToken, onLogout, debouncedSearch, statusFilter, categoryFilter, dateFrom, dateTo, currentPage, itemsPerPage])

  // Fetch status counts from dedicated endpoint
  const fetchStatusCounts = useCallback(async () => {
    try {
      const res = await authFetch(buildApiUrl('/admin/players/status-counts'))
      if (!res.ok) return
      const json = await res.json()
      const arr: { status: string; count: number }[] = Array.isArray(json) ? json : (json.data || [])

      let pending = 0, approved = 0, underReview = 0, rejected = 0, total = 0
      arr.forEach(item => {
        const s = (item.status || '').toLowerCase()
        const c = item.count || 0
        total += c
        if (s === 'pending') pending = c
        else if (s === 'approved_draft' || s === 'approved') approved = c
        else if (s === 'under_review') underReview = c
        else if (s === 'rejected') rejected = c
      })

      const counts = { pending, approved, underReview, rejected, total }
      setAdminStatusCountsCache(counts)
      setStatusCounts(counts)
    } catch {
      // Silently fall back to cached/default counts
    }
  }, [adminToken])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Fetch status counts once on mount
  useEffect(() => {
    fetchStatusCounts()
  }, [fetchStatusCounts])

  // Fetch ALL players once on mount for charts/stats/dossier navigation (separate from paginated table fetch)
  const fetchAllPlayersForStats = useCallback(async () => {
    try {
      const res = await authFetch(buildApiUrl('/admin/players/search'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: '', status: '', category: '', startDate: '', endDate: '', page: 1, limit: 9999 })
      })
      if (!res.ok) return
      const json = await res.json()
      const raw: any[] = Array.isArray(json)
        ? json
        : (json.data?.players || json.data?.registrations || json.data || json.players || [])
      const mapped: Registration[] = raw.map((r: any) => ({
        ...r,
        status: r.status || r.registration_status || ''
      }))
      setAllPlayersData(mapped)
    } catch {
      // silently ignore — charts will just be empty
    }
  }, [adminToken])

  useEffect(() => {
    fetchAllPlayersForStats()
  }, [fetchAllPlayersForStats])

  // Server-side handles all filtering and pagination — registrations is already one page
  const totalPages = serverTotalPages
  const safeCurrentPage = currentPage

  const hasActiveFilters = Boolean(search || statusFilter !== 'All' || categoryFilter !== 'All' || dateFrom || dateTo)

  const clearAllFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setCategoryFilter('All')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  // Full list of players for Dossier navigation (filtered to match current dashboard filters if any)
  const dossierPlayersList = useMemo(() => {
    if (!allPlayersData || allPlayersData.length === 0) {
      return registrations
    }

    if (!hasActiveFilters) {
      return allPlayersData
    }

    const query = debouncedSearch.trim().toLowerCase()
    const sFilter = statusFilter.toLowerCase()
    const cFilter = categoryFilter.toLowerCase()

    const filtered = allPlayersData.filter(p => {
      // 1. Status Filter
      if (statusFilter !== 'All') {
        const pStatus = (p.status || (p as any).registration_status || '').toLowerCase()
        if (sFilter === 'approved') {
          if (pStatus !== 'approved' && pStatus !== 'approved_draft') return false
        } else if (pStatus !== sFilter) {
          return false
        }
      }

      // 2. Category Filter
      if (categoryFilter !== 'All') {
        const pCat = (p.player_category || p.category || '').toLowerCase()
        if (!pCat.includes(cFilter) && !cFilter.includes(pCat)) return false
      }

      // 3. Search (name, email, code, phone)
      if (query) {
        const name = (p.full_name || '').toLowerCase()
        const email = (p.email || '').toLowerCase()
        const code = String(p.registration_code || (p as any).code || '').toLowerCase()
        const phone = (p.phone || '').toLowerCase()
        if (!name.includes(query) && !email.includes(query) && !code.includes(query) && !phone.includes(query)) {
          return false
        }
      }

      // 4. Date Range
      if (dateFrom) {
        const regDate = p.created_at || (p as any).registration_date || ''
        if (regDate && new Date(regDate) < new Date(`${dateFrom}T00:00:00.000Z`)) {
          return false
        }
      }
      if (dateTo) {
        const regDate = p.created_at || (p as any).registration_date || ''
        if (regDate && new Date(regDate) > new Date(`${dateTo}T23:59:59.999Z`)) {
          return false
        }
      }

      return true
    })

    return filtered.length > 0 ? filtered : registrations
  }, [allPlayersData, registrations, hasActiveFilters, debouncedSearch, statusFilter, categoryFilter, dateFrom, dateTo])

  // Sync table page and scroll/highlight when returning from Player Dossier
  const pendingScrollPlayerRef = useRef<Registration | null>(null)

  const scrollAndHighlightRow = useCallback((player: Registration) => {
    requestAnimationFrame(() => {
      const rowId = `player-row-${player.id || player.registration_code}`
      const rowEl = document.getElementById(rowId)
      if (rowEl) {
        rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        rowEl.classList.remove('apl-row-highlight')
        void rowEl.offsetWidth
        rowEl.classList.add('apl-row-highlight')
      }
    })
  }, [])

  useEffect(() => {
    if (!returnToPlayer) return

    const playerCode = String(returnToPlayer.registration_code || (returnToPlayer as any).code || '').trim().toLowerCase()
    const playerId = returnToPlayer.id

    const listToSearch = dossierPlayersList.length > 0 ? dossierPlayersList : allPlayersData
    const playerIndex = listToSearch.findIndex(p => {
      if (playerId && p.id === playerId) return true
      const pCode = String(p.registration_code || (p as any).code || '').trim().toLowerCase()
      return Boolean(playerCode && pCode && playerCode === pCode)
    })

    if (playerIndex !== -1) {
      const targetPage = Math.floor(playerIndex / itemsPerPage) + 1
      pendingScrollPlayerRef.current = returnToPlayer
      if (currentPage !== targetPage) {
        setCurrentPage(targetPage)
      } else {
        scrollAndHighlightRow(returnToPlayer)
        pendingScrollPlayerRef.current = null
        onClearReturnToPlayer?.()
      }
    } else {
      scrollAndHighlightRow(returnToPlayer)
      onClearReturnToPlayer?.()
    }
  }, [returnToPlayer, dossierPlayersList, allPlayersData, itemsPerPage, currentPage, scrollAndHighlightRow, onClearReturnToPlayer])

  // Once table registrations load for the target page, scroll to and highlight the player
  useEffect(() => {
    if (!pendingScrollPlayerRef.current || registrations.length === 0 || isLoading) return
    const target = pendingScrollPlayerRef.current
    const exists = registrations.some(r => {
      if (target.id && r.id === target.id) return true
      const rCode = String(r.registration_code || (r as any).code || '').trim().toLowerCase()
      const tCode = String(target.registration_code || (target as any).code || '').trim().toLowerCase()
      return Boolean(rCode && tCode && rCode === tCode)
    })

    if (exists) {
      scrollAndHighlightRow(target)
      pendingScrollPlayerRef.current = null
      onClearReturnToPlayer?.()
    }
  }, [registrations, isLoading, scrollAndHighlightRow, onClearReturnToPlayer])


  // Calculated Metrics — use server-side statusCounts + allPlayersData for geo/overseas stats
  const stats: AdminStats = useMemo(() => {
    const total = statusCounts.total || serverTotalCount
    const uniqueCountries = new Set(
      allPlayersData.map(r => (r.nationality || '').trim().toLowerCase()).filter(Boolean)
    ).size
    const overseas = allPlayersData.filter(r => {
      const nat = (r.nationality || '').toLowerCase()
      return nat && nat !== 'afghanistan' && nat !== 'afghan'
    }).length
    return {
      total,
      approved: statusCounts.approved,
      pending: statusCounts.pending,
      underReview: statusCounts.underReview,
      rejected: statusCounts.rejected,
      overseas,
      uniqueCountries
    }
  }, [statusCounts, serverTotalCount, allPlayersData])

  // Dynamic Country Registrations
  const registrationsByCountry = useMemo(() => {
    const countsMap: Record<string, number> = {}

    allPlayersData.forEach(r => {
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
  }, [allPlayersData])

  // Draft Trend Data for Chart
  const draftTrendData = useMemo(() => {
    const dateCounts: Record<string, number> = {}

    allPlayersData.forEach(r => {
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

      allPlayersData.forEach(r => {
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
  }, [allPlayersData])

  // Category Chart Breakdown Data
  const categoryChartData = useMemo(() => {
    const platinum = allPlayersData.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '1' || cat.includes('platinum')
    }).length
    const diamond = allPlayersData.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '2' || cat.includes('diamond')
    }).length
    const gold = allPlayersData.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '7' || cat.includes('gold')
    }).length
    const silver = allPlayersData.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '8' || cat.includes('silver')
    }).length
    const emerging = allPlayersData.filter(r => {
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
  }, [allPlayersData])

  // Excel (.XLSX) Export Handler
  const handleExportXLSX = async () => {
    if (isExportingXLSX) return
    setIsExportingXLSX(true)

    try {
      const token = adminToken || localStorage.getItem('apl_admin_token') || ''
      const res = await authFetch(buildApiUrl('/admin/players/export'), {
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
          endDate: dateTo ? `${dateTo}T23:59:59.000Z` : '',
          format: 'excel'
        })
      })

      const contentType = res.headers.get('content-type') || ''
      if (!res.ok || contentType.includes('application/json')) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.message || json.error?.message || 'Export service returned an error.')
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
    } catch (err: any) {
      setError(err?.message || 'Unable to download Excel export. Please try again.')
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
      const res = await authFetch(buildApiUrl('/admin/players/export-photos'), {
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

      const contentType = res.headers.get('content-type') || ''
      if (!res.ok || contentType.includes('application/json')) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.message || json.error?.message || 'Photo export service returned an error.')
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
    } catch (err: any) {
      setError(err?.message || 'Unable to download Photos ZIP export. Please try again.')
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
            {(isSuperAdmin || isPlayerManagement) && (
              <button
                type="button"
                className={`apl-admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Player Registrations
              </button>
            )}
            {!isPlayerManagement && (
              <button
                type="button"
                className={`apl-admin-nav-tab ${activeTab === 'teams' ? 'active' : ''}`}
                onClick={() => setActiveTab('teams')}
              >
                Teams & Sponsors
              </button>
            )}
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
          {(isSuperAdmin || isPlayerManagement) && (
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
          )}
          {!isPlayerManagement && (
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
          )}
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
        {activeTab === 'users' && isSuperAdmin ? (
          <UserManagement onLogout={onLogout} />
        ) : activeTab === 'dashboard' && (isSuperAdmin || isPlayerManagement) ? (
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
              setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1) }}
              statusFilters={STATUS_FILTERS}
              categoryFilter={categoryFilter}
              setCategoryFilter={(val) => { setCategoryFilter(val); setCurrentPage(1) }}
              categoryFilters={CATEGORY_FILTERS}
              dateFrom={dateFrom}
              setDateFrom={(val) => { setDateFrom(val); setCurrentPage(1) }}
              dateTo={dateTo}
              setDateTo={(val) => { setDateTo(val); setCurrentPage(1) }}
              hasActiveFilters={Boolean(hasActiveFilters)}
              clearAllFilters={clearAllFilters}
              filteredCount={serverTotalCount}
              totalCount={statusCounts.total || serverTotalCount}
              handleExportXLSX={handleExportXLSX}
              isExportingXLSX={isExportingXLSX}
              handleExportPhotos={handleExportPhotos}
              isExportingPhotos={isExportingPhotos}
              hideExportButtons={isRegistrationViewer}
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
              paginated={registrations}
              filtered={dossierPlayersList}
              totalCount={serverTotalCount}
              onViewPlayer={onViewPlayer}
              adminToken={adminToken}
              safeCurrentPage={safeCurrentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(num) => { setItemsPerPage(num); setCurrentPage(1) }}
            />
          </>
        ) : (
          <TeamSponsorManagement onLogout={onLogout} />
        )}
      </main>
    </div>
  )
}
