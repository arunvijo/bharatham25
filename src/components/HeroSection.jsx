import { FiChevronDown } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-black flex items-center justify-center text-center overflow-hidden">
      
      {/* 1. BACKGROUND SVG (Lowest Layer - Full Width) */}
      <img
        src='images/hero-background.svg'
        alt="Background"
        className="
          absolute inset-0 
          w-full h-full 
          object-cover
          object-center
          z-10
        "
      />

      {/* 2. HERO TITLE (Middle Layer - Below Character) */}
      <h1 className="
        relative z-20
        font-qawatone text-white
        text-[13vw]
        md:text-[12vw]
        xl:text-[14vw]
        font-bold 
        tracking-tight 
        leading-none
        select-none
      ">
        BHARATHAM26
      </h1>

      {/* 3. CHARACTER SVG (Top Layer - Centered Bottom) */}
      <img
        src='images/hero-front.svg'
        alt="Hero Character"
        className="
          absolute bottom-0 left-1/2 -translate-x-1/2
          h-[75vh]        /* Larger mobile size */
          md:h-[80vh]     /* Tablets */
          xl:h-[85vh]     /* Desktop */
          w-auto
          max-w-none      /* Allows character to be wider than screen if needed */
          object-contain
          z-30
        "
      />

      {/* 4. SCROLL INDICATOR (Top Layer) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream z-40">
        <span className="tracking-[0.15em] uppercase font-opensans text-xs md:text-sm opacity-90">
          Scroll
        </span>
        <FiChevronDown className="text-3xl animate-bounce" />
      </div>

    </section>
  );
}