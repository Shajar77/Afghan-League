import { useState } from 'react'
import { buildApiUrl } from '../../config/api'
import { IS_MOCK_AUTH_ENABLED, MOCK_TOKEN, MOCK_EMAIL, MOCK_PASSWORD } from './mockData'
import aplLogo from '../../assets/Asset 2@2x.png'
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, X } from 'lucide-react'
import './AdminLogin.css'

interface AdminLoginProps {
  onLoginSuccess: (token: string, email: string, isMock?: boolean) => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Check mock credentials in DEV/explicitly enabled mock mode
    if (
      IS_MOCK_AUTH_ENABLED &&
      MOCK_EMAIL &&
      MOCK_PASSWORD &&
      email.trim().toLowerCase() === MOCK_EMAIL.toLowerCase() &&
      password === MOCK_PASSWORD
    ) {
      localStorage.setItem('apl_admin_token', MOCK_TOKEN)
      localStorage.setItem('apl_admin_email', email.trim())
      localStorage.setItem('apl_admin_is_mock', 'true')
      setIsLoading(false)
      onLoginSuccess(MOCK_TOKEN, email.trim(), true)
      return
    }

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
        if (token) {
          localStorage.setItem('apl_admin_token', token)
          localStorage.setItem('apl_admin_email', email.trim())
          if (data.refresh_token) {
            localStorage.setItem('apl_admin_refresh_token', data.refresh_token)
          }
          localStorage.removeItem('apl_admin_is_mock')
          onLoginSuccess(token, email.trim(), false)
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
