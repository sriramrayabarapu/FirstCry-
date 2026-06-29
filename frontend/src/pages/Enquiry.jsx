import React, { useState, useEffect } from 'react';
import { enquiryAPI } from '../services/enquiryAPI';

export default function Enquiry({ onShowToast }) {
  const [enquiries, setEnquiries] = useState([]);

  const loadEnquiries = () => {
    enquiryAPI.getEnquiries()
      .then(json => {
        if (json.success) setEnquiries(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

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
