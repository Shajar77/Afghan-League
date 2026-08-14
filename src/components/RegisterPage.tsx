import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'
import { API_BASE_URL, buildApiUrl, getApiToken, normalizeMediaUrl } from '../config/api'
import type { FormData } from './registration/types'
import {
  initialFormData,
  categoriesList,
  validateFile
} from './registration/types'
import { Step1Personal } from './registration/Step1Personal'
import { Step2Cricket } from './registration/Step2Cricket'
import { Step3Category } from './registration/Step3Category'
import { Step4Uploads } from './registration/Step4Uploads'
import { Step5Review } from './registration/Step5Review'
import './RegisterPage.css'

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [refCode, setRefCode] = useState<string>('')
  const [draftSaved, setDraftSaved] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [fileMeta, setFileMeta] = useState<Record<string, { name: string; size: number }>>({})

  // Step 5 Consents
  const [consent1, setConsent1] = useState<boolean>(false)
  const [consent2, setConsent2] = useState<boolean>(false)
  const [consent3, setConsent3] = useState<boolean>(false)
  const [consent4, setConsent4] = useState<boolean>(false)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [apiCountries, setApiCountries] = useState<string[]>(COUNTRIES)

  // --- API-driven form option states (each falls back to hardcoded values) ---
  const [apiCategories, setApiCategories] = useState(categoriesList)
  const [apiAvailabilities, setApiAvailabilities] = useState<{ key: string; label: string }[]>([
    { key: 'full', label: 'Available for full season' },
    { key: 'selected', label: 'Available for selected dates' },
    { key: 'national', label: 'Subject to national-team commitments' },
    { key: 'release', label: 'Subject to club or franchise release' },
  ])
  const apiPlayerStatuses = [
    'Afghanistan (National)',
    'Afghanistan (Domestic)',
    'Overseas (National)',
    'Overseas (Domestic)',
    'Emerging Player (Domestic)',
  ]
  const apiPlayingRoles = [
    'Batter',
    'Wicketkeeper-Batter',
    'Bowler',
    'All Rounder (Batting)',
    'All Rounder (Bowling)',
  ]

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const url = buildApiUrl('/nationalities')
        const res = await fetch(url)
        if (res.ok) {
          const json = await res.json()
          const data = Array.isArray(json) ? json : (json.data || [])
          if (Array.isArray(data)) {
            const names = data.map((item: any) => typeof item === 'string' ? item : item.name).filter(Boolean)
            if (names.length > 0) {
              setApiCountries(names.sort((a: string, b: string) => a.localeCompare(b)))
              return
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch nationalities, falling back to static list', err)
      }
    }
    fetchNationalities()
  }, [])

  // Fetch player categories, availability, statuses, and playing roles from API
  useEffect(() => {
    const BASE = API_BASE_URL

    // Price and description fallback maps (keyed by lowercase name)
    const priceMap: Record<string, string> = {
      'platinum': '$50,000', 'platinum player': '$50,000',
      'diamond': '$35,000', 'diamond player': '$35,000',
      'gold': '$20,000', 'gold player': '$20,000',
      'silver': '$10,000', 'silver player': '$10,000',
      'emerging': '$5,000', 'emerging under-23': '$5,000',
    }
    const descMap: Record<string, string> = {
      'platinum': 'Top-tier performers', 'platinum player': 'Top-tier performers',
      'diamond': 'Established talent', 'diamond player': 'Established talent',
      'gold': 'Strong domestic record', 'gold player': 'Strong domestic record',
      'silver': 'Rising performers', 'silver player': 'Rising performers',
      'emerging': 'Afghan National Players Emerging Talent', 'emerging under-23': 'Afghan National Players Emerging Talent',
    }

    const extractList = (json: any): any[] => {
      const data = Array.isArray(json) ? json : (json.data || [])
      return Array.isArray(data) ? data : []
    }
    const toName = (item: any): string => typeof item === 'string' ? item : (item.name || '')

    // Fetch player categories
    fetch(`${BASE}/player-categories`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => {
        const items = extractList(json)
        if (items.length > 0) {
          const mapped = items.map((item: any) => {
            const name = toName(item)
            const key = name.toLowerCase()
            return {
              id: name,
              label: name,
              desc: descMap[key] || (typeof item === 'object' ? item.description : '') || '',
              price: priceMap[key] || (typeof item === 'object' ? item.price : '') || '',
            }
          }).filter(c => c.id)
          if (mapped.length > 0) setApiCategories(mapped)
        }
      })
      .catch(() => {})

    // Fetch player availabilities
    fetch(`${BASE}/player-availabilities`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => {
        const items = extractList(json)
        if (items.length > 0) {
          const mapped = items.map((item: any) => {
            const name = toName(item)
            const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
            return { key, label: name }
          }).filter(a => a.key)
          if (mapped.length > 0) setApiAvailabilities(mapped)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Disable native browser scroll restoration to prevent snapping to footer on refresh
    let previousScrollRestoration: ScrollRestoration = 'auto'
    if ('scrollRestoration' in window.history) {
      previousScrollRestoration = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
    }
    // Instantly scroll to top of page on mount
    const timer = setTimeout(() => {
      if ((window as any).lenis) {
        ; (window as any).lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }, 50)

    const savedStep = localStorage.getItem('apl_player_registration_step')
    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10)
      if (parsedStep >= 1 && parsedStep <= 5) {
        setCurrentStep(parsedStep)
      }
    }

    const saved = localStorage.getItem('apl_player_registration_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.availability && !Array.isArray(parsed.availability)) {
          parsed.availability = [parsed.availability]
        }
        if (typeof parsed.acceptRelegation === 'boolean') {
          parsed.acceptRelegation = parsed.acceptRelegation ? 'yes' : 'no'
        }
        setFormData(prev => ({
          ...prev,
          ...parsed,
          passportPhoto: null,
          passportScan: null,
          actionShot: null,
          rightProfilePhoto: null,
          leftProfilePhoto: null,
        }))
      } catch (e) {
        console.error('Failed to load draft from localStorage', e)
      }
    }

    const savedFileMeta = localStorage.getItem('apl_player_registration_file_meta')
    if (savedFileMeta) {
      try {
        setFileMeta(JSON.parse(savedFileMeta))
      } catch (e) {
        console.error('Failed to parse file metadata', e)
      }
    }

    setIsLoaded(true)

    return () => {
      clearTimeout(timer)
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestoration
      }
    }
  }, [])

  // Auto-save form data draft to localStorage on any input change
  useEffect(() => {
    if (!isLoaded) return // Skip auto-saving on initial render/mount to avoid race conditions
    const { passportPhoto: _pPhoto, passportScan: _pScan, actionShot: _aShot, rightProfilePhoto: _rPhoto, leftProfilePhoto: _lPhoto, ...serializable } = formData
    if (!isSubmitted) {
      localStorage.setItem('apl_player_registration_draft', JSON.stringify(serializable))
    }
  }, [formData, isSubmitted, isLoaded])

  // Auto-save current step to localStorage
  useEffect(() => {
    if (!isLoaded) return // Skip auto-saving on initial render/mount to avoid race conditions
    if (!isSubmitted) {
      localStorage.setItem('apl_player_registration_step', String(currentStep))
    }
  }, [currentStep, isSubmitted, isLoaded])

  const steps = [
    { id: 1, label: 'PERSONAL' },
    { id: 2, label: 'CRICKET' },
    { id: 3, label: 'CATEGORY' },
    { id: 4, label: 'UPLOADS' },
    { id: 5, label: 'REVIEW' },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (formData.regType === 'agent') {
        if (!formData.agentName.trim()) newErrors.agentName = 'Agent Full Name is required'
        if (!formData.agentPhone.trim()) {
          newErrors.agentPhone = 'Agent Phone number is required'
        } else if (!/^\+?[0-9\s\-()]{8,20}$/.test(formData.agentPhone)) {
          newErrors.agentPhone = 'Please enter a valid phone number (at least 8 digits)'
        }
        if (!formData.agentEmail.trim()) {
          newErrors.agentEmail = 'Agent Email address is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agentEmail)) {
          newErrors.agentEmail = 'Please enter a valid email address'
        }
      }

      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
      if (!formData.dob) {
        newErrors.dob = 'Date of Birth is required'
      } else {
        const birthDate = new Date(formData.dob)
        const today = new Date()
        if (birthDate >= today) {
          newErrors.dob = 'Date of Birth must be in the past'
        } else {
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          if (age < 15) {
            newErrors.dob = 'Player must be at least 15 years old to register'
          } else if (age > 75) {
            newErrors.dob = 'Please enter a valid Date of Birth'
          }
        }
      }
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required'
      if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport Number is required'
      if (!formData.countryResidence.trim()) newErrors.countryResidence = 'Country of Residence is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^\+?[0-9\s\-()]{8,20}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (at least 8 digits)'
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g. player@domain.com)'
      }
      if (!formData.availability || formData.availability.length === 0) {
        newErrors.availability = 'At least one availability option must be selected'
      }
    }

    if (step === 2) {
      if (!formData.playingRole) newErrors.playingRole = 'Playing Role is required'
      if (!formData.battingHand) newErrors.battingHand = 'Batting Hand is required'

      const isAllRounder = formData.playingRole === 'All Rounder (Batting)' || formData.playingRole === 'All Rounder (Bowling)'
      const isBowler = formData.playingRole === 'Bowler'

      if (isBowler) {
        if (!formData.bowlerType) {
          newErrors.bowlerType = 'Bowler Type selection is required'
        }
        if (!formData.bowlingStyle) {
          newErrors.bowlingStyle = 'Bowling Arm selection is required'
        }
        if (formData.bowlerType === 'Fast Bowler' && !formData.bowlingSubtype) {
          newErrors.bowlingSubtype = 'Bowling Type selection is required'
        }
        if (formData.bowlerType === 'Spin Bowler' && !formData.spinType) {
          newErrors.spinType = 'Spin Type selection is required'
        }
      } else if (isAllRounder) {
        if (!formData.bowlingStyle) {
          newErrors.bowlingStyle = 'Bowling Arm selection is required'
        }
        if (!formData.bowlingSubtype) {
          newErrors.bowlingSubtype = 'Bowling Type selection is required'
        }
        if (formData.bowlingSubtype === 'Spin Bowler' && !formData.spinType) {
          newErrors.spinType = 'Spin Type selection is required'
        }
      }

      if (!formData.playerStatus) {
        newErrors.playerStatus = 'Player Status is required'
      } else if (
        (formData.playerStatus === 'Overseas (National)' || formData.playerStatus === 'Overseas (Domestic)') &&
        !formData.representingCountry
      ) {
        newErrors.representingCountry = 'Representing Country is required'
      }

      if (formData.totalMatches) {
        const matchesVal = Number(formData.totalMatches)
        if (isNaN(matchesVal) || matchesVal < 0 || !Number.isInteger(matchesVal)) {
          newErrors.totalMatches = 'Total Matches must be a valid whole number (0 or more)'
        }
      }

      if (formData.profileLink.trim()) {
        try {
          new URL(formData.profileLink)
        } catch {
          newErrors.profileLink = 'Please enter a valid URL (including http:// or https://)'
        }
      }
    }

    if (step === 3) {
      const catKey = (formData.category || '').toLowerCase()
      const isPlatinum = catKey.includes('platinum')
      const isDiamond = catKey.includes('diamond')
      const isGold = catKey.includes('gold')

      if (!formData.category) newErrors.category = 'Player Category is required'

      if (isPlatinum && !formData.considerIconPlayer) {
        newErrors.considerIconPlayer = 'Please specify if you want to be considered for Icon Player nomination'
      }

      if (isPlatinum || isDiamond || isGold) {
        if (!formData.acceptRelegation) {
          newErrors.acceptRelegation = 'Please specify if you accept category relegation'
        }
        if (formData.acceptRelegation === 'yes') {
          if (!formData.relegationLimit) {
            newErrors.relegationLimit = 'Please specify the lowest category you accept relegation to'
          } else {
            const validLimits: Record<string, string[]> = {
              'gold': ['Silver'],
              'diamond': ['Gold', 'Silver'],
              'platinum': ['Diamond', 'Gold', 'Silver']
            }
            const key = isGold ? 'gold' : isDiamond ? 'diamond' : 'platinum'
            const allowed = validLimits[key] || []
            if (!allowed.includes(formData.relegationLimit)) {
              newErrors.relegationLimit = 'Relegation limit must be lower than your selected category.'
            }
          }
        }
      }
    }

    if (step === 4) {
      if (!formData.passportPhoto) {
        newErrors.passportPhoto = fileMeta.passportPhoto
          ? 'Photo was restored from draft metadata — please re-select the image file to upload.'
          : 'Player Profile Photo is required'
      }
      if (!formData.passportScan) {
        newErrors.passportScan = fileMeta.passportScan
          ? 'Passport document was restored from draft metadata — please re-select the file to upload.'
          : 'Passport Image is required'
      }
      if (!formData.actionShot) {
        newErrors.actionShot = fileMeta.actionShot
          ? 'Action shot was restored from draft metadata — please re-select the image file to upload.'
          : 'Action Shot is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  const handleSelectOption = <K extends keyof FormData>(fieldName: K, value: FormData[K], extraData: Partial<FormData> = {}) => {
    let finalExtraData = { ...extraData }
    if (fieldName === 'playingRole') {
      finalExtraData = { ...finalExtraData, bowlerType: '', bowlingStyle: '', bowlingSubtype: '', spinType: '' }
    }
    if (fieldName === 'bowlerType') {
      if (value === 'Spin Bowler') {
        finalExtraData = { ...finalExtraData, bowlingSubtype: 'Spin Bowler' }
      } else if (value === 'Fast Bowler') {
        finalExtraData = { ...finalExtraData, bowlingSubtype: '', spinType: '' }
      }
    }
    if (fieldName === 'bowlingSubtype' && value !== 'Spin Bowler') {
      finalExtraData = { ...finalExtraData, spinType: '' }
    }
    if (fieldName === 'playerStatus') {
      const isNewOverseas = value === 'Overseas (National)' || value === 'Overseas (Domestic)'
      if (!isNewOverseas) {
        finalExtraData = { ...finalExtraData, representingCountry: '' }
      }
    }
    if (fieldName === 'category') {
      finalExtraData = { ...finalExtraData, acceptRelegation: 'no', relegationLimit: '' }
    }

    setFormData(prev => ({ ...prev, [fieldName]: value, ...finalExtraData }))
    if (errors[fieldName]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[fieldName]
        return copy
      })
    }
  }

  const handleToggleAvailability = (value: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev.availability) ? prev.availability : [prev.availability]
      let next: string[]
      if (current.includes(value)) {
        next = current.filter(v => v !== value)
      } else {
        next = [...current, value]
      }
      return { ...prev, availability: next }
    })
    if (errors.availability) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy.availability
        return copy
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const allowedTypes = fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(file, allowedTypes, 5)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
        setFileMeta(prev => {
          const copy = { ...prev }
          delete copy[fieldName]
          localStorage.setItem('apl_player_registration_file_meta', JSON.stringify(copy))
          return copy
        })
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: file }))
        setFileMeta(prev => {
          const updated = {
            ...prev,
            [fieldName]: { name: file.name, size: file.size }
          }
          localStorage.setItem('apl_player_registration_file_meta', JSON.stringify(updated))
          return updated
        })
        if (errors[fieldName]) {
          setErrors(prev => {
            const copy = { ...prev }
            delete copy[fieldName]
            return copy
          })
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto') => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const allowedTypes = fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(file, allowedTypes, 5)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
        setFileMeta(prev => {
          const copy = { ...prev }
          delete copy[fieldName]
          localStorage.setItem('apl_player_registration_file_meta', JSON.stringify(copy))
          return copy
        })
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: file }))
        setFileMeta(prev => {
          const updated = {
            ...prev,
            [fieldName]: { name: file.name, size: file.size }
          }
          localStorage.setItem('apl_player_registration_file_meta', JSON.stringify(updated))
          return updated
        })
        if (errors[fieldName]) {
          setErrors(prev => {
            const copy = { ...prev }
            delete copy[fieldName]
            return copy
          })
        }
      }
    }
  }

  const scrollToFormTop = () => {
    const el = document.querySelector('.register-content-section')
    if (el) {
      if ((window as any).lenis) {
        ; (window as any).lenis.scrollTo(el, { immediate: true, offset: -90 })
      } else {
        const yOffset = -90 // clearance for sticky navbar
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'auto' })
      }
    } else {
      if ((window as any).lenis) {
        ; (window as any).lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        scrollToFormTop()
        setCurrentStep(prev => prev + 1)
      } else {
        // Guard: ensure all consents are checked before submitting
        if (!consent1 || !consent2 || !consent3 || !consent4) {
          setErrors({ consents: 'Please accept all declarations before submitting.' })
          return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
          // 1. Upload player images in bulk to uploads/player-images
          const formDataUpload = new FormData()
          if (formData.passportScan) formDataUpload.append('passport', formData.passportScan)
          if (formData.actionShot) formDataUpload.append('action_shot', formData.actionShot)
          if (formData.passportPhoto) formDataUpload.append('photo', formData.passportPhoto)
          if (formData.rightProfilePhoto) formDataUpload.append('right_profile', formData.rightProfilePhoto)
          if (formData.leftProfilePhoto) formDataUpload.append('left_profile', formData.leftProfilePhoto)

          const token = getApiToken()
          const uploadRes = await fetch(buildApiUrl('/uploads/player-images'), {
            method: 'POST',
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {},
            body: formDataUpload
          })

          if (!uploadRes.ok) {
            const errJson = await uploadRes.json().catch(() => ({}))
            throw new Error(errJson.message || 'Image upload failed. Please verify MIME types and try again.')
          }

          const uploadJson = await uploadRes.json()
          const urls = uploadJson.data || uploadJson

          const normalizeUrl = (val: string, fallback: string): string => {
            if (!val || typeof val !== 'string') return fallback
            return normalizeMediaUrl(val) || fallback
          }

          // Required photos — fallback to sample only if server somehow omits them
          const defaultBase = API_BASE_URL.replace(/\/api\/v\d+.*$/, '')
          const photoUrl = normalizeUrl(urls.photo || urls.photo_url || '', `${defaultBase}/uploads/images/headshot_sample.jpg`)
          const passportUrl = normalizeUrl(urls.passport || urls.passport_url || '', `${defaultBase}/uploads/images/passport_sample.jpg`)
          const actionShotUrl = normalizeUrl(urls.action_shot || urls.action_shot_url || '', `${defaultBase}/uploads/images/action_sample.jpg`)
          // Optional photos — only normalized if player actually uploaded them
          const leftProfileUrl = formData.leftProfilePhoto ? normalizeUrl(urls.left_profile || urls.left_profile_url || '', '') : null
          const rightProfileUrl = formData.rightProfilePhoto ? normalizeUrl(urls.right_profile || urls.right_profile_url || '', '') : null

          const profileLink = formData.profileLink.trim() ? normalizeUrl(formData.profileLink, 'https://www.espncricinfo.com') : 'https://www.espncricinfo.com'

          const availabilityShortMap: Record<string, string> = {
            // Standard / Short codes
            'full': 'Full Season',
            'selected': 'Selected Dates',
            'national': 'National Commitment',
            'release': 'Club Release',
            
            // Spaced strings
            'available for full season': 'Full Season',
            'available for selected dates': 'Selected Dates',
            'subject to national-team commitments': 'National Commitment',
            'subject to club or franchise release': 'Club Release',
            
            // Underscore strings (dynamic API key variants)
            'available_for_full_season': 'Full Season',
            'available_for_selected_dates': 'Selected Dates',
            'subject_to_national_team_commitments': 'National Commitment',
            'subject_to_club_or_franchise_release': 'Club Release',
            'subject_to_national_team_commitmen': 'National Commitment'
          }

          const formatAvailabilityString = (avail: any): string => {
            const list = Array.isArray(avail) ? avail : [avail]
            const formatted = list
              .filter(Boolean)
              .map(item => {
                const str = String(item).trim()
                const key = str.toLowerCase()
                return availabilityShortMap[key] || str
              })
              .filter((val, idx, self) => self.indexOf(val) === idx) // Remove duplicate mapped names
              .join(', ')
            return formatted.length > 50 ? formatted.slice(0, 47) + '...' : (formatted || 'Full Season')
          }

          // Format availability details and relegation consent info
          const relegationInfo = formData.acceptRelegation === 'yes'
            ? `Accept Relegation: Yes (Till ${formData.relegationLimit || 'Any'})`
            : `Accept Relegation: No`
          const iconInfo = formData.considerIconPlayer ? ` Icon Nomination: ${formData.considerIconPlayer.toUpperCase()}.` : ''
          const customAvailDetails = formData.availabilityDetails ? `Notes: ${formData.availabilityDetails}. ` : ''

          const fullAvailabilityDetails = `${customAvailDetails}${relegationInfo}.${iconInfo}`.slice(0, 250)

          const expRepCountry = formData.representingCountry ? ` Representing: ${formData.representingCountry}.` : ''
          const fullPlayingExperience = `Current Club: ${formData.currentClub || 'None'}. Previous Teams: ${formData.prevTeams || 'None'}.${expRepCountry}`.slice(0, 250)

          // 2. Submit Player Registration details to player-registrations
          const regPayload = {
            full_name: formData.fullName,
            dob: formData.dob,
            city: formData.city,
            phone: formData.phone,
            email: formData.email,
            batting_hand: formData.battingHand,
            bowling_arm: formData.bowlingStyle || 'Right-arm',
            playing_experience: fullPlayingExperience,
            previous_teams: (formData.prevTeams || 'None').slice(0, 250),
            passport_number: formData.passportNumber,
            availability_details: fullAvailabilityDetails,
            passport_url: passportUrl,
            action_shot_url: actionShotUrl,
            photo_url: photoUrl,
            ...(rightProfileUrl ? { right_profile_url: rightProfileUrl } : {}),
            ...(leftProfileUrl ? { left_profile_url: leftProfileUrl } : {}),
            nationality: formData.nationality,
            country_of_residence: formData.countryResidence,
            player_availability: formatAvailabilityString(formData.availability),
            player_category: formData.category,
            playing_role: formData.playingRole,
            bowling_type: formData.bowlingSubtype || formData.bowlerType || formData.spinType || 'None',
            player_status: formData.playerStatus,
            twtenty_matches_count: formData.totalMatches ? parseInt(formData.totalMatches, 10) : 0,
            submission_category: formData.regType === 'player' ? 'Player' : 'Agent',
            bowler_category: formData.bowlerType || 'None',
            profile_link: profileLink,
            agent_full_name: formData.regType === 'agent' ? formData.agentName : '',
            agent_company_name: formData.regType === 'agent' ? formData.agentAgency : '',
            agent_phone_number: formData.regType === 'agent' ? formData.agentPhone : '',
            agent_email_address: formData.regType === 'agent' ? formData.agentEmail : '',

            // Three new variables requested by Bilal in Live V4 API
            icon_player_nomination: formData.considerIconPlayer === 'yes',
            accept_relegation: formData.acceptRelegation === 'yes',
            relegation_category: formData.acceptRelegation === 'yes' ? (formData.relegationLimit || '') : '',

            // Additional compatibility keys
            relegation_limit: formData.relegationLimit || 'None',
            consider_icon_player: formData.considerIconPlayer || 'no',
            representing_country: formData.representingCountry || ''
          }

          console.log('🚀 Registration Payload sent to Bilal API:', regPayload)
          console.log('📋 Live V4 Fields:', {
            icon_player_nomination: regPayload.icon_player_nomination,
            accept_relegation: regPayload.accept_relegation,
            relegation_category: regPayload.relegation_category
          })

          const regRes = await fetch(buildApiUrl('/player-registrations'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(regPayload)
          })

          if (!regRes.ok) {
            const errJson = await regRes.json().catch(() => ({}))
            console.error('Backend registration response 400 details:', errJson)

            const formatErrorObj = (obj: any): string => {
              if (!obj) return ''
              if (typeof obj === 'string') return obj
              if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)
              if (Array.isArray(obj)) {
                return obj.map(item => formatErrorObj(item)).filter(Boolean).join(', ')
              }
              if (typeof obj === 'object') {
                if (obj.field && (obj.message || obj.error)) {
                  return `${String(obj.field).replace(/_/g, ' ').toUpperCase()}: ${obj.message || obj.error}`
                }
                const entries = Object.entries(obj)
                  .map(([key, val]) => {
                    const formattedKey = key.replace(/_/g, ' ').toUpperCase()
                    const formattedVal = formatErrorObj(val)
                    if (!formattedVal) return ''
                    return `${formattedKey}: ${formattedVal}`
                  })
                  .filter(Boolean)
                return entries.join(' | ')
              }
              return String(obj)
            }

            let details = ''
            if (errJson.details) {
              details = formatErrorObj(errJson.details)
            } else if (errJson.errors) {
              details = formatErrorObj(errJson.errors)
            } else if (errJson.error) {
              details = formatErrorObj(errJson.error)
            } else if (errJson.message && errJson.message !== 'Validation failed') {
              details = errJson.message
            } else {
              details = formatErrorObj(errJson)
            }

            throw new Error(details || 'Validation failed. Please check your inputs and try again.')
          }

          const regJson = await regRes.json()
          const regData = regJson.data || regJson

          // Extract confirmation code returned by backend, else fallback to standard local generator
          const registrationCode = regData.registration_code || regData.code || `APL-2026-${Date.now().toString().slice(-5)}`

          // Success: Clean up local draft states
          localStorage.removeItem('apl_player_registration_draft')
          localStorage.removeItem('apl_player_registration_step')
          localStorage.removeItem('apl_player_registration_file_meta')

          setRefCode(registrationCode)
          setIsSubmitted(true)
          if ((window as any).lenis) {
            ; (window as any).lenis.scrollTo(0, { immediate: true })
          } else {
            window.scrollTo(0, 0)
          }
        } catch (err: any) {
          console.error('Submission failed:', err)
          setSubmitError(err.message || 'An error occurred during submission. Please try again.')
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      scrollToFormTop()
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSaveDraft = () => {
    const { passportPhoto: _passportPhoto, passportScan: _passportScan, actionShot: _actionShot, rightProfilePhoto: _rPhoto, leftProfilePhoto: _lPhoto, ...serializableData } = formData
    localStorage.setItem('apl_player_registration_draft', JSON.stringify(serializableData))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 3000)
  }

  const handleReset = () => {
    localStorage.removeItem('apl_player_registration_draft')
    localStorage.removeItem('apl_player_registration_step')
    localStorage.removeItem('apl_player_registration_file_meta')
    setFormData(initialFormData)
    setFileMeta({})
    setConsent1(false)
    setConsent2(false)
    setConsent3(false)
    setConsent4(false)
    setCurrentStep(1)
    setIsSubmitted(false)
    setErrors({})
  }

  if (isSubmitted) {
    return (
      <div className="register-page-container">
        {/* Hero Section */}
        <section className="register-hero">
          <div className="register-hero-grid-bg" />
          <div className="register-hero-glow" />
          <div className="register-hero-top-row">
            <div className="register-hero-title-wrap">
              <span className="register-live-badge">APL 2026 SEASON</span>
              <h1 className="register-main-title">PLAYER REGISTRATION<span className="dot-accent">.</span></h1>
            </div>
          </div>
        </section>

        <section className="register-content-section">
          <div className="register-success-card">
            <CheckCircle2 className="success-icon animate-pulse-scale" size={80} />
            <h2 className="success-title">Registration Submitted!</h2>
            <p className="success-message">
              Thank you, <strong>{formData.fullName}</strong>. Your application for the Afghanistan Premier League (APL) 2026 player draft has been successfully received.
            </p>
            <div className="success-details-premium">
              <div className="success-detail-row">
                <span className="detail-label">Application Reference</span>
                <span className="detail-value reference-code">{refCode}</span>
              </div>

              <div className="success-detail-row">
                <span className="detail-label">Draft Status</span>
                <span className="detail-value status-badge">Under Review by APL Cricket Operations</span>
              </div>

              <div className="success-email-notice">
                <span className="mail-icon">✉</span>
                <p>
                  A confirmation email has been sent to <strong className="email-highlight">{formData.email}</strong> with details on the draft process and draft categories.
                </p>
              </div>
            </div>
            <button className="register-btn-reset" onClick={handleReset}>
              Register Another Player
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="register-page-container">
      {/* Hero Section */}
      <section className="register-hero">
        <div className="register-hero-grid-bg" />
        <div className="register-hero-glow" />
        <div className="register-hero-top-row">
          <div className="register-hero-title-wrap">
            <span className="register-live-badge">APL 2026 SEASON</span>
            <h1 className="register-main-title">PLAYER REGISTRATION<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="register-content-section">
        <div className="register-form-card">

          {/* Progress Steps Header */}
          <div className="register-steps-header">
            <div className="steps-container">
              {steps.map((step) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                return (
                  <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="step-circle-wrapper">
                      <button
                        className="step-circle"
                        onClick={() => {
                          if (step.id < currentStep) {
                            scrollToFormTop()
                            setCurrentStep(step.id)
                          }
                        }}
                        disabled={step.id > currentStep}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                      </button>
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="form-card-body">
            {/* Draft Saved Toast */}
            {draftSaved && (
              <div className="draft-saved-toast">
                <span style={{ marginRight: '8px', color: 'var(--brand-gold, #faa718)' }}>✓</span>
                Draft successfully saved at {new Date().toLocaleTimeString()}!
              </div>
            )}

            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <Step1Personal
                formData={formData}
                errors={errors}
                apiCountries={apiCountries}
                apiAvailabilities={apiAvailabilities}
                handleInputChange={handleInputChange}
                handleSelectOption={handleSelectOption}
                handleToggleAvailability={handleToggleAvailability}
              />
            )}

            {/* STEP 2: CRICKET INFORMATION */}
            {currentStep === 2 && (
              <Step2Cricket
                formData={formData}
                errors={errors}
                apiPlayingRoles={apiPlayingRoles}
                apiPlayerStatuses={apiPlayerStatuses}
                apiCountries={apiCountries}
                handleInputChange={handleInputChange}
                handleSelectOption={handleSelectOption}
              />
            )}

            {/* STEP 3: CATEGORY */}
            {currentStep === 3 && (
              <Step3Category
                formData={formData}
                errors={errors}
                apiCategories={apiCategories}
                handleSelectOption={handleSelectOption}
              />
            )}

            {/* STEP 4: UPLOADS */}
            {currentStep === 4 && (
              <Step4Uploads
                formData={formData}
                errors={errors}
                fileMeta={fileMeta}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                handleFileChange={handleFileChange}
              />
            )}

            {/* STEP 5: REVIEW */}
            {currentStep === 5 && (
              <Step5Review
                formData={formData}
                errors={errors}
                consent1={consent1}
                setConsent1={setConsent1}
                consent2={consent2}
                setConsent2={setConsent2}
                consent3={consent3}
                setConsent3={setConsent3}
                consent4={consent4}
                setConsent4={setConsent4}
              />
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="form-card-footer">
            {submitError && (
              <div 
                className="error-message-banner animate-fade-in" 
                style={{ 
                  padding: '1rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid #ef4444', 
                  borderRadius: '4px', 
                  color: '#f87171', 
                  marginBottom: '1.5rem', 
                  fontSize: '0.95rem',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {submitError}
              </div>
            )}

            {currentStep === 5 ? (
              <div className="review-footer-buttons">
                <div className="review-top-buttons-row">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={handlePrev}
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn-save-draft-review" 
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </button>
                </div>
                <div className="review-bottom-submit-row">
                  <button
                    type="button"
                    className="btn-submit-registration"
                    onClick={handleNext}
                    disabled={isSubmitting || !consent1 || !consent2 || !consent3 || !consent4}
                  >
                    {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="buttons-row">
                {currentStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={handlePrev}>
                    Back
                  </button>
                )}
                <button type="button" className="btn-secondary" onClick={handleSaveDraft}>
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                >
                  Next Step
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}
