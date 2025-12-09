import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { MdDashboard } from "react-icons/md";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [userRole, setUserRole] = useState(null);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isAuthenticated || !user?.nickname) {
        setUserRole(null);
        return;
      }
      try {
        const response = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const houses = response.data;
        const isAdmin = houses.some((h) => h.name === "Admin");
        const isCaptain = houses.some((h) => h.name !== "Admin");

        if (isAdmin) setUserRole("Admin");
        else if (isCaptain) setUserRole("Captain");
        else setUserRole(null);

      } catch (error) {
        console.error("Error fetching user roles:", error);
        setUserRole(null);
      }
    };
    checkUserRole();
  }, [isAuthenticated, user, apiUrl]);

  const toggleNav = () => {
    if (isNavOpen) {
      setIsClosing(true);
      setTimeout(() => setIsNavOpen(false), 100);
      setTimeout(() => setIsClosing(false), 550);
    } else {
      setIsNavOpen(true);
    }
  };

  const navItems = ["HOME", "ABOUT", "EVENTS", "GALLERY", "HOUSES", "SCOREBOARD", "CONTACT"];

  const getPath = (label) => {
    switch (label) {
      case "HOME": return "/";
      case "ABOUT": return "/#about";
      case "EVENTS": return "/events";
      case "GALLERY": return "/gallery";
      case "HOUSES": return "/#houses";
      case "SCOREBOARD": return "/scoreboard";
      case "CONTACT": return "/#contact";
      default: return "/";
    }
  };

  useEffect(() => {
    if (isNavOpen || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isNavOpen, isClosing]);

  return (
    /* CHANGED: 'sticky' -> 'fixed' to remove space above Hero */
    <header className="fixed top-0 left-0 w-full z-[3000]">
      
      <nav
        className={`relative z-30 w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors duration-200 ${
          isNavOpen ? "transparent" : "bg-cream backdrop-blur-sm shadow-sm" // Added slight opacity/blur for better visibility over hero
        }`}
      >
        {/* LEFT: HAMBURGER BUTTON */}
        <button
          onClick={toggleNav}
          aria-label="Toggle menu"
          className="flex items-center justify-center w-10 h-10 cursor-pointer relative z-50"
        >
          <span className={`absolute h-[2px] sm:h-[3px] w-6 sm:w-8 bg-black rounded-full transition-all duration-200 ${isNavOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-3"}`} />
          <span className={`absolute h-[2px] sm:h-[3px] w-6 sm:w-8 bg-black rounded-full transition-all duration-200 ${isNavOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"}`} />
          <span className={`absolute h-[2px] sm:h-[3px] w-6 sm:w-8 bg-black rounded-full transition-all duration-200 ${isNavOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-3"}`} />
        </button>

        {/* CENTER: LOGO */}
        <h1 className={`absolute left-1/2 -translate-x-1/2 font-mont font-semibold text-center leading-none transition-colors duration-200 pointer-events-none text-xl sm:text-2xl md:text-3xl ${isNavOpen ? "text-yellow" : "text-black"}`}>
          BHARATHAM26
        </h1>

        {/* RIGHT: ACTIONS (Dashboard + Login) */}
        <div className="flex items-center gap-3 z-50">
          
          {userRole && (
            <Link
              to={userRole === 'Admin' ? '/admin' : '/captain'}
              className="flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2 bg-desi-saffron text-white font-mont font-bold tracking-wider text-[10px] sm:text-sm rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              title={`${userRole} Dashboard`}
            >
              <span className="hidden sm:inline">{userRole === 'Admin' ? 'ADMIN' : 'CAPTAIN'}</span>
              <span className="sm:hidden"><MdDashboard size={16} /></span>
            </Link>
          )}

          <button
            onClick={() => isAuthenticated ? logout({ logoutParams: { returnTo: window.location.origin } }) : loginWithRedirect()}
            className="relative w-24 sm:w-[140px] aspect-[169/58] cursor-pointer group select-none"
          >
            <img src="/images/loginbtn.svg" alt="" className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%]" />
            <svg className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" viewBox="0 0 169 45">
              <path className="transition-colors duration-200 fill-[#FFFFFF] group-hover:fill-yellow" d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" stroke="#271811" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
              <span className="font-mont text-xs sm:text-sm font-bold tracking-wide text-black pointer-events-none">
                {isAuthenticated ? "LOGOUT" : "LOGIN"}
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* CENTER SVG DECORATION */}
      <div className="w-full flex justify-center pointer-events-none">
        <img src="/images/nav.svg" alt="" className="block w-[60%] sm:w-[40%] md:w-[30%] lg:w-[20%]" />
      </div>

      {/* FULL-PAGE OVERLAY MENU */}
      <div className={`fixed inset-0 bg-primary flex items-center justify-center ${isClosing ? "opacity-0 transition-opacity duration-1000" : isNavOpen ? "opacity-100 transition-opacity duration-300" : "opacity-0"} ${isNavOpen || isClosing ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className="w-11/12 max-w-[1800px] flex flex-wrap justify-center gap-6 sm:gap-10 font-mont text-4xl sm:text-6xl md:text-display-nav text-white text-center">
          {navItems.map((label, index) => (
            <Link
              key={label}
              to={getPath(label)}
              onClick={() => toggleNav()}
              className={`inline-flex items-baseline gap-4 ${isClosing ? "animate-menuJumpOut" : isNavOpen ? "animate-menuJumpIn opacity-100" : "opacity-0"}`}
              style={{ animationDelay: isClosing ? `${(navItems.length - 1 - index) * 50}ms` : `${index * 70}ms`, textDecoration: 'none' }}
            >
              <span className="relative inline-flex flex-col items-center group cursor-pointer hover:text-yellow transition-colors duration-300">
                {label}
                <span className="mt-2 h-1 sm:h-2 w-full bg-yellow scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              {index < navItems.length - 1 && (
                <img src="/images/spinner.svg" alt="Spinner" className="inline-block h-[0.6em] w-[0.6em] animate-spinSlow translate-y-[2px]" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}