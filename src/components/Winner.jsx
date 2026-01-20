import React, { useState, useEffect } from 'react';

const HOUSE_COLORS = {
    Mughals: '#E89A4A',
    Aryans: '#F4D03F',
    Vikings: '#52B768',
    Spartans: '#E74C3C',
    Rajputs: '#5DADE2'
};

const Bharatham26Winner = ({ winner = 'Mughals', totalPoints = 3000, rank = 1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [borderLoaded, setBorderLoaded] = useState(false);
    const [crownLoaded, setCrownLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const bgColor = HOUSE_COLORS[winner] || HOUSE_COLORS.Mughals;

    return (
        <div className="relative w-full mx-auto max-w-2xl py-16 px-4">
            {/* Crown - Animated */}
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-50'
            }`}>
                <div className="relative w-24 h-24 animate-bounce-slow">
                    <img
                        src="/images/crown.png"
                        alt="Crown"
                        className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                            crownLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setCrownLoaded(true)}
                        onError={(e) => {
                            console.error('Failed to load crown.png');
                            e.target.style.display = 'none';
                        }}
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse" />
                </div>
            </div>

            {/* Main Card Container */}
            <div className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'
            }`}>
                {/* Main Card */}
                <div 
                    className="relative w-full aspect-[3/4] rounded-3xl overflow-visible border-4 border-black shadow-2xl"
                    style={{ 
                        backgroundColor: bgColor,
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}
                >
                    {/* Decorative Border Frame Overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <img
                            src={`/images/${winner.toLowerCase()}_border.png`}
                            alt="Border decoration"
                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                                borderLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setBorderLoaded(true)}
                            onError={(e) => {
                                console.error(`Failed to load ${winner.toLowerCase()}_border.png`);
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Top Left Corner Decoration */}
                    <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 z-30 -translate-x-6 -translate-y-3">
                        <img
                            src="/images/left.png"
                            alt="Left corner decoration"
                            className="w-full h-full object-contain transition-opacity duration-500 opacity-100"
                            onError={(e) => {
                                console.error('Failed to load left.png');
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Top Right Corner Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 z-30 translate-x-6 -translate-y-3">
                        <img
                            src="/images/right.png"
                            alt="Right corner decoration"
                            className="w-full h-full object-contain transition-opacity duration-500 opacity-100"
                            onError={(e) => {
                                console.error('Failed to load right.png');
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Bottom Decoration */}
                    <div className="absolute bottom-0 left-0 right-0 w-full h-20 md:h-24 z-20">
                        <img
                            src="/images/bottom.png"
                            alt="Bottom decoration"
                            className="w-full h-full object-cover transition-opacity duration-500 opacity-100"
                            onError={(e) => {
                                console.error('Failed to load bottom.png');
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-8">
                        {/* Curved House Name at Top */}
                        <div className="w-full h-20">
                            <svg viewBox="0 0 300 80" className="w-full h-full">
                                <defs>
                                    <path
                                        id={`curve-${winner}`}
                                        d="M 40 60 Q 150 20, 260 60"
                                        fill="transparent"
                                    />
                                </defs>
                                <text 
                                    fill="#1C1917" 
                                    fontSize="44" 
                                    fontWeight="900"
                                    fontFamily="Montserrat, sans-serif"
                                    letterSpacing="2"
                                >
                                    <textPath 
                                        href={`#curve-${winner}`} 
                                        startOffset="50%" 
                                        textAnchor="middle"
                                    >
                                        {winner.toUpperCase()}
                                    </textPath>
                                </text>
                            </svg>
                        </div>

                        {/* Arch Background for Mascot */}
                        <div className="relative w-full flex-1 flex items-start justify-center pt-4">
                            {/* Decorative Arch */}
                            <div className="absolute w-56 h-56 top-8">
                                <svg viewBox="0 0 200 200" className="w-full h-full">
                                    <defs>
                                        <linearGradient id={`arch-gradient-${winner}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
                                            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 20 180 Q 20 30, 100 30 Q 180 30, 180 180 Z"
                                        fill={`url(#arch-gradient-${winner})`}
                                        stroke="#D4A574"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>

                            {/* House Mascot */}
                            <div className="relative z-10 w-64 h-64 animate-float mt-4" style={{ marginLeft: '20px' }}>
                                <img
                                    src={`/images/${winner.toLowerCase()}_mascot.png`}
                                    alt={`${winner} mascot`}
                                    className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        console.error(`Failed to load ${winner.toLowerCase()}_mascot.png`);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>

                            {/* Decorative Side Leaves */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
                                <svg width="40" height="80" viewBox="0 0 40 80">
                                    <path d="M10 10 Q20 20 10 30 Q0 40 10 50 Q20 60 10 70" fill="none" stroke="#D4A574" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 scale-x-[-1]">
                                <svg width="40" height="80" viewBox="0 0 40 80">
                                    <path d="M10 10 Q20 20 10 30 Q0 40 10 50 Q20 60 10 70" fill="none" stroke="#D4A574" strokeWidth="2"/>
                                </svg>
                            </div>
                        </div>

                        {/* Rank Badge at Bottom */}
                        <div className="relative mt-auto mb-6 z-50">
                            {/* Badge Shadow */}
                            <div className="absolute inset-0 bg-black translate-y-1 rounded-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }} />
                            
                            {/* Badge */}
                            <div 
                                className="relative bg-stone-900 text-white px-12 py-5 rounded-lg border-2 border-stone-700"
                                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                            >
                                <div className="text-sm font-semibold text-stone-400 tracking-wider">POINTS: {totalPoints}</div>
                                <div className="text-3xl font-black tracking-wide">RANK: {rank}</div>
                            </div>
                        </div>

                        {/* Bottom Decorative Flower Pattern */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-40">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: '#D4A574',
                                        transform: `scale(${0.7 + Math.random() * 0.6})`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Winner Announcement Text */}
            <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-3 font-['Montserrat']"
                    style={{ textShadow: '3px 3px 0px #FEE89B' }}
                >
                    🎉 BHARATHAM'26 CHAMPIONS 🎉
                </h2>
                <p className="text-xl md:text-2xl text-stone-700 italic font-semibold">
                    Victory through Unity, Excellence through Spirit
                </p>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Bharatham26Winner;