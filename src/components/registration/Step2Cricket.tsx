import { SearchableDropdown } from '../common/SearchableDropdown'
import type { FormData } from './types'

interface Step2CricketProps {
  formData: FormData
  errors: Record<string, string>
  apiPlayingRoles: string[]
  apiPlayerStatuses: string[]
  apiCountries: string[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSelectOption: <K extends keyof FormData>(fieldName: K, value: FormData[K], extraData?: Partial<FormData>) => void
}

export function Step2Cricket({
  formData,
  errors,
  apiPlayingRoles,
  apiPlayerStatuses,
  apiCountries,
  handleInputChange,
  handleSelectOption,
}: Step2CricketProps) {
  return (
    <div className="form-step-content animate-fade-in">
      {/* Playing Role */}
      <div className="form-section">
        <h3 className="section-title">Cricket Profile</h3>
        <p className="section-subtitle">Details about the player's playing style and history.</p>

        <label className="field-group-label">Playing Role <span className="required">*</span></label>
        <div className="playing-role-grid">
          {apiPlayingRoles.map((role) => (
            <div
              key={role}
              className={`type-card ${formData.playingRole === role ? 'selected' : ''} ${errors.playingRole ? 'input-error' : ''}`}
              onClick={() => handleSelectOption('playingRole', role)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectOption('playingRole', role)
                }
              }}
            >
              <span className="type-card-title">{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Batting Hand */}
      <div className="form-section">
        <label className="field-group-label">Batting Hand <span className="required">*</span></label>
        <div className="reg-type-cards">
          {['Right-Handed', 'Left-Handed'].map((hand) => (
            <div
              key={hand}
              className={`type-card ${formData.battingHand === hand ? 'selected' : ''}`}
              onClick={() => handleSelectOption('battingHand', hand)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectOption('battingHand', hand)
                }
              }}
            >
              <span className="type-card-title">{hand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Bowling Style */}
      {(formData.playingRole === 'All Rounder (Batting)' || formData.playingRole === 'All Rounder (Bowling)' || formData.playingRole === 'Bowler') && (
        <div className="form-section animate-fade-in" style={{ gap: '2.5rem', display: 'flex', flexDirection: 'column', marginTop: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Bowler Category (Only if playingRole is Bowler) */}
          {formData.playingRole === 'Bowler' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="field-group-label" style={{ margin: 0 }}>Bowler Category <span className="required">*</span></label>
              <div className="reg-type-cards">
                {['Fast Bowler', 'Spin Bowler'].map((category) => (
                  <div
                    key={category}
                    className={`type-card ${formData.bowlerType === category ? 'selected' : ''} ${errors.bowlerType ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('bowlerType', category)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('bowlerType', category)
                      }
                    }}
                  >
                    <span className="type-card-title">{category}</span>
                  </div>
                ))}
              </div>
              {errors.bowlerType && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlerType}</span>}
            </div>
          )}

          {/* Bowling Arm */}
          {(formData.playingRole !== 'Bowler' || formData.bowlerType) && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="field-group-label" style={{ margin: 0 }}>Bowling Arm <span className="required">*</span></label>
              <div className="reg-type-cards">
                {['Right-Arm Bowler', 'Left-Arm Bowler'].map((arm) => (
                  <div
                    key={arm}
                    className={`type-card ${formData.bowlingStyle === arm ? 'selected' : ''} ${errors.bowlingStyle ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('bowlingStyle', arm)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('bowlingStyle', arm)
                      }
                    }}
                  >
                    <span className="type-card-title">{arm}</span>
                  </div>
                ))}
              </div>
              {errors.bowlingStyle && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlingStyle}</span>}
            </div>
          )}

          {/* Bowling Type (For All-Rounders, or for Bowler who selected Fast Bowler) */}
          {formData.bowlingStyle && 
           (formData.playingRole !== 'Bowler' || formData.bowlerType === 'Fast Bowler') && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="field-group-label" style={{ margin: 0 }}>Bowling Type <span className="required">*</span></label>
              <div className="relegation-cards-grid">
                {(formData.playingRole === 'Bowler' 
                  ? ['Fast Bowler', 'Medium Fast Bowler'] 
                  : ['Fast Bowler', 'Medium Fast Bowler', 'Spin Bowler']
                ).map((type) => (
                  <div
                    key={type}
                    className={`type-card ${formData.bowlingSubtype === type ? 'selected' : ''} ${errors.bowlingSubtype ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('bowlingSubtype', type)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('bowlingSubtype', type)
                      }
                    }}
                  >
                    <span className="type-card-title">{type}</span>
                  </div>
                ))}
              </div>
              {errors.bowlingSubtype && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.bowlingSubtype}</span>}
            </div>
          )}

          {/* Spin Type (For All-Rounders who selected Spin Bowler, or for Bowler who selected Spin Bowler) */}
          {formData.bowlingStyle && 
           ((formData.playingRole !== 'Bowler' && formData.bowlingSubtype === 'Spin Bowler') || 
            (formData.playingRole === 'Bowler' && formData.bowlerType === 'Spin Bowler')) && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="field-group-label" style={{ margin: 0 }}>Spin Type <span className="required">*</span></label>
              <div className="player-status-grid">
                {['Off Spinner', 'Leg Spinner', 'Left-arm Orthodox', 'Left-arm Unorthodox (Chinaman)'].map((spin) => (
                  <div
                    key={spin}
                    className={`type-card ${formData.spinType === spin ? 'selected' : ''} ${errors.spinType ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('spinType', spin)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('spinType', spin)
                      }
                    }}
                  >
                    <span className="type-card-title">{spin}</span>
                  </div>
                ))}
              </div>
              {errors.spinType && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.spinType}</span>}
            </div>
          )}
        </div>
      )}

      {/* Previous Major Teams */}
      <div className="form-section">
        <div className="form-group">
          <label>Previous Major Teams</label>
          <input
            type="text"
            name="prevTeams"
            value={formData.prevTeams}
            onChange={handleInputChange}
            placeholder="e.g. Afghanistan National Team, Sunrisers Leeds"
          />
        </div>
      </div>

      {/* Player Status */}
      <div className="form-section">
        <label className="field-group-label">Player Status <span className="required">*</span></label>
        <div className="player-status-grid">
          {apiPlayerStatuses.map((status) => (
            <div
              key={status}
              className={`type-card ${formData.playerStatus === status ? 'selected' : ''}`}
              onClick={() => handleSelectOption('playerStatus', status)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectOption('playerStatus', status)
                }
              }}
            >
              <span className="type-card-title">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Player Status Country Select */}
      {(formData.playerStatus === 'Overseas (National)' || formData.playerStatus === 'Overseas (Domestic)') && (
        <div className="form-section animate-fade-in">
          <div className="form-group">
            <label>Representing Country <span className="required">*</span></label>
            <SearchableDropdown
              value={formData.representingCountry}
              onChange={(val) => handleSelectOption('representingCountry', val)}
              options={apiCountries}
              placeholder="Search & select country..."
              error={errors.representingCountry}
              required
            />
            {errors.representingCountry && <span className="error-message">{errors.representingCountry}</span>}
          </div>
        </div>
      )}

      {/* Total T20 Matches & Profile Link */}
      <div className="form-section">
        <div className="form-grid-2col">
          <div className="form-group">
            <label>Total T20 Matches</label>
            <input
              type="number"
              name="totalMatches"
              value={formData.totalMatches}
              onChange={handleInputChange}
              placeholder="e.g. 120"
              className={errors.totalMatches ? 'input-error' : ''}
            />
            {errors.totalMatches && <span className="error-message">{errors.totalMatches}</span>}
          </div>

          <div className="form-group">
            <label>ESPNcricinfo or Cricbuzz Profile Link <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
            <input
              type="url"
              name="profileLink"
              value={formData.profileLink}
              onChange={handleInputChange}
              placeholder="https://..."
              className={errors.profileLink ? 'input-error' : ''}
            />
            {errors.profileLink && <span className="error-message">{errors.profileLink}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
