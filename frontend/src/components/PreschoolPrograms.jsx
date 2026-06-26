import React, { useState, useEffect, useRef } from 'react';
import childBaby from '../assets/child_baby.png';
import childToddler from '../assets/child_toddler.png';
import childReadiness from '../assets/child_readiness.png';
import childNursery from '../assets/child_nursery.png';
import childPreprimary from '../assets/child_preprimary.png';

const programsData = [
  {
    name: 'Daycare',
    age: 'Age : 1 - 8 Years',
    image: childBaby,
    color: '#EF4444',
    bullets: [
      { text: 'Flexible timings and plans', color: '#3B82F6' },
      { text: 'Home-like comfort and safety', color: '#F59E0B' },
      { text: 'Well-balanced daily routine guided by expert caregivers', color: '#EC4899' },
      { text: 'Age-appropriate activities based on the Intelli-C curriculum', color: '#10B981' }
    ]
  },
  {
    name: 'Intellibaby Parent Toddler Circle',
    age: 'Age : 1 - 2 Years',
    image: childToddler,
    color: '#10B981',
    bullets: [
      { text: '12 Month Brain Development Program', color: '#3B82F6' },
      { text: 'Pediatrician Approved Kit', color: '#F59E0B' },
      { text: 'Guided Sessions & Engaging Play-Based Activities.', color: '#EC4899' },
      { text: 'Social Engagement With Other Toddlers and Parents.', color: '#10B981' }
    ]
  },
  {
    name: 'Tots Readiness Program',
    age: 'Age : 1.5 - 3 Years',
    image: childReadiness,
    color: '#3B82F6',
    bullets: [
      { text: 'Settlement Program for Easy Transition from Home to Preschool', color: '#3B82F6' },
      { text: 'Helps adapt to a new routine and environment', color: '#EC4899' },
      { text: 'Supports comprehensive physical and cognitive growth', color: '#10B981' }
    ]
  },
  {
    name: 'Toddler',
    age: 'Age : 2 - 3 Years',
    image: childToddler,
    color: '#F59E0B',
    bullets: [
      { text: '3 hours of daily classes', color: '#3B82F6' },
      { text: 'Focuses on primary areas of development', color: '#F59E0B' },
      { text: 'Nurtures and build motors abilities, languages skills, social-emotional skills and cognitive skills', color: '#EC4899' }
    ]
  },
  {
    name: 'Nursery',
    age: 'Age : 3 - 4 Years',
    image: childNursery,
    color: '#8B5CF6',
    bullets: [
      { text: '3 hours of daily classes', color: '#3B82F6' },
      { text: 'Introduces learning through themes', color: '#F59E0B' },
      { text: 'Stimulates curiosity, exploration and creativity', color: '#EC4899' },
      { text: 'Promotes constructive learning', color: '#10B981' }
    ]
  },
  {
    name: 'Pre-Primary 1',
    age: 'Age : 4 - 5 Years',
    image: childPreprimary,
    color: '#EC4899',
    bullets: [
      { text: '4 hours of daily classes', color: '#3B82F6' },
      { text: 'Prepares them for school', color: '#F59E0B' },
      { text: 'Introduces math concepts and valuable social skills', color: '#EC4899' },
      { text: 'Develops reading and writing skills', color: '#10B981' }
    ]
  },
  {
    name: 'Pre-Primary 2',
    age: 'Age : 5 - 6 Years',
    image: childPreprimary,
    color: '#06B6D4',
    bullets: [
      { text: '4 hours of daily classes', color: '#3B82F6' },
      { text: 'Prepares them for school', color: '#F59E0B' },
      { text: 'Introduces math concepts and valuable social skills', color: '#EC4899' },
      { text: 'Develops reading and writing skills', color: '#10B981' }
    ]
  }
];

export default function PreschoolPrograms({ setActivePage, onShowToast }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Set up intersection observer for card entry animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Setup autoplay loop
  const startAutoplay = () => {
    stopAutoplay();
    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % programsData.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const handlePrev = () => {
    stopAutoplay();
    setActiveIndex((prev) => (prev - 1 + programsData.length) % programsData.length);
    startAutoplay();
  };

  const handleNext = () => {
    stopAutoplay();
    setActiveIndex((prev) => (prev + 1) % programsData.length);
    startAutoplay();
  };

  const handleDotClick = (index) => {
    stopAutoplay();
    setActiveIndex(index);
    startAutoplay();
  };

  const handleCardSelect = (index, name) => {
    if (index === activeIndex) {
      if (onShowToast) {
        onShowToast(`🌱 Program Selected: ${name}`);
      }
      setTimeout(() => {
        setActivePage('about');
      }, 300);
    } else {
      stopAutoplay();
      setActiveIndex(index);
      startAutoplay();
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className={`programs-carousel-section ${isInView ? 'in-view' : ''}`}
      id="preschool-programs-carousel"
    >
      {/* Decorative background elements */}
      <div className="bg-decorations">
        {/* Floating Clouds */}
        <div className="decor-cloud decor-cloud-1">☁️</div>
        <div className="decor-cloud decor-cloud-2">☁️</div>
        <div className="decor-cloud decor-cloud-3">☁️</div>

        {/* Floating Stars */}
        <div className="decor-star decor-star-1">★</div>
        <div className="decor-star decor-star-2">★</div>
        <div className="decor-star decor-star-3">★</div>

        {/* Paper Planes */}
        <div className="decor-plane decor-plane-1">✈️</div>
        <div className="decor-plane decor-plane-2">✈️</div>

        {/* Tiny Books */}
        <div className="decor-book decor-book-1">📖</div>
        <div className="decor-book decor-book-2">📕</div>

        {/* Bubbles */}
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
      </div>

      <div className="section-container">
        <h2 className="carousel-section-title">Preschool Programs</h2>
        <p className="carousel-section-subtitle">Specially curated programs suited for your child's age group</p>

        {/* 3D Carousel container */}
        <div className="carousel-3d-wrapper">
          <button className="carousel-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous Program">
            ‹
          </button>

          <div className="carousel-track">
            {programsData.map((prog, idx) => {
              // Calculate circular relative distance
              const total = programsData.length;
              let diff = idx - activeIndex;
              while (diff < -3) diff += total;
              while (diff > 3) diff -= total;

              // Assign position class
              let posClass = 'card-hidden';
              if (diff === 0) posClass = 'card-active';
              else if (diff === -1) posClass = 'card-left-1';
              else if (diff === 1) posClass = 'card-right-1';
              else if (diff === -2) posClass = 'card-left-2';
              else if (diff === 2) posClass = 'card-right-2';
              else if (diff === -3) posClass = 'card-left-3';
              else if (diff === 3) posClass = 'card-right-3';

              const isActive = diff === 0;

              return (
                <div
                  key={idx}
                  className={`carousel-card-container ${posClass} ${isActive ? 'active' : ''}`}
                  onClick={() => handleCardSelect(idx, prog.name)}
                >
                  <div className="carousel-program-card" style={{ '--accent-color': prog.color }}>
                    {/* Active Floating Particles */}
                    {isActive && (
                      <div className="active-particles">
                        <span className="particle p1">✨</span>
                        <span className="particle p2">⭐</span>
                        <span className="particle p3">✨</span>
                        <span className="particle p4">⭐</span>
                        <span className="particle p5">🎈</span>
                        <span className="particle p6">✨</span>
                      </div>
                    )}

                    {/* Top layout */}
                    <div className="card-top-row">
                      <div className="hexagon-outer" style={{ '--border-color': prog.color }}>
                        <div className="hexagon-inner">
                          <img src={prog.image} alt={prog.name} className="child-avatar-img" />
                        </div>
                      </div>
                      <div className="card-header-info">
                        <h3 className="card-program-title">{prog.name}</h3>
                        <span className="age-badge">{prog.age}</span>
                      </div>
                    </div>

                    {/* Bullet List */}
                    <ul className="program-bullet-list">
                      {prog.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="bullet-item">
                          <span className="bullet-icon-container" style={{ backgroundColor: bullet.color }}>
                            <svg className="bullet-check-svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="bullet-text">{bullet.text}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Learn More Button */}
                    <div className="card-action-container">
                      <button 
                        className="btn-learn-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePage('about');
                        }}
                      >
                        Learn More <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-nav-btn next-btn" onClick={handleNext} aria-label="Next Program">
            ›
          </button>
        </div>

        {/* Navigation Dot indicators */}
        <div className="carousel-dots-container">
          {programsData.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot-indicator ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to program ${idx + 1}`}
              style={{
                backgroundColor: idx === activeIndex ? programsData[idx].color : 'rgba(0,0,0,0.15)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating double wave at bottom */}
      <div className="carousel-waves">
        <svg className="wave wave-back" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,45 C240,95 480,95 720,45 C960,-5 1200,-5 1440,45 L1440,120 L0,120 Z" fill="#ffffff" opacity="0.4"></path>
        </svg>
        <svg className="wave wave-front" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
