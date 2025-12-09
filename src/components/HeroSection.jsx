import { FiChevronDown } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-black flex items-center justify-center text-center overflow-hidden">
      
      {/* 1. HERO TITLE (Centered & Responsive) */}
      <h1 className="
        relative z-30
        font-mont text-white
        text-[12vw]      /* Mobile size */
        md:text-[11vw]   /* Tablet size */
        xl:text-[13vw]   /* Desktop size */
        font-bold 
        tracking-tight 
        leading-none
        select-none      /* Prevents accidental text selection */
      ">
        BHARATHAM26
      </h1>

      {/* 2. BACKGROUND IMAGE (Full Cover) */}
      <img
        src='images/hero.jpg'
        alt="Hero"
        className="
          absolute inset-0 
          w-full h-full 
          object-cover   /* Ensures image covers screen without stretching */
          object-center
          opacity-70     /* Slight dim to make text pop */
          z-10
        "
      />

      {/* 3. SCROLL INDICATOR (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream z-30">
        <span className="tracking-[0.15em] uppercase font-opensans text-xs md:text-sm opacity-90">
          Scroll
        </span>
        <FiChevronDown className="text-3xl animate-bounce" />
      </div>

    </section>
  );
}