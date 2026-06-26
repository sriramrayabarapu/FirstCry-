import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/Cards';
import { enquiryAPI } from '../services/enquiryAPI';

export default function Counsellor({ onShowToast }) {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');

  const loadLeads = () => {
    enquiryAPI.getLeads()
      .then(json => {
        if (json.success) setLeads(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await enquiryAPI.updateLeadStatus(id, newStatus);
      if (res.success) {
        onShowToast(`Lead status updated to: ${newStatus}`);
        loadLeads();
      }
    } catch (e) {
      onShowToast('❌ Status update failed: ' + e.message);
    }
  };

  const filteredLeads = leads.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'new') return l.status === 'New';
    if (filter === 'tour') return l.status === 'Tour Booked';
    if (filter === 'follow') return l.status === 'Follow-up Pending' || l.status === 'Interested';
    if (filter === 'converted') return l.status === 'Converted';
    return true;
  });

  const hotCount = leads.filter(l => l.priority === 'hot').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;

  return (
    <div id="page-counsellor" className="page active">
      <div className="stat-grid">
        <StatCard icon="👤" value={leads.length} label="Assigned Leads" bg="#EDE9FE" />
        <StatCard icon="✅" value={convertedCount} label="Converted This Month" bg="#D1FAE5" />
        <StatCard icon="⏰" value={leads.filter(l => l.status.includes('Pending')).length} label="Follow-up Pending" bg="#FEF3C7" />
        <StatCard icon="🔥" value={hotCount} label="Hot Leads Today" bg="#FEE2E2" />
      </div>

      <div className="grid-2 section-gap">
        <div>
          {/* filters */}
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter('all')}>
              All ({leads.length})
            </button>
            <button className={`btn ${filter === 'new' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter('new')}>
              🆕 New
            </button>
            <button className={`btn ${filter === 'tour' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter('tour')}>
              📅 Tour Booked
            </button>
            <button className={`btn ${filter === 'follow' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter('follow')}>
              ⏰ Follow-up
            </button>
            <button className={`btn ${filter === 'converted' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter('converted')}>
              ✅ Converted
            </button>
          </div>

          {/* list */}
          <div id="leads-list">
            {filteredLeads.map((l, idx) => (
              <div className="lead-card" key={idx} style={{ position: 'relative' }}>
                <div className="lead-avatar" onClick={() => onShowToast(`📞 Calling parent ${l.name}...`)}>
                  {l.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                </div>
                <div className="lead-info" onClick={() => onShowToast(`📞 Loading details for: ${l.name}`)}>
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-detail">👦 {l.child} · 📱 {l.phone} · {l.program}</div>
                </div>
                <div className="lead-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`badge ${l.status === 'Converted' ? 'badge-success' : l.status === 'Lost' ? 'badge-danger' : l.status === 'New' ? 'badge-info' : 'badge-warning'}`}>
                    {l.status}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                    <span className={`priority-dot priority-${l.priority}`}></span>{l.date}
                  </div>
                  {l.status !== 'Converted' && (
                    <select
                      className="form-control"
                      style={{ fontSize: '10px', padding: '2px 4px', width: '90px', height: '22px', marginTop: '4px' }}
                      value={l.status}
                      onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Tour Booked">Tour Booked</option>
                      <option value="Follow-up Pending">Follow-up</option>
                      <option value="Converted">Convert ✅</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* AI CALL SCRIPT */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-title" style={{ marginBottom: '1rem' }}>📋 AI Call Script</div>
            <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '1rem', fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)' }} id="ai-script">
              <strong style={{ color: 'var(--text)' }}>Suggested Opening:</strong><br />
              "Hello [Parent Name]! This is Priya K. from FirstCry Intellitots. I hope this is a good time. I'm calling regarding your enquiry about admission for [Child Name]..."<br /><br />
              <strong style={{ color: 'var(--text)' }}>Key Points to Cover:</strong><br />
              ✅ Welcome the enquiry warmly<br />
              ✅ Confirm program interest and child's age<br />
              ✅ Highlight unique programs (Montessori + PlayWay)<br />
              ✅ Mention limited seats — create urgency<br />
              ✅ Offer a free trial class / school tour<br />
              ✅ Confirm tour date and time<br /><br />
              <strong style={{ color: 'var(--text)' }}>Common Objections:</strong><br />
              💬 "Fees are high" → "We offer flexible EMI options and sibling discounts..."<br />
              💬 "Will visit later" → "We have only 3 seats left in Nursery, shall I hold one for you?"
            </div>
          </div>

          {/* PRIORITY ALERTS */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '.75rem' }}>🔔 Today's Priority Alerts</div>
            <div id="priority-alerts">
              <div style={{ padding: '.65rem .85rem', borderRadius: '8px', marginBottom: '.5rem', fontSize: '12.5px', background: 'var(--danger-light)', color: 'var(--danger)' }}>
                🔥 Sunita Agarwal — Tour in 2 hours! Not confirmed yet.
              </div>
              <div style={{ padding: '.65rem .85rem', borderRadius: '8px', marginBottom: '.5rem', fontSize: '12.5px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                ⏰ Ravi Kumar — 3rd follow-up due. High drop risk.
              </div>
              <div style={{ padding: '.65rem .85rem', borderRadius: '8px', marginBottom: '.5rem', fontSize: '12.5px', background: 'var(--info-light)', color: 'var(--info)' }}>
                📞 5 new leads from Google Ads campaign this morning.
              </div>
              <div style={{ padding: '.65rem .85rem', borderRadius: '8px', marginBottom: '.5rem', fontSize: '12.5px', background: 'var(--success-light)', color: 'var(--success)' }}>
                ✅ Pooja Desai confirmed admission. Mark as won!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
