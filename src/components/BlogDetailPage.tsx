import type { Article } from '../constants/newsData'
import './BlogDetailPage.css'

interface BlogDetailPageProps {
  article: Article
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

          {/* Paragraphs and Subheadings */}
          <div className="blog-detail-body">
            {article.fullText ? (
              article.fullText.map((p, idx) => {
                const isSubheading = 
                  p.length < 80 && 
                  !p.endsWith('.') && 
                  !p.endsWith('?') && 
                  !p.endsWith('!') && 
                  !p.endsWith(':') && 
                  !p.endsWith('"') && 
                  !p.endsWith('”') && 
                  !p.endsWith('-') && 
                  p !== '-ENDS-' && 
                  p !== 'For Media Enquiries:' && 
                  p !== 'For Media & Franchise Enquiries:'

                if (isSubheading) {
                  return (
                    <h2 key={idx} className="blog-detail-subheading">
                      {p}
                    </h2>
                  )
                }
                
                return (
                  <p key={idx} className="blog-detail-paragraph">
                    {p}
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
