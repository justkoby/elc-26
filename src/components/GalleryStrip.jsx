import React from 'react';

const GalleryStrip = () => {
  const images = [
    'WhatsApp Image 2026-06-30 at 11.57.02 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.03 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.03 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.04 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.04 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.05 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.05 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.06 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.06 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.07 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.07 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.08 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.08 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.09 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.09 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.10 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.11 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.12 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.13 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.14 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.14 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.15 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.16 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.17 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.17 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.18 AM (1).jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.18 AM.jpeg',
    'WhatsApp Image 2026-06-30 at 11.57.19 AM.jpeg'
  ];

  // Duplicate to ensure seamless continuous scrolling
  const tickerList = [...images, ...images];

  return (
    <div className="gallery-strip">
      <div className="gallery-track">
        {tickerList.map((imgName, index) => (
          <div key={index} className="gallery-item">
            <img 
              src={`/images-v2/${imgName}`} 
              alt={`Gallery ${index}`} 
              loading="lazy" 
            />
            <div className="gallery-overlay" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryStrip;
