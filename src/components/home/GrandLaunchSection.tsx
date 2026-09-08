import { useState } from 'react'
import { VolumeX, Play } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

interface YouTubeFacadeProps {
  videoId: string
  iframeId: string
  title: string
  className: string
}

function YouTubeFacade({ videoId, iframeId, title, className }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        id={iframeId}
        className={className}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&rel=0&controls=1&playlist=${videoId}&loop=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    )
  }

  return (
    <button
      className="yt-facade"
      onClick={() => setLoaded(true)}
      aria-label={`Play ${title}`}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="yt-facade-thumb"
        loading="lazy"
      />
      <div className="yt-facade-play">
        <Play size={36} fill="#fff" />
      </div>
    </button>
  )
}

export function GrandLaunchSection() {
  const {
    launchMuted,
    setLaunchMuted,
    side1Muted,
    setSide1Muted,
    side2Muted,
    setSide2Muted,
    side3Muted,
    setSide3Muted,
  } = useAppStore()

  const handleUnmute = (iframeId: string, setter: (muted: boolean) => void) => {
    setter(false)
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*')
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*')
    }
  }

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
                {launchMuted && (
                  <div className="launch-video-overlay" onClick={() => handleUnmute('launch-video-iframe', setLaunchMuted)}>
                    <div className="launch-unmute-button-container">
                      <div className="launch-unmute-icon-ring">
                        <VolumeX size={44} className="launch-unmute-icon" />
                      </div>
                      <h3 className="launch-unmute-title">TAP TO UNMUTE & WATCH</h3>
                      <p className="launch-unmute-subtitle">APL GRAND LAUNCH CEREMONY</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: 3 Stacked Side Videos */}
          <div className="launch-side-videos-panel">
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="ePIpdbzDgM4"
                iframeId="side-video-1"
                title="APL Launch Highlights 1"
                className="side-video-iframe"
              />
              {side1Muted && (
                <div className="side-video-overlay" onClick={() => handleUnmute('side-video-1', setSide1Muted)}>
                  <div className="side-unmute-button-container">
                    <div className="side-unmute-icon-ring">
                      <VolumeX size={24} className="side-unmute-icon" />
                    </div>
                    <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                    <p className="side-unmute-subtitle">Players Reviews</p>
                  </div>
                </div>
              )}
            </div>
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="OPLRXDmteCE"
                iframeId="side-video-2"
                title="APL Launch Highlights 2"
                className="side-video-iframe"
              />
              {side2Muted && (
                <div className="side-video-overlay" onClick={() => handleUnmute('side-video-2', setSide2Muted)}>
                  <div className="side-unmute-button-container">
                    <div className="side-unmute-icon-ring">
                      <VolumeX size={24} className="side-unmute-icon" />
                    </div>
                    <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                    <p className="side-unmute-subtitle">Moments of appreciation</p>
                  </div>
                </div>
              )}
            </div>
            <div className="side-video-card animate-side-card">
              <YouTubeFacade
                videoId="6PZfy6YCw88"
                iframeId="side-video-3"
                title="APL Launch Highlights 3"
                className="side-video-iframe"
              />
              {side3Muted && (
                <div className="side-video-overlay" onClick={() => handleUnmute('side-video-3', setSide3Muted)}>
                  <div className="side-unmute-button-container">
                    <div className="side-unmute-icon-ring">
                      <VolumeX size={24} className="side-unmute-icon" />
                    </div>
                    <h4 className="side-unmute-title">TAP TO UNMUTE</h4>
                    <p className="side-unmute-subtitle">APL celebrations</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="section-divider-line" />
    </>
  )
}
