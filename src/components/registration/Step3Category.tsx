import type { FormData, ApiCategory } from './types'

interface Step3CategoryProps {
  formData: FormData
  errors: Record<string, string>
  apiCategories: ApiCategory[]
  handleSelectOption: <K extends keyof FormData>(fieldName: K, value: FormData[K], extraData?: Partial<FormData>) => void
}

export function Step3Category({
  formData,
  errors,
  apiCategories,
  handleSelectOption,
}: Step3CategoryProps) {
  const catKey = (formData.category || '').toLowerCase()
  const isPlatinum = catKey.includes('platinum')
  const isDiamond = catKey.includes('diamond')
  const isEmerging = catKey.includes('emerging')
  const isSilver = catKey.includes('silver')

  return (
    <div className="form-step-content animate-fade-in">
      <div className="form-section">
        <h3 className="section-title">Select Player Category</h3>
        <p className="section-subtitle">Choose the category you are registering for. *</p>

        <div className="categories-grid-cards">
          {apiCategories.map((cat) => (
            <div
              key={cat.id}
              className={`category-large-card ${formData.category === cat.id ? 'selected' : ''}`}
              onClick={() => handleSelectOption('category', cat.id, { basePrice: cat.price, considerIconPlayer: '' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectOption('category', cat.id, { basePrice: cat.price, considerIconPlayer: '' })
                }
              }}
            >
              <div className="cat-card-left">
                <h4 className="cat-card-title">{cat.label}</h4>
                <p className="cat-card-desc">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {isPlatinum && (
          <div className="form-section animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3 className="section-title">Would you like to be considered for the Icon Player nomination? <span className="required">*</span></h3>
            
            <div className="relegation-cards-grid">
              <div
                className={`type-card ${formData.considerIconPlayer === 'yes' ? 'selected' : ''} ${errors.considerIconPlayer ? 'input-error' : ''}`}
                onClick={() => handleSelectOption('considerIconPlayer', 'yes')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectOption('considerIconPlayer', 'yes')
                  }
                }}
              >
                <span className="type-card-title">Yes</span>
              </div>
              <div
                className={`type-card ${formData.considerIconPlayer === 'no' ? 'selected' : ''} ${errors.considerIconPlayer ? 'input-error' : ''}`}
                onClick={() => handleSelectOption('considerIconPlayer', 'no')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectOption('considerIconPlayer', 'no')
                  }
                }}
              >
                <span className="type-card-title">No</span>
              </div>
            </div>
            {errors.considerIconPlayer && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.considerIconPlayer}</span>}
          </div>
        )}
      </div>

      {/* Relegation Consent (Only for Platinum, Diamond, Gold) */}
      {formData.category && !isEmerging && !isSilver && (
        <>
          <div className="form-section">
            <h3 className="section-title">Accept Relegation <span className="required">*</span></h3>
            <p className="section-subtitle">If you are not selected in your preferred category, do you accept being considered for lower categories?</p>

            <div className="relegation-cards-grid">
              <div
                className={`type-card ${formData.acceptRelegation === 'yes' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                onClick={() => {
                  if (formData.acceptRelegation !== 'yes') {
                    const autoLimit = isPlatinum ? 'Diamond' : isDiamond ? 'Gold' : 'Silver'
                    handleSelectOption('acceptRelegation', 'yes', { relegationLimit: autoLimit })
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (formData.acceptRelegation !== 'yes') {
                      const autoLimit = isPlatinum ? 'Diamond' : isDiamond ? 'Gold' : 'Silver'
                      handleSelectOption('acceptRelegation', 'yes', { relegationLimit: autoLimit })
                    }
                  }
                }}
              >
                <span className="type-card-title">Yes</span>
              </div>
              <div
                className={`type-card ${formData.acceptRelegation === 'no' ? 'selected' : ''} ${errors.acceptRelegation ? 'input-error' : ''}`}
                onClick={() => {
                  handleSelectOption('acceptRelegation', 'no', { relegationLimit: '' })
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectOption('acceptRelegation', 'no', { relegationLimit: '' })
                  }
                }}
              >
                <span className="type-card-title">No</span>
              </div>
            </div>
            {errors.acceptRelegation && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.acceptRelegation}</span>}
          </div>

          {formData.acceptRelegation === 'yes' && (
            <div className="form-section animate-fade-in">
              <h3 className="section-title">Relegation accepted till: <span className="required">*</span></h3>
              <p className="section-subtitle">Select the lowest category you accept being relegated to.</p>

              <div className="relegation-cards-grid">
                {isPlatinum && (
                  <div
                    className={`type-card ${formData.relegationLimit === 'Diamond' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('relegationLimit', 'Diamond')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('relegationLimit', 'Diamond')
                      }
                    }}
                  >
                    <span className="type-card-title">Diamond</span>
                  </div>
                )}
                {(isPlatinum || isDiamond) && (
                  <div
                    className={`type-card ${formData.relegationLimit === 'Gold' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                    onClick={() => handleSelectOption('relegationLimit', 'Gold')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectOption('relegationLimit', 'Gold')
                      }
                    }}
                  >
                    <span className="type-card-title">Gold</span>
                  </div>
                )}
                <div
                  className={`type-card ${formData.relegationLimit === 'Silver' ? 'selected' : ''} ${errors.relegationLimit ? 'input-error' : ''}`}
                  onClick={() => handleSelectOption('relegationLimit', 'Silver')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectOption('relegationLimit', 'Silver')
                    }
                  }}
                >
                  <span className="type-card-title">Silver</span>
                </div>
              </div>
              {errors.relegationLimit && <span className="error-message" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.relegationLimit}</span>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
