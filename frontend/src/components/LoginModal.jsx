import React, { useState, useEffect } from 'react';

// ─── Credentials Store ───────────────────────────────────────────────────────
const CREDENTIALS = {
  admin: [
    { username: 'admin', password: 'Admin@123', name: 'Admin Director', initials: 'AD' },
    { username: 'director', password: 'Director@2026', name: 'Centre Director', initials: 'CD' },
  ],
  parent: [
    { username: 'parent', password: 'Parent@123', name: 'Priya Sharma', initials: 'PS' },
    { username: 'priya.sharma', password: 'Priya@2026', name: 'Priya Sharma', initials: 'PS' },
    { username: 'rahul.verma', password: 'Rahul@2026', name: 'Rahul Verma', initials: 'RV' },
  ],
};

export default function LoginModal({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);


  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setError('');
      setSuccess(false);
      setLoading(false);
      setShake(false);
    }
  }, [open]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate async auth
    setTimeout(() => {
      const usernameInput = username.trim().toLowerCase();

      const adminMatch = CREDENTIALS.admin.find(
        c => c.username.toLowerCase() === usernameInput && c.password === password
      );

      const parentMatch = CREDENTIALS.parent.find(
        c => c.username.toLowerCase() === usernameInput && c.password === password
      );

      const match = adminMatch || parentMatch;
      const matchedPortal = adminMatch ? 'admin' : 'parent';

      if (match) {
        setSuccess(true);
        setTimeout(() => {
          onLogin(matchedPortal, match);
          onClose();
        }, 900);
      } else {
        setLoading(false);
        setError('Invalid username or password. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (!open) return null;

  return (
    <div className="lm-overlay" onClick={(e) => { if (e.target.className === 'lm-overlay') onClose(); }}>
      <div className={`lm-card ${shake ? 'lm-shake' : ''} ${success ? 'lm-success' : ''}`}>

        {/* Background orbs */}
        <div className="lm-orb lm-orb-1" style={{ background: '#8B5CF6' }} />
        <div className="lm-orb lm-orb-2" style={{ background: '#8B5CF6' }} />

        {/* Header */}
        <div className="lm-header" style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #C4B5FD 100%)' }}>
          <div className="lm-header-icon">🌱</div>
          <div className="lm-header-brand">
            <div className="lm-brand-name">FirstCry Intellitots</div>
            <div className="lm-brand-tagline">Preschool Management Portal</div>
          </div>
          <button className="lm-close-btn" onClick={onClose}>✕</button>
        </div>



        {/* Form Body */}
        <div className="lm-body">
          <div className="lm-title" style={{ color: '#6D28D9' }}>Portal Login</div>

          {/* Username */}
          <div className="lm-field-group">
            <label className="lm-label">Username</label>
            <div className="lm-input-wrap">
              <span className="lm-input-icon">👤</span>
              <input
                id="lm-username"
                type="text"
                className="lm-input"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password */}
          <div className="lm-field-group">
            <label className="lm-label">Password</label>
            <div className="lm-input-wrap">
              <span className="lm-input-icon">🔒</span>
              <input
                id="lm-password"
                type={showPw ? 'text' : 'password'}
                className="lm-input"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                disabled={loading || success}
              />
              <button
                className="lm-pw-toggle"
                type="button"
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="lm-error">
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            className={`lm-btn-login ${loading ? 'lm-btn-loading' : ''} ${success ? 'lm-btn-success' : ''}`}
            style={{
              background: success
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #C4B5FD 100%)',
            }}
            onClick={handleLogin}
            disabled={loading || success}
          >
            {success ? (
              <><span>✅</span> Welcome! Redirecting...</>
            ) : loading ? (
              <><span className="lm-spinner" />Authenticating...</>
            ) : (
              <>🔐 Sign In</>
            )}
          </button>


        </div>
      </div>
    </div>
  );
}
