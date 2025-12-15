import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, title, subtitle, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-desi-pattern relative"> 
      
      {/* Sidebar Component */}
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      {/* md:ml-64: Pushes content right on desktop to accommodate fixed sidebar */}
      <div className="md:ml-64 transition-all duration-300 min-h-screen flex flex-col w-auto">
        
        {/* Sticky Header */}
        <header className="bg-white/90 backdrop-blur-md h-20 sticky top-0 z-30 border-b-4 border-desi-saffron px-4 md:px-8 flex items-center justify-between shadow-sm">
            
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Hamburger Menu: Hidden on Desktop (md:hidden) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-desi-saffron shrink-0"
              >
                <MdMenu size={28} />
              </button>

              <div className="overflow-hidden min-w-0">
                <h2 className="text-2xl md:text-3xl text-black font-qawatone tracking-wide truncate mt-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs md:text-sm text-stone-600 font-medium hidden sm:block font-sans truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Role Badge */}
            {role && (
              <div className="h-10 w-10 rounded-full bg-orange-100 border-2 border-desi-saffron flex items-center justify-center text-desi-saffron font-bold text-lg shadow-sm shrink-0 font-qawatone cursor-default ml-4">
                {role[0]}
              </div>
            )}
        </header>

        {/* Scrollable Main Body */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden font-sans">
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;