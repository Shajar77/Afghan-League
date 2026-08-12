import fomImg1 from '../../assets/2166774277.webp'
import fomImg2 from '../../assets/AD1_2727_zQkE8coH_20230809060237-1610761.webp'
import fomImg3 from '../../assets/SunRisers-Leeds-fans-at-Headingley.webp'
import fomImg4 from '../../assets/GettyImages-2230120408.webp'
import fomImg5 from '../../assets/AD1_0256-2130422.webp'
import fomImg6 from '../../assets/GettyImages-1335413950.webp'
import fomImg7 from '../../assets/GettyImages-2163231267.webp'

export function MoreAboutSection() {
  return (
    <section className="find-out-more-section">
      <h2 className="section-heading">More about <span>APL</span></h2>
      <p className="section-description">Dive deeper into the tournament structure, regulations, and historical records.</p>
      <div className="fom-grid">
        <div className="fom-card fom-card-r1-c1">
          <img src={fomImg1} alt="What is the APL?" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">WHAT IS THE APL?</h3>
        </div>
        <div className="fom-card fom-card-r1-c2">
          <img src={fomImg2} alt="The APL rules explained" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">THE APL RULES EXPLAINED</h3>
        </div>
        <div className="fom-card fom-card-r2-c1">
          <img src={fomImg3} alt="How to buy tickets for the APL" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">HOW TO BUY TICKETS FOR THE APL?</h3>
        </div>
        <div className="fom-card fom-card-r2-c2">
          <img src={fomImg4} alt="Who will play in the APL in 2026" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">WHO WILL PLAY IN THE APL IN 2026?</h3>
        </div>
        <div className="fom-card fom-card-r3-c1">
          <img src={fomImg5} alt="Past winners of APL" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">PAST WINNERS OF APL</h3>
        </div>
        <div className="fom-card fom-card-r3-c2">
          <img src={fomImg6} alt="When is the APL final" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">WHEN IS THE APL FINAL?</h3>
        </div>
        <div className="fom-card fom-card-r3-c3">
          <img src={fomImg7} alt="What is the APL Eliminator" className="fom-card-bg-img" loading="lazy" />
          <div className="fom-card-img-overlay"></div>
          <h3 className="fom-card-title">WHAT IS THE APL ELIMINATOR?</h3>
        </div>
      </div>
    </section>
  )
}
