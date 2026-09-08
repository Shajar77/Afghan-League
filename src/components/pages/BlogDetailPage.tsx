import type { Article } from '../../constants/newsData'
import './BlogDetailPage.css'

interface BlogDetailPageProps {
  article: Article
}

function renderInlineContent(rawText: string) {
  // Regex to detect [Registration Link], [email@domain], email@domain, www.domain.com, [label](#hash/url)
  const regex = /(\[Registration Link\]|\[[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|www\.apl-t20\.com)/g

  const parts = rawText.split(regex)
  if (parts.length === 1) return rawText

  return parts.map((part, i) => {
    if (part === '[Registration Link]') {
      return (
        <a
          key={i}
          href="#register"
          className="blog-detail-inline-link"
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = '#register'
          }}
        >
          Registration Portal
        </a>
      )
    }

    if (part.startsWith('[') && part.endsWith(']') && part.includes('@')) {
      const email = part.slice(1, -1)
      return (
        <a key={i} href={`mailto:${email}`} className="blog-detail-inline-link">
          {email}
        </a>
      )
    }

    if (part.includes('@') && !part.includes(' ')) {
      return (
        <a key={i} href={`mailto:${part}`} className="blog-detail-inline-link">
          {part}
        </a>
      )
    }

    if (part === 'www.apl-t20.com') {
      return (
        <a
          key={i}
          href="#home"
          className="blog-detail-inline-link"
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = '#home'
          }}
        >
          www.apl-t20.com
        </a>
      )
    }

    return part
  })
}

export function BlogDetailPage({ article }: BlogDetailPageProps) {
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Go back in history if possible, else default to #news
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.hash = '#news'
    }
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-bg-grid" />
      <div className="blog-detail-glow-left" />
      <div className="blog-detail-glow-right" />

      <div className="blog-detail-container">
        
        {/* Back Link */}
        <div className="blog-detail-back-wrap">
          <a href="#news" className="blog-detail-back-link" onClick={handleBackClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Stories
          </a>
        </div>

        {/* 1. Image on Top */}
        <div className="blog-detail-img-wrap">
          <img src={article.img} alt={article.title} className="blog-detail-img" />
          <div className="blog-detail-img-overlay" />
        </div>

        {/* 2. Text Below */}
        <div className="blog-detail-content-wrap">
          
          {/* Metadata Row */}
          <div className="blog-detail-meta">
            <span className="blog-detail-category">{article.category}</span>
            <div className="blog-detail-meta-right">
              <span>{article.date}</span>
              <span className="blog-detail-meta-sep">•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="blog-detail-title">{article.title}</h1>
          <div className="blog-detail-divider" />

          {/* Paragraphs, Subheadings, Bullet Lists, and Quotes */}
          <div className="blog-detail-body">
            {article.fullText ? (
              article.fullText.map((item, idx) => {
                const text = item.trim()
                if (!text) return null

                // 1. ENDS Badge
                const cleanEnds = text.replace(/[\s–—-]+/g, '').toUpperCase()
                if (cleanEnds === 'ENDS') {
                  return (
                    <div key={idx} className="blog-detail-ends-badge">
                      <span>– ENDS –</span>
                    </div>
                  )
                }

                // 2. Media enquiries / Email
                if (
                  text.toLowerCase().includes('media enquiries') ||
                  text.toLowerCase().includes('for media enquiries') ||
                  text === 'contact@apl-t20.com' ||
                  text === 'bid@apl-t20.com' ||
                  text === 'players@apl-t20.com' ||
                  (text.startsWith('[') && text.endsWith(']') && text.includes('@'))
                ) {
                  const isEmail = text.includes('@') && !text.includes(' ')
                  const cleanEmail = text.replace(/[[\]]/g, '')
                  return (
                    <div key={idx} className="blog-detail-contact-box">
                      {isEmail ? (
                        <a href={`mailto:${cleanEmail}`} className="blog-detail-contact-link">
                          📧 {cleanEmail}
                        </a>
                      ) : (
                        <p className="blog-detail-contact-title">{text}</p>
                      )}
                    </div>
                  )
                }

                // 3. Speaker Quote Block (starts with • Name: "Quote" or contains quotes)
                const isQuoteBlock = 
                  (text.startsWith('• ') && text.includes(': "')) || 
                  (text.startsWith('"') && text.endsWith('"'))

                if (isQuoteBlock) {
                  // Extract speaker title if present
                  let speakerName = ''
                  let quoteText = text

                  if (text.startsWith('• ') && text.includes(': "')) {
                    const clean = text.substring(2)
                    const colonIdx = clean.indexOf(': "')
                    speakerName = clean.substring(0, colonIdx)
                    quoteText = clean.substring(colonIdx + 3, clean.length - (clean.endsWith('"') ? 1 : 0))
                  } else if (text.startsWith('"') && text.endsWith('"')) {
                    quoteText = text.substring(1, text.length - 1)
                  }

                  return (
                    <blockquote key={idx} className="blog-detail-quote-card">
                      {speakerName && <div className="blog-detail-quote-speaker">{speakerName}</div>}
                      <p className="blog-detail-quote-body">“{quoteText}”</p>
                    </blockquote>
                  )
                }

                // 4. Bullet List Items (starts with • or - )
                const isBulletItem = text.startsWith('• ') || text.startsWith('- ')

                if (isBulletItem) {
                  const cleanBullet = text.replace(/^[•-]\s*/, '')
                  
                  // Check if bullet contains key-value pair (e.g. "Axcel United Kabul" or "Player Registration: ...")
                  const parts = cleanBullet.split(/:\s*(.+)/)
                  const hasLabel = parts.length > 1

                  return (
                    <div key={idx} className="blog-detail-bullet-item">
                      <span className="blog-detail-bullet-dot" />
                      <div className="blog-detail-bullet-text">
                        {hasLabel ? (
                          <>
                            <strong className="blog-detail-bullet-label">{parts[0]}: </strong>
                            <span>{renderInlineContent(parts[1])}</span>
                          </>
                        ) : (
                          <span>{renderInlineContent(cleanBullet)}</span>
                        )}
                      </div>
                    </div>
                  )
                }

                // 5. Section Subheadings
                const isSubheading = 
                  text.length < 75 && 
                  !text.endsWith('.') && 
                  !text.endsWith('?') && 
                  !text.endsWith('!') && 
                  !text.endsWith(':') && 
                  !text.endsWith('"') && 
                  !text.endsWith('”') && 
                  !text.includes('—')

                if (isSubheading) {
                  return (
                    <h2 key={idx} className="blog-detail-subheading">
                      {text}
                    </h2>
                  )
                }

                // 6. Regular Paragraph
                return (
                  <p key={idx} className="blog-detail-paragraph">
                    {renderInlineContent(text)}
                  </p>
                )
              })
            ) : (
              <p className="blog-detail-paragraph">{article.excerpt}</p>
            )}
          </div>

          {/* Bottom Back Button */}
          <div className="blog-detail-footer">
            <button className="btn-blog-back-bottom" onClick={handleBackClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              BACK TO STORIES
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
