import { useState, useEffect } from 'react'
import aplLogo from '../../assets/Asset 2@2x.png'
import { articles } from '../../constants/newsData'
import { AnimatedCounter } from '../common/AnimatedCounter'
import './News.css'

const featuredArticles = articles.filter(a => a.featured)
const gridArticles = articles

export function News() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featuredArticles.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev - 1 + featuredArticles.length) % featuredArticles.length)
  }

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev + 1) % featuredArticles.length)
  }

  return (
    <div className="news-page">

      {/* HERO SECTION */}
      <section className="news-hero">
        <div className="news-hero-grid-bg" />
        <div className="news-hero-glow-left" />
        <div className="news-hero-glow-right" />

        <div className="news-hero-inner">
          <div className="news-hero-left">
            <div className="news-live-badge">
              <span className="news-live-dot" />
              <span className="news-live-text">LIVE UPDATES</span>
            </div>

            <div className="news-hero-heading-wrap">
              <h1 className="news-hero-title">NEWS &amp;</h1>
              <h1 className="news-hero-title news-hero-title-gold">MEDIA</h1>
              <div className="news-hero-underline" />
            </div>

            <p className="news-hero-subtitle">
              Stay ahead of the curve with the latest APL announcements,
              match reports, franchise news, and exclusive features.
            </p>
          </div>

          <div className="news-hero-stats">
            <div className="news-stat-item">
              <span className="news-stat-number">
                <AnimatedCounter target={articles.length} />
              </span>
              <span className="news-stat-label">ARTICLES</span>
            </div>
            <div className="news-stat-divider" />
            <div className="news-stat-item">
              <span className="news-stat-number">
                <AnimatedCounter target={150} suffix="K+" />
              </span>
              <span className="news-stat-label">READERS</span>
            </div>
            <div className="news-stat-divider" />
            <div className="news-stat-item">
              <span className="news-stat-number">
                <AnimatedCounter target={7} />
              </span>
              <span className="news-stat-label">THIS WEEK</span>
            </div>
          </div>
        </div>

        <div className="news-hero-bottom-bar" />
      </section>

      {/* FEATURED ARTICLES SLIDER */}
      <section className="news-featured-section">
        <div className="news-featured-slider-wrapper">
          <div className="news-featured-slider-grid">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`news-featured-card ${index === activeSlide ? 'active' : 'inactive'}`}
              >
                <div className="news-featured-img-wrap" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `#blog/${article.id}`}>
                  <img src={article.img} alt={article.title} className="news-featured-img" loading="lazy" />
                  <div className="news-featured-img-overlay" />
                </div>
                <div className="news-featured-content">
                  <span className="news-category-tag">{article.category}</span>
                  <h2 className="news-featured-title" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `#blog/${article.id}`}>{article.title}</h2>
                  <p className="news-featured-excerpt">{article.excerpt}</p>
                  <div className="news-featured-meta">
                    <div className="news-apl-brand-tag">
                      <img src={aplLogo} alt="APL" className="news-brand-logo" />
                    </div>
                    <div className="news-meta-right">
                      <span className="news-meta-date">{article.date}</span>
                      <span className="news-meta-sep">·</span>
                      <span className="news-meta-read">{article.readTime}</span>
                    </div>
                  </div>
                  <a href={`#blog/${article.id}`} className="news-read-btn" onClick={(e) => { e.preventDefault(); window.location.hash = `#blog/${article.id}`; }}>
                    READ FULL STORY
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls Row (Mobile inline, Desktop absolute) */}
          <div className="news-slider-controls-row">
            <button className="news-slider-arrow prev" onClick={handlePrevSlide} aria-label="Previous Slide">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="news-slider-dots">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  className={`news-slider-dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button className="news-slider-arrow next" onClick={handleNextSlide} aria-label="Next Slide">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* NEWS GRID */}
      <section className="news-grid-section">
        <div className="news-grid-header">
          <h2 className="news-grid-heading">Latest <span>Stories</span></h2>
          <div className="news-grid-header-line" />
        </div>

        <div className="news-grid">
          {gridArticles.map(article => (
            <article key={article.id} className="news-card">
              <div className="news-card-img-wrap" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `#blog/${article.id}`}>
                <img src={article.img} alt={article.title} className="news-card-img" loading="lazy" />
                <div className="news-card-img-overlay" />
                <span className="news-card-category">{article.category}</span>
              </div>
              <div className="news-card-body">
                <h3 className="news-card-title" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `#blog/${article.id}`}>{article.title}</h3>
                <p className="news-card-excerpt">{article.excerpt}</p>
                <div className="news-card-footer">
                  <span className="news-card-date">{article.date}</span>
                  <span className="news-card-read">{article.readTime}</span>
                </div>
                <button className="news-grid-read-btn" onClick={() => window.location.hash = `#blog/${article.id}`}>
                  Read Full Story
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
