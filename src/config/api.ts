export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-staging.chaptersquare.com/api/v1'

export const getApiToken = (): string => {
  return import.meta.env.VITE_API_TOKEN || ''
}

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export const normalizeMediaUrl = (path?: string | null): string => {
  if (!path) return ''
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('/src/') ||
    path.startsWith('/@fs/') ||
    path.startsWith('@fs/')
  ) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  try {
    const origin = new URL(API_BASE_URL).origin
    return `${origin}${cleanPath}`
  } catch {
    const domainBase = API_BASE_URL.replace(/\/api(\/v\d+)?.*$/, '')
    return `${domainBase}${cleanPath}`
  }
}
