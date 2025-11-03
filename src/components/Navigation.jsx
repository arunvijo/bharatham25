import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../pages/LoginButton";
import LogoutButton from "../pages/LogoutButton";
import {
  FaHome,
  FaInfoCircle,
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaTrophy,
  FaUserShield,
  FaUserTie,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navigation = ({ showMenu }) => {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    console.error("Auth0 Error:", error);
    return null;
  }

  return (
    <>
      <button className="btn-burger" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <header className={`floating-nav ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <ul>
          {/* Home - Goes to top of page */}
          <li>
            <RouterLink to="/" className="active">
              <FaHome fill="#270B55" />
              <span>Home</span>
            </RouterLink>
          </li>

          {/* Smooth scrolling links */}
          <li>
            <ScrollLink to="about" smooth={true} duration={500} offset={-80}>
              <FaInfoCircle fill="#270B55" />
              <span>About</span>
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="houses" smooth={true} duration={500} offset={-80}>
              <FaUsers fill="#270B55" />
              <span>Houses</span>
            </ScrollLink>
          </li>

          {/* External navigation */}
          <li>
            <RouterLink to="/events">
              <FaCalendarAlt fill="#270B55" />
              <span>Events</span>
            </RouterLink>
          </li>
          {/* <li>
            <RouterLink to="/gallery">
              <FaImages fill="#270B55" />
              <span>Gallery</span>
            </RouterLink>
          </li> */}
          <li>
            <RouterLink to="/scoreboard">
              <FaTrophy fill="#270B55" />
              <span>Scoreboard</span>
            </RouterLink>
          </li>

          {/* Admin & Captain (Auth-based) */}
          {isAuthenticated && (
            <>
              <li>
                <RouterLink to="/admin">
                  <FaUserShield fill="#270B55" />
                  <span>Admin</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/captain">
                  <FaUserTie fill="#270B55" />
                  <span>Captain</span>
                </RouterLink>
              </li>
            </>
          )}

          {/* Login / Logout */}
          {isAuthenticated ? (
            <li>
              <LogoutButton>
                <FaSignOutAlt fill="#270B55" />
                <span>Logout</span>
              </LogoutButton>
            </li>
          ) : (
            <li>
              <LoginButton>
                <FaSignInAlt fill="#270B55" />
                <span>Login</span>
              </LoginButton>
            </li>
          )}
        </ul>
      </header>
    </>
  );
};

export default Navigation;
