import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Programme', id: 'programme' },
    { label: 'Tracks', id: 'tracks' },
    { label: 'Assembly', id: 'assembly' },
    { label: 'Partners', id: 'partners' },
    { label: 'FAQ', id: 'faq' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Add shadow when scrolled down
      if (window.scrollY > 20) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }

      // Determine active section
      const scrollPosition = window.scrollY + 100;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
            return;
          }
        }
      }
      
      if (scrollPosition < 500) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className={`nav-bar-container ${hasShadow ? 'has-shadow' : ''}`} style={{ backgroundColor: '#FFFFFF' }}>
        <div className="nav-bar-wrap">
          {/* Logo Group */}
          <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="nav-logo-group">
            <img 
              src="/YLC logo.png" 
              alt="YLC Logo" 
              style={{
                height: '45px',
                objectFit: 'contain'
              }} 
            />
          </a>

          {/* Desktop Links - Centered */}
          <ul className="nav-links-desktop-center">
            {navLinks.slice(0, 5).map((link) => (
              <li 
                key={link.id} 
                className={`nav-link-item ${activeSection === link.id ? 'active' : ''}`}
              >
                <a 
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Right Buttons */}
          <div className="nav-buttons-desktop-right">
            <a 
              href="#apply" 
              onClick={(e) => handleLinkClick(e, 'apply')}
              className="nav-apply-btn"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="nav-mobile-toggle" 
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={26} color="var(--diplomatic-navy)" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Sidebar Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-announcement">Applications Open</span>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={26} color="var(--diplomatic-navy)" />
          </button>
        </div>

        {/* Navigation Links inside Drawer */}
        <ul className="mobile-drawer-links">
          {navLinks.map((link) => (
            <li key={link.id} className="mobile-drawer-link-item">
              <a 
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Drawer Footer Section */}
        <div className="mobile-drawer-footer">
          <a 
            href="#apply" 
            onClick={(e) => handleLinkClick(e, 'apply')}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              borderRadius: '24px'
            }}
          >
            Apply Now <ArrowRight size={16} />
          </a>

          {/* Spacing & Socials */}
          <div className="mobile-drawer-socials">
            <a href="#" className="mobile-drawer-social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="mobile-drawer-social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" className="mobile-drawer-social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="mobile-drawer-social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
