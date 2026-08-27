import { useState, useCallback } from 'react'
import { Play } from 'lucide-react'

interface YouTubeFacadeProps {
  videoId: string
  iframeId: string
  title: string
  className?: string
}

/** Lightweight YouTube facade: shows thumbnail + play button, loads iframe only on click */
function YouTubeFacade({ videoId, iframeId, title, className = '' }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  if (loaded) {
    return (
      <iframe
        id={iframeId}
        className={className}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&enablejsapi=1&rel=0&controls=1&playlist=${videoId}&loop=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    )
  }

  return (
    <div 
      className={`yt-facade ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onClick={handleLoad}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleLoad()
        }
      }}
      style={{ cursor: 'pointer', position: 'relative', width: '100%', height: '100%' }}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        loading="lazy"
        decoding="async"
        width="480"
        height="360"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '44px',
          background: 'rgba(239, 68, 68, 0.9)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          transition: 'transform 0.2s ease, background 0.2s ease',
        }}>
          <Play size={24} fill="#fff" color="#fff" />
        </div>
        <span style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          Watch on YouTube
        </span>
      </div>
    </div>
  )
}

export function GrandLaunchSection() {
  return (
    <>
      <div className="section-divider-line" />
      <section className="launch-section">
        <h2 className="section-heading">Apl Grand <span>Launch</span> Event</h2>
        <p className="section-description">Relive the highlights and spectacular event celebrations from the league opening.</p>

        <div className="launch-grid-container">
          {/* Left Panel: Main Large Video */}
          <div className="launch-main-video-panel">
            <div className="launch-video-glow-container">
              <div className="launch-video-wrapper">
                <YouTubeFacade
                  videoId="sq00E0Rmyjs"
                  iframeId="launch-video-iframe"
                  title="The APL Grand Launch Event"
                  className="launch-video-iframe"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: 3 Stacked Side Videos */}
          <div className="launch-side-videos-panel">
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="ePIpdbzDgM4"
                iframeId="side-video-1"
                title="APL Launch Highlights – Players Reviews"
                className="side-video-iframe"
              />
            </div>
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="OPLRXDmteCE"
                iframeId="side-video-2"
                title="APL Launch Highlights – Moments of Appreciation"
                className="side-video-iframe"
              />
            </div>
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="6PZfy6YCw88"
                iframeId="side-video-3"
                title="APL Launch Highlights – Celebrations"
                className="side-video-iframe"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="section-divider-line" />
    </>
  )
}
