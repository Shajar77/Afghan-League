import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import aplLogo from '../assets/APL Logo - White.webp'
import londonSpiritLogo from '../assets/london-spirit-white.svg'
import birminghamPhoenixLogo from '../assets/birmingham-phoenix.svg'
import manchesterSuperGiantsLogo from '../assets/manchester-super-giants.svg'
import sunrisersLeedsLogo from '../assets/sunrisers-leeds.svg'
import welshFireLogo from '../assets/welsh-fire-white.svg'
import southernBraveLogo from '../assets/southern-brave-alt.svg'
import './Navbar.css'

interface NavItem {
  label: string;
  href: string;
}

export function Navbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore()
  const [activeTab, setActiveTab] = useState('Home')
  const [moreOpen, setMoreOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  useEffect(() => {
    const syncActiveTab = () => {
      const hash = window.location.hash
      if (hash === '#about') {
        setActiveTab('About')
      } else if (hash === '#teams') {
        setActiveTab('Teams')
      } else if (hash === '#news') {
        setActiveTab('News & Media')
      } else if (hash === '#fixtures') {
        setActiveTab('Fixtures')
      } else if (hash === '#points-table') {
        setActiveTab('Points Table')
      } else if (hash === '#gallery') {
        setActiveTab('Gallery')
      } else if (hash === '#partnerships') {
        setActiveTab('Partnerships')
      } else if (hash === '#contact-us' || hash === '#contact') {
        setActiveTab('Contact Us')
      } else {
        setActiveTab('Home')
      }
    }
    syncActiveTab()
    window.addEventListener('hashchange', syncActiveTab)
    return () => window.removeEventListener('hashchange', syncActiveTab)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Teams', href: '#teams' },
    { label: 'Fixtures', href: '#fixtures' },
    { label: 'Points Table', href: '#points-table' },
    { label: 'News & Media', href: '#news' },
    { label: 'Gallery', href: '#gallery' },
  ]

  const teamLogos = [
    { src: londonSpiritLogo, alt: 'London Spirit' },
    { src: birminghamPhoenixLogo, alt: 'Birmingham Phoenix' },
    { src: manchesterSuperGiantsLogo, alt: 'Manchester Super Giants' },
    { src: sunrisersLeedsLogo, alt: 'Sunrisers Leeds' },
    { src: welshFireLogo, alt: 'Welsh Fire' },
    { src: southernBraveLogo, alt: 'Southern Brave' },
  ]

  return (
    <header className="navbar-header">

      {/* ── TOP ROW: Logo | Team Logos | Register ── */}
      <div className="navbar-top-row">
        <div className="navbar-top-inner">

          {/* Left: APL Brand Logo */}
          <a href="#home" className="navbar-brand" onClick={() => setActiveTab('Home')}>
            <img src={aplLogo} alt="APL Logo" className="navbar-logo" />
          </a>

          {/* Center: Team Logos Strip */}
          <div className="navbar-teams-strip">
            <div className="navbar-teams-divider-left" />
            {teamLogos.map((team) => (
              <a key={team.alt} href="#home" className="navbar-team-logo-wrap" title={team.alt}>
                <img src={team.src} alt={team.alt} className="navbar-team-logo" />
              </a>
            ))}
            <div className="navbar-teams-divider-right" />
          </div>

          {/* Right: Register Button */}
          <div className="navbar-top-right">
            <a href="#register-player" className="btn-register-now desktop-register">
              <span className="skew-unskew-text">PLAYER REGISTRATION</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              className="menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Nav Links (Desktop only) ── */}
      <div className="navbar-bottom-row">
        <div className="navbar-bottom-inner">
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
              </a>
            ))}

            {/* More Dropdown */}
            <div className="more-dropdown-wrapper" ref={dropdownRef}>
              <button
                className={`desktop-nav-link ${moreOpen || activeTab === 'Partnerships' || activeTab === 'Contact Us' ? 'active' : ''}`}
                onClick={() => setMoreOpen(!moreOpen)}
              >
                <span className="desktop-nav-link-text">MORE</span>
                <ChevronDown size={11} className="desktop-nav-link-text" style={{ marginLeft: '3px' }} />
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
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <a href="#home" className="navbar-brand" onClick={() => { setActiveTab('Home'); setMobileMenuOpen(false); }}>
            <img src={aplLogo} alt="APL Logo" className="navbar-logo" />
          </a>
          <button
            className="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

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
          <li className="mobile-nav-item">
            <a
              href="#partnerships"
              className={`mobile-nav-link ${activeTab === 'Partnerships' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Partnerships'); setMobileMenuOpen(false) }}
            >
              Partnerships
            </a>
          </li>
          <li className="mobile-nav-item">
            <a
              href="#contact-us"
              className={`mobile-nav-link ${activeTab === 'Contact Us' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Contact Us'); setMobileMenuOpen(false) }}
            >
              Contact Us
            </a>
          </li>
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

    </header>
  )
}
