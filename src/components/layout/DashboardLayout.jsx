import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdEvent, 
  MdLeaderboard, 
  MdLogout, 
  MdMenu, 
  MdClose 
} from 'react-icons/md';
import { useAuth0 } from "@auth0/auth0-react";

// Sidebar Component
const Sidebar = ({ role = "Captain", isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth0();

  const links = role === "Admin" ? [
    { name: 'Dashboard', path: 'https://bharatham25.vercel.app/', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> },
    { name: 'Scoreboard', path: '/scoreboard', icon: <MdLeaderboard /> },
  ] : [
    { name: 'Dashboard', path: 'https://bharatham25.vercel.app/', icon: <MdDashboard /> },
    { name: 'Events', path: '/events', icon: <MdEvent /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-[#1a1614] text-white z-50 shadow-2xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
        {/* Header & Close Button */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/20">
          <h1 className="font-qawatone text-2xl tracking-wider text-desi-saffron drop-shadow-md">BHARATHAM</h1>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-stone-400 hover:text-white p-1 rounded-md hover:bg-white/10"
          >
            <MdClose size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isExternal = link.path.startsWith('http');
            const commonClass = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border-l-4
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
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-qawatone font-medium tracking-wide text-lg pt-1">{link.name}</span>
                </a>
            ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={commonClass}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-qawatone font-medium tracking-wide text-lg pt-1">{link.name}</span>
                </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
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

// Main Layout Component
const DashboardLayout = ({ children, title, subtitle, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // REMOVED 'flex' and 'flex-col md:flex-row' to fix horizontal overflow
    <div className="min-h-screen bg-desi-pattern relative"> 
      
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      {/* Added w-auto to let it shrink naturally with margins */}
      <div className="md:ml-64 transition-all duration-300 min-h-screen flex flex-col w-auto">
        
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md h-20 sticky top-0 z-30 border-b-4 border-desi-saffron px-4 md:px-8 flex items-center justify-between shadow-sm">
            
            <div className="flex items-center gap-4">
              {/* Hamburger Menu (Mobile Only) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <MdMenu size={28} />
              </button>

              <div className="overflow-hidden">
                <h2 className="text-2xl md:text-3xl text-black font-qawatone tracking-wide truncate mt-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs md:text-sm text-stone-600 font-medium hidden sm:block font-sans">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="h-10 w-10 rounded-full bg-orange-100 border-2 border-desi-saffron flex items-center justify-center text-desi-saffron font-bold text-lg shadow-sm shrink-0 font-qawatone">
              {role[0]}
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden font-sans">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;