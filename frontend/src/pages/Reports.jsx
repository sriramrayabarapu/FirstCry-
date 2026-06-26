import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/Cards';
import CustomChart from '../components/Charts';

const reportsList = [
  { name: 'Monthly Admission Report', icon: '📊', type: 'admissions' },
  { name: 'Occupancy Summary', icon: '🏫', type: 'occupancy' },
  { name: 'Revenue & Fee Collection', icon: '💰', type: 'fees' },
  { name: 'Counsellor Performance', icon: '📞', type: 'admissions' },
  { name: 'Lead Source Analysis', icon: '📍', type: 'enquiries' }
];

export default function Reports({ onShowToast }) {
  const [stats, setStats] = useState({
    enquiriesCount: 89,
    conversionPct: 21,
    revenueText: '₹8.4L',
    referralCount: 14
  });

  const [chartData, setChartData] = useState({
    labels: ['Priya K.', 'Amit S.', 'Sunita R.', 'Rahul M.'],
    datasets: [{
      label: 'Conversions',
      data: [8, 6, 5, 3],
      backgroundColor: ['#7C3AED', '#7C3AED', '#7C3AED', '#A78BFA'],
      borderRadius: 4
    }]
  });

  useEffect(() => {
    // Fetch stats
    fetch('/api/reports/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const s = json.data;
          const totalEnq = s.pendingEnquiries + s.confirmedAdmissions;
          setStats({
            enquiriesCount: totalEnq,
            conversionPct: totalEnq > 0 ? Math.round((s.confirmedAdmissions / totalEnq) * 100) : 0,
            revenueText: `₹${(s.totalRevenue / 100000).toFixed(1)}L`,
            referralCount: 14 // static or dynamic referrals
          });
        }
      })
      .catch(err => console.error(err));
      
    // Fetch chart data
    fetch('/api/reports/charts')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.counsellorPerformance.length > 0) {
          const names = json.data.counsellorPerformance.map(c => c.counsellor || 'Unassigned');
          const counts = json.data.counsellorPerformance.map(c => c.converted || 0);
          setChartData({
            labels: names,
            datasets: [{
              label: 'Conversions',
              data: counts,
              backgroundColor: ['#7C3AED', '#7C3AED', '#7C3AED', '#A78BFA'],
              borderRadius: 4
            }]
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const chartOptions = {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, grid: { display: false } } }
  };

  return (
    <div id="page-reports" className="page active">
      <div className="stat-grid section-gap">
        <StatCard icon="📊" value={stats.enquiriesCount} label="Total Enquiries" bg="#EDE9FE" />
        <StatCard icon="✅" value={`${stats.conversionPct}%`} label="Conversion Rate" bg="#D1FAE5" />
        <StatCard icon="💰" value={stats.revenueText} label="Monthly Revenue" bg="#FEF3C7" />
        <StatCard icon="🎁" value={stats.referralCount} label="Referrals This Month" bg="#DBEAFE" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Counsellor Performance</div></div>
          <CustomChart type="bar" data={chartData} options={chartOptions} height={260} />
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Download Reports</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }} id="report-list">
            {reportsList.map((r, idx) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', background: 'var(--bg)', borderRadius: '8px' }} key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Jun 2025</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <a className="btn btn-outline btn-sm" href={`/api/reports/download/pdf/${r.type}`} download>
                    PDF
                  </a>
                  <a className="btn btn-outline btn-sm" href={`/api/reports/download/csv/${r.type}`} download>
                    CSV
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
