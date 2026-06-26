import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/Cards';
import CustomChart from '../components/Charts';

export default function Dashboard({ setActivePage, onShowToast }) {
  const [stats, setStats] = useState({
    capacity: 240,
    filled: 187,
    waitlist: 19,
    confirmedAdmissions: 187,
    pendingEnquiries: 34,
    totalRevenue: 840000,
    pendingFees: 180000
  });

  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    // Fetch dashboard statistics
    fetch('/api/reports/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) setStats(json.data);
      })
      .catch(err => console.error(err));

    // Fetch admissions list
    fetch('/api/admissions')
      .then(res => res.json())
      .then(json => {
        if (json.success) setAdmissions(json.data);
      })
      .catch(err => console.error(err));
  }, []);

  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

  // 1. Chart Enquiries vs Admissions
  const enquiriesAdmissionsChart = {
    labels: months,
    datasets: [
      { label: 'Enquiries', data: [45, 52, 38, 60, 72, 89], backgroundColor: '#A78BFA', borderRadius: 4 },
      { label: 'Admissions', data: [18, 22, 14, 28, 35, 42], backgroundColor: '#7C3AED', borderRadius: 4 }
    ]
  };

  // 2. Chart Occupancy by Classroom
  const classroomOccupancyChart = {
    labels: ['Playgroup 93%', 'Nursery 89%', 'LKG 78%', 'UKG 64%', 'Daycare 56%'],
    datasets: [{
      data: [93, 89, 78, 64, 56],
      backgroundColor: ['#059669', '#7C3AED', '#2563EB', '#F59E0B', '#6B7280'],
      borderWidth: 0
    }]
  };

  // 3. Revenue Line Chart
  const revenueChart = {
    labels: months,
    datasets: [{
      label: 'Revenue (₹L)',
      data: [4.8, 5.2, 4.5, 6.1, 7.3, 8.4],
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4
    }]
  };

  // 4. Lead Sources Pie Chart
  const leadSourcesChart = {
    labels: ['WhatsApp 35%', 'Referral 25%', 'Walk-in 20%', 'Google 15%', 'Other 5%'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#25D366', '#7C3AED', '#2563EB', '#EA4335', '#9CA3AF'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <div id="page-dashboard" className="page active">
      <div className="stat-grid">
        <StatCard
          icon="🏫"
          value={stats.capacity}
          label="Total Seats"
          delta="↑ 5% vs last year"
          bg="#EDE9FE"
        />
        <StatCard
          icon="✅"
          value={stats.confirmedAdmissions}
          label="Confirmed Admissions"
          delta="↑ 12% vs last month"
          bg="#D1FAE5"
        />
        <StatCard
          icon="⏳"
          value={stats.pendingEnquiries}
          label="Pending Enquiries"
          delta="↑ 8 new today"
          bg="#FEF3C7"
        />
        <StatCard
          icon="🟡"
          value={stats.capacity - stats.filled}
          label="Available Seats"
          delta={`${Math.round(((stats.capacity - stats.filled) / stats.capacity) * 100)}% vacancy`}
          bg="#DBEAFE"
        />
        <StatCard
          icon="📋"
          value={stats.waitlist}
          label="Waitlisted"
          delta="↑ 3 this week"
          bg="#FCE7F3"
        />
        <StatCard
          icon="💰"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          label="Monthly Revenue"
          delta="↑ 18% vs last month"
          bg="#FEF3C7"
        />
      </div>

      {/* PIPELINE */}
      <div className="card section-gap">
        <div className="card-header">
          <div>
            <div className="card-title">Admission Pipeline</div>
            <div className="card-sub">Current funnel status</div>
          </div>
        </div>
        <div className="pipeline">
          <div className="pipe-step done"><span className="pipe-num">89</span>Enquiry</div>
          <div className="pipe-step done"><span className="pipe-num">72</span>Tour</div>
          <div className="pipe-step active"><span className="pipe-num">58</span>Demo</div>
          <div className="pipe-step pending"><span className="pipe-num">43</span>Follow-up</div>
          <div className="pipe-step pending"><span className="pipe-num">28</span>Seat Check</div>
          <div className="pipe-step pending"><span className="pipe-num">19</span>Confirmed</div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
          Conversion rate: <strong>21.3%</strong> enquiry → admission | Avg time to convert: <strong>8.4 days</strong>
        </p>
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header"><div className="card-title">Monthly Enquiries vs Admissions</div></div>
          <CustomChart type="bar" data={enquiriesAdmissionsChart} options={chartOptions} />
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Occupancy by Classroom (%)</div></div>
          <CustomChart type="doughnut" data={classroomOccupancyChart} options={{ ...chartOptions, cutout: '60%' }} />
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue Trend</div></div>
          <CustomChart type="line" data={revenueChart} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Lead Sources</div></div>
          <CustomChart type="pie" data={leadSourcesChart} options={chartOptions} />
        </div>
      </div>

      {/* RECENT ADMISSIONS */}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">Recent Confirmed Admissions</div></div>
          <button className="btn btn-outline btn-sm" onClick={() => setActivePage('counsellor')}>
            View All →
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Parent</th>
              <th>Program</th>
              <th>Status</th>
              <th>Date</th>
              <th>Counsellor</th>
            </tr>
          </thead>
          <tbody>
            {admissions.slice(0, 5).map((row, idx) => (
              <tr key={idx}>
                <td><strong>{row.child}</strong></td>
                <td>{row.parent}</td>
                <td><span className="badge badge-purple">{row.program}</span></td>
                <td>
                  <span className={`badge ${row.status === 'Confirmed' ? 'badge-success' : row.status === 'Pending' ? 'badge-warning' : 'badge-gray'}`}>
                    {row.status}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{row.date}</td>
                <td>{row.counsellor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
