import React, { useState, useEffect } from 'react';

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

export default function AboutUs({ setActivePage, onShowToast }) {
  const [scene, setScene] = useState(1);
  const [aboutState, setAboutState] = useState(1);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScene(prev => (prev === 4 ? 1 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutState(prev => (prev === 3 ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // scale -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // scale -1 to 1
        containerRef.current.style.setProperty('--mouse-x', x);
        containerRef.current.style.setProperty('--mouse-y', y);
      }
    };

    const handleScroll = () => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-y', window.scrollY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * 8; // max tilt 8deg
    const tiltY = -((x - centerX) / centerX) * 8; // max tilt 8deg
    card.style.setProperty('--tilt-x', `${tiltX}deg`);
    card.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  const floatingObjects = [
    { id: 1, label: '🅰️', className: 'float-block-a', speed: 0.15, rotationSpeed: 0.4, size: '48px', top: '12%', left: '6%' },
    { id: 2, label: '🧸', className: 'float-teddy', speed: -0.1, rotationSpeed: -0.2, size: '54px', top: '48%', left: '3%' },
    { id: 3, label: '✏️', className: 'float-pencil', speed: 0.18, rotationSpeed: 0.5, size: '40px', top: '80%', left: '8%' },
    { id: 4, label: '📖', className: 'float-book', speed: -0.12, rotationSpeed: -0.3, size: '46px', top: '24%', right: '5%' },
    { id: 5, label: '🎈', className: 'float-balloon', speed: 0.22, rotationSpeed: 0.18, size: '50px', top: '64%', right: '8%' },
    { id: 6, label: '🧩', className: 'float-puzzle', speed: -0.16, rotationSpeed: 0.6, size: '44px', top: '85%', right: '4%' },
    { id: 7, label: '🚀', className: 'float-rocket', speed: 0.25, rotationSpeed: 0.3, size: '52px', top: '4%', right: '10%' },
    { id: 8, label: '☁️', className: 'float-cloud-1', speed: -0.06, rotationSpeed: 0.05, size: '60px', top: '8%', left: '42%' },
    { id: 9, label: '⭐', className: 'float-star-gold', speed: 0.12, rotationSpeed: 0.7, size: '36px', top: '32%', left: '16%' },
    { id: 10, label: '🅱️', className: 'float-block-b', speed: -0.14, rotationSpeed: -0.4, size: '48px', top: '58%', left: '12%' },
    { id: 11, label: '🎨', className: 'float-palette', speed: 0.16, rotationSpeed: 0.25, size: '46px', top: '70%', right: '20%' },
  ];

  return (
    <div id="page-about" className="page active" ref={containerRef} style={{ padding: '2rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Premium Animated Background Layers */}
      <div className="bg-dynamic-gradient"></div>
      
      <div className="bg-glow-blobs">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>
        <div className="glow-blob blob-4"></div>
      </div>

      <div className="bg-waves">
        <svg className="wave-svg wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(243, 232, 255, 0.4)" d="M0,96L80,112C160,128,320,160,480,154.7C640,149,800,107,960,96C1120,85,1280,107,1360,117.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <svg className="wave-svg wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(254, 243, 199, 0.3)" d="M0,192L60,192C120,192,240,192,360,170.7C480,149,600,107,720,117.3C840,128,960,192,1080,197.3C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="bg-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`bg-particle p-${i}`} 
            style={{
              '--p-delay': `${i * -0.4}s`,
              '--p-left': `${(i * 7.3) % 100}%`,
              '--p-top': `${(i * 11.7) % 100}%`,
              '--p-size': `${(i % 3) * 5 + 8}px`,
              '--p-speed': `${((i % 4) + 1.5) * 0.04}`,
            }}
          />
        ))}
      </div>

      {/* 3D Floating Elements */}
      <div className="floating-3d-container">
        {floatingObjects.map(obj => (
          <div
            key={obj.id}
            className={`floating-3d-asset ${obj.className}`}
            style={{
              position: 'absolute',
              top: obj.top,
              left: obj.left,
              right: obj.right,
              fontSize: obj.size,
              '--parallax-speed': obj.speed,
              '--rotation-speed': obj.rotationSpeed,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {obj.label}
          </div>
        ))}
      </div>

      <div id="about-us" className={`about-us-split-container theme-${aboutState}`} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
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
          </div>
        </div>
      </div>

      {/* Visionary Leadership Section */}
      <div className="about-leadership-section" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
        <div className="about-leadership-label">BOARD OF DIRECTORS</div>
        <h2 className="about-leadership-heading">Meet Our Visionary Leadership</h2>
        <p className="about-leadership-desc">
          FirstCry Intellitots is steered by a team of industry veterans and education reformists dedicated to scaling child care standards, parent trust, and digital-first early pedagogy.
        </p>
        
        <div className="about-leadership-grid">
          <div className="about-leader-card">
            <div className="about-leader-img-wrapper">
              <img 
                src="https://images.openai.com/static-rsc-4/TqrDz3GXVulMX7Zhl5w3cbncAhW0TiKzTClBedpQz4n4zZjcN7-4d6q4RKmUXnjSEcCq5vym9YqRe9mwBMkkUQIcQ6w1oex7cjc9FsPCu6arT1rGQavpf2aakgMpu9a11EA9PNmPHEWGsgan27rtwKnMUsz3PRxW3DDQF26y-lQksFAzIGME04qCiNcjGsG_?purpose=fullsize" 
                className="about-leader-img" 
                alt="Supam Maheshwari" 
              />
            </div>
            <div className="about-leader-info">
              <h3 className="about-leader-name">Supam Maheshwari</h3>
              <p className="about-leader-role">Managing Director & CEO</p>
              <p className="about-leader-bio">
                Co-founder and CEO of FirstCry, driving the vision to build Asia's largest parenting platform and child education framework.
              </p>
            </div>
          </div>

          <div className="about-leader-card">
            <div className="about-leader-img-wrapper">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgXOjJVX94oJVoCt0tdpMpJFlNk72ltFP8WILwvSgCQ&s=10" 
                className="about-leader-img" 
                alt="Sanket Hattimattur" 
              />
            </div>
            <div className="about-leader-info">
              <h3 className="about-leader-name">Sanket Hattimattur</h3>
              <p className="about-leader-role">Executive Director & Board Member</p>
              <p className="about-leader-bio">
                Instrumental in scaling operational standards, parent trust, and digital-first early pedagogy across all Intellitots campuses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
