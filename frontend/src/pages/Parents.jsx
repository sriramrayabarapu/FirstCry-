import React from 'react';

const developmentMetrics = [
  { label: 'Communication', val: 85 },
  { label: 'Motor Skills', val: 78 },
  { label: 'Cognitive', val: 90 },
  { label: 'Social Skills', val: 72 },
  { label: 'Creativity', val: 95 }
];

const feeList = [
  { name: 'Tuition Fee — June', amount: '₹8,000', status: 'Pending' },
  { name: 'Activity Fee — June', amount: '₹2,500', status: 'Pending' },
  { name: 'Transport — June', amount: '₹2,000', status: 'Pending' }
];

const teacherNotes = [
  { date: '14 Jun', note: 'Riya participated enthusiastically in finger painting today! She mixed colours confidently.', teacher: 'Ms. Deepa' },
  { date: '13 Jun', note: 'Excellent listening during story time. She recalled all 3 characters from the story.', teacher: 'Ms. Deepa' },
  { date: '12 Jun', note: 'Made new friends during outdoor play. Her social skills are improving.', teacher: 'Ms. Deepa' }
];

export default function Parents({ onShowToast }) {
  const attendance = [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1];

  return (
    <div id="page-parents" className="page active">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          R
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>Riya Sharma</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Nursery A · Roll No. 14 · Age: 3 yrs 4 months</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Attendance this month</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>92%</div>
        </div>
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header"><div className="card-title">📅 Attendance Record — June 2025</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px', textAlign: 'center', fontSize: '11px' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '600', padding: '2px' }} key={i}>{d}</div>
            ))}
            {attendance.map((a, i) => (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: a ? 'var(--success-light)' : 'var(--danger-light)',
                  color: a ? '#065F46' : '#991B1B',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 'auto'
                }}
                key={i}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📊 Development Progress</div></div>
          <div>
            {developmentMetrics.map((d, i) => (
              <div style={{ marginBottom: '.75rem' }} key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{d.label}</span>
                  <strong>{d.val}%</strong>
                </div>
                <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${d.val}%`, background: 'var(--primary)', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">💰 Fee Summary</div></div>
          <div>
            {feeList.map((f, i) => (
              <div className="fee-item" key={i}>
                <div>
                  <div className="fee-name">{f.name}</div>
                  <span className="badge badge-warning fee-status">{f.status}</span>
                </div>
                <div className="fee-amount">{f.amount}</div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '.75rem', borderTop: '1px solid var(--border)', marginTop: '.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Total Due</strong>
            <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>₹12,500</strong>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '.75rem' }} onClick={() => onShowToast('💳 Redirecting to payment gateway...')}>
            💳 Pay Online Now
          </button>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📩 Teacher Notes</div></div>
          <div>
            {teacherNotes.map((n, i) => (
              <div style={{ padding: '.75rem', borderBottom: '1px solid var(--border)' }} key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary)' }}>{n.teacher}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{n.date}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{n.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
