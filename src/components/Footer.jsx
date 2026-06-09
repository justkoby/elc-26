import React from 'react';

const Footer = () => {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer-container">
      {/* Top Section */}
      <div className="footer-top-wrap">
        <div className="footer-brand">
          Youth Leadership Cohort
          <small>Model United Nations General Assembly</small>
        </div>
        <ul className="footer-nav">
          <li className="footer-nav-link">
            <a href="#about" onClick={(e) => handleScrollTo(e, 'about')}>About</a>
          </li>
          <li className="footer-nav-link">
            <a href="#programme" onClick={(e) => handleScrollTo(e, 'programme')}>Curriculum</a>
          </li>
          <li className="footer-nav-link">
            <a href="#tracks" onClick={(e) => handleScrollTo(e, 'tracks')}>Specializations</a>
          </li>
          <li className="footer-nav-link">
            <a href="#assembly" onClick={(e) => handleScrollTo(e, 'assembly')}>General Assembly</a>
          </li>
          <li className="footer-nav-link">
            <a href="#apply" onClick={(e) => handleScrollTo(e, 'apply')}>Apply</a>
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom-wrap">
        <span className="footer-legal-text">
          © {new Date().getFullYear()} Youth Leadership Cohort & Model UN General Assembly. All Rights Reserved.
        </span>
        <span className="footer-legal-text">
          Designed in partnership with public agencies, regional unions, and educational secretariats.
        </span>
      </div>

      {/* Bottom Accent Stripe */}
      <div 
        className="footer-accent-stripe" 
        style={{ margin: '2.5rem -10% -2.5rem -10%', width: '120vw' }}
      ></div>
    </footer>
  );
};

export default Footer;
