import { useState, useRef } from 'react'
import { Play, X, Heart, MessageCircle, Share2 } from 'lucide-react'
import gallery1 from '../assets/gallery-1.webp'
import gallery2 from '../assets/gallery-2.webp'
import gallery3 from '../assets/gallery-3.webp'
import gallery4 from '../assets/gallery-4.webp'
import gallery5 from '../assets/gallery-5.webp'
import gallery6 from '../assets/gallery-6.webp'
import gallery7 from '../assets/gallery-7.webp'
import gallery8 from '../assets/gallery-8.webp'
import { FEATURES } from '../constants/features'
import './Moments.css'

interface ReelItem {
  id: string;
  img: string;
  title: string;
  videoUrl: string; // fallback / placeholder loop video
  instagramId?: string; // Optional ID for direct Instagram Iframe embed
  likes: string;
  comments: string;
  isNew?: boolean;
}

const reelsData: ReelItem[] = [
  {
    id: 'reels-1',
    img: gallery1,
    title: 'The NO LOOK six trend 😱',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '14.2K',
    comments: '428',
    isNew: true,
  },
  {
    id: 'reels-2',
    img: gallery2,
    title: 'An incredible no look six 😳',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '9.8K',
    comments: '312',
    isNew: true,
  },
  {
    id: 'reels-3',
    img: gallery3,
    title: 'Sutherland v Kapp 🇦🇺🇿🇦',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '22.5K',
    comments: '891',
    isNew: true,
  },
  {
    id: 'reels-4',
    img: gallery4,
    title: 'Grace Harris scores 🏏',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '18.4K',
    comments: '564',
    isNew: true,
  },
  {
    id: 'reels-5',
    img: gallery5,
    title: 'Going down the ground again 🔥',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '31.1K',
    comments: '1.2K',
    isNew: true,
  },
  {
    id: 'reels-6',
    img: gallery6,
    title: 'Batsman going down the ground in style!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '12.6K',
    comments: '290',
    isNew: true,
  },
  {
    id: 'reels-7',
    img: gallery7,
    title: "Matt Short's journey to 6️⃣0️⃣ runs",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '15.9K',
    comments: '402',
    isNew: true,
  },
  {
    id: 'reels-8',
    img: gallery8,
    title: 'How big is this six?! 😲 APL highlights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '27.4K',
    comments: '715',
    isNew: true,
  },
  {
    id: 'reels-9',
    img: gallery1,
    title: 'Marcus Stoinis show 💥 classic shots',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    instagramId: 'DSXpLK8jI83',
    likes: '19.8K',
    comments: '499',
    isNew: true,
  },
];

const highlightsData: ReelItem[] = [
  {
    id: 'hl-1',
    img: gallery5,
    title: 'Kabul Knights vs Kandahar Kings — Match 1 Highlights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '45.1K',
    comments: '1.2K',
  },
  {
    id: 'hl-2',
    img: gallery6,
    title: 'Balkh Legends vs Paktia Panthers — Super Over Drama',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '38.6K',
    comments: '942',
  },
  {
    id: 'hl-3',
    img: gallery7,
    title: 'Amo Sharks vs Band-e-Amir Dragons — Match 3 Summary',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '29.3K',
    comments: '618',
  },
  {
    id: 'hl-4',
    img: gallery8,
    title: 'Everest Sports Ventures Broadcast — Behind the Scenes setup',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '18.9K',
    comments: '402',
  },
  {
    id: 'hl-5',
    img: gallery4,
    title: 'Boundary Line Wonders — Top 5 Catches of APL Week 1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '55.2K',
    comments: '2.1K',
  },
  {
    id: 'hl-6',
    img: gallery3,
    title: 'APL Fan Zone — Spectators, Celebrations and Stadium Atmosphere',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-running-on-field-40899-large.mp4',
    likes: '34.8K',
    comments: '883',
  },
];

/** Custom hook that adds mouse-drag scrolling to a container ref */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return
    isDown.current = true
    ref.current.classList.add('active')
    startX.current = e.pageX - ref.current.offsetLeft
    scrollLeft.current = ref.current.scrollLeft
  }

  const onMouseLeave = () => {
    isDown.current = false
    ref.current?.classList.remove('active')
  }

  const onMouseUp = () => {
    isDown.current = false
    ref.current?.classList.remove('active')
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    ref.current.scrollLeft = scrollLeft.current - walk
  }

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove }
}

export function Moments() {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  const reelScroll = useDragScroll()
  const highlightScroll = useDragScroll()

  return (
    <section className="moments-section">

      {/* ── ROW 1: MOMENTS (REELS) ── */}
      <div className="moments-header">
        <h2 className="section-heading"><span>Moments</span></h2>
        <p className="section-description">Watch the latest highlights and trending reels directly from our Instagram feed.</p>
      </div>

      <div
        className="reels-scroll-container"
        ref={reelScroll.ref}
        onMouseDown={reelScroll.onMouseDown}
        onMouseLeave={reelScroll.onMouseLeave}
        onMouseUp={reelScroll.onMouseUp}
        onMouseMove={reelScroll.onMouseMove}
      >
        <div className="reels-track">
          {reelsData.map((reel) => (
            <div
              key={reel.id}
              className="reel-card"
              onClick={() => setActiveReel(reel)}
            >
              <div className="reel-img-wrapper">
                <img src={reel.img} alt={reel.title} className="reel-thumbnail" loading="lazy" />
                <div className="reel-card-overlay">
                  <div className="reel-play-btn">
                    <Play size={36} fill="currentColor" />
                  </div>
                </div>

                <div className="reel-details-overlay">
                  <p className="reel-title-text">{reel.title}</p>
                  <div className="reel-meta-row">
                    <span className="reel-meta-item">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon" style={{ marginRight: '4px' }}>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      @afghanleague
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {FEATURES.SHOW_HIGHLIGHTS && (
        <>
          <div style={{ height: '3.5rem' }} />

          {/* ── ROW 2: MATCH HIGHLIGHTS (LANDSCAPE VIDEOS) ── */}
          <div className="moments-header">
            <h2 className="section-heading">Match <span>Highlights</span></h2>
            <p className="section-description">Catch up on full match reviews, top wickets, boundaries, and exclusive interviews.</p>
          </div>

          <div
            className="reels-scroll-container highlight-scroll-container"
            ref={highlightScroll.ref}
            onMouseDown={highlightScroll.onMouseDown}
            onMouseLeave={highlightScroll.onMouseLeave}
            onMouseUp={highlightScroll.onMouseUp}
            onMouseMove={highlightScroll.onMouseMove}
          >
            <div className="reels-track highlight-track">
              {highlightsData.map((hl) => (
                <div
                  key={hl.id}
                  className="reel-card"
                  onClick={() => setActiveReel(hl)}
                >
                  <div className="reel-img-wrapper">
                    <img src={hl.img} alt={hl.title} className="reel-thumbnail" loading="lazy" />
                    <div className="reel-card-overlay">
                      <div className="reel-play-btn">
                        <Play size={36} fill="currentColor" />
                      </div>
                    </div>

                    <div className="reel-details-overlay">
                      <p className="reel-title-text">{hl.title}</p>
                      <div className="reel-meta-row">
                        <span className="reel-meta-item">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="meta-icon" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
                            <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#000000" />
                          </svg>
                          @afghanleague
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Interactive Mobile-Style Video Player Modal */}
      {activeReel && (
        <div className="reel-modal-backdrop" onClick={() => setActiveReel(null)}>
          <div className="reel-modal-container" onClick={(e) => e.stopPropagation()}>

            <div className="reel-player-screen">
              {activeReel.instagramId ? (
                <iframe
                  src={`https://www.instagram.com/reel/${activeReel.instagramId}/embed/`}
                  title={activeReel.title}
                  className="reel-player-video"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  allow="autoplay; encrypted-media"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#000000',
                  }}
                />
              ) : (
                <video
                  src={activeReel.videoUrl}
                  className="reel-player-video"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onClick={() => setIsMuted(!isMuted)}
                />
              )}

              <div className="reel-player-header">
                <span className="player-brand-tag">@afghanistanpremierleague</span>
                <button className="player-close-btn-in" onClick={() => setActiveReel(null)} aria-label="Close Player">
                  <X size={20} />
                </button>
              </div>

              <div className="reel-player-actions-overlay">
                <div className="player-overlay-action">
                  <button className="overlay-btn-circle" aria-label="Like Video">
                    <Heart size={20} fill="#ff4b4b" color="#ff4b4b" />
                  </button>
                  <span className="overlay-btn-label">{activeReel.likes}</span>
                </div>
                <div className="player-overlay-action">
                  <button className="overlay-btn-circle" aria-label="Comment on Video">
                    <MessageCircle size={20} fill="currentColor" />
                  </button>
                  <span className="overlay-btn-label">{activeReel.comments}</span>
                </div>
                <div className="player-overlay-action">
                  <button className="overlay-btn-circle" aria-label="Share Video">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="reel-player-caption-overlay">
                <p className="player-caption-text">{activeReel.title}</p>
                <div className="player-music-track">
                  <span className="music-icon">🎵</span>
                  <span className="music-title-scroll">Original Audio - Afghanistan Premier League</span>
                </div>
              </div>
            </div>

            <div className="reel-desktop-sidebar">
              <div className="sidebar-header-row">
                <div className="sidebar-brand-info">
                  <div className="sidebar-brand-avatar">APL</div>
                  <div>
                    <h4 className="sidebar-brand-name">Afghanistan Premier League</h4>
                    <p className="sidebar-brand-sub">Official Account</p>
                  </div>
                </div>
                <button className="sidebar-close-btn" onClick={() => setActiveReel(null)} aria-label="Close Screen">
                  <X size={24} />
                </button>
              </div>

              <div className="sidebar-scrollable-comments">
                <div className="comment-item">
                  <span className="comment-user">cricket_fan_99</span>
                  <span className="comment-text">Absolutely massive shot! Outstanding talent in the APL this season 🇦🇫🔥</span>
                </div>
                <div className="comment-item">
                  <span className="comment-user">khan_sahib</span>
                  <span className="comment-text">No look sixes are the best trend. Phoebe Litchfield and Sutherland are brilliant!</span>
                </div>
                <div className="comment-item">
                  <span className="comment-user">apl_insider</span>
                  <span className="comment-text">Can't wait for the live matches to begin! Standings are getting intense.</span>
                </div>
                <div className="comment-item">
                  <span className="comment-user">sports_lover</span>
                  <span className="comment-text">Is there a live stream available on the site? 🏏</span>
                </div>
              </div>

              <div className="sidebar-stats-footer">
                <div className="sidebar-stats-row">
                  <span className="stat-pill"><Heart size={16} fill="#ff4b4b" color="#ff4b4b" style={{ marginRight: '6px' }} /> {activeReel.likes}</span>
                  <span className="stat-pill"><MessageCircle size={16} style={{ marginRight: '6px' }} /> {activeReel.comments}</span>
                </div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-view-insta-btn"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  View on Instagram
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
