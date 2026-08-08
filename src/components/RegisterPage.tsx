import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, User, Award, Layers, Upload, Eye } from 'lucide-react'
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
  bowlingStyle: string
  currentClub: string
  prevTeams: string
  playerStatus: string
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
  nocDoc: File | null
  actionShot: File | null
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
  playingRole: 'All-Rounder',
  battingHand: 'Right-Handed',
  bowlingStyle: '',
  currentClub: '',
  prevTeams: '',
  playerStatus: 'Afghanistan Domestic',
  totalMatches: '',
  profileLink: '',
  category: 'Gold Player',
  basePrice: '$20,000',
  acceptRelegation: '',
  relegationLimit: '',
  passportPhoto: null,
  passportScan: null,
  nocDoc: null,
  actionShot: null,
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

  // Step 5 Consents
  const [consent1, setConsent1] = useState<boolean>(false)
  const [consent2, setConsent2] = useState<boolean>(false)
  const [consent3, setConsent3] = useState<boolean>(false)

  useEffect(() => {
    // Disable native browser scroll restoration to prevent snapping to footer on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // Instantly scroll to top of page on mount
    const timer = setTimeout(() => {
      if ((window as any).lenis) {
        ;(window as any).lenis.scrollTo(0, { immediate: true })
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
          nocDoc: null,
          actionShot: null,
        }))
      } catch (e) {
        console.error('Failed to load draft from localStorage', e)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  // Auto-save form data draft to localStorage on any input change
  useEffect(() => {
    const { passportPhoto: _pPhoto, passportScan: _pScan, nocDoc: _nocDoc, actionShot: _aShot, ...serializable } = formData
    if (!isSubmitted) {
      localStorage.setItem('apl_player_registration_draft', JSON.stringify(serializable))
    }
  }, [formData, isSubmitted])

  // Auto-save current step to localStorage
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem('apl_player_registration_step', String(currentStep))
    }
  }, [currentStep, isSubmitted])

  const steps = [
    { id: 1, label: 'PERSONAL', icon: User },
    { id: 2, label: 'CRICKET', icon: Award },
    { id: 3, label: 'CATEGORY', icon: Layers },
    { id: 4, label: 'UPLOADS', icon: Upload },
    { id: 5, label: 'REVIEW', icon: Eye },
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
      if (!formData.currentClub.trim()) newErrors.currentClub = 'Current Club / Team is required'
      if (!formData.playerStatus) newErrors.playerStatus = 'Player Status is required'

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
      if (!formData.passportScan) newErrors.passportScan = 'Passport Copy is required'
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

  const handleSelectOption = (fieldName: string, value: any, extraData = {}) => {
    setFormData(prev => ({ ...prev, [fieldName]: value, ...extraData }))
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passportPhoto' | 'passportScan' | 'nocDoc' | 'actionShot') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const allowedTypes = fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(file, allowedTypes, 5)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: file }))
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

  const handleDrop = (e: React.DragEvent, fieldName: 'passportPhoto' | 'passportScan' | 'nocDoc' | 'actionShot') => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const allowedTypes = fieldName === 'passportScan' ? ['jpg', 'jpeg', 'png', 'pdf'] : ['jpg', 'jpeg', 'png']
      const errorMsg = validateFile(file, allowedTypes, 5)

      if (errorMsg) {
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }))
        setFormData(prev => ({ ...prev, [fieldName]: null }))
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: file }))
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
        ;(window as any).lenis.scrollTo(el, { immediate: true, offset: -90 })
      } else {
        const yOffset = -90 // clearance for sticky navbar
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'auto' })
      }
    } else {
      if ((window as any).lenis) {
        ;(window as any).lenis.scrollTo(0, { immediate: true })
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
        // Final Submit
        localStorage.removeItem('apl_player_registration_draft')
        localStorage.removeItem('apl_player_registration_step')
        setRefCode(`APL-2026-${Math.floor(Math.random() * 90000) + 10000}`)
        setIsSubmitted(true)
        if ((window as any).lenis) {
          ;(window as any).lenis.scrollTo(0, { immediate: true })
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
    const { passportPhoto: _passportPhoto, passportScan: _passportScan, nocDoc: _nocDoc, actionShot: _actionShot, ...serializableData } = formData
    localStorage.setItem('apl_player_registration_draft', JSON.stringify(serializableData))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 3000)
  }

  const handleReset = () => {
    localStorage.removeItem('apl_player_registration_draft')
    localStorage.removeItem('apl_player_registration_step')
    setFormData(initialFormData)
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
                    >
                      <span className="type-card-title">I am the Player</span>
                    </div>
                    <div
                      className={`type-card ${formData.regType === 'agent' ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('regType', 'agent')}
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
                    >
                      <span className="avail-card-title">Available for full season</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('selected') : formData.availability === 'selected') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('selected')}
                    >
                      <span className="avail-card-title">Available for selected dates</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('national') : formData.availability === 'national') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('national')}
                    >
                      <span className="avail-card-title">Subject to national-team commitments</span>
                    </div>
                    <div
                      className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes('release') : formData.availability === 'release') ? 'selected' : ''}`}
                      onClick={() => handleToggleAvailability('release')}
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
                    {['Batter', 'Wicketkeeper-Batter', 'All-Rounder', 'Fast Bowler', 'Spin Bowler'].map((role) => (
                      <div
                        key={role}
                        className={`type-card ${formData.playingRole === role ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('playingRole', role)}
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
                      >
                        <span className="type-card-title">{hand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bowling Style & Current Club / Team */}
                <div className="form-section">
                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label>Bowling Style</label>
                      <input
                        type="text"
                        name="bowlingStyle"
                        value={formData.bowlingStyle}
                        onChange={handleInputChange}
                        placeholder="e.g. Right-arm leg spin"
                      />
                    </div>

                    <div className="form-group">
                      <label>Current Club / Team <span className="required">*</span></label>
                      <input
                        type="text"
                        name="currentClub"
                        value={formData.currentClub}
                        onChange={handleInputChange}
                        placeholder="e.g. Kabul Knights"
                        className={errors.currentClub ? 'input-error' : ''}
                        required
                      />
                      {errors.currentClub && <span className="error-message">{errors.currentClub}</span>}
                    </div>
                  </div>
                </div>

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
                      'Afghanistan International',
                      'Afghanistan Domestic',
                      'Overseas International',
                      'Overseas Domestic',
                      'Domestic Emerging Player'
                    ].map((status) => (
                      <div
                        key={status}
                        className={`type-card ${formData.playerStatus === status ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('playerStatus', status)}
                      >
                        <span className="type-card-title">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
                <div className="form-section">
                  <h3 className="section-title">Accept Relegation <span className="required">*</span></h3>
                  <p className="section-subtitle">If you are not selected in your preferred category, do you accept being considered for lower categories?</p>
                  
                  <div className="relegation-cards-grid">
                    <div 
                      className={`type-card ${formData.acceptRelegation === 'yes' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                      onClick={() => {
                        handleSelectOption('acceptRelegation', 'yes')
                        handleSelectOption('relegationLimit', '') // reset limit
                      }}
                    >
                      <span className="type-card-title">Yes</span>
                    </div>
                    <div 
                      className={`type-card ${formData.acceptRelegation === 'no' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                      onClick={() => {
                        handleSelectOption('acceptRelegation', 'no')
                        handleSelectOption('relegationLimit', '') // reset limit
                      }}
                    >
                      <span className="type-card-title">No</span>
                    </div>
                    <div 
                      className={`type-card ${formData.acceptRelegation === 'emerging' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                      onClick={() => {
                        handleSelectOption('acceptRelegation', 'emerging')
                        handleSelectOption('relegationLimit', '') // reset limit
                      }}
                    >
                      <span className="type-card-title">Emerging (Does not Apply)</span>
                    </div>
                  </div>
                  {errors.acceptRelegation && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.acceptRelegation}</span>}
                </div>

                {formData.acceptRelegation === 'yes' && (
                  <div className="form-section animate-fade-in">
                    <h3 className="section-title">Relegation accepted till: <span className="required">*</span></h3>
                    <p className="section-subtitle">Select the lowest category you accept being relegated to.</p>
                    
                    <div className="relegation-cards-grid">
                      <div 
                        className={`type-card ${formData.relegationLimit === 'Diamond' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                        onClick={() => handleSelectOption('relegationLimit', 'Diamond')}
                      >
                        <span className="type-card-title">Diamond</span>
                      </div>
                      <div 
                        className={`type-card ${formData.relegationLimit === 'Gold' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                        onClick={() => handleSelectOption('relegationLimit', 'Gold')}
                      >
                        <span className="type-card-title">Gold</span>
                      </div>
                      <div 
                        className={`type-card ${formData.relegationLimit === 'Silver' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                        onClick={() => handleSelectOption('relegationLimit', 'Silver')}
                      >
                        <span className="type-card-title">Silver</span>
                      </div>
                    </div>
                    {errors.relegationLimit && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.relegationLimit}</span>}
                  </div>
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

                    <div
                      className={`upload-dropzone ${formData.passportPhoto ? 'has-file' : ''} ${errors.passportPhoto ? 'dropzone-error' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'passportPhoto')}
                      onClick={() => document.getElementById('passportPhotoInput')?.click()}
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
                          {formData.passportPhoto ? `Selected: ${formData.passportPhoto.name}` : 'Click or drag a photo here'}
                        </span>
                        <span className="dropzone-subtitle">
                          {formData.passportPhoto ? 'Click to change photo' : 'JPG or PNG, up to 5 MB'}
                        </span>
                      </div>
                    </div>
                    {errors.passportPhoto && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.passportPhoto}</span>}
                  </div>

                  {/* Passport Copy */}
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Passport Copy <span className="required">*</span></label>

                    <div
                      className={`upload-dropzone ${formData.passportScan ? 'has-file' : ''} ${errors.passportScan ? 'dropzone-error' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'passportScan')}
                      onClick={() => document.getElementById('passportScanInput')?.click()}
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
                          {formData.passportScan ? `Selected: ${formData.passportScan.name}` : 'Click or drag a file here'}
                        </span>
                        <span className="dropzone-subtitle">
                          {formData.passportScan ? 'Click to change file' : 'JPG, PNG, or PDF, up to 5 MB'}
                        </span>
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

                    <div
                      className={`upload-dropzone ${formData.actionShot ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'actionShot')}
                      onClick={() => document.getElementById('actionShotInput')?.click()}
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
                          {formData.actionShot ? `Selected: ${formData.actionShot.name}` : 'Click or drag a photo here'}
                        </span>
                        <span className="dropzone-subtitle">
                          {formData.actionShot ? 'Click to change photo' : 'JPG or PNG, up to 5 MB'}
                        </span>
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
                        <div className="review-line-item">
                          <span className="review-line-label">Bowling Style</span>
                          <span className="review-line-val">{formData.bowlingStyle || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Current Club</span>
                          <span className="review-line-val">{formData.currentClub || '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Player Status</span>
                          <span className="review-line-val">{formData.playerStatus || '—'}</span>
                        </div>
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
                          <span className="review-line-label">Passport Copy</span>
                          <span className="review-line-val">{formData.passportScan ? formData.passportScan.name : '—'}</span>
                        </div>
                        <div className="review-line-item">
                          <span className="review-line-label">Action Shot</span>
                          <span className="review-line-val">{formData.actionShot ? formData.actionShot.name : '—'}</span>
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
                {currentStep > 1 ? (
                  <button type="button" className="btn-secondary" onClick={handlePrev}>
                    Back
                  </button>
                ) : (
                  <button type="button" className="btn-secondary" onClick={handleSaveDraft}>
                    Save as Draft
                  </button>
                )}

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
