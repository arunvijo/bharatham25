import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdGroups, MdEventAvailable, MdLocationOn, MdCalendarToday, MdEmojiEvents, MdInfo } from "react-icons/md";
import { Pointer } from "../components/Pointer";

const SpecialEventPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Navigate to registration page or open registration form
    window.open("https://konfhub.com/bharatham-2026", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans relative overflow-x-hidden">
      
      {/* Fixed SVG Borders - Desktop */}
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

      {/* Fixed SVG Borders - Mobile */}
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

      {/* Go Back Button */}
      <div className="fixed top-4 right-0 z-[60] px-6 sm:px-10 md:px-12">
        <button
          onClick={() => navigate(-1)}
          className="group relative cursor-pointer select-none"
          title="Go Back"
        >
          <div className="relative w-[120px] md:w-[140px] aspect-[169/58]">
            <img 
              src="/images/loginbtn.svg" 
              alt="" 
              className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%] transition-transform duration-200" 
            />
            <svg 
              className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" 
              viewBox="0 0 169 45"
            >
              <path 
                className="transition-colors duration-200 fill-[#FDFBF7] group-hover:fill-[#D97706]" 
                d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" 
                stroke="#271811" 
                strokeWidth="2" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
              <span className="font-mont text-xs sm:text-sm md:text-lg font-bold tracking-wide text-black group-hover:text-black pointer-events-none">
                GO BACK
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <motion.main
        className="max-w-6xl mx-auto px-6 pt-20 sm:pt-24 md:pt-28 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Event Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#CB1760] mb-4"
            style={{
              fontFamily: "'Alfa Slab One', cursive",
              textShadow: "5px 5px 0px #F4F437",
              letterSpacing: "0.02em"
            }}
          >
            RAJAGIRI RHYTHMIX
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#271811]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            BHARATHAM 2026 Presents: Inter-College Dance Competition
          </motion.p>
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-[6px] border-[#271811] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          
          {/* Decorative Top Strip */}
          <div className="h-6 bg-gradient-to-r from-[#D97706] via-[#CB1760] to-[#D97706]" />

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-10">
            
            {/* Left: Image */}
           {/* Left: Image */}
<div className="relative">
  <div className="relative w-full bg-stone-200 rounded-lg border-4 border-[#271811] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
    {/* Actual Event Poster Image */}
    <img 
      src="/images/special_event/special.png" 
      alt="Rajagiri Rhythmix Poster" 
      className="w-full h-auto object-cover display-block"
    />
    
    {/* Overlay Badge - Kept as requested */}
    <div className="absolute top-4 left-4 bg-[#CB1760] text-white px-4 py-2 rounded-lg border-2 border-[#271811] font-bold text-sm shadow-lg z-10">
      <MdGroups className="inline mr-2" size={20} />
      7-15 Members
    </div>
  </div>
</div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between space-y-6">
              
              {/* Event Info */}
              <div className="space-y-4">
                <h2 
                  className="text-2xl sm:text-3xl font-bold text-[#271811] border-b-4 border-[#D97706] pb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Event Details
                </h2>

                {/* Info Items */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MdCalendarToday className="text-[#CB1760] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-stone-900">Date</p>
                      <p className="text-stone-600">January 24, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MdLocationOn className="text-[#CB1760] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-stone-900">Venue</p>
                      <p className="text-stone-600">RSET, Kakkanad, Kochi</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MdEmojiEvents className="text-[#D97706] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-stone-900">Grand Prize Pool</p>
                      <p className="text-[#CB1760] font-black text-xl">₹ 1,00,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#FEE89B]/30 border-2 border-[#D97706] rounded-lg p-4">
                <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Join the most anticipated inter-college dance battle at Bharatham 2026. Bring your best choreography, energy, and style to the RSET stage and compete for the massive 1 Lakh prize pool!
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 text-[10px] sm:text-xs">
                  <div>
                      <p className="font-bold border-b border-stone-300 mb-1">STUDENT CONTACTS</p>
                      <p>Milan Joe Baby: +91 6282067346</p>
                      <p>Tona Rose Tomy: +91 9847343601</p>
                  </div>
                  <div>
                      <p className="font-bold border-b border-stone-300 mb-1">FACULTY CONTACTS</p>
                      <p>Ms. Neethu Radha Gopan: +91 9048521275</p>
                      <p>Mr. John Paul CD: +91 6238767856</p>
                  </div>
              </div>

              {/* Register Button */}
              <div className="relative">
                <Pointer>
                  <div className="text-2xl">👆</div>
                </Pointer>
                <button
                  onClick={handleRegister}
                  className="w-full group relative px-8 py-4 bg-[#CB1760] text-white font-black text-xl border-4 border-[#271811] rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  REGISTER NOW
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Strip */}
          <div className="h-6 bg-gradient-to-r from-[#D97706] via-[#CB1760] to-[#D97706]" />
        </motion.div>

        {/* Rules Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white border-4 border-[#271811] rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#D97706] pb-2">
            <MdInfo className="text-[#CB1760]" size={28} />
            <h3 className="text-2xl font-bold text-[#271811]">
                Guidelines & Rules
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-base text-stone-700">
            <ul className="space-y-2">
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">01.</span>
                <span>Team Size: 7-15 members. No solo performances.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">02.</span>
                <span>Max Time: 12 mins (including setup). Exceeding leads to disqualification.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">03.</span>
                <span>All dance forms allowed. Costumes must be appropriate for a general audience.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">04.</span>
                <span>Music & backdrops must be submitted 24 hours prior in MP3 format.</span>
                </li>
            </ul>
            <ul className="space-y-2">
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">05.</span>
                <span>Strictly Prohibited: Fire, hazardous materials, water, or breakable items.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">06.</span>
                <span>Reporting: Teams must report 1 hour before their scheduled slot.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">07.</span>
                <span>Mandatory: A valid college ID card is required for all participants.</span>
                </li>
                <li className="flex items-start gap-2">
                <span className="text-[#CB1760] font-bold">08.</span>
                <span>Judging: Based on choreography, synchronization, energy, and overall impact.</span>
                </li>
            </ul>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default SpecialEventPage;