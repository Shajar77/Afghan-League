import { VolumeX } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

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
                <iframe
                  id="launch-video-iframe"
                  className="launch-video-iframe"
                  src="https://www.youtube-nocookie.com/embed/sq00E0Rmyjs?autoplay=1&mute=1&enablejsapi=1&rel=0&controls=1&playlist=sq00E0Rmyjs&loop=1"
                  title="The APL Grand Launch Event"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                {launchMuted && (
                  <div 
                    role="button"
                    tabIndex={0}
                    aria-label="Unmute and play Grand Launch Ceremony video"
                    className="launch-video-overlay" 
                    onClick={() => handleUnmute('launch-video-iframe', setLaunchMuted)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleUnmute('launch-video-iframe', setLaunchMuted)
                      }
                    }}
                  >
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
              <iframe
                id="side-video-1"
                className="side-video-iframe"
                src="https://www.youtube-nocookie.com/embed/ePIpdbzDgM4?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=ePIpdbzDgM4&loop=1"
                title="APL Launch Highlights 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
              {side1Muted && (
                <div 
                  role="button"
                  tabIndex={0}
                  aria-label="Unmute Players Reviews video"
                  className="side-video-overlay" 
                  onClick={() => handleUnmute('side-video-1', setSide1Muted)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUnmute('side-video-1', setSide1Muted)
                    }
                  }}
                >
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
              <iframe
                id="side-video-2"
                className="side-video-iframe"
                src="https://www.youtube-nocookie.com/embed/OPLRXDmteCE?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=OPLRXDmteCE&loop=1"
                title="APL Launch Highlights 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
              {side2Muted && (
                <div 
                  role="button"
                  tabIndex={0}
                  aria-label="Unmute Moments of appreciation video"
                  className="side-video-overlay" 
                  onClick={() => handleUnmute('side-video-2', setSide2Muted)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUnmute('side-video-2', setSide2Muted)
                    }
                  }}
                >
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
              <iframe
                id="side-video-3"
                className="side-video-iframe"
                src="https://www.youtube-nocookie.com/embed/6PZfy6YCw88?autoplay=1&mute=1&enablejsapi=1&rel=0&playlist=6PZfy6YCw88&loop=1"
                title="APL Launch Highlights 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
              {side3Muted && (
                <div 
                  role="button"
                  tabIndex={0}
                  aria-label="Unmute APL celebrations video"
                  className="side-video-overlay" 
                  onClick={() => handleUnmute('side-video-3', setSide3Muted)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUnmute('side-video-3', setSide3Muted)
                    }
                  }}
                >
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
