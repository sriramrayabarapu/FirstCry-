import React, { useState, useEffect } from 'react';
import CustomChart from '../components/Charts';

export default function Feedback({ onShowToast }) {
  const [parentName, setParentName] = useState('');
  const [className, setClassName] = useState('Nursery');
  const [rating, setRating] = useState(5);
  const [teacherRating, setTeacherRating] = useState(5);
  const [facilityRating, setFacilityRating] = useState(5);
  const [comment, setComment] = useState('');

  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedback = () => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(json => {
        if (json.success) setFeedbacks(json.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async () => {
    if (!parentName) {
      onShowToast('⚠️ Please enter parent name');
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parentName,
          rating,
          comment,
          class_name: className,
          teacher_rating: teacherRating,
          facility_rating: facilityRating
        })
      });

      if (response.ok) {
        onShowToast('⭐ Thank you for your feedback!');
        setParentName('');
        setComment('');
        loadFeedback();
      } else {
        throw new Error('Submit failed');
      }
    } catch (e) {
      onShowToast('❌ Failed to submit feedback: ' + e.message);
    }
  };

  const satisfactionData = {
    labels: ['5 Stars 60%', '4 Stars 25%', '3 Stars 10%', '1–2 Stars 5%'],
    datasets: [{
      data: [60, 25, 10, 5],
      backgroundColor: ['#059669', '#7C3AED', '#F59E0B', '#DC2626'],
      borderWidth: 0
    }]
  };

  return (
    <div id="page-feedback" className="page active">
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>Submit Feedback</div>
          <div className="form-group">
            <label className="form-label">Parent Name</label>
            <input className="form-control" placeholder="Your name" value={parentName} onChange={e => setParentName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Child's Class</label>
            <select className="form-control" value={className} onChange={e => setClassName(e.target.value)}>
              <option>Playgroup</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Daycare</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Overall Satisfaction</label>
            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }} id="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ fontSize: '24px', cursor: 'pointer', color: '#F59E0B' }}
                >
                  {star <= rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Teacher Rating (1–5)</label>
              <input className="form-control" type="number" min="1" max="5" placeholder="5" value={teacherRating} onChange={e => setTeacherRating(parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Facility Rating (1–5)</label>
              <input className="form-control" type="number" min="1" max="5" placeholder="5" value={facilityRating} onChange={e => setFacilityRating(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Suggestions</label>
            <textarea className="form-control" rows="3" placeholder="What can we improve?" value={comment} onChange={e => setComment(e.target.value)}></textarea>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
            Submit Feedback
          </button>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header"><div className="card-title">Satisfaction Overview</div></div>
            <CustomChart type="doughnut" data={satisfactionData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '55%' }} height={220} />
          </div>
          
          <div className="card">
            <div className="card-header"><div className="card-title">Recent Feedback</div></div>
            <div id="feedback-list">
              {feedbacks.map((f, idx) => (
                <div style={{ padding: '.75rem', borderBottom: '1px solid var(--border)' }} key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{f.name}</strong>
                    <span style={{ color: '#F59E0B', fontSize: '12px' }}>
                      {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{f.comment || 'No suggestions recorded.'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>
                    {f.date} Jun 2025 · Class: {f.class_name || 'General'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
