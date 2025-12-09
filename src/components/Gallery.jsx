import React from 'react';

const Gallery = () => {
  // Helper function to get proper image URLs
  const getImagePath = (filename) => {
    // This creates absolute URLs that bypass React Router
    return `${window.location.origin}/images/gallery/${filename}`;
  };
  
  const row1Images = [
    getImagePath('1.jpg'),
    getImagePath('2.jpg'),
    getImagePath('3.JPG'),
    getImagePath('4.JPG'),
    getImagePath('5.JPG'),
  ];

  const row2Images = [
    getImagePath('6.JPG'),
    getImagePath('7.JPG'),
    getImagePath('8.JPG'),
    getImagePath('9.jpg'),
    getImagePath('10.JPG'),
  ];

  const row3Images = [
    getImagePath('11.JPG'),
    getImagePath('12.JPG'),
    getImagePath('13.JPG'),
    getImagePath('14.JPG'),
    getImagePath('15.JPG'),
  ];

  const MarqueeRow = ({ images, direction = 'right' }) => {
    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];
    
    return (
      <div className="overflow-hidden py-2">
        <div
          className={`flex gap-6 ${
            direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'
          }`}
          style={{
            width: 'max-content',
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
        
        {/* Row 3 - Moving Right */}
        <MarqueeRow images={row3Images} direction="right" />
      </div>

      <style jsx>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }

        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Gallery;