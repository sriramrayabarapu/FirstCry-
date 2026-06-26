import React, { useState, useEffect } from 'react';
import mascotImg from '../mascot.png';
import PreschoolPrograms from '../components/PreschoolPrograms';
import IntellitotsAdvantage from '../components/IntellitotsAdvantage';

function AnimatedNumber({ value, duration = 1500, suffix = "", decimals = 0 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress); // Ease out quad
      const currentVal = easeProgress * end;
      setCurrent(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{current.toFixed(decimals)}{suffix}</span>;
}

function ProgressBar({ value, color = "var(--primary)" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value);
    }, 50);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="ui-progress-bg">
      <div 
        className="ui-progress-fill" 
        style={{ width: `${width}%`, backgroundColor: color }} 
      />
    </div>
  );
}

function RadialProgress({ value, color = "#10B981", size = 44, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      const progressOffset = circumference - (value / 100) * circumference;
      setOffset(progressOffset);
    }, 50);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

const initialPrograms = [
  { emoji: '👶', name: 'Playgroup', age: '1.5 – 2.5 years', color: '#EF4444' },
  { emoji: '🌸', name: 'Nursery', age: '2.5 – 3.5 years', color: '#10B981' },
  { emoji: '📚', name: 'LKG', age: '3.5 – 4.5 years', color: '#3B82F6' },
  { emoji: '🏫', name: 'UKG', age: '4.5 – 5.5 years', color: '#F59E0B' },
  { emoji: '🌙', name: 'Daycare', age: 'All ages', color: '#8B5CF6' }
];

const initialTestimonials = [
  { stars: 5, author: 'Priya Sharma', text: '"My daughter Aarohi has transformed completely since joining Intellitots. She\'s more confident, curious, and loves coming to school every day!"', role: 'Parent · Nursery', initial: 'PS' },
  { stars: 5, author: 'Rahul Kapoor', text: '"The teachers are incredibly caring. The daily updates through the app keep us connected even when we\'re at work. Highly recommended!"', role: 'Parent · LKG', initial: 'RK' },
  { stars: 4, author: 'Anita Mehta', text: '"Clean facility, structured curriculum, and the most attentive staff. Our son has made so many friends and learns something new every day."', role: 'Parent · Playgroup', initial: 'AM' }
];

export default function Home({ setActivePage, setPortalMode, onShowToast }) {
  const [animatingCard, setAnimatingCard] = useState(null);
  const [announcements, setAnnouncements] = useState({
    line1: "🍱 Lunch: Vegetable Khichdi + Raita | 🎨 Activity: Finger Painting",
    line2: "🎉 Event: Parents' Open Day — 4:00 PM | 📢 Notice: Diwali holiday on Nov 1st"
  });
  const [scene, setScene] = useState(1);
  const [aboutState, setAboutState] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScene(prev => (prev === 4 ? 1 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutState(prev => (prev === 4 ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (idx, progName) => {
    setAnimatingCard(idx);
    onShowToast(`🌱 Program Selected: ${progName}`);
    setTimeout(() => {
      setActivePage('enquiry');
      setAnimatingCard(null);
    }, 700);
  };

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.line1) {
          setAnnouncements(json.data);
        }
      })
      .catch(err => console.log('Error fetching announcements:', err));
  }, []);

  return (
    <div id="page-landing" className="page active">
      {/* TOP MARQUEE BANNER */}
      <div className="top-banner">
        <div className="top-banner-info">
          <span>📞 +91 90000 12345</span>
          <span>✉️ admissions@intellitots.com</span>
        </div>
        <div className="top-banner-notice">
          <span className="marquee-blink">🔥 Admissions Open for Academic Year 2026-27! Register for a Free Campus Tour today! 🔥</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        {/* Animated Background Clouds */}
        <div className="cloud-wrapper">
          <div className="x1">
            <svg className="cloud-svg" viewBox="0 0 100 64" width="100" height="64">
              <path d="M 20 40 L 80 40 A 15 15 0 0 0 80 10 A 20 20 0 0 0 45 5 A 15 15 0 0 0 20 20 A 12 12 0 0 0 20 40 Z" />
            </svg>
          </div>
          <div className="x2">
            <svg className="cloud-svg" viewBox="0 0 100 64" width="70" height="45">
              <path d="M 20 40 L 80 40 A 15 15 0 0 0 80 10 A 20 20 0 0 0 45 5 A 15 15 0 0 0 20 20 A 12 12 0 0 0 20 40 Z" />
            </svg>
          </div>
          <div className="x3">
            <svg className="cloud-svg" viewBox="0 0 100 64" width="90" height="58">
              <path d="M 20 40 L 80 40 A 15 15 0 0 0 80 10 A 20 20 0 0 0 45 5 A 15 15 0 0 0 20 20 A 12 12 0 0 0 20 40 Z" />
            </svg>
          </div>
          <div className="x4">
            <svg className="cloud-svg" viewBox="0 0 100 64" width="60" height="38">
              <path d="M 20 40 L 80 40 A 15 15 0 0 0 80 10 A 20 20 0 0 0 45 5 A 15 15 0 0 0 20 20 A 12 12 0 0 0 20 40 Z" />
            </svg>
          </div>
          <div className="x5">
            <svg className="cloud-svg" viewBox="0 0 100 64" width="80" height="51">
              <path d="M 20 40 L 80 40 A 15 15 0 0 0 80 10 A 20 20 0 0 0 45 5 A 15 15 0 0 0 20 20 A 12 12 0 0 0 20 40 Z" />
            </svg>
          </div>
        </div>
        <div className="hero-content">
          <h1>🌱 Welcome to Intellitots</h1>
          <p>Where every child's curiosity blooms into confidence. Premium preschool & daycare management made simple.</p>
          <div className="hero-cta">
            <button className="btn-hero btn-hero-white" onClick={() => setActivePage('enquiry')}>
              📝 Apply for Admission
            </button>
            <button className="btn-hero btn-hero-outline" onClick={() => setActivePage('tour')}>
              📅 Book a Tour
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">500+</div><div className="hero-stat-lbl">Happy Families</div></div>
            <div className="hero-stat"><div className="hero-stat-num">12</div><div className="hero-stat-lbl">Expert Teachers</div></div>
            <div className="hero-stat"><div className="hero-stat-num">96%</div><div className="hero-stat-lbl">Parent Satisfaction</div></div>
            <div className="hero-stat"><div className="hero-stat-num">5★</div><div className="hero-stat-lbl">Google Rating</div></div>
          </div>
        </div>

        {/* 3D-EFFECT INTERACTIVE MASCOT */}
        <div className="hero-mascot">
          {/* Drifting Birds */}
          <svg className="bird-drift-1" viewBox="0 0 32 20">
            <path d="M0 10 Q8 0 16 10 Q24 0 32 10 Q24 15 16 10 Q8 15 0 10 Z" />
          </svg>
          <svg className="bird-drift-2" viewBox="0 0 32 20">
            <path d="M0 10 Q8 0 16 10 Q24 0 32 10 Q24 15 16 10 Q8 15 0 10 Z" />
          </svg>

          <div className="mascot-container">
            <img src={mascotImg} alt="Mascot" className="mascot-img" />
          </div>
        </div>
      </div>

      {/* TODAY SPECIAL */}
      <div className="today-card">
        <div className="today-badge">📅 Today's Special</div>
        <div className="today-title">{announcements.line1}</div>
        <div className="today-desc">{announcements.line2}</div>
      </div>

      {/* ABOUT US SPLIT-SCREEN ANIMATED SECTION */}
      <div id="about-us" className={`about-us-split-container theme-${aboutState}`}>
        {/* Left Side: Video Glassmorphism Container with Multi-Scene Dashboard Animations */}
        <div className="about-us-left">
          {/* Floating Playful Toys / Stars / Icons */}
          <div className="about-us-decor-star">⭐</div>
          <div className="about-us-decor-pencil">✏️</div>
          <div className="about-us-decor-blocks">🎲</div>
          <div className="about-us-decor-teddy">🧸</div>
          <div className="about-us-decor-cloud">☁️</div>
          <div className="about-us-decor-palette">🎨</div>

          <div className="video-glass-container">
            <video 
              src="/about-us.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="promo-video-player"
            />
          </div>

          {/* Conditional Floating Dashboard UI Cards by Scene */}
          {scene === 1 && (
            <>
              <div className="floating-ui-card ui-card-attendance slide-from-left">
                <div className="ui-card-icon bg-green-light">📅</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Attendance</div>
                  <div className="ui-card-value">
                    <AnimatedNumber value={92} suffix="%" />
                  </div>
                  <div className="ui-card-desc">18 of 20 Present</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-reports pop-from-top">
                <div className="ui-card-icon bg-blue-light">📋</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Daily Report</div>
                  <div className="ui-card-value font-small">Log Updated</div>
                  <div className="ui-card-desc">Storytelling activity</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-progress grow-upward">
                <div className="ui-card-icon bg-purple-light">📈</div>
                <div className="ui-card-content" style={{ width: '100%' }}>
                  <div className="ui-card-title">Cognitive Skill</div>
                  <div className="ui-card-value flex-row-between">
                    <span>Progress</span>
                    <AnimatedNumber value={80} suffix="%" />
                  </div>
                  <ProgressBar value={80} color="var(--primary)" />
                </div>
              </div>

              <div className="floating-ui-card ui-card-meals slide-from-right">
                <div className="ui-card-icon bg-orange-light">🍎</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Meals Tracker</div>
                  <div className="ui-card-value font-small">Morning Fruit</div>
                  <div className="ui-card-desc">Finished portion</div>
                </div>
              </div>
            </>
          )}

          {scene === 2 && (
            <>
              <div className="floating-ui-card ui-card-palette rotate-in">
                <div className="ui-card-icon bg-yellow-light">🎨</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Art Activity</div>
                  <div className="ui-card-value font-small">Pastels Set</div>
                  <div className="ui-card-desc">Finger Painting</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-creativity grow-upward">
                <div className="ui-card-icon bg-pink-light">✨</div>
                <div className="ui-card-content" style={{ width: '100%' }}>
                  <div className="ui-card-title">Creativity Score</div>
                  <div className="ui-card-value flex-row-between">
                    <span>Creative Quotient</span>
                    <AnimatedNumber value={95} suffix="%" />
                  </div>
                  <ProgressBar value={95} color="#EC4899" />
                </div>
              </div>

              <div className="floating-ui-card ui-card-activity pop-from-top">
                <div className="ui-card-icon bg-blue-light">✂️</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Motor Skills</div>
                  <div className="ui-card-value font-small">Paper Collage</div>
                  <div className="ui-card-desc">Active handwork</div>
                </div>
              </div>
            </>
          )}

          {scene === 3 && (
            <>
              <div className="floating-ui-card ui-card-fitness pop-from-top">
                <div className="ui-card-content flex-row-between" style={{ width: '100%', gap: '8px' }}>
                  <div>
                    <div className="ui-card-title">Outdoor Play</div>
                    <div className="ui-card-value">Active</div>
                    <div className="ui-card-desc">Target achieved</div>
                  </div>
                  <RadialProgress value={85} color="#10B981" />
                </div>
              </div>

              <div className="floating-ui-card ui-card-playtime slide-from-left">
                <div className="ui-card-icon bg-purple-light">⏱️</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Playtime</div>
                  <div className="ui-card-value">
                    <AnimatedNumber value={45} suffix=" min" />
                  </div>
                  <div className="ui-card-desc">Outdoor games</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-safety slide-from-right">
                <div className="ui-card-icon bg-teal-light">🛡️</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Safety Status</div>
                  <div className="ui-card-value font-small">Secured</div>
                  <div className="ui-card-desc">Verified area</div>
                </div>
              </div>
            </>
          )}

          {scene === 4 && (
            <>
              <div className="floating-ui-card ui-card-sleep grow-upward">
                <div className="ui-card-icon bg-indigo-light">🌙</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Sleep Tracker</div>
                  <div className="ui-card-value">
                    <AnimatedNumber value={1.5} decimals={1} suffix=" hrs" />
                  </div>
                  <div className="ui-card-desc">Rest cycle done</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-meal-update slide-from-right">
                <div className="ui-card-icon bg-orange-light">🍲</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Lunch Update</div>
                  <div className="ui-card-value font-small">Veg Pulav</div>
                  <div className="ui-card-desc">Finished portion</div>
                </div>
              </div>

              <div className="floating-ui-card ui-card-notification pop-from-top">
                <div className="ui-card-icon bg-pink-light">💬</div>
                <div className="ui-card-content">
                  <div className="ui-card-title">Parent Alert</div>
                  <div className="ui-card-value font-small">Photos shared!</div>
                  <div className="ui-card-desc">1 new message</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Animated Text Content */}
        <div className="about-us-right" style={{ minHeight: '380px' }}>
          <div className="about-tabs">
            <button className={`about-tab ${aboutState === 1 ? 'active' : ''}`} onClick={() => setAboutState(1)}>Overview</button>
            <button className={`about-tab tab-cyan ${aboutState === 2 ? 'active' : ''}`} onClick={() => setAboutState(2)}>Pedagogy</button>
            <button className={`about-tab tab-emerald ${aboutState === 3 ? 'active' : ''}`} onClick={() => setAboutState(3)}>Infrastructure</button>
            <button className={`about-tab tab-purple ${aboutState === 4 ? 'active' : ''}`} onClick={() => setAboutState(4)}>Leadership</button>
          </div>

          <div className="about-text-animate-wrapper" key={aboutState}>
            {aboutState === 1 && (
              <>
                <div className="about-us-label">About Us</div>
                <h2 className="about-us-heading">A Trusted Place for Early Learning & Care</h2>
                <p className="about-us-p1">
                  FirstCry Intellitots is a modern preschool and daycare platform designed to create a safe, engaging, and joyful learning environment for children. Our mission is to support early childhood development through interactive learning, creative activities, and personalized care.
                </p>
                <p className="about-us-p2">
                  With smart digital management, parents can stay connected through real-time updates on admissions, daily activities, attendance, meals, and child progress. From classroom learning to playtime and daycare support, we focus on building confidence, creativity, and strong foundational skills in every child.
                </p>
                <p className="about-us-p3">
                  At FirstCry Intellitots, we believe every child deserves the best start in life, combining education, care, and technology to shape bright futures.
                </p>
              </>
            )}
            {aboutState === 2 && (
              <>
                <div className="about-us-label label-cyan">OUR PEDAGOGY</div>
                <h2 className="about-us-heading text-color-cyan">Scientific Curriculum & Child Pedagogy</h2>
                <p className="about-us-p1">
                  Our uniquely designed Intelli-C curriculum focuses on six critical learning pathways: language proficiency, cognitive development, physical well-being, creative expression, social-emotional learning, and scientific inquiry.
                </p>
                <p className="about-us-p2">
                  By combining experiential play-based modules with structured classroom learning, we prepare children to adapt to primary school curriculums with absolute ease, curiosity, and confidence.
                </p>
                <p className="about-us-p3">
                  With a low caregiver-to-child ratio of 1:8, we ensure that every milestone—whether in vocabulary development, coordination, or social skills—is observed, tracked, and nurtured.
                </p>
              </>
            )}
            {aboutState === 3 && (
              <>
                <div className="about-us-label label-emerald">SAFE & SECURE CAMPUS</div>
                <h2 className="about-us-heading text-color-emerald">State-of-the-Art & Safe Infrastructure</h2>
                <p className="about-us-p1">
                  At FirstCry Intellitots, we prioritize child safety above all else. Our campus is equipped with 24/7 CCTV surveillance, biometric-controlled secure access gates, and pediatric first-aid stations to ensure complete peace of mind for parents.
                </p>
                <p className="about-us-p2">
                  Our classrooms are designed with child-friendly rounded-corner furniture, anti-skid rubberized soft-flooring, and continuous HEPA air filtration. Every playzone is sanitization-checked daily and meets rigorous child safety standards.
                </p>
                <p className="about-us-p3">
                  Through smart RFID cards, parents receive real-time automated check-in and check-out updates as soon as their child enters or leaves the preschool premises.
                </p>
              </>
            )}
            {aboutState === 4 && (
              <>
                <div className="about-us-label label-purple">BOARD OF DIRECTORS</div>
                <h2 className="about-us-heading text-color-purple">Meet Our Visionary Leadership</h2>
                <p className="about-us-p1" style={{ marginBottom: '1.25rem' }}>
                  FirstCry Intellitots is steered by a team of industry veterans and education reformists dedicated to scaling child care standards, parent trust, and digital-first early pedagogy.
                </p>
                <div className="leadership-grid">
                  <div className="leader-card">
                    <img 
                      src="https://images.openai.com/static-rsc-4/TqrDz3GXVulMX7Zhl5w3cbncAhW0TiKzTClBedpQz4n4zZjcN7-4d6q4RKmUXnjSEcCq5vym9YqRe9mwBMkkUQIcQ6w1oex7cjc9FsPCu6arT1rGQavpf2aakgMpu9a11EA9PNmPHEWGsgan27rtwKnMUsz3PRxW3DDQF26y-lQksFAzIGME04qCiNcjGsG_?purpose=fullsize" 
                      className="leader-img" 
                      alt="Supam Maheshwari" 
                    />
                    <div className="leader-info">
                      <div className="leader-name">Supam Maheshwari</div>
                      <div className="leader-role">Managing Director & CEO</div>
                    </div>
                  </div>
                  <div className="leader-card">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgXOjJVX94oJVoCt0tdpMpJFlNk72ltFP8WILwvSgCQ&s=10" 
                      className="leader-img" 
                      alt="Sanket Hattimattur" 
                    />
                    <div className="leader-info">
                      <div className="leader-name">Sanket Hattimattur</div>
                      <div className="leader-role">Executive Director & Board Member</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PROGRAMS */}
      <PreschoolPrograms setActivePage={setActivePage} onShowToast={onShowToast} />

      {/* ADVANTAGE */}
      <IntellitotsAdvantage />

      {/* TESTIMONIALS */}
      <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1rem' }}>What Parents Say</h2>
      <div className="testimonial-grid section-gap">
        {initialTestimonials.map((test, idx) => (
          <div className="testimonial" key={idx}>
            <div className="stars">{'★'.repeat(test.stars)}{'☆'.repeat(5 - test.stars)}</div>
            <p>{test.text}</p>
            <div className="test-author">
              <div className="test-avatar">{test.initial}</div>
              <div>
                <div className="test-name">{test.author}</div>
                <div className="test-role">{test.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* READY TO JOIN */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#F8F7FF,var(--primary-light))', borderColor: 'var(--primary-light)' }}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🎓</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '.5rem' }}>Ready to join our family?</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.25rem' }}>
            Limited seats available for 2024–25. Don't miss out!
          </p>
          <button className="btn btn-primary" onClick={() => setActivePage('enquiry')} style={{ marginRight: '.5rem' }}>
            📝 Submit Enquiry
          </button>
          <button className="btn btn-outline" onClick={() => setActivePage('prebook')}>
            🎫 Pre-book Seat
          </button>
        </div>
      </div>
    </div>
  );
}
