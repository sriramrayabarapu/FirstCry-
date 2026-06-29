import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/Cards';
import { occupancyAPI } from '../services/occupancyAPI';

export default function Occupancy({ onShowToast }) {
  const [classrooms, setClassrooms] = useState([]);

  const loadData = () => {
    occupancyAPI.getOccupancy()
      .then(json => {
        if (json.success) {
          setClassrooms(json.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);
  const totalFilled = classrooms.reduce((sum, c) => sum + c.filled, 0);
  const totalWaitlist = classrooms.reduce((sum, c) => sum + c.waitlist, 0);
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0;

  return (
    <div id="page-occupancy" className="page active">
      <div className="stat-grid">
        <StatCard icon="🟢" value={`${overallOccupancyPct}%`} label="Overall Occupancy" bg="#D1FAE5" />
        <StatCard icon="🏫" value={totalCapacity} label="Total Capacity" bg="#EDE9FE" />
        <StatCard icon="⚠️" value={totalCapacity - totalFilled} label="Vacant Seats" bg="#FEF3C7" />
        <StatCard icon="📋" value={totalWaitlist} label="On Waitlist" bg="#FCE7F3" />
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Classroom Status</div>
            <div style={{ display: 'flex', gap: '.5rem', fontSize: '11px', alignItems: 'center' }}>
              <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>🟢 Available</span>
              <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>🟡 Almost Full</span>
              <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>🔴 Full</span>
            </div>
          </div>
          
          <div id="occ-bars">
            {classrooms.map((c, idx) => {
              const pct = Math.round((c.filled / c.capacity) * 100);
              const cls = pct >= 90 ? 'occ-red' : pct >= 70 ? 'occ-yellow' : 'occ-green';
              return (
                <div className={`occ-row ${cls}`} key={idx}>
                  <div className="occ-label">
                    <span>{c.emoji || '🏫'} {c.name}</span>
                    <span>{c.filled}/{c.capacity} — {pct}%</span>
                  </div>
                  <div className="occ-bar">
                    <div className="occ-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Classroom Details</div>
          </div>
          <table className="data-table" id="occ-table">
            <thead>
              <tr>
                <th>Classroom</th>
                <th>Capacity</th>
                <th>Filled</th>
                <th>Vacant</th>
                <th>Waitlist</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((c, idx) => {
                const pct = Math.round((c.filled / c.capacity) * 100);
                const badge = pct >= 90 ? 'badge-danger' : pct >= 70 ? 'badge-warning' : 'badge-success';
                const lbl = pct >= 90 ? '🔴 Full' : pct >= 70 ? '🟡 Almost Full' : '🟢 Available';
                return (
                  <tr key={idx}>
                    <td>{c.emoji || '🏫'} {c.name}</td>
                    <td>{c.capacity}</td>
                    <td><strong>{c.filled}</strong></td>
                    <td>{c.capacity - c.filled}</td>
                    <td>{c.waitlist}</td>
                    <td><span className={`badge ${badge}`}>{lbl}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
