import React, { useState, useEffect } from 'react';
import { enquiryAPI } from '../services/enquiryAPI';

export default function Enquiry({ onShowToast, portalMode }) {
  // Form State
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [source, setSource] = useState('Walk-in');
  const [notes, setNotes] = useState('');

  // Table State
  const [enquiries, setEnquiries] = useState([]);

  const loadEnquiries = () => {
    enquiryAPI.getEnquiries()
      .then(json => {
        if (json.success) setEnquiries(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (portalMode === 'admin') {
      loadEnquiries();
    }
  }, [portalMode]);

  const handleClear = () => {
    setParentName('');
    setChildName('');
    setAge('');
    setPhone('');
    setEmail('');
    setProgram('');
    setVisitDate('');
    setSource('Walk-in');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!parentName || !childName || !phone || !program) {
      onShowToast('⚠️ Please fill in all required fields (Parent, Child, Phone, Program)');
      return;
    }

    try {
      const res = await enquiryAPI.submitEnquiry({
        parent: parentName,
        child: childName,
        age,
        phone,
        email,
        program,
        visit_date: visitDate,
        source,
        notes
      });

      if (res.success) {
        onShowToast(`✅ Enquiry captured! WhatsApp confirmation dispatched to ${phone}`);
        handleClear();
      }
    } catch (e) {
      onShowToast('❌ Failed to record enquiry: ' + e.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        onShowToast(`✅ Enquiry status updated to ${newStatus}`);
        loadEnquiries();
      } else {
        throw new Error('Update failed');
      }
    } catch (e) {
      onShowToast('❌ Failed to update status: ' + e.message);
    }
  };

  if (portalMode === 'admin') {
    return (
      <div id="page-enquiry" className="page active">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Manage Enquiries</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Child</th>
                <th>Program</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((r, idx) => (
                <tr key={idx}>
                  <td><strong>{r.parent}</strong></td>
                  <td>{r.child}</td>
                  <td><span className="badge badge-purple">{r.program}</span></td>
                  <td>{r.phone || '—'}</td>
                  <td>
                    <select 
                      value={r.status} 
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="New">New</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div id="page-enquiry" className="page active">
      <div className="card form-card-3d" style={{ maxWidth: '680px' }}>
        <div className="form-row delay-1">
          <div className="form-group">
            <label className="form-label">Parent / Guardian Name *</label>
            <input className="form-control" placeholder="e.g. Sunita Patel" value={parentName} onChange={e => setParentName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Child Name *</label>
            <input className="form-control" placeholder="e.g. Riya Patel" value={childName} onChange={e => setChildName(e.target.value)} />
          </div>
        </div>

        <div className="form-row delay-2">
          <div className="form-group">
            <label className="form-label">Child Age</label>
            <input className="form-control" placeholder="e.g. 3 years 2 months" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input className="form-control" placeholder="+91 9XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-row delay-3">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" placeholder="parent@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Program Interested In *</label>
            <select className="form-control" value={program} onChange={e => setProgram(e.target.value)}>
              <option value="">— Select Program —</option>
              <option value="Playgroup">Playgroup (1.5–2.5 yrs)</option>
              <option value="Nursery">Nursery (2.5–3.5 yrs)</option>
              <option value="LKG">LKG (3.5–4.5 yrs)</option>
              <option value="UKG">UKG (4.5–5.5 yrs)</option>
              <option value="Daycare">Daycare</option>
            </select>
          </div>
        </div>

        <div className="form-row delay-4">
          <div className="form-group">
            <label className="form-label">Preferred Visit Date</label>
            <input className="form-control" type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Lead Source</label>
            <select className="form-control" value={source} onChange={e => setSource(e.target.value)}>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Google Search">Google Search</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Social Media">Social Media</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group delay-5">
          <label className="form-label">Additional Notes</label>
          <textarea className="form-control" rows="3" placeholder="Any specific requirements or notes..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
        </div>

        <div className="form-row delay-6" style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
          <button className="btn btn-primary btn-submit-glow" onClick={handleSubmit} style={{ flex: 1, justifyContent: 'center' }}>
            📤 Submit Enquiry
          </button>
          <button className="btn btn-outline" onClick={handleClear}>✕ Clear</button>
        </div>
      </div>
    </div>
  );
}
