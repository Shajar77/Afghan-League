import type { FormData } from './types'
import { formatAvailabilityDisplay } from './types'

interface Step5ReviewProps {
  formData: FormData
  errors: Record<string, string>
  consent1: boolean
  setConsent1: (val: boolean) => void
  consent2: boolean
  setConsent2: (val: boolean) => void
  consent3: boolean
  setConsent3: (val: boolean) => void
  consent4: boolean
  setConsent4: (val: boolean) => void
}

export function Step5Review({
  formData,
  errors,
  consent1,
  setConsent1,
  consent2,
  setConsent2,
  consent3,
  setConsent3,
  consent4,
  setConsent4,
}: Step5ReviewProps) {
  const catKey = (formData.category || '').toLowerCase()
  const isPlatinum = catKey.includes('platinum')
  const isEmerging = catKey.includes('emerging')
  const isSilver = catKey.includes('silver')

  return (
    <div className="form-step-content animate-fade-in">
      <div className="form-section">
        <h3 className="section-title">Final Review & Consent</h3>
        <p className="section-subtitle">Please review your registration before submitting.</p>

        <div className="review-mockup-wrap">
          {/* REPRESENTATIVE DETAILS */}
          {formData.regType === 'agent' && (
            <div className="review-section-block">
              <span className="review-section-title-line">REPRESENTATIVE DETAILS</span>
              <div className="review-lines-wrap">
                <div className="review-line-item">
                  <span className="review-line-label">Representative Full Name</span>
                  <span className="review-line-val">{formData.agentName || '—'}</span>
                </div>
                <div className="review-line-item">
                  <span className="review-line-label">Agency / Board Name</span>
                  <span className="review-line-val">{formData.agentAgency || '—'}</span>
                </div>
                <div className="review-line-item">
                  <span className="review-line-label">Representative Phone Number</span>
                  <span className="review-line-val">{formData.agentPhone || '—'}</span>
                </div>
                <div className="review-line-item">
                  <span className="review-line-label">Representative Email Address</span>
                  <span className="review-line-val">{formData.agentEmail || '—'}</span>
                </div>
              </div>
            </div>
          )}

          {/* PERSONAL INFORMATION */}
          <div className="review-section-block">
            <span className="review-section-title-line">PLAYER PERSONAL INFORMATION</span>
            <div className="review-lines-wrap">
              <div className="review-line-item">
                <span className="review-line-label">Full Name</span>
                <span className="review-line-val">{formData.fullName || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Date of Birth</span>
                <span className="review-line-val">{formData.dob || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Nationality</span>
                <span className="review-line-val">{formData.nationality || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Passport Number</span>
                <span className="review-line-val">{formData.passportNumber || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Country of Residence</span>
                <span className="review-line-val">{formData.countryResidence || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">City</span>
                <span className="review-line-val">{formData.city || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Phone</span>
                <span className="review-line-val">{formData.phone || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Email</span>
                <span className="review-line-val">{formData.email || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Availability</span>
                <span className="review-line-val">
                  {formatAvailabilityDisplay(formData.availability)}
                </span>
              </div>
            </div>
          </div>

          {/* CRICKET PROFILE */}
          <div className="review-section-block">
            <span className="review-section-title-line">CRICKET PROFILE</span>
            <div className="review-lines-wrap">
              <div className="review-line-item">
                <span className="review-line-label">Playing Role</span>
                <span className="review-line-val">{formData.playingRole || '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Batting Hand</span>
                <span className="review-line-val">{formData.battingHand || '—'}</span>
              </div>
              {/* Bowling details */}
              {(formData.playingRole === 'All Rounder (Batting)' || formData.playingRole === 'All Rounder (Bowling)' || formData.playingRole === 'Bowler') ? (
                <>
                  {formData.playingRole === 'Bowler' && (
                    <div className="review-line-item">
                      <span className="review-line-label">Bowler Category</span>
                      <span className="review-line-val">{formData.bowlerType || '—'}</span>
                    </div>
                  )}
                  {(formData.playingRole !== 'Bowler' || formData.bowlerType) && (
                    <div className="review-line-item">
                      <span className="review-line-label">Bowling Arm</span>
                      <span className="review-line-val">{formData.bowlingStyle || '—'}</span>
                    </div>
                  )}
                  {(formData.playingRole !== 'Bowler' || formData.bowlerType === 'Fast Bowler') && (
                    <div className="review-line-item">
                      <span className="review-line-label">Bowling Type</span>
                      <span className="review-line-val">{formData.bowlingSubtype || '—'}</span>
                    </div>
                  )}
                  {((formData.playingRole !== 'Bowler' && formData.bowlingSubtype === 'Spin Bowler') ||
                    (formData.playingRole === 'Bowler' && formData.bowlerType === 'Spin Bowler')) && (
                    <div className="review-line-item">
                      <span className="review-line-label">Spin Type</span>
                      <span className="review-line-val">{formData.spinType || '—'}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="review-line-item">
                  <span className="review-line-label">Bowling Style</span>
                  <span className="review-line-val">N/A (Batter / Wicketkeeper)</span>
                </div>
              )}
              <div className="review-line-item">
                <span className="review-line-label">Player Status</span>
                <span className="review-line-val">{formData.playerStatus || '—'}</span>
              </div>
              {(formData.playerStatus === 'Overseas (National)' || formData.playerStatus === 'Overseas (Domestic)') && (
                <div className="review-line-item">
                  <span className="review-line-label">Representing Country</span>
                  <span className="review-line-val">{formData.representingCountry || '—'}</span>
                </div>
              )}
              <div className="review-line-item">
                <span className="review-line-label">Total T20 Matches</span>
                <span className="review-line-val">{formData.totalMatches || '—'}</span>
              </div>
            </div>
          </div>

          {/* SELECTED CATEGORY & RELEGATION */}
          <div className="review-section-block">
            <span className="review-section-title-line">SELECTED CATEGORY & RELEGATION PREFERENCE</span>
            <div className="review-lines-wrap">
              <div className="review-line-item">
                <span className="review-line-label">Category</span>
                <span className="review-line-val">{formData.category || '—'}</span>
              </div>
              {!isSilver && !isEmerging && (
                <>
                  <div className="review-line-item">
                    <span className="review-line-label">Accepts Relegation</span>
                    <span className="review-line-val">
                      {formData.acceptRelegation === 'yes' ? 'Yes' :
                        formData.acceptRelegation === 'no' ? 'No' :
                          formData.acceptRelegation === 'emerging' ? 'Emerging (Does not Apply)' :
                            '—'}
                    </span>
                  </div>
                  <div className="review-line-item">
                    <span className="review-line-label">Lowest Acceptable Category</span>
                    <span className="review-line-val">
                      {formData.acceptRelegation === 'yes' ? (formData.relegationLimit || '—') : 'N/A'}
                    </span>
                  </div>
                </>
              )}
              {isPlatinum && (
                <div className="review-line-item">
                  <span className="review-line-label">Consider for Icon Nomination</span>
                  <span className="review-line-val">
                    {formData.considerIconPlayer === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* UPLOADED DOCUMENTS */}
          <div className="review-section-block">
            <span className="review-section-title-line">PLAYER PHOTO & UPLOADED DOCUMENTS</span>
            <div className="review-lines-wrap">
              <div className="review-line-item">
                <span className="review-line-label">Profile Photo</span>
                <span className="review-line-val">{formData.passportPhoto ? formData.passportPhoto.name : '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Passport Image</span>
                <span className="review-line-val">{formData.passportScan ? formData.passportScan.name : '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Action Shot</span>
                <span className="review-line-val">{formData.actionShot ? formData.actionShot.name : '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Right Profile Photo</span>
                <span className="review-line-val">{formData.rightProfilePhoto ? formData.rightProfilePhoto.name : '—'}</span>
              </div>
              <div className="review-line-item">
                <span className="review-line-label">Left Profile Photo</span>
                <span className="review-line-val">{formData.leftProfilePhoto ? formData.leftProfilePhoto.name : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consents */}
        <div className="review-consents-wrap">
          <div className="consent-checkbox-line">
            <input
              type="checkbox"
              id="consent-1"
              checked={consent1}
              onChange={(e) => setConsent1(e.target.checked)}
            />
            <label htmlFor="consent-1">I confirm that all submitted information is accurate.</label>
          </div>

          <div className="consent-checkbox-line">
            <input
              type="checkbox"
              id="consent-2"
              checked={consent2}
              onChange={(e) => setConsent2(e.target.checked)}
            />
            <label htmlFor="consent-2">I confirm that the player has authorized this registration.</label>
          </div>

          <div className="consent-checkbox-line">
            <input
              type="checkbox"
              id="consent-3"
              checked={consent3}
              onChange={(e) => setConsent3(e.target.checked)}
            />
            <label htmlFor="consent-3">I agree to the APL registration terms, verification process, and privacy policy.</label>
          </div>

          <div className="consent-checkbox-line">
            <input
              type="checkbox"
              id="consent-4"
              checked={consent4}
              onChange={(e) => setConsent4(e.target.checked)}
            />
            <label htmlFor="consent-4">By submitting this application, I confirm my commitment to being available during the time window I have selected on the form.</label>
          </div>
        </div>
        {errors.consents && (
          <p className="error-message" style={{ marginTop: '1rem', display: 'block' }}>{errors.consents}</p>
        )}
      </div>
    </div>
  )
}
