import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Pointer } from "./Pointer";

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after 2 seconds on page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    setIsOpen(false);
    navigate("/special-event/group-dance");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center"
            onClick={handleClose}
          >
            {/* Popup Modal - Centered using flexbox parent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-[90%] max-w-[500px] m-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Main Card */}
              <div className="relative bg-[#FDFBF7] border-[6px] border-[#271811] rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                
                {/* Close Button */}
                <div className="relative">
                <Pointer>
                        <div className="text-2xl">👆</div>
                      </Pointer>
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-10 bg-[#CB1760] text-white p-2 rounded-full border-2 border-[#271811] hover:bg-[#A01450] transition-all hover:scale-110 active:scale-95"
                >
                  <MdClose size={20} />
                </button>
                </div>

                {/* Decorative Top Border */}
                <div className="h-4 bg-gradient-to-r from-[#D97706] via-[#CB1760] to-[#D97706]" />

                {/* Content */}
                <div className="p-6 sm:p-8 text-center space-y-4">

                  {/* Event Title */}
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-black text-[#CB1760]"
                    style={{
                      fontFamily: "'Alfa Slab One', cursive",
                      textShadow: "3px 3px 0px #F4F437",
                      letterSpacing: "0.02em"
                    }}
                  >
                    NRITYA UTSAV
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg sm:text-xl font-bold text-[#271811]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Inter-College Group Dance Competition
                  </motion.p>

                  {/* Decorative Line */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="h-1 w-12 bg-[#D97706] rounded-full" />
                    <div className="h-1 w-12 bg-[#CB1760] rounded-full" />
                    <div className="h-1 w-12 bg-[#D97706] rounded-full" />
                  </div>

                  {/* Description */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Join us for the most spectacular group dance competition! 
                    Showcase your talent, creativity, and teamwork on the biggest stage.
                  </motion.p>

                  {/* Explore Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-4"
                  >
                    <div className="relative">
                      <Pointer>
                        <div className="text-2xl">👆</div>
                      </Pointer>
                      <button
                        onClick={handleExplore}
                        className="relative w-[140px] md:w-[160px] aspect-[169/58] group/explore select-none"
                      >
                        {/* Shadow */}
                        <img
                          src="/images/loginbtn.svg"
                          alt=""
                          className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] brightness-0 saturate-[1000%] pointer-events-none"
                        />

                        {/* Main Button SVG */}
                        <svg
                          className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out group-hover/explore:translate-x-[4px] group-hover/explore:translate-y-[3px]"
                          viewBox="0 0 169 45"
                        >
                          <path
                            className="transition-colors duration-200 fill-yellow group-hover/explore:fill-[#D97706]"
                            d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z"
                            stroke="#271811"
                            strokeWidth="2"
                          />
                        </svg>

                        {/* Text */}
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover/explore:translate-x-[4px] group-hover/explore:translate-y-[3px] pointer-events-none">
                          <span className="font-mont text-sm md:text-base font-bold tracking-widest text-black">
                            EXPLORE
                          </span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Bottom Border */}
                <div className="h-4 bg-gradient-to-r from-[#D97706] via-[#CB1760] to-[#D97706]" />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Popup;