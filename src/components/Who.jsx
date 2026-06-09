import React from 'react';
import { GraduationCap, Briefcase, Globe, Landmark } from 'lucide-react';

const Who = () => {
  const personas = [
    {
      icon: <GraduationCap size={22} />,
      title: 'Students',
      desc: 'High-performing university undergraduates and recent graduates interested in foreign affairs, public administration, or law.'
    },
    {
      icon: <Briefcase size={22} />,
      title: 'Policy Professionals',
      desc: 'Junior public servants, policy researchers, and analysts looking to deepen their trade policy and negotiation frameworks.'
    },
    {
      icon: <Globe size={22} />,
      title: 'Civil Activists',
      desc: 'Grassroots coordinators, environmental activists, and NGO directors seeking to draft actionable regional advocacy plans.'
    },
    {
      icon: <Landmark size={22} />,
      title: 'Aspiring Diplomats',
      desc: 'Candidates aiming for careers in foreign service, regional bodies (AU, ECOWAS), or UN agencies wanting protocol training.'
    }
  ];

  return (
    <section className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Target Cohort</span>
            <h2 className="section-title">Who Should Attend.</h2>
          </div>
          <p className="section-lead">
            We select candidates who demonstrate a commitment to public leadership, regional integration, and policy excellence.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="who-grid-container">
          {personas.map((persona, index) => (
            <div key={index} className="who-card">
              <div className="who-icon-wrapper">
                {persona.icon}
              </div>
              <h3 className="who-card-title">{persona.title}</h3>
              <p className="who-card-desc">{persona.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Who;
