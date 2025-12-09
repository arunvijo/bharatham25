import React from 'react';

export default function DesiBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-desi-cream/20">
      
      {/* 1. Large Mandala - Top Left (Slower Spin) */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[50vw] max-w-[600px] opacity-[0.08] will-change-transform animate-spinUltraSlow"
      >
        <img src="/images/spinner.svg" alt="" className="w-full h-full" />
      </div>

      {/* 2. Large Mandala - Bottom Right (Reverse Spin) */}
      <div 
        className="absolute -bottom-[10%] -right-[10%] w-[60vw] max-w-[700px] opacity-[0.08] will-change-transform animate-spinVerySlow"
        style={{ animationDirection: 'reverse' }} 
      >
        <img src="/images/spinner.svg" alt="" className="w-full h-full" />
      </div>

      {/* 3. Medium Mandala - Center Right (Standard Spin) */}
      <div 
        className="absolute top-[40%] right-[10%] w-[25vw] max-w-[350px] opacity-[0.06] will-change-transform animate-spinSlow hidden md:block"
      >
        <img src="/images/spinner.svg" alt="" className="w-full h-full" />
      </div>

      {/* 4. NEW: Small Mandala - Bottom Left (Fast Spin) */}
      <div 
        className="absolute bottom-[15%] left-[5%] w-[15vw] max-w-[200px] opacity-[0.07] will-change-transform animate-spinSlow"
        style={{ animationDuration: '8s' }} // Custom faster speed
      >
        <img src="/images/spinner.svg" alt="" className="w-full h-full" />
      </div>

      {/* 5. NEW: Medium Mandala - Top Right/Center (Reverse Slow Spin) */}
      <div 
        className="absolute top-[5%] right-[25%] w-[30vw] max-w-[400px] opacity-[0.05] will-change-transform animate-spinVerySlow"
        style={{ animationDirection: 'reverse' }}
      >
        <img src="/images/spinner.svg" alt="" className="w-full h-full" />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />
    </div>
  );
}