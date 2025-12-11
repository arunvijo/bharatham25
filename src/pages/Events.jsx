import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { motion } from "framer-motion";

// Components
import Spinner from "../components/Spinner";

function FilterSection({ filters, filter, setFilter }) {
  const pillsWrapRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(70);

  useEffect(() => {
    const compute = () => {
      if (!pillsWrapRef.current) return;

      const pillsHeight = pillsWrapRef.current.offsetHeight;

      // add padding so pills sit nicely inside SVG curve
      const padding = 30;

      setSvgHeight(pillsHeight + padding);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(pillsWrapRef.current);

    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full flex justify-center mb-12 sm:mb-14 md:mb-16">
      <div className="relative w-full max-w-3xl px-4">
        
        {/* INLINE SVG THAT AUTO-STRETCHES */}
        <svg
          width="100%"
          height={svgHeight}
          viewBox="0 0 910 62"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full pointer-events-none"
        >
         <g filter="url(#filter0_d_418_145)">
<path d="M56.6666 43.2213C20.7282 43.2213 57.5065 32.4011 2.19689 28.7286C-0.0111644 28.5825 -0.119535 28.4365 2.19689 28.2889C58.2245 24.7479 20.7011 13.7787 56.6666 13.7787C56.6666 6.44548 108.942 0.5 173.422 0.5L722.943 0.5C787.423 0.5 839.698 6.44548 839.698 13.7787C885.512 13.7787 872.616 22.3055 908.961 28.324C909.706 28.4481 909.652 28.5708 908.961 28.695C874.431 34.8436 885.472 43.2213 839.698 43.2213C839.698 50.5545 787.423 56.5 722.943 56.5L173.422 56.5C108.942 56.5 56.6666 50.5545 56.6666 43.2213Z" fill="#F4E5D4" stroke="#271811" strokeMiterlimit="10"/>
</g>
<defs>
<filter id="filter0_d_418_145" x="0" y="0" width="910" height="62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_145"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_145" result="shape"/>
</filter>
</defs>
</svg>


        {/* PILLS - Constrained width to stay inside SVG */}
        <div
          ref={pillsWrapRef}
          className="relative z-10 flex flex-wrap justify-center gap-2 sm:gap-3 py-4 px-8 sm:px-12 md:px-16 lg:px-20"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === "All" ? "" : f)}
              className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all border ${
                (filter === f || (f === "All" && filter === ""))
                  ? "bg-desi-saffron text-white border-desi-saffron shadow-lg"
                  : "bg-stone-100 text-stone-600 border-stone-300 hover:border-desi-saffron hover:text-desi-saffron"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


const Events = () => {
  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [categoryTitle, setCategoryTitle] = useState(
    location.state?.category || "ALL EVENTS"
  );

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventResponse = await axios.get(`${apiUrl}/event/`);
        setEvents(eventResponse.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (location.state?.category) {
      setCategoryTitle(location.state.category);
    }
  }, [location.state]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.venue.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase())
  );

  const filters = [
    "All",
    "Onstage",
    "Offstage",
    "Pre Event",
    "Individual",
    "Group",
    "Literary",
    "Music",
    "Dance",
    "Theatre",
    "Media",
  ];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans relative overflow-x-hidden">
      {/* Fixed SVG Borders */}
{/* FIXED SVG BORDERS — DESKTOP VERSION */}
<div className="fixed top-0 left-0 w-full z-50 pointer-events-none hidden md:block">
  <img src="/images/top.svg" alt="" className="w-full h-auto" />
</div>

<div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none hidden md:block">
  <img src="/images/bottom.svg" alt="" className="w-full h-auto" />
</div>

<div className="fixed left-0 top-0 h-full z-50 pointer-events-none hidden md:block">
  <img src="/images/left.svg" alt="" className="w-auto h-full" />
</div>

<div className="fixed right-0 top-0 h-full z-50 pointer-events-none hidden md:block">
  <img src="/images/right.svg" alt="" className="w-auto h-full" />
</div>


{/* FIXED SVG BORDERS — MOBILE VERSION */}
<div className="fixed top-0 left-0 w-full z-50 pointer-events-none md:hidden">
  <img src="/images/topmob.svg" alt="" className="w-full h-auto" />
</div>

<div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none md:hidden">
  <img src="/images/bottommob.svg" alt="" className="w-full h-auto" />
</div>

<div className="fixed left-0 top-0 h-full z-50 pointer-events-none md:hidden">
  <img src="/images/leftmob.svg" alt="" className="w-auto h-full" />
</div>

<div className="fixed right-0 top-0 h-full z-50 pointer-events-none md:hidden">
  <img src="/images/rightmob.svg" alt="" className="w-auto h-full" />
</div>


      <motion.main
        className="max-w-7xl mx-auto px-6 
            pt-20              /* mobile smaller padding */
            sm:pt-28           /* tablet */
            md:pt-32           /* desktop original */
            pb-10
            "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Event Header SVG with Dynamic Category Text */}
        <div className="flex justify-center mb-8 sm:mb-10 md:mb-12 relative">
          <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-md mx-auto">
            <img
              src="/images/event-header.svg"
              alt=""
              className="w-full h-auto block"
            />

            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
              <h1
                className="text-center leading-tight w-full"
                style={{
                  color: "#CB1760",
                  fontFamily: "'Alfa Slab One', cursive",
                  textShadow: "0 2px 0 #28325B, 0 3px 0 #28325B",
                  fontSize: "clamp(0.9rem, 4vw + 0.5rem, 2.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                {categoryTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <FilterSection filters={filters} filter={filter} setFilter={setFilter} />

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20 pb-20">
            {filteredEvents.map((e) => (
              <Link
                key={e._id}
                to={`/event/${e._id}`}
                className="group relative flex items-center justify-center"
              >
                <div className="relative w-full">
                  <img
                    src="/images/event-stamp.svg"
                    alt=""
                    className="w-full h-auto group-hover:opacity-80 transition-opacity"
                  />

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-stone-900 font-reality tracking-wide group-hover:text-desi-saffron transition-colors break-words text-center px-6 sm:px-8 md:px-10 max-w-full leading-tight">
                      {e.name}
                    </h3>
                  </div>

                  <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 text-center rounded-xl">
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-[10px] sm:text-xs md:text-sm text-stone-500 font-medium uppercase tracking-wider">
                        {e.category} • {e.participation}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-stone-700">{e.venue || "TBD"}</p>
                      <div className="mt-2 sm:mt-3">
                        <span
                          className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded ${
                            e.registrationEnabled ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {e.registrationEnabled ? "Open" : "Closed"}
                        </span>
                      </div>
                      <p className="text-desi-saffron font-bold mt-3 sm:mt-4 text-xs sm:text-sm md:text-base">View Details →</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 text-stone-500 mb-20 pb-20">
            <MdSearch className="text-4xl sm:text-5xl md:text-6xl mx-auto mb-3 sm:mb-4 opacity-20" />
            <p className="text-base sm:text-lg md:text-xl">No events found matching "{filter}"</p>
            <button onClick={() => setFilter("")} className="mt-3 sm:mt-4 text-sm sm:text-base text-desi-saffron hover:underline font-medium">
              Clear Filters
            </button>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default Events;