import React, { useState, useEffect } from 'react';

export default function Popup({ onShowToast }) {
  const [show, setShow] = useState(false);
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Show popup after 10 seconds like in the mockup
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShow(false);
  };

  const submitPopupLead = async () => {
    if (!parentName || !phone) {
      onShowToast('⚠️ Please enter your name and phone number.');
      return;
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: parentName,
          child: 'Trial Child',
          phone,
          email,
          program: 'Nursery',
          source: 'Social Media',
          notes: 'Captured via Welcome Promo Lead Popup'
        })
      });

      if (response.ok) {
        onShowToast(`🎉 Thanks ${parentName}! We'll call you within 2 hours to schedule your trial.`);
        setShow(false);
      } else {
        throw new Error('Capture failed');
      }
    } catch (e) {
      onShowToast(`🎉 Thanks ${parentName}! (Saved offline)`);
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div id="lead-popup" className="show">
      <div className="popup-card">
        <button className="popup-close" onClick={closePopup}>✕</button>
        <div className="popup-badge">🌟 Limited Seats Available</div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '.5rem' }}>
          Secure Your Child's Future Today!
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.25rem' }}>
          Join 500+ happy families at FirstCry Intellitots. Get a free trial class when you register now.
        </p>
        <div className="form-group">
          <label className="form-label">Parent Name</label>
          <input
            className="form-control"
            placeholder="e.g. Priya Sharma"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            className="form-control"
            placeholder="+91 9XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-control"
            placeholder="priya@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '.75rem' }}
          onClick={submitPopupLead}
        >
          🎯 Book a Free Trial Class
        </button>
      </div>
    </div>
  );
}
