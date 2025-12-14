import React from 'react';
import { FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { Pointer } from './Pointer.jsx';
const Footer = () => {
  const quickLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/#about' },
    { name: 'EVENTS', path: '/events' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'HOUSES', path: '/#houses' },
    { name: 'SCOREBOARD', path: '/scoreboard' },
  ];

  return (
    <footer className="bg-primary text-white relative overflow-hidden pt-16 pb-0">

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          
          {/* COLUMN 1: IDENTITY (Logos + College Info) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            
            {/* Logo Cluster */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                {/* RSET Logo */}
                <img 
                  src="/images/rset.png" 
                  alt="RSET" 
                  className="h-16 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" 
                />
                
                {/* Main Bharatham Logo */}
                <img 
                  src="/images/logoC.png" 
                  alt="Bharatham" 
                  className="h-20 w-20 object-contain brightness-0 invert" 
                />

                {/* Jubilee Logo */}
                <img 
                  src="/images/Jubilee.png" 
                  alt="Silver Jubilee" 
                  className="h-16 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" 
                />
            </div>

            <div>
              {/* UPDATED FONT to Qawatone */}
              <h3 className="font-qawatone text-xl font-bold tracking-wide">RAJAGIRI SCHOOL OF</h3>
              <h3 className="font-qawatone text-lg font-medium tracking-wide">ENGINEERING & TECHNOLOGY</h3>
              <p className="font-opensans text-sm opacity-80 mt-2">Autonomous</p>
            </div>
            
            <a 
              href="https://goo.gl/maps/..." 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-white/30 rounded-full hover:bg-white hover:text-primary transition-all duration-300 group"
            >
              <FaMapMarkerAlt className="group-hover:animate-bounce" />
              <span className="font-opensans text-sm font-semibold">Get Directions</span>
              <Pointer>
                                  <div className="text-2xl">👆</div>
                                </Pointer>
            </a>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="flex flex-col items-center md:items-center space-y-4">
            <h4 className=" text-2xl text-yellow mb-2 tracking-widest">EXPLORE</h4>
            <div className="flex flex-col space-y-2 text-center">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="font-opensans text-base hover:text-yellow hover:tracking-wider transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
              <Pointer>
                                  <div className="text-2xl">👆</div>
                                </Pointer>
            </div>
          </div>

          {/* COLUMN 3: CONNECT (Socials + Contact) */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-6">
            <h4 className=" text-2xl text-yellow mb-2 tracking-widest">CONNECT</h4>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <Pointer>
                                  <div className="text-2xl">👆</div>
                                </Pointer>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-all hover:-translate-y-1">
                <FaInstagram size={20} />
                
              </a>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-all hover:-translate-y-1">
                <FaYoutube size={20} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 font-opensans">
              <a href="mailto:info@bharatham26.com" className="flex items-center justify-center md:justify-end gap-3 hover:text-yellow transition-colors">
                <Pointer>
                                  <div className="text-2xl">👆</div>
                                </Pointer>
                <span>info@bharatham26.com</span>
                <FaEnvelope />
              </a>
              <a href="tel:+911234567890" className="flex items-center justify-center md:justify-end gap-3 hover:text-yellow transition-colors">
                <Pointer>
                                  <div className="text-2xl">👆</div>
                                </Pointer>
                <span>+91 1234 567 890</span>
                <FaPhoneAlt />
              </a>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center">
          <p className="font-opensans text-xs opacity-60">
            © 2026 Bharatham. All rights reserved.
          </p>
        </div>
      </div>

      {/* MASSIVE BOTTOM TEXT */}
      <div className="w-full overflow-hidden leading-none mt-4 select-none pointer-events-none">
        {/* UPDATED FONT to Qawatone */}
        <h1 
          className="font-qawatone text-yellow font-bold whitespace-nowrap text-center"
          style={{
            fontSize: '15vw',
            lineHeight: '0.75',
            WebkitTextStroke: '2px rgba(255,255,255,0.1)',
            marginBottom: '-2vw'
          }}
        >
          BHARATHAM26
        </h1>
      </div>

    </footer>
  );
};

export default Footer;