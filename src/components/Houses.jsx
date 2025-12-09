import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Houses() {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const speedRef = useRef(2.5);
  const directionRef = useRef(1); // 1 = left, -1 = right

  const marqueeItems = ["MUSIC", "DANCE", "THEATRE", "CULTURE"];

  // ---------------------------------------------------------
  // 1. MARQUEE LOGIC
  // ---------------------------------------------------------
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const animate = () => {
      const el = marqueeRef.current;
      if (el) {
        const firstSet = el.children[0];
        if (firstSet) {
          const setWidth = firstSet.offsetWidth;

          // move marquee
          positionRef.current += speedRef.current * directionRef.current;

          // seamless wrapping
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

  const houses = [
    { name: "Mughals", src: "/images/houses/mughals.png", color: "#10b981" },
    { name: "Rajputs", src: "/images/houses/rajputs.png", color: "#f59e0b" },
    { name: "Spartans", src: "/images/houses/spartans.png", color: "#ef4444" },
    { name: "Vikings", src: "/images/houses/vikings.png", color: "#3b82f6" },
    { name: "Aryans", src: "/images/houses/aryans.png", color: "#8b5cf6" },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    },
  };

  return (
    <section className="bg-cream text-black overflow-hidden pb-24 md:pb-32">
      
      {/* ================= SECTION 1: MARQUEE ================= */}
      <div className="py-10 md:py-16 overflow-hidden  relative z-10 border-b border-black/5">
        <div className="relative w-full">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="flex items-center flex-shrink-0">
                {marqueeItems.map((item, index) => (
                  <div key={`${setIndex}-${index}`} className="flex items-center flex-shrink-0 group">
                    <span
                      className="
                        font-mont
                        text-transparent bg-clip-text bg-gradient-to-r from-primary to-desi-saffron
                        group-hover:to-desi-maroon transition-all duration-500
                        text-[10vw] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]
                        tracking-tight px-4 sm:px-8
                        opacity-90 font-bold
                      "
                      style={{ WebkitTextStroke: "1px #271811" }}
                    >
                      {item}
                    </span>
                    <div className="flex-shrink-0 px-4 sm:px-8">
                      <img
                        src="/images/spinner.svg"
                        alt=""
                        className="
                          h-[6vw] w-[6vw] 
                          sm:h-[4rem] sm:w-[4rem]
                          animate-spinSlow opacity-60
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: LEGACY VIDEO (Updated Style) ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* LEFT: Description */}
          <motion.div 
            className="flex flex-col order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-mont text-5xl md:text-6xl font-bold text-black mb-8 text-left [text-shadow:_4px_4px_0_#F4F437]">
              THE<br/>LEGACY
            </h2>
            <p className="font-opensans text-black text-lg leading-relaxed text-left">
              Experience the vibrant energy and unforgettable moments from our previous editions. The <b className="text-primary">Aftermovie</b> captures the spirit, passion, and grandeur of Bharatham, showcasing the talent and unity that defines our cultural fest.
            </p>
          </motion.div>

          {/* RIGHT: Video with Offset Layer */}
          <div className="relative order-1 md:order-2 w-full">
             
             {/* 1. Offset Shadow Box (Visual "Pop" Layer) */}
             <motion.div 
               initial={{ opacity: 0, x: 0, y: 0 }}
               whileInView={{ opacity: 1, x: 15, y: 15 }} // Slides out to form shadow
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="
                 absolute inset-0 
                 bg-black rounded-[2rem] 
                 translate-x-3 translate-y-3 
                 md:translate-x-5 md:translate-y-5
               "
             />

             {/* 2. Main Video Container */}
             <motion.div 
               className="
                 relative w-full aspect-video 
                 rounded-[2rem] overflow-hidden 
                 border-[6px] border-black bg-black 
                 z-10 shadow-lg
               "
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               whileHover={{ x: -4, y: -4 }} // Hover effect moves it away from shadow
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
               {/* Subtle Glass Shine */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
             </motion.div>
          </div>

        </div>
      </div>

      {/* ================= SECTION 3: HOUSES GRID ================= */}
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Title */}
        <div className="flex items-center gap-4 md:gap-6 mb-16 md:mb-24">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 h-[2px] bg-black origin-right" 
          />
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-mont text-4xl sm:text-5xl md:text-7xl tracking-[0.2em] text-black text-center"
          >
            HOUSES
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 h-[2px] bg-black origin-left" 
          />
        </div>

        {/* Responsive Flex Grid (3 Top, 2 Bottom Centered) */}
        {/* Responsive Flex Grid (3 Top, 2 Bottom Centered) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {houses.map((house, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="
                flex flex-col items-center group cursor-pointer
                w-[80%] sm:w-[45%] lg:w-[28%] /* Desktop: 28% ensures 3 items fit in first row */
              "
            >
              {/* House Image Container - No Background/Border */}
              <motion.div
                whileHover={{ 
                  scale: 1.15, 
                  rotate: [0, -2, 2, 0], 
                  filter: "drop-shadow(0px 25px 30px rgba(0,0,0,0.2))",
                  transition: {
                      scale: { type: "spring", stiffness: 300 },
                      rotate: { type: "tween", duration: 0.4, ease: "easeInOut" }
                  }
                }}
                className="
                  relative
                  w-full
                  aspect-[4/5]
                  flex items-center justify-center
                "
              >
                  <img
                      src={house.src}
                      alt={house.name}
                      className="w-full h-full object-contain drop-shadow-xl relative z-10"
                  />
              </motion.div>

              {/* House Name */}
              <motion.h3 
                className="mt-2 font-reality text-3xl md:text-2xl lg:text-3xl text-black tracking-widest opacity-80 group-hover:opacity-100 group-hover:text-primary transition-colors text-center"
              >
                {house.name.toUpperCase()}
              </motion.h3>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}