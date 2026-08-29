import { useState, type Dispatch, type SetStateAction, type FormEvent } from 'react'
import { buildApiUrl, authFetch, safeExternalUrl } from '../../config/api'
import { compressImageFile } from '../../utils/imageCompression'
import {
  Award,
  X,
  UploadCloud,
  ExternalLink,
  Loader2,
  Hash,
  Globe,
  User
} from 'lucide-react'

export interface Sponsor {
  id: number | string
  name: string
  logo_url?: string
  tier: string
  website_url?: string
  display_order?: number
  is_active?: boolean
}

const SPONSOR_TIERS = [
  { label: 'Title Sponsor', value: 'title_sponsor' },
  { label: 'Official Partner', value: 'official_partner' },
  { label: 'Media Partner', value: 'media_partner' },
  { label: 'Technical Partner', value: 'technical_partner' }
]

function SponsorLogo({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const [error, setError] = useState(false)
  const initials = (name || '').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'SP'

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="apl-sponsor-logo-img"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      color: '#475569',
      fontWeight: 800,
      fontSize: '1rem',
      fontFamily: 'var(--font-display, "Big Shoulders Display", sans-serif)',
      letterSpacing: '0.04em'
    }}>
      {initials}
    </div>
  )
}

function formatTierLabel(tierKey: string) {
  const match = SPONSOR_TIERS.find(t => t.value === tierKey)
  if (match) return match.label
  return tierKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function parseServerError(errJson: Record<string, unknown>, fallback: string): string {
  if (errJson.error && typeof errJson.error === 'object') {
    const sub = errJson.error as Record<string, unknown>
    if (typeof sub.message === 'string') return sub.message
  }
  if (typeof errJson.message === 'string') return errJson.message
  return fallback
}

interface SponsorsTabProps {
  sponsors: Sponsor[]
  setSponsors: Dispatch<SetStateAction<Sponsor[]>>
  showSponsorModal: boolean
  setShowSponsorModal: (show: boolean) => void
  setSuccessMessage: (msg: string | null) => void
  setError: (msg: string | null) => void
  onLogout?: () => void
}

export function SponsorsTab({
  sponsors,
  setSponsors,
  showSponsorModal,
  setShowSponsorModal,
  setSuccessMessage,
  setError,
  onLogout
}: SponsorsTabProps) {
  // Create Sponsor Form State
  const [sponsorName, setSponsorName] = useState('')
  const [sponsorTier, setSponsorTier] = useState('official_partner')
  const [sponsorWebsite, setSponsorWebsite] = useState('')
  const [sponsorDisplayOrder, setSponsorDisplayOrder] = useState<number>(1)
  const [sponsorLogoFile, setSponsorLogoFile] = useState<File | null>(null)
  const [sponsorLogoPreview, setSponsorLogoPreview] = useState<string>('')
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false)

  const resetSponsorForm = () => {
    setSponsorName('')
    setSponsorTier('official_partner')
    setSponsorWebsite('')
    setSponsorDisplayOrder(1)
    setSponsorLogoFile(null)
    setSponsorLogoPreview('')
  }

  const uploadLogoFile = async (file: File): Promise<string> => {
    const compressedFile = await compressImageFile(file, { maxSizeMB: 0.3, maxWidthOrHeight: 1200 })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const uploadRes = await authFetch(buildApiUrl('/uploads/image'), {
      method: 'POST',
      body: formData
    })

    if (!uploadRes.ok) {
      const errJson = await uploadRes.json().catch(() => ({}))
      throw new Error(parseServerError(errJson, 'Failed to upload sponsor logo image.'))
    }

    const uploadJson = await uploadRes.json()
    const uploadedUrl = uploadJson.data?.url || uploadJson.data?.file_url || uploadJson.url || ''
    if (!uploadedUrl) {
      throw new Error('Upload succeeded but server did not return image URL.')
    }
    return uploadedUrl
  }

  const handleCreateSponsorSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!sponsorName.trim()) {
      setError('Please provide a valid sponsor name.')
      return
    }

    if (!sponsorLogoFile) {
      setError('Please upload a sponsor logo image.')
      return
    }

    setIsSubmittingSponsor(true)

    try {
      const uploadedLogoUrl = await uploadLogoFile(sponsorLogoFile)

      const sponsorPayload = {
        name: sponsorName.trim(),
        tier: sponsorTier,
        website_url: sponsorWebsite.trim() || undefined,
        logo_url: uploadedLogoUrl,
        display_order: Number(sponsorDisplayOrder) || 1,
        is_active: true
      }

      const res = await authFetch(buildApiUrl('/sponsors'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sponsorPayload)
      })

      if (!res.ok) {
        if (res.status === 401 && onLogout) {
          onLogout()
          return
        }
        const errJson = await res.json().catch(() => ({}))
        throw new Error(parseServerError(errJson, 'Failed to create sponsor.'))
      }

      const json = await res.json()
      const createdSponsor = json.data || json
      setSponsors(prev => [createdSponsor, ...prev])

      setSuccessMessage(`Sponsor "${sponsorName}" added successfully!`)
      setShowSponsorModal(false)
      resetSponsorForm()
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while adding the sponsor.'
      setError(errorMsg)
    } finally {
      setIsSubmittingSponsor(false)
    }
  }

  return (
    <>
      {/* ── SPONSORS GRID ── */}
      <div className="apl-ts-grid">
        {sponsors.map(sponsor => (
          <div key={sponsor.id} className="apl-sponsor-card">
            <div className="apl-sponsor-card-top">
              <div className="apl-sponsor-logo-box">
                <SponsorLogo name={sponsor.name} logoUrl={sponsor.logo_url} />
              </div>
              <h3 className="apl-sponsor-name">{sponsor.name}</h3>
            </div>

            <div className="apl-detail-rows">
              <div className="apl-detail-row">
                <div className="apl-detail-label">
                  <User size={15} className="apl-detail-icon" />
                  <span>Sponsor Name</span>
                </div>
                <div className="apl-detail-value">{sponsor.name}</div>
              </div>

              <div className="apl-detail-row">
                <div className="apl-detail-label">
                  <Award size={15} className="apl-detail-icon" />
                  <span>Sponsor Tier</span>
                </div>
                <div className="apl-detail-value">{formatTierLabel(sponsor.tier)}</div>
              </div>

              <div className="apl-detail-row">
                <div className="apl-detail-label">
                  <Hash size={15} className="apl-detail-icon" />
                  <span>Display Rank Order</span>
                </div>
                <div className="apl-detail-value">#{sponsor.display_order || 1}</div>
              </div>

              <div className="apl-detail-row" style={{ borderBottom: 'none' }}>
                <div className="apl-detail-label">
                  <Globe size={15} className="apl-detail-icon" />
                  <span>Official Website</span>
                </div>
                <div className="apl-detail-value">
                  {sponsor.website_url && safeExternalUrl(sponsor.website_url) ? (
                    <a
                      href={safeExternalUrl(sponsor.website_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apl-sponsor-link"
                    >
                      <span>{sponsor.website_url.replace(/^https?:\/\//i, '')}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE SPONSOR MODAL ── */}
      {showSponsorModal && (
        <div className="apl-modal-overlay animate-fade-in">
          <div className="apl-modal-card">
            <div className="apl-modal-header">
              <h2 className="apl-modal-title">Add Official Sponsor</h2>
              <button
                type="button"
                className="apl-modal-close"
                onClick={() => setShowSponsorModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSponsorSubmit}>
              <div className="apl-modal-body">
                {/* Sponsor Name */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Sponsor Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Bull"
                    className="apl-form-input"
                    value={sponsorName}
                    onChange={e => setSponsorName(e.target.value)}
                  />
                </div>

                {/* Tier & Display Order */}
                <div className="apl-form-row-2">
                  <div className="apl-form-group">
                    <label className="apl-form-label">Sponsor Tier *</label>
                    <select
                      className="apl-form-select"
                      value={sponsorTier}
                      onChange={e => setSponsorTier(e.target.value)}
                    >
                      {SPONSOR_TIERS.map(tier => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="apl-form-group">
                    <label className="apl-form-label">Display Rank Order</label>
                    <input
                      type="number"
                      min={1}
                      className="apl-form-input"
                      value={sponsorDisplayOrder}
                      onChange={e => setSponsorDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Website URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://redbull.com"
                    className="apl-form-input"
                    value={sponsorWebsite}
                    onChange={e => setSponsorWebsite(e.target.value)}
                  />
                </div>

                {/* Logo Uploader */}
                <div className="apl-form-group">
                  <label className="apl-form-label">Sponsor Logo Image *</label>
                  <label className="apl-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSponsorLogoFile(file)
                          setSponsorLogoPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                    {sponsorLogoPreview ? (
                      <div className="apl-dropzone-preview">
                        <img src={sponsorLogoPreview} alt="Logo preview" className="apl-preview-img" />
                        <div className="apl-preview-info">
                          <span className="apl-preview-name">{sponsorLogoFile?.name}</span>
                          <span className="apl-preview-size">{(sponsorLogoFile!.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="apl-dropzone-icon" />
                        <span className="apl-dropzone-text">Click or drag logo file here</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="apl-modal-footer">
                <button
                  type="button"
                  className="apl-btn-cancel"
                  onClick={() => setShowSponsorModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="apl-btn-submit"
                >
                  {isSubmittingSponsor ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Adding Sponsor...</span>
                    </>
                  ) : (
                    <span>Add Sponsor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
