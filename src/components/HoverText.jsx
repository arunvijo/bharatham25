// src/components/HoverText.jsx
import { useState } from 'react';

export default function HoverText({ children, text }) {
  const [showText, setShowText] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setShowText(true);
    updatePosition(e);
  };

  const handleMouseMove = (e) => {
    updatePosition(e);
  };

  const updatePosition = (e) => {
    // Get the bounding rect of the target element
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate position relative to the element
    const x = e.clientX;
    const y = e.clientY;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="contents"
      >
        {children}
      </div>
      
      {showText && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${position.x + 15}px`,
            top: `${position.y + 15}px`
          }}
        >
          <div className="bg-white border-4 border-black px-6 py-3 shadow-lg">
            <span className="font-mont font-semibold text-lg text-black whitespace-nowrap">
              {text}
            </span>
          </div>
        </div>
      )}
    </>
  );
}