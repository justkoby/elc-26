import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'Who is eligible to apply for the Youth Leadership Cohort?',
      a: 'Aspiring leaders aged 18 to 35 from any African nation are eligible. We welcome university undergraduates, postgraduates, junior policy officers, public servants, and grassroots community organizers.'
    },
    {
      q: 'Are there any fees or hidden costs for participating?',
      a: 'No. The program is fully funded by our diplomatic and public sector partners. There are zero application fees, zero tuition fees, and study material packets are supplied free of charge.'
    },
    {
      q: 'How does the hybrid format work for virtual and in-person sessions?',
      a: 'Week 1 (Orientation) and Week 7 (Model UN Assembly) are hosted physically in Accra, Ghana. Weeks 2 to 6 are held online via Zoom lectures, webinars, and shared workspace documents.'
    },
    {
      q: 'Will certificates or accreditation credentials be issued?',
      a: 'Yes, delegates who successfully complete all course deliverables receive an official Certificate of Accreditation in Multilateral Diplomacy and Public Policy, signed by our secretariat and partners.'
    },
    {
      q: 'Is travel and accommodation support available for international delegates?',
      a: 'Limited travel support and shared boarding slots are allocated to top-scoring international applicants during the Week 7 Accra General Assembly sessions. Mention support requirements in your candidacy statement.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-outer alt-bg">
      <div className="section-wrap">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div>
            <span className="section-kicker" style={{ textAlign: 'center', display: 'block' }}>Questions</span>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently Asked Questions.</h2>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question-btn" 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--un-blue)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
