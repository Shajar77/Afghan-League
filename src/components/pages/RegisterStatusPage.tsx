import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { buildApiUrl, publicFetch, normalizeMediaUrl } from '../../config/api'
import './RegisterStatusPage.css'

interface StatusResult {
  id: string
  name?: string
  status: string
  date: string
  assignee: string
  remarks: string
  video_url?: string
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const AGREEMENT_TEXTS = [
  'I agree to the APL Privacy Policy and understand how my information may be collected and used.',
  'I consent to APL using my submitted information and video for APL team review and, where applicable, publishing on APL digital, social media and promotional channels.',
  'I confirm that the information and video I have submitted are accurate and represent me as a player.',
  'I understand that submitting a video profile does not guarantee selection for the APL or any team.'
]

// Toggle: set to true to show video upload & preview section on lookup page
const SHOW_VIDEO_UPLOAD_SECTION = true

export function RegisterStatusPage() {
  const [appId, setAppId] = useState('')
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  // Video upload states
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false)
  const [videoUploadError, setVideoUploadError] = useState('')
  const [agreements, setAgreements] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false])

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

  // Cleanup object URLs on unmount or URL change
  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl)
      }
    }
  }, [videoPreviewUrl])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Anti-bot check
    if (honeypot.trim()) {
      return
    }

    const trimmedId = appId.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedId || !trimmedEmail) return

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      setSearched(true)
      setStatusResult(null)
      return
    }

    const formattedId = trimmedId.toUpperCase().replace(/\s+/g, '')

    setIsLoading(true)
    setErrorMessage('')
    setSearched(false)
    setStatusResult(null)
    // Reset video states on new search
    if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl)
    }
    setVideoFile(null)
    setVideoPreviewUrl(null)
    setVideoUploadSuccess(false)
    setVideoUploadError('')
    setAgreements([false, false, false, false])

    let captchaToken = ''
    if (siteKey && recaptchaRef.current) {
      try {
        captchaToken = (await recaptchaRef.current.executeAsync()) || ''
      } catch {
        // reCAPTCHA execution fallback
      }
    }

    try {
      const captchaParam = captchaToken ? `&captchaToken=${encodeURIComponent(captchaToken)}` : ''
      const url = buildApiUrl(`/player-registrations/lookup?code=${encodeURIComponent(formattedId)}&email=${encodeURIComponent(trimmedEmail)}${captchaParam}`)
      const response = await publicFetch(url)

      if (response.status === 429) {
        setErrorMessage('Rate limit reached: Maximum 10 lookups per 15 minutes. Please wait before searching again.')
        return
      }

      const json = await response.json()

      if (response.ok) {
        const record = json.data || json
        const rawVid = record.video_url || record.player_video_url || ''
        const vidUrl = rawVid ? normalizeMediaUrl(rawVid) : ''
        const resolvedName = record.full_name || (record.first_name ? `${record.first_name} ${record.last_name || ''}`.trim() : '') || record.name || ''
        setStatusResult({
          id: record.registration_code || record.code || formattedId,
          name: resolvedName,
          status: record.status || 'Under Review',
          date: record.created_at ? new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'August 8, 2026',
          assignee: record.assignee || 'APL Cricket Operations',
          remarks: record.remarks || 'Your document validation is complete. Reviewing draft category eligibility based on ESPNcricinfo / matches history.',
          video_url: vidUrl
        })
      } else {
        setErrorMessage(json.message || 'Reference Code or Email not found.')
      }
    } catch {
      setErrorMessage('Could not connect to the tracking server. Please try again later.')
    } finally {
      setIsLoading(false)
      setSearched(true)
      if (siteKey && recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVideoFile(file)
    setVideoUploadSuccess(false)
    setVideoUploadError('')
    if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl)
    }
    if (file) {
      setVideoPreviewUrl(URL.createObjectURL(file))
    } else {
      setVideoPreviewUrl(null)
    }
  }

  const handleAgreementToggle = (index: number) => {
    setAgreements(prev => {
      const next = [...prev] as [boolean, boolean, boolean, boolean]
      next[index] = !next[index]
      return next
    })
  }

  const allAgreed = agreements.every(Boolean)

  const handleVideoUpload = async () => {
    if (!videoFile || !statusResult || !allAgreed) return
    setIsUploadingVideo(true)
    setVideoUploadError('')
    setVideoUploadSuccess(false)

    try {
      // Step 1: Upload the video file, get URL back
      const formData = new FormData()
      formData.append('file', videoFile)

      const uploadRes = await publicFetch(buildApiUrl('/uploads/player-video'), {
        method: 'POST',
        body: formData
      })
      const uploadJson = await uploadRes.json().catch(() => ({}))

      if (!uploadRes.ok) {
        throw new Error(uploadJson.message || uploadJson.error?.message || 'Video upload failed. Please try again.')
      }

      const rawVideoUrl =
        uploadJson.data?.url ||
        uploadJson.data?.video_url ||
        uploadJson.data?.player_video_url ||
        uploadJson.url ||
        uploadJson.video_url ||
        ''
      const videoUrl = rawVideoUrl ? normalizeMediaUrl(rawVideoUrl) : ''

      if (!videoUrl) {
        throw new Error('No video URL was returned by the server.')
      }

      // Step 2: Link the video URL to the player record
      const linkRes = await publicFetch(buildApiUrl('/player-registrations/video'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_code: statusResult.id,
          email: email.trim().toLowerCase(),
          player_video_url: videoUrl
        })
      })

      if (!linkRes.ok) {
        const linkJson = await linkRes.json().catch(() => ({}))
        throw new Error(linkJson.message || linkJson.error?.message || 'Failed to link video to your player profile.')
      }

      setVideoUploadSuccess(true)
      setVideoFile(null)
    } catch (err: any) {
      setVideoUploadError(err.message || 'Video upload failed. Please try again.')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  return (
    <div className="status-page-container">
      {/* ── TOP HERO HEADER BANNER ── */}
      <section className="status-hero">
        <div className="status-hero-bg-grid" />
        <div className="status-hero-glow" />

        <div className="status-hero-top-row">
          <div className="status-hero-title-wrap">
            <span className="status-live-badge">APL 2026 SEASON</span>
            <h1 className="status-main-title">REGISTRATION STATUS<span className="dot-accent">.</span></h1>
          </div>
        </div>
      </section>

      {/* ── SEARCH AREA ── */}
      <section className="status-content-section">
        <div className="status-card">
          <h2 className="status-section-title">Check Application Status</h2>
          <p className="status-section-subtitle">
            Enter your registration reference number and registered email address to check the current status of your draft application.
          </p>

          <form onSubmit={handleSearch} className="status-search-form">
            {/* Anti-Spam Bot Trap (Honeypot) */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <label htmlFor="status_hp_website">Leave this field blank</label>
              <input
                id="status_hp_website"
                type="text"
                name="status_hp_website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="status-fields-stack">
              <div className="status-field-group">
                <input
                  type="text"
                  placeholder="e.g. APL-2026-64297"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="status-search-input"
                  autoComplete="off"
                  aria-label="Application Reference Code"
                  required
                />
              </div>
              <div className="status-field-group">
                <input
                  type="email"
                  placeholder="Enter Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="status-search-input"
                  autoComplete="email"
                  aria-label="Registered Email Address"
                  required
                />
                <p className="status-otp-hint">Enter the email used during registration</p>
              </div>
            </div>

            {siteKey && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                size="invisible"
              />
            )}

            <button 
              type="submit" 
              className="status-search-btn status-search-btn--full"
              disabled={isLoading}
            >
              {isLoading ? 'Tracking Application...' : 'Track Application'}
            </button>
          </form>
 
           {searched && statusResult && (
             <div className="status-result-box success animate-fade-in">
               <h3 className="result-header">Application Found</h3>
               <div className="result-detail-grid">
                 <div className="result-row">
                   <span className="result-label">Application Reference</span>
                   <span className="result-value code-value">{statusResult.id}</span>
                 </div>
                 <div className="result-row">
                   <span className="result-label">Submission Date</span>
                   <span className="result-value">{statusResult.date}</span>
                 </div>
                 <div className="result-row">
                   <span className="result-label">Reviewing Authority</span>
                   <span className="result-value">{statusResult.assignee}</span>
                 </div>
                 <div className="result-row">
                   <span className="result-label">Current Status</span>
                   <span className="result-value status-badge-track">
                      {statusResult.status
                        ? statusResult.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                        : 'Pending'}
                   </span>
                 </div>
               </div>
             </div>
           )}

           {/* ── VIDEO UPLOAD SECTION ── shown only after successful lookup (temporarily hidden) */}
           {SHOW_VIDEO_UPLOAD_SECTION && searched && statusResult && (
             <div className="status-video-upload-section">

               {/* Header */}
               <div className="status-video-upload-header">
                 <div className="status-video-upload-header-text">
                   <p className="status-video-upload-title">Player Highlight Video</p>
                   <p className="status-video-upload-subtitle">
                     Upload your introduction video profile to strengthen your draft evaluation.
                   </p>
                 </div>
               </div>

               {/* Custom file drop zone */}
               <div className={`status-video-file-zone${videoFile ? ' has-file' : ''}`}>
                 <input
                   id="player-video-input"
                   type="file"
                   accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                   className="status-video-file-input"
                   disabled={isUploadingVideo}
                   onChange={handleFileChange}
                 />
                 {videoFile ? (
                   <div className="status-video-file-selected-card">
                     <span className="status-video-file-selected-icon">📹</span>
                     <div className="status-video-file-selected-details">
                       <p className="status-video-file-selected-name">{videoFile.name}</p>
                       <p className="status-video-file-selected-size">
                         {(videoFile.size / (1024 * 1024)).toFixed(1)} MB · Tap or click to change video
                       </p>
                     </div>
                   </div>
                 ) : (
                   <>
                     <span className="status-video-file-zone-icon">📁</span>
                     <p className="status-video-file-zone-label">
                       Drop video here or <span>browse</span>
                     </p>
                     <p className="status-video-file-zone-hint">MP4, MOV, AVI, WebM · Max 100MB</p>
                   </>
                 )}
               </div>

               {/* Preview of the video they uploaded / selected */}
               {videoPreviewUrl && (
                 <div className="status-video-preview-block">
                   <div className="status-video-preview-header">
                     <span className="status-video-preview-badge">▶ Video Preview</span>
                     {videoUploadSuccess && (
                       <span className="status-video-preview-tag success">Uploaded Profile Video</span>
                     )}
                   </div>
                   <video
                     key={videoPreviewUrl}
                     controls
                     className="status-video-preview-player"
                     preload="metadata"
                     playsInline
                   >
                     <source src={videoPreviewUrl} type={videoFile?.type || 'video/mp4'} />
                     Your browser does not support HTML5 video.
                   </video>
                 </div>
               )}

               {/* Video Profile Submission Guidelines & Instructions */}
               <div className="status-video-guide-card">
                 <p className="status-video-guide-lead">
                   Give APL teams a quick introduction to who you are as a player. Your video profile will help teams understand your experience, playing role, strengths and achievements during the draft review, especially if they have not seen you play before.
                 </p>

                 <div className="status-video-duration-callout">
                   <span className="status-video-duration-icon">⏱</span>
                   <span className="status-video-duration-text">
                     Please record a <strong>60–120 second</strong> video and briefly introduce yourself.
                   </span>
                 </div>

                 <div className="status-video-guide-group">
                   <h4 className="status-video-group-title">What to Include in video:</h4>
                   <ul className="status-video-guide-checklist">
                     <li>
                       <span className="status-video-check-icon">✓</span>
                       <span>Your name, age and where you are from</span>
                     </li>
                     <li>
                       <span className="status-video-check-icon">✓</span>
                       <span>Your primary playing role and batting/bowling style</span>
                     </li>
                     <li>
                       <span className="status-video-check-icon">✓</span>
                       <span>Your cricket experience, clubs or teams you have played for</span>
                     </li>
                     <li>
                       <span className="status-video-check-icon">✓</span>
                       <span>Your key strengths and notable achievements</span>
                     </li>
                     <li>
                       <span className="status-video-check-icon">✓</span>
                       <span>What you can bring to an APL team</span>
                     </li>
                   </ul>
                 </div>

                 <div className="status-video-guide-group">
                   <h4 className="status-video-group-title">Submission</h4>
                   <p className="status-video-submission-p">
                     Enter your Full Name and Registration ID (the ID sent to you by email when you registered), then upload your video.
                   </p>
                   <p className="status-video-submission-p">
                     Please make sure your video is clear, your information is accurate, and your face and upper body are clearly visible.
                   </p>
                   <p className="status-video-submission-disclaimer">
                     Submission is optional. A video profile does not guarantee selection.
                   </p>
                 </div>
               </div>

               {/* 4 Required Agreements */}
               <div className="status-video-agreements-section">
                 <p className="status-video-agreements-heading">Required Agreements</p>
                 <div className="status-video-agreements-list">
                   {AGREEMENT_TEXTS.map((statement, idx) => (
                     <label
                       key={idx}
                       htmlFor={`agreement-check-${idx}`}
                       className={`status-video-agreement-row${agreements[idx] ? ' is-checked' : ''}`}
                     >
                       <input
                         id={`agreement-check-${idx}`}
                         type="checkbox"
                         className="status-video-agreement-checkbox"
                         checked={agreements[idx]}
                         onChange={() => handleAgreementToggle(idx)}
                         disabled={isUploadingVideo}
                       />
                       <span className="status-video-agreement-label">{statement}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Upload Progress Bar */}
               {isUploadingVideo && (
                 <div className="status-video-progress-container">
                   <div className="status-video-progress-bar-wrap">
                     <div className="status-video-progress-bar" />
                   </div>
                   <p className="status-video-uploading-text">Uploading your video, please wait…</p>
                 </div>
               )}

               {/* Submit Action Block */}
               <div className="status-video-action-area">
                 <button
                   type="button"
                   className="status-video-upload-btn"
                   onClick={handleVideoUpload}
                   disabled={!videoFile || isUploadingVideo || !allAgreed}
                 >
                   {isUploadingVideo ? 'Uploading Video…' : 'Submit Video Profile'}
                 </button>

                 {!videoFile && !isUploadingVideo && (
                   <p className="status-video-btn-hint">
                     Please choose a video file above to enable submission.
                   </p>
                 )}
                 {videoFile && !allAgreed && !isUploadingVideo && (
                   <p className="status-video-btn-hint warning">
                     Please check all 4 agreements above to enable the submit button.
                   </p>
                 )}

                 {/* Success */}
                 {videoUploadSuccess && (
                   <div className="status-video-success">
                     Your video profile has been uploaded and linked to your player record successfully.
                   </div>
                 )}

                 {/* Error */}
                 {videoUploadError && (
                   <div className="status-video-error-msg">
                     ⚠ {videoUploadError}
                   </div>
                 )}
               </div>
             </div>
           )}

 
           {searched && errorMessage && (
             <div className="status-result-box error animate-fade-in">
               <h3 className="result-header text-red">Search Failed</h3>
               <p className="error-desc">
                 {errorMessage}
               </p>
             </div>
           )}

          <div className="status-footer-action">
            <p className="no-id-text">Don't have an Application Reference ID?</p>
            <a href="#register-player" className="status-register-btn">
              Register Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

