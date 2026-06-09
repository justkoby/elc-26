import React from 'react';

const Gallery = () => {
  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600',
      title: 'Opening Plenary Session',
      category: 'Assembly'
    },
    {
      url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=600',
      title: 'Bilateral Committee Caucus',
      category: 'Negotiation'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600',
      title: 'Policy Workshop Debates',
      category: 'Policy'
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600',
      title: 'SDG Panel Discussion',
      category: 'Presentations'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600',
      title: 'Collaborative Resolution Drafting',
      category: 'Mentorship'
    },
    {
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600',
      title: 'Delegate Graduation Gala',
      category: 'Awards Dinner'
    }
  ];

  return (
    <section id="gallery" className="section-outer">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="section-kicker">Photo Log</span>
            <h2 className="section-title">Program Gallery.</h2>
          </div>
          <p className="section-lead">
            A visual overview of our past assemblies, workshops, caucuses, and student experiences.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div key={index} className="gallery-item">
              <img src={photo.url} alt={photo.title} loading="lazy" />
              <div className="gallery-item-overlay">
                <span className="gallery-item-category">{photo.category}</span>
                <h4 className="gallery-item-title">{photo.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
