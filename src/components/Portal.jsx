import { useEffect } from 'react';

const Portal = () => {
  useEffect(() => {
    // Redirect to the static HTML portal page if loaded
    window.location.href = '/ylc-mun-portal.html';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f9fd',
      color: '#013664',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid #c8e9f8',
        borderTopColor: '#009EDB',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Portal;
