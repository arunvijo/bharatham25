import React from 'react';

const Footer = () => {
  const quickLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'EVENTS', path: '/events' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'HOUSES', path: '/houses' },
    { name: 'SCOREBOARD', path: '/scoreboard' },
  ];

  return (
    <footer className="bg-primary text-white relative overflow-hidden pb-0">
      {/* Top Lotus Image */}
      <div className="flex justify-center py-8">
        <img 
          src={`images/lotus.png`}
          alt="Lotus"
          className="h-48 w-auto object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Main Content - Quick Links, Logo, Contact */}
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Left - Quick Links */}
          <div className="flex flex-col space-y-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="text-white hover:text-yellow transition-colors duration-300 text-lg font-opensans"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <img 
              src={`images/Jubilee.png`}
              alt="Logo"
              className="h-32 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Right - Contact Information */}
          <div className="flex flex-col space-y-3 text-right">
            <p className="text-lg font-opensans">
              <span className="block font-semibold">Email</span>
              info@bharatham26.com
            </p>
            <p className="text-lg font-opensans">
              <span className="block font-semibold">Phone</span>
              +91 1234567890
            </p>
            <p className="text-lg font-opensans">
              <span className="block font-semibold">Location</span>
              Kakkanad, Kerala, India
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center pb-6">
        <p className="text-sm font-opensans">
          © 2025 Bharatham26. All rights reserved.
        </p>
      </div>

      {/* Bottom - BHARATHAM26 Large Text */}
      <div className="w-full overflow-hidden leading-none">
        <h2 className="font-mont text-yellow text-left whitespace-nowrap w-full block"
            style={{
              fontSize: '13.7vw',
              lineHeight: '0.8',
              letterSpacing: '-0.04em',
              marginBottom: '0',
              marginLeft: '0',
              paddingBottom: '0'
            }}>
          BHARATHAM26
        </h2>
      </div>
    </footer>
  );
};

export default Footer;