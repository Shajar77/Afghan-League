import { articles } from '../../constants/newsData'
import '../pages/News.css'
import './HomeNewsSection.css'

export function HomeNewsSection() {
  // Get the top 3 articles for the home page preview
  const previewArticles = articles.slice(0, 3)

  return (
    <section className="home-news-section">
      <div className="home-news-header">
        <h2 className="section-heading">Latest <span>News</span></h2>
        <p className="section-description">
          Stay informed with the newest matches, announcements, and official developments from the league.
        </p>
      </div>

      <div className="news-grid">
        {previewArticles.map((article) => (
          <article key={article.id} className="news-card">
            <div 
              className="news-card-img-wrap" 
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.hash = `#blog/${article.id}`}
            >
              <img src={article.img} alt={article.title} className="news-card-img" loading="lazy" decoding="async" width="660" height="371" />
              <div className="news-card-img-overlay" />
            </div>
            
            <div className="news-card-body">
              <h3 
                className="news-card-title" 
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.hash = `#blog/${article.id}`}
              >
                {article.title}
              </h3>
              <p className="news-card-excerpt">{article.excerpt}</p>
              
              <div className="news-card-footer">
                <span className="news-card-date">{article.date}</span>
                <span className="news-card-read">{article.readTime}</span>
              </div>
              
              <button 
                className="news-grid-read-btn"
                onClick={() => window.location.hash = `#blog/${article.id}`}
              >
                Read Full Story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="home-news-view-all-wrap">
        <a href="#news" className="btn-view-all-news">
          <span>VIEW ALL NEWS</span>
        </a>
      </div>
    </section>
  )
}
