import { useState, useEffect } from 'react'
import { User, Menu, X, ChevronDown, Handshake } from 'lucide-react'
import aplLogo from '../assets/APL Logo - White.png'
import './Navbar.css'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('')

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

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Fixtures', href: '#fixtures' },
    { label: 'Points Table', href: '#points-table' },
    { label: 'News & Media', href: '#news' },
    { label: 'Partnerships', href: '#partnerships' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact Us', href: '#contact-us' },
  ]

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#" className="navbar-brand">
          <img src={aplLogo} alt="APL Logo" className="navbar-logo" />
        </a>

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

        {/* Desktop Right Column: Two-row stacked layout */}
        <div className="desktop-right-column">
          {/* Row 1 (Top): Buttons */}
          <div className="desktop-actions">
            <div className="register-dropdown-wrapper">
              <button className="btn-register-now">
                <span>REGISTER NOW</span>
                <ChevronDown size={18} />
              </button>
              <div className="register-dropdown-menu">
                <a href="#register-player" className="register-option-item">
                  <div className="register-option-icon">
                    <User size={20} />
                  </div>
                  <div className="register-option-text">
                    <span className="register-option-title">Register as a Player</span>
                    <span className="register-option-desc">Register yourself as an active player in the draft pool</span>
                  </div>
                </a>
                <a href="#register-agent" className="register-option-item">
                  <div className="register-option-icon">
                    <Handshake size={20} />
                  </div>
                  <div className="register-option-text">
                    <span className="register-option-title">Register as an Agent</span>
                    <span className="register-option-desc">Register on behalf of a player you represent</span>
                  </div>
                </a>
              </div>
            </div>
            <a href="#login" className="btn-login">
              <span>LOGIN</span>
              <User size={18} />
            </a>
          </div>

          {/* Row 2 (Bottom): Navigation Links */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`desktop-nav-link ${activeTab === item.label ? 'active' : ''}`}
                onClick={() => setActiveTab(item.label)}
              >
                {item.label}
              </a>
            ))}
          </nav>
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
          <li className="mobile-nav-item">
            <button
              className={`mobile-nav-link mobile-submenu-toggle ${mobileSubmenuOpen ? 'submenu-active' : ''}`}
              onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
            >
              Registration
              <ChevronDown size={28} className={`submenu-arrow ${mobileSubmenuOpen ? 'rotated' : ''}`} />
            </button>
            {mobileSubmenuOpen && (
              <ul className="mobile-submenu-list">
                <li className="mobile-submenu-item">
                  <a
                    href="#register-player"
                    className="mobile-submenu-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSubmenuOpen(false);
                    }}
                  >
                    Register as a Player
                  </a>
                </li>
                <li className="mobile-submenu-item">
                  <a
                    href="#register-agent"
                    className="mobile-submenu-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSubmenuOpen(false);
                    }}
                  >
                    Register as an Agent
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="mobile-nav-item">
            <a
              href="#login"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </a>
          </li>
        </ul>
      </div>

      {/* Bottom Slash Accent Bar */}
      <div className="navbar-bottom-bar"></div>
    </header>
  )
}
