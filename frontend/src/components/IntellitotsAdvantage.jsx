import React, { useState, useEffect, useRef } from 'react';

const advantagesData = [
  {
    title: 'Award Winning Curriculum',
    desc: 'Well researched curriculum, developed by early education experts with decades of rich industry experience.',
    type: 'yellow',
    color: '#FBBF24',
    iconType: 'trophy'
  },
  {
    title: 'Personalized Attention',
    desc: '1:8 adult to student ratio ensures your child receives all the attention they need.',
    type: 'orange',
    color: '#FF9F1C',
    iconType: 'parent'
  },
  {
    title: 'Expert Educators',
    desc: "Highly trained early learning educators to ensure your child's all-round development.",
    type: 'yellow',
    color: '#FBBF24',
    iconType: 'teacher'
  },
  {
    title: 'Exclusive Welcome Kit',
    desc: 'An all-inclusive welcome kit with everything your child needs for the Academic year!',
    type: 'orange',
    color: '#FF9F1C',
    iconType: 'welcome-kit'
  },
  {
    title: 'Safety',
    desc: 'Secure, trusted and safe atmosphere for kids with CCTV access.',
    type: 'yellow',
    color: '#FBBF24',
    iconType: 'safety'
  },
  {
    title: 'Interactive Parent App',
    desc: "Easily track your child's progress, learning milestones, and more!",
    type: 'orange',
    color: '#FF9F1C',
    iconType: 'parent-app'
  }
];

// Header letter split helper
const BouncyTitle = ({ text, trigger }) => {
  if (!trigger) return <h2 className="advantage-title">{text}</h2>;
  return (
    <h2 className="advantage-title">
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          className="bounce-title-letter"
          style={{ animationDelay: `${idx * 0.04}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h2>
  );
};

// Card heading letter split helper
const AnimatedHeading = ({ text, delayOffset = 0, trigger }) => {
  if (!trigger) {
    return <h4 className="advantage-card-title">{text}</h4>;
  }

  return (
    <h4 className="advantage-card-title">
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          style={{ animationDelay: `${delayOffset + index * 0.02}s` }}
          className="reveal-letter"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h4>
  );
};

export default function IntellitotsAdvantage() {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [revealedCards, setRevealedCards] = useState({});
  const [pathD, setPathD] = useState('');
  
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // Auto-play storyteller sequence loop (advances every 2 seconds)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveHighlightIndex(prev => (prev + 1) % advantagesData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Scroll Reveal Observer for Section Intro
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          sectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Card reveals and active card scroll focus
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -25% 0px',
      threshold: 0.2
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-index'), 10);
        
        if (entry.isIntersecting) {
          // Trigger entry reveal (fade-in/slide-up)
          setRevealedCards(prev => ({ ...prev, [index]: true }));
        }
      });
    }, observerOptions);

    cardRefs.current.forEach(card => {
      if (card) cardObserver.observe(card);
    });

    return () => {
      cardRefs.current.forEach(card => {
        if (card) cardObserver.unobserve(card);
      });
    };
  }, []);

  // Calculate coordinates and build path dynamically
  const updatePath = () => {
    if (!containerRef.current || cardRefs.current.length < 6) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const isSingleColumn = window.innerWidth <= 768;

    if (isSingleColumn) {
      // Dotted vertical line connecting all cards sequentially
      let d = '';
      const activeCoords = [];
      
      cardRefs.current.forEach((card, idx) => {
        if (card && revealedCards[idx]) {
          const rect = card.getBoundingClientRect();
          activeCoords.push({
            x: rect.left + rect.width / 2 - containerRect.left,
            yTop: rect.top - containerRect.top,
            yBottom: rect.bottom - containerRect.top
          });
        }
      });

      if (activeCoords.length > 1) {
        d = `M ${activeCoords[0].x} ${activeCoords[0].yBottom}`;
        for (let i = 1; i < activeCoords.length; i++) {
          d += ` L ${activeCoords[i].x} ${activeCoords[i].yTop} M ${activeCoords[i].x} ${activeCoords[i].yBottom}`;
        }
      }
      setPathD(d);
      return;
    }

    // 2-Column curved learning path coordinates
    const coords = cardRefs.current.map((card, idx) => {
      if (!card || !revealedCards[idx]) return null;
      const rect = card.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
        width: rect.width,
        height: rect.height
      };
    });

    // Draw smooth curved bezier journey path
    try {
      let d = '';
      
      // Connection 1 -> 2
      if (coords[0] && coords[1]) {
        const start = { x: coords[0].right - 20, y: coords[0].y };
        const end = { x: coords[1].left + 20, y: coords[1].y };
        d += `M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`;
      }
      
      // Connection 2 -> 3
      if (coords[1] && coords[2]) {
        const start = { x: coords[1].x, y: coords[1].bottom - 10 };
        const end = { x: coords[2].x, y: coords[2].top + 10 };
        d += ` M ${start.x} ${start.y} C ${start.x} ${start.y + 35}, ${end.x} ${end.y - 35}, ${end.x} ${end.y}`;
      }

      // Connection 3 -> 4
      if (coords[2] && coords[3]) {
        const start = { x: coords[2].right - 20, y: coords[2].y };
        const end = { x: coords[3].left + 20, y: coords[3].y };
        d += ` M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`;
      }

      // Connection 4 -> 5
      if (coords[3] && coords[4]) {
        const start = { x: coords[3].x, y: coords[3].bottom - 10 };
        const end = { x: coords[4].x, y: coords[4].top + 10 };
        d += ` M ${start.x} ${start.y} C ${start.x} ${start.y + 35}, ${end.x} ${end.y - 35}, ${end.x} ${end.y}`;
      }

      // Connection 5 -> 6
      if (coords[4] && coords[5]) {
        const start = { x: coords[4].right - 20, y: coords[4].y };
        const end = { x: coords[5].left + 20, y: coords[5].y };
        d += ` M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`;
      }

      setPathD(d);
    } catch (e) {
      console.log('Error drawing journey path:', e);
    }
  };

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    const timer = setTimeout(updatePath, 800);
    return () => {
      window.removeEventListener('resize', updatePath);
      clearTimeout(timer);
    };
  }, [revealedCards]);

  const handleCardMouseEnter = (index) => {
    setIsHovered(true);
    setActiveHighlightIndex(index);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
  };

  // Render SVG icons
  const renderIcon = (type) => {
    switch (type) {
      case 'trophy':
        return (
          <svg className="adv-svg-icon trophy-icon" viewBox="0 0 64 64" fill="none">
            <path d="M14 22C14 16 18 16 18 16V28C18 28 14 28 14 22Z" stroke="#E28743" strokeWidth="3"/>
            <path d="M50 22C50 16 46 16 46 16V28C46 28 50 28 50 22Z" stroke="#E28743" strokeWidth="3"/>
            <path d="M18 14H46V28C46 36 39 42 32 42C25 42 18 36 18 28V14Z" fill="#FCD34D" stroke="#E28743" strokeWidth="3"/>
            <path d="M32 42V52" stroke="#E28743" strokeWidth="3"/>
            <path d="M22 52H42" stroke="#E28743" strokeWidth="4"/>
            <path d="M28 20L36 20L36 8L32 4L28 8V20Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5"/>
            <line x1="32" y1="8" x2="32" y2="20" stroke="#B91C1C" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="2" fill="#F59E0B" />
            <circle cx="52" cy="10" r="2.5" fill="#F59E0B" />
          </svg>
        );
      case 'parent':
        return (
          <svg className="adv-svg-icon parent-icon" viewBox="0 0 64 64" fill="none">
            <circle cx="24" cy="20" r="8" fill="#E5E7EB" stroke="#4B5563" strokeWidth="3"/>
            <path d="M10 44C10 36 16 32 24 32C32 32 38 36 38 44V48H10V44Z" fill="#10B981" stroke="#047857" strokeWidth="3"/>
            <circle cx="44" cy="28" r="6" fill="#FFF" stroke="#4B5563" strokeWidth="2.5"/>
            <path d="M34 46C34 40 38 37 44 37C50 37 54 40 54 46V48H34V46Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5"/>
          </svg>
        );
      case 'teacher':
        return (
          <svg className="adv-svg-icon teacher-icon" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="24" r="8" fill="#E5E7EB" stroke="#1E3A8A" strokeWidth="3"/>
            <path d="M22 14L32 10L42 14L32 18L22 14Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2.5"/>
            <path d="M40 15V22" stroke="#172554" strokeWidth="2"/>
            <circle cx="40" cy="22" r="1.5" fill="#172554"/>
            <path d="M18 48C18 40 24 36 32 36C40 36 46 40 46 48V52H18V48Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3"/>
            <path d="M32 40.5C31.5 40 30 40 30 41.5C30 43 32 44.5 32 44.5C32 44.5 34 43 34 41.5C34 40 32.5 40 32 40.5Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1"/>
            <path d="M14 34L18 30L22 34V46L18 43L14 46V34Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
          </svg>
        );
      case 'welcome-kit':
        return (
          <svg className="adv-svg-icon kit-icon" viewBox="0 0 64 64" fill="none">
            {/* Box flaps & Container */}
            <path d="M12 28L32 38L52 28V48L32 56L12 48V28Z" fill="#FFFDF2" stroke="#E28743" strokeWidth="3" className="kit-box-body"/>
            <path d="M12 28L32 18L52 28" stroke="#E28743" strokeWidth="3" className="kit-box-line"/>
            {/* Left Flap */}
            <path d="M12 28L4 20L24 12L32 18" fill="#FFFDF2" stroke="#E28743" strokeWidth="2.5" className="kit-flap-left"/>
            {/* Right Flap */}
            <path d="M52 28L60 20L40 12L32 18" fill="#FFFDF2" stroke="#E28743" strokeWidth="2.5" className="kit-flap-right"/>
            {/* Box items */}
            <path d="M26 22H38V12H26V22Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" className="kit-book"/>
            <path d="M42 22V8L44 6L46 8V22H42Z" fill="#FCD34D" stroke="#D97706" strokeWidth="2" className="kit-pencil"/>
            <path d="M18 22V6H22V22H18Z" fill="#10B981" stroke="#047857" strokeWidth="2" className="kit-ruler"/>
          </svg>
        );
      case 'safety':
        return (
          <svg className="adv-svg-icon safety-icon" viewBox="0 0 64 64" fill="none">
            <path d="M32 6C32 6 48 10 48 18C48 34 38 48 32 54C26 48 16 34 16 18C16 10 32 6 32 6Z" fill="#FFF" stroke="#1E3A8A" strokeWidth="3" className="shield-path"/>
            <path d="M32 10C32 10 44 13 44 20C44 32 36 44 32 49C28 44 20 32 20 20C20 13 32 10 32 10Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" className="shield-fill"/>
            <circle cx="32" cy="24" r="5" fill="#FFF" stroke="#1E3A8A" strokeWidth="2.5"/>
            <path d="M24 38C24 33 28 31 32 31C36 31 40 33 40 38V41H24V38Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2.5"/>
            <path d="M26 14C29 12.5 35 12.5 38 14" stroke="#1E3A8A" strokeWidth="2"/>
          </svg>
        );
      case 'parent-app':
        return (
          <svg className="adv-svg-icon app-icon" viewBox="0 0 64 64" fill="none">
            <rect x="18" y="8" width="28" height="48" rx="5" fill="#FFF" stroke="#0E7490" strokeWidth="3"/>
            <circle cx="32" cy="51" r="2.5" fill="#0E7490"/>
            <rect x="22" y="14" width="20" height="30" rx="2" fill="#E0F2FE" stroke="#0E7490" strokeWidth="1.5"/>
            <circle cx="32" cy="24" r="5" stroke="#FF9F1C" strokeWidth="2"/>
            <circle cx="36" cy="36" r="4" stroke="#EF4444" strokeWidth="1.5" className="tap-ripple"/>
            <circle cx="36" cy="36" r="7" stroke="#EF4444" strokeWidth="1" className="tap-ripple-outer"/>
            <path d="M36 36L44 48L38 52L32 44L34 38L36 36Z" fill="#FCD34D" stroke="#D97706" strokeWidth="2" className="tap-finger"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className={`advantage-section ${isInView ? 'in-view' : ''}`}
      id="intellitots-advantage"
    >
      {/* Layered Animated mesh gradient background */}
      <div className="adv-layered-bg">
        <div className="bg-blur-blob blob-1"></div>
        <div className="bg-blur-blob blob-2"></div>
        <div className="bg-blur-blob blob-3"></div>
      </div>

      {/* Background decorations */}
      <div className="adv-bg-decorations">
        {/* Floating Stars */}
        <span className="adv-star st-1">★</span>
        <span className="adv-star st-2">★</span>
        <span className="adv-star st-3">★</span>

        {/* Tiny Hearts */}
        <span className="adv-heart ht-1">❤️</span>
        <span className="adv-heart ht-2">❤️</span>
        <span className="adv-heart ht-3">❤️</span>

        {/* Learning Symbols */}
        <span className="adv-symbol sy-abc">ABC</span>
        <span className="adv-symbol sy-pencil">✏️</span>
        <span className="adv-symbol sy-book">📚</span>

        {/* Clouds */}
        <span className="adv-cloud cl-1">☁️</span>
        <span className="adv-cloud cl-2">☁️</span>

        {/* Paper planes */}
        <span className="adv-plane pl-1">✈️</span>

        {/* Bubbles */}
        <span className="adv-bubble ab-1"></span>
        <span className="adv-bubble ab-2"></span>
        <span className="adv-bubble ab-3"></span>
        <span className="adv-bubble ab-4"></span>
      </div>

      <div className="section-container">
        {/* Header Intro Animation */}
        <div className="advantage-section-header">
          {/* Sparkles around title */}
          <span className="title-sparkle ts-1">✨</span>
          <span className="title-sparkle ts-2">⭐</span>
          <span className="title-sparkle ts-3">✨</span>

          <BouncyTitle text="The 6 Point Intellitots Advantage" trigger={isInView} />
          <div className="title-underline"></div>
        </div>

        {/* 2-Column Grid Container */}
        <div ref={containerRef} className="advantage-grid-container">
          
          {/* Animated Connecting SVG path */}
          {pathD && (
            <svg className="journey-path-svg" viewBox={`0 0 ${containerRef.current?.clientWidth || 1200} ${containerRef.current?.clientHeight || 800}`}>
              <path
                d={pathD}
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="journey-path"
              />
              {/* Highlight Overlay Segment */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF9F1C"
                strokeWidth="5.5"
                strokeLinecap="round"
                className="journey-path-highlight"
                style={{
                  strokeDasharray: '120, 900',
                  strokeDashoffset: `${450 - (activeHighlightIndex * 155)}px`,
                  transition: 'stroke-dashoffset 1s ease-in-out',
                  filter: 'drop-shadow(0 0 5px #FF9F1C)'
                }}
              />
            </svg>
          )}

          {/* Glowing spark travelling along the path */}
          {pathD && (
            <div 
              className="journey-glow-spark"
              style={{
                offsetPath: `path('${pathD}')`,
                offsetDistance: `${(activeHighlightIndex / 5) * 100}%`,
                WebkitOffsetPath: `path('${pathD}')`,
                transition: 'offset-distance 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
            />
          )}

          {advantagesData.map((adv, idx) => {
            const isRevealed = revealedCards[idx];
            const isHighlighted = idx === activeHighlightIndex;

            return (
              <div
                key={idx}
                ref={el => cardRefs.current[idx] = el}
                data-index={idx}
                className={`advantage-card-wrapper ${isRevealed ? 'revealed' : ''}`}
                style={{ transitionDelay: `${(idx % 2) * 0.12}s` }}
              >
                <div 
                  className={`advantage-card card-${adv.type} ${isHighlighted ? 'active-focus story-highlight' : ''}`}
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Sparkles on Hover */}
                  <div className="hover-sparkles">
                    <span className="sparkle sp-1">✨</span>
                    <span className="sparkle sp-2">⭐</span>
                    <span className="sparkle sp-3">✨</span>
                  </div>

                  {/* Icon Area */}
                  <div className="advantage-icon-container">
                    {renderIcon(adv.iconType)}
                  </div>

                  {/* Content Area */}
                  <div className="advantage-content">
                    <AnimatedHeading 
                      text={adv.title} 
                      delayOffset={(idx % 2) * 0.12 + 0.2} 
                      trigger={isRevealed} 
                    />
                    <p className="advantage-card-desc">{adv.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
