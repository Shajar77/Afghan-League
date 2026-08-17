import React, { useState, useEffect, useCallback } from 'react'
import { buildApiUrl } from '../../config/api'
import { MOCK_TOKEN } from './mockData'
import {
  Users,
  UserPlus,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import './UserManagement.css'

interface UserManagementProps {
  onLogout: () => void
}

interface AdminUser {
  id?: string | number
  name: string
  email: string
  role: string
  status?: string
  created_at?: string
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Administrator' },
  { value: 'content_editor', label: 'Content Editor' },
  { value: 'media_manager', label: 'Media Manager' },
  { value: 'league_ops', label: 'League Operations' }
]

export function UserManagement({ onLogout }: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('league_ops')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)


  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const token = localStorage.getItem('apl_admin_token') || ''

    if (token === MOCK_TOKEN) {
      await new Promise(r => setTimeout(r, 400))
      setUsers([
        { id: 1, name: 'System Admin', email: 'admin@apl-t20.com', role: 'super_admin', status: 'active' },
        { id: 2, name: 'Bilal Ghaffar - League Ops', email: 'bilal.ghaffar12@apl-t20.com', role: 'league_ops', status: 'active' },
        { id: 3, name: 'Safi Content', email: 'safi@apl-t20.com', role: 'content_editor', status: 'inactive' }
      ])
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(buildApiUrl('/users'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const json = await res.json()
      if (res.ok) {
        const data = Array.isArray(json) ? json : (json.data || json.users || [])
        setUsers(data)
      } else if (res.status === 401) {
        onLogout()
      } else {
        setError(json.message || 'Failed to retrieve system administrators.')
      }
    } catch {
      setError('Unable to reach user management services. Please check connection.')
    } finally {
      setIsLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (password.length < 8) {
      setSubmitError('Password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)

    const token = localStorage.getItem('apl_admin_token') || ''

    if (token === MOCK_TOKEN) {
      await new Promise(r => setTimeout(r, 600))
      const newUser: AdminUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        status: 'active'
      }
      setUsers(prev => [...prev, newUser])
      setSubmitSuccess(true)
      setName('')
      setEmail('')
      setPassword('')
      setRole('league_ops')
      setIsSubmitting(false)
      // Hide form after 1.5s success
      setTimeout(() => {
        setShowAddForm(false)
        setSubmitSuccess(false)
      }, 1500)
      return
    }

    try {
      const res = await fetch(buildApiUrl('/users'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role
        })
      })
      const json = await res.json()
      if (res.ok) {
        setSubmitSuccess(true)
        setName('')
        setEmail('')
        setPassword('')
        setRole('league_ops')
        fetchUsers()
        setTimeout(() => {
          setShowAddForm(false)
          setSubmitSuccess(false)
        }, 1500)
      } else {
        setSubmitError(json.error?.message || json.message || 'Failed to create user.')
      }
    } catch {
      setSubmitError('Unable to create user due to a connection issue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleBadgeClass = (roleVal: string) => {
    switch (roleVal) {
      case 'super_admin': return 'role-badge-super'
      case 'content_editor': return 'role-badge-content'
      case 'media_manager': return 'role-badge-media'
      case 'league_ops': return 'role-badge-ops'
      default: return 'role-badge-default'
    }
  }

  const getRoleLabel = (roleVal: string) => {
    const opt = ROLE_OPTIONS.find(o => o.value === roleVal)
    return opt ? opt.label : roleVal
  }

  return (
    <div className="apl-user-mgmt-container">
      {/* View Header */}
      <div className="apl-user-mgmt-header">
        <div>
          <h1 className="apl-user-mgmt-title">SYSTEM ADMINISTRATORS</h1>
          <p className="apl-user-mgmt-subtitle">Manage administrative accounts, operators and permissions</p>
        </div>
        {!showAddForm && (
          <button
            type="button"
            className="apl-add-user-btn"
            onClick={() => setShowAddForm(true)}
          >
            <UserPlus size={16} />
            <span>CREATE NEW USER</span>
          </button>
        )}
      </div>

      <div className="apl-user-mgmt-grid">
        {/* Left Side: Users List Card */}
        <div className={`apl-user-list-card ${showAddForm ? 'split-view' : 'full-view'}`}>
          <div className="apl-user-card-heading-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} className="apl-user-icon-decor" />
              <span className="apl-card-heading">Active Operators</span>
            </div>
          </div>
          <div className="apl-card-divider" />

          {isLoading ? (
            <div className="apl-user-loading-state">
              <Loader2 className="apl-loading-spinner" />
              <span>Fetching Admin Users...</span>
            </div>
          ) : error ? (
            <div className="apl-user-error-banner">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="apl-user-empty-state">
              <Users size={40} />
              <span>No administrative users found.</span>
            </div>
          ) : (
            <div className="apl-user-table-wrapper">
              <table className="apl-user-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ASSIGNED ROLE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr, i) => (
                    <tr key={usr.id || i} className="apl-user-row">
                      <td className="apl-user-cell-name">
                        <span>{usr.name}</span>
                      </td>
                      <td className="apl-user-cell-email">{usr.email}</td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(usr.role)}`}>
                          {getRoleLabel(usr.role)}
                        </span>
                      </td>
                      <td>
                        <span className={`apl-user-status-text ${(usr.status || 'active') === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {(usr.status || 'active') === 'active' ? 'Active' : 'Not Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Create User Form Card (Shows conditionally) */}
        {showAddForm && (
          <div className="apl-user-form-card">
            <div className="apl-form-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} className="apl-form-icon-decor" />
                <span className="apl-card-heading">Create Account</span>
              </div>
              <button
                type="button"
                className="apl-form-close-btn"
                onClick={() => {
                  setShowAddForm(false)
                  setSubmitError(null)
                  setSubmitSuccess(false)
                }}
              >
                ✕
              </button>
            </div>
            <div className="apl-card-divider" />

            <form onSubmit={handleCreateUser} className="apl-create-user-form">
              {submitError && (
                <div className="apl-form-error-banner">
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="apl-form-success-banner">
                  <span>Administrator Account Created Successfully!</span>
                </div>
              )}

              <div className="apl-form-input-group">
                <label>Full Name</label>
                <div className="apl-form-input-box">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ghaffar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="apl-form-input-group">
                <label>Email Address</label>
                <div className="apl-form-input-box">
                  <Mail size={16} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@apl-t20.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="apl-form-input-group">
                <label>Password</label>
                <div className="apl-form-input-box">
                  <Lock size={16} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="apl-form-input-group">
                <label>Assigned Permission Role</label>
                <div className="apl-form-input-box select-box">
                  <Shield size={16} />
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    disabled={isSubmitting}
                  >
                    {ROLE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="apl-form-submit-btn"
                disabled={isSubmitting || !name || !email || !password}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="apl-btn-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
