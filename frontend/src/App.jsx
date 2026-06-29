import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Popup from './components/Popup';
import SplashScreen from './components/SplashScreen';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';

// Import Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import Occupancy from './pages/Occupancy';
import Enquiry from './pages/Enquiry';
import Tour from './pages/Tour';
import Prebook from './pages/Prebook';
import Teachers from './pages/Teachers';
import Parents from './pages/Parents';
import Fees from './pages/Fees';
import Referrals from './pages/Referrals';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';

// ── Extended user profile data keyed by username ────────────────────────────
const USER_PROFILES = {
  // Admin accounts
  admin: {
    email: 'admin@firstcryintellitots.in',
    employeeId: 'EMP-001',
    branch: 'Intellitots — Bandra West',
    joinedDate: 'Jan 15, 2023',
  },
  director: {
    email: 'director@firstcryintellitots.in',
    employeeId: 'EMP-002',
    branch: 'Intellitots — Bandra West',
    joinedDate: 'Mar 10, 2022',
  },
  // Parent accounts
  parent: {
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    childName: 'Aarav Sharma',
    program: 'Nursery — 3 to 4 Years',
    admissionStatus: 'Confirmed',
    joiningDate: 'Jun 1, 2026',
  },
  'priya.sharma': {
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    childName: 'Aarav Sharma',
    program: 'Nursery — 3 to 4 Years',
    admissionStatus: 'Confirmed',
    joiningDate: 'Jun 1, 2026',
  },
  'rahul.verma': {
    email: 'rahul.verma@gmail.com',
    phone: '+91 91234 56789',
    childName: 'Riya Verma',
    program: 'Playgroup — 2 to 3 Years',
    admissionStatus: 'Confirmed',
    joiningDate: 'Apr 15, 2026',
  },
};

export default function App() {
  const [portalMode, setPortalMode] = useState('public'); // 'public', 'admin', 'parent'
  const [activePage, setActivePage] = useState('landing');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // { name, initials, role, ...profile }

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mobile sidebar state (for admin/parent on mobile)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => { setFadeSplash(true); }, 3000);
    const removeTimeout = setTimeout(() => { setShowSplash(false); }, 3800);
    return () => { clearTimeout(fadeTimeout); clearTimeout(removeTimeout); };
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); }, 3000);
  };

  // Called when user selects a portal from the dropdown
  const handlePortalChange = (mode) => {
    if (mode === 'public') {
      setPortalMode('public');
      setLoggedInUser(null);
      setActivePage('landing');
      if (portalMode !== 'public') {
        triggerToast('👋 Returned to Visitor View.');
      }
    } else if (mode === 'admin' || mode === 'parent') {
      setShowLoginModal(true);
    }
  };

  // Called by LoginModal on successful login
  const handleLogin = (portal, userInfo) => {
    // Merge base userInfo with extended profile data
    const profileExtras = USER_PROFILES[userInfo.username] || {};
    const enrichedUser = {
      ...userInfo,
      ...profileExtras,
      role: portal,
    };

    setPortalMode(portal === 'user' ? 'public' : portal);
    setLoggedInUser(enrichedUser);

    if (portal === 'admin') {
      setActivePage('dashboard');
      triggerToast(`✅ Welcome back, ${userInfo.name}! Admin portal loaded.`);
    } else if (portal === 'parent') {
      setActivePage('parents');
      triggerToast(`👨‍👩‍👧 Welcome, ${userInfo.name}! Parent portal loaded.`);
    } else {
      setActivePage('landing');
      triggerToast(`🌐 Welcome, ${userInfo.name}! Visitor/Staff view loaded.`);
    }
    setShowLoginModal(false);
  };

  // Logout — clear everything, return to visitor view
  const handleLogout = () => {
    const userName = loggedInUser?.name;
    setPortalMode('public');
    setLoggedInUser(null);
    setActivePage('landing');
    setShowProfileModal(false);
    setMobileSidebarOpen(false);
    triggerToast(`👋 Goodbye, ${userName}! You have been logged out.`);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <Home setActivePage={setActivePage} setPortalMode={handlePortalChange} onShowToast={triggerToast} />;
      case 'about':
        return <AboutUs setActivePage={setActivePage} onShowToast={triggerToast} />;
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} onShowToast={triggerToast} />;
      case 'occupancy':
        return <Occupancy onShowToast={triggerToast} />;
      case 'enquiry':
        return <Enquiry onShowToast={triggerToast} portalMode={portalMode} />;
      case 'tour':
        return <Tour onShowToast={triggerToast} />;
      case 'prebook':
        return <Prebook onShowToast={triggerToast} />;
      case 'teachers':
        return <Teachers onShowToast={triggerToast} />;
      case 'parents':
        return <Parents onShowToast={triggerToast} />;
      case 'fees':
        return <Fees onShowToast={triggerToast} />;
      case 'referrals':
        return <Referrals onShowToast={triggerToast} />;
      case 'reports':
        return <Reports onShowToast={triggerToast} />;
      case 'feedback':
        return <Feedback onShowToast={triggerToast} />;
      case 'admin':
        return <Admin onShowToast={triggerToast} />;
      default:
        return <Home setActivePage={setActivePage} setPortalMode={handlePortalChange} onShowToast={triggerToast} />;
    }
  };

  return (
    <div className={[
      portalMode === 'public' ? 'no-sidebar' : '',
      portalMode !== 'public' ? 'with-sidebar-mobile' : '',
      mobileSidebarOpen ? 'sidebar-open' : ''
    ].filter(Boolean).join(' ')}>
      {showSplash && <SplashScreen fadeOut={fadeSplash} />}

      {portalMode !== 'public' && (
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          portalMode={portalMode}
          setPortalMode={handlePortalChange}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      )}

      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onShowToast={triggerToast}
        portalMode={portalMode}
        setPortalMode={handlePortalChange}
        loggedInUser={loggedInUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setMobileSidebarOpen(p => !p)}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <main id="main">
        {renderActivePage()}
      </main>

      {/* FLOATING ACTION BUTTONS */}
      <div className="float-btns">
        <button className="float-btn float-call" onClick={() => triggerToast('📞 Initiating call with Centre Admin...')} title="Call">📞</button>
        <button className="float-btn float-wa" onClick={() => triggerToast('💬 Redirecting to WhatsApp live chat...')} title="WhatsApp">💬</button>
      </div>

      {/* DELAYED TRIAL ADMISSION POPUP */}
      <Popup onShowToast={triggerToast} />

      {/* LOGIN MODAL */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* PROFILE MODAL */}
      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={loggedInUser}
        portalMode={portalMode}
      />

      {/* TOAST SYSTEM ALERTS */}
      <div id="toast" className={showToast ? 'show' : ''}>
        {toastMsg}
      </div>
    </div>
  );
}
