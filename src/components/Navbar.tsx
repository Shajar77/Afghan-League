import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, User, Handshake } from 'lucide-react'
import aplLogo from '../assets/APL Logo - White.webp'
import './Navbar.css'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [navbarRegisterOpen, setNavbarRegisterOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  interface NavItem {
    label: string;
    href: string;
    hasBadge?: boolean;
  }

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Fixtures', href: '#fixtures' },
    { label: 'Points Table', href: '#points-table' },
    { label: 'News & Media', href: '#news' },
    { label: 'Gallery', href: '#gallery' },
  ]

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#" className="navbar-brand">
          <img src={aplLogo} alt="APL Logo" className="navbar-logo" />
        </a>

        {/* Desktop Navigation Links (Center) */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`desktop-nav-link ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.label)
                setMoreOpen(false)
              }}
            >
              <span className="desktop-nav-link-text">{item.label}</span>
              {item.hasBadge && <span className="nav-link-badge"></span>}
            </a>
          ))}
          {/* More Dropdown Link */}
          <div className="more-dropdown-wrapper">
            <button
              className={`desktop-nav-link ${moreOpen || activeTab === 'Partnerships' || activeTab === 'Contact Us' ? 'active' : ''}`}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <span className="desktop-nav-link-text">MORE</span>
              <ChevronDown size={12} className="desktop-nav-link-text" style={{ marginLeft: '4px' }} />
            </button>
            {moreOpen && (
              <div className="register-dropdown-menu more-dropdown-menu">
                <a href="#partnerships" className="register-option-item" onClick={() => { setMoreOpen(false); setActiveTab('Partnerships'); }}>
                  Partnerships
                </a>
                <a href="#contact-us" className="register-option-item" onClick={() => { setMoreOpen(false); setActiveTab('Contact Us'); }}>
                  Contact Us
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Action Area (Right) */}
        <div className="desktop-actions">
          <div className="register-dropdown-wrapper">
            <button
              className="btn-register-now"
              onClick={() => setNavbarRegisterOpen(!navbarRegisterOpen)}
            >
              <span className="skew-unskew-text">PLAYER REGISTRATION</span>
              <ChevronDown size={16} className="skew-unskew-text" />
            </button>
            {navbarRegisterOpen && (
              <div className="register-dropdown-menu navbar-register-dropdown">
                <a href="#register-player" className="register-option-item" onClick={() => setNavbarRegisterOpen(false)}>
                  <div className="register-option-icon">
                    <User size={18} />
                  </div>
                  <div className="register-option-text">
                    <span className="register-option-title">Register as a Player</span>
                    <span className="register-option-desc">Draft pool entry form</span>
                  </div>
                </a>
                <a href="#register-agent" className="register-option-item" onClick={() => setNavbarRegisterOpen(false)}>
                  <div className="register-option-icon">
                    <Handshake size={18} />
                  </div>
                  <div className="register-option-text">
                    <span className="register-option-title">Register as an Agent</span>
                    <span className="register-option-desc">Official player agent sign up</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls (Top Right Header) */}
        <div className="mobile-controls">
          <button
            className="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.label} className="mobile-nav-item">
              <a
                href={item.href}
                className={`mobile-nav-link ${activeTab === item.label ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.label)
                  setMobileMenuOpen(false)
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Mobile Player Registration Quicklink */}
          <li className="mobile-nav-item">
            <a
              href="#register-player"
              className="mobile-nav-link highlight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register Now
            </a>
          </li>
        </ul>
      </div>

      {/* Bottom Yellow Accent Bar */}
      <div className="navbar-bottom-bar"></div>
    </header>
  )
}
