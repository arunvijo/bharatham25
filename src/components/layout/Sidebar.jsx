import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdEvent, MdLeaderboard, MdLogout, MdClose } from 'react-icons/md';
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = ({ role = "Captain", isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth0();

  // Navigation Links Configuration
  const links = role === "Admin" ? [
    { name: 'Dashboard', path: 'https://bharatham26.live/', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> },
    { name: 'Scoreboard', path: '/scoreboard', icon: <MdLeaderboard /> },
  ] : [
    { name: 'Dashboard', path: 'https://bharatham26.live/', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> },
  ];

  const isActive = (path) => location.pathname === path;

  // Helper to auto-close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay: Visible only on mobile (md:hidden) when open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-[#1a1614] text-white z-50 shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
        {/* Header & Close Button */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/20 shrink-0">
          <h1 className="font-qawatone text-2xl tracking-wider text-desi-saffron drop-shadow-md">
            BHARATHAM
          </h1>
          {/* Close Button: Visible only on mobile */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-stone-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isExternal = link.path.startsWith('http');
            const commonClass = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border-l-4 group
                ${isActive(link.path) 
                  ? 'bg-white/10 border-desi-saffron text-white shadow-lg' 
                  : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                }`;

            return isExternal ? (
                <a
                  key={link.path}
                  href={link.path}
                  className={commonClass}
                >
                  <span className={`text-xl transition-transform group-hover:scale-110 ${isActive(link.path) ? 'text-desi-saffron' : ''}`}>
                    {link.icon}
                  </span>
                  <span className="font-qawatone font-medium tracking-wide text-lg pt-1">{link.name}</span>
                </a>
            ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={commonClass}
                >
                  <span className={`text-xl transition-transform group-hover:scale-110 ${isActive(link.path) ? 'text-desi-saffron' : ''}`}>
                    {link.icon}
                  </span>
                  <span className="font-qawatone font-medium tracking-wide text-lg pt-1">{link.name}</span>
                </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={() => logout({ returnTo: window.location.origin })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <MdLogout className="text-xl" />
            <span className="font-medium font-sans">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;