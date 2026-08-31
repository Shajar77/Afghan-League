import { useState, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Step1Personal } from '../registration/Step1Personal'
import { Step2Cricket } from '../registration/Step2Cricket'
import { Step3Category } from '../registration/Step3Category'
import { Step4Uploads } from '../registration/Step4Uploads'
import { Step5Review } from '../registration/Step5Review'
import { scrollToTop } from '../../utils/lenis'
import { useRegisterData } from './useRegisterData'
import { useRegisterForm } from './useRegisterForm'
import { useRegisterSubmit } from './useRegisterSubmit'
import { RegisterAccessDeniedView, RegisterSuccessView } from './RegisterPageViews'
import './RegisterPage.css'

const STEPS = [
  { id: 1, label: 'PERSONAL' },
  { id: 2, label: 'CRICKET' },
  { id: 3, label: 'CATEGORY' },
  { id: 4, label: 'UPLOADS' },
  { id: 5, label: 'REVIEW' },
]

export function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [refCode, setRefCode] = useState<string>('')
  const [honeypot, setHoneypot] = useState<string>('')

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

  // Strict Private Access Guard Check — requires key in URL
  const checkPrivateAccess = () => {
    const fullUrl = window.location.href.toLowerCase()
    return (
      fullUrl.includes('key=apl2026') ||
      fullUrl.includes('key=private') ||
      fullUrl.includes('access=private') ||
      fullUrl.includes('invite=apl2026')
    )
  }

  const isAuthorized = checkPrivateAccess()

  // Sub-hooks
  const {
    apiCountries,
    apiCategories,
    apiAvailabilities,
    apiPlayerStatuses,
    apiPlayingRoles,
  } = useRegisterData()

  const {
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
    handleInputChange,
    handleSelectOption,
    handleToggleAvailability,
    handleFileChange,
    handleDragOver,
    handleDrop,
    validateStep,
    scrollToFormTop,
    clearDraft,
    resetForm,
  } = useRegisterForm()

  const { isSubmitting, submitError, submit } = useRegisterSubmit()

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        scrollToFormTop()
        setCurrentStep(prev => prev + 1)
      } else {
        // Anti-bot check: silent abort if honeypot is populated
        if (honeypot.trim()) {
          return
        }

        // Guard: ensure all declarations/consents are accepted
        if (!consent1 || !consent2 || !consent3 || !consent4) {
          setErrors({ consents: 'Please accept all declarations before submitting.' })
          return
        }

        let captchaToken = ''
        if (siteKey && recaptchaRef.current) {
          try {
            captchaToken = (await recaptchaRef.current.executeAsync()) || ''
          } catch {
            // Fallback handled gracefully
          }
        }

        try {
          const generatedCode = await submit(formData, captchaToken)
          clearDraft()
          setRefCode(generatedCode)
          setIsSubmitted(true)
          scrollToTop(true)
        } catch {
          // Error state is handled inside useRegisterSubmit
        } finally {
          if (siteKey && recaptchaRef.current) {
            recaptchaRef.current.reset()
          }
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

  const handleReset = () => {
    resetForm()
    setIsSubmitted(false)
    setRefCode('')
    setHoneypot('')
  }

  if (!isAuthorized) {
    return <RegisterAccessDeniedView />
  }

  if (isSubmitted) {
    return (
      <RegisterSuccessView
        formData={formData}
        refCode={refCode}
        onReset={handleReset}
      />
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
            <h1 className="register-main-title">
              PLAYER REGISTRATION<span className="dot-accent">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="register-content-section">
        <div className="register-form-card">
          {/* Progress Steps Header */}
          <div className="register-steps-header">
            <div className="steps-container">
              {STEPS.map(step => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                return (
                  <div
                    key={step.id}
                    className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="step-circle-wrapper">
                      <button
                        type="button"
                        className="step-circle"
                        aria-label={`Go to Step ${step.id}: ${step.label}`}
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

          {/* Anti-Spam Bot Trap (Honeypot) */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
            <label htmlFor="reg_hp_website">Leave this field blank</label>
            <input
              id="reg_hp_website"
              type="text"
              name="reg_hp_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {siteKey && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              size="invisible"
            />
          )}

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
                  textAlign: 'center',
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
                    className="btn-submit-registration"
                    onClick={handleNext}
                    disabled={
                      isSubmitting ||
                      !consent1 ||
                      !consent2 ||
                      !consent3 ||
                      !consent4
                    }
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="buttons-row">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handlePrev}
                  >
                    Back
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
