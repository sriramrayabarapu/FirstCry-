import React, { useState, useEffect, useRef } from 'react';

const pageTitles = {
  landing: { title: 'Home — Welcome', sub: 'FirstCry Intellitots Management Platform' },
  about: { title: 'About Us', sub: 'Learn about our early learning environment, child pedagogy, and visionary leadership' },
  dashboard: { title: 'Admission Dashboard', sub: 'Real-time overview of admissions, occupancy, and revenue performance' },
  occupancy: { title: 'Occupancy Management', sub: 'Track classroom capacity, availability, and waitlists in real-time' },
  enquiry: { title: 'Parent Enquiry Form', sub: 'Submit a new admission enquiry. All fields will be saved to the database.' },
  counsellor: { title: 'Counsellor Dashboard', sub: 'Manage leads, follow-ups, and track conversion performance' },
  tour: { title: 'Tour Booking Calendar', sub: 'Schedule and manage school visit tours for prospective families' },
  teachers: { title: 'Teacher Dashboard', sub: 'Manage teacher records, attendance, and classroom activities' },
  parents: { title: 'Parent Portal', sub: "Track your child's progress, attendance, and school communications" },
  fees: { title: 'Fee Management', sub: 'Track fees, pending dues, and generate payment receipts' },
  referrals: { title: 'Loyalty Referral Program', sub: 'Track referrals, rewards, and parent ambassadors' },
  reports: { title: 'Reports & Analytics', sub: 'Download and view comprehensive operational reports' },
  feedback: { title: 'Customer Feedback', sub: 'Collect and analyse satisfaction ratings from families' },
  prebook: { title: 'Online Pre-Booking', sub: 'Reserve a seat for your child before the official admission opens' },
  admin: { title: 'Admin Panel', sub: 'Manage all settings, users, campaigns, and centre configuration' }
};

const mobileNavItems = [
  { id: 'landing', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About Us', icon: '🏫' },
  { id: 'enquiry', label: 'Apply Online', icon: '📝' },
  { id: 'tour', label: 'Book Tour', icon: '📅' },
  { id: 'prebook', label: 'Pre-book Seat', icon: '🎫' },
];

export default function Header({
  activePage,
  setActivePage,
  onShowToast,
  portalMode,
  setPortalMode,
  loggedInUser,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  onToggleSidebar,
  mobileSidebarOpen,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [portalAnimStage, setPortalAnimStage] = useState(0);
  const [transitioningPage, setTransitioningPage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentTitle = pageTitles[activePage] || { title: activePage, sub: 'Management Portal' };

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, targetPage) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (activePage === targetPage || transitioningPage !== null) return;

    setTransitioningPage(targetPage);
    setPortalAnimStage(1);
    document.body.classList.add('apply-portal-transitioning');

    setTimeout(() => { setPortalAnimStage(2); }, 150);
    setTimeout(() => { setPortalAnimStage(3); }, 550);
    setTimeout(() => {
      setActivePage(targetPage);
      setTransitioningPage(null);
      setPortalAnimStage(0);
      document.body.classList.remove('apply-portal-transitioning');
      document.body.classList.add('apply-portal-entered');
      setTimeout(() => { document.body.classList.remove('apply-portal-entered'); }, 1500);
    }, 1350);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/reports/download/csv/admissions');
      if (!response.ok) throw new Error('Download failed');
      const csvText = await response.text();
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'intellitots_admissions.csv';
      a.click();
      onShowToast('✅ Admissions CSV exported successfully!');
    } catch (e) {
      onShowToast('❌ Failed to export CSV: ' + e.message);
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    onLogout();
  };

  const renderNavButton = (pageId, label) => {
    const isActive = activePage === pageId;
    const isTrans = transitioningPage === pageId;
    const currentStage = isTrans ? portalAnimStage : 0;

    return (
      <button
        key={pageId}
        className={`btn-nav-apply ${isActive ? 'active' : ''} stage-${currentStage}`}
        onClick={(e) => handleNavClick(e, pageId)}
      >
        <span className="btn-label-text">{label}</span>
        <span className="btn-shine-light"></span>
        <div className="btn-sparkles">
          <span>✨</span><span>⭐</span><span>✨</span>
        </div>
        {currentStage >= 2 && <div className="portal-ring"></div>}
        {currentStage >= 2 && <div className="portal-door-left"></div>}
        {currentStage >= 2 && <div className="portal-door-right"></div>}
        {currentStage === 3 && (
          <div className="portal-floating-icons">
            <span className="admission-icon paper">📄</span>
            <span className="admission-icon pencil">✏️</span>
            <span className="admission-icon card">🪪</span>
            <span className="admission-icon badge">🎖️</span>
            <span className="admission-icon cal">📅</span>
          </div>
        )}
      </button>
    );
  };

  const dropdownLabel =
    portalMode === 'admin'
      ? '💼 Admin Portal'
      : portalMode === 'parent'
      ? '👨‍👩‍👧 Parent Portal'
      : '🌐 Visitor View';

  const renderDropdownContent = () => {
    if (loggedInUser) {
      const isModeAdmin = portalMode === 'admin';
      return (
        <>
          <div className="portal-dropdown-item active" style={{ cursor: 'default' }}>
            {isModeAdmin ? '💼 Admin Portal' : '👨‍👩‍👧 Parent Portal'}
            <span className="pd-active-chip">Active</span>
          </div>
          <div className="pd-user-row">
            <div className="pd-user-avatar">{loggedInUser.initials}</div>
            <div className="pd-user-info">
              <div className="pd-user-name">{loggedInUser.name}</div>
              <div className="pd-user-role">{isModeAdmin ? 'Administrator' : 'Parent Account'}</div>
            </div>
          </div>
          <div className="pd-divider" />
          <button className="pd-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </>
      );
    }

    return (
      <>
        <div className="pd-section-label">Switch Portal</div>
        <div
          className={`portal-dropdown-item ${portalMode === 'public' ? 'active' : ''}`}
          onClick={() => { setPortalMode('public'); setShowDropdown(false); }}
        >
          🌐 Visitor View
          <span className="pd-badge pd-badge-free">No login</span>
        </div>
        <div
          className="portal-dropdown-item"
          onClick={() => { setShowDropdown(false); setPortalMode('parent'); }}
        >
          👨‍👩‍👧 Parent Portal
          <span className="pd-badge pd-badge-auth">Login</span>
        </div>
        <div
          className="portal-dropdown-item"
          onClick={() => { setShowDropdown(false); setPortalMode('admin'); }}
        >
          💼 Admin Portal
          <span className="pd-badge pd-badge-auth">Login</span>
        </div>
      </>
    );
  };

  return (
    <>
      <header id="header">
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

          {/* ── Left: Title + Desktop Nav ── */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            {/* Brand / Title */}
            <div className="header-brand-block">
              <div className="header-title">
                {portalMode === 'admin' ? '💼 Staff: ' : portalMode === 'parent' ? '👨‍👩‍👧 Parent: ' : ''}
                {currentTitle.title}
              </div>
              <div className="header-sub hide-on-mobile">{currentTitle.sub}</div>
            </div>

            {/* Desktop horizontal nav (visitor only) */}
            {portalMode === 'public' && (
              <div className="header-nav desktop-nav" style={{ alignItems: 'center' }}>
                {renderNavButton('landing', 'Home')}
                {renderNavButton('about', 'About Us')}
                {renderNavButton('enquiry', 'Apply Online')}
                {renderNavButton('tour', 'Book Tour')}
                {renderNavButton('prebook', 'Pre-book Seat')}
              </div>
            )}
          </div>

          {/* ── Right: Actions ── */}
          <div className="header-actions">
            {portalMode === 'admin' && (
              <button className="btn btn-outline btn-sm hide-on-mobile" onClick={handleExportCSV}>
                ⬇ Export CSV
              </button>
            )}

            {/* Portal Dropdown (logged-in) / Login Button (visitor) */}
            {loggedInUser ? (
              <div className="portal-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className={`portal-dropdown-btn ${showDropdown ? 'open' : ''}`}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="dropdown-label-text">{dropdownLabel}</span>
                  <span className={`pd-chevron ${showDropdown ? 'rotated' : ''}`}>▾</span>
                </button>
                {showDropdown && (
                  <div className="portal-dropdown-menu">
                    {renderDropdownContent()}
                  </div>
                )}
              </div>
            ) : (
              <button className="header-login-btn" onClick={onOpenLogin}>
                🔐 <span className="login-btn-text">Login</span>
              </button>
            )}

            {/* Avatar (only show if logged in) */}
            {loggedInUser && (
              <div
                className="avatar avatar-active"
                title={`${loggedInUser.name} — Click to view profile`}
                style={{ cursor: 'pointer' }}
                onClick={onOpenProfile}
              >
                {loggedInUser.initials}
              </div>
            )}

            {/* Hamburger — visitor: opens slide menu | logged-in: opens sidebar */}
            {portalMode === 'public' ? (
              <button
                className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <span className="ham-bar" />
                <span className="ham-bar" />
                <span className="ham-bar" />
              </button>
            ) : (
              <button
                className={`hamburger-btn ${mobileSidebarOpen ? 'open' : ''}`}
                onClick={onToggleSidebar}
                aria-label="Toggle sidebar"
              >
                <span className="ham-bar" />
                <span className="ham-bar" />
                <span className="ham-bar" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {portalMode === 'public' && (
        <>
          {/* Backdrop */}
          <div
            className={`mobile-menu-backdrop ${mobileMenuOpen ? 'visible' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in drawer */}
          <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
            {/* Drawer header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-brand">
                <span className="mobile-menu-icon">🌱</span>
                <div>
                  <div className="mobile-menu-name">FirstCry Intellitots</div>
                  <div className="mobile-menu-tagline">Preschool & Daycare</div>
                </div>
              </div>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            {/* Nav items */}
            <nav className="mobile-menu-nav">
              {mobileNavItems.map((item, idx) => (
                <button
                  key={item.id}
                  className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
                  style={{ animationDelay: mobileMenuOpen ? `${idx * 0.06}s` : '0s' }}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                  {activePage === item.id && <span className="mobile-nav-active-dot" />}
                </button>
              ))}
            </nav>

            {/* Footer actions */}
            <div className="mobile-menu-footer">
              <button
                className="mobile-login-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              >
                🔐 Login to Portal
              </button>
              <div className="mobile-menu-contact">
                <span>📞 +91 90000 12345</span>
                <span>✉️ admissions@intellitots.com</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
