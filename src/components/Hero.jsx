import React from 'react';

const Hero = () => {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-container">
      {/* Video Background */}
      <video 
        className="hero-video" 
        autoPlay 
        loop 
        muted 
        playsInline
        src="https://res.cloudinary.com/justkoby/video/upload/v1780964689/0609_lkeums.mp4"
      />
      
      {/* Overlay */}
      <div className="hero-overlay"></div>
      
      {/* Content */}
      <div className="hero-content">
        {/* Left Column: Text Block */}
        <div className="hero-text-block">
          <h1 className="hero-title-main">
            Africa's Next Generation of Leaders.
          </h1>
          <div className="hero-accent-line"></div>
          <p className="hero-desc-main">
            Developing Africa's future diplomats, policymakers and changemakers through a seven-week leadership experience.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => handleScrollTo('apply')}
              className="btn btn-primary"
            >
              Apply Now
            </button>
            <button 
              onClick={() => handleScrollTo('programme')}
              className="btn btn-secondary"
            >
              Programme
            </button>
          </div>
        </div>

        {/* Right Column: Stats Panel */}
        <div className="hero-stats-panel">
          <div className="hero-stat-item">
            <div className="hero-stat-val">7 <span>Weeks</span></div>
            <div className="hero-stat-lbl">Cohort Duration</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-val">1 <span>MUN</span></div>
            <div className="hero-stat-lbl">General Assembly</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-val">500+ <span>Leaders</span></div>
            <div className="hero-stat-lbl">Training Target</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
