import './GetInvolvedSection.css'

export function GetInvolvedSection() {
  return (
    <section className="get-involved-section">
      <div className="get-involved-inner">
        <div className="get-involved-content-block">
          <h2 className="section-heading">Own a Piece of the <span>Game</span></h2>
          
          <p className="section-description">
            Sponsorship and media-rights opportunities are open for the upcoming season. Let's build Afghanistan's cricketing future together.
          </p>

          <div className="get-involved-buttons-row">
            <span className="btn-gi-option">SPONSORSHIP</span>
            <span className="btn-gi-option">MEDIA RIGHTS</span>
            <a href="#contact-us" className="btn-enquire-now">
              <span className="btn-enquire-now-text">ENQUIRE NOW</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
