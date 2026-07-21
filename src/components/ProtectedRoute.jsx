import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuthAndAdmin = async (session) => {
      if (!session?.user) {
        if (mounted) {
          setAuthorized(false);
          setLoading(false);
        }
        return;
      }

      try {
        const user = session.user;
        const userId = user.id;
        const userEmail = user.email;

        // Fetch admin_users rows safely
        const { data: adminRows, error } = await supabase.from('admin_users').select('*');

        const isAuthorized = !error && adminRows && adminRows.some(
          r => r.user_id === userId || r.id === userId || (r.email && r.email.toLowerCase() === userEmail.toLowerCase())
        );

        if (!isAuthorized) {
          console.warn('Unauthorized user attempt:', user.email);
          await supabase.auth.signOut();
          if (mounted) {
            setAuthorized(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        await supabase.auth.signOut();
        if (mounted) {
          setAuthorized(false);
          setLoading(false);
        }
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuthAndAdmin(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAuthAndAdmin(session);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f9fd',
        color: '#013664',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid #c8e9f8',
          borderTopColor: '#009EDB',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: 500, color: '#4a6f8a' }}>
          Verifying administrator credentials…
        </p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
