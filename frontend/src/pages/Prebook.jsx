import React, { useState, useEffect } from 'react';

export default function Prebook({ onShowToast }) {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [dob, setDob] = useState('');
  const [program, setProgram] = useState('Nursery');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);

  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
    fetch('/api/prebooks')
      .then(res => res.json())
      .then(json => {
        if (json.success) setBookings(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handlePrebook = async () => {
    if (!parentName || !childName || !phone) {
      onShowToast('⚠️ Please enter parent name, child name, and phone number.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('parent', parentName);
      formData.append('child', childName);
      formData.append('dob', dob);
      formData.append('program', program);
      formData.append('phone', phone);
      if (photo) formData.append('photo', photo);

      const response = await fetch('/api/prebooks', {
        method: 'POST',
        body: formData // Sends multipart form data
      });

      if (response.ok) {
        onShowToast('🎫 Seat pre-booked! Confirmation link sent via WhatsApp.');
        setParentName('');
        setChildName('');
        setDob('');
        setPhone('');
        setPhoto(null);
        loadBookings();
      } else {
        throw new Error('Pre-booking failed');
      }
    } catch (e) {
      onShowToast('❌ Pre-booking error: ' + e.message);
    }
  };

  return (
    <div id="page-prebook" className="page active">
      <div className="grid-2">
        <div className="card form-card-3d">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>🎫 Reserve a Seat</div>
          <div className="form-group delay-1">
            <label className="form-label">Parent Name *</label>
            <input className="form-control" placeholder="Full name" value={parentName} onChange={e => setParentName(e.target.value)} />
          </div>
          <div className="form-group delay-2">
            <label className="form-label">Child Name *</label>
            <input className="form-control" placeholder="Child's full name" value={childName} onChange={e => setChildName(e.target.value)} />
          </div>
          <div className="form-row delay-3">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-control" type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Program</label>
              <select className="form-control" value={program} onChange={e => setProgram(e.target.value)}>
                <option>Playgroup</option>
                <option>Nursery</option>
                <option>LKG</option>
                <option>UKG</option>
              </select>
            </div>
          </div>
          <div className="form-group delay-4">
            <label className="form-label">Phone *</label>
            <input className="form-control" placeholder="+91 9XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group delay-5">
            <label className="form-label">Upload Child Photo (Optional)</label>
            <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div style={{ background: 'var(--primary-light)', borderRadius: '10px', padding: '1rem', fontSize: '13px', color: 'var(--primary)', marginBottom: '1rem' }}>
            💡 Pre-booking amount: ₹2,500 (adjustable against admission fees). Fully refundable if admission is not confirmed.
          </div>
          <button className="btn btn-primary btn-submit-glow delay-6" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePrebook}>
            🎫 Pre-book & Pay ₹2,500
          </button>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Pre-booking Status</div></div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Program</th>
                <th>Booked On</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((r, idx) => (
                <tr key={idx}>
                  <td><strong>{r.child}</strong></td>
                  <td><span className="badge badge-purple">{r.program}</span></td>
                  <td>{r.date}</td>
                  <td>
                    <span className={`badge ${r.payment === 'Paid' ? 'badge-success' : r.payment === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                      {r.payment}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.status === 'Confirmed' ? 'badge-success' : r.status === 'On Hold' ? 'badge-danger' : 'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
