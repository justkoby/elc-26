import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Register = () => {

  const tiers = [
    {
      label: 'APPLICATION',
      title: 'Apply to the Cohort',
      note: 'Open to all eligible applicants aged 18-30',
      currency: '',
      price: 'FREE',
      featured: false
    },
    {
      label: 'GRADUATION (SUCCESSFUL DELEGATES ONLY)',
      title: 'Enrolment & Graduation Fee',
      note: 'Payable only upon successful completion — Marriott Hotel',
      currency: 'GH¢',
      price: 'TBD',
      featured: true
    }
  ];


  return (
    <section id="apply" className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Application Portal</span>
            <h2 className="section-title">Apply & Tuitions.</h2>
          </div>
          <p className="section-lead">
            Review registration fee tiers, tuition waivers, and submit your cohort candidacy online.
          </p>
        </div>

        {/* Register Grid */}
        <div className="register-grid-container">
          {/* Left Intro Info */}
          <div className="register-intro">
            <p>
              All 500 selected delegates participate in the full seven-week program, delivered through flexible weekend online and in-person classes. Admission is merit-based, assessed through a thorough double-blind review of academic history, leadership records, and Statement of Purpose.
            </p>
            <div className="register-note-box">
              The program is fully funded — there are no tuition or application fees. Only successful graduates will be required to pay a nominal graduation fee upon completion.
            </div>
            
            <div className="register-free-highlight">
              <span className="register-free-icon">✨</span>
              <div className="register-free-text">
                <span className="register-free-title">Free to Participate</span>
                <span className="register-free-desc">All 500 selected delegates attend the full 7-week program at zero cost. A nominal graduation fee applies only upon successful completion.</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <h3 className="contact-card-title">Admissions Secretariat</h3>
              <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} color="var(--un-blue)" />
                <span>Email:</span> Cohortyouthleadership@gmail.com
              </div>
              <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--un-blue)" />
                <span>Hotline:</span> 0204070817
              </div>
              <div className="contact-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={16} color="var(--un-blue)" style={{ marginTop: '3px' }} />
                <div><span>Office:</span> AASU House, Airport City, Accra, Ghana</div>
              </div>
            </div>
          </div>

          {/* Right Fees / Apply Button Box */}
          <div className="tier-box-wrap">
            <h3 className="tier-box-title">Tuition & Administrative Fees</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {tiers.map((tier, index) => (
                <div key={index} className={`tier-row ${tier.featured ? 'featured' : ''}`}>
                  <div className="tier-info-group">
                    <span className="tier-info-lbl">{tier.label}</span>
                    <span className="tier-info-title">{tier.title}</span>
                    <span className="tier-info-note">{tier.note}</span>
                  </div>
                  <div className="tier-price-value">
                    <span className="tier-price-currency">{tier.currency}</span>
                    {tier.price}
                  </div>
                </div>
              ))}
            </div>

            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSf4-q_C45S3G6pWXIMyPwG__W5kMyQ-aUYaM1oFKJND4Opmag/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '1.1rem',
                display: 'block',
                textAlign: 'center'
              }}
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
