import { useState, useEffect, useCallback } from 'react'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'
import { clearAdminCaches } from './adminUtils'
import { AdminPlayerDetail } from './AdminPlayerDetail'
import { scrollToTop } from '../../utils/lenis'
import { refreshAdminToken, isJwtExpiringSoon } from '../../config/api'

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

  const handleLogout = useCallback(() => {
    clearAdminCaches()
    localStorage.removeItem('apl_admin_token')
    localStorage.removeItem('apl_admin_email')
    localStorage.removeItem('apl_admin_role')
    localStorage.removeItem('apl_admin_refresh_token')
    setAuthToken(null)
    setAdminEmail('')
    setSelectedPlayer(null)
    setView('login')
  }, [])

  // On mount: check stored session token, renew if expiring/expired, or redirect
  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      const storedToken = localStorage.getItem('apl_admin_token')
      const storedEmail = localStorage.getItem('apl_admin_email')

      if (!storedToken) {
        if (isMounted) setIsVerifying(false)
        return
      }

      // If token is expiring within 5 minutes (or already expired), attempt silent renewal
      if (isJwtExpiringSoon(storedToken, 300)) {
        const renewedToken = await refreshAdminToken()
        if (!isMounted) return

        if (renewedToken) {
          setAuthToken(renewedToken)
          setAdminEmail(storedEmail || '')
          setView('dashboard')
          setIsVerifying(false)
          return
        }

        // If renewal failed and stored token is completely expired, log out
        if (isJwtExpiringSoon(storedToken, 0)) {
          handleLogout()
          setIsVerifying(false)
          return
        }
      }

      if (isMounted) {
        setAuthToken(storedToken)
        setAdminEmail(storedEmail || '')
        setView('dashboard')
        setIsVerifying(false)
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [handleLogout])

  // Periodic background check: auto-renew token every 45 seconds if within 5 min of expiry
  useEffect(() => {
    if (!authToken || view === 'login') return

    const interval = setInterval(async () => {
      const currentToken = localStorage.getItem('apl_admin_token') || authToken
      if (isJwtExpiringSoon(currentToken, 300)) {
        const renewed = await refreshAdminToken()
        if (renewed) {
          setAuthToken(renewed)
        } else if (isJwtExpiringSoon(currentToken, 0)) {
          // If token is fully expired and cannot be renewed, logout safely
          handleLogout()
        }
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [authToken, view, handleLogout])

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
