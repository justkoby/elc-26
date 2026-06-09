import React from 'react';

const About = () => {
  const outcomes = [
    'Proficiency in multilateral diplomacy and UN committee procedure',
    'Capacity to draft, debate, and present policy resolutions',
    'Mentorship from accomplished practitioners and leaders',
    'Certificate of Completion and formal graduation recognition',
    'Access to a pan-African alumni network of cohort graduates'
  ];

  const objectives = [
    { num: '01', text: 'Develop leadership capacity grounded in multilateral values' },
    { num: '02', text: 'Build practical skills in policy, diplomacy, and negotiation' },
    { num: '03', text: 'Cultivate a cohort culture of intellectual rigour and civic responsibility' },
    { num: '04', text: 'Connect youth to policymakers, mentors, and global networks' },
    { num: '05', text: 'Showcase youth-led solutions through a public General Assembly' }
  ];

  return (
    <section id="about" className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">About the Programme</span>
            <h2 className="section-title">Building the Architects of Africa's Future</h2>
          </div>
          <p className="section-lead">
            A structured, immersive programme bridging diplomacy, governance, and youth innovation across seven weeks.
          </p>
        </div>

        {/* Free Banner */}
        <div className="register-free-highlight" style={{ marginTop: '0', marginBottom: '3rem' }}>
          <div className="register-free-icon">✓</div>
          <div className="free-banner-text">
            <strong>Application and Training are Completely Free</strong>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              All 500 selected delegates participate in the full 7-week programme at no cost. Only successful graduates will be required to pay a nominal enrolment/graduation fee.
            </span>
          </div>
        </div>

        {/* About Grid */}
        <div className="about-grid-container">
          <div className="about-body">
            <p>
              The Youth Leadership Cohort &amp; Model UN General Assembly is a flagship initiative designed to equip emerging African leaders with the knowledge, skills, and networks required to engage meaningfully in national and international governance.
            </p>
            <p>
              Drawing on the frameworks and values of the United Nations system, the programme combines structured mentorship, hands-on workshops, policy simulations, and cross-sector learning. Delegates leave with practical experience in diplomacy, resolution drafting, public speaking, and strategic leadership.
            </p>
            <p>
              The programme concludes with a week-long Grand Finale at the Marriott Hotel, Accra &mdash; featuring a public lecture, a full Model UN General Assembly session, a policy exhibition, and a formal graduation ceremony.
            </p>

            <div className="about-highlights-card">
              <span className="about-highlights-title">Programme Outcomes</span>
              <ul className="about-highlights-list">
                {outcomes.map((item, index) => (
                  <li key={index} className="about-highlights-item">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="about-objectives-group" style={{ border: 'none' }}>
            <div className="about-quote-container">
              <div className="about-quote-mark">&ldquo;</div>
              <p className="about-quote-text" style={{ fontSize: '1.25rem' }}>
                The destiny of the African continent is shaped by the quality of leaders we build today. This programme exists to build them.
              </p>
              <span className="about-quote-author">— Programme Philosophy</span>
            </div>

            {objectives.map((obj, index) => (
              <div key={index} className="about-objective-row">
                <span className="about-obj-num">{obj.num}</span>
                <span className="about-obj-text">{obj.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
