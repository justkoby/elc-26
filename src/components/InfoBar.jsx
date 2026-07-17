import React from 'react';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

const InfoBar = () => {
  const items = [
    {
      icon: <Calendar size={20} />,
      label: 'Duration',
      value: '7 Weeks (Hybrid)'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Main Venue',
      value: 'Yet to be confirmed'
    },
    {
      icon: <Users size={20} />,
      label: 'Training Target',
      value: '500 African Leaders'
    },
    {
      icon: <Award size={20} />,
      label: 'Application Fee',
      value: '100% Free'
    }
  ];

  return (
    <section className="info-bar-grid">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="info-bar-item"
          style={{ 
            backgroundColor: (item.label === 'Duration' || item.label === 'Main Venue') ? '#FFFFFF' : 'transparent' 
          }}
        >
          <div className="info-bar-icon-container">
            {item.icon}
          </div>
          <div className="info-bar-text-group">
            <span className="info-bar-lbl">{item.label}</span>
            <span className="info-bar-val">{item.value}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default InfoBar;
