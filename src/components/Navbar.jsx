import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleNav = () => {
    if (isNavOpen) {
      // Start closing animation
      setIsClosing(true);
      // Delay the navbar background change to sync with overlay fade
      setTimeout(() => {
        setIsNavOpen(false);
      }, 100); // Match overlay fade duration
      setTimeout(() => {
        setIsClosing(false);
      }, 550);
    } else {
      setIsNavOpen(true);
    }
  };

  const navItems = [
    "HOME",
    "ABOUT",
    "EVENTS",
    "GALLERY",
    "HOUSES",
    "SCOREBOARD",
    "CONTACT",
  ];

  // 🔒 Disable scroll when overlay is open
  useEffect(() => {
    if (isNavOpen || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // cleanup in case component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen, isClosing]);

  return (
    <header className="sticky top-0 z-[3000]">
      {/* NAVBAR */}
      <nav
        className={`relative z-30 w-full px-6 py-4 flex items-center justify-between transition-colors duration-200 ${
          isNavOpen ? "transparent" : "bg-cream"
        }`}
      >
<button
  onClick={toggleNav}
  aria-label="Toggle menu"
  className="
    flex items-center justify-center 
    w-8 h-8          /* mobile */
    sm:w-10 sm:h-10  /* tablet */
    md:w-12 md:h-12  /* desktop */
    cursor-pointer
    relative
  "
>
  {/* LINE 1 */}
  <span
    className={`
      absolute 
      h-[2px] sm:h-[3px]        /* thinner on mobile */
      w-6 sm:w-8 md:w-10
      bg-black rounded-full
      transition-all duration-200
      ${isNavOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-2"}
    `}
  />

  {/* LINE 2 */}
  <span
    className={`
      absolute 
      h-[2px] sm:h-[3px]
      w-6 sm:w-8 md:w-10
      bg-black rounded-full 
      transition-all duration-200
      ${isNavOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"}
    `}
  />

  {/* LINE 3 */}
  <span
    className={`
      absolute 
      h-[2px] sm:h-[3px]
      w-6 sm:w-8 md:w-10
      bg-black rounded-full 
      transition-all duration-200
      ${isNavOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-2"}
    `}
  />
</button>



        <h1
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 font-mont text-brand-logo font-semibold text-center leading-none transition-colors duration-200 ${
            isNavOpen ? "text-yellow" : "text-black"
          }`}
        >
          BHARATHAM26
        </h1>

 <button
  className="
    relative 
    w-[20vw]         /* mobile size */
    sm:w-[32vw]      /* tablets */
    md:w-[26vw]      /* medium devices */
    lg:w-[22vw]      /* large screens */
    max-w-[160px] 
    aspect-[169/58]
    cursor-pointer 
    group 
    select-none
  "
>
  {/* SHADOW */}
  <img
    src="/images/loginbtn.svg"
    alt=""
    className="
      absolute inset-0 w-full h-full 
      translate-x-[6px] translate-y-[4px]
      pointer-events-none 
      brightness-0 saturate-[1000%]
    "
  />

  {/* MAIN BUTTON SVG */}
  <svg
    className="
      absolute inset-0 w-full h-full
      transition-transform duration-200
      group-hover:translate-x-[6px] 
      group-hover:translate-y-[4px]
    "
    viewBox="0 0 169 45"
  >
    <path
      className="transition-colors duration-200 fill-[#FFFFFF] group-hover:fill-yellow"
      d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z"
      stroke="#271811"
      strokeWidth="2"
    />
  </svg>

  {/* TEXT */}
  <div
    className="
      absolute inset-0 flex items-center justify-center
      transition-transform duration-200
      group-hover:translate-x-[6px] 
      group-hover:translate-y-[4px]
    "
  >
    <span
      className="
        font-mont 
        text-[3vw]      /* mobile */
        sm:text-[3vw]   /* tablet */
        md:text-lg      /* desktop normal size */
        font-medium 
        tracking-wide 
        text-black 
        pointer-events-none
      "
    >
      LOGIN
    </span>
  </div>
</button>

      </nav>

      {/* center svg below navbar */}
<div className="w-full flex justify-center">
  <img
    src="/images/nav.svg"
    alt=""
    className="
      block
      w-[50%]          /* mobile */
      sm:w-[50%]       /* tablet */
      md:w-[40%]       /* medium screens */
      lg:w-[35%]       /* large screens */
      xl:w-[20%]       /* extra large screens */
    "
  />
</div>

      {/* FULL-PAGE OVERLAY */}
      <div
        className={`fixed inset-0 bg-primary flex items-center justify-center ${
          isClosing 
            ? "opacity-0 transition-opacity duration-1000" 
            : isNavOpen 
            ? "opacity-100 transition-opacity duration-300" 
            : "opacity-0"
        } ${
          (isNavOpen || isClosing) ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
<div className="w-11/12 max-w-[1800px] flex flex-wrap justify-center gap-7 font-mont text-display-nav text-white text-center">
  {navItems.map((label, index) => (
    <span
    key={label}
    className={`
        inline-flex items-baseline gap-4
        ${isClosing ? "animate-menuJumpOut" : (isNavOpen ? "animate-menuJumpIn opacity-100" : "opacity-0")}
    `}
      style={{
        animationDelay: isClosing 
          ? `${(navItems.length - 1 - index) * 50}ms` 
          : `${index * 70}ms`,
      }}
    >
      {/* label + underline */}
      <span className="relative inline-flex flex-col items-center group  cursor-pointer">
        <span className="text-white">{label}</span>
        <span
          className="
            mt-2 h-2 w-full 
            bg-yellow 
            scale-x-0 
            origin-center 
            transition-transform 
            duration-300 
            group-hover:scale-x-100
          "
        />
      </span>

      {/* spinning separator */}
      {index < navItems.length - 1 && (
        <img
        src="/images/spinner.svg"
        alt="Spinner"
        className="inline-block h-[0.9em] w-[0.9em] animate-spinSlow translate-y-[1px]"
        />

      )}
    </span>
  ))}
</div>

      </div>
    </header>
  );
}