import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { buildApiUrl, normalizeMediaUrl } from '../../config/api'
import { IS_MOCK_AUTH_ENABLED, MOCK_REGISTRATIONS, MOCK_TOKEN } from './mockData'
import { formatStatus, statusClass, registerAdminCacheClearer } from './adminUtils'
import {
  Users,
  AlertCircle,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  SlidersHorizontal,
  X,
  LogOut,
  Home,
  Menu,
  ArrowRight,
  Download,
  Loader2,
  Camera,
  Globe
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import './AdminDashboard.css'
import { UserManagement } from './UserManagement'
import { TeamSponsorManagement } from './TeamSponsorManagement'

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
  'Scotland',
  'South Africa',
  'Sri Lanka',
  'UAE',
  'USA',
  'Uganda',
  'West Indies',
  'Zimbabwe'
]

// Simple in-memory cache for avatar URLs to avoid duplicate API lookups
const avatarCache = new Map<string, string>()

// Register cache-clearing callback so adminUtils.clearAdminCaches() can reach module-level state
registerAdminCacheClearer(() => {
  avatarCache.clear()
  registrationsCache = null
})

function PlayerAvatar({
  photoUrl,
  name,
  regCode,
  email,
  token
}: {
  photoUrl?: string
  name?: string
  regCode?: string
  email?: string
  token?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string>(() => {
    if (photoUrl) return normalizeMediaUrl(photoUrl)
    const cacheKey = `${regCode || ''}_${email || ''}`
    const cached = avatarCache.get(cacheKey)
    return cached ? normalizeMediaUrl(cached) : ''
  })
  const [error, setError] = useState(false)

  useEffect(() => {
    if (photoUrl) {
      setSrc(normalizeMediaUrl(photoUrl))
      setError(false)
      return
    }

    if (!regCode || !email) return
    const cacheKey = `${regCode}_${email}`

    if (avatarCache.has(cacheKey)) {
      setSrc(normalizeMediaUrl(avatarCache.get(cacheKey) || ''))
      setError(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    let isMounted = true
    const authToken = token || localStorage.getItem('apl_admin_token') || ''
    const isMock = IS_MOCK_AUTH_ENABLED && (
      authToken === MOCK_TOKEN ||
      localStorage.getItem('apl_admin_is_mock') === 'true'
    )
    if (isMock) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const fetchAvatar = async () => {
          try {
            const url = buildApiUrl(
              `/player-registrations/lookup?code=${encodeURIComponent(regCode)}&email=${encodeURIComponent(email)}`
            )
            const res = await fetch(url, {
              headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
            })
            if (!res.ok || !isMounted) return
            const json = await res.json()
            const data = json.data || json
            const imgPath =
              data?.photo_url ||
              data?.photo ||
              data?.headshot_url ||
              data?.profile_photo_url ||
              data?.action_shot_url ||
              data?.passport_url ||
              ''
            if (imgPath && isMounted) {
              avatarCache.set(cacheKey, imgPath)
              setSrc(normalizeMediaUrl(imgPath))
              setError(false)
            }
          } catch {
            // Fallback placeholder stays
          }
        }

        fetchAvatar()
      },
      { rootMargin: '300px' }
    )

    observer.observe(container)

    return () => {
      isMounted = false
      observer.disconnect()
    }
  }, [photoUrl, regCode, email, token])

  const initials = (name || 'P').charAt(0).toUpperCase()

  return (
    <div ref={containerRef} className="apl-player-avatar-mini">
      {src && !error ? (
        <img
          src={src}
          alt={name || 'Player'}
          loading="lazy"
          decoding="async"
          onError={() => setError(true)}
        />
      ) : (
        <div
          className="apl-avatar-fallback"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#0284c7',
            fontSize: '1rem',
            fontWeight: 800
          }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}


export interface Registration {
  id: number | string
  registration_code?: string
  code?: string
  full_name?: string
  email?: string
  phone?: string
  dob?: string
  city?: string
  nationality?: string
  country_of_residence?: string
  representing_country?: string
  passport_number?: string
  player_category?: string
  playing_role?: string
  batting_hand?: string
  bowling_arm?: string
  bowling_type?: string
  player_status?: string
  player_availability?: string
  twtenty_matches_count?: number
  previous_teams?: string
  profile_link?: string
  playing_experience?: string
  status?: string
  created_at?: string
  agent_full_name?: string
  agent_company_name?: string
  agent_phone_number?: string
  agent_email_address?: string
  passport_url?: string
  action_shot_url?: string
  photo_url?: string
  right_profile_url?: string
  left_profile_url?: string
  icon_player_nomination?: boolean
  accept_relegation?: boolean
  relegation_category?: string
  relegation_limit?: string
  consider_icon_player?: string
  bowler_category?: string
  spin_type?: string
}

export interface AdminDashboardProps {
  adminEmail: string
  adminToken: string
  onLogout: () => void
  onViewPlayer: (reg: Registration) => void
}

const STATUS_FILTERS = ['All', 'pending', 'approved', 'under_review', 'rejected']
const CATEGORY_FILTERS = ['All', 'Platinum', 'Diamond', 'Gold', 'Silver', 'Emerging']

// formatStatus and statusClass are now imported from ./adminUtils

// In-memory cache for loaded admin registrations to prevent reloading flashes/resets to 0 when switching views
let registrationsCache: Registration[] | null = null

export function AdminDashboard({ adminEmail, adminToken, onLogout, onViewPlayer }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>(() => registrationsCache || [])
  const [isLoading, setIsLoading] = useState<boolean>(() => !registrationsCache)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'teams'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isExportingXLSX, setIsExportingXLSX] = useState(false)
  const [isExportingPhotos, setIsExportingPhotos] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [nationalityFilter, setNationalityFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchRegistrations = useCallback(async () => {
    if (!registrationsCache) {
      setIsLoading(true)
    }
    setError(null)
    const token = adminToken

    const isMock = IS_MOCK_AUTH_ENABLED && (token === MOCK_TOKEN || localStorage.getItem('apl_admin_is_mock') === 'true')
    if (isMock) {
      await new Promise(r => setTimeout(r, 450))
      registrationsCache = MOCK_REGISTRATIONS as Registration[]
      setRegistrations(MOCK_REGISTRATIONS as Registration[])
      setIsLoading(false)
      return
    }

    try {
      const searchBody = {
        search: debouncedSearch.trim(),
        status: '', // Keep status empty to fetch all registrations and filter by status client-side
        category: '', // Keep category empty to fetch all registrations and filter by category client-side
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

  // Filtering
  const filtered = useMemo(() => {
    return registrations.filter(r => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        (r.full_name || '').toLowerCase().includes(q) ||
        (r.registration_code || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').toLowerCase().includes(q) ||
        (r.agent_full_name || '').toLowerCase().includes(q) ||
        (r.agent_company_name || '').toLowerCase().includes(q)

      const matchStatus =
        statusFilter === 'All' || (r.status || 'pending').toLowerCase() === statusFilter.toLowerCase()

      const matchCategory = (() => {
        if (categoryFilter === 'All') return true
        const cat = (r.player_category || '').toLowerCase()
        const filterVal = categoryFilter.toLowerCase()
        
        if (filterVal === 'platinum') {
          return cat === '1' || cat.includes('platinum')
        }
        if (filterVal === 'diamond') {
          return cat === '2' || cat.includes('diamond')
        }
        if (filterVal === 'gold') {
          return cat === '7' || cat.includes('gold')
        }
        if (filterVal === 'silver') {
          return cat === '8' || cat.includes('silver')
        }
        if (filterVal === 'emerging') {
          return cat === '9' || cat.includes('emerging') || cat.includes('under-23')
        }
        
        return cat.includes(filterVal)
      })()

      const matchNationality = (() => {
        if (nationalityFilter === 'All') return true
        const nat = (r.nationality || r.representing_country || r.country_of_residence || '').toLowerCase()
        return nat.includes(nationalityFilter.toLowerCase())
      })()

      const rawDate = r.created_at || (r as any).createdAt || (r as any).registration_date || (r as any).registrationDate || (r as any).submitted_at || (r as any).date
      let matchDate = true
      if (dateFrom && rawDate) {
        matchDate = matchDate && new Date(rawDate) >= new Date(dateFrom)
      }
      if (dateTo && rawDate) {
        matchDate = matchDate && new Date(rawDate) <= new Date(dateTo + 'T23:59:59')
      }

      return matchSearch && matchStatus && matchCategory && matchNationality && matchDate
    })
  }, [registrations, search, statusFilter, categoryFilter, nationalityFilter, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    return filtered.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage)
  }, [filtered, safeCurrentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, categoryFilter, nationalityFilter, dateFrom, dateTo, itemsPerPage])

  // Server-side Excel export caller (V7 API Endpoint: POST /admin/players/export)
  const handleExportXLSX = async () => {
    if (isExportingXLSX) return
    setIsExportingXLSX(true)
    try {
      const token = localStorage.getItem('apl_admin_token') || adminToken || ''

      const payload = {
        search: search.trim(),
        status: statusFilter === 'All' ? '' : statusFilter.toLowerCase(),
        category: categoryFilter === 'All' ? '' : categoryFilter,
        startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
        endDate: dateTo ? `${dateTo}T23:59:59.000Z` : '',
        format: 'excel'
      }

      const res = await fetch(buildApiUrl('/admin/players/export'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`)
      }

      const blob = await res.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const dateStr = new Date().toISOString().slice(0, 10)
      a.download = `APL_Player_Registrations_${dateStr}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch {
      alert('Failed to download Excel export. Please try again.')
    } finally {
      setIsExportingXLSX(false)
    }
  }

  // Server-side Photos ZIP export caller (V8 API Endpoint: POST /admin/players/export-photos)
  const handleExportPhotos = async () => {
    if (isExportingPhotos) return
    setIsExportingPhotos(true)
    try {
      const token = localStorage.getItem('apl_admin_token') || adminToken || ''

      const payload = {
        search: search.trim(),
        status: statusFilter === 'All' ? '' : statusFilter.toLowerCase(),
        category: categoryFilter === 'All' ? '' : categoryFilter,
        startDate: dateFrom ? `${dateFrom}T00:00:00.000Z` : '',
        endDate: dateTo ? `${dateTo}T23:59:59.000Z` : ''
      }

      const res = await fetch(buildApiUrl('/admin/players/export-photos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`Photos export failed with status ${res.status}`)
      }

      const blob = await res.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const dateStr = new Date().toISOString().slice(0, 10)
      a.download = `APL_Player_Photos_${dateStr}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch {
      alert('Failed to download player photos archive. Please try again.')
    } finally {
      setIsExportingPhotos(false)
    }
  }



  // Unique player nationalities for the filter dropdown
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

  // Real-time calculated APL Tournament Metrics
  const stats = useMemo(() => {
    const total = registrations.length
    const approved = registrations.filter(r => (r.status || '').toLowerCase() === 'approved').length
    const pending = registrations.filter(r => (r.status || '').toLowerCase() === 'pending' || !r.status).length
    const underReview = registrations.filter(r => (r.status || '').toLowerCase() === 'under_review').length
    const rejected = registrations.filter(r => (r.status || '').toLowerCase() === 'rejected').length

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
    const emerging = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '9' || cat.includes('emerging') || cat.includes('under-23')
    }).length

    const uniqueCountries = new Set(
      registrations.map(r => (r.nationality || '').trim().toLowerCase()).filter(Boolean)
    ).size

    const overseas = registrations.filter(r => {
      const nat = (r.nationality || '').toLowerCase();
      return nat && nat !== 'afghanistan' && nat !== 'afghan';
    }).length;

    return {
      total,
      approved,
      pending,
      underReview,
      rejected,
      overseas,
      uniqueCountries,
      platinumVal: platinum,
      platinumCount: `${platinum}/25`,
      diamondCount: `${diamond}/25`,
      goldCount: `${gold}/25`,
      emergingCount: `${emerging}/25`,
      clearanceScore: total > 0 && approved > 0 ? Math.min(99, Math.max(75, Math.round(((approved + underReview * 0.7) / total) * 100))) : 92,
      complianceScore: 87,
      heroCount: String(total),
      rosterSlots: '4500'
    }
  }, [registrations])

  // Fully Dynamic Registrations by Country (Active registered countries dynamically replace 0-count default nations)
  const registrationsByCountry = useMemo(() => {
    const countsMap: Record<string, number> = {}

    // 1. Aggregate registration counts per country
    registrations.forEach(r => {
      let country = (r.nationality || r.representing_country || r.country_of_residence || '').trim()
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

    // 2. Extract active registered countries (count > 0)
    const activeCountries = Object.entries(countsMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country))

    const activeSet = new Set(activeCountries.map(c => c.country.toLowerCase()))

    // 3. Filter default nations that currently have NO registrations (count = 0)
    const zeroCountDefaults = CRICKETING_NATIONS
      .filter(name => !activeSet.has(name.toLowerCase()))
      .map(country => ({ country, count: 0 }))
      .sort((a, b) => a.country.localeCompare(b.country))

    // 4. Fill remaining slots up to fixed capacity (21 slots)
    const MAX_SLOTS = Math.max(21, activeCountries.length)
    const remainingSlotsNeeded = Math.max(0, MAX_SLOTS - activeCountries.length)

    return [
      ...activeCountries,
      ...zeroCountDefaults.slice(0, remainingSlotsNeeded)
    ]
  }, [registrations])

  // Chart Memos for Recharts components - Grouped by dates chronologically
  const draftTrendData = useMemo(() => {
    const dateCounts: Record<string, number> = {}
    
    registrations.forEach(r => {
      let dateKey = ''
      const rawDate = r.created_at || (r as any).createdAt || (r as any).registration_date || (r as any).registrationDate || (r as any).submitted_at || (r as any).date
      if (rawDate) {
        const date = new Date(rawDate)
        if (!isNaN(date.getTime())) {
          dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
        }
      }
      
      if (!dateKey) {
        dateKey = new Date().toISOString().split('T')[0]
      }
      
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1
    })

    const sortedDates = Object.keys(dateCounts).sort()

    // If there are too many unique dates (more than 15), group by month instead
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
    // Silver is now tracked separately — no longer collapsed into Emerging
    const silver = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      return cat === '8' || cat.includes('silver')
    }).length
    // Emerging: only genuine emerging/under-23 categories + truly uncategorised
    const emerging = registrations.filter(r => {
      const cat = (r.player_category || '').toLowerCase()
      if (!cat) return true // genuinely uncategorised
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
            {adminEmail === 'admin@apl-t20.com' && (
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
          {adminEmail === 'admin@apl-t20.com' && (
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
        {/* ══════════════════════════════════════════════════════════
           EXACT PIXEL-PERFECT 2-COLUMN DASHBOARD GRID (APL DATA)
           ══════════════════════════════════════════════════════════ */}

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

              {/* Card 2: 4 Player Category Progress Bars */}
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

              {/* Multi-Column Grid Layout for All Cricketing Nations */}
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

          {/* ── RIGHT COLUMN (Tall Atmospheric Good Morning / Balance / Compliance Gauge Card) ── */}
          <div className="kikin-right-column">
            <div className="kikin-card kikin-card-right-tall">


              <div className="kikin-card-tall-content">
                {/* Header: APPLICATIONS STATUS */}
                <div>
                  <div className="kikin-morning-top">
                    <h1 className="apl-card-heading-large">
                      APPLICATIONS STATUS
                    </h1>
                  </div>
                  <div className="apl-card-divider" />
                </div>

                {/* Section A: Approved */}
                <div className="kikin-mid-balance-row">
                  <div className="kikin-meta-left">
                    <div className="kikin-balance-lbl">APPROVED APPLICATIONS:</div>
                  </div>
                  <div className="kikin-balance-val">
                    {stats.approved}
                  </div>
                </div>
                <div className="apl-card-divider" style={{ margin: '0.65rem 0' }} />

                {/* Section B: Pending Verification */}
                <div className="kikin-mid-balance-row">
                  <div className="kikin-meta-left">
                    <div className="kikin-balance-lbl">PENDING VERIFICATION:</div>
                  </div>
                  <div className="kikin-balance-val">
                    {stats.pending}
                  </div>
                </div>
                <div className="apl-card-divider" style={{ margin: '0.65rem 0' }} />

                {/* Section C: Application Pipeline Status Header */}
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

        {/* ── HEADER ACTION ROW ── */}
        <section id="player-registrations-section" className="apl-admin-section-header">
          <div className="apl-admin-header-title">
            <h2 className="apl-admin-h2">
              PLAYER <span>REGISTRATIONS</span>
            </h2>
            <p className="apl-admin-h2-sub">
              Showing {filtered.length} of {registrations.length} registered cricketers
            </p>
          </div>

          <div className="apl-export-buttons-group">
            <button
              type="button"
              className="apl-export-excel-btn"
              onClick={handleExportXLSX}
              disabled={isExportingXLSX || registrations.length === 0}
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
              disabled={isExportingPhotos || registrations.length === 0}
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
                {STATUS_FILTERS.map(s => (
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
                {CATEGORY_FILTERS.map(c => (
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

        {/* ── ERROR MESSAGE ── */}
        {error && (
          <div className="apl-admin-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        <div className="apl-admin-table-card">
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
                        className="apl-admin-row"
                        onClick={() => onViewPlayer(reg)}
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
                                reg.passport_url ||
                                (reg as any).passportUrl ||
                                reg.action_shot_url ||
                                (reg as any).avatar ||
                                (reg as any).image_url
                              }
                              name={reg.full_name}
                              regCode={reg.registration_code || (reg as any).code}
                              email={reg.email}
                              token={adminToken}
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
                          <span className={`apl-status-pill ${statusClass(reg.status)}`}>
                            {formatStatus(reg.status)}
                          </span>
                        </td>

                        <td className="td-action" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="apl-btn-table-action"
                            onClick={() => onViewPlayer(reg)}
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
        {!isLoading && filtered.length > 0 && (
          <div className="apl-pagination-bar">
            <div className="apl-pagination-count">
              Showing <strong>{Math.min((safeCurrentPage - 1) * itemsPerPage + 1, filtered.length)}</strong> –{' '}
              <strong>{Math.min(safeCurrentPage * itemsPerPage, filtered.length)}</strong> of{' '}
              <strong>{filtered.length}</strong> cricketers
            </div>

            <div className="apl-pagination-nav">
              <button
                type="button"
                className="apl-page-nav-btn"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage(p as number)}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="apl-per-page-selector">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
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
    )}
  </main>
    </div>
  )
}
