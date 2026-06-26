import React, { useState, useEffect } from 'react';

export default function Admin({ onShowToast }) {
  const [line1, setLine1] = useState('🍱 Lunch: Vegetable Khichdi + Raita | 🎨 Activity: Finger Painting');
  const [line2, setLine2] = useState("🎉 Event: Parents' Open Day — 4:00 PM | 📢 Notice: Diwali holiday on Nov 1st");
  
  const [stats, setStats] = useState({
    capacity: 240,
    filled: 187,
    waitlist: 19,
    confirmedAdmissions: 187,
    pendingEnquiries: 34,
    totalRevenue: 840000,
    pendingFees: 180000
  });

  const [users, setUsers] = useState([]);

  const loadData = () => {
    // Announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.line1) {
          setLine1(json.data.line1);
          setLine2(json.data.line2);
        }
      })
      .catch(err => console.error(err));

    // Stats
    fetch('/api/reports/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) setStats(json.data);
      })
      .catch(err => console.error(err));

    // Users
    fetch('/api/users')
      .then(res => res.json())
      .then(json => {
        if (json.success) setUsers(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateAnnouncements = async () => {
    if (!line1 || !line2) {
      onShowToast('⚠️ Announcement lines cannot be blank.');
      return;
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line1, line2 })
      });

      if (response.ok) {
        onShowToast("✅ Today's Special updated and published!");
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      onShowToast('❌ Announcement publish error: ' + e.message);
    }
  };

  const handleAddUser = async () => {
    const name = prompt('Enter name of the new user:');
    if (!name) return;
    const role = prompt('Enter role (e.g. Centre Head, Counsellor, Teacher, Accounts):', 'Counsellor');
    if (!role) return;
    const email = prompt('Enter email address:');
    if (!email) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, email })
      });

      if (response.ok) {
        onShowToast(`👤 New user "${name}" invited successfully!`);
        loadData();
      } else {
        throw new Error('Invite failed');
      }
    } catch (e) {
      onShowToast('❌ User invitation failure: ' + e.message);
    }
  };

  return (
    <div id="page-admin" className="page active">
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '1rem' }}>✏️ Today's Special Editor</div>
          <div className="form-group">
            <label className="form-label">Announcement Line 1 (Menu/Activity)</label>
            <input className="form-control" value={line1} onChange={e => setLine1(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Announcement Line 2 (Events/Notices)</label>
            <input className="form-control" value={line2} onChange={e => setLine2(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleUpdateAnnouncements}>
            💾 Save & Publish
          </button>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '1rem' }}>📊 Quick Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>👶</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>{stats.confirmedAdmissions}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Total Students</div>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>📝</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>{stats.pendingEnquiries}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Active Enquiries</div>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>👩‍🏫</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>12</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Teachers</div>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>💰</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>₹{(stats.pendingFees / 100000).toFixed(1)}L</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Pending Fees</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">System Users</div>
          <button className="btn btn-primary btn-sm" onClick={handleAddUser}>
            + Add User
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={idx}>
                <td><strong>{u.name}</strong></td>
                <td><span className="badge badge-purple">{u.role}</span></td>
                <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{u.login}</td>
                <td><span className="badge badge-success">{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
