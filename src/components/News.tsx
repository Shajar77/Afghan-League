import { useState, useEffect } from 'react'
import aplLogo from '../assets/APL Logo - White.webp'
import gallery1 from '../assets/gallery-1.webp'
import gallery2 from '../assets/gallery-2.webp'
import gallery3 from '../assets/gallery-3.webp'
import gallery4 from '../assets/gallery-4.webp'
import gallery5 from '../assets/gallery-5.webp'
import gallery6 from '../assets/gallery-6.webp'
import gallery7 from '../assets/gallery-7.webp'
import gallery8 from '../assets/gallery-8.webp'
import fomImg1 from '../assets/2166774277.webp'
import fomImg2 from '../assets/AD1_2727_zQkE8coH_20230809060237-1610761.webp'
import fomImg3 from '../assets/SunRisers-Leeds-fans-at-Headingley.webp'
import fomImg4 from '../assets/GettyImages-2230120408.webp'
import fomImg5 from '../assets/GettyImages-2163231267.webp'
import './News.css'

interface Article {
  id: string
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  img: string
  featured?: boolean
}

const articles: Article[] = [
  {
    id: 'a1',
    category: 'LEAGUE NEWS',
    title: 'APL 2026 Season Schedule Officially Announced — 18 Matches Across 15 Days',
    excerpt: 'The Afghanistan Premier League officially reveals the complete fixture list for the inaugural 2026 season, with six province-based franchises set to compete at Kabul International Cricket Stadium.',
    date: 'AUG 1, 2026',
    readTime: '4 MIN READ',
    img: fomImg4,
    featured: true,
  },
  {
    id: 'a2',
    category: 'PLAYER NEWS',
    title: 'World-Class Overseas Stars Confirmed for APL Draft Pool',
    excerpt: 'Several international superstars have registered for the APL player draft, promising a thrilling auction ahead of the first franchise selections.',
    date: 'JUL 28, 2026',
    readTime: '3 MIN READ',
    img: gallery1,
    featured: true,
  },
  {
    id: 'a3',
    category: 'FRANCHISE',
    title: 'Kabul Knights Reveal Club Identity & Brand New Stadium Kit',
    excerpt: 'The capital city franchise drops a stunning visual identity system, combining classic green and gold with a modern edge that reflects Afghan pride.',
    date: 'JUL 25, 2026',
    readTime: '5 MIN READ',
    img: gallery5,
    featured: true,
  },
  {
    id: 'a4',
    category: 'BROADCAST',
    title: 'APL Secures Global Broadcast Deal — Live in 60+ Countries',
    excerpt: 'The league confirms major broadcast partnerships ensuring live coverage reaches fans across South Asia, Europe, North America and beyond.',
    date: 'JUL 22, 2026',
    readTime: '3 MIN READ',
    img: fomImg2,
  },
  {
    id: 'a5',
    category: 'FANS',
    title: 'Fan Zone Experience: What to Expect at the Kabul International Stadium',
    excerpt: 'From live music acts to food stalls and player meet-and-greets, the APL fan experience promises to be a festival of cricket and culture.',
    date: 'JUL 18, 2026',
    readTime: '6 MIN READ',
    img: gallery3,
  },
  {
    id: 'a6',
    category: 'TICKETS',
    title: 'Early Bird Tickets Sell Out in Record 48 Hours — Next Wave Coming',
    excerpt: 'The first wave of APL 2026 tickets was snapped up in under two days, with the league confirming a second release for all six home matches.',
    date: 'JUL 15, 2026',
    readTime: '2 MIN READ',
    img: gallery2,
  },
  {
    id: 'a7',
    category: 'PARTNERSHIPS',
    title: 'ACB & APL Sign Historic MoU to Elevate Domestic Cricket',
    excerpt: 'A landmark agreement between the Afghan Cricket Board and the Premier League will channel resources directly into youth and provincial development.',
    date: 'JUL 10, 2026',
    readTime: '4 MIN READ',
    img: gallery6,
  },
  {
    id: 'a8',
    category: 'MATCH PREVIEW',
    title: 'Kabul Knights vs Balkh Legends — The Opening Night Blockbuster',
    excerpt: 'The curtain-raiser promises fireworks as the capital city heavyweights face off against the Balkh Legends in what analysts predict will be the match of the tournament.',
    date: 'JUL 8, 2026',
    readTime: '5 MIN READ',
    img: gallery4,
  },
  {
    id: 'a9',
    category: 'INTERVIEW',
    title: 'Rashid Khan: "The APL Will Inspire a Million Young Cricketers"',
    excerpt: "In an exclusive sit-down, Afghanistan's global superstar opens up about what the inaugural APL season means for the nation and the next generation of players.",
    date: 'JUL 5, 2026',
    readTime: '7 MIN READ',
    img: fomImg5,
  },
  {
    id: 'a10',
    category: 'STADIUM',
    title: 'Inside the Kabul International Cricket Stadium Renovation',
    excerpt: 'A behind-the-scenes look at the extensive upgrades made to the stadium — from floodlights and pitch preparation to fan facilities and broadcast infrastructure.',
    date: 'JUL 2, 2026',
    readTime: '6 MIN READ',
    img: gallery7,
  },
  {
    id: 'a11',
    category: 'CULTURE',
    title: 'Cricket, Music & Community — How the APL Unites Afghanistan',
    excerpt: 'Beyond the boundary ropes, the APL is shaping up to be a celebration of Afghan culture, bringing together provinces and fans from all walks of life.',
    date: 'JUN 28, 2026',
    readTime: '5 MIN READ',
    img: fomImg3,
  },
  {
    id: 'a12',
    category: 'DRAFT',
    title: 'APL Player Draft Format Explained — Everything You Need to Know',
    excerpt: 'With franchise auctions approaching, here is a complete breakdown of the draft rules, salary caps, overseas player quotas, and how squads will be constructed.',
    date: 'JUN 25, 2026',
    readTime: '8 MIN READ',
    img: fomImg1,
  },
  {
    id: 'a13',
    category: 'COMMUNITY',
    title: 'Youth Cricket Clinics to Run Alongside APL Season in All Provinces',
    excerpt: 'The league will host free cricket clinics for under-16 players in all six provinces throughout the tournament fortnight, coached by APL franchise players.',
    date: 'JUN 20, 2026',
    readTime: '3 MIN READ',
    img: gallery8,
  },
  {
    id: 'a14',
    category: 'TECHNOLOGY',
    title: 'APL to Use Ball-Tracking & AI Analytics for the First Time in Afghan Cricket',
    excerpt: 'In a historic first, all 18 APL matches will be powered by cutting-edge ball-tracking technology and real-time AI analytics dashboards for broadcasters and fans.',
    date: 'JUN 15, 2026',
    readTime: '4 MIN READ',
    img: fomImg2,
  },
]

const featuredArticles = articles.filter(a => a.featured)
const gridArticles = articles.filter(a => !a.featured)

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
}

function AnimatedCounter({ target, suffix = '', duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      // Easing function: easeOutQuad
      const easeVal = percentage * (2 - percentage)

      setCount(Math.floor(easeVal * target))

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration])

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  )
}

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
                <AnimatedCounter target={14} />
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
                <div className="news-featured-img-wrap">
                  <img src={article.img} alt={article.title} className="news-featured-img" loading="lazy" />
                  <div className="news-featured-img-overlay" />
                </div>
                <div className="news-featured-content">
                  <span className="news-category-tag">{article.category}</span>
                  <h2 className="news-featured-title">{article.title}</h2>
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
                  <a href="#article" className="news-read-btn">
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
              <div className="news-card-img-wrap">
                <img src={article.img} alt={article.title} className="news-card-img" loading="lazy" />
                <div className="news-card-img-overlay" />
                <span className="news-card-category">{article.category}</span>
              </div>
              <div className="news-card-body">
                <h3 className="news-card-title">{article.title}</h3>
                <p className="news-card-excerpt">{article.excerpt}</p>
                <div className="news-card-footer">
                  <span className="news-card-date">{article.date}</span>
                  <span className="news-card-read">{article.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}
