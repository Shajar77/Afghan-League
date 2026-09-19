import './PrivacyPolicyPage.css'

export function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">

      {/* Hero Section — News & Media style */}
      <section className="privacy-hero">
        <div className="privacy-hero-grid-bg" />
        <div className="privacy-hero-glow-left" />
        <div className="privacy-hero-glow-right" />

        <div className="privacy-hero-inner">
          {/* Left: title + subtitle */}
          <div className="privacy-hero-left">
            <div className="privacy-hero-heading-wrap">
              <h1 className="privacy-hero-title">
                PRIVACY <span className="privacy-hero-title-gold">POLICY</span>
              </h1>
              <div className="privacy-hero-underline" />
            </div>

            <p className="privacy-hero-subtitle">
              How APL and ACB collect, use, store and protect personal
              information submitted through the player registration process.
            </p>
          </div>
        </div>

        <div className="privacy-hero-bottom-bar" />
      </section>

      {/* Content Body */}
      <section className="privacy-body">
        <div className="privacy-container">


          {/* Main content */}
          <div className="privacy-main">

            {/* 1. Introduction */}
            <div id="pp-intro" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">01</span>
                <h2 className="privacy-section-title">Introduction</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                The Afghanistan Premier League (<strong>"APL"</strong>, <strong>"we"</strong>, <strong>"us"</strong> or <strong>"our"</strong>), operated under the Afghanistan Cricket Board (<strong>"ACB"</strong>), respects the privacy of players and other individuals who use the APL player registration system.
              </p>
              <p>
                This Privacy Policy explains how APL and ACB may collect, use, store, verify, disclose and protect personal information submitted through the APL player registration process. The purpose of this Privacy Policy is to explain clearly how player information is handled while allowing APL and ACB to properly administer player registration, verification, eligibility, tournament operations, communications and related cricket activities.
              </p>
              <p>
                APL recognizes that some registration information is intended for official verification only and will not be shared publicly. By submitting a player registration, the player (or their authorized parent/guardian, if under 18 years) agrees to the collection and use of information as described in this Privacy Policy.
              </p>
              <p>
                This Privacy Policy applies only to information collected through the official APL player registration system and does not apply to any other websites, platforms, or data collection activities outside the APL registration process.
              </p>
            </div>

            {/* 2. Data Collected */}
            <div id="pp-data-collected" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">02</span>
                <h2 className="privacy-section-title">Information We Collect</h2>
              </div>
              <div className="privacy-divider" />
              <p>As part of the APL player registration process, APL and ACB may collect the following categories of personal information:</p>

              <div className="privacy-card-grid">
                <div className="privacy-card">
                  <h3 className="privacy-card-title">Identity Information</h3>
                  <ul>
                    <li>Full legal name</li>
                    <li>Date of birth</li>
                    <li>Nationality and country of birth</li>
                    <li>Passport / national ID / Tazkira details</li>
                    <li>Player photograph</li>
                  </ul>
                </div>
                <div className="privacy-card">
                  <h3 className="privacy-card-title">Contact Information</h3>
                  <ul>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>Current residential address</li>
                    <li>City, province and country of residence</li>
                  </ul>
                </div>
                <div className="privacy-card">
                  <h3 className="privacy-card-title">Cricket Profile</h3>
                  <ul>
                    <li>Playing role (batsman, bowler, all-rounder, wicket-keeper)</li>
                    <li>Batting and bowling style</li>
                    <li>Preferred franchise(s)</li>
                    <li>Local and regional cricket experience</li>
                    <li>Match statistics and performance data</li>
                  </ul>
                </div>
                <div className="privacy-card">
                  <h3 className="privacy-card-title">Supporting Documents</h3>
                  <ul>
                    <li>Scanned copies of identification documents</li>
                    <li>Proof of age (where required)</li>
                    <li>Other verification documents as required</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-notice">
                <span className="privacy-notice-icon">ℹ</span>
                <p>Sensitive personal data (such as medical information or biometric data) will only be collected where it is specifically required for eligibility verification, insurance, or health and safety purposes, and only with your explicit consent.</p>
              </div>
            </div>

            {/* 3. How We Use It */}
            <div id="pp-how-used" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">03</span>
                <h2 className="privacy-section-title">How We Use Your Information</h2>
              </div>
              <div className="privacy-divider" />
              <p>APL and ACB use the information collected through the player registration process for the following purposes:</p>
              <ol className="privacy-ol">
                <li><strong>Player Registration and Verification:</strong> To process, verify and manage player registrations, confirm eligibility criteria, and maintain the official APL player database.</li>
                <li><strong>Tournament Administration:</strong> To organize matches, schedule fixtures, manage drafts, and administer all operational aspects of APL tournament proceedings.</li>
                <li><strong>Franchise Communication:</strong> To share eligible player profiles and relevant registration data with APL franchise owners and team management for draft selection and team formation purposes.</li>
                <li><strong>Eligibility Compliance:</strong> To verify that players meet APL and ACB eligibility requirements including age limits, nationality criteria, and registration deadlines.</li>
                <li><strong>Anti-Corruption and Integrity Measures:</strong> To support APL and ACB anti-corruption efforts by verifying player identities and monitoring for any activities that may breach APL or ICC integrity codes.</li>
                <li><strong>Communications:</strong> To send players official communications regarding their registration status, draft results, tournament schedules, training camps, and any other official APL or ACB activities.</li>
                <li><strong>Public Player Profiles:</strong> With the player's explicit consent, to publish selected non-sensitive information (such as name, playing role, photograph, and cricket statistics) on the official APL website or in official tournament publications.</li>
                <li><strong>Statistical Analysis:</strong> To compile and analyze cricket performance statistics for tournament reporting and broadcasting purposes.</li>
                <li><strong>Legal and Regulatory Compliance:</strong> To comply with applicable laws and regulations, resolve disputes, and enforce APL terms and conditions.</li>
              </ol>
            </div>

            {/* 4. Legal Basis */}
            <div id="pp-legal-basis" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">04</span>
                <h2 className="privacy-section-title">Legal Basis for Processing</h2>
              </div>
              <div className="privacy-divider" />
              <p>Where applicable privacy laws require a legal basis for processing personal data, APL and ACB rely on the following grounds:</p>
              <div className="privacy-table-wrap">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      <th>Processing Purpose</th>
                      <th>Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Player registration and verification</td>
                      <td>Performance of a contract / Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Tournament administration</td>
                      <td>Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Sharing with franchises for draft</td>
                      <td>Legitimate interests / Consent</td>
                    </tr>
                    <tr>
                      <td>Publishing public player profiles</td>
                      <td>Explicit consent</td>
                    </tr>
                    <tr>
                      <td>Anti-corruption compliance</td>
                      <td>Legal obligation / Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Communications</td>
                      <td>Legitimate interests / Consent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Sharing */}
            <div id="pp-sharing" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">05</span>
                <h2 className="privacy-section-title">Sharing of Information</h2>
              </div>
              <div className="privacy-divider" />
              <p>APL and ACB may share player registration information with the following categories of recipients:</p>
              <ul className="privacy-ul">
                <li><strong>APL Franchise Owners and Team Management:</strong> For the purpose of player selection during the draft process and team administration.</li>
                <li><strong>ACB Officials:</strong> For eligibility verification, anti-corruption monitoring, and regulatory compliance.</li>
                <li><strong>ICC and Other Governing Bodies:</strong> Where required for eligibility clearances, anti-corruption reporting, or compliance with international cricket regulations.</li>
                <li><strong>Authorized Third-Party Service Providers:</strong> Including IT service providers, data hosting companies, and other vendors who assist APL and ACB in operating the registration system, provided such parties are bound by appropriate confidentiality and data protection obligations.</li>
                <li><strong>Broadcasting and Media Partners:</strong> Limited non-sensitive player information (such as name, photograph, and playing statistics) may be shared with official APL broadcasting and media partners for tournament coverage purposes, with player consent.</li>
                <li><strong>Legal and Regulatory Authorities:</strong> Where required by applicable law, court order, or regulatory requirement.</li>
              </ul>
              <div className="privacy-notice">
                <span className="privacy-notice-icon">🔒</span>
                <p>APL and ACB do not sell player personal information to any third party. Player identification documents and sensitive personal data will not be shared publicly and will only be used for official verification purposes.</p>
              </div>
            </div>

            {/* 6. International Transfers */}
            <div id="pp-international" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">06</span>
                <h2 className="privacy-section-title">International Data Transfers</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                Given the international nature of APL cricket operations, player registration data may be stored on servers or processed in countries outside Afghanistan. Where such international transfers occur, APL and ACB will take appropriate steps to ensure that player data is protected in accordance with applicable data protection standards, including implementing appropriate data transfer mechanisms or contractual safeguards.
              </p>
              <p>
                Players registering from outside Afghanistan should be aware that their data will be transferred to and processed in Afghanistan and potentially other jurisdictions where APL operational partners are located.
              </p>
            </div>

            {/* 7. Retention */}
            <div id="pp-retention" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">07</span>
                <h2 className="privacy-section-title">Data Retention</h2>
              </div>
              <div className="privacy-divider" />
              <p>APL and ACB retain player registration data for the following periods:</p>
              <ul className="privacy-ul">
                <li><strong>Active Registration Data:</strong> Retained throughout the duration of the player's active APL registration and participation.</li>
                <li><strong>Post-Tournament Data:</strong> Retained for a minimum of seven (7) years following the conclusion of the relevant APL season for audit, dispute resolution, and regulatory compliance purposes.</li>
                <li><strong>Identification Documents:</strong> Retained for verification purposes during the registration review process and securely archived for a minimum of seven (7) years thereafter.</li>
                <li><strong>Anti-Corruption Records:</strong> May be retained for longer periods as required by ICC anti-corruption regulations or applicable law.</li>
              </ul>
              <p>
                At the end of applicable retention periods, player data will be securely deleted or anonymized in accordance with APL data management procedures.
              </p>
            </div>

            {/* 8. Security */}
            <div id="pp-security" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">08</span>
                <h2 className="privacy-section-title">Data Security</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                APL and ACB implement appropriate technical and organizational security measures to protect player registration data against unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul className="privacy-ul">
                <li>Secure encrypted data transmission using industry-standard protocols</li>
                <li>Role-based access controls limiting data access to authorized APL and ACB personnel only</li>
                <li>Secure data storage with appropriate access logging and monitoring</li>
                <li>Regular review of data security practices and procedures</li>
                <li>Confidentiality obligations for all APL and ACB staff and authorized third parties handling player data</li>
              </ul>
              <p>
                While APL and ACB take all reasonable precautions to protect player data, no online system can guarantee absolute security. Players are encouraged to protect their own registration credentials and to notify APL immediately if they suspect any unauthorized access to their account.
              </p>
            </div>

            {/* 9. Rights */}
            <div id="pp-rights" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">09</span>
                <h2 className="privacy-section-title">Your Rights</h2>
              </div>
              <div className="privacy-divider" />
              <p>Subject to applicable laws and regulations, players may have the following rights in relation to their personal data:</p>
              <div className="privacy-rights-grid">
                <div className="privacy-right-item">
                  <h4>Right to Access</h4>
                  <p>Request access to the personal data APL and ACB hold about you.</p>
                </div>
                <div className="privacy-right-item">
                  <h4>Right to Rectification</h4>
                  <p>Request correction of inaccurate or incomplete personal data.</p>
                </div>
                <div className="privacy-right-item">
                  <h4>Right to Erasure</h4>
                  <p>Request deletion of your data, subject to legal retention obligations.</p>
                </div>
                <div className="privacy-right-item">
                  <h4>Right to Restrict</h4>
                  <p>Request restriction of processing in certain circumstances.</p>
                </div>
                <div className="privacy-right-item">
                  <h4>Right to Portability</h4>
                  <p>Request a copy of your data in a portable, machine-readable format.</p>
                </div>
                <div className="privacy-right-item">
                  <h4>Right to Withdraw Consent</h4>
                  <p>Withdraw consent for processing at any time, where consent is the legal basis.</p>
                </div>
              </div>
              <p>
                To exercise any of these rights, please contact APL using the contact details provided in Section 12. APL and ACB will respond to all valid requests within a reasonable timeframe and in accordance with applicable law. Please note that some rights may be subject to limitations where processing is necessary for legal compliance, anti-corruption obligations, or legitimate tournament administration purposes.
              </p>
            </div>

            {/* 10. Minors */}
            <div id="pp-minors" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">10</span>
                <h2 className="privacy-section-title">Minors</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                The APL player registration system may be used by players under 18 years of age. For players under 18, APL and ACB require that registration be completed with the knowledge and consent of a parent or legal guardian. The parent or guardian accepts this Privacy Policy on behalf of the minor player at the time of registration submission.
              </p>
              <p>
                APL and ACB take additional care to protect the privacy and data of minor players. Photographs and personal details of minor players will only be publicly shared where a parent or guardian has provided explicit consent, and will be handled with heightened security measures.
              </p>
            </div>

            {/* 11. Changes */}
            <div id="pp-changes" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">11</span>
                <h2 className="privacy-section-title">Changes to This Policy</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                APL and ACB reserve the right to update or modify this Privacy Policy at any time. Any material changes to this Privacy Policy will be posted on the official APL website and, where appropriate, communicated directly to registered players via the contact information provided during registration.
              </p>
              <p>
                The effective date and last updated date at the top of this Privacy Policy will be revised to reflect the date of any updates. Continued use of the APL registration system following notification of changes constitutes acceptance of the revised Privacy Policy.
              </p>
            </div>

            {/* 12. Contact Us */}
            <div id="pp-contact" className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-num">12</span>
                <h2 className="privacy-section-title">Contact Us</h2>
              </div>
              <div className="privacy-divider" />
              <p>
                For any questions, concerns, or requests relating to this Privacy Policy or the processing of your personal data, please contact APL through the official APL website contact form or through the Afghanistan Cricket Board (ACB) official channels.
              </p>
              <div className="privacy-contact-block">
                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">Organization</span>
                  <span className="privacy-contact-value">Afghanistan Premier League (APL)</span>
                </div>
                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">Governed by</span>
                  <span className="privacy-contact-value">Afghanistan Cricket Board (ACB)</span>
                </div>
                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">Website</span>
                  <a href="#contact" className="privacy-contact-value privacy-contact-link">Contact Us via Official APL Website</a>
                </div>
              </div>
              <p className="privacy-final-note">
                By submitting a player registration with the APL, you confirm that you have read, understood, and agree to this Privacy Policy, and that the information provided is true, accurate, and complete to the best of your knowledge.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
