import { useState, useEffect } from 'react'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'
import { clearAdminCaches } from './adminUtils'
import { AdminPlayerDetail } from './AdminPlayerDetail'
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

  // On mount: check stored session token and verify expiration
  useEffect(() => {
    const storedToken = localStorage.getItem('apl_admin_token')
    const storedEmail = localStorage.getItem('apl_admin_email')

    if (!storedToken) {
      setIsVerifying(false)
      return
    }

    // Check if token is an expired JWT
    try {
      const parts = storedToken.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        if (payload.exp && typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000) {
          handleLogout()
          setIsVerifying(false)
          return
        }
      }
    } catch {
      // If token format cannot be parsed, let it pass to dashboard; subsequent API calls will 401 if invalid
    }

    setAuthToken(storedToken)
    setAdminEmail(storedEmail || '')
    setView('dashboard')
    setIsVerifying(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auth guard: if token disappears while viewing dashboard, redirect to login
  useEffect(() => {
    if (view !== 'login' && !authToken) {
      setView('login')
    }
  }, [view, authToken])

  const handleLoginSuccess = (token: string, email: string) => {
    setAuthToken(token)
    setAdminEmail(email)
    setView('dashboard')
  }

  const handleLogout = () => {
    clearAdminCaches()
    localStorage.removeItem('apl_admin_token')
    localStorage.removeItem('apl_admin_email')
    localStorage.removeItem('apl_admin_refresh_token')
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
