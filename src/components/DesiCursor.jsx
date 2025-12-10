import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function DesiCursor() {
  // 1. Motion Values for smooth, independent physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // 2. Spring physics for the "Trailing" element (The Art Brush feel)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [hoverState, setHoverState] = useState("default");
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") ||
        target.closest(".group") || 
        target.classList.contains("cursor-pointer");

      setHoverState(isClickable ? "hover" : "default");
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      
      {/* ================= 1. THE "INK DROP" (Main Cursor) ================= */}
      {/* A sharp, high-contrast dot that tracks instantly */}
      <motion.div
        className="absolute top-0 left-0 w-2.5 h-2.5 bg-desi-saffron rounded-full mix-blend-normal z-50 shadow-[0_0_8px_rgba(255,100,0,0.8)]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isClicking ? 0.5 : 1 }}
      />

      {/* ================= 2. THE "ARTIST'S AURA" (Trailing Ring) ================= */}
      {/* Uses spring physics to lag behind like a paintbrush trail */}
      <motion.div
        className="absolute top-0 left-0 z-40 flex items-center justify-center border border-yellow/60 rounded-full"
        style={{ 
          x: springX, 
          y: springY, 
          translateX: "-50%", 
          translateY: "-50%" 
        }}
        animate={{
          width: hoverState === "hover" ? 64 : 32,
          height: hoverState === "hover" ? 64 : 32,
          borderColor: hoverState === "hover" ? "#F4F437" : "rgba(244, 244, 55, 0.4)",
          backgroundColor: hoverState === "hover" ? "rgba(244, 244, 55, 0.05)" : "transparent",
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        
        {/* ================= 3. THE "CHAKRA" PATTERN (Visible on Hover) ================= */}
        {/* This creates the Desi Mandala effect when hovering over buttons */}
        <AnimatePresence>
          {hoverState === "hover" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 180 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Spinning Dotted Ring */}
              <motion.div 
                className="w-full h-full border-2 border-dotted border-desi-saffron rounded-full opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Ornamental Petals (The "Floral" look) */}
              {[0, 90, 180, 270].map((rotation) => (
                <div 
                  key={rotation}
                  className="absolute top-1/2 left-1/2 w-1.5 h-3 bg-yellow rounded-full"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-28px)`
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}