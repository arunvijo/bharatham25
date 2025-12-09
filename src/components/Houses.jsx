import { useEffect, useRef } from "react";

export default function Houses() {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const speedRef = useRef(2.5);
  const directionRef = useRef(1); // 1 = left, -1 = right

  const marqueeItems = ["MUSIC", "DANCE", "THEATRE", "CULTURE"];

  // 🔁 Infinite marquee animation + scroll-controlled direction
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
    { src: "/images/houses/mughals.png" },
    { src: "/images/houses/rajputs.png" },
    { src: "/images/houses/spartans.png" },
    { src: "/images/houses/vikings.png" },
    { src: "/images/houses/aryans.png" },
  ];

  return (
    <section className="bg-white text-black">
      {/* ================= MARQUEE ================= */}
      <div className="py-8 overflow-hidden">
        <div className="relative w-full">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {/* Render 3 sets for seamless loop */}
            {[0, 1, 2].map((setIndex) => (
              <div
                key={setIndex}
                className="flex items-center flex-shrink-0"
              >
                {marqueeItems.map((item, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="flex items-center flex-shrink-0"
                  >
                    <span
                      className="
                        font-mont
                        text-primary
                        text-[4rem]
                        sm:text-[5rem]
                        md:text-[7rem]
                        lg:text-[9rem]
                        xl:text-[11rem]
                        tracking-tight
                        px-8
                      "
                    >
                      {item}
                    </span>
                    <div className="flex-shrink-0 px-8">
                      <img
                        src="/images/spinner.svg"
                        alt=""
                        className="
                          h-[3rem]
                          w-[3rem]
                          sm:h-[4rem]
                          sm:w-[4rem]
                          md:h-[5.5rem]
                          md:w-[5.5rem]
                          lg:h-[7rem]
                          lg:w-[7rem]
                          xl:h-[8.5rem]
                          xl:w-[8.5rem]
                          animate-spinSlow
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

      {/* ========== STICKY VIDEO (FULL WIDTH + HEIGHT) ========== */}
      <div className="relative w-full">
        {/* Scroll space */}
        <div className="h-[220vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <video
              src="/videos/aftermovie.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="
                absolute inset-0
                w-full
                h-full
                object-cover
              "
            />
          </div>
        </div>
      </div>


      {/* ========== HOUSES PANEL SCROLLING OVER VIDEO ========== */}
      <section className="relative z-20 -mt-[100vh] bg-cream rounded-t-3xl pb-48">
        <div className="mx-auto max-w-7xl px-6 pt-14 md:pt-20">
          {/* TITLE WITH LINES */}
          <div className="flex items-center gap-6 mb-14">
            <div className="flex-1 h-[2px] bg-black" />
            <h2 className="font-mont text-3xl md:text-6xl tracking-[0.3em] text-black text-center">
              HOUSES
            </h2>
            <div className="flex-1 h-[2px] bg-black" />
          </div>

          {/* HOUSES GRID */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-12 md:gap-20 lg:gap-24 justify-items-center">
            {houses.map((house, index) => (
              <div key={index} className="flex justify-center">
                <div
                  className="
                    w-[220px]
                    sm:w-[260px]
                    md:w-[320px]
                    lg:w-[380px]
                    xl:w-[420px]
                  "
                >
                  <img
                    src={house.src}
                    alt=""
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
