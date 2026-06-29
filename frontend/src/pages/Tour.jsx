import React, { useState, useEffect } from 'react';

export default function Tour({ onShowToast, portalMode }) {
  const [tours, setTours] = useState([]);
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [program, setProgram] = useState('Nursery');

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2026);

  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_FULL = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const loadTours = () => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTours(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleBookTour = async () => {
    if (!parentName || !phone || !date || !timeSlot || !program) {
      onShowToast('⚠️ Please enter parent name, phone, date, slot and program');
      return;
    }

    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: parentName,
          phone,
          date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: timeSlot,
          program,
          counsellor: 'Priya K.'
        })
      });

      if (response.ok) {
        onShowToast('✅ Tour booked! Confirmation sent via WhatsApp');
        setParentName('');
        setPhone('');
        setDate('');
        loadTours();
      } else {
        throw new Error('Booking failed');
      }
    } catch (e) {
      onShowToast('❌ Failed to schedule tour: ' + e.message);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getMonthDays = (year, monthIdx) => {
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const totalDays = new Date(year, monthIdx + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  };

  const hasTourOnDate = (day, monthIdx, year) => {
    return tours.some(t => {
      if (!t || !t.date) return false;
      try {
        const tourDate = new Date(t.date);
        if (isNaN(tourDate.getTime())) {
          const monthShort = MONTHS_SHORT[monthIdx].toLowerCase();
          const monthFull = MONTHS_FULL[monthIdx].toLowerCase();
          const dateStr = t.date.toLowerCase();
          return dateStr.includes(String(day)) && 
                 (dateStr.includes(monthShort) || dateStr.includes(monthFull)) && 
                 dateStr.includes(String(year));
        }
        return tourDate.getDate() === day && 
               tourDate.getMonth() === monthIdx && 
               tourDate.getFullYear() === year;
      } catch (e) {
        return false;
      }
    });
  };

  const getToursForDate = (day, monthIdx, year) => {
    if (!day) return [];
    return tours.filter(t => {
      if (!t || !t.date) return false;
      try {
        const tourDate = new Date(t.date);
        if (isNaN(tourDate.getTime())) {
          const monthShort = MONTHS_SHORT[monthIdx].toLowerCase();
          const monthFull = MONTHS_FULL[monthIdx].toLowerCase();
          const dateStr = t.date.toLowerCase();
          return dateStr.includes(String(day)) && 
                 (dateStr.includes(monthShort) || dateStr.includes(monthFull)) && 
                 dateStr.includes(String(year));
        }
        return tourDate.getDate() === day && 
               tourDate.getMonth() === monthIdx && 
               tourDate.getFullYear() === year;
      } catch (e) {
        return false;
      }
    });
  };

  const renderBookTourForm = () => (
    <div className="card form-card-3d">
      <div className="card-title" style={{ marginBottom: '1rem' }}>Book a Tour</div>
      <div className="form-group delay-1">
        <label className="form-label">Parent Name</label>
        <input className="form-control" placeholder="Parent name" value={parentName} onChange={e => setParentName(e.target.value)} />
      </div>
      <div className="form-group delay-2">
        <label className="form-label">Phone</label>
        <input className="form-control" placeholder="+91 9XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="form-group delay-3">
        <label className="form-label">Tour Date</label>
        <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="form-group delay-4">
        <label className="form-label">Time Slot</label>
        <select className="form-control" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
          <option>10:00 AM</option>
          <option>11:00 AM</option>
          <option>12:00 PM</option>
          <option>3:00 PM</option>
          <option>4:00 PM</option>
        </select>
      </div>
      <div className="form-group delay-5">
        <label className="form-label">Program Interest</label>
        <select className="form-control" value={program} onChange={e => setProgram(e.target.value)}>
          <option>Playgroup</option>
          <option>Nursery</option>
          <option>LKG</option>
          <option>UKG</option>
          <option>Daycare</option>
        </select>
      </div>
      <button className="btn btn-primary btn-submit-glow delay-6" onClick={handleBookTour} style={{ width: '100%', justifyContent: 'center' }}>
        📅 Confirm Tour Booking
      </button>
    </div>
  );

  return (
    <div id="page-tour" className="page active">
      {portalMode === 'public' && (
        <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="card-title">
              {MONTHS_FULL[currentMonth]}, {currentYear}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-sm" onClick={handlePrevMonth} style={{ padding: '2px 8px' }}>◀</button>
              <button className="btn btn-outline btn-sm" onClick={handleNextMonth} style={{ padding: '2px 8px' }}>▶</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px', marginTop: '1rem' }}>
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>

          <div className="cal-grid">
            {getMonthDays(currentYear, currentMonth).map((d, dIdx) => {
              if (d === null) return <div key={`empty-${dIdx}`} />;
              const isToday = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() && d === new Date().getDate();
              const hasEvent = hasTourOnDate(d, currentMonth, currentYear);
              const toursToday = getToursForDate(d, currentMonth, currentYear);
              
              return (
                <div
                  key={d}
                  className={`cal-day ${isToday ? 'today' : hasEvent ? 'has-event' : ''}`}
                  onClick={() => {
                    const paddedMonth = String(currentMonth + 1).padStart(2, '0');
                    const paddedDay = String(d).padStart(2, '0');
                    setDate(`${currentYear}-${paddedMonth}-${paddedDay}`);
                    
                    if (toursToday.length > 0) {
                      const names = toursToday.map(t => t.parent).join(', ');
                      onShowToast(`📅 ${d} ${MONTHS_SHORT[currentMonth]} ${currentYear} — Tours: ${names}`);
                    } else {
                      onShowToast(`📅 ${d} ${MONTHS_SHORT[currentMonth]} ${currentYear} — Available for booking`);
                    }
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '12px', display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', verticalAlign: 'middle', marginRight: '4px' }}></span>
              Today
            </span>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-light)', verticalAlign: 'middle', marginRight: '4px' }}></span>
              Tour Booked
            </span>
          </div>
        </div>

        {renderBookTourForm()}
      </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">Upcoming Tours</div></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Date</th>
              <th>Time</th>
              <th>Program</th>
              <th>Status</th>
              <th>Counsellor</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t, idx) => (
              <tr key={idx}>
                <td><strong>{t.parent}</strong></td>
                <td>{t.date}</td>
                <td>{t.time}</td>
                <td><span className="badge badge-purple">{t.program}</span></td>
                <td>
                  <span className={`badge ${t.status === 'Confirmed' ? 'badge-success' : t.status === 'Rescheduled' ? 'badge-warning' : 'badge-info'}`}>
                    {t.status}
                  </span>
                </td>
                <td>{t.counsellor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
