import { useState, useEffect } from 'react'
import { COUNTRIES } from '../../constants/countries'
import { buildApiUrl, publicFetch } from '../../config/api'
import { categoriesList } from '../registration/types'
import type { ApiCategory, ApiAvailability } from '../registration/types'

export const API_PLAYER_STATUSES = [
  'Afghanistan (National)',
  'Afghanistan (Domestic)',
  'Overseas (National)',
  'Overseas (Domestic)',
  'Emerging Player (Domestic)',
]

export const API_PLAYING_ROLES = [
  'Batter',
  'Wicketkeeper-Batter',
  'Bowler',
  'All Rounder (Batting)',
  'All Rounder (Bowling)',
]

const DEFAULT_AVAILABILITIES: ApiAvailability[] = [
  { key: 'full', label: 'Available for full season' },
  { key: 'selected', label: 'Available for selected dates' },
  { key: 'national', label: 'Subject to national-team commitments' },
  { key: 'release', label: 'Subject to club or franchise release' },
]

// Price and description fallback maps (keyed by lowercase name)
const PRICE_MAP: Record<string, string> = {
  'platinum': '$50,000', 'platinum player': '$50,000',
  'diamond': '$35,000', 'diamond player': '$35,000',
  'gold': '$20,000', 'gold player': '$20,000',
  'silver': '$10,000', 'silver player': '$10,000',
  'emerging': '$5,000', 'emerging under-25': '$5,000', 'emerging under 25': '$5,000', 'emerging under-23': '$5,000', 'emerging under 23-25': '$5,000', 'emerging player': '$5,000',
}

const DESC_MAP: Record<string, string> = {
  'platinum': 'Top-tier performers', 'platinum player': 'Top-tier performers',
  'diamond': 'Established talent', 'diamond player': 'Established talent',
  'gold': 'Strong domestic record', 'gold player': 'Strong domestic record',
  'silver': 'Rising performers', 'silver player': 'Rising performers',
  'emerging': 'Afghan National Players Emerging Talent', 'emerging under-25': 'Afghan National Players Emerging Talent', 'emerging under 25': 'Afghan National Players Emerging Talent', 'emerging under-23': 'Afghan National Players Emerging Talent', 'emerging under 23-25': 'Afghan National Players Emerging Talent', 'emerging player': 'Afghan National Players Emerging Talent',
}

export function useRegisterData() {
  const [apiCountries, setApiCountries] = useState<string[]>(COUNTRIES)
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>(categoriesList)
  const [apiAvailabilities, setApiAvailabilities] = useState<ApiAvailability[]>(DEFAULT_AVAILABILITIES)

  // Fetch nationalities from API, fall back to static COUNTRIES list
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const url = buildApiUrl('/nationalities')
        const res = await publicFetch(url)
        if (res.ok) {
          const json = await res.json()
          const data = Array.isArray(json) ? json : (json.data || [])
          if (Array.isArray(data)) {
            const names = data
              .map((item: any) => (typeof item === 'string' ? item : item.name))
              .filter(Boolean)
            if (names.length > 0) {
              setApiCountries(names.sort((a: string, b: string) => a.localeCompare(b)))
            }
          }
        }
      } catch {
        // Silently fall back to static nationality list
      }
    }
    fetchNationalities()
  }, [])

  // Fetch player categories and availabilities from API, fall back to hardcoded values
  useEffect(() => {
    const extractList = (json: any): any[] => {
      const data = Array.isArray(json) ? json : (json.data || [])
      return Array.isArray(data) ? data : []
    }
    const toName = (item: any): string =>
      typeof item === 'string' ? item : (item.name || '')

    // Fetch player categories
    publicFetch(buildApiUrl('/player-categories'))
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(json => {
        const items = extractList(json)
        if (items.length > 0) {
          const mapped = items
            .map((item: any) => {
              const name = toName(item)
              const key = name.toLowerCase()
              const label = key.includes('emerging') ? 'Emerging Under-25' : name
              return {
                id: name,
                label: label,
                desc: DESC_MAP[key] || (typeof item === 'object' ? item.description : '') || 'Afghan National Players Emerging Talent',
                price: PRICE_MAP[key] || (typeof item === 'object' ? item.price : '') || '$5,000',
              }
            })
            .filter(c => c.id)
          if (mapped.length > 0) setApiCategories(mapped)
        }
      })
      .catch(() => {})

    // Fetch player availabilities
    publicFetch(buildApiUrl('/player-availabilities'))
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(json => {
        const items = extractList(json)
        if (items.length > 0) {
          const mapped = items
            .map((item: any) => {
              const name = toName(item)
              const key = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '')
              return { key, label: name }
            })
            .filter(a => a.key)
          if (mapped.length > 0) setApiAvailabilities(mapped)
        }
      })
      .catch(() => {})
  }, [])

  return {
    apiCountries,
    apiCategories,
    apiAvailabilities,
    apiPlayerStatuses: API_PLAYER_STATUSES,
    apiPlayingRoles: API_PLAYING_ROLES,
  }
}
