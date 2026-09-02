import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SESSION_CONFIG } from '../config/sessionConfig';
import SessionTimeoutModal from './SessionTimeoutModal';

const SessionTimeoutHandler = ({ children }) => {
  const navigate = useNavigate();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.floor(SESSION_CONFIG.WARNING_THRESHOLD_MS / 1000)
  );

  const lastActivityRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const isLoggingOutRef = useRef(false);
  const throttleRef = useRef(0);
  const broadcastChannelRef = useRef(null);

  // Perform full cleanup, sign out from Supabase, clear local storage and redirect
  const handleLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      // Broadcast logout to other tabs via channel
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'LOGOUT' });
      }

      // Signal logout via storage event fallback
      localStorage.setItem(
        SESSION_CONFIG.STORAGE_KEYS.LOGOUT_SIGNAL,
        Date.now().toString()
      );

      // Call Supabase auth signOut
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out during session timeout:', err);
    } finally {
      // Clear locally stored authentication/session data
      localStorage.removeItem(SESSION_CONFIG.STORAGE_KEYS.SESSION_START);
      localStorage.removeItem(SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
      sessionStorage.clear();

      // Redirect to login page
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Reset inactivity timer and sync across tabs
  const handleStayLoggedIn = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem(
      SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY,
      now.toString()
    );
    setShowWarningModal(false);

    // Notify other tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'REFRESH', timestamp: now });
    }
  }, []);

  // Initialize session timestamps & BroadcastChannel
  useEffect(() => {
    const now = Date.now();

    // Session Start timestamp
    const storedStart = localStorage.getItem(
      SESSION_CONFIG.STORAGE_KEYS.SESSION_START
    );
    if (storedStart) {
      sessionStartRef.current = parseInt(storedStart, 10);
    } else {
      sessionStartRef.current = now;
      localStorage.setItem(
        SESSION_CONFIG.STORAGE_KEYS.SESSION_START,
        now.toString()
      );
    }

    // Last Activity timestamp
    const storedActivity = localStorage.getItem(
      SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY
    );
    if (storedActivity) {
      lastActivityRef.current = parseInt(storedActivity, 10);
    } else {
      lastActivityRef.current = now;
      localStorage.setItem(
        SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY,
        now.toString()
      );
    }

    // Set up BroadcastChannel if supported
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(
        SESSION_CONFIG.BROADCAST_CHANNEL_NAME
      );
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === 'LOGOUT') {
          handleLogout();
        } else if (event.data.type === 'REFRESH') {
          const timestamp = event.data.timestamp || Date.now();
          lastActivityRef.current = timestamp;
          setShowWarningModal(false);
        }
      };
    }

    // Fallback: window storage event for tab synchronization
    const handleStorageChange = (e) => {
      if (e.key === SESSION_CONFIG.STORAGE_KEYS.LOGOUT_SIGNAL) {
        handleLogout();
      } else if (e.key === SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY && e.newValue) {
        const timestamp = parseInt(e.newValue, 10);
        if (!isNaN(timestamp)) {
          lastActivityRef.current = timestamp;
          setShowWarningModal(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [handleLogout]);

  // Handle user activity detection (mouse, keyboard, touch, scroll)
  useEffect(() => {
    const handleUserActivity = () => {
      const now = Date.now();

      // Throttle activity updates to optimize DOM performance
      if (now - throttleRef.current < SESSION_CONFIG.ACTIVITY_THROTTLE_MS) {
        return;
      }
      throttleRef.current = now;

      lastActivityRef.current = now;
      localStorage.setItem(
        SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY,
        now.toString()
      );

      // If warning modal was open and user interacts, reset warning
      setShowWarningModal((prev) => {
        if (prev) {
          // Notify other tabs
          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'REFRESH',
              timestamp: now,
            });
          }
          return false;
        }
        return false;
      });
    };

    const events = SESSION_CONFIG.ACTIVITY_EVENTS;
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Main ticker interval checking inactivity and hard 8-hour cap
  useEffect(() => {
    const checkSessionStatus = () => {
      if (isLoggingOutRef.current) return;

      const now = Date.now();
      const sessionDuration = now - sessionStartRef.current;
      const inactiveDuration = now - lastActivityRef.current;

      // 1. Check Maximum Hard Session Duration (8 hours)
      if (sessionDuration >= SESSION_CONFIG.MAX_SESSION_TIMEOUT_MS) {
        console.info('Maximum session duration reached (8 hours). Logging out.');
        handleLogout();
        return;
      }

      // 2. Check Inactivity Timeout (30 minutes)
      const timeRemaining = SESSION_CONFIG.INACTIVITY_TIMEOUT_MS - inactiveDuration;

      if (timeRemaining <= 0) {
        console.info('Inactivity timeout reached (30 minutes). Logging out.');
        handleLogout();
        return;
      }

      // 3. Check Warning Window (2 minutes before timeout)
      if (timeRemaining <= SESSION_CONFIG.WARNING_THRESHOLD_MS) {
        setShowWarningModal(true);
        setRemainingSeconds(Math.ceil(timeRemaining / 1000));
      } else {
        setShowWarningModal(false);
      }
    };

    // Run immediate check
    checkSessionStatus();

    // Check every second
    const intervalId = setInterval(checkSessionStatus, 1000);

    return () => clearInterval(intervalId);
  }, [handleLogout]);

  return (
    <>
      {children}
      <SessionTimeoutModal
        isOpen={showWarningModal}
        remainingSeconds={remainingSeconds}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogout}
      />
    </>
  );
};

export default SessionTimeoutHandler;
