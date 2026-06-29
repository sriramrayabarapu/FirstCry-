import React from 'react';

const adminNavItems = [
  { section: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'occupancy', label: 'Occupancy', icon: '🏫' }
  ]},
  { section: 'Admissions', items: [
    { id: 'enquiry', label: 'Enquiry Form', icon: '📝' },
    { id: 'tour', label: 'Tour Booking', icon: '📅' },
    { id: 'prebook', label: 'Pre-booking', icon: '🎫' }
  ]},
  { section: 'Operations', items: [
    { id: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
    { id: 'fees', label: 'Fees', icon: '💰' }
  ]},
  { section: 'Reports', items: [
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'admin', label: 'Admin Panel', icon: '⚙️' }
  ]}
];

const parentNavItems = [
  { section: 'My Child', items: [
    { id: 'parents', label: 'Student Record', icon: '👨‍👩‍👧' }
  ]},
  { section: 'Services', items: [
    { id: 'referrals', label: 'Referrals', icon: '🎁' },
    { id: 'feedback', label: 'Give Feedback', icon: '⭐' }
  ]}
];

export default function Sidebar({ activePage, setActivePage, portalMode, setPortalMode, onMobileClose }) {
  const currentNavItems = portalMode === 'admin' ? adminNavItems : parentNavItems;

  const handleNavClick = (id) => {
    setActivePage(id);
    if (onMobileClose) onMobileClose();
  };

  return (
    <nav id="sidebar">
      <div className="sidebar-logo">
        <a className="logo-mark" href="#" onClick={() => setPortalMode('public')}>
          <div className="logo-icon">🌱</div>
          <div>
            <div className="logo-text">FirstCry Intellitots</div>
            <div className="logo-sub">Preschool & Daycare</div>
          </div>
        </a>
      </div>
      
      <div className="sidebar-portal-badge" style={{ padding: '0.4rem 1.25rem', fontSize: '10.5px', color: '#FFF', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.75rem' }}>
        {portalMode === 'admin' ? '💼 Staff Console' : '👨‍👩‍👧 Parent Dashboard'}
      </div>
      
      {currentNavItems.map((section, idx) => (
        <div className="nav-section" key={idx}>
          <div className="nav-label">{section.section}</div>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.25)', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '11.5px', background: 'transparent' }}
          onClick={() => setPortalMode('public')}
        >
          🚪 Exit to Public Site
        </button>
      </div>
    </nav>
  );
}
