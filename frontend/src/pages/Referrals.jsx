import React, { useState, useEffect } from 'react';

export default function Referrals({ onShowToast }) {
  const [referrers, setReferrers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('/api/referrals')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setReferrers(json.data.referrals);
          setCampaigns(json.data.campaigns);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSendCampaign = (campName) => {
    onShowToast(`📤 WhatsApp campaign for ${campName} scheduled for all 500 leads!`);
  };

  return (
    <div id="page-referrals" className="page active">
      <div className="grid-2 section-gap">
        <div>
          <div className="ref-code">
            <div className="ref-code-label">Your Referral Code</div>
            <div className="ref-code-value">ITOTS24</div>
            <div className="ref-code-sub">1 successful referral = ₹2,000 fee discount</div>
          </div>
          
          <div className="card">
            <div className="card-title" style={{ marginBottom: '1rem' }}>How It Works</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, justifyContent: 'center' }}>1</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Share Your Code</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Share your unique code with friends & family via WhatsApp or word-of-mouth.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, justifyContent: 'center' }}>2</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>They Enrol</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>When their child gets admitted and fees are paid, the referral is confirmed.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', color: '#fff', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, justifyContent: 'center' }}>✓</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>You Get Rewarded</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>₹2,000 discount applied to your next fee installment automatically.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Top Referrers</div></div>
          <table className="data-table" id="ref-table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Referrals</th>
                <th>Converted</th>
                <th>Savings Earned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrers.map((r, idx) => (
                <tr key={idx}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.referrals}</td>
                  <td>{r.converted}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '600' }}>{r.savings}</td>
                  <td>
                    <span className={`badge ${r.status === 'Gold' ? 'badge-warning' : r.status === 'Silver' ? 'badge-info' : 'badge-gray'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🎉 Festival WhatsApp Campaigns</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }} id="festival-cards">
          {campaigns.map((f, idx) => (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }} key={idx}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{f.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '.25rem' }}>{f.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '.75rem' }}>{f.date}</div>
              <div style={{ fontSize: '12px', background: 'var(--bg)', borderRadius: '8px', padding: '.75rem', marginBottom: '.75rem', color: 'var(--muted)', minHeight: '60px' }}>
                {f.msg}
              </div>
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => handleSendCampaign(f.name)}>
                Schedule
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
