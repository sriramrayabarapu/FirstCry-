import React, { useEffect, useRef } from 'react';

export default function ProfileModal({ open, onClose, user, portalMode }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  const isAdmin = portalMode === 'admin';

  const adminFields = [
    { icon: '📧', label: 'Email Address', value: user.email || 'admin@firstcryintellitots.in' },
    { icon: '🆔', label: 'Employee ID', value: user.employeeId || 'EMP-001' },
    { icon: '👔', label: 'Role', value: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin' },
    { icon: '🏫', label: 'Branch Name', value: user.branch || 'Intellitots — Bandra West' },
    { icon: '📅', label: 'Joined Date', value: user.joinedDate || 'Jan 15, 2023' },
  ];

  const parentFields = [
    { icon: '📧', label: 'Email Address', value: user.email || 'priya.sharma@gmail.com' },
    { icon: '📱', label: 'Phone Number', value: user.phone || '+91 98765 43210' },
    { icon: '👶', label: 'Child Name', value: user.childName || 'Aarav Sharma' },
    { icon: '📚', label: 'Program Enrolled', value: user.program || 'Nursery — 3 to 4 Years' },
    { icon: '✅', label: 'Admission Status', value: user.admissionStatus || 'Confirmed' },
    { icon: '📅', label: 'Joining Date', value: user.joiningDate || 'Jun 1, 2026' },
  ];

  const fields = isAdmin ? adminFields : parentFields;
  const gradient = isAdmin
    ? 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 60%, #C4B5FD 100%)'
    : 'linear-gradient(135deg, #065F46 0%, #10B981 60%, #6EE7B7 100%)';
  const accentColor = isAdmin ? '#8B5CF6' : '#10B981';
  const portalLabel = isAdmin ? '💼 Admin Portal' : '👨‍👩‍👧 Parent Portal';

  return (
    <div
      className="pm-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="pm-card">
        {/* Header Banner */}
        <div className="pm-banner" style={{ background: gradient }}>
          <div className="pm-banner-pattern" />
          <button className="pm-close-btn" onClick={onClose} title="Close">✕</button>

          {/* Avatar */}
          <div className="pm-avatar-wrap">
            <div className="pm-avatar" style={{ boxShadow: `0 0 0 4px ${accentColor}55, 0 8px 24px rgba(0,0,0,0.3)` }}>
              {user.initials || 'U'}
            </div>
            <div className="pm-avatar-ring" style={{ borderColor: `${accentColor}88` }} />
          </div>

          <div className="pm-banner-name">{user.name}</div>
          <div className="pm-portal-badge" style={{ background: `${accentColor}33`, border: `1px solid ${accentColor}66` }}>
            {portalLabel}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="pm-body">
          <div className="pm-fields-grid">
            {fields.map((f, i) => (
              <div className="pm-field-row" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="pm-field-icon">{f.icon}</div>
                <div className="pm-field-info">
                  <div className="pm-field-label">{f.label}</div>
                  <div className="pm-field-value">{f.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pm-actions">

            <button className="pm-btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
