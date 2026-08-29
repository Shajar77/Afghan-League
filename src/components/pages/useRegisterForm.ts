import { useState, useEffect } from 'react'
import type { FormData } from '../registration/types'
import { initialFormData, validateFile } from '../registration/types'
import { scrollToTop, scrollToElement } from '../../utils/lenis'
import { compressImageFile } from '../../utils/imageCompression'

const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours TTL

function safeSetStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Gracefully handle storage quota or private browsing exceptions
  }
}

export function useRegisterForm() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [fileMeta, setFileMeta] = useState<Record<string, { name: string; size: number }>>({})

  // Step 5 Consents
  const [consent1, setConsent1] = useState<boolean>(false)
  const [consent2, setConsent2] = useState<boolean>(false)
  const [consent3, setConsent3] = useState<boolean>(false)
  const [consent4, setConsent4] = useState<boolean>(false)

  // Scroll restoration + draft/step rehydration on mount
  useEffect(() => {
    let previousScrollRestoration: ScrollRestoration = 'auto'
    if ('scrollRestoration' in window.history) {
      previousScrollRestoration = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
    }
    const timer = setTimeout(() => {
      scrollToTop(true)
    }, 50)

    const saved = localStorage.getItem('apl_player_registration_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const savedTime = typeof parsed._savedAt === 'number' ? parsed._savedAt : 0
        const isExpired = savedTime > 0 && Date.now() - savedTime > DRAFT_MAX_AGE_MS

        if (isExpired) {
          localStorage.removeItem('apl_player_registration_draft')
          localStorage.removeItem('apl_player_registration_step')
          localStorage.removeItem('apl_player_registration_file_meta')
        } else {
          if (parsed.availability && !Array.isArray(parsed.availability)) {
            parsed.availability = [parsed.availability]
          }
          if (typeof parsed.acceptRelegation === 'boolean') {
            parsed.acceptRelegation = parsed.acceptRelegation ? 'yes' : 'no'
          }
          // Remove metadata property before loading into state
          delete parsed._savedAt

          setFormData(prev => ({
            ...prev,
            ...parsed,
            passportPhoto: null,
            passportScan: null,
            actionShot: null,
            rightProfilePhoto: null,
            leftProfilePhoto: null,
          }))

          const savedStep = localStorage.getItem('apl_player_registration_step')
          if (savedStep) {
            const parsedStep = parseInt(savedStep, 10)
            if (parsedStep >= 1 && parsedStep <= 5) {
              setCurrentStep(parsedStep)
            }
          }

          const savedFileMeta = localStorage.getItem('apl_player_registration_file_meta')
          if (savedFileMeta) {
            try {
              setFileMeta(JSON.parse(savedFileMeta))
            } catch {
              // Could not parse file metadata — clear it silently
            }
          }
        }
      } catch {
        // Corrupted draft — start fresh
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

  // Auto-save form data draft to localStorage on any input change (with TTL timestamp)
  useEffect(() => {
    if (!isLoaded) return
    const {
      passportPhoto: _pPhoto,
      passportScan: _pScan,
      actionShot: _aShot,
      rightProfilePhoto: _rPhoto,
      leftProfilePhoto: _lPhoto,
      passportNumber: _passportNumber, // Never persist government ID in browser storage
      ...serializable
    } = formData
    safeSetStorage('apl_player_registration_draft', JSON.stringify({ ...serializable, _savedAt: Date.now() }))
  }, [formData, isLoaded])

  // Auto-save current step to localStorage
  useEffect(() => {
    if (!isLoaded) return
    safeSetStorage('apl_player_registration_step', String(currentStep))
  }, [currentStep, isLoaded])

  const clearDraft = () => {
    try {
      localStorage.removeItem('apl_player_registration_draft')
      localStorage.removeItem('apl_player_registration_step')
      localStorage.removeItem('apl_player_registration_file_meta')
    } catch {
      // Ignore cleanup error
    }
  }

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

      const isAllRounder =
        formData.playingRole === 'All Rounder (Batting)' ||
        formData.playingRole === 'All Rounder (Bowling)'
      const isBowler = formData.playingRole === 'Bowler'

      if (isBowler) {
        if (!formData.bowlerType) newErrors.bowlerType = 'Bowler Type selection is required'
        if (!formData.bowlingStyle) newErrors.bowlingStyle = 'Bowling Arm selection is required'
        if (formData.bowlerType === 'Fast Bowler' && !formData.bowlingSubtype)
          newErrors.bowlingSubtype = 'Bowling Type selection is required'
        if (formData.bowlerType === 'Spin Bowler' && !formData.spinType)
          newErrors.spinType = 'Spin Type selection is required'
      } else if (isAllRounder) {
        if (!formData.bowlingStyle) newErrors.bowlingStyle = 'Bowling Arm selection is required'
        if (!formData.bowlingSubtype) newErrors.bowlingSubtype = 'Bowling Type selection is required'
        if (formData.bowlingSubtype === 'Spin Bowler' && !formData.spinType)
          newErrors.spinType = 'Spin Type selection is required'
      }

      if (!formData.playerStatus) {
        newErrors.playerStatus = 'Player Status is required'
      } else if (
        (formData.playerStatus === 'Overseas (National)' ||
          formData.playerStatus === 'Overseas (Domestic)') &&
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
        const urlToTest = /^https?:\/\//i.test(formData.profileLink.trim())
          ? formData.profileLink.trim()
          : `https://${formData.profileLink.trim()}`
        try {
          new URL(urlToTest)
        } catch {
          newErrors.profileLink = 'Please enter a valid URL (e.g. espncricinfo.com/player/...)'
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
        newErrors.considerIconPlayer =
          'Please specify if you want to be considered for Icon Player nomination'
      }

      if (isPlatinum || isDiamond || isGold) {
        if (!formData.acceptRelegation) {
          newErrors.acceptRelegation = 'Please specify if you accept category relegation'
        }
        if (formData.acceptRelegation === 'yes') {
          if (!formData.relegationLimit) {
            newErrors.relegationLimit =
              'Please specify the lowest category you accept relegation to'
          } else {
            const validLimits: Record<string, string[]> = {
              gold: ['Silver'],
              diamond: ['Gold', 'Silver'],
              platinum: ['Diamond', 'Gold', 'Silver'],
            }
            const key = isGold ? 'gold' : isDiamond ? 'diamond' : 'platinum'
            const allowed = validLimits[key] || []
            if (!allowed.includes(formData.relegationLimit)) {
              newErrors.relegationLimit =
                'Relegation limit must be lower than your selected category.'
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleSelectOption = <K extends keyof FormData>(
    fieldName: K,
    value: FormData[K],
    extraData: Partial<FormData> = {}
  ) => {
    let finalExtraData = { ...extraData }
    if (fieldName === 'playingRole') {
      finalExtraData = {
        ...finalExtraData,
        bowlerType: '',
        bowlingStyle: '',
        bowlingSubtype: '',
        spinType: '',
      }
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
      const isNewOverseas =
        value === 'Overseas (National)' || value === 'Overseas (Domestic)'
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
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const rawFile = e.target.files[0]
      const allowedTypes =
        fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(rawFile, allowedTypes, 15)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
        setFileMeta(prev => {
          const copy = { ...prev }
          delete copy[fieldName]
          safeSetStorage('apl_player_registration_file_meta', JSON.stringify(copy))
          return copy
        })
      } else {
        const compressedFile = await compressImageFile(rawFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
        })
        setFormData(prev => ({ ...prev, [fieldName]: compressedFile }))
        setFileMeta(prev => {
          const updated = {
            ...prev,
            [fieldName]: { name: compressedFile.name, size: compressedFile.size },
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

  const handleDrop = async (
    e: React.DragEvent,
    fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto'
  ) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const rawFile = e.dataTransfer.files[0]
      const allowedTypes =
        fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(rawFile, allowedTypes, 15)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
        setFileMeta(prev => {
          const copy = { ...prev }
          delete copy[fieldName]
          safeSetStorage('apl_player_registration_file_meta', JSON.stringify(copy))
          return copy
        })
      } else {
        const compressedFile = await compressImageFile(rawFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
        })
        setFormData(prev => ({ ...prev, [fieldName]: compressedFile }))
        setFileMeta(prev => {
          const updated = {
            ...prev,
            [fieldName]: { name: compressedFile.name, size: compressedFile.size },
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
      scrollToElement(el, -90, true)
    } else {
      scrollToTop(true)
    }
  }

  const resetForm = () => {
    clearDraft()
    setFormData(initialFormData)
    setFileMeta({})
    setConsent1(false)
    setConsent2(false)
    setConsent3(false)
    setConsent4(false)
    setCurrentStep(1)
    setErrors({})
  }

  return {
    // State
    currentStep,
    setCurrentStep,
    formData,
    errors,
    setErrors,
    fileMeta,
    consent1, setConsent1,
    consent2, setConsent2,
    consent3, setConsent3,
    consent4, setConsent4,
    // Handlers
    handleInputChange,
    handleSelectOption,
    handleToggleAvailability,
    handleFileChange,
    handleDragOver,
    handleDrop,
    // Utilities
    validateStep,
    scrollToFormTop,
    clearDraft,
    resetForm,
  }
}
