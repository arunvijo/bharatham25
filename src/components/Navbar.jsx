import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // State to hold the active role for the dashboard link
  const [userRole, setUserRole] = useState(null); // 'Admin', 'Captain', or null

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  // API URL from environment variables
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // --- ROLE CHECKING LOGIC ---
  useEffect(() => {
    const checkUserRole = async () => {
      // 1. If not logged in, reset role and return
      if (!isAuthenticated || !user?.nickname) {
        setUserRole(null);
        return;
      }

      try {
        // 2. Fetch house data for the logged-in user
        const response = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const houses = response.data;

        // 3. Determine if user manages the 'Admin' house or a regular house
        const isAdmin = houses.some((h) => h.name === "Admin");
        const isCaptain = houses.some((h) => h.name !== "Admin");

        // 4. Set Role with STRICT PRIORITY:
        // If user is Admin, they get the Admin Dashboard (ignoring any Captain status)
        if (isAdmin) {
          setUserRole("Admin");
        } else if (isCaptain) {
          setUserRole("Captain");
        } else {
          setUserRole(null);
        }

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

  // --- NAVIGATION ITEMS CONFIGURATION ---
  const navItems = [
    "HOME",
    "ABOUT",
    "EVENTS",
    "GALLERY",
    "HOUSES",
    "SCOREBOARD",
    "CONTACT",
  ];

  // Dynamically add the Dashboard link based on the resolved role
  if (userRole === "Admin") {
    navItems.push("ADMIN"); // Will link to /admin
  } else if (userRole === "Captain") {
    navItems.push("CAPTAIN"); // Will link to /captain
  }

  // Helper to map navigation labels to their routes
  const getPath = (label) => {
    switch (label) {
      case "HOME": return "/";
      case "ABOUT": return "/#about";
      case "EVENTS": return "/events";
      case "GALLERY": return "/gallery";
      case "HOUSES": return "/#houses";
      case "SCOREBOARD": return "/scoreboard";
      case "CONTACT": return "/#contact";
      case "ADMIN": return "/admin";     // Admin Dashboard Route
      case "CAPTAIN": return "/captain"; // Captain Dashboard Route
      default: return "/";
    }
  };

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isNavOpen || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isNavOpen, isClosing]);

  return (
    <header className="sticky top-0 z-[3000]">
      {/* NAVBAR */}
      <nav
        className={`relative z-30 w-full px-6 py-4 flex items-center justify-between transition-colors duration-200 ${
          isNavOpen ? "transparent" : "bg-cream"
        }`}
      >
        {/* HAMBURGER BUTTON */}
        <button
          onClick={toggleNav}
          aria-label="Toggle menu"
          className="
            flex items-center justify-center 
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            cursor-pointer relative
          "
        >
          {/* Animated Hamburger Lines */}
          <span
            className={`
              absolute h-[2px] sm:h-[3px] w-6 sm:w-8 md:w-10 bg-black rounded-full transition-all duration-200
              ${isNavOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-2"}
            `}
          />
          <span
            className={`
              absolute h-[2px] sm:h-[3px] w-6 sm:w-8 md:w-10 bg-black rounded-full transition-all duration-200
              ${isNavOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"}
            `}
          />
          <span
            className={`
              absolute h-[2px] sm:h-[3px] w-6 sm:w-8 md:w-10 bg-black rounded-full transition-all duration-200
              ${isNavOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-2"}
            `}
          />
        </button>

        {/* LOGO */}
        <h1
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 font-mont text-brand-logo font-semibold text-center leading-none transition-colors duration-200 ${
            isNavOpen ? "text-yellow" : "text-black"
          }`}
        >
          BHARATHAM26
        </h1>

        {/* AUTH0 LOGIN/LOGOUT BUTTON */}
        <button
          onClick={() => 
            isAuthenticated 
              ? logout({ logoutParams: { returnTo: window.location.origin } }) 
              : loginWithRedirect()
          }
          className="
            relative w-[20vw] sm:w-[32vw] md:w-[26vw] lg:w-[22vw] max-w-[160px] aspect-[169/58]
            cursor-pointer group select-none
          "
        >
          {/* Button Background Shadow */}
          <img
            src="/images/loginbtn.svg"
            alt=""
            className="absolute inset-0 w-full h-full translate-x-[6px] translate-y-[4px] pointer-events-none brightness-0 saturate-[1000%]"
          />
          
          {/* Main Button Shape */}
          <svg
            className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[4px]"
            viewBox="0 0 169 45"
          >
            <path
              className="transition-colors duration-200 fill-[#FFFFFF] group-hover:fill-yellow"
              d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z"
              stroke="#271811"
              strokeWidth="2"
            />
          </svg>

          {/* Button Text */}
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[4px]">
            <span className="font-mont text-[3vw] sm:text-[3vw] md:text-lg font-medium tracking-wide text-black pointer-events-none">
              {isAuthenticated ? "LOGOUT" : "LOGIN"}
            </span>
          </div>
        </button>
      </nav>

      {/* CENTER SVG DECORATION */}
      <div className="w-full flex justify-center">
        <img src="/images/nav.svg" alt="" className="block w-[50%] sm:w-[50%] md:w-[40%] lg:w-[35%] xl:w-[20%]" />
      </div>

      {/* FULL-PAGE OVERLAY MENU */}
      <div
        className={`fixed inset-0 bg-primary flex items-center justify-center ${
          isClosing
            ? "opacity-0 transition-opacity duration-1000"
            : isNavOpen
            ? "opacity-100 transition-opacity duration-300"
            : "opacity-0"
        } ${
          isNavOpen || isClosing ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="w-11/12 max-w-[1800px] flex flex-wrap justify-center gap-7 font-mont text-display-nav text-white text-center">
          {navItems.map((label, index) => (
            <Link
              key={label}
              to={getPath(label)}
              onClick={() => {
                toggleNav(); // Close menu when a link is clicked
              }}
              className={`
                inline-flex items-baseline gap-4
                ${isClosing ? "animate-menuJumpOut" : isNavOpen ? "animate-menuJumpIn opacity-100" : "opacity-0"}
              `}
              style={{
                animationDelay: isClosing
                  ? `${(navItems.length - 1 - index) * 50}ms`
                  : `${index * 70}ms`,
                textDecoration: 'none'
              }}
            >
              <span className="relative inline-flex flex-col items-center group cursor-pointer">
                <span className="text-white hover:text-yellow transition-colors duration-300">{label}</span>
                <span className="mt-2 h-2 w-full bg-yellow scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />
              </span>

              {index < navItems.length - 1 && (
                <img
                  src="/images/spinner.svg"
                  alt="Spinner"
                  className="inline-block h-[0.9em] w-[0.9em] animate-spinSlow translate-y-[1px]"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}