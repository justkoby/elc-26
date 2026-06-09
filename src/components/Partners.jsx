import React from 'react';

const Partners = () => {
  const logos = [
    { src: '/UN.png', alt: 'United Nations' },
    { src: '/mof.png', alt: 'Ministry of Finance' },
    { src: '/britishcouncillog.jpg', alt: 'British Council' },
    { src: '/aasulogo.png', alt: 'All-Africa Students Union (AASU)' },
    { src: '/ydi.png', alt: 'Youth Diplomacy Institute' },
    { src: '/sdgss.png', alt: 'SDG Summer School' },
    { src: '/maucn.jpeg', alt: 'MAUCN' }
  ];

  // We duplicate the logos array multiple times to ensure the CSS logoScroll marquee is seamless
  const tickerLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section id="partners" className="partners-ticker-container">
      <span 
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--text-muted)',
          marginBottom: '0.5rem'
        }}
      >
        Supported By
      </span>
      <div className="partners-ticker-wrap">
        <div className="partners-ticker-track">
          {tickerLogos.map((logo, index) => (
            <div key={index} className="partners-logo-item">
              <img 
                src={logo.src} 
                alt={logo.alt} 
                loading="lazy" 
                onTouchStart={(e) => {
                  // Small helper to ensure color on tap toggle on mobile browsers
                  e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onTouchEnd={(e) => {
                  // Reset after a brief delay
                  const target = e.currentTarget;
                  setTimeout(() => {
                    target.style.filter = '';
                    target.style.transform = '';
                  }, 1200);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
