// src/pages/ComingSoon.jsx
import React from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

export default function ComingSoon() {
  return (
    <div className="relative w-full min-h-screen bg-desi-cream flex items-center justify-center text-center overflow-hidden">
      
      {/* 1. BACKGROUND SVG (Full Cover - NO opacity-50) */}
      <img
        src='/images/hero-background.svg'
        alt="Background Pattern"
        className="
          absolute inset-0 
          w-full h-full 
          object-cover
          object-center
          z-10 /* Removed opacity-50 class to show full color */
        "
      />
      
      {/* 2. Content Container */}
      <motion.div
        className="relative z-30 max-w-4xl mx-auto p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-base md:text-xl font-bold uppercase tracking-widest text-desi-saffron mb-4"
          variants={itemVariants}
        >
          THE CULTURAL EXTRAVAGANZA
        </motion.p>

        <motion.h1 
          className="
            font-qawatone text-6xl sm:text-8xl md:text-[10rem] 
            font-bold leading-none text-black 
            /* RESPONSIVE SHADOW */
            [text-shadow:_4px_4px_0_#F4E5D4,6px_6px_0_#D97706] 
            md:[text-shadow:_8px_8px_0_#F4E5D4,12px_12px_0_#D97706] 
            select-none 
          "
          variants={itemVariants}
        >
          BHARATHAM
        </motion.h1>

        <motion.h2
          className="text-3xl sm:text-5xl md:text-6xl font-reality font-extrabold text-desi-maroon mt-4 mb-10"
          variants={itemVariants}
        >
          IS COMING SOON
        </motion.h2>

        {/* COUNTDOWN SECTION */}
        <motion.div
          className="w-full mt-10 p-4 sm:p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-xl border-4 border-desi-saffron"
          variants={itemVariants}
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-600 mb-4">
            COUNTDOWN TO KICKOFF
          </p>
          <CountdownTimer /> 
        </motion.div>
        
      </motion.div>
    </div>
  );
}