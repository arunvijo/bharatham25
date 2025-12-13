import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TextCursor.css';

const TextCursor = ({
  text = '✨',
  spacing = 40, // Slightly increased spacing for fewer points
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.4, // Reduced exit duration for snappier cleanup
  removalInterval = 20, // Faster cleanup interval
  maxPoints = 6, // Reduced maximum points for lower render load
  pointerText = '🌸', 
  pointerFontSize = '36px',
}) => {
  const [trail, setTrail] = useState([]);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 }); 
  
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);
  const rafRef = useRef(null); 
  const currentMousePosRef = useRef({ x: 0, y: 0 }); // Ref to hold the absolute latest mouse position

  // --- TRAIL GENERATION LOGIC ---
  // We use the position from the ref for the most up-to-date data
  const generateTrailPoint = useCallback(() => {
    const { x: mouseX, y: mouseY } = currentMousePosRef.current;
    
    const createRandomData = () =>
      randomFloat
        ? {
            randomX: Math.random() * 20 - 10,
            randomY: Math.random() * 20 - 10,
            randomRotate: Math.random() * 30 - 15
          }
        : {};

    setTrail(prev => {
      const newTrail = [...prev];
      const last = newTrail.length > 0 ? newTrail[newTrail.length - 1] : { x: mouseX, y: mouseY };

      const dx = mouseX - last.x;
      const dy = mouseY - last.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only add a new point if the distance is sufficient
      if (distance >= spacing || newTrail.length === 0) {
        let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const computedAngle = followMouseDirection ? rawAngle : 0;
        
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          angle: computedAngle,
          ...createRandomData()
        });
      }

      // Limit trail length
      return newTrail.slice(-maxPoints);
    });

    lastMoveTimeRef.current = Date.now();
    rafRef.current = null; // Important: Clear the RAF ref *after* running
  }, [spacing, maxPoints, randomFloat, followMouseDirection]);


  // --- MOUSE MOVE HANDLER (Optimized with requestAnimationFrame) ---
  const handleMouseMove = useCallback(e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 1. Store the absolute latest position in a ref
    currentMousePosRef.current = { x: mouseX, y: mouseY };
    
    // 2. Update Persistent Pointer position (fastest update)
    setPointerPos({ x: mouseX, y: mouseY });

    // 3. Trail generation is scheduled via RAF
    if (!rafRef.current) {
      // Schedule the trail generation on the next frame
      rafRef.current = requestAnimationFrame(generateTrailPoint);
    }
  }, [generateTrailPoint]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  // --- TRAIL CLEANUP EFFECT (Faster removal) ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Remove points if mouse stopped moving to clear the screen
      // Clean up after 100ms of stillness
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval); // Runs every 20ms
    return () => clearInterval(interval);
  }, [removalInterval]);

  // --- Static Styles Optimization ---
  const containerStyle = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden'
  }), []);

  const pointerBaseStyle = useMemo(() => ({
    position: 'absolute',
    transform: 'translate(-50%, -50%)', 
    fontSize: pointerFontSize, 
    userSelect: 'none',
    zIndex: 10000,
  }), [pointerFontSize]);

  const trailItemBaseStyle = useMemo(() => ({
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    userSelect: 'none',
    pointerEvents: 'none'
  }), []);


  return (
    <div 
      className="text-cursor-container"
      style={containerStyle}
    >
      {/* Persistent Pointer Element: Now includes a rotating animation */}
      <motion.div
        animate={{ x: pointerPos.x, y: pointerPos.y, rotate: 360 }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 30, 
          rotate: { duration: 4, repeat: Infinity, ease: "linear" }
        }}
        style={pointerBaseStyle}
      >
        {pointerText}
      </motion.div>

      {/* The existing text trail logic */}
      <AnimatePresence>
        {trail.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0.8, scale: 0.5, rotate: item.angle }}
            animate={{
              opacity: 1,
              scale: 1.2,
              x: randomFloat ? item.randomX : 0,
              y: randomFloat ? item.randomY : 0,
              rotate: item.angle + (item.randomRotate || 0)
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: exitDuration } }}
            transition={{
              duration: 0.2,
              ease: "circOut"
            }}
            style={{
              ...trailItemBaseStyle,
              left: item.x,
              top: item.y,
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