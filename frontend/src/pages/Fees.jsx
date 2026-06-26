import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/Cards';
import { feesAPI } from '../services/feesAPI';

export default function Fees({ onShowToast }) {
  const [fees, setFees] = useState([]);

  const loadFees = () => {
    feesAPI.getFees()
      .then(json => {
        if (json.success) setFees(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleRemind = async (id, name) => {
    try {
      const res = await feesAPI.sendReminder(id);
      if (res.success) {
        onShowToast(`📧 Payment alert reminder text sent to parent of ${name}!`);
      }
    } catch (e) {
      onShowToast('❌ Failed to send reminder: ' + e.message);
    }
  };

  const handlePay = async (id, child, total, currentPaid) => {
    const amountStr = prompt(`Enter payment amount to collect for ${child} (Max: ₹${total - currentPaid}):`, `${total - currentPaid}`);
    if (amountStr === null) return;
    
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      onShowToast('⚠️ Please enter a valid payment amount.');
      return;
    }

    try {
      const res = await feesAPI.payFees(id, amount);
      if (res.success) {
        onShowToast(`💳 Payment of ₹${amount} collected! WhatsApp receipt sent.`);
        loadFees();
      }
    } catch (e) {
      onShowToast('❌ Payment failure: ' + e.message);
    }
  };

  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalDues = fees.reduce((sum, f) => sum + (f.fee - f.paid), 0);
  const overdueCount = fees.filter(f => f.status === 'Overdue').length;

  return (
    <div id="page-fees" className="page active">
      <div className="stat-grid">
        <StatCard icon="💚" value={`₹${(totalCollected / 100000).toFixed(1)}L`} label="Collected This Month" bg="#D1FAE5" />
        <StatCard icon="⚠️" value={`₹${(totalDues / 100000).toFixed(1)}L`} label="Pending Dues" bg="#FEE2E2" />
        <StatCard icon="📋" value={overdueCount} label="Overdue Accounts" bg="#FEF3C7" />
        <StatCard icon="🏷️" value="₹45K" label="Discounts Applied" bg="#EDE9FE" />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Fee Records</div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => onShowToast('📄 Report generation scheduled!')}>
              ⬇ PDF Summary
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => onShowToast('📑 Exporting billing logs...')}>
              ⬇ CSV Ledger
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Program</th>
              <th>Parent</th>
              <th>Fee</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f, idx) => (
              <tr key={idx}>
                <td><strong>{f.child}</strong></td>
                <td><span className="badge badge-purple">{f.program}</span></td>
                <td>{f.parent}</td>
                <td>₹{f.fee.toLocaleString()}</td>
                <td style={{ color: 'var(--success)', fontWeight: '600' }}>₹{f.paid.toLocaleString()}</td>
                <td style={{ color: f.fee - f.paid > 0 ? 'var(--danger)' : 'var(--muted)', fontWeight: '600' }}>
                  ₹{(f.fee - f.paid).toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${f.status === 'Paid' ? 'badge-success' : f.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                    {f.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {f.status !== 'Paid' && (
                      <button className="btn btn-primary btn-sm" style={{ padding: '2px 8px' }} onClick={() => handlePay(f.id, f.child, f.fee, f.paid)}>
                        💸 Pay
                      </button>
                    )}
                    <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px' }} onClick={() => handleRemind(f.id, f.child)}>
                      📧 Remind
                    </button>
                    <a className="btn btn-outline btn-sm" style={{ padding: '2px 8px', display: 'inline-flex', alignItems: 'center' }} href={feesAPI.getReceiptUrl(f.id)} download>
                      📄 Receipt
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
