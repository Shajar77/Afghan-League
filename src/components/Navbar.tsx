import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, UserPlus, ClipboardList } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import aplLogo from '../assets/Asset 2@2x.png'
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
  const { mobileMenuOpen, setMobileMenuOpen, currentPage } = useAppStore()
  const [moreOpen, setMoreOpen] = useState(false)
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false)
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const registerDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(e.target as Node)) {
        setRegisterDropdownOpen(false)
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
          <a href="#home" className="navbar-brand">
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
            <div 
              className="register-dropdown-wrapper desktop-register" 
              ref={registerDropdownRef}
            >
              <button 
                className="btn-register-now"
                onClick={() => setRegisterDropdownOpen(prev => !prev)}
              >
                <span className="skew-unskew-text">PLAYER REGISTRATION</span>
                <ChevronDown size={14} className={`dropdown-arrow-icon ${registerDropdownOpen ? 'open' : ''}`} />
              </button>
              
              {registerDropdownOpen && (
                <div className="register-dropdown-menu">
                  <a 
                    href="#register-player" 
                    className={`dropdown-item ${currentPage === 'player-register' ? 'active' : ''}`}
                    onClick={() => {
                      setRegisterDropdownOpen(false)
                    }}
                  >
                    <UserPlus size={16} strokeWidth={2.5} className="dropdown-item-icon" />
                    <div className="dropdown-item-text-wrap">
                      <span className="dropdown-item-title">Player Registration</span>
                      <span className="dropdown-item-desc">Submit draft form</span>
                    </div>
                  </a>
                  <a 
                    href="#register-status" 
                    className={`dropdown-item ${currentPage === 'register-status' ? 'active' : ''}`}
                    onClick={() => {
                      setRegisterDropdownOpen(false)
                    }}
                  >
                    <ClipboardList size={16} strokeWidth={2.5} className="dropdown-item-icon" />
                    <div className="dropdown-item-text-wrap">
                      <span className="dropdown-item-title">Registration Status</span>
                      <span className="dropdown-item-desc">Track review progress</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

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
            {(() => {
              const isTabActive = (label: string): boolean => {
                if (label === 'Home') return currentPage === 'home'
                if (label === 'About') return currentPage === 'about'
                if (label === 'Teams') return currentPage === 'teams'
                if (label === 'Fixtures') return currentPage === 'fixtures'
                if (label === 'Points Table') return currentPage === 'points-table'
                if (label === 'News & Media') return currentPage === 'news'
                if (label === 'Gallery') return currentPage === 'gallery'
                return false
              }
              return (
                <>
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`desktop-nav-link ${isTabActive(item.label) ? 'active' : ''}`}
                      onClick={() => {
                        setMoreOpen(false)
                      }}
                    >
                      <span className="desktop-nav-link-text">{item.label}</span>
                    </a>
                  ))}

                  {/* More Dropdown */}
                  <div className="more-dropdown-wrapper" ref={dropdownRef}>
                    <button
                      className={`desktop-nav-link ${moreOpen || currentPage === 'partnerships' || currentPage === 'contact' ? 'active' : ''}`}
                      onClick={() => setMoreOpen(!moreOpen)}
                    >
                      <span className="desktop-nav-link-text">MORE</span>
                      <ChevronDown size={11} className="desktop-nav-link-text" style={{ marginLeft: '3px' }} />
                    </button>
                    {moreOpen && (
                      <div className="register-dropdown-menu more-dropdown-menu">
                        <a href="#partnerships" className="register-option-item" onClick={() => setMoreOpen(false)}>
                          Partnerships
                        </a>
                        <a href="#contact-us" className="register-option-item" onClick={() => setMoreOpen(false)}>
                          Contact Us
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
          </nav>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <a href="#home" className="navbar-brand" onClick={() => { setMobileMenuOpen(false); }}>
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
          {(() => {
            const isTabActive = (label: string): boolean => {
              if (label === 'Home') return currentPage === 'home'
              if (label === 'About') return currentPage === 'about'
              if (label === 'Teams') return currentPage === 'teams'
              if (label === 'Fixtures') return currentPage === 'fixtures'
              if (label === 'Points Table') return currentPage === 'points-table'
              if (label === 'News & Media') return currentPage === 'news'
              if (label === 'Gallery') return currentPage === 'gallery'
              return false
            }
            return (
              <>
                {navItems.map((item) => (
                  <li key={item.label} className="mobile-nav-item">
                    <a
                      href={item.href}
                      className={`mobile-nav-link ${isTabActive(item.label) ? 'active' : ''}`}
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </>
            )
          })()}
          <li className="mobile-nav-item">
            <a
              href="#partnerships"
              className={`mobile-nav-link ${currentPage === 'partnerships' ? 'active' : ''}`}
              onClick={() => { setMobileMenuOpen(false) }}
            >
              Partnerships
            </a>
          </li>
          <li className="mobile-nav-item">
            <a
              href="#contact-us"
              className={`mobile-nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => { setMobileMenuOpen(false) }}
            >
              Contact Us
            </a>
          </li>
          <li className="mobile-nav-item">
            <button
              className={`mobile-nav-link ${currentPage === 'player-register' || currentPage === 'register-status' ? 'active' : ''}`}
              onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <span>Player Registration</span>
              <ChevronDown 
                size={18} 
                style={{ 
                  transform: mobileRegisterOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s ease', 
                  marginLeft: '0.5rem',
                  opacity: 0.6 
                }} 
              />
            </button>
            
            {mobileRegisterOpen && (
              <ul className="mobile-submenu animate-fade-in" style={{ padding: '0 0 0.5rem 0', listStyle: 'none', backgroundColor: 'rgba(0, 0, 0, 0.12)' }}>
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <a
                    href="#register-player"
                    className={`mobile-nav-link ${currentPage === 'player-register' ? 'active' : ''}`}
                    style={{
                      fontSize: '1.25rem',
                      padding: '0.75rem 2rem'
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setMobileRegisterOpen(false)
                    }}
                  >
                    Player Registration
                  </a>
                </li>
                <li>
                  <a
                    href="#register-status"
                    className={`mobile-nav-link ${currentPage === 'register-status' ? 'active' : ''}`}
                    style={{
                      fontSize: '1.25rem',
                      padding: '0.75rem 2rem'
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setMobileRegisterOpen(false)
                    }}
                  >
                    Registration Status
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

    </header>
  )
}
