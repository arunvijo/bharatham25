import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { motion } from "framer-motion";

// Components
import Spinner from "../components/Spinner";

/**
 * FilterSection Component - Compact, Desi Styled, and no SVG background.
 */
function FilterSection({ filters, filter, setFilter }) {
  const pillsWrapRef = useRef(null);

  return (
    <div className="relative w-full flex justify-center mb-2 mt-2">
      <div className="relative w-full max-w-3xl px-4">
        
        {/* PILLS - Reduced gaps and padding for compactness (2 lines on wider screens) */}
        <div
          ref={pillsWrapRef}
          className="relative z-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-4 py-1"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === "All" ? "" : f)}
              className={`
                px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold transition-all 
                rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer
                ${
                  (filter.toLowerCase() === f.toLowerCase() || (f === "All" && filter === ""))
                    ? "bg-[#CB1760] text-white border-4 border-[#271811] shadow-xl" // Active: Deep Red, Dark Border
                    : "bg-[#FDFBF7] text-[#D97706] border-2 border-[#D97706] hover:bg-[#D97706] hover:text-white" // Inactive: Cream, Orange Border/Text
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
        const eventResponse = await axios.get(`${apiUrl}/event`);
        setEvents(eventResponse.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (location.state?.category) {
      setCategoryTitle(location.state.category);
      setFilter(""); // Reset filter when coming from another page
    }
  }, [location.state]);

  // Update header text based on filter
  useEffect(() => {
    if (filter === "") {
      // If no filter or "All" is selected, show the original category or "ALL EVENTS"
      setCategoryTitle(location.state?.category || "ALL EVENTS");
    } else {
      // Convert filter to uppercase with proper formatting
      const formattedFilter = filter.toUpperCase() + " EVENTS";
      setCategoryTitle(formattedFilter);
    }
  }, [filter, location.state]);

  const filteredEvents = events.filter((event) => {
    if (filter === "") {
      return true; // Show all events when filter is "All" or empty
    }

    const lowerCaseFilter = filter.toLowerCase();

    // Check against specific fields that correspond to the filter pills (category, type, participation)
    if (
      event.category.toLowerCase().includes(lowerCaseFilter) ||
      event.type.toLowerCase().includes(lowerCaseFilter) ||
      event.participation.toLowerCase().includes(lowerCaseFilter)
    ) {
      return true;
    }

    // Fallback: If filter doesn't match category/type/participation, check name/venue (generic search)
    if (
        event.name.toLowerCase().includes(lowerCaseFilter) ||
        event.venue.toLowerCase().includes(lowerCaseFilter)
    ) {
        return true;
    }

    return false;
  });

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
      
      {/* --- TOP-RIGHT SVG BUTTON NAVIGATION (FIXED POSITION) --- */}
      <div className="fixed top-2 right-0 z-[60] px-6 sm:px-10 md:px-12">
          <button
              onClick={() => navigate(-1)}
              className="group relative cursor-pointer select-none"
              title="Go Back"
          >
              {/* SVG Button Container */}
              <div className="relative w-[120px] md:w-[140px] aspect-[169/58]">
                  
                  {/* Shadow/Base Image */}
                  <img 
                      src="/images/loginbtn.svg" 
                      alt="" 
                      className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%] transition-transform duration-200" 
                  />
                  
                  {/* Main SVG Shape */}
                  <svg 
                      className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" 
                      viewBox="0 0 169 45"
                  >
                      <path 
                          className="transition-colors duration-200 fill-[#FDFBF7] group-hover:fill-yellow" 
                          d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" 
                          stroke="#271811" 
                          strokeWidth="2" 
                      />
                  </svg>
                  
                  {/* Text Label */}
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
                      <span className="font-mont text-xs sm:text-sm md:text-lg font-bold tracking-wide text-black group-hover:text-black pointer-events-none">
                          GO BACK
                      </span>
                  </div>
              </div>
          </button>
      </div>
      
      {/* Fixed SVG Borders */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none hidden md:block">
        <img src="/images/top.svg" alt="Border Top" className="w-full h-auto" />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none hidden md:block">
        <img src="/images/bottom.svg" alt="Border Bottom" className="w-full h-auto" />
      </div>
      <div className="fixed left-0 top-0 h-full z-50 pointer-events-none hidden md:block">
        <img src="/images/left.svg" alt="Border Left" className="w-auto h-full" />
      </div>
      <div className="fixed right-0 top-0 h-full z-50 pointer-events-none hidden md:block">
        <img src="/images/right.svg" alt="Border Right" className="w-auto h-full" />
      </div>

      {/* FIXED SVG BORDERS — MOBILE VERSION */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none md:hidden">
        <img src="/images/topmob.svg" alt="Mobile Border Top" className="w-full h-auto" />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none md:hidden">
        <img src="/images/bottommob.svg" alt="Mobile Border Bottom" className="w-full h-auto" />
      </div>
      <div className="fixed left-0 top-0 h-full z-50 pointer-events-none md:hidden">
        <img src="/images/leftmob.svg" alt="Mobile Border Left" className="w-auto h-full" />
      </div>
      <div className="fixed right-0 top-0 h-full z-50 pointer-events-none md:hidden">
        <img src="/images/rightmob.svg" alt="Mobile Border Right" className="w-auto h-full" />
      </div>

      <motion.main
        className="max-w-7xl mx-auto px-6 
            pt-16 
            sm:pt-20 
            md:pt-24 
            pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Event Header SVG with Dynamic Category Text */}
        <div className="flex justify-center mb-4 relative">
          <div className="relative w-full 
            max-w-[180px] 
            sm:max-w-[250px] 
            md:max-w-[300px] 
            lg:max-w-[340px] 
            mx-auto">
            
            <img
              src="/images/event-header.svg"
              alt="Events Header Background"
              className="w-full h-auto block"
            />

            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
              <h1
                className="text-center leading-tight w-full transition-all duration-300"
                style={{
                  color: "#CB1760",
                  fontFamily: "'Alfa Slab One', cursive",
                  textShadow: "0 2px 0 #271811, 0 4px 0 #271811", 
                  fontSize: "clamp(0.8rem, 3.5vw + 0.4rem, 1.8rem)", 
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
              <div
                key={e._id}
                className="group relative flex items-center justify-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
              >
                <div className="relative w-full">
                  <img
                    src="/images/event-card.svg"
                    alt="Event Card Background"
                    className="w-full h-auto group-hover:opacity-80 transition-opacity"
                  />

                  {/* EVENT NAME */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h3 
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-stone-900 font-reality tracking-wide group-hover:text-[#D97706] transition-colors break-words text-center px-6 sm:px-8 md:px-10 max-w-full leading-tight"
                      style={{textShadow: "0 1px 0 #D97706"}}
                    >
                      {e.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 text-stone-500 mb-20 pb-20">
            <MdSearch className="text-4xl sm:text-5xl md:text-6xl mx-auto mb-3 sm:mb-4 opacity-20" />
            <p className="text-base sm:text-lg md:text-xl">No events found matching "{filter}"</p>
            <button onClick={() => setFilter("")} className="mt-3 sm:mt-4 text-sm sm:text-base text-[#D97706] hover:underline font-medium">
              Clear Filters
            </button>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default Events;