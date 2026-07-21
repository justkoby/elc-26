import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and authorized
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminRows } = await supabase
          .from('admin_users')
          .select('*')
          .or(`id.eq.${session.user.id},user_id.eq.${session.user.id},email.eq.${session.user.email}`);

        if (adminRows && adminRows.length > 0) {
          navigate('/admin', { replace: true });
          return;
        }
      }
      setCheckingAuth(false);
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setLoading(false);
        setErrorMsg('Invalid email or password. Please check your credentials and try again.');
        return;
      }

      const user = authData?.user;
      if (!user) {
        setLoading(false);
        setErrorMsg('Authentication failed. Please try again.');
        return;
      }

      // Verify user exists in public.admin_users table
      const { data: adminRows, error: adminErr } = await supabase
        .from('admin_users')
        .select('*')
        .or(`id.eq.${user.id},user_id.eq.${user.id},email.eq.${user.email}`);

      if (adminErr || !adminRows || adminRows.length === 0) {
        await supabase.auth.signOut();
        setLoading(false);
        setErrorMsg('You are not authorized to access this dashboard.');
        return;
      }

      // Authorized admin -> redirect to /admin
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setErrorMsg('An unexpected error occurred. Please try again.');
    }
  };

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f9fd',
        color: '#013664'
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
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #013664 0%, #0d1f2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header Branding */}
        <div style={{
          background: '#013664',
          borderBottom: '3px solid #009EDB',
          padding: '32px 28px 24px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#009EDB',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 4px 12px rgba(0, 158, 219, 0.3)'
          }}>
            <ShieldCheck size={28} color="#ffffff" />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '4px'
          }}>
            Youth Leadership Cohort
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#c8e9f8',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Admin Portal
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} style={{ padding: '28px 28px 32px' }}>
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#991b1b',
              fontSize: '13px',
              lineHeight: '1.4'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1c3f5e',
              marginBottom: '6px'
            }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#4a6f8a'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aasuonline.org"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  fontSize: '14px',
                  color: '#0d1f2d',
                  background: '#f4f9fd',
                  border: '1px solid #d0e6f3',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1c3f5e',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#4a6f8a'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '11px 42px 11px 40px',
                  fontSize: '14px',
                  color: '#0d1f2d',
                  background: '#f4f9fd',
                  border: '1px solid #d0e6f3',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4a6f8a',
                  padding: '2px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#ffffff',
              background: loading ? '#90cfe8' : '#009EDB',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(0, 158, 219, 0.2)'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{
          padding: '16px 28px',
          background: '#f4f9fd',
          borderTop: '1px solid #d0e6f3',
          textAlign: 'center',
          fontSize: '12px',
          color: '#4a6f8a'
        }}>
          Protected YLC Administrative System &nbsp;·&nbsp; Authorized Personnel Only
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
