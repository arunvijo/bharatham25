// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './TextCursor.css';

// const TextCursor = ({
//   text = '✨',
//   spacing = 40, // Slightly increased spacing for fewer points
//   followMouseDirection = true,
//   randomFloat = true,
//   exitDuration = 0.4, // Reduced exit duration for snappier cleanup
//   removalInterval = 20, // Faster cleanup interval
//   maxPoints = 6, // Reduced maximum points for lower render load
//   pointerText = '🌸', 
//   pointerFontSize = '36px',
// }) => {
//   const [trail, setTrail] = useState([]);
//   const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 }); 
  
//   const lastMoveTimeRef = useRef(Date.now());
//   const idCounter = useRef(0);
//   const rafRef = useRef(null); 
//   const currentMousePosRef = useRef({ x: 0, y: 0 }); // Ref to hold the absolute latest mouse position

//   // --- TRAIL GENERATION LOGIC ---
//   // We use the position from the ref for the most up-to-date data
//   const generateTrailPoint = useCallback(() => {
//     const { x: mouseX, y: mouseY } = currentMousePosRef.current;
    
//     const createRandomData = () =>
//       randomFloat
//         ? {
//             randomX: Math.random() * 20 - 10,
//             randomY: Math.random() * 20 - 10,
//             randomRotate: Math.random() * 30 - 15
//           }
//         : {};

//     setTrail(prev => {
//       const newTrail = [...prev];
//       const last = newTrail.length > 0 ? newTrail[newTrail.length - 1] : { x: mouseX, y: mouseY };

//       const dx = mouseX - last.x;
//       const dy = mouseY - last.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       // Only add a new point if the distance is sufficient
//       if (distance >= spacing || newTrail.length === 0) {
//         let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
//         const computedAngle = followMouseDirection ? rawAngle : 0;
        
//         newTrail.push({
//           id: idCounter.current++,
//           x: mouseX,
//           y: mouseY,
//           angle: computedAngle,
//           ...createRandomData()
//         });
//       }

//       // Limit trail length
//       return newTrail.slice(-maxPoints);
//     });

//     lastMoveTimeRef.current = Date.now();
//     rafRef.current = null; // Important: Clear the RAF ref *after* running
//   }, [spacing, maxPoints, randomFloat, followMouseDirection]);


//   // --- MOUSE MOVE HANDLER (Optimized with requestAnimationFrame) ---
//   const handleMouseMove = useCallback(e => {
//     const mouseX = e.clientX;
//     const mouseY = e.clientY;

//     // 1. Store the absolute latest position in a ref
//     currentMousePosRef.current = { x: mouseX, y: mouseY };
    
//     // 2. Update Persistent Pointer position (fastest update)
//     setPointerPos({ x: mouseX, y: mouseY });

//     // 3. Trail generation is scheduled via RAF
//     if (!rafRef.current) {
//       // Schedule the trail generation on the next frame
//       rafRef.current = requestAnimationFrame(generateTrailPoint);
//     }
//   }, [generateTrailPoint]);

//   useEffect(() => {
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//       }
//     };
//   }, [handleMouseMove]);

//   // --- TRAIL CLEANUP EFFECT (Faster removal) ---
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Remove points if mouse stopped moving to clear the screen
//       // Clean up after 100ms of stillness
//       if (Date.now() - lastMoveTimeRef.current > 100) {
//         setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
//       }
//     }, removalInterval); // Runs every 20ms
//     return () => clearInterval(interval);
//   }, [removalInterval]);

//   // --- Static Styles Optimization ---
//   const containerStyle = useMemo(() => ({
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100vw',
//     height: '100vh',
//     pointerEvents: 'none',
//     zIndex: 9999,
//     overflow: 'hidden'
//   }), []);

//   const pointerBaseStyle = useMemo(() => ({
//     position: 'absolute',
//     transform: 'translate(-50%, -50%)', 
//     fontSize: pointerFontSize, 
//     userSelect: 'none',
//     zIndex: 10000,
//   }), [pointerFontSize]);

//   const trailItemBaseStyle = useMemo(() => ({
//     position: 'absolute',
//     transform: 'translate(-50%, -50%)',
//     fontSize: '24px',
//     userSelect: 'none',
//     pointerEvents: 'none'
//   }), []);


//   return (
//     <div 
//       className="text-cursor-container"
//       style={containerStyle}
//     >
//       {/* Persistent Pointer Element: Now includes a rotating animation */}
//       <motion.div
//         animate={{ x: pointerPos.x, y: pointerPos.y, rotate: 360 }}
//         transition={{ 
//           type: 'spring', 
//           stiffness: 400, 
//           damping: 30, 
//           rotate: { duration: 4, repeat: Infinity, ease: "linear" }
//         }}
//         style={pointerBaseStyle}
//       >
//         {pointerText}
//       </motion.div>

//       {/* The existing text trail logic */}
//       <AnimatePresence>
//         {trail.map(item => (
//           <motion.div
//             key={item.id}
//             initial={{ opacity: 0.8, scale: 0.5, rotate: item.angle }}
//             animate={{
//               opacity: 1,
//               scale: 1.2,
//               x: randomFloat ? item.randomX : 0,
//               y: randomFloat ? item.randomY : 0,
//               rotate: item.angle + (item.randomRotate || 0)
//             }}
//             exit={{ opacity: 0, scale: 0, transition: { duration: exitDuration } }}
//             transition={{
//               duration: 0.2,
//               ease: "circOut"
//             }}
//             style={{
//               ...trailItemBaseStyle,
//               left: item.x,
//               top: item.y,
//             }}
//           >
//             {text}
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default TextCursor;

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring } from "framer-motion"

const DefaultCursorSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: "0.5" }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="#CB1760"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="black"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}) {
  const [isMoving, setIsMoving] = useState(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastUpdateTime = useRef(Date.now())
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  })
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => {
    const updateVelocity = (currentPos) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const smoothMouseMove = (e) => {
      const currentPos = { x: e.clientX, y: e.clientY }
      updateVelocity(currentPos)

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      )

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)
        setIsMoving(true)

        const timeoutId = setTimeout(() => {
          scale.set(1)
          setIsMoving(false)
        }, 150)

        return () => clearTimeout(timeoutId)
      }
    }

    let rafId = null
    const throttledMouseMove = (e) => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e)
        rafId = null
      })
    }

    document.body.style.cursor = "none"
    window.addEventListener("mousemove", throttledMouseMove)

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove)
      document.body.style.cursor = "auto"
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [cursorX, cursorY, rotation, scale])

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {cursor}
    </motion.div>
  )
}