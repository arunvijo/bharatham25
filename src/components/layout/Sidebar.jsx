import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdEvent, MdLeaderboard, MdLogout } from 'react-icons/md';
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = ({ role = "Captain" }) => {
  const location = useLocation();
  const { logout } = useAuth0();

  // Define links based on role
  const links = role === "Admin" ? [
    { name: 'Dashboard', path: '/admin', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> },
    { name: 'Scoreboard', path: '/scoreboard', icon: <MdLeaderboard /> },
  ] : [
    { name: 'Dashboard', path: '/captain', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> }, // Or Captain specific event list
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-[#1a1614] text-white fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <h1 className="font-qawatone text-2xl tracking-wider text-desi-saffron">BHARATHAM</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActive(link.path) 
                ? 'bg-desi-saffron text-white shadow-lg shadow-orange-900/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium tracking-wide">{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* User / Logout Section */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => logout({ returnTo: window.location.origin })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <MdLogout className="text-xl" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;