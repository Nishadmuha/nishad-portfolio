import React, { useEffect, useState } from 'react';

function Loader({ onComplete, bannerImage }) {
  const resolveBannerImage = (path) => {
    if (!path) return "assets/portrait_hoodie_bw.png";
    if (path.startsWith('http') || path.startsWith('assets/')) return path;
    return path.startsWith('/') ? path : '/' + path;
  };
  const [isSplitting, setIsSplitting] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);

  useEffect(() => {
    // Stage 1: Text splits and photo begins to fade/scale in after 1.2 seconds
    const splitTimeout = setTimeout(() => {
      setIsSplitting(true);
      setShowPhoto(true);
    }, 1200);

    // Show skip button after 1.5 seconds
    const skipTimeout = setTimeout(() => {
      setSkipVisible(true);
    }, 1500);

    // Stage 2: Trigger final fade-out of the preloader container at 4.8 seconds
    const doneTimeout = setTimeout(() => {
      setIsDone(true);
    }, 4800);

    // Stage 3: Complete loader at 5.6 seconds
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 5600);

    return () => {
      clearTimeout(splitTimeout);
      clearTimeout(skipTimeout);
      clearTimeout(doneTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000', // Solid black background
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: isDone ? 0 : 1,
        transform: isDone ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: isDone ? 'none' : 'auto',
        userSelect: 'none'
      }}
    >
      {/* High-Quality Businessman / Portfolio Owner Portrait */}
      <div 
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <div 
          style={{
            width: '280px',
            height: '350px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#0c0c0e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
            opacity: showPhoto ? 1 : 0,
            transform: showPhoto ? 'scale(1.06)' : 'scale(0.85)',
            // Continuous smooth scale-up transition over 4.5s
            transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 4.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'block'
          }}
        >
          <img 
            src={resolveBannerImage(bannerImage)} 
            alt="Mohammed Nishad - Portrait Card" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Sliding text block splits in half */}
      <div 
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 10vw, 7.5rem)',
          color: '#ffffff', // Bold white text
          letterSpacing: '-0.02em',
          pointerEvents: 'none',
          width: '100%',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <div 
          style={{
            transform: isSplitting 
              ? 'translateX(-120vw)' 
              : 'translateX(0)',
            opacity: isSplitting ? 0 : 1,
            transition: 'transform 2.0s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.6s cubic-bezier(0.76, 0, 0.24, 1)',
            display: 'inline-block',
            textAlign: 'right',
            width: '50%',
            paddingRight: '0.02em'
          }}
        >
          NIS
        </div>
        <div 
          style={{
            transform: isSplitting 
              ? 'translateX(120vw)' 
              : 'translateX(0)',
            opacity: isSplitting ? 0 : 1,
            transition: 'transform 2.0s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.6s cubic-bezier(0.76, 0, 0.24, 1)',
            display: 'inline-block',
            textAlign: 'left',
            width: '50%',
            paddingLeft: '0.02em'
          }}
        >
          HAD
        </div>
      </div>

      {/* Skip Button */}
      {skipVisible && (
        <button 
          onClick={onComplete}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: '3rem',
            background: 'none',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.35)', // Adjusted for black background contrast
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
            outline: 'none',
            zIndex: 10000
          }}
          onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.35)'}
        >
          Skip Intro &rarr;
        </button>
      )}
    </div>
  );
}

export default Loader;
