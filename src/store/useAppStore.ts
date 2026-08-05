import { create } from 'zustand'

interface AppState {
  currentPage: string
  mobileMenuOpen: boolean
  launchMuted: boolean
  side1Muted: boolean
  side2Muted: boolean
  side3Muted: boolean
  setCurrentPage: (page: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setLaunchMuted: (muted: boolean) => void
  setSide1Muted: (muted: boolean) => void
  setSide2Muted: (muted: boolean) => void
  setSide3Muted: (muted: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
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
