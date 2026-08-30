import React, { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { buildApiUrl, publicFetch } from '../../config/api'
import aplLogo from '../../assets/Asset 2@2x.png'
import { FEATURES } from '../../constants/features'
import './Footer.css'

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccessMsg, setNewsletterSuccessMsg] = useState<string | null>(null)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [newsletterFocused, setNewsletterFocused] = useState(false)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Anti-bot check
    if (honeypot.trim()) {
      console.warn('Bot newsletter subscription blocked via honeypot.')
      return
    }

    const trimmedEmail = newsletterEmail.trim()
    if (!trimmedEmail) return

    setIsSubmitting(true)
    setNewsletterError(null)
    setNewsletterSuccessMsg(null)

    try {
      let activeCaptchaToken = captchaToken
      if (siteKey && recaptchaRef.current) {
        try {
          activeCaptchaToken = (await recaptchaRef.current.executeAsync()) || captchaToken
        } catch {
          activeCaptchaToken = captchaToken
        }
      }

      const payload = {
        email: trimmedEmail,
        captchaToken: activeCaptchaToken || '',
        recaptcha_token: activeCaptchaToken || '',
        recaptchaToken: activeCaptchaToken || ''
      }

      const res = await publicFetch(buildApiUrl('/newsletter/subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (res.status === 429) {
        setNewsletterError('Rate limit reached: Maximum 5 attempts per 15 minutes. Please wait.')
        return
      }

      const json = await res.json().catch(() => ({}))

      if (res.ok || res.status === 200 || res.status === 201) {
        const msg = json.message || ''
        const isAlreadySubscribed = msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist')

        if (isAlreadySubscribed) {
          // Display already subscribed message in red without tick icon
          setNewsletterError(msg || 'You are already subscribed.')
          setTimeout(() => {
            setNewsletterError(null)
          }, 5000)
        } else {
          // New subscription: display success in green with checkmark
          const successText = msg || 'Thank you! Your email has been registered for updates.'
          setNewsletterSuccessMsg(successText.startsWith('✓') ? successText : `✓ ${successText}`)
          setNewsletterEmail('')
          setTimeout(() => {
            setNewsletterSuccessMsg(null)
          }, 5000)
        }
      } else {
        setNewsletterError(json.error?.message || json.message || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setNewsletterError('Unable to connect to server. Please try again later.')
    } finally {
      setIsSubmitting(false)
      if (siteKey && recaptchaRef.current) {
        recaptchaRef.current.reset()
        setCaptchaToken(null)
      }
    }
  }

  return (
    <footer className="app-footer">
      <div className="footer-container">

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-info">
            <h3 className="newsletter-subtitle">STAY UPDATED</h3>
            <p className="newsletter-desc">
              Be the first to receive match updates, ticket alerts, and official league announcements.
            </p>
          </div>
          <div className="newsletter-action-wrap">
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              {/* Anti-Spam Bot Trap (Honeypot) */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <label htmlFor="newsletter_hp_website">Leave this field blank</label>
                <input
                  id="newsletter_hp_website"
                  type="text"
                  name="newsletter_hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="newsletter-input" 
                required 
                disabled={isSubmitting}
                value={newsletterEmail}
                onFocus={() => setNewsletterFocused(true)}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value)
                  if (newsletterError) setNewsletterError(null)
                }}
              />
              <button 
                type="submit" 
                className="btn-newsletter-subscribe"
                disabled={isSubmitting || !newsletterEmail.trim()}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </form>
            {siteKey && (newsletterFocused || newsletterEmail.length > 0) && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                size="invisible"
                onChange={(t) => setCaptchaToken(t)}
                onExpired={() => setCaptchaToken(null)}
              />
            )}
            {newsletterSuccessMsg && (
              <div className="newsletter-success-msg">{newsletterSuccessMsg}</div>
            )}
            {newsletterError && (
              <div className="newsletter-error-msg">{newsletterError}</div>
            )}
          </div>
        </div>

        <div className="footer-divider" />

        {/* Main Footer Columns Grid */}
        <div className="footer-grid">

          {/* Column 1: Brand Info Block */}
          <div className="footer-col brand-col">
            <img src={aplLogo} alt="APL Logo" className="footer-logo-main" loading="lazy" width="182" height="54" decoding="async" />
            <p className="footer-brand-desc">
              The premier T20 cricket league of Afghanistan. Experience raw domestic talents, global superstars, and electrifying matches.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col links-col nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              {FEATURES.SHOW_FIXTURES && <li><a href="#fixtures">Fixtures & Results</a></li>}
              {FEATURES.SHOW_POINTS_TABLE && <li><a href="#points-table">Points Table</a></li>}
              {FEATURES.SHOW_NEWS && <li><a href="#news">Latest News</a></li>}
              {FEATURES.SHOW_GALLERY && <li><a href="#gallery">Media Gallery</a></li>}
            </ul>
          </div>

          {/* Column 3: Resource Document Links */}
          <div className="footer-col links-col resources-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links-list">
              <li><a href="#acb-governance">ACB Governance</a></li>
              {FEATURES.SHOW_REGISTRATION && <li><a href="#register-player">Player Registration</a></li>}
              {FEATURES.SHOW_LEAGUE_FAQ && <li><a href="#league-faq">League FAQ</a></li>}
              {FEATURES.SHOW_MEDIA_KIT && <li><a href="#media-kit">Media Kit</a></li>}
            </ul>
          </div>

          {/* Column 4: Info & Support Links */}
          <div className="footer-col links-col info-col">
            <h4 className="footer-col-title">Info & Support</h4>
            <ul className="footer-links-list">
              {FEATURES.SHOW_ABOUT && <li><a href="#about">About APL</a></li>}
              {FEATURES.SHOW_PARTNERSHIPS && <li><a href="#partnerships">Partnerships</a></li>}
              {FEATURES.SHOW_CONTACT && <li><a href="#contact-us">Contact Us</a></li>}
            </ul>
          </div>

          {/* Column 5: Franchises Links */}
          {FEATURES.SHOW_TEAMS && (
            <div className="footer-col links-col franchises-col">
              <h4 className="footer-col-title">Franchises</h4>
              <ul className="footer-links-list">
                <li><a href="#teams">Kabul Knights</a></li>
                <li><a href="#teams">Kandahar Kings</a></li>
                <li><a href="#teams">Balkh Legends</a></li>
                <li><a href="#teams">Paktia Panthers</a></li>
                <li><a href="#teams">Amo Sharks</a></li>
                <li><a href="#teams">Band-e-Amir Dragons</a></li>
              </ul>
            </div>
          )}

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} Afghanistan Premier League. All Rights Reserved. Governed under the ACB.
          </p>
          <div className="footer-bottom-right-wrap">
            <div className="footer-social-list bottom-socials">
              <a href="https://www.facebook.com/APLT20Cricket/" target="_blank" rel="noopener noreferrer" className="social-circle facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/theaplt20/" target="_blank" rel="noopener noreferrer" className="social-circle instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://x.com/theaplt20" target="_blank" rel="noopener noreferrer" className="social-circle twitter" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@ACBofficial" target="_blank" rel="noopener noreferrer" className="social-circle youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
                  <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#000000" />
                </svg>
              </a>
              <button 
                className="chat-bubble-round" 
                aria-label="Chat Support"
                onClick={() => { window.location.hash = '#contact' }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
