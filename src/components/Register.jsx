import React, { useState } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';

const Register = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    track: 'TRK-101',
    statement: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const tiers = [
    {
      label: 'Tuition Fee Waiver',
      title: '7-Week Guided Cohort',
      note: 'Sponsored by Ministry & UN Partners',
      currency: '$',
      price: '0',
      featured: false
    },
    {
      label: 'Accreditation Pass',
      title: 'MUN General Assembly Ticket',
      note: 'Includes credentials, banquets, and materials',
      currency: '$',
      price: '0',
      featured: true
    },
    {
      label: 'Application Fee',
      title: 'Form Processing Tier',
      note: 'Waived for 2026 intake cycle',
      currency: '$',
      price: '0',
      featured: false
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Keep showing submitted state
    }, 2000);
  };

  const resetForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      country: '',
      track: 'TRK-101',
      statement: ''
    });
  };

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
              To maintain the highest standard of diplomatic debate, cohort applications undergo a thorough double-blind review process. Candidates are scored on academic history, leadership records, and writing strength in the Statement of Purpose.
            </p>
            <div className="register-note-box">
              Admission selections are entirely merit-based. Selected participants receive full waivers covering all instruction fees, study packs, and certificates.
            </div>
            
            <div className="register-free-highlight">
              <span className="register-free-icon">✨</span>
              <div className="register-free-text">
                <span className="register-free-title">Full Sponsorship Waived</span>
                <span className="register-free-desc">All selected cohort members attend at zero tuition fee. Week 7 catering and banquet access are covered.</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <h3 className="contact-card-title">Admissions Secretariat</h3>
              <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} color="var(--un-blue)" />
                <span>Email:</span> admissions@ylc-mun.org
              </div>
              <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--un-blue)" />
                <span>Hotline:</span> +233 302 987 654
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

            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.1rem' }}
            >
              Start Application Form
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Application Modal */}
      {showForm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(22, 58, 95, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              width: '100%',
              maxWidth: '550px',
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              position: 'relative',
              border: '1px solid var(--border-color)'
            }}
          >
            <button 
              onClick={resetForm}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={24} />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-headings)', 
                    fontSize: '1.8rem', 
                    color: 'var(--diplomatic-navy)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Candidate Application
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Please complete the form below. Entry results will be sent to the email provided.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--diplomatic-navy)' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe" 
                      style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--diplomatic-navy)' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane.doe@example.com" 
                      style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--diplomatic-navy)' }}>Country of Origin</label>
                      <input 
                        type="text" 
                        name="country" 
                        required 
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Ghana" 
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--diplomatic-navy)' }}>Preferred Track</label>
                      <select 
                        name="track" 
                        value={formData.track}
                        onChange={handleInputChange}
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem', backgroundColor: '#fff' }}
                      >
                        <option value="TRK-101">Diplomatic Studies</option>
                        <option value="TRK-102">Public Policy</option>
                        <option value="TRK-103">Model UN Assembly</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--diplomatic-navy)' }}>Statement of Purpose</label>
                    <textarea 
                      name="statement" 
                      required 
                      rows="3"
                      value={formData.statement}
                      onChange={handleInputChange}
                      placeholder="Why do you wish to join the Youth Leadership Cohort?..." 
                      style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-body)', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}
                >
                  Submit Form
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-headings)', 
                    fontSize: '1.8rem', 
                    color: 'var(--diplomatic-navy)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Application Received!
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Thank you, <strong>{formData.name}</strong>. Your candidacy has been logged under reference <strong>YLC-2026-{(Math.floor(Math.random() * 9000) + 1000)}</strong>. We will contact you at <strong>{formData.email}</strong> after the review stage completes.
                </p>
                <button 
                  onClick={resetForm}
                  className="btn btn-secondary" 
                  style={{ padding: '0.75rem 2rem' }}
                >
                  Close Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;
