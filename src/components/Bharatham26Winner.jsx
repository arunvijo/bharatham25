import React, { useState, useEffect } from 'react';

const HOUSE_COLORS = {
    Mughals: '#fc7010',
    Aryans: '#ffc615',
    Vikings: '#599226',
    Spartans: '#de3a36',
    Rajputs: '#6bbae4'
};

const Bharatham26Winner = ({ winner = 'Mughals', totalPoints = 3000, rank = 1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [borderLoaded, setBorderLoaded] = useState(false);
    const [crownLoaded, setCrownLoaded] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        setTimeout(() => setShowConfetti(true), 800);
    }, []);

    const bgColor = HOUSE_COLORS[winner] || HOUSE_COLORS.Mughals;

    
    const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const leftConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        x: Math.random() * 100,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8
    }));

    const rightConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i + 30,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        x: Math.random() * 100,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8
    }));

    return (
        <div className="relative w-full mx-auto max-w-2xl py-16 px-4">
            {/* Left Confetti */}
            {showConfetti && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-96 overflow-visible pointer-events-none z-40">
                    {leftConfetti.map((confetti) => (
                        <div
                            key={confetti.id}
                            className="absolute animate-confetti-left"
                            style={{
                                left: '0',
                                top: `${confetti.x}%`,
                                width: `${confetti.size}px`,
                                height: `${confetti.size}px`,
                                backgroundColor: confetti.color,
                                animationDelay: `${confetti.delay}s`,
                                animationDuration: `${confetti.duration}s`,
                                transform: `rotate(${confetti.rotation}deg)`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Right Confetti */}
            {showConfetti && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-96 overflow-visible pointer-events-none z-40">
                    {rightConfetti.map((confetti) => (
                        <div
                            key={confetti.id}
                            className="absolute animate-confetti-right"
                            style={{
                                right: '0',
                                top: `${confetti.x}%`,
                                width: `${confetti.size}px`,
                                height: `${confetti.size}px`,
                                backgroundColor: confetti.color,
                                animationDelay: `${confetti.delay}s`,
                                animationDuration: `${confetti.duration}s`,
                                transform: `rotate(${confetti.rotation}deg)`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>
            )}

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
                    className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-black shadow-2xl"
                    style={{ 
                        backgroundColor: bgColor,
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}
                >
                    {/* Noise Pattern Overlay */}
                    <div 
                        className="absolute inset-0 z-5 pointer-events-none opacity-40"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '400px 400px',
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Decorative Border Frame Overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-visible">
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
                    <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 z-30 -translate-x-7">
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
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 z-30 translate-x-7">
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

                    {/* Content Container */}
                    <div className="relative z-10 w-full h-full p-8">
                        {/* Curved House Name at Top */}
                        <div className="w-full h-20">
                            <svg viewBox="0 0 300 80" className="w-full h-full">
                                <defs>
                                    <path
                                        id={`curve-${winner}`}
                                        d="M 40 60 Q 150 20, 260 60"
                                        fill="transparent"
                                    />
                                    <filter id={`shadow-${winner}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#cb1760" floodOpacity="1"/>
                                    </filter>
                                </defs>
                                <text 
                                    fill="#ffffff" 
                                    fontSize="40" 
                                    fontWeight="900"
                                    fontFamily="'Alfa Slab One', sans-serif"
                                    letterSpacing="1"
                                    filter={`url(#shadow-${winner})`}
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
                        <div className="relative w-full flex items-center justify-center" style={{ height: 'calc(100% - 180px)' }}>
                            {/* Decorative Arch */}
                            <div className="absolute w-72 h-72">
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
                            <div className="relative z-10 animate-float overflow-visible mt-20" style={{ width: '550px', height: '550px' }}>
                                <img
                                    src={`/images/${winner.toLowerCase()}_mascot2.png`}
                                    alt={`${winner} mascot`}
                                    className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{ transform: 'scale(1.5)' }}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        console.error(`Failed to load ${winner.toLowerCase()}_mascot.png`);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Rank Badge at Bottom - Absolutely Positioned */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
                            {/* Badge Shadow */}
                            <div className="absolute inset-0 bg-black translate-y-1 rounded-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }} />
                            
                            {/* Badge */}
                            <div 
                                className="relative bg-stone-900 text-white px-16 py-6 rounded-lg border-2 border-stone-700 text-center"
                                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                            >
                                <div className="text-base font-semibold text-stone-400 tracking-wider">POINTS: {totalPoints}</div>
                                <div className="text-4xl font-black tracking-wide">RANK {rank}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Winner Announcement Text */}
            <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <h2 className="text-5xl md:text-6xl font-black text-stone-900 mb-3"
                    style={{ textShadow: '3px 3px 0px #FEE89B' }}
                >
                 BHARATHAM'26 CHAMPIONS
                </h2>
                <p className="text-xl md:text-2xl text-stone-700 italic font-opensans text-black">
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
                @keyframes confetti-left {
                    0% {
                        transform: translateX(0) translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(200px) translateY(400px) rotate(720deg);
                        opacity: 0;
                    }
                }
                @keyframes confetti-right {
                    0% {
                        transform: translateX(0) translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-200px) translateY(400px) rotate(-720deg);
                        opacity: 0;
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-confetti-left {
                    animation: confetti-left forwards;
                }
                .animate-confetti-right {
                    animation: confetti-right forwards;
                }
            `}</style>
        </div>
    );
};

export default Bharatham26Winner;
