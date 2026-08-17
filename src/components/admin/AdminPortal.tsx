import { useState, useEffect } from 'react'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'
import { AdminPlayerDetail } from './AdminPlayerDetail'
import { buildApiUrl } from '../../config/api'
import { MOCK_TOKEN, IS_MOCK_AUTH_ENABLED } from './mockData'
import { scrollToTop } from '../../utils/lenis'

type AdminView = 'login' | 'dashboard' | 'player-detail'

interface Registration {
  id: number | string
  [key: string]: unknown
}

export function AdminPortal() {
  const [view, setView] = useState<AdminView>('login')
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState<string>('')
  const [selectedPlayer, setSelectedPlayer] = useState<Registration | null>(null)
  // Prevents flashing the login screen while verifying an existing token
  const [isVerifying, setIsVerifying] = useState(true)

  // On mount: verify any stored token against the server before granting dashboard access.
  // This prevents the auth bypass where setting any string in localStorage shows the dashboard.
  useEffect(() => {
    const storedToken = localStorage.getItem('apl_admin_token')
    const storedEmail = localStorage.getItem('apl_admin_email')
    const isMock = localStorage.getItem('apl_admin_is_mock') === 'true'

    if (!storedToken) {
      setIsVerifying(false)
      return
    }

    // Mock tokens are only valid in DEV mode and bypass server verification
    if (IS_MOCK_AUTH_ENABLED && isMock && storedToken === MOCK_TOKEN) {
      setAuthToken(storedToken)
      setAdminEmail(storedEmail || '')
      setView('dashboard')
      setIsVerifying(false)
      return
    }

    // Real token — verify against the server before rendering the dashboard
    const verifyToken = async () => {
      try {
        const res = await fetch(buildApiUrl('/auth/me'), {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${storedToken}` }
        })
        if (res.ok) {
          const json = await res.json()
          const email = json.data?.email || json.email || storedEmail || ''
          setAuthToken(storedToken)
          setAdminEmail(email)
          if (email) localStorage.setItem('apl_admin_email', email)
          setView('dashboard')
        } else {
          // Token is expired or invalid — clear everything and show login
          handleLogout()
        }
      } catch {
        // Network error during verification — clear stale token to force re-login
        handleLogout()
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auth guard: if token disappears while viewing dashboard, redirect to login
  useEffect(() => {
    if (view !== 'login' && !authToken) {
      setView('login')
    }
  }, [view, authToken])

  const handleLoginSuccess = (token: string, email: string, isMock?: boolean) => {
    setAuthToken(token)
    setAdminEmail(email)
    if (isMock) {
      localStorage.setItem('apl_admin_is_mock', 'true')
    } else {
      localStorage.removeItem('apl_admin_is_mock')
    }
    setView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('apl_admin_token')
    localStorage.removeItem('apl_admin_email')
    localStorage.removeItem('apl_admin_refresh_token')
    localStorage.removeItem('apl_admin_is_mock')
    setAuthToken(null)
    setAdminEmail('')
    setSelectedPlayer(null)
    setView('login')
  }

  const handleViewPlayer = (reg: Registration) => {
    setSelectedPlayer(reg)
    setView('player-detail')
    scrollToTop(true)
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
    scrollToTop(true)
  }

  // Show a minimal loading state while verifying token — prevents dashboard flash
  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e1a',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: '"Big Shoulders Display", sans-serif',
        color: '#F8C800'
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(248, 200, 0, 0.2)',
          borderTopColor: '#F8C800',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '1rem', letterSpacing: '0.12em', color: '#94a3b8' }}>
          VERIFYING SESSION...
        </span>
      </div>
    )
  }

  if (view === 'login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  if (view === 'player-detail' && selectedPlayer) {
    return (
      <AdminPlayerDetail
        registration={selectedPlayer as Parameters<typeof AdminPlayerDetail>[0]['registration']}
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
        adminEmail={adminEmail}
      />
    )
  }

  return (
    <AdminDashboard
      adminEmail={adminEmail}
      adminToken={authToken || ''}
      onLogout={handleLogout}
      onViewPlayer={(reg) => handleViewPlayer(reg as Registration)}
    />
  )
}
