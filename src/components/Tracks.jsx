import React, { useState } from 'react';
import { ArrowRight, Globe, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const Tracks = () => {
  const [activeTrack, setActiveTrack] = useState(null);

  const tracks = [
    {
      num: '01',
      label: 'Track One',
      title: 'Diplomacy & International Affairs',
      subtitle: 'For future diplomats, lawyers, and negotiators.',
      isThisYou: [
        'Future diplomats',
        'Law students',
        'Negotiators',
        'International relations aspirants'
      ],
      explore: [
        'International law & treaties',
        'Conflict resolution strategies',
        'UN committee mechanics',
        'Bilateral negotiations'
      ],
      careers: [
        'Foreign Service Officer',
        'International Rights Lawyer',
        'UN Agency Representative'
      ],
      colorClass: 'diplomacy',
      icon: Globe
    },
    {
      num: '02',
      label: 'Track Two',
      title: 'Governance & Public Policy',
      subtitle: 'For policymakers, public administrators, and student leaders.',
      isThisYou: [
        'Policymakers',
        'Student leaders',
        'NGO practitioners',
        'Public sector advocates'
      ],
      explore: [
        'Policy analysis frameworks',
        'Legislative drafting protocols',
        'Public administration',
        'Leadership dynamics'
      ],
      careers: [
        'Policy Analyst',
        'Government Affairs Officer',
        'NGO Program Director'
      ],
      colorClass: 'governance',
      icon: Shield
    },
    {
      num: '03',
      label: 'Track Three',
      title: 'Youth Innovation & Social Impact',
      subtitle: 'For entrepreneurs, social innovators, and changemakers.',
      isThisYou: [
        'Young entrepreneurs',
        'Social innovators',
        'Changemakers',
        'Socio-economic activists'
      ],
      explore: [
        'SDG alignment and integration',
        'African youth agenda policy',
        'Social enterprise models',
        'Impact measurement'
      ],
      careers: [
        'Social Entrepreneur',
        'CSR Operations Manager',
        'Innovation Hub Lead'
      ],
      colorClass: 'innovation',
      icon: Zap
    }
  ];

  const handleToggle = (index) => {
    setActiveTrack(activeTrack === index ? null : index);
  };

  return (
    <section id="tracks" className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Specializations</span>
            <h2 className="section-title">Academic Tracks.</h2>
          </div>
          <p className="section-lead">
            Select a specialized focus pathway designed to build targeted professional capabilities.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="tracks-grid-container">
          {tracks.map((trk, index) => {
            const isExpanded = activeTrack === index;
            const IconComponent = trk.icon;

            return (
              <div 
                key={index} 
                className={`track-card ${trk.colorClass} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleToggle(index)}
              >
                {/* Hogwarts-like subtle color accent line at top */}
                <div className="track-card-accent"></div>

                <div className="track-card-header">
                  <div className="track-meta-row">
                    <span className="track-number">{trk.num}</span>
                    <span className="track-label-pill">{trk.label}</span>
                  </div>

                  <div className="track-title-wrapper">
                    <div className="track-icon-container">
                      <IconComponent size={24} className="track-icon-svg" />
                    </div>
                    <h3 className="track-card-title">{trk.title}</h3>
                  </div>

                  <p className="track-card-subtitle">{trk.subtitle}</p>
                </div>

                {/* Expandable content area */}
                <div className="track-card-body">
                  <div className="track-expanded-content">
                    <div className="track-info-grid">
                      {/* Section 1: Is this you? */}
                      <div className="track-info-col">
                        <h4 className="track-info-heading">Is this you?</h4>
                        <ul className="track-info-list">
                          {trk.isThisYou.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Section 2: You'll explore */}
                      <div className="track-info-col">
                        <h4 className="track-info-heading">You'll explore:</h4>
                        <ul className="track-info-list">
                          {trk.explore.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Section 3: Career paths */}
                      <div className="track-info-col">
                        <h4 className="track-info-heading">Career paths:</h4>
                        <ul className="track-info-list">
                          {trk.careers.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer trigger button */}
                <div className="track-card-footer">
                  <button 
                    className="track-explore-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid double toggle from card wrapper click
                      handleToggle(index);
                    }}
                  >
                    <span>{isExpanded ? 'Collapse' : 'Explore'}</span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="track-arrow-icon" />
                    ) : (
                      <ArrowRight size={16} className="track-arrow-icon" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Tracks;
