import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Houses() {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const speedRef = useRef(0.8); 
  const directionRef = useRef(1);

  const marqueeItems = ["MUSIC", "DANCE", "THEATRE", "CULTURE"];

  const houses = [
    { name: "Mughals", src: "/images/houses/mughals.png", color: "#10b981" },
    { name: "Rajputs", src: "/images/houses/rajputs.png", color: "#f59e0b" },
    { name: "Spartans", src: "/images/houses/spartans.png", color: "#ef4444" },
    { name: "Vikings", src: "/images/houses/vikings.png", color: "#3b82f6" },
    { name: "Aryans", src: "/images/houses/aryans.png", color: "#8b5cf6" },
  ];

  // Marquee Logic
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const animate = () => {
      const el = marqueeRef.current;
      if (el) {
        const firstSet = el.children[0];
        if (firstSet) {
          const setWidth = firstSet.offsetWidth;
          positionRef.current += speedRef.current * directionRef.current;

          if (positionRef.current >= setWidth) {
            positionRef.current -= setWidth;
          } else if (positionRef.current <= 0) {
            positionRef.current += setWidth;
          }
          el.style.transform = `translateX(${-positionRef.current}px)`;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) > 1) {
        directionRef.current = delta > 0 ? 1 : -1;
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="text-black overflow-hidden">
      
      {/* ================= SECTION 1: MARQUEE & VIDEO ================= */}
      <div className="pb-10 md:pb-20">     
        {/* Marquee */}
        <div className="border-y border-stone-100 py-6 mb-16 overflow-hidden">
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform opacity-40">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                {marqueeItems.map((item, idx) => (
                  <span key={`${i}-${idx}`} className="mx-12 font-qawatone text-8xl font-bold text-stone-300 tracking-widest">
                    {item} •
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 2. LEGACY VIDEO (Restored Original Layout & Styling) */}
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Description */}
            <motion.div 
              className="flex flex-col order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-qawatone text-5xl md:text-6xl font-bold text-black mb-8 text-left [text-shadow:_4px_4px_0_#F4F437]">
                THE<br/>LEGACY
              </h2>
              <p className="font-opensans text-black text-lg leading-relaxed text-left">
                Experience the vibrant energy and unforgettable moments from our previous editions. The <b className="text-primary">Aftermovie</b> captures the spirit, passion, and grandeur of Bharatham, showcasing the talent and unity that defines our cultural fest.
              </p>
            </motion.div>

            {/* Video with Original Thick Border & Shadow */}
            <div className="relative order-1 md:order-2 w-full">
               <motion.div 
                 initial={{ opacity: 0, x: 0, y: 0 }}
                 whileInView={{ opacity: 1, x: 15, y: 15 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="absolute inset-0 bg-black rounded-[2rem] translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"
               />
               <motion.div 
                 className="relative w-full aspect-video rounded-[2rem] overflow-hidden border-[6px] border-black bg-black z-10 shadow-lg"
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 whileHover={{ x: -4, y: -4 }}
                 transition={{ duration: 0.4 }}
               >
                 <video
                   src="/videos/aftermovie.mp4"
                   autoPlay
                   loop
                   muted
                   playsInline
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
               </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= SECTION 2: HOUSES (Single Screen Fit) ================= */}
      <div 
        id="houses" 
        className="relative w-full min-h-screen flex flex-col justify-center items-center bg-cream py-16 md:py-20"
      >
        {/* Background Pattern (Mandala Texture) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle, #D97706 1px, transparent 1px)`, 
               backgroundSize: '30px 30px' 
             }}>
        </div>
        
        {/* Desi Corner Ornaments */}
        <img src="/images/spinner.svg" className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-10" alt="" />
        <img src="/images/spinner.svg" className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 opacity-10" alt="" />

        <div className="relative z-10 w-full max-w-[1400px] px-4 sm:px-6 md:px-8 flex flex-col h-full justify-center">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <span className="text-desi-saffron font-bold tracking-[0.3em] text-xs sm:text-sm uppercase block mb-2">The Contenders</span>
            <h2 className="font-qawatone text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900">ROYAL HOUSES</h2>
            <div className="w-24 h-1 bg-desi-saffron mx-auto mt-4 rounded-full"></div>
          </motion.div>

          {/* Houses Grid - Fixed Size, Same Level */}
          <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full">
            {houses.map((house, index) => {
              // Calculate aspect ratios to normalize heights
              const aspectRatios = {
                "Aryans": 406 / 430,    // 0.944
                "Mughals": 386 / 528,   // 0.731
                "Spartans": 403 / 596,  // 0.676
                "Vikings": 491 / 538,   // 0.913
                "Rajputs": 498 / 498    // 1.000
              };
              
              const ratio = aspectRatios[house.name] || 1;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer flex flex-col items-center"
                  style={{ 
                    width: 'clamp(140px, 16%, 220px)',
                  }}
                >
                  {/* Image Container - Normalized by aspect ratio */}
                  <motion.div
                    className="relative w-full flex justify-center items-end transition-all duration-500 ease-out"
                    whileHover={{ y: -15, scale: 1.05 }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute bottom-0 w-2/3 h-1/3 bg-orange-500/0 group-hover:bg-orange-500/20 blur-2xl transition-all duration-500 rounded-full"></div>
                    
                    {/* Fixed height container - all images fill the same height */}
                    <div 
                      className="flex items-end justify-center"
                      style={{
                        height: '280px', // Base height for all
                        width: '100%'
                      }}
                    >
                      <img
                        src={house.src}
                        alt={house.name}
                        className="
                          drop-shadow-lg 
                          group-hover:drop-shadow-2xl 
                          transition-all duration-500
                        "
                        style={{
                          height: '280px', // All images same height
                          width: 'auto',
                          objectFit: 'contain',
                          objectPosition: 'bottom'
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* House Name */}
                  <div className="mt-3 sm:mt-4 text-center relative">
                    <h3 className="font-qawatone text-xl sm:text-2xl md:text-3xl text-stone-400 group-hover:text-stone-900 transition-colors duration-300">
                      {house.name.toUpperCase()}
                    </h3>
                    <div className="h-[2px] bg-desi-saffron w-0 group-hover:w-full transition-all duration-300 mx-auto mt-1"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}