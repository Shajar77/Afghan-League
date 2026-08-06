import aboutHeroImg from '../assets/about-hero-bg.jpeg'
import './ContactPage.css'
import './About.css'

export function ContactPage() {
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
            <h2 className="contact-form-title">Get in Touch</h2>
            <p className="contact-form-subtitle">
              Send us a message and our administration team will assist you shortly.
            </p>

            <form className="contact-form-element" onSubmit={(e) => e.preventDefault()}>
              <div className="form-input-wrapper">
                <input type="text" id="contact-name" placeholder="Full name" required />
              </div>
              <div className="form-input-wrapper">
                <input type="email" id="contact-email" placeholder="Email" required />
              </div>
              <div className="form-input-wrapper">
                <input type="tel" id="contact-phone" placeholder="Phone number" />
              </div>

              <div className="form-input-wrapper">
                <input type="text" id="contact-subject" placeholder="Subject" required />
              </div>
              <div className="form-input-wrapper">
                <textarea id="contact-message" rows={4} placeholder="Message" required></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
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
