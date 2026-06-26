import React from 'react';

export function StatCard({ icon, value, label, delta, bg }) {
  const isUp = delta && delta.includes('↑') || delta && delta.includes('win') || delta && delta.includes('vacancy') || delta && delta.includes('week');
  
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg || '#EDE9FE' }}>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {delta && (
        <span className={`stat-delta ${isUp ? 'up' : 'down'}`}>
          {delta}
        </span>
      )}
    </div>
  );
}

export function Card({ title, subtitle, children, headerAction }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-sub">{subtitle}</div>}
        </div>
        {headerAction}
      </div>
      {children}
    </div>
  );
}
