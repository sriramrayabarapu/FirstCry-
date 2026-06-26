import React, { useState, useEffect } from 'react';

const initialProgressNotes = [
  { child: 'Aarohi', note: 'Excellent progress in language skills. Loves story time!', teacher: 'Ms. Kavita', class: 'Nursery' },
  { child: 'Dev', note: 'Showing great curiosity in math activities. Encourage more.', teacher: 'Ms. Ananya', class: 'LKG' },
  { child: 'Sia', note: 'Shy but opening up. Great in creative art sessions.', teacher: 'Ms. Kavita', class: 'Playgroup' },
  { child: 'Krish', note: 'Leadership qualities emerging. Very helpful to peers.', teacher: 'Mr. Sanjay', class: 'UKG' }
];

export default function Teachers({ onShowToast }) {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTeachers(json.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div id="page-teachers" className="page active">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {teachers.map((t, idx) => (
          <div className="teacher-card" key={idx}>
            <div className="teacher-avatar">
              {t.name.split(' ').filter(w => w && w[0] && w[0] === w[0].toUpperCase()).map(w => w[0]).join('').substring(0, 2)}
            </div>
            <div className="teacher-name">{t.name}</div>
            <div className="teacher-role">{t.role}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              📚 {t.exp} experience · {t.classes} children
            </div>
            <div style={{ marginTop: '.5rem', color: '#F59E0B', fontSize: '12px' }}>
              ★ {t.rating}
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ marginTop: '.75rem', width: '100%' }}
              onClick={() => onShowToast(`👩‍🏫 Viewing profile for ${t.name}`)}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Today's Activities</div></div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Activity</th>
                <th>Time</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge badge-purple">Playgroup</span></td>
                <td>Sensory Play — Sand & Water</td>
                <td>9:30 AM</td>
                <td>Ms. Kavita</td>
              </tr>
              <tr>
                <td><span className="badge badge-info">Nursery</span></td>
                <td>Story Time: The Hungry Caterpillar</td>
                <td>10:00 AM</td>
                <td>Ms. Deepa</td>
              </tr>
              <tr>
                <td><span className="badge badge-success">LKG</span></td>
                <td>Alphabet Writing Practice</td>
                <td>10:30 AM</td>
                <td>Ms. Ananya</td>
              </tr>
              <tr>
                <td><span className="badge badge-warning">UKG</span></td>
                <td>Number Concepts 1–100</td>
                <td>11:00 AM</td>
                <td>Mr. Sanjay</td>
              </tr>
              <tr>
                <td><span className="badge badge-gray">Daycare</span></td>
                <td>Afternoon Nap + Art & Craft</td>
                <td>1:00 PM</td>
                <td>Ms. Rekha</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Child Progress Notes</div></div>
          <div>
            {initialProgressNotes.map((n, idx) => (
              <div style={{ padding: '.75rem', background: 'var(--bg)', borderRadius: '8px', marginBottom: '.5rem' }} key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px' }}>{n.child}</strong>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>{n.class}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{n.note}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>— {n.teacher}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
