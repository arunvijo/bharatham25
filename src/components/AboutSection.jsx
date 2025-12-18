import { useEffect, useRef, useState } from "react";
import HoverText from "./HoverText";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay to ensure initial state is rendered
          setTimeout(() => setIsVisible(true), 50);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div className="relative w-[70%] mx-auto">
          {/* SHADOW (responsive diagonal offset) - stays static */}
          <img
            src="/images/about.png"
            alt=""
            className="
              absolute top-0 left-0 

              translate-x-[10px] translate-y-[8px]
              sm:translate-x-[14px] sm:translate-y-[12px]
              lg:translate-x-[20px] lg:translate-y-[18px]

              brightness-0
              w-full h-auto object-cover
              pointer-events-none
            "
          />

          {/* Wrapper for animation coordination */}
          <div className="relative">
            {/* FLORAL – stuck to left side of main image */}
            <img
              src="/images/floral.png"
              alt=""
              className={`
                absolute 
                top-1/2 
                left-0 -translate-x-full
                w-[80px] sm:w-[140px] lg:w-[150px]
                z-[20]
                transition-transform duration-700 ease-out
                ${isVisible ? '-translate-y-1/2' : 'translate-y-[calc(-50%+5px)]'}
              `}
              style={{
                transform: isVisible 
                  ? 'translateX(-100%) translateY(-50%)' 
                  : 'translateX(calc(-100% + 20px)) translateY(calc(-50% + 18px))'
              }}
            />

            {/* REAL IMAGE with border */}
            <HoverText text="Art - Abhinav S">
              <div
                style={{
                  transform: isVisible ? 'translate(0px, 0px)' : 'translate(20px, 18px)',
                  transition: 'transform 700ms ease-out'
                }}
              >
                <img
                  src="/images/about.png"
                  alt="About Bharatham"
                  className="
                    relative w-full h-auto object-cover
                    border-[6px] border-black
                  "
                />
              </div>
            </HoverText>
          </div>
        </div>

        {/* RIGHT — TEXT */}
        <div className="flex flex-col">
          <h2
            className="font-qawatone text-5xl md:text-6xl font-bold text-black mb-8 text-left 
                        [text-shadow:_4px_4px_0_#F4F437]"
          >
            ABOUT<br/>BHARATHAM
          </h2>

          <p className="font-opensans text-black text-lg leading-relaxed text-left md:text-left">
            Bharatham is the annual cultural extravaganza of Rajagiri School of Engineering and Technology, where students represent their houses <b> — Mughals, Rajputs, Spartans, Vikings, and Aryans —</b> and compete across music, dance, theatre, and other cultural events. It's a <b>celebration of talent, unity, and vibrant campus spirit.</b>
          </p>
        </div>

      </div>
    </section>
  );
}