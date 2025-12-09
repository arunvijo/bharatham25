import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DesiCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const mouseOver = (e) => {
      const target = e.target;
      // Detect interactive elements
      const isClickable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") ||
        target.closest(".group") || // Detects your cards
        target.classList.contains("cursor-pointer");

      setHoverType(isClickable ? "pointer" : "default");
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", mouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block mix-blend-difference">
      
      {/* 1. The Bindu (Central Saffron Dot) - Remains constant */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-desi-saffron rounded-full z-50 shadow-[0_0_10px_#FF5101]"
        animate={{ 
          x: mousePosition.x - 4, 
          y: mousePosition.y - 4,
          scale: hoverType === "pointer" ? 0 : 1 // Hide dot on hover to focus on the ring
        }}
        transition={{ duration: 0.1 }} 
      />

      {/* 2. The Chakra (Morphing Outer Ring) */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full"
        animate={{
          x: mousePosition.x - (hoverType === "pointer" ? 40 : 16),
          y: mousePosition.y - (hoverType === "pointer" ? 40 : 16),
          width: hoverType === "pointer" ? 80 : 32,
          height: hoverType === "pointer" ? 80 : 32,
          borderWidth: hoverType === "pointer" ? 2 : 2,
          borderColor: hoverType === "pointer" ? "#FF5101" : "#F4F437", // Saffron vs Gold
          rotate: hoverType === "pointer" ? 90 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5
        }}
      >
        {/* 3. Inner Decorative Rings (The Rangoli Effect) */}
        <AnimatePresence>
          {hoverType === "pointer" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 180 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               {/* Outer Dashed Ring */}
               <div className="absolute inset-1 border border-dashed border-white/60 rounded-full animate-[spin_10s_linear_infinite]" />
               
               {/* Inner Dotted Ring */}
               <div className="absolute inset-3 border-2 border-dotted border-desi-saffron/80 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
               
               {/* Center Cross/Decor */}
               <div className="w-2 h-2 bg-white rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}