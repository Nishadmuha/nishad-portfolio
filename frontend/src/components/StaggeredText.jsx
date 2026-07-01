import React, { useEffect, useState } from 'react';

function StaggeredText({ text, className = '' }) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const letters = text.split('');

  useEffect(() => {
    let timeouts = [];

    const runWave = () => {
      letters.forEach((char, index) => {
        if (char.trim() !== '') {
          const t1 = setTimeout(() => {
            setHighlightedIndex(index);
            const t2 = setTimeout(() => {
              setHighlightedIndex(prev => prev === index ? -1 : prev);
            }, 350);
            timeouts.push(t2);
          }, index * 80);
          timeouts.push(t1);
        }
      });
    };

    // Initial delay
    const initialTimeout = setTimeout(runWave, 300);
    timeouts.push(initialTimeout);

    // Recurring interval
    const interval = setInterval(runWave, 9000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [text]);

  return (
    <div className={`letter-highlight ${className}`}>
      {letters.map((char, idx) => (
        <span 
          key={idx} 
          className={highlightedIndex === idx ? 'highlighted' : ''}
          dangerouslySetInnerHTML={{ __html: char === ' ' ? '&nbsp;' : char }}
        />
      ))}
    </div>
  );
}

export default StaggeredText;
