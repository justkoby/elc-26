import React from 'react';

const Ambassadors = () => {
  const ambassadors = [
    { id: 1, src: '/1.webp', name: 'Ambassador 01', role: 'Youth Delegate' },
    { id: 2, src: '/2.webp', name: 'Ambassador 02', role: 'Youth Delegate' },
    { id: 3, src: '/3.webp', name: 'Ambassador 03', role: 'Youth Delegate' },
    { id: 4, src: '/4.webp', name: 'Ambassador 04', role: 'Youth Delegate' },
    { id: 5, src: '/5.webp', name: 'Ambassador 05', role: 'Youth Delegate' },
    { id: 6, src: '/6.webp', name: 'Ambassador 06', role: 'Youth Delegate' },
    { id: 7, src: '/7.webp', name: 'Ambassador 07', role: 'Youth Delegate' },
    { id: 8, src: '/8.webp', name: 'Ambassador 08', role: 'Youth Delegate' },
    { id: 9, src: '/9.webp', name: 'Ambassador 09', role: 'Youth Delegate' },
  ];

  // Duplicate to ensure seamless continuous scrolling
  const tickerList = [...ambassadors, ...ambassadors, ...ambassadors, ...ambassadors];

  return (
    <section id="ambassadors" className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Leadership in Action</span>
            <h2 className="section-title">Meet your ambassadors</h2>
          </div>
          <p className="section-lead">
            Empowering youth voices and driving change across the continent. Meet the exceptional delegates representing our cohort.
          </p>
        </div>
      </div>

      {/* Scrolling Ticker Container */}
      <div className="ambassadors-ticker-container">
        <div className="ambassadors-ticker-wrap">
          <div className="ambassadors-ticker-track">
            {tickerList.map((amb, index) => (
              <div key={index} className="ambassador-card">
                <img 
                  src={amb.src} 
                  alt={amb.name} 
                  className="ambassador-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ambassadors;
