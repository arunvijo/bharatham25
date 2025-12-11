import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Fixed import
import './TextCursor.css';

const TextCursor = ({
  text = '🏵️',
  spacing = 30, // Reduced spacing for smoother trail
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 8 // Increased points for better effect
}) => {
  const [trail, setTrail] = useState([]);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);

  const handleMouseMove = e => {
    // 1. Use window coordinates directly
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const createRandomData = () =>
      randomFloat
        ? {
            randomX: Math.random() * 20 - 10, // Increased range slightly
            randomY: Math.random() * 20 - 10,
            randomRotate: Math.random() * 30 - 15
          }
        : {};

    setTrail(prev => {
      const newTrail = [...prev];

      if (newTrail.length === 0) {
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          angle: 0,
          ...createRandomData()
        });
      } else {
        const last = newTrail[newTrail.length - 1];
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= spacing) {
          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const computedAngle = followMouseDirection ? rawAngle : 0;
          
          // Add new point
          newTrail.push({
            id: idCounter.current++,
            x: mouseX,
            y: mouseY,
            angle: computedAngle,
            ...createRandomData()
          });
        }
      }

      // Keep only the last N points to prevent memory issues
      return newTrail.slice(-maxPoints);
    });

    lastMoveTimeRef.current = Date.now();
  };

  useEffect(() => {
    // 2. Attach listener to WINDOW, not the div
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Remove points if mouse stopped moving to clear the screen
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div 
      className="text-cursor-container"
      // 3. Ensure it sits on top but lets clicks pass through
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <AnimatePresence>
        {trail.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0.8, scale: 0.5, rotate: item.angle }}
            animate={{
              opacity: 1,
              scale: 1.2,
              // Random float effect
              x: randomFloat ? item.randomX : 0,
              y: randomFloat ? item.randomY : 0,
              rotate: item.angle + (item.randomRotate || 0)
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: exitDuration } }}
            transition={{
              duration: 0.2, // Quick entry
              ease: "circOut"
            }}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              transform: 'translate(-50%, -50%)', // Center text on cursor
              fontSize: '24px',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TextCursor;