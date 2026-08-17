import { Calendar } from 'lucide-react'
import { SearchableDropdown } from '../common/SearchableDropdown'
import type { FormData, ApiAvailability } from './types'

interface Step1PersonalProps {
  formData: FormData
  errors: Record<string, string>
  apiCountries: string[]
  apiAvailabilities: ApiAvailability[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSelectOption: <K extends keyof FormData>(fieldName: K, value: FormData[K], extraData?: Partial<FormData>) => void
  handleToggleAvailability: (value: string) => void
}

export function Step1Personal({
  formData,
  errors,
  apiCountries,
  apiAvailabilities,
  handleInputChange,
  handleSelectOption,
  handleToggleAvailability,
}: Step1PersonalProps) {
  return (
    <div className="form-step-content animate-fade-in">
      {/* Registration Type */}
      <div className="form-section">
        <h3 className="section-title">Registration Type</h3>
        <p className="section-subtitle">Select whether you are registering as a player or on behalf of a player.</p>

        <div className="reg-type-cards">
          <div
            className={`type-card ${formData.regType === 'player' ? 'selected' : ''}`}
            onClick={() => handleSelectOption('regType', 'player')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelectOption('regType', 'player')
              }
            }}
          >
            <span className="type-card-title">I am a Player registering myself</span>
          </div>

          <div
            className={`type-card ${formData.regType === 'agent' ? 'selected' : ''}`}
            onClick={() => handleSelectOption('regType', 'agent')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelectOption('regType', 'agent')
              }
            }}
          >
            <span className="type-card-title">I am an Agent / Authorized Representative</span>
          </div>
        </div>
      </div>

      {formData.regType === 'agent' && (
        <div className="form-section">
          <h3 className="section-title">Agent Details</h3>
          <p className="section-subtitle">Information about the player's representative.</p>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>Agent Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                className={errors.agentName ? 'input-error' : ''}
                required
              />
              {errors.agentName && <span className="error-message">{errors.agentName}</span>}
            </div>

            <div className="form-group">
              <label>Agency / Company Name</label>
              <input
                type="text"
                name="agentAgency"
                value={formData.agentAgency}
                onChange={handleInputChange}
                placeholder="e.g. Apex Sports Management"
              />
            </div>

            <div className="form-group">
              <label>Agent Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                placeholder="e.g. +93 70 987 6543"
                className={errors.agentPhone ? 'input-error' : ''}
                required
              />
              {errors.agentPhone && <span className="error-message">{errors.agentPhone}</span>}
            </div>

            <div className="form-group">
              <label>Agent Email Address <span className="required">*</span></label>
              <input
                type="email"
                name="agentEmail"
                value={formData.agentEmail}
                onChange={handleInputChange}
                placeholder="e.g. agent@agency.com"
                className={errors.agentEmail ? 'input-error' : ''}
                required
              />
              {errors.agentEmail && <span className="error-message">{errors.agentEmail}</span>}
            </div>
          </div>

          <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '1rem 0 0 0', fontStyle: 'italic' }}>
            Agent details may be reused, but complete player information and documents must be submitted separately for every player.
          </p>
        </div>
      )}

      {/* Player Information */}
      <div className="form-section">
        <h3 className="section-title">Player Information</h3>
        <p className="section-subtitle">Tell us about the player being registered.</p>

        <div className="form-grid-2col">
          <div className="form-group">
            <label>Full Legal Name <span className="required">*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Rashid Khan"
              className={errors.fullName ? 'input-error' : ''}
              required
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Date of Birth <span className="required">*</span></label>
            <div className="date-input-wrapper">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={errors.dob ? 'input-error' : ''}
                required
              />
              <Calendar size={18} className="calendar-icon" />
            </div>
            {errors.dob && <span className="error-message">{errors.dob}</span>}
          </div>

          <div className="form-group">
            <label>Nationality <span className="required">*</span></label>
            <SearchableDropdown
              value={formData.nationality}
              onChange={(val) => handleSelectOption('nationality', val)}
              options={apiCountries}
              placeholder="Search & select country..."
              error={errors.nationality}
              required
            />
            {errors.nationality && <span className="error-message">{errors.nationality}</span>}
          </div>

          <div className="form-group">
            <label>Passport Number <span className="required">*</span></label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              placeholder="e.g. O1838204A"
              className={errors.passportNumber ? 'input-error' : ''}
              required
            />
            {errors.passportNumber && <span className="error-message">{errors.passportNumber}</span>}
          </div>

          <div className="form-group">
            <label>Country of Residence <span className="required">*</span></label>
            <SearchableDropdown
              value={formData.countryResidence}
              onChange={(val) => handleSelectOption('countryResidence', val)}
              options={apiCountries}
              placeholder="Search & select country..."
              error={errors.countryResidence}
              required
            />
            {errors.countryResidence && <span className="error-message">{errors.countryResidence}</span>}
          </div>

          <div className="form-group">
            <label>City <span className="required">*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Kabul"
              className={errors.city ? 'input-error' : ''}
              required
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Phone / WhatsApp Number <span className="required">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. +93 70 123 4567"
              className={errors.phone ? 'input-error' : ''}
              required
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Email Address <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. player@domain.com"
              className={errors.email ? 'input-error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>
      </div>

      {/* Player Availability */}
      <div className="form-section">
        <h3 className="section-title">Player Availability <span className="required">*</span></h3>

        <div className={`availability-grid ${errors.availability ? 'dropzone-error' : ''}`}>
          {apiAvailabilities.map(({ key, label }) => (
            <div
              key={key}
              className={`avail-card ${(Array.isArray(formData.availability) ? formData.availability.includes(key) : formData.availability === key) ? 'selected' : ''}`}
              onClick={() => handleToggleAvailability(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggleAvailability(key)
                }
              }}
            >
              <span className="avail-card-title">{label}</span>
            </div>
          ))}
        </div>
        {errors.availability && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.availability}</span>}

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Availability Details</label>
          <textarea
            name="availabilityDetails"
            value={formData.availabilityDetails}
            onChange={handleInputChange}
            placeholder="Mention unavailable dates or existing commitments."
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
