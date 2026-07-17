import React, { useState } from 'react';

const Programme = () => {
  const [activeMobileWeek, setActiveMobileWeek] = useState(0);

  const weeks = [
    {
      num: 'Week 01',
      title: 'Orientation & Foundations',
      type: 'ip',
      badge: 'IN PERSON',
      shortTitle: 'Getting Started.',
      desc: 'Cohort induction, UN system overview, leadership frameworks, and team formation.'
    },
    {
      num: 'Week 02',
      title: 'Diplomacy & Negotiation',
      type: 'ip',
      badge: 'IN PERSON',
      shortTitle: 'Diplomacy & Negotiation.',
      desc: 'Multilateral diplomacy, geopolitics, negotiation theory, and committee mechanics.'
    },
    {
      num: 'Week 03',
      title: 'Policy & Resolution Drafting',
      type: 'ip',
      badge: 'IN PERSON',
      shortTitle: 'Policy & Resolution.',
      desc: 'Policy analysis, resolution writing, and public speaking workshops.'
    },
    {
      num: 'Week 04',
      title: 'Leadership & Governance',
      type: 'vt',
      badge: 'VIRTUAL',
      shortTitle: 'Leadership & Governance.',
      desc: 'Mentorship sessions, governance deep dives, and guest speaker seminars.'
    },
    {
      num: 'Week 05',
      title: 'Innovation & Youth Agenda',
      type: 'vt',
      badge: 'VIRTUAL',
      shortTitle: 'Innovation & Youth.',
      desc: 'SDG alignment, African youth agenda, and entrepreneurial leadership.'
    },
    {
      num: 'Week 06',
      title: 'Simulation & Prep',
      type: 'vt',
      badge: 'VIRTUAL',
      shortTitle: 'Simulation & Prep.',
      desc: 'Full committee simulation, delegate preparation, and Assembly briefing.'
    },
    {
      num: 'Week 07',
      title: 'Assembly & Graduation',
      type: 'fn',
      badge: 'FINALE',
      shortTitle: 'Grand Assembly.',
      desc: 'Public lecture, Model UN Assembly, exhibition, awards, graduation — Yet to be confirmed.'
    }
  ];

  const w1 = weeks[0];
  const midWeeks = weeks.slice(1, 6);
  const w7 = weeks[6];

  return (
    <section id="programme" className="section-outer alt-bg">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Curriculum</span>
            <h2 className="section-title">Program Structure.</h2>
          </div>
          <p className="section-lead">
            A comprehensive 7-week curriculum combining flexible virtual modules with high-stakes in-person simulations.
          </p>
        </div>

        {/* Legend - Pill Badges instead of dots */}
        <div className="programme-legend">
          <span className="legend-pill ip">IN PERSON</span>
          <span className="legend-pill vt">VIRTUAL</span>
          <span className="legend-pill fn">FINALE</span>
        </div>

        {/* Desktop Layout - 3 Column Asymmetric Tension */}
        <div className="programme-desktop-layout">
          {/* Week 1 Hero Card */}
          <div className="column-hero-1">
            <div className="week-card-hero ip">
              <span className="pill-badge ip">{w1.badge}</span>
              <div className="hero-week-label">{w1.num}</div>
              <h3 className="hero-week-title">{w1.title}</h3>
              <div className="hero-week-subtitle">{w1.shortTitle}</div>
              <p className="hero-week-desc">{w1.desc}</p>
            </div>
          </div>

          {/* Weeks 2-6 Timeline Stack */}
          <div className="column-middle-weeks">
            <div className="middle-timeline-track">
              {midWeeks.map((week, index) => (
                <div key={index} className="middle-week-item">
                  <div className="middle-week-header">
                    <span className="middle-week-num">{week.num}</span>
                    <span className="pill-badge vt">{week.badge}</span>
                  </div>
                  <h4 className="middle-week-title">{week.title}</h4>
                  <p className="middle-week-desc">{week.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Week 7 Grand Finale Hero Card */}
          <div className="column-hero-7">
            <div className="week-card-hero fn gold-highlight">
              <div className="gold-glow-effect"></div>
              <div className="hero-badge-row">
                <span className="pill-badge fn">{w7.badge}</span>
                <span className="special-gold-badge">★ GRADUATION</span>
              </div>
              <div className="hero-week-label">{w7.num}</div>
              <h3 className="hero-week-title">{w7.title}</h3>
              <div className="hero-week-subtitle">{w7.shortTitle}</div>
              <p className="hero-week-desc">{w7.desc}</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Interactive Timeline Accordion Journey */}
        <div className="programme-mobile-layout">
          <div className="mobile-timeline-journey">
            {weeks.map((week, index) => {
              const isOpen = activeMobileWeek === index;
              return (
                <div 
                  key={index} 
                  className={`mobile-accordion-item ${isOpen ? 'active' : ''} ${week.type}`}
                  onClick={() => setActiveMobileWeek(index)}
                >
                  <div className="mobile-accordion-header">
                    <div className="timeline-connector-group">
                      <div className={`timeline-dot ${week.type}`}></div>
                      {index < weeks.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="mobile-header-text">
                      <span className="mobile-week-num">{week.num}</span>
                      <h4 className="mobile-week-title">{week.title}</h4>
                    </div>
                    <span className={`pill-badge ${week.type}`}>{week.badge}</span>
                  </div>

                  <div className="mobile-accordion-body">
                    <p className="mobile-week-desc">{week.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cannes Split-Screen Learning Formats */}
        <div className="learning-formats-container">
          <h3 className="formats-heading">How You'll Learn</h3>
          
          {/* Format 1: IN PERSON */}
          <div className="learning-format-split">
            <div className="format-split-image-container">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800" 
                alt="In Person Immersive Dialogues" 
                className="format-split-image"
              />
            </div>
            <div className="format-split-content">
              <span className="pill-badge ip">IN PERSON</span>
              <h4 className="format-split-title">Immersive Dialogues</h4>
              <span className="format-split-weeks">Weeks 1, 2, 3 &amp; 7 &bull; Accra, Ghana</span>
              <ul className="format-split-list">
                <li>Orientation icebreakers and direct group induction.</li>
                <li>High-stakes Model UN Assembly debates (Venue to be confirmed).</li>
                <li>Policy presentation panels and delegate networking.</li>
                <li>Graduation dinners, credential awards, and leadership banquets.</li>
              </ul>
            </div>
          </div>

          {/* Format 2: VIRTUAL */}
          <div className="learning-format-split reverse">
            <div className="format-split-image-container">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" 
                alt="Virtual Structured Digital Learning" 
                className="format-split-image"
              />
            </div>
            <div className="format-split-content">
              <span className="pill-badge vt">VIRTUAL</span>
              <h4 className="format-split-title">Structured Digital Learning</h4>
              <span className="format-split-weeks">Weeks 4 to 6 &bull; Live Interactive Panels</span>
              <ul className="format-split-list">
                <li>Weekly webinars hosted by active diplomats and policy experts.</li>
                <li>Research submissions, digital policy review logs, and grading.</li>
                <li>Collaborative digital channels for resolution document drafts.</li>
                <li>Flexible learning flow accommodating students and professionals.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programme;
