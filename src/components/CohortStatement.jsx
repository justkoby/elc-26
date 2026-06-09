import React from 'react';

const CohortStatement = () => {
  return (
    <section className="statement-section">
      <div className="statement-grid">
        {/* Left Side: Statement Numbers */}
        <div className="statement-left">
          <span className="statement-kicker">THE INAUGURAL COHORT</span>
          <span className="statement-number">500</span>
          <span className="statement-title">Emerging African Leaders.</span>
        </div>

        {/* Right Side: Statement Details */}
        <div className="statement-right">
          <div className="statement-detail-item">Seven weeks.</div>
          <div className="statement-detail-item">Three specialised tracks.</div>
          <div className="statement-detail-item">One landmark General Assembly.</div>
          <div className="statement-detail-item">Completely free.</div>
          <div className="statement-detail-item highlighted">Applications are now open.</div>
        </div>
      </div>
    </section>
  );
};

export default CohortStatement;
