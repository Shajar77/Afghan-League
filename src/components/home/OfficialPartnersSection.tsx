import acbLogo from '../../assets/ACBlogo.webp'

export function OfficialPartnersSection() {
  return (
    <section className="partners-section">
      <h2 className="section-heading partners-heading">Official <span>Partners</span></h2>
      <div className="acb-bottom-logo-container" style={{ borderTop: 'none', paddingTop: 0 }}>
        <img src={acbLogo} alt="ACB Logo – Official Partner" className="acb-bottom-logo" loading="lazy" decoding="async" width="120" height="60" />
      </div>
    </section>
  )
}
