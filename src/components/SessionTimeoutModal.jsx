import React from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

const SessionTimeoutModal = ({ isOpen, remainingSeconds, onStayLoggedIn, onLogoutNow }) => {
  if (!isOpen) return null;

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.max(0, totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 54, 100, 0.65)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            background: 'linear-gradient(135deg, #013664 0%, #0d2847 100%)',
            borderBottom: '3px solid #009EDB',
            padding: '24px 28px',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 158, 219, 0.15)',
              border: '2px solid #009EDB',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: '#009EDB',
            }}
          >
            <Clock size={26} />
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}
          >
            Session Timeout Warning
          </h2>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '28px 28px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#013664',
              lineHeight: 1.5,
              margin: '0 0 12px 0',
            }}
          >
            Your session will expire due to inactivity.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f4f9fd',
              border: '1px solid #c8e9f8',
              borderRadius: '24px',
              padding: '8px 18px',
              color: '#009EDB',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '1px',
              margin: '8px 0 20px 0',
            }}
          >
            <Clock size={20} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: '#4a6f8a',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            You will be automatically logged out and redirected to the login page when the timer reaches 00:00.
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div
          style={{
            padding: '16px 28px 24px',
            backgroundColor: '#fafcfd',
            borderTop: '1px solid #eef5fb',
            display: 'flex',
            gap: '12px',
            flexDirection: 'row',
          }}
        >
          <button
            type="button"
            onClick={onStayLoggedIn}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#009EDB',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 158, 219, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0087bd')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#009EDB')}
          >
            <RefreshCw size={16} />
            Stay Logged In
          </button>

          <button
            type="button"
            onClick={onLogoutNow}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#991b1b',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.borderColor = '#f87171';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
          >
            <LogOut size={16} />
            Logout Now
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SessionTimeoutModal;
