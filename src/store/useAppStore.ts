import { create } from 'zustand'

export type PageName =
  | 'home'
  | 'about'
  | 'news'
  | 'blog-detail'
  | 'teams'
  | 'fixtures'
  | 'points-table'
  | 'moments'
  | 'gallery'
  | 'partnerships'
  | 'contact'
  | 'register-player'
  | 'player-register'
  | 'register-status'
  | 'player-video'
  | 'acb-governance'
  | 'league-faq'
  | 'media-kit'
  | 'admin-login'
  | 'admin-dashboard'
  | 'privacy-policy'

interface AppState {
  currentPage: PageName
  mobileMenuOpen: boolean
  launchMuted: boolean
  side1Muted: boolean
  side2Muted: boolean
  side3Muted: boolean
  setCurrentPage: (page: PageName) => void
  setMobileMenuOpen: (open: boolean) => void
  setLaunchMuted: (muted: boolean) => void
  setSide1Muted: (muted: boolean) => void
  setSide2Muted: (muted: boolean) => void
  setSide3Muted: (muted: boolean) => void
}

export const HASH_PAGE_MAP: Record<string, PageName> = {
  '#about': 'about',
  '#news': 'news',
  '#teams': 'teams',
  '#gallery': 'gallery',
  '#fixtures': 'fixtures',
  '#points-table': 'points-table',
  '#partnerships': 'partnerships',
  '#contact-us': 'contact',
  '#contact': 'contact',
  '#register-player': 'register-player',
  '#register': 'register-player',
  '#register-status': 'register-status',
  '#status': 'register-status',
  '#player-video': 'player-video',
  '#video-upload': 'player-video',
  '#introduction-video': 'player-video',
  '#video': 'player-video',
  '#admin': 'admin-login',
  '#admin-login': 'admin-login',
  '#admin-dashboard': 'admin-dashboard',
  '#privacy-policy': 'privacy-policy',
}

export function getInitialPage(): PageName {
  if (typeof window === 'undefined') return 'home'
  const rawHash = window.location.hash
  const hash = rawHash ? rawHash.split('?')[0].split('&')[0] : ''
  if (hash.startsWith('#blog/')) return 'blog-detail'
  return HASH_PAGE_MAP[hash] || 'home'
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: getInitialPage(),
  mobileMenuOpen: false,
  launchMuted: true,
  side1Muted: true,
  side2Muted: true,
  side3Muted: true,
  setCurrentPage: (page) => set({ currentPage: page }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setLaunchMuted: (muted) => set({ launchMuted: muted }),
  setSide1Muted: (muted) => set({ side1Muted: muted }),
  setSide2Muted: (muted) => set({ side2Muted: muted }),
  setSide3Muted: (muted) => set({ side3Muted: muted }),
}))
