export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.apl-t20.com/api/v1'

export const getApiToken = (): string => {
  // Only use the stored admin session token — never fall back to a build-time JWT env var
  return localStorage.getItem('apl_admin_token') || ''
}

export const getRefreshToken = (): string => {
  return localStorage.getItem('apl_admin_refresh_token') || ''
}

/**
 * Checks if a JWT token is expired or within threshold seconds of expiring.
 * Defaults to 5 minutes (300 seconds) threshold for proactive renewal.
 */
export const isJwtExpiringSoon = (token: string, thresholdSeconds = 300): boolean => {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && typeof payload.exp === 'number') {
      const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000)
      return remainingSeconds <= thresholdSeconds
    }
  } catch {
    // If parsing fails, consider it expired/invalid
    return true
  }
  return false
}

// Shared promise to prevent concurrent duplicate refresh requests
let refreshPromise: Promise<string | null> | null = null

/**
 * Silently renews the admin JWT access token using the stored refresh token.
 * Returns the new access token on success, or null if renewal fails.
 */
export const refreshAdminToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  // If a refresh is already in progress, reuse the active promise
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(buildApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        const data = json.data || json
        const newAccessToken = data.access_token || data.token || ''
        const newRefreshToken = data.refresh_token || ''

        if (newAccessToken) {
          localStorage.setItem('apl_admin_token', newAccessToken)
          if (newRefreshToken) {
            localStorage.setItem('apl_admin_refresh_token', newRefreshToken)
          }
          return newAccessToken
        }
      }

      // If refresh failed (e.g. refresh token expired or invalid), return null
      return null
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

/**
 * Enhanced fetch wrapper for admin requests. Automatically attempts a silent
 * token refresh and retries the request once if a 401 Unauthorized occurs.
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = getApiToken()

  // Proactively refresh if token is within 60s of expiration
  if (token && isJwtExpiringSoon(token, 60)) {
    const freshToken = await refreshAdminToken()
    if (freshToken) token = freshToken
  }

  const headers = new Headers(options.headers || {})
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let res = await fetch(url, { ...options, headers })

  // If unauthorized (401), attempt a silent refresh and retry the request once
  if (res.status === 401) {
    const refreshedToken = await refreshAdminToken()
    if (refreshedToken) {
      const retryHeaders = new Headers(options.headers || {})
      retryHeaders.set('Authorization', `Bearer ${refreshedToken}`)
      res = await fetch(url, { ...options, headers: retryHeaders })
    }
  }

  return res
}

/**
 * Fetch wrapper for public player registration, contact, newsletter, and lookup endpoints.
 * Public endpoints do not require administrative session tokens.
 */
export const publicFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  return fetch(url, { ...options, headers })
}

const stripControlChars = (str: string): string => {
  return str
    .split('')
    .filter(c => {
      const code = c.charCodeAt(0)
      return !(code <= 31 || (code >= 127 && code <= 159))
    })
    .join('')
    .trim()
}

export const normalizeMediaUrl = (path?: string | null): string => {
  if (!path || typeof path !== 'string') return ''
  
  const trimmed = stripControlChars(path)
  if (!trimmed) return ''
  
  // Disallow dangerous or unexpected URI schemes
  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('about:')
  ) {
    return ''
  }
  if (lower.startsWith('data:') && !lower.startsWith('data:image/')) {
    return ''
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  try {
    const origin = new URL(API_BASE_URL).origin
    return `${origin}${cleanPath}`
  } catch {
    const domainBase = API_BASE_URL.replace(/\/api(\/v\d+)?.*$/, '')
    return `${domainBase}${cleanPath}`
  }
}

/**
 * Validates and safely normalizes an external URL.
 * Ensures the URL only uses http: or https: protocols and rejects dangerous schemes (javascript:, data:, vbscript:).
 */
export const safeExternalUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') return ''

  const trimmed = stripControlChars(url)
  if (!trimmed) return ''

  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('about:')
  ) {
    return ''
  }

  const fullUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(fullUrl)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href
    }
  } catch {
    // Malformed URL
  }

  return ''
}

