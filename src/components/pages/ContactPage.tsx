import { useState } from 'react'
import { buildApiUrl, getApiToken } from '../../config/api'
import aboutHeroImg from '../../assets/about-hero-bg.jpeg'
import './ContactPage.css'
// Removed About.css import — shared hero styles have been moved into ContactPage.css

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const token = getApiToken()
      const res = await fetch(buildApiUrl('/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          // Primary Live V6 Postman Schema (PascalCase)
          FullName: formData.name.trim(),
          Email: formData.email.trim(),
          PhoneNumber: formData.phone.trim() || undefined,
          Subject: formData.subject.trim(),
          Message: formData.message.trim(),
          // Backwards-compatible aliases
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      })

      if (res.ok || res.status === 201 || res.status === 204) {
        setSubmitted(true)
        return
      }

      // If the endpoint doesn't exist or returns a non-success status,
      // show a clear error rather than a fake success message
      const json = await res.json().catch(() => ({}))
      setSubmitError(
        json.message ||
        'Failed to send your message. Please email us directly at Contact@apl-t20.com'
      )
    } catch {
      // Network error — guide the user to the email address
      setSubmitError('Could not connect to our servers. Please email us directly at Contact@apl-t20.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page-container about-page">
      {/* Hero Section */}
      <section className="hero-section contact-hero-section">
        <div className="hero-bg">
          <img src={aboutHeroImg} alt="Contact Us Hero" className="hero-video" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title contact-hero-title">CONTACT US</h1>
          <p className="hero-status-subtitle contact-hero-subtitle">Get in touch with the Afghanistan Premier League</p>
        </div>
      </section>

      {/* Contact Form & Info Columns */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          {/* Intro Header: Title and Description */}
          <div className="contact-intro-header">
            <span className="contact-intro-label">Get in touch</span>
            <h2 className="contact-main-heading">
              We are always ready to help you and answer your <span className="highlight-text">questions</span>
            </h2>
            <p className="contact-main-desc">
              Have any questions about tournament schedules, player registrations, franchise ownership, media accreditations, or partnership opportunities? Reach out to us.
            </p>
          </div>

          {/* Left Column Bottom: Details Panel */}
          <div className="contact-details-panel">
            <div className="contact-details-grid">
              <div className="contact-detail-card">
                <h4>Our Location</h4>
                <p>Kabul International Stadium,</p>
                <p>Khan Abdul Ghaffar Khan Rd, Kabul</p>
              </div>
              <div className="contact-detail-card">
                <h4>Email</h4>
                <p><a href="mailto:Contact@apl-t20.com">Contact@apl-t20.com</a></p>
              </div>
              <div className="contact-detail-card">
                <h4>Social network</h4>
                <div className="contact-social-icons">
                  <a href="https://www.facebook.com/APLT20Cricket/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://x.com/theaplt20" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/theaplt20/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@ACBofficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
                      <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#000000" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success-card animate-fade-in" style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                border: '1px solid rgba(13, 18, 64, 0.15)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: '#1F2E7A',
                  fontWeight: 'bold',
                  lineHeight: '1'
                }}>✓</div>
                <h3 style={{
                  fontSize: '1.75rem',
                  color: '#000000',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}>Message Sent</h3>
                <p style={{
                  color: '#1e293b',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: '0 0 1rem 0',
                  maxWidth: '400px'
                }}>
                  Thank you, <strong style={{ color: '#000000' }}>{formData.name}</strong>. Your message regarding "<strong style={{ color: '#000000' }}>{formData.subject}</strong>" has been received. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                  }}
                  className="contact-submit-btn"
                  style={{ width: 'auto', padding: '0.8rem 2rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-title">Get in Touch</h2>
                <p className="contact-form-subtitle">
                  Send us a message and our administration team will assist you shortly.
                </p>

                {submitError && (
                  <div style={{
                    padding: '0.9rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '6px',
                    color: '#f87171',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {submitError}
                  </div>
                )}

                <form className="contact-form-element" onSubmit={handleSubmit}>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-input-wrapper">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-input-wrapper">
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map-section">
        <div className="contact-map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.9936991040375!2d69.21557027633215!3d34.5283477924403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16eb512c14099%3A0xe4438df9ee49292c!2sKabul%20International%20Cricket%20Stadium!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kabul International Cricket Stadium Location Map"
            className="contact-google-map"
          ></iframe>
        </div>
      </section>
    </div>
  )
}
