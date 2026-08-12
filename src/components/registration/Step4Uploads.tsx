import frontProfileRef from '../../assets/Front Profile.jpg.jpeg'
import idRef from '../../assets/ID.jpg.jpeg'
import actionShotRef from '../../assets/Action.jpg.jpeg'
import rightProfileRef from '../../assets/Right Profile.jpg.jpeg'
import leftRef from '../../assets/Left.jpg.jpeg'
import type { FormData, FileMeta } from './types'

interface Step4UploadsProps {
  formData: FormData
  errors: Record<string, string>
  fileMeta: Record<string, FileMeta>
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto') => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passportPhoto' | 'passportScan' | 'actionShot' | 'rightProfilePhoto' | 'leftProfilePhoto') => void
}

export function Step4Uploads({
  formData,
  errors,
  fileMeta,
  handleDragOver,
  handleDrop,
  handleFileChange,
}: Step4UploadsProps) {
  return (
    <div className="form-step-content animate-fade-in">
      <div className="form-section">
        <h3 className="section-title">Uploads</h3>
        <p className="section-subtitle">Accepted formats: JPG or PNG for images, plus PDF for documents. Max 5 MB per file.</p>

        {/* Player Profile Photo */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Player Profile Photo <span className="required">*</span></label>
          <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            Upload a recent, clear, front-facing portrait photograph.
          </p>

          <div className="upload-row-layout">
            <div className="upload-dropzone-container">
              <div
                className={`upload-dropzone ${formData.passportPhoto ? 'has-file' : ''} ${(!formData.passportPhoto && fileMeta.passportPhoto) ? 'has-file-warning' : ''} ${errors.passportPhoto ? 'dropzone-error' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'passportPhoto')}
                onClick={() => document.getElementById('passportPhotoInput')?.click()}
                style={{ height: '100%' }}
              >
                <input
                  type="file"
                  id="passportPhotoInput"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'passportPhoto')}
                  style={{ display: 'none' }}
                />
                <div className="dropzone-inner">
                  <span className="dropzone-title">
                    {formData.passportPhoto ? `Selected: ${formData.passportPhoto.name}` :
                     fileMeta.passportPhoto ? `Restored: ${fileMeta.passportPhoto.name} (⚠️ Re-upload required)` :
                     'Click or drag a photo here'}
                  </span>
                  <span className="dropzone-subtitle">
                    {formData.passportPhoto ? 'Click to change photo' :
                     fileMeta.passportPhoto ? 'File must be re-selected' :
                     'JPG or PNG, up to 5 MB'}
                  </span>
                </div>
              </div>
            </div>
            <div className="upload-reference-container">
              <img src={frontProfileRef} alt="Player Profile Photo Reference" className="upload-reference-img" />
            </div>
          </div>
          {errors.passportPhoto && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.passportPhoto}</span>}
        </div>

        {/* Passport Copy */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Passport Image<span className="required">*</span></label>

          <div className="upload-row-layout">
            <div className="upload-dropzone-container">
              <div
                className={`upload-dropzone ${formData.passportScan ? 'has-file' : ''} ${(!formData.passportScan && fileMeta.passportScan) ? 'has-file-warning' : ''} ${errors.passportScan ? 'dropzone-error' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'passportScan')}
                onClick={() => document.getElementById('passportScanInput')?.click()}
                style={{ height: '100%' }}
              >
                <input
                  type="file"
                  id="passportScanInput"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'passportScan')}
                  style={{ display: 'none' }}
                />
                <div className="dropzone-inner">
                  <span className="dropzone-title">
                    {formData.passportScan ? `Selected: ${formData.passportScan.name}` :
                     fileMeta.passportScan ? `Restored: ${fileMeta.passportScan.name} (⚠️ Re-upload required)` :
                     'Click or drag a file here'}
                  </span>
                  <span className="dropzone-subtitle">
                    {formData.passportScan ? 'Click to change file' :
                     fileMeta.passportScan ? 'File must be re-selected' :
                     'JPG, PNG, or PDF, up to 5 MB'}
                  </span>
                </div>
              </div>
            </div>
            <div className="upload-reference-container">
              <img src={idRef} alt="Passport Document Reference" className="upload-reference-img" />
            </div>
          </div>
          {errors.passportScan && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.passportScan}</span>}
        </div>

        {/* Action Shot */}
        <div className="form-group">
          <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Action Shot <span className="required">*</span></label>
          <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            Upload a high-quality action photograph of you playing cricket.
          </p>

          <div className="upload-row-layout">
            <div className="upload-dropzone-container">
              <div
                className={`upload-dropzone ${formData.actionShot ? 'has-file' : ''} ${(!formData.actionShot && fileMeta.actionShot) ? 'has-file-warning' : ''} ${errors.actionShot ? 'dropzone-error' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'actionShot')}
                onClick={() => document.getElementById('actionShotInput')?.click()}
                style={{ height: '100%' }}
              >
                <input
                  type="file"
                  id="actionShotInput"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'actionShot')}
                  style={{ display: 'none' }}
                />
                <div className="dropzone-inner">
                  <span className="dropzone-title">
                    {formData.actionShot ? `Selected: ${formData.actionShot.name}` :
                     fileMeta.actionShot ? `Restored: ${fileMeta.actionShot.name} (⚠️ Re-upload required)` :
                     'Click or drag a photo here'}
                  </span>
                  <span className="dropzone-subtitle">
                    {formData.actionShot ? 'Click to change photo' :
                     fileMeta.actionShot ? 'File must be re-selected' :
                     'JPG or PNG, up to 5 MB'}
                  </span>
                </div>
              </div>
            </div>
            <div className="upload-reference-container">
              <img src={actionShotRef} alt="Action Shot Reference" className="upload-reference-img" />
            </div>
          </div>
          {errors.actionShot && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.actionShot}</span>}
        </div>

        {/* Right Profile Image */}
        <div className="form-group" style={{ marginTop: '2rem' }}>
          <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Right Profile Image <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
          <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            Upload a right-side profile photograph of yourself.
          </p>

          <div className="upload-row-layout">
            <div className="upload-dropzone-container">
              <div
                className={`upload-dropzone ${formData.rightProfilePhoto ? 'has-file' : ''} ${(!formData.rightProfilePhoto && fileMeta.rightProfilePhoto) ? 'has-file-warning' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'rightProfilePhoto')}
                onClick={() => document.getElementById('rightProfilePhotoInput')?.click()}
                style={{ height: '100%' }}
              >
                <input
                  type="file"
                  id="rightProfilePhotoInput"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'rightProfilePhoto')}
                  style={{ display: 'none' }}
                />
                <div className="dropzone-inner">
                  <span className="dropzone-title">
                    {formData.rightProfilePhoto ? `Selected: ${formData.rightProfilePhoto.name}` :
                     fileMeta.rightProfilePhoto ? `Restored: ${fileMeta.rightProfilePhoto.name} (⚠️ Re-upload optional)` :
                     'Click or drag a photo here'}
                  </span>
                  <span className="dropzone-subtitle">
                    {formData.rightProfilePhoto ? 'Click to change photo' :
                     fileMeta.rightProfilePhoto ? 'File must be re-selected' :
                     'JPG or PNG, up to 5 MB'}
                  </span>
                </div>
              </div>
            </div>
            <div className="upload-reference-container">
              <img src={rightProfileRef} alt="Right Profile Photo Reference" className="upload-reference-img" />
            </div>
          </div>
        </div>

        {/* Left Profile Image */}
        <div className="form-group" style={{ marginTop: '2rem' }}>
          <label className="field-group-label" style={{ marginBottom: '0.2rem' }}>Left Profile Image <span className="optional-text" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
          <p className="field-group-desc" style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            Upload a left-side profile photograph of yourself.
          </p>

          <div className="upload-row-layout">
            <div className="upload-dropzone-container">
              <div
                className={`upload-dropzone ${formData.leftProfilePhoto ? 'has-file' : ''} ${(!formData.leftProfilePhoto && fileMeta.leftProfilePhoto) ? 'has-file-warning' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'leftProfilePhoto')}
                onClick={() => document.getElementById('leftProfilePhotoInput')?.click()}
                style={{ height: '100%' }}
              >
                <input
                  type="file"
                  id="leftProfilePhotoInput"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'leftProfilePhoto')}
                  style={{ display: 'none' }}
                />
                <div className="dropzone-inner">
                  <span className="dropzone-title">
                    {formData.leftProfilePhoto ? `Selected: ${formData.leftProfilePhoto.name}` :
                     fileMeta.leftProfilePhoto ? `Restored: ${fileMeta.leftProfilePhoto.name} (⚠️ Re-upload optional)` :
                     'Click or drag a photo here'}
                  </span>
                  <span className="dropzone-subtitle">
                    {formData.leftProfilePhoto ? 'Click to change photo' :
                     fileMeta.leftProfilePhoto ? 'File must be re-selected' :
                     'JPG or PNG, up to 5 MB'}
                  </span>
                </div>
              </div>
            </div>
            <div className="upload-reference-container">
              <img src={leftRef} alt="Left Profile Photo Reference" className="upload-reference-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
