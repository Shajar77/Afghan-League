import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2 } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'
import { SearchableDropdown } from './SearchableDropdown'
import frontProfileRef from '../assets/Front Profile.jpg.jpeg'
import idRef from '../assets/ID.jpg.jpeg'
import actionShotRef from '../assets/Action.jpg.jpeg'
import rightProfileRef from '../assets/Right Profile.jpg.jpeg'
import leftRef from '../assets/Left.jpg.jpeg'
import './RegisterPage.css'

interface FormData {
  // Step 1: Personal
  regType: 'player' | 'agent'
  agentName: string
  agentAgency: string
  agentPhone: string
  agentEmail: string
  fullName: string
  dob: string
  nationality: string
  passportNumber: string
  countryResidence: string
  city: string
  phone: string
  email: string
  availability: string[]
  availabilityDetails: string

  // Step 2: Cricket
  playingRole: string
  battingHand: string
  bowlerType: string
  bowlingStyle: string
  bowlingSubtype: string
  spinType: string
  currentClub: string
  prevTeams: string
  playerStatus: string
  representingCountry: string
  totalMatches: string
  profileLink: string

  // Step 3: Category
  category: string
  basePrice: string
  acceptRelegation: 'yes' | 'no' | 'emerging' | ''
  relegationLimit: 'Diamond' | 'Gold' | 'Silver' | ''

  // Step 4: Uploads
  passportPhoto: File | null
  passportScan: File | null
  actionShot: File | null
  rightProfilePhoto: File | null
  leftProfilePhoto: File | null
}

const initialFormData: FormData = {
  regType: 'player',
  agentName: '',
  agentAgency: '',
  agentPhone: '',
  agentEmail: '',
  fullName: '',
  dob: '',
  nationality: '',
  passportNumber: '',
  countryResidence: '',
  city: '',
  phone: '',
  email: '',
  availability: ['full'],
  availabilityDetails: '',
  playingRole: '',
  battingHand: '',
  bowlerType: '',
  bowlingStyle: '',
  bowlingSubtype: '',
  spinType: '',
  currentClub: '',
  prevTeams: '',
  playerStatus: 'Afghanistan (Domestic)',
  representingCountry: '',
  totalMatches: '',
  profileLink: '',
  category: 'Gold Player',
  basePrice: '$20,000',
  acceptRelegation: 'no',
  relegationLimit: '',
  passportPhoto: null,
  passportScan: null,
  actionShot: null,
  rightProfilePhoto: null,
  leftProfilePhoto: null,
}

const categoriesList = [
  { id: 'Icon Player', label: 'Icon Player', desc: 'Marquee national talent', price: '$100,000' },
  { id: 'Platinum Player', label: 'Platinum Player', desc: 'Top-tier performers', price: '$50,000' },
  { id: 'Diamond Player', label: 'Diamond Player', desc: 'Established talent', price: '$35,000' },
  { id: 'Gold Player', label: 'Gold Player', desc: 'Strong domestic record', price: '$20,000' },
  { id: 'Silver Player', label: 'Silver Player', desc: 'Rising performers', price: '$10,000' },
  { id: 'Emerging Under-23', label: 'Emerging Under-23', desc: 'Afghan National Players Emerging Talent', price: '$5,000' }
]

const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number): string | null => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
  if (!allowedTypes.includes(fileExtension)) {
    return `Invalid format. Allowed formats: ${allowedTypes.join(', ').toUpperCase()}`
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds the ${maxSizeMB} MB limit.`
  }
  return null
}

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
      if (!formData.category) newErrors.category = 'Player Category is required'
      if (!formData.acceptRelegation) {
        newErrors.acceptRelegation = 'Please specify if you accept category relegation'
      }
      if (formData.acceptRelegation === 'yes') {
        if (formData.category === 'Silver Player') {
          newErrors.acceptRelegation = 'Relegation only applies to categories higher than Silver. Please select No or Emerging (Does not Apply).'
        } else if (formData.category === 'Emerging Under-23') {
          newErrors.acceptRelegation = 'Relegation does not apply to the Emerging Under-23 category. Please select Emerging (Does not Apply).'
        } else if (!formData.relegationLimit) {
          newErrors.relegationLimit = 'Please specify the lowest category you accept relegation to'
        } else {
          const ranks: Record<string, number> = {
            'Icon Player': 5,
            'Platinum Player': 4,
            'Diamond Player': 3,
            'Gold Player': 2,
            'Silver Player': 1,
            'Emerging Under-23': 0
          }
          const limitRanks: Record<string, number> = {
            'Diamond': 3,
            'Gold': 2,
            'Silver': 1
          }
          const currentRank = ranks[formData.category] ?? 0
          const limitRank = limitRanks[formData.relegationLimit] ?? 0

          if (limitRank >= currentRank) {
            newErrors.relegationLimit = `Relegation limit must be lower than your selected category (${formData.category}).`
          }
        }
      }
    }

    if (step === 4) {
      if (!formData.passportPhoto) newErrors.passportPhoto = 'Player Profile Photo is required'
      if (!formData.passportScan) newErrors.passportScan = 'Passport Image is required'
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
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        scrollToFormTop()
        setCurrentStep(prev => prev + 1)
      } else {
        // Guard: ensure all consents are checked before submitting
        if (!consent1 || !consent2 || !consent3) {
          setErrors({ consents: 'Please accept all three declarations before submitting.' })
          return
        }
        // Final Submit
        localStorage.removeItem('apl_player_registration_draft')
        localStorage.removeItem('apl_player_registration_step')
        localStorage.removeItem('apl_player_registration_file_meta')
        const uniqueSuffix = Date.now().toString().slice(-5)
        setRefCode(`APL-2026-${uniqueSuffix}`)
        setIsSubmitted(true)
        if ((window as any).lenis) {
          ; (window as any).lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo(0, 0)
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
                <span className="detail-value status-badge">Under Review by ACB Cricket Operations</span>
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
              <div className="form-step-content animate-fade-in">
                {/* Registration Type */}
                <div className="form-section">
                  <h3 className="section-title">Registration Type</h3>
                  <p className="section-subtitle">Who is submitting this registration?</p>

                  <div className="reg-type-cards">
                    <div
                      className={`type-card ${formData.regType === 'player' ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('regType', 'player')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectOption('regType', 'player')
                        }
                      }}
                    >
                      <span className="type-card-title">I am the Player</span>
                    </div>
                    <div
                      className={`type-card ${formData.regType === 'agent' ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('regType', 'agent')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectOption('regType', 'agent')
                        }
                      }}
                    >
                      <span className="type-card-title">I am an Agent / Authorized Representative</span>
                    </div>
                  </div>
                </div>

                {formData.regType === 'agent' && (
                  <div className="form-section">
                    <h3 className="section-title">Agent Details</h3>
                    <p className="section-subtitle">Information about the player's representative.</p>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Agent Full Name <span className="required">*</span></label>
                        <input
                          type="text"
                          name="agentName"
                          value={formData.agentName}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe"
                          className={errors.agentName ? 'input-error' : ''}
                          required
                        />
                        {errors.agentName && <span className="error-message">{errors.agentName}</span>}
                      </div>

                      <div className="form-group">
                        <label>Agency / Company Name</label>
                        <input
                          type="text"
                          name="agentAgency"
                          value={formData.agentAgency}
                          onChange={handleInputChange}
                          placeholder="e.g. Apex Sports Management"
                        />
                      </div>

                      <div className="form-group">
                        <label>Agent Phone Number <span className="required">*</span></label>
                        <input
                          type="tel"
                          name="agentPhone"
                          value={formData.agentPhone}
                          onChange={handleInputChange}
                          placeholder="e.g. +93 70 987 6543"
                          className={errors.agentPhone ? 'input-error' : ''}
                          required
                        />
                        {errors.agentPhone && <span className="error-message">{errors.agentPhone}</span>}
                      </div>

                      <div className="form-group">
                        <label>Agent Email Address <span className="required">*</span></label>
                        <input
                          type="email"
                          name="agentEmail"
                          value={formData.agentEmail}
                          onChange={handleInputChange}
                          placeholder="e.g. agent@agency.com"
                          className={errors.agentEmail ? 'input-error' : ''}
                          required
                        />
                        {errors.agentEmail && <span className="error-message">{errors.agentEmail}</span>}
                      </div>
                    </div>

                    <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '1rem 0 0 0', fontStyle: 'italic' }}>
                      Agent details may be reused, but complete player information and documents must be submitted separately for every player.
                    </p>
                  </div>
                )}

                {/* Player Information */}
                <div className="form-section">
                  <h3 className="section-title">Player Information</h3>
                  <p className="section-subtitle">Tell us about the player being registered.</p>

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label>Full Legal Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rashid Khan"
                        className={errors.fullName ? 'input-error' : ''}
                        required
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Date of Birth <span className="required">*</span></label>
                      <div className="date-input-wrapper">
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className={errors.dob ? 'input-error' : ''}
                          required
                        />
                        <Calendar size={18} className="calendar-icon" />
                      </div>
                      {errors.dob && <span className="error-message">{errors.dob}</span>}
                    </div>

                    <div className="form-group">
                      <label>Nationality <span className="required">*</span></label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        placeholder="e.g. Afghanistan"
                        className={errors.nationality ? 'input-error' : ''}
                        required
                      />
                      {errors.nationality && <span className="error-message">{errors.nationality}</span>}
                    </div>

                    <div className="form-group">
                      <label>Passport Number <span className="required">*</span></label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. O1838204A"
                        className={errors.passportNumber ? 'input-error' : ''}
                        required
                      />
                      {errors.passportNumber && <span className="error-message">{errors.passportNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label>Country of Residence <span className="required">*</span></label>
                      <input
                        type="text"
                        name="countryResidence"
                        value={formData.countryResidence}
                        onChange={handleInputChange}
                        placeholder="e.g. Afghanistan"
                        className={errors.countryResidence ? 'input-error' : ''}
                        required
                      />
                      {errors.countryResidence && <span className="error-message">{errors.countryResidence}</span>}
                    </div>

                    <div className="form-group">
                      <label>City <span className="required">*</span></label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Kabul"
                        className={errors.city ? 'input-error' : ''}
                        required
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone / WhatsApp Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +93 70 123 4567"
                        className={errors.phone ? 'input-error' : ''}
                        required
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. player@domain.com"
                        className={errors.email ? 'input-error' : ''}
                        required
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>
                </div>

                {/* Player Availability */}
                <div className="form-section">
                  <h3 className="section-title">Player Availability <span className="required">*</span></h3>

                  <div className={`availability-grid ${errors.availability ? 'dropzone-error' : ''}`}>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('full') : formData.availability === 'full') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('full')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleToggleAvailability('full')
                        }
                      }}
                    >
                      <span className="avail-card-title">Available for full season</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('selected') : formData.availability === 'selected') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('selected')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleToggleAvailability('selected')
                        }
                      }}
                    >
                      <span className="avail-card-title">Available for selected dates</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('national') : formData.availability === 'national') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('national')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleToggleAvailability('national')
                        }
                      }}
                    >
                      <span className="avail-card-title">Subject to national-team commitments</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('release') : formData.availability === 'release') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('release')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleToggleAvailability('release')
                        }
                      }}
                    >
                      <span className="avail-card-title">Subject to club or franchise release</span>
                    </div>
                  </div>
                  {errors.availability && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.availability}</span>}

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Availability Details</label>
                    <textarea
                      name="availabilityDetails"
                      value={formData.availabilityDetails}
                      onChange={handleInputChange}
                      placeholder="Mention unavailable dates or existing commitments."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CRICKET INFORMATION */}
            {currentStep === 2 && (
              <div className="form-step-content animate-fade-in">

                {/* Playing Role */}
                <div className="form-section">
                  <h3 className="section-title">Cricket Profile</h3>
                  <p className="section-subtitle">Details about the player's playing style and history.</p>

                  <label className="field-group-label">Playing Role <span className="required">*</span></label>
                  <div className="playing-role-grid">
                    {['Batter', 'Wicketkeeper-Batter', 'Bowler', 'All Rounder (Batting)', 'All Rounder (Bowling)'].map((role) => (
                      <div
                        key={role}
                        className={`type-card ${formData.playingRole === role ? 'selected' : ''} ${errors.playingRole ? 'input-error' : ''}`}
                        onClick={() => handleSelectOption('playingRole', role)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption('playingRole', role)
                          }
                        }}
                      >
                        <span className="type-card-title">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batting Hand */}
                <div className="form-section">
                  <label className="field-group-label">Batting Hand <span className="required">*</span></label>
                  <div className="reg-type-cards">
                    {['Right-Handed', 'Left-Handed'].map((hand) => (
                      <div
                        key={hand}
                        className={`type-card ${formData.battingHand === hand ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('battingHand', hand)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption('battingHand', hand)
                          }
                        }}
                      >
                        <span className="type-card-title">{hand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progressive Bowling Style */}
                {(formData.playingRole === 'All Rounder (Batting)' || formData.playingRole === 'All Rounder (Bowling)' || formData.playingRole === 'Bowler') && (
                  <div className="form-section animate-fade-in" style={{ gap: '2.5rem', display: 'flex', flexDirection: 'column', marginTop: '1rem', marginBottom: '1.5rem' }}>
                    
                    {/* Bowler Category (Only if playingRole is Bowler) */}
                    {formData.playingRole === 'Bowler' && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <label className="field-group-label" style={{ margin: 0 }}>Bowler Category <span className="required">*</span></label>
                        <div className="reg-type-cards">
                          {['Fast Bowler', 'Spin Bowler'].map((category) => (
                            <div
                              key={category}
                              className={`type-card ${formData.bowlerType === category ? 'selected' : ''} ${errors.bowlerType ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('bowlerType', category)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('bowlerType', category)
                                }
                              }}
                            >
                              <span className="type-card-title">{category}</span>
                            </div>
                          ))}
                        </div>
                        {errors.bowlerType && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlerType}</span>}
                      </div>
                    )}

                    {/* Bowling Arm */}
                    {(formData.playingRole !== 'Bowler' || formData.bowlerType) && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <label className="field-group-label" style={{ margin: 0 }}>Bowling Arm <span className="required">*</span></label>
                        <div className="reg-type-cards">
                          {['Right-Arm Bowler', 'Left-Arm Bowler'].map((arm) => (
                            <div
                              key={arm}
                              className={`type-card ${formData.bowlingStyle === arm ? 'selected' : ''} ${errors.bowlingStyle ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('bowlingStyle', arm)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('bowlingStyle', arm)
                                }
                              }}
                            >
                              <span className="type-card-title">{arm}</span>
                            </div>
                          ))}
                        </div>
                        {errors.bowlingStyle && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlingStyle}</span>}
                      </div>
                    )}

                    {/* Bowling Type (For All-Rounders, or for Bowler who selected Fast Bowler) */}
                    {formData.bowlingStyle && 
                     (formData.playingRole !== 'Bowler' || formData.bowlerType === 'Fast Bowler') && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <label className="field-group-label" style={{ margin: 0 }}>Bowling Type <span className="required">*</span></label>
                        <div className="relegation-cards-grid">
                          {(formData.playingRole === 'Bowler' 
                            ? ['Fast Bowler', 'Medium Fast Bowler'] 
                            : ['Fast Bowler', 'Medium Fast Bowler', 'Spin Bowler']
                          ).map((type) => (
                            <div
                              key={type}
                              className={`type-card ${formData.bowlingSubtype === type ? 'selected' : ''} ${errors.bowlingSubtype ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('bowlingSubtype', type)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('bowlingSubtype', type)
                                }
                              }}
                            >
                              <span className="type-card-title">{type}</span>
                            </div>
                          ))}
                        </div>
                        {errors.bowlingSubtype && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlingSubtype}</span>}
                      </div>
                    )}

                    {/* Spin Type (For All-Rounders who selected Spin Bowler, or for Bowler who selected Spin Bowler) */}
                    {formData.bowlingStyle && 
                     ((formData.playingRole !== 'Bowler' && formData.bowlingSubtype === 'Spin Bowler') || 
                      (formData.playingRole === 'Bowler' && formData.bowlerType === 'Spin Bowler')) && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <label className="field-group-label" style={{ margin: 0 }}>Spin Type <span className="required">*</span></label>
                        <div className="player-status-grid">
                          {['Off Spinner', 'Leg Spinner', 'Left-arm Orthodox', 'Left-arm Unorthodox (Chinaman)'].map((spin) => (
                            <div
                              key={spin}
                              className={`type-card ${formData.spinType === spin ? 'selected' : ''} ${errors.spinType ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('spinType', spin)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('spinType', spin)
                                }
                              }}
                            >
                              <span className="type-card-title">{spin}</span>
                            </div>
                          ))}
                        </div>
                        {errors.spinType && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.spinType}</span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Previous Major Teams */}
                <div className="form-section">
                  <div className="form-group">
                    <label>Previous Major Teams</label>
                    <input
                      type="text"
                      name="prevTeams"
                      value={formData.prevTeams}
                      onChange={handleInputChange}
                      placeholder="e.g. Afghanistan National Team, Sunrisers Leeds"
                    />
                  </div>
                </div>

                {/* Player Status */}
                <div className="form-section">
                  <label className="field-group-label">Player Status <span className="required">*</span></label>
                  <div className="player-status-grid">
                    {[
                      'Afghanistan (National)',
                      'Afghanistan (Domestic)',
                      'Overseas (National)',
                      'Overseas (Domestic)',
                      'Emerging Player (Domestic)'
                    ].map((status) => (
                      <div
                        key={status}
                        className={`type-card ${formData.playerStatus === status ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('playerStatus', status)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption('playerStatus', status)
                          }
                        }}
                      >
                        <span className="type-card-title">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player Status Country Select */}
                {(formData.playerStatus === 'Overseas (National)' || formData.playerStatus === 'Overseas (Domestic)') && (
                  <div className="form-section animate-fade-in">
                    <div className="form-group">
                      <label>Representing Country <span className="required">*</span></label>
                      <SearchableDropdown
                        value={formData.representingCountry}
                        onChange={(val) => handleSelectOption('representingCountry', val)}
                        options={COUNTRIES}
                        placeholder="Search & select country..."
                        error={errors.representingCountry}
                        required
                      />
                      {errors.representingCountry && <span className="error-message">{errors.representingCountry}</span>}
                    </div>
                  </div>
                )}

                {/* Total T20 Matches & Profile Link */}
                <div className="form-section">
                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label>Total T20 Matches</label>
                      <input
                        type="number"
                        name="totalMatches"
                        value={formData.totalMatches}
                        onChange={handleInputChange}
                        placeholder="e.g. 120"
                        className={errors.totalMatches ? 'input-error' : ''}
                      />
                      {errors.totalMatches && <span className="error-message">{errors.totalMatches}</span>}
                    </div>

                    <div className="form-group">
                      <label>ESPNcricinfo or Cricbuzz Profile Link <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                      <input
                        type="url"
                        name="profileLink"
                        value={formData.profileLink}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className={errors.profileLink ? 'input-error' : ''}
                      />
                      {errors.profileLink && <span className="error-message">{errors.profileLink}</span>}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: CATEGORY */}
            {currentStep === 3 && (
              <div className="form-step-content animate-fade-in">
                <div className="form-section">
                  <h3 className="section-title">Select Player Category</h3>
                  <p className="section-subtitle">Choose the category you are registering for. *</p>

                  <div className="categories-grid-cards">
                    {categoriesList.map((cat) => (
                      <div
                        key={cat.id}
                        className={`category-large-card ${formData.category === cat.id ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('category', cat.id, { basePrice: cat.price })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption('category', cat.id, { basePrice: cat.price })
                          }
                        }}
                      >
                        <div className="cat-card-left">
                          <h4 className="cat-card-title">{cat.label}</h4>
                          <p className="cat-card-desc">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relegation Consent */}
                {formData.category && formData.category !== 'Emerging Under-23' && formData.category !== 'Silver Player' && (
                  <>
                    <div className="form-section">
                      <h3 className="section-title">Accept Relegation <span className="required">*</span></h3>
                      <p className="section-subtitle">If you are not selected in your preferred category, do you accept being considered for lower categories?</p>

                      <div className="relegation-cards-grid">
                        <div
                          className={`type-card ${formData.acceptRelegation === 'yes' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                          onClick={() => {
                            if (formData.acceptRelegation !== 'yes') {
                              const autoLimit = formData.category === 'Gold Player' ? 'Silver' : formData.category === 'Diamond Player' ? 'Gold' : ''
                              handleSelectOption('acceptRelegation', 'yes', { relegationLimit: autoLimit })
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              if (formData.acceptRelegation !== 'yes') {
                                const autoLimit = formData.category === 'Gold Player' ? 'Silver' : formData.category === 'Diamond Player' ? 'Gold' : ''
                                handleSelectOption('acceptRelegation', 'yes', { relegationLimit: autoLimit })
                              }
                            }
                          }}
                        >
                          <span className="type-card-title">Yes</span>
                        </div>
                        <div
                          className={`type-card ${formData.acceptRelegation === 'no' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                          onClick={() => {
                            handleSelectOption('acceptRelegation', 'no', { relegationLimit: '' })
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleSelectOption('acceptRelegation', 'no', { relegationLimit: '' })
                            }
                          }}
                        >
                          <span className="type-card-title">No</span>
                        </div>

                      </div>
                      {errors.acceptRelegation && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.acceptRelegation}</span>}
                    </div>

                    {formData.acceptRelegation === 'yes' && (
                      <div className="form-section animate-fade-in">
                        <h3 className="section-title">Relegation accepted till: <span className="required">*</span></h3>
                        <p className="section-subtitle">Select the lowest category you accept being relegated to.</p>

                        <div className="relegation-cards-grid">
                          {formData.category !== 'Gold Player' && formData.category !== 'Diamond Player' && (
                            <div
                              className={`type-card ${formData.relegationLimit === 'Diamond' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('relegationLimit', 'Diamond')}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('relegationLimit', 'Diamond')
                                }
                              }}
                            >
                              <span className="type-card-title">Diamond</span>
                            </div>
                          )}
                          {formData.category !== 'Gold Player' && (
                            <div
                              className={`type-card ${formData.relegationLimit === 'Gold' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                              onClick={() => handleSelectOption('relegationLimit', 'Gold')}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleSelectOption('relegationLimit', 'Gold')
                                }
                              }}
                            >
                              <span className="type-card-title">Gold</span>
                            </div>
                          )}
                          <div
                            className={`type-card ${formData.relegationLimit === 'Silver' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                            onClick={() => handleSelectOption('relegationLimit', 'Silver')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleSelectOption('relegationLimit', 'Silver')
                              }
                            }}
                          >
                            <span className="type-card-title">Silver</span>
                          </div>
                        </div>
                        {errors.relegationLimit && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.relegationLimit}</span>}
                      </div>
                    )}
                  </>
                )}

              </div>
            )}

            {/* STEP 4: UPLOADS */}
            {currentStep === 4 && (
              <div className="form-step-content animate-fade-in">
                <div className="form-section">
                  <h3 className="section-title">Uploads</h3>
                  <p className="section-subtitle">Accepted formats: JPG or PNG for images, plus PDF for documents. Max 5 MB per file.</p>

                  {/* Player Profile Photo */}
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Player Profile Photo <span className="required">*</span></label>
                    <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                      Upload a recent, clear, front-facing portrait photograph.
                    </p>

                    <div className="upload-row-layout">
                      <div className="upload-dropzone-container">
                        <div
                          className={`upload-dropzone ${formData.passportPhoto ? 'has-file' : ''} ${(!formData.passportPhoto && fileMeta.passportPhoto) ? 'has-file-warning' : ''} ${errors.passportPhoto ? 'dropzone-error' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'passportPhoto')}
                          onClick={() => document.getElementById('passportPhotoInput')?.click()}
                          style={{ height: '100%' }}
                        >
                          <input
                            type="file"
                            id="passportPhotoInput"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'passportPhoto')}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-inner">
                            <span className="dropzone-title">
                              {formData.passportPhoto ? `Selected: ${formData.passportPhoto.name}` :
                               fileMeta.passportPhoto ? `Restored: ${fileMeta.passportPhoto.name} (⚠️ Re-upload required)` :
                               'Click or drag a photo here'}
                            </span>
                            <span className="dropzone-subtitle">
                              {formData.passportPhoto ? 'Click to change photo' :
                               fileMeta.passportPhoto ? 'File must be re-selected' :
                               'JPG or PNG, up to 5 MB'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="upload-reference-container">
                        <img src={frontProfileRef} alt="Player Profile Photo Reference" className="upload-reference-img" />
                      </div>
                    </div>
                    {errors.passportPhoto && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.passportPhoto}</span>}
                  </div>

                  {/* Passport Copy */}
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Passport Image<span className="required">*</span></label>

                    <div className="upload-row-layout">
                      <div className="upload-dropzone-container">
                        <div
                          className={`upload-dropzone ${formData.passportScan ? 'has-file' : ''} ${(!formData.passportScan && fileMeta.passportScan) ? 'has-file-warning' : ''} ${errors.passportScan ? 'dropzone-error' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'passportScan')}
                          onClick={() => document.getElementById('passportScanInput')?.click()}
                          style={{ height: '100%' }}
                        >
                          <input
                            type="file"
                            id="passportScanInput"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'passportScan')}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-inner">
                            <span className="dropzone-title">
                              {formData.passportScan ? `Selected: ${formData.passportScan.name}` :
                               fileMeta.passportScan ? `Restored: ${fileMeta.passportScan.name} (⚠️ Re-upload required)` :
                               'Click or drag a file here'}
                            </span>
                            <span className="dropzone-subtitle">
                              {formData.passportScan ? 'Click to change file' :
                               fileMeta.passportScan ? 'File must be re-selected' :
                               'JPG, PNG, or PDF, up to 5 MB'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="upload-reference-container">
                        <img src={idRef} alt="Passport Document Reference" className="upload-reference-img" />
                      </div>
                    </div>
                    {errors.passportScan && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.passportScan}</span>}
                  </div>

                  {/* Action Shot (Optional) */}
                  <div className="form-group">
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Action Shot <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                    <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                      Upload a high-quality action photograph of you playing cricket.
                    </p>

                    <div className="upload-row-layout">
                      <div className="upload-dropzone-container">
                        <div
                          className={`upload-dropzone ${formData.actionShot ? 'has-file' : ''} ${(!formData.actionShot && fileMeta.actionShot) ? 'has-file-warning' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'actionShot')}
                          onClick={() => document.getElementById('actionShotInput')?.click()}
                          style={{ height: '100%' }}
                        >
                          <input
                            type="file"
                            id="actionShotInput"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'actionShot')}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-inner">
                            <span className="dropzone-title">
                              {formData.actionShot ? `Selected: ${formData.actionShot.name}` :
                               fileMeta.actionShot ? `Restored: ${fileMeta.actionShot.name} (⚠️ Re-upload optional)` :
                               'Click or drag a photo here'}
                            </span>
                            <span className="dropzone-subtitle">
                              {formData.actionShot ? 'Click to change photo' :
                               fileMeta.actionShot ? 'File must be re-selected' :
                               'JPG or PNG, up to 5 MB'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="upload-reference-container">
                        <img src={actionShotRef} alt="Action Shot Reference" className="upload-reference-img" />
                      </div>
                    </div>
                  </div>

                  {/* Right Profile Image */}
                  <div className="form-group" style={{ marginTop: '2rem' }}>
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Right Profile Image <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                    <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                      Upload a right-side profile photograph of yourself.
                    </p>

                    <div className="upload-row-layout">
                      <div className="upload-dropzone-container">
                        <div
                          className={`upload-dropzone ${formData.rightProfilePhoto ? 'has-file' : ''} ${(!formData.rightProfilePhoto && fileMeta.rightProfilePhoto) ? 'has-file-warning' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'rightProfilePhoto')}
                          onClick={() => document.getElementById('rightProfilePhotoInput')?.click()}
                          style={{ height: '100%' }}
                        >
                          <input
                            type="file"
                            id="rightProfilePhotoInput"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'rightProfilePhoto')}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-inner">
                            <span className="dropzone-title">
                              {formData.rightProfilePhoto ? `Selected: ${formData.rightProfilePhoto.name}` :
                               fileMeta.rightProfilePhoto ? `Restored: ${fileMeta.rightProfilePhoto.name} (⚠️ Re-upload optional)` :
                               'Click or drag a photo here'}
                            </span>
                            <span className="dropzone-subtitle">
                              {formData.rightProfilePhoto ? 'Click to change photo' :
                               fileMeta.rightProfilePhoto ? 'File must be re-selected' :
                               'JPG or PNG, up to 5 MB'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="upload-reference-container">
                        <img src={rightProfileRef} alt="Right Profile Photo Reference" className="upload-reference-img" />
                      </div>
                    </div>
                  </div>

                  {/* Left Profile Image */}
                  <div className="form-group" style={{ marginTop: '2rem' }}>
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Left Profile Image <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                    <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                      Upload a left-side profile photograph of yourself.
                    </p>

                    <div className="upload-row-layout">
                      <div className="upload-dropzone-container">
                        <div
                          className={`upload-dropzone ${formData.leftProfilePhoto ? 'has-file' : ''} ${(!formData.leftProfilePhoto && fileMeta.leftProfilePhoto) ? 'has-file-warning' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'leftProfilePhoto')}
                          onClick={() => document.getElementById('leftProfilePhotoInput')?.click()}
                          style={{ height: '100%' }}
                        >
                          <input
                            type="file"
                            id="leftProfilePhotoInput"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'leftProfilePhoto')}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-inner">
                            <span className="dropzone-title">
                              {formData.leftProfilePhoto ? `Selected: ${formData.leftProfilePhoto.name}` :
                               fileMeta.leftProfilePhoto ? `Restored: ${fileMeta.leftProfilePhoto.name} (⚠️ Re-upload optional)` :
                               'Click or drag a photo here'}
                            </span>
                            <span className="dropzone-subtitle">
                              {formData.leftProfilePhoto ? 'Click to change photo' :
                               fileMeta.leftProfilePhoto ? 'File must be re-selected' :
                               'JPG or PNG, up to 5 MB'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="upload-reference-container">
                        <img src={leftRef} alt="Left Profile Photo Reference" className="upload-reference-img" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 5: REVIEW */}
            {currentStep === 5 && (
              <div className="form-step-content animate-fade-in">
                <div className="form-section">
                  <h3 className="section-title">Final Review & Consent</h3>
                  <p className="section-subtitle">Please review your registration before submitting.</p>

                  <div className="review-mockup-wrap">

                    {/* AGENT DETAILS */}
                    {formData.regType === 'agent' && (
                      <div className="review-section-block">
                        <span className="review-section-title-line">AGENT DETAILS</span>
                        <div className="review-lines-wrap">
                          <div className="review-line-item">
                            <span className="review-line-label">Agent Full Name</span>
                            <span className="review-line-val">{formData.agentName || '—'}</span>
                          </div>
                          <div className="review-line-item">
                            <span className="review-line-label">Agency / Company Name</span>
                            <span className="review-line-val">{formData.agentAgency || '—'}</span>
                          </div>
                          <div className="review-line-item">
                            <span className="review-line-label">Agent Phone Number</span>
                            <span className="review-line-val">{formData.agentPhone || '—'}</span>
                          </div>
                          <div className="review-line-item">
                            <span className="review-line-label">Agent Email Address</span>
                            <span className="review-line-val">{formData.agentEmail || '—'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PERSONAL INFORMATION */}
                    <div className="review-section-block">
                      <span className="review-section-title-line">PLAYER PERSONAL INFORMATION</span>
                      <div className="review-lines-wrap">
                        <div className="review-line-item">
                          <span className="review-line-label">Full Name</span>
                          <span className="review-line-val">{formData.fullName || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Date of Birth</span>
                          <span className="review-line-val">{formData.dob || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Nationality</span>
                          <span className="review-line-val">{formData.nationality || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Passport Number</span>
                          <span className="review-line-val">{formData.passportNumber || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Country of Residence</span>
                          <span className="review-line-val">{formData.countryResidence || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">City</span>
                          <span className="review-line-val">{formData.city || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Phone</span>
                          <span className="review-line-val">{formData.phone || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Email</span>
                          <span className="review-line-val">{formData.email || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Availability</span>
                          <span className="review-line-val">
                            {Array.isArray(formData.availability) ? (
                              formData.availability.map(key => {
                                if (key === 'full') return 'Available for full season'
                                if (key === 'selected') return 'Available for selected dates'
                                if (key === 'national') return 'Subject to national-team commitments'
                                if (key === 'release') return 'Subject to club or franchise release'
                                return key
                              }).join(', ') || 'None selected'
                            ) : (
                              formData.availability === 'full' ? 'Available for full season' :
                                formData.availability === 'selected' ? 'Available for selected dates' :
                                  formData.availability === 'national' ? 'Subject to national-team commitments' :
                                    'Subject to club or franchise release'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CRICKET PROFILE */}
                    <div className="review-section-block">
                      <span className="review-section-title-line">CRICKET PROFILE</span>
                      <div className="review-lines-wrap">
                        <div className="review-line-item">
                          <span className="review-line-label">Playing Role</span>
                          <span className="review-line-val">{formData.playingRole || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Batting Hand</span>
                          <span className="review-line-val">{formData.battingHand || '—'}</span>
                        </div>
                        {/* Bowling details */}
                        {(formData.playingRole === 'All Rounder (Batting)' || formData.playingRole === 'All Rounder (Bowling)' || formData.playingRole === 'Bowler') ? (
                          <>
                            {formData.playingRole === 'Bowler' && (
                              <div className="review-line-item">
                                <span className="review-line-label">Bowler Category</span>
                                <span className="review-line-val">{formData.bowlerType || '—'}</span>
                              </div>
                            )}
                            {(formData.playingRole !== 'Bowler' || formData.bowlerType) && (
                              <div className="review-line-item">
                                <span className="review-line-label">Bowling Arm</span>
                                <span className="review-line-val">{formData.bowlingStyle || '—'}</span>
                              </div>
                            )}
                            {(formData.playingRole !== 'Bowler' || formData.bowlerType === 'Fast Bowler') && (
                              <div className="review-line-item">
                                <span className="review-line-label">Bowling Type</span>
                                <span className="review-line-val">{formData.bowlingSubtype || '—'}</span>
                              </div>
                            )}
                            {((formData.playingRole !== 'Bowler' && formData.bowlingSubtype === 'Spin Bowler') ||
                              (formData.playingRole === 'Bowler' && formData.bowlerType === 'Spin Bowler')) && (
                              <div className="review-line-item">
                                <span className="review-line-label">Spin Type</span>
                                <span className="review-line-val">{formData.spinType || '—'}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="review-line-item">
                            <span className="review-line-label">Bowling Style</span>
                            <span className="review-line-val">N/A (Batter / Wicketkeeper)</span>
                          </div>
                        )}
                        <div className="review-line-item">
                          <span className="review-line-label">Player Status</span>
                          <span className="review-line-val">{formData.playerStatus || '—'}</span>
                        </div>
                        {(formData.playerStatus === 'Overseas (National)' || formData.playerStatus === 'Overseas (Domestic)') && (
                          <div className="review-line-item">
                            <span className="review-line-label">Representing Country</span>
                            <span className="review-line-val">{formData.representingCountry || '—'}</span>
                          </div>
                        )}
                        <div className="review-line-item">
                          <span className="review-line-label">Total T20 Matches</span>
                          <span className="review-line-val">{formData.totalMatches || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* SELECTED CATEGORY & RELEGATION */}
                    <div className="review-section-block">
                      <span className="review-section-title-line">SELECTED CATEGORY & RELEGATION PREFERENCE</span>
                      <div className="review-lines-wrap">
                        <div className="review-line-item">
                          <span className="review-line-label">Category</span>
                          <span className="review-line-val">{formData.category || '—'}</span>
                        </div>
                        {formData.category !== 'Silver Player' && formData.category !== 'Emerging Under-23' && (
                          <>
                            <div className="review-line-item">
                              <span className="review-line-label">Accepts Relegation</span>
                              <span className="review-line-val">
                                {formData.acceptRelegation === 'yes' ? 'Yes' :
                                  formData.acceptRelegation === 'no' ? 'No' :
                                    formData.acceptRelegation === 'emerging' ? 'Emerging (Does not Apply)' :
                                      '—'}
                              </span>
                            </div>
                            <div className="review-line-item">
                              <span className="review-line-label">Lowest Acceptable Category</span>
                              <span className="review-line-val">
                                {formData.acceptRelegation === 'yes' ? (formData.relegationLimit || '—') : 'N/A'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* UPLOADED DOCUMENTS */}
                    <div className="review-section-block">
                      <span className="review-section-title-line">PLAYER PHOTO & UPLOADED DOCUMENTS</span>
                      <div className="review-lines-wrap">
                        <div className="review-line-item">
                          <span className="review-line-label">Profile Photo</span>
                          <span className="review-line-val">{formData.passportPhoto ? formData.passportPhoto.name : '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Passport Image</span>
                          <span className="review-line-val">{formData.passportScan ? formData.passportScan.name : '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Action Shot</span>
                          <span className="review-line-val">{formData.actionShot ? formData.actionShot.name : '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Right Profile Photo</span>
                          <span className="review-line-val">{formData.rightProfilePhoto ? formData.rightProfilePhoto.name : '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Left Profile Photo</span>
                          <span className="review-line-val">{formData.leftProfilePhoto ? formData.leftProfilePhoto.name : '—'}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Consents */}
                  <div className="review-consents-wrap">
                    <div className="consent-checkbox-line">
                      <input
                        type="checkbox"
                        id="consent-1"
                        checked={consent1}
                        onChange={(e) => setConsent1(e.target.checked)}
                      />
                      <label htmlFor="consent-1">I confirm that all submitted information is accurate.</label>
                    </div>

                    <div className="consent-checkbox-line">
                      <input
                        type="checkbox"
                        id="consent-2"
                        checked={consent2}
                        onChange={(e) => setConsent2(e.target.checked)}
                      />
                      <label htmlFor="consent-2">I confirm that the player has authorized this registration.</label>
                    </div>

                    <div className="consent-checkbox-line">
                      <input
                        type="checkbox"
                        id="consent-3"
                        checked={consent3}
                        onChange={(e) => setConsent3(e.target.checked)}
                      />
                      <label htmlFor="consent-3">I agree to the APL registration terms, verification process, and privacy policy.</label>
                    </div>
                  </div>
                  {errors.consents && (
                    <p className="error-message" style={{ marginTop: '1rem', display: 'block' }}>{errors.consents}</p>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="form-card-footer">
            {currentStep === 5 ? (
              <div className="review-footer-buttons">
                <div className="review-top-buttons-row">
                  <button type="button" className="btn-secondary" onClick={handlePrev}>
                    Back
                  </button>
                  <button type="button" className="btn-save-draft-review" onClick={handleSaveDraft}>
                    Save as Draft
                  </button>
                </div>
                <div className="review-bottom-submit-row">
                  <button
                    type="button"
                    className="btn-submit-registration"
                    onClick={handleNext}
                    disabled={!consent1 || !consent2 || !consent3}
                  >
                    Submit Registration
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
