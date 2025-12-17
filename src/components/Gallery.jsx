import React from 'react';

const Gallery = () => {
  // Helper function to get proper image URLs
  const getImagePath = (filename) => {
    // This creates absolute URLs that bypass React Router
    return `${window.location.origin}/images/gallery/${filename}`;
  };
  
  const row1Images = [
    getImagePath('1.webp'),
    getImagePath('2.webp'),
    getImagePath('3.webp'),
    getImagePath('4.webp'),
    getImagePath('5.webp'),
  ];

  const row2Images = [
    getImagePath('6.webp'),
    getImagePath('7.webp'),
    getImagePath('8.webp'),
    getImagePath('9.webp'),
    getImagePath('10.webp'),
  ];

  const MarqueeRow = ({ images, direction = 'right' }) => {
    // Duplicate images multiple times for truly seamless loop
    const duplicatedImages = [...images, ...images, ...images];
    
    return (
      <div className="overflow-hidden py-2">
        <div
          className={`flex gap-6 ${
            direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'
          }`}
          style={{
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {duplicatedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Gallery image ${index + 1}`}
              className="
                h-80 
                w-auto 
                object-cover 
                shadow-lg
                border-[2px] 
                border-yellow
              "
              loading="lazy"
              onLoad={(e) => {
                console.log(`✓ Loaded: ${img}`);
              }}
              onError={(e) => {
                console.error(`✗ Failed to load: ${img}`);
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="256"%3E%3Crect fill="%23cccccc" width="400" height="256"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999999" text-anchor="middle" dy=".3em"%3EImage failed%3C/text%3E%3C/svg%3E';
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative bg-primary py-20 overflow-hidden">
      {/* Marquee Rows */}
      <div className="space-y-4">
        {/* Row 1 - Moving Right */}
        <MarqueeRow images={row1Images} direction="right" />
        
        {/* Row 2 - Moving Left */}
        <MarqueeRow images={row2Images} direction="left" />
      </div>

      <style jsx>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes marquee-left {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }

        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }

        /* Prevent animation glitches */
        .animate-marquee-right,
        .animate-marquee-left {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default Gallery;