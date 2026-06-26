import React from 'react';

export default function SplashScreen({ fadeOut }) {
  return (
    <div id="splash-screen" className={fadeOut ? 'fade-out' : ''}>
      {/* VIEWPORT GRADIENT BORDERS */}
      <div className="splash-frame"></div>

      {/* WAVE DECORATIONS */}
      <div className="splash-decorations">
        <svg className="splash-wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
        </svg>
        <svg className="splash-wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L120,58.7C240,53,480,43,720,48C960,53,1200,75,1320,85.3L1440,96L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
        </svg>
      </div>

      {/* FLOATING PARTICLES */}
      <div className="splash-particle sp-star-1">⭐</div>
      <div className="splash-particle sp-star-2">🌟</div>
      <div className="splash-particle sp-heart-1">❤️</div>
      <div className="splash-particle sp-cloud-1">☁️</div>
      <div className="splash-particle sp-cloud-2">☁️</div>
      <div className="splash-particle sp-rocket">🚀</div>
      <div className="splash-particle sp-smiley">😊</div>
      <div className="splash-particle sp-plane">✈️</div>

      {/* VECTOR CLASSROOM ENVIRONMENT ART */}
      <div className="classroom-wall-tree"></div>

      <div className="classroom-board">
        <div className="classroom-board-text">WELCOME</div>
        <div className="classroom-board-math">1 + 2 = 3 | A B C</div>
      </div>

      <div className="classroom-bookshelf">
        <div className="bookshelf-shelf">
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
          <div className="shelf-toy"></div>
        </div>
        <div className="bookshelf-shelf">
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
        </div>
        <div className="bookshelf-shelf">
          <div className="shelf-book"></div>
          <div className="shelf-book"></div>
          <div className="shelf-toy"></div>
        </div>
      </div>

      {/* PLAYFUL FLOOR MAT */}
      <div className="classroom-play-mat">
        <div className="mat-pattern"></div>
        <div className="classroom-play-mat-squares">
          <div className="mat-square">A</div>
          <div className="mat-square">B</div>
          <div className="mat-square">C</div>
          <div className="mat-square">🎨</div>
        </div>
      </div>

      {/* DOTTED PATH TRAIL FOR THE BOY */}
      <svg className="boy-path-trail" viewBox="0 0 500 20" preserveAspectRatio="none">
        <path d="M 500 10 L 0 10" className="boy-trail-dots" />
      </svg>

      {/* VOICE WAVE RIPPLES */}
      <div className="voice-wave-container">
        <div className="voice-wave-ring"></div>
        <div className="voice-wave-ring"></div>
        <div className="voice-wave-ring"></div>
      </div>

      {/* STUDENT BOY CHARACTER WITH INNER SPEECH BUBBLE */}
      <div className="splash-boy-char">
        <div className="boy-body">
          {/* SPEECH BUBBLE OVER HIS HEAD */}
          <div className="splash-speech-bubble">
            <div className="splash-speech-text">
              "Welcome to FirstCry Intellitots!"
            </div>
          </div>

          <div className="boy-arm left"></div>
          <div className="boy-leg left">
            <div className="boy-shoe"></div>
          </div>
          <div className="boy-leg right">
            <div className="boy-shoe"></div>
          </div>
          <div className="boy-torso">
            <div className="boy-shirt-stripe"></div>
            <div className="boy-shorts"></div>
          </div>
          <div className="boy-head">
            <div className="boy-hair"></div>
            <div className="boy-face">
              <div className="boy-eyes"></div>
              <div className="boy-blush"></div>
              <div className="boy-smile"></div>
            </div>
          </div>
          <div className="boy-arm right"></div>
        </div>
      </div>

      {/* PERFECTLY CENTERED LARGE LOGO WRAPPER */}
      <div className="splash-center-wrapper">
        {/* ROTATING RAINBOW CIRCULAR BORDER */}
        <div className="splash-logo-ring"></div>

        {/* CENTER WHITE CIRCLE CONTAINER */}
        <div className="splash-logo-container">
          {/* Sparkles immediately surrounding the logo */}
          <div className="splash-particle sp-logo-sparkle-1">✨</div>
          <div className="splash-particle sp-logo-sparkle-2">✨</div>
          <div className="splash-particle sp-logo-sparkle-3">✨</div>
          <div className="splash-particle sp-logo-sparkle-4">✨</div>
          <div className="splash-particle sp-logo-sparkle-5">✨</div>
          <div className="splash-particle sp-logo-sparkle-6">✨</div>

          <div className="splash-logo-bounce">
            <svg viewBox="0 0 500 280" style={{ width: '100%', height: '100%' }}>
              {/* Smiling Sun in top-right */}
              <g transform="translate(380, 50)">
                <path d="M 0,-28 L 0,-36 M 0,28 L 0,36 M -28,0 L -36,0 M 28,0 L 36,0 M -20,-20 L -26,-26 M 20,20 L 26,26 M -20,20 L -26,26 M 20,-20 L 26,-26" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                <circle cx="0" cy="0" r="20" fill="#F59E0B" />
                <circle cx="-6" cy="-4" r="2.5" fill="#FAF7F0" />
                <circle cx="6" cy="-4" r="2.5" fill="#FAF7F0" />
                <path d="M -8,4 Q 0,12 8,4" stroke="#FAF7F0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>

              {/* Paper Plane near sun */}
              <path d="M 440,40 L 470,25 L 458,55 L 450,47 Z" fill="#22D3EE" opacity="0.8" />
              <path d="M 440,40 L 450,47 L 446,58 Z" fill="#0891B2" opacity="0.9" />

              {/* Logo Text Group */}
              <g transform="translate(50, 80)">
                {/* FIRSTCRY */}
                <g>
                  <text x="0" y="40" fontFamily="'Fredoka', sans-serif" fontSize="48" fontWeight="800" fill="#F59E0B" letterSpacing="1">first</text>
                  <text x="106" y="40" fontFamily="'Fredoka', sans-serif" fontSize="48" fontWeight="800" fill="#06B6D4" letterSpacing="1">cry</text>
                  <rect x="220" y="8" width="56" height="34" rx="10" fill="#8B5CF6" />
                  <text x="248" y="30" fontFamily="'Fredoka', sans-serif" fontSize="13" fontWeight="800" fill="#FFFFFF" textAnchor="middle">.com</text>
                </g>

                {/* INTELLITOTS */}
                <g transform="translate(0, 105)">
                  <text x="0" y="40" fontFamily="'Fredoka', sans-serif" fontSize="58" fontWeight="800" fill="#7C3AED">intelli</text>
                  <text x="195" y="40" fontFamily="'Fredoka', sans-serif" fontSize="58" fontWeight="800" fill="#06B6D4">t</text>
                  
                  {/* Smiley "o" Face */}
                  <g transform="translate(238, 18)">
                    <circle cx="24" cy="18" r="24" fill="#F59E0B" />
                    <circle cx="14" cy="12" r="3.5" fill="#1E1B4B" />
                    <circle cx="34" cy="12" r="3.5" fill="#1E1B4B" />
                    <path d="M 12,24 Q 24,36 36,24" stroke="#1E1B4B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </g>
                  
                  {/* "t" in green with graduation cap */}
                  <g transform="translate(294, 0)">
                    <text x="0" y="40" fontFamily="'Fredoka', sans-serif" fontSize="58" fontWeight="800" fill="#10B981">t</text>
                    <g transform="translate(0, -22) scale(0.8)">
                      <polygon points="12,0 36,8 12,16 -12,8" fill="#1E293B" />
                      <rect x="2" y="10" width="20" height="6" fill="#1E293B" />
                      <path d="M 36,8 L 38,20 L 35,22" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                    </g>
                  </g>
                  
                  <text x="328" y="40" fontFamily="'Fredoka', sans-serif" fontSize="58" fontWeight="800" fill="#8B5CF6">s</text>
                </g>

                {/* PRESCHOOL & DAYCARE pill */}
                <g transform="translate(0, 165)">
                  <rect x="0" y="0" width="370" height="48" rx="24" fill="#7C3AED" />
                  <circle cx="16" cy="24" r="5" fill="#FAF7F0" />
                  <text x="185" y="30" fontFamily="'Fredoka', sans-serif" fontSize="19" fontWeight="700" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.8">preschool & daycare</text>
                  <circle cx="354" cy="24" r="5" fill="#FAF7F0" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
