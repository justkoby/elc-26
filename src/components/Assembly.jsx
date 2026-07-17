import React from 'react';

const Assembly = () => {
  const agenda = [
    {
      time: '08:00 AM',
      event: 'Delegate Check-In & Breakfast',
      desc: 'Credential verification and registration kit collection.',
      type: 'networking',
      label: 'Networking'
    },
    {
      time: '09:30 AM',
      event: 'Opening Plenary & Keynote Address',
      desc: 'Welcome addresses from our partnering diplomats and ministers.',
      type: 'keynote',
      label: 'Keynote'
    },
    {
      time: '11:00 AM',
      event: 'Committee Assembly Sessions',
      desc: 'Active negotiations and drafting of resolution papers.',
      type: 'simulation',
      label: 'Simulation'
    },
    {
      time: '01:00 PM',
      event: 'Networking Luncheon',
      desc: 'Structured delegates luncheon and sponsor showcase.',
      type: 'networking',
      label: 'Networking'
    },
    {
      time: '02:30 PM',
      event: 'General Assembly Voting Plenary',
      desc: 'Formal presentation of resolutions and voting procedures.',
      type: 'showcase',
      label: 'Showcase'
    },
    {
      time: '04:30 PM',
      event: 'Graduation Ceremony & Awards',
      desc: 'Distribution of diplomas, certificates, and delegate awards.',
      type: 'ceremony',
      label: 'Ceremony'
    }
  ];

  return (
    <section id="assembly" className="section-outer alt-bg">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">The Finale</span>
            <h2 className="section-title">Model UN General Assembly.</h2>
          </div>
          <p className="section-lead">
            The program culminates in a high-stakes, full-day in-person simulation at Accra's premier conference venue.
          </p>
        </div>

        {/* Assembly Grid */}
        <div className="assembly-grid-container">
          {/* Left Venue Card Image Replacement */}
          <div className="venue-card-image-wrap">
            <img 
              src="/un-flag.jpeg" 
              alt="United Nations Flag" 
              className="venue-card-image"
            />
          </div>

          {/* Right Agenda Table */}
          <div className="agenda-table-wrap">
            <table className="agenda-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Time</th>
                  <th style={{ width: '55%' }}>Event Description</th>
                  <th style={{ width: '20%' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map((item, index) => (
                  <tr key={index}>
                    <td className="agenda-num">{item.time}</td>
                    <td>
                      <div className="agenda-event">{item.event}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                    </td>
                    <td>
                      <span className={`agenda-badge ${item.type}`}>
                        {item.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assembly;
