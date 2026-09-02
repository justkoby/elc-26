// Admin Portal Session Timeout Configuration
export const SESSION_CONFIG = {
  /**
   * Inactivity timeout duration in milliseconds.
   * Default: 30 minutes (30 * 60 * 1000 ms).
   */
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000,

  /**
   * Warning threshold before logout in milliseconds.
   * The warning modal will display 2 minutes before session expiration.
   * Default: 2 minutes (2 * 60 * 1000 ms).
   */
  WARNING_THRESHOLD_MS: 2 * 60 * 1000,

  /**
   * Maximum hard session duration in milliseconds (even if active).
   * Default: 8 hours (8 * 60 * 60 * 1000 ms).
   */
  MAX_SESSION_TIMEOUT_MS: 8 * 60 * 60 * 1000,

  /**
   * Domestic browser interaction event types to monitor for user activity.
   */
  ACTIVITY_EVENTS: [
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keydown',
    'touchstart',
    'touchmove',
    'wheel',
  ],

  /**
   * Throttle delay (in ms) for event handlers to prevent performance overhead.
   */
  ACTIVITY_THROTTLE_MS: 1000,

  /**
   * Local storage keys used for multi-tab sync & session state persistence.
   */
  STORAGE_KEYS: {
    SESSION_START: 'ylc_admin_session_start',
    LAST_ACTIVITY: 'ylc_admin_last_activity',
    LOGOUT_SIGNAL: 'ylc_admin_logout_signal',
  },

  /**
   * BroadcastChannel name for real-time tab synchronization.
   */
  BROADCAST_CHANNEL_NAME: 'ylc_admin_session_channel',
};
