import { useState, useEffect } from 'react'
import { buildApiUrl } from '../../config/api'
import aplLogo from '../../assets/Asset 2@2x.png'
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, X } from 'lucide-react'
import './AdminLogin.css'

interface AdminLoginProps {
  onLoginSuccess: (token: string, email: string) => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Private Admin Access Check (Option B)
  const checkAdminPrivateAccess = () => {
    const fullUrl = window.location.href.toLowerCase()
    const token = localStorage.getItem('apl_admin_token')
    return (
      Boolean(token) ||
      fullUrl.includes('key=apl2026') ||
      fullUrl.includes('key=admin') ||
      fullUrl.includes('access=private') ||
      fullUrl.includes('access=admin') ||
      fullUrl.includes('apl2026') ||
      fullUrl.includes('admin') ||
      Boolean(localStorage.getItem('apl_private_admin_access'))
    )
  }

  const isAdminAuthorized = checkAdminPrivateAccess()

  useEffect(() => {
    if (isAdminAuthorized) {
      localStorage.setItem('apl_private_admin_access', 'true')
    }
  }, [isAdminAuthorized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const json = await res.json()

      if (res.ok) {
        const data = json.data || json
        const token = data.access_token || data.token || ''
        const userRole = (data.user?.role || data.role || data.roles?.[0] || '').toLowerCase()
        if (token) {
          localStorage.setItem('apl_admin_token', token)
          localStorage.setItem('apl_admin_email', email.trim())
          if (userRole) {
            localStorage.setItem('apl_admin_role', userRole)
          }
          if (data.refresh_token) {
            localStorage.setItem('apl_admin_refresh_token', data.refresh_token)
          }
          onLoginSuccess(token, email.trim())
          return
        }
      }

      setError(json.error?.message || json.message || 'Invalid email or password. Please try again.')
    } catch {
      setError('Unable to connect to backend server. Please verify your connection or try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdminAuthorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#040b1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          background: '#081438',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1.5px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            color: '#ef4444'
          }}>
            🛡️
          </div>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: '#ef4444',
            textTransform: 'uppercase',
            background: 'rgba(239, 68, 68, 0.12)',
            padding: '0.35rem 1rem',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            ADMIN PORTAL • RESTRICTED ACCESS
          </span>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.15,
            textTransform: 'uppercase'
          }}>
            ACCESS RESTRICTED
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.98rem',
            lineHeight: 1.7,
            color: '#94a3b8',
            margin: 0,
            maxWidth: '460px'
          }}>
            The APL Administration Portal is reserved exclusively for tournament officials and league management. Access requires valid administrative authorization parameters.
          </p>

          <a href="#home" style={{
            background: 'var(--brand-gold)',
            color: '#0f172a',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '0.85rem 2rem',
            borderRadius: '4px',
            textDecoration: 'none',
            marginTop: '0.5rem',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Back to Home Page
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="apl-admin-fullscreen-wrapper">
      {/* Top Right Close Button */}
      <a href="#home" className="apl-close-btn" aria-label="Close admin panel login">
        <X size={22} />
      </a>

      {/* ── LEFT COLUMN: VISUAL BRAND SHOWCASE ── */}
      <div className="apl-admin-left-showcase">
        {/* Subtle dark overlay */}
        <div className="apl-showcase-overlay" />

        {/* Top Logo (Left) */}
        <div className="apl-showcase-center-logo">
          <img src={aplLogo} alt="APL Logo" className="apl-showcase-logo-center" />
        </div>
      </div>

      {/* ── RIGHT COLUMN: CLEAN FORM ── */}
      <div className="apl-admin-right-form">
        {/* Ambient Glow Background */}
        <div className="apl-right-bg-animation" aria-hidden="true">
          <div className="apl-bg-glow-orb-1" />
          <div className="apl-bg-glow-orb-2" />
        </div>

        <div className="apl-form-center-box">

          <div className="apl-form-welcome-header">
            <h1 className="apl-welcome-title">APL ADMIN PANEL</h1>
            <p className="apl-welcome-sub">
              Welcome back! Please enter your admin credentials to sign in.
            </p>
          </div>

          {error && (
            <div className="apl-admin-alert" role="alert">
              <ShieldAlert size={18} className="apl-admin-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form className="apl-admin-clean-form" onSubmit={handleSubmit}>

            <div className="apl-clean-input-group">
              <label htmlFor="admin-email">EMAIL ADDRESS</label>
              <div className="apl-clean-input-box">
                <Mail size={18} className="apl-clean-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@apl-t20.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="apl-clean-input-group">
              <div className="apl-label-flex">
                <label htmlFor="admin-password">PASSWORD</label>
              </div>
              <div className="apl-clean-input-box">
                <Lock size={18} className="apl-clean-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="apl-toggle-pw-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="apl-clean-submit-btn"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <span className="apl-admin-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Clean Admin Footer */}
        <div className="apl-right-clean-footer">
          <p>© 2026 Afghanistan Cricket Board. Official APL T20 Administration Portal.</p>
        </div>
      </div>
    </div>
  )
}
