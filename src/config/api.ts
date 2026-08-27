export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-staging.chaptersquare.com/api/v1'

export const getApiToken = (): string => {
  return import.meta.env.VITE_API_TOKEN || ''
}

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export const normalizeMediaUrl = (path?: string | null): string => {
  if (!path || typeof path !== 'string') return ''
  
  const trimmed = path.trim()
  
  // Disallow javascript:, vbscript:, or non-image data schemes
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) {
    return ''
  }
  if (lower.startsWith('data:') && !lower.startsWith('data:image/')) {
    return ''
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/src/') ||
    trimmed.startsWith('/@fs/') ||
    trimmed.startsWith('@fs/')
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
