import { useState, useEffect } from 'react'
import aplLogo from '../assets/Asset 2@2x.png'
import gallery5 from '../assets/gallery-5.webp'
import gallery7 from '../assets/gallery-7.webp'
import downloadImg from '../../download.jpeg'
import downloadWebp from '../../download.webp'
import download1Img from '../../download (1).jpeg'
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
  fullText?: string[]
}

const articles: Article[] = [
  {
    id: 'new-a1',
    category: 'PRESS RELEASE',
    title: 'Afghanistan Cricket Board Opens Franchise Acquisition Process for APL T20 2026',
    excerpt: 'The Afghanistan Cricket Board (ACB) is pleased to announce the official launch of the franchise acquisition process for the much-anticipated return of the Afghanistan Premier League (APL T20), marking a significant milestone in the continued rise of Afghan cricket on the global stage.',
    date: 'MAY 12, 2026',
    readTime: '3 MIN READ',
    img: download1Img,
    featured: true,
    fullText: [
      "Kabul – May 12, 2026: The Afghanistan Cricket Board (ACB) is pleased to announce the official launch of the franchise acquisition process for the much-anticipated return of the Afghanistan Premier League (APL T20), marking a significant milestone in the continued rise of Afghan cricket on the global stage.",
      "The ACB will officially issue the Request for Proposal (RFP) for franchise ownership on May 15, 2026, inviting global investors, sports entrepreneurs, and commercial partners to become part of one of the most exciting emerging properties in world cricket. The deadline for proposal submissions has been set for June 30, 2026.",
      "The second edition of the APL T20 is scheduled to be held in the United Arab Emirates during the final quarter of 2026, providing a world-class environment and international-standard infrastructure for a tournament expected to deliver elite competition, international talent, and premium production quality.",
      "The league will feature five franchise teams, with prospective franchise partners having the opportunity to bid for representation from five iconic Afghan cricketing regions and centers, which are Kabul, Kandahar, Balkh, Paktia, and Nangarhar.",
      "The return of the APL comes at a time when Afghan cricketers are widely regarded among the most impactful performers across major T20 leagues worldwide. The tournament will serve as Afghanistan’s premier domestic T20 platform, showcasing the country’s leading cricketing stars while also bringing together internationally renowned players and professionals in a globally marketable competition.",
      "The ACB, in collaboration with its strategic partners, has developed a commercial framework centered on long-term sustainability, operational efficiency, and strong commercial potential for franchise investors. The model is designed to establish a lean, competitive, and high-value sporting property aligned with the evolving global T20 landscape.",
      "ACB Chairman Mirwais Ashraf said: “It is extremely encouraging to witness the steady progress toward the return of the Afghanistan Premier League, a landmark initiative for the Afghanistan Cricket Board and a significant step in the continued growth of Afghan cricket globally. In this regard, the Afghanistan Cricket Board will officially commence the franchise acquisition process for the league’s five franchises on the 15th of this month. We are confident that the APL will open a new chapter of professionalism, commercial growth, and international recognition for Afghan cricket.”",
      "He further added: “Afghanistan today possesses some of the finest and most exciting talents in world cricket, and the Afghanistan Premier League will serve as a major platform to further strengthen the global presence of Afghan cricket. Our National Team has achieved historic successes against some of the world’s leading cricket nations, while our Emerging, Under-19, and Afghanistan A teams have also delivered outstanding performances internationally.”",
      "The APL will provide Afghan players with a professional platform to showcase their talent, gain international exposure, and engage with leading overseas players and experts. At the same time, the league will play an important role in promoting Afghanistan’s culture and positive image globally, while contributing to the long-term commercial growth of Afghan cricket.",
      "The Afghanistan Cricket Board invites interested parties to become part of a partnership opportunity that extends beyond cricket, contributing to the growth of one of the world’s fastest-rising cricketing nations and a league with significant global potential.",
      "-ENDS-",
      "For Media & Franchise Enquiries:",
      "bid@apl-t20.com"
    ]
  },
  {
    id: 'new-a2',
    category: 'NEWS',
    title: 'ACB Unveils Bold New Identity and Roadmap for Afghanistan Premier League T20 at Grand Launch in Dubai',
    excerpt: 'The Afghanistan Cricket Board (ACB) officially ushered in a new era for Afghan cricket today with the Grand Launch and Logo Unveiling of the Afghanistan Premier League (APL T20).',
    date: 'DEC 20, 2025',
    readTime: '4 MIN READ',
    img: gallery5,
    featured: true,
    fullText: [
      "DUBAI, UAE | December 20, 2025 — The Afghanistan Cricket Board (ACB) officially ushered in a new era for Afghan cricket today with the Grand Launch and Logo Unveiling of the Afghanistan Premier League (APL T20). Held at a star-studded ceremony in Dubai, the event marked the formal return of the league, featuring the unveiling of a modern brand identity and a comprehensive 10-year strategic roadmap. The ceremony was attended by ACB Chairman Mirwais Ashraf, CEO Naseeb Khan, and national icons including Rashid Khan, Hashmatullah Shahidi, and Rahmanullah Gurbaz, alongside senior leadership from commercial partners Trans Group (TG) and ITW MEA.",
      "A New Visual Identity",
      "The highlight of the evening was the reveal of the new APL T20 logo. Designed to reflect resilience and ambition, the logo symbolizes a fresh start for the league, moving away from past challenges toward a sustainable, world-class sporting property.",
      "\"The APL is more than just a tournament; it is a strategic pillar of our long-term vision,\" said Mirwais Ashraf. \"Today’s launch is the first step in turning that vision into a reality that will provide our players with a global stage and our fans with world-class entertainment.\"",
      "Tournament Framework & 2026 Window",
      "Following the logo reveal, the ACB confirmed several key details regarding the league's structure:",
      "Five-Team Model: The league will feature five city-based franchises representing different regions of Afghanistan.",
      "2026 Launch Window: The tournament is scheduled to take place in September–October 2026, a window carefully selected to ensure maximum participation of international overseas stars.",
      "Venue: The United Arab Emirates (UAE) has been designated as the primary host venue for the upcoming edition, ensuring top-tier infrastructure and global accessibility.",
      "Player Draft: A grand player draft is proposed for June–July 2026, where franchises will build their squads from a pool of local talent and international professionals.",
      "Economic and Sporting Impact",
      "With a 10-edition partnership now in place with ITW MEA and Trans Group, the ACB emphasized that the league is built on a foundation of commercial transparency and long-term stability. The APL T20 aims to provide a robust commercial ecosystem for the board while creating a direct pathway for emerging Afghan talents to learn from the world’s best T20 cricketers."
    ]
  },
  {
    id: 'new-a3',
    category: 'NEWS',
    title: 'Afghanistan Premier League Launched in Dubai, Signaling a New Era for Afghanistan Cricket',
    excerpt: 'The Afghanistan Cricket Board (ACB), in partnership with Cricket Venture, a joint venture of Trans Group and ITW Universe, officially unveiled the vision for the Afghanistan Premier League (APL) on 20 December 2025 at The Westin Hotel, Mina Seyahi, Dubai.',
    date: 'DEC 20, 2025',
    readTime: '5 MIN READ',
    img: downloadWebp,
    featured: true,
    fullText: [
      "Dubai, UAE — The Afghanistan Cricket Board (ACB), in partnership with Cricket Venture, a joint venture of Trans Group and ITW Universe, officially unveiled the vision for the Afghanistan Premier League (APL) on 20 December 2025 at The Westin Hotel, Mina Seyahi, Dubai.",
      "The launch marks a major milestone in the evolution of Afghanistan cricket, introducing a new franchise-based T20 league’s commercial structure designed to provide a global platform for Afghanistan talent while strengthening the commercial and entertainment landscape of the sport.",
      "The event brought together senior cricket administrators, commercial and broadcast partners, investors, and media representatives. Attendees were presented with an exclusive preview of the league’s brand identity, tournament format, and long-term roadmap, along with early insights into player participation and commercial opportunities.",
      "Speaking at the launch, Mirwais Ashraf, Chairman of the Afghanistan Cricket Board, emphasized the wider impact of the league:",
      "“The Afghanistan Premier League represents a meaningful step forward in our cricketing journey. It creates new opportunities for our players, inspires the next generation, and allows Afghanistan cricket to be showcased on a global platform. We see the APL as an important contributor to the growth and unity of the game, both domestically and internationally.”",
      "The APL’s inaugural season will feature five city-based franchises, bringing together Afghanistan’s leading national players alongside prominent overseas professionals and emerging local talent. This edition of the league is scheduled for the last quarter of 2026, with a clear focus on establishing the APL as both a high-quality sporting competition and a premium entertainment property.",
      "From a commercial and sponsorship perspective, partners highlighted the league’s long-term potential. Vivek Chandra, Director at ITW, said:",
      "“We are excited to be associated with the Afghanistan Premier League, a project that brings fresh energy and opportunity to the sport. Through strategic partnerships and sponsorships, our aim is to support the league’s growth while contributing to a stronger and more sustainable cricket ecosystem.”",
      "Sponsorship activation, event management, broadcast, and production capabilities were also key themes of the launch. Speaking on behalf of Trans Group, Rao Usman Hashim Khan, the Chief Operating Officer noted:",
      "“We are pleased to support the Afghanistan Premier League and to be part of this important new chapter for Afghanistan cricket. With high-quality production standards and global broadcast reach, the APL has the potential to connect communities, bring fans closer to the action, and create a lasting impact. Through innovative sponsorships, fan engagement initiatives, and impactful brand activations, the league will elevate the visibility and overall standard of Afghanistan cricket worldwide.”",
      "The evening concluded with a preview of the APL’s official promotional campaign, offering insight into the league’s visual identity and creative direction. Guests were also briefed on the league’s commercial framework, team structures, and its broader role in supporting the long-term development of Afghanistan cricket.",
      "Following the launch, organizers will move into the next phase, which includes finalizing franchise identities, confirming commercial partners, and progressing the player auction or draft process.",
      "For Media Enquiries:",
      "Email Address: contact@apl-t20.com"
    ]
  },
  {
    id: 'new-a4',
    category: 'NEWS',
    title: 'APL’s Grand Launch Event & Logo Unveiling to be held on December 20th in the UAE',
    excerpt: 'The Afghanistan Cricket Board has announced that the Grand Launch Event for the Afghanistan Premier League T20 (APLT20) will be held on December 20th, 2025, in the United Arab Emirates. During this event, the ACB and its partners will unveil the Tournament’s proposed window, venue,',
    date: 'DEC 9, 2025',
    readTime: '3 MIN READ',
    img: gallery7,
    fullText: [
      "Kabul – December 9, 2025: The Afghanistan Cricket Board has announced that the Grand Launch Event for the Afghanistan Premier League T20 (APLT20) will be held on December 20th, 2025, in the United Arab Emirates. During this event, the ACB and its partners will unveil the Tournament’s proposed window, venue, league structure, and other key elements for the second edition of the APLT20.",
      "The milestone follows the awarding of APL investment partnership rights to the ITW–TG consortium during a contract-signing ceremony earlier this year. During the 1st July 2025 agreement signing, ACB stated that the tournament window and venue would be revealed by the end of August. However, due to essential administrative procedures, bilateral coordination, and technical evaluations, the planned August announcement was rescheduled. All major details will now be formally unveiled at the 20th December launch event.",
      "The ceremony will bring together senior leadership from ACB, ITW MEA, TG, and Skywalkers as well as various global cricket stakeholders, media, commercial partners, and invited dignitaries. ACB and its partners will reveal the APL tournament proposed window, venue, league structure, brand identity, commercial roadmap, and additional key components of the inaugural edition.",
      "Mirwais Ashraf, Chairman of the Afghanistan Cricket Board stated: “The APL is a strategic pillar of ACB’s long-term vision, and the 20th December launch event marks a major step toward turning that vision into reality. We appreciate the professionalism and dedication of our partners at ITW MEA, TG, and Skywalkers. The league will open new horizons for Afghan cricket, and we look forward to presenting its full framework at the launch.”",
      "Naseeb Khan, CEO of the Afghanistan Cricket Board, remarked: “The progress made since awarding the investment partnership rights has been highly encouraging. The APL will provide a world-class platform for Afghan players and a strong commercial ecosystem for the board. The upcoming launch event will outline the complete roadmap, and we are excited to introduce this next phase to the global cricketing community.”",
      "The APL is the official franchise-based T20 league sanctioned by the Afghanistan Cricket Board, and it will mark a new era of development, professionalism, and global positioning for Afghan cricket."
    ]
  },
  {
    id: 'new-a5',
    category: 'NEWS',
    title: 'ACB Signs Long-Term Commercial Partnership for the Afghanistan Premier League (APL T20)',
    excerpt: 'UAE – July 1, 2025: The Afghanistan Cricket Board (ACB) is pleased to announce the signing of a long-term commercial partnership agreement with ITW MEA for the successful organization and management of the Afghanistan Premier League (APL T20) over the next 10 editions.',
    date: 'JUL 1, 2025',
    readTime: '4 MIN READ',
    img: downloadImg,
    fullText: [
      "UAE – July 1, 2025: The Afghanistan Cricket Board (ACB) is pleased to announce the signing of a long-term commercial partnership agreement with ITW MEA for the successful organization and management of the Afghanistan Premier League (APL T20) over the next 10 editions.",
      "ITW MEA, a UAE- and Africa-based company renowned for its expertise in media planning, consulting, branding & activations, media production, and digital marketing, will collaborate with the ACB to deliver a world-class T20 league. ITW has an extensive track record of working with prominent organizations, including the International Cricket Council (ICC), the Asian Cricket Council (ACC), and various full-member cricket boards globally.",
      "The agreement was officially signed by Mr. Mirwais Ashraf, Chairman of the Afghanistan Cricket Board, Mr. Naseeb Khan, CEO of Afghanistan Cricket Board and Mr. Vivek Chandra, Director and Head of Business for ITW MEA.",
      "As part of this agreement, a joint governing council comprising representatives from both ACB and ITW will be formed, that will oversee key operational decisions, including the selection of hosting venues and other essential aspects related to the league's execution.",
      "The ACB initiated the process of identifying a strategic partner by announcing a Request for Proposal (RFP). The purpose was to find a partner who is both financially and technically capable of contributing to the growth, development, and long-term success of the APL. This process took more than a year and involved evaluation and selection phases. Ultimately, ITW MEA was chosen as the long-term strategic partner. Throughout the process, updates were provided to the ACB Board, and their feedback and suggestions were taken into account.",
      "Speaking at the signing ceremony, ACB Chairman Mr. Mirwais Ashraf stated: “The relaunch of the Afghanistan Premier League is a momentous achievement for Afghan cricket and its passionate fans who have long awaited this occasion. We are delighted to have partnered with a reputed organization like ITW for the successful delivery of the APL’s upcoming editions. This marks a significant step forward, and the official dates and venues will be announced soon.”",
      "Similarly, ACB Chief Executive Officer Mr. Naseeb Khan added: “Reviving the Afghanistan Premier League has been among our top priorities. We conducted extensive discussions with several potential partners and ultimately secured an agreement with ITW, a highly credible entity. Our focus is not just on hosting a tournament but on elevating the league’s quality, competitiveness, and prestige. This platform will provide vital opportunities for our players and immense value to Afghan cricket overall.”",
      "Mr. Vivek Chandra, Director and Head of Business for MEA at ITW, expressed his excitement about the partnership: “We are honored to join hands with the Afghanistan Cricket Board as their investor and commercial partner for the Afghanistan Premier League. Afghanistan’s meteoric rise in world cricket has been inspiring, and this partnership reflects our commitment to contributing to the growth and success of Afghan cricket. We believe this league will serve as a crucial platform for nurturing talent and raising the standards of cricket in Afghanistan.”",
      "During August 2025, the parties, together with the ACB board members, will host a grand opening ceremony where distinguished, prominent, and respected individuals from the cricketing world, including players, business leaders, and governing bodies from around the globe, will be invited. During the ceremony, the venue and window of the upcoming edition will be announced, and the progress of the Governing Council’s activities will be shared."
    ]
  },
]

const featuredArticles = articles.filter(a => a.featured)
const gridArticles = articles

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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featuredArticles.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (selectedArticle) {
      document.body.classList.add('news-modal-open')
    } else {
      document.body.classList.remove('news-modal-open')
    }
    return () => {
      document.body.classList.remove('news-modal-open')
    }
  }, [selectedArticle])

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev - 1 + featuredArticles.length) % featuredArticles.length)
  }

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev + 1) % featuredArticles.length)
  }

  return (
    <div className={`news-page ${selectedArticle ? 'modal-active' : ''}`}>

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
                <div className="news-featured-img-wrap" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(article)}>
                  <img src={article.img} alt={article.title} className="news-featured-img" loading="lazy" />
                  <div className="news-featured-img-overlay" />
                </div>
                <div className="news-featured-content">
                  <span className="news-category-tag">{article.category}</span>
                  <h2 className="news-featured-title" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(article)}>{article.title}</h2>
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
                  <a href="#article" className="news-read-btn" onClick={(e) => { e.preventDefault(); setSelectedArticle(article); }}>
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
              <div className="news-card-img-wrap" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(article)}>
                <img src={article.img} alt={article.title} className="news-card-img" loading="lazy" />
                <div className="news-card-img-overlay" />
                <span className="news-card-category">{article.category}</span>
              </div>
              <div className="news-card-body">
                <h3 className="news-card-title" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(article)}>{article.title}</h3>
                <p className="news-card-excerpt">{article.excerpt}</p>
                <div className="news-card-footer">
                  <span className="news-card-date">{article.date}</span>
                  <span className="news-card-read">{article.readTime}</span>
                </div>
                <button className="news-grid-read-btn" onClick={() => setSelectedArticle(article)}>
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

      {/* ARTICLE DETAILS MODAL */}
      {selectedArticle && (
        <div className="news-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="news-modal-close" onClick={() => setSelectedArticle(null)} aria-label="Close modal">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="news-modal-body">
              <div className="news-modal-img-wrap">
                <img src={selectedArticle.img} alt={selectedArticle.title} />
                <div className="news-modal-img-overlay" />
              </div>
              <div className="news-modal-text">
                <div className="news-modal-meta">
                  <span className="news-modal-category">{selectedArticle.category}</span>
                  <div className="news-modal-meta-right">
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>
                <h2 className="news-modal-title">{selectedArticle.title}</h2>
                <div className="news-modal-divider" />
                {selectedArticle.fullText && selectedArticle.fullText.map((p, idx) => {
                  const isSubheading = p.length < 80 && !p.endsWith('.') && !p.endsWith('?') && !p.endsWith('!') && !p.endsWith(':') && !p.endsWith('"') && !p.endsWith('”') && !p.endsWith('-') && p !== '-ENDS-' && p !== 'For Media Enquiries:' && p !== 'For Media & Franchise Enquiries:'
                  if (isSubheading) {
                    return (
                      <h4 key={idx} className="news-modal-subheading">
                        {p}
                      </h4>
                    )
                  }
                  return (
                    <p key={idx} className="news-modal-paragraph">
                      {p}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
