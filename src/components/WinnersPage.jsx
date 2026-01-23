import React, { useState, useEffect } from 'react';
import { Pointer } from "./Pointer";
const HOUSE_COLORS = {
    Mughals: '#fc7010',
    Aryans: '#ffc615',
    Vikings: '#599226',
    Spartans: '#de3a36',
    Rajputs: '#6bbae4'
};

// Vertical Pattern Background Component
const VerticalPatternBackground = ({ children }) => (
    <div className="bg-orange-100 relative overflow-hidden min-h-screen">
        <div 
            className="absolute top-0 right-0 h-full w-1/5 bg-repeat-y opacity-50 hidden lg:block"
            style={{ backgroundImage: `url(/images/floral1.png)`, backgroundPosition: 'right', transform: 'rotateY(180deg)' }} 
        />
        <div 
            className="absolute top-0 left-0 h-full w-1/5 bg-repeat-y opacity-50 hidden lg:block"
            style={{ backgroundImage: `url(/images/floral3.png)`, backgroundPosition: 'left' }}
        />
        {children}
    </div>
);

// Winner Card Component - Exact same styling as original
const WinnerCard = ({ winner, totalPoints, rank, isFirst = false, showConfetti = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [borderLoaded, setBorderLoaded] = useState(false);
    const [crownLoaded, setCrownLoaded] = useState(false);

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
        <div className={`relative w-full mx-auto ${isFirst ? 'max-w-md' : 'max-w-xs'} py-8`}>
            {/* Confetti - only for first place */}
            {showConfetti && isFirst && (
                <>
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
                </>
            )}

            {/* Crown - only for first place */}
            {isFirst && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 animate-bounce-slow">
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
                        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse" />
                    </div>
                </div>
            )}

            {/* Main Card Container */}
            <div className="relative">
                <div 
                    className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-black shadow-2xl"
                    style={{ 
                        backgroundColor: bgColor,
                        maxWidth: isFirst ? '400px' : '320px',
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
                    <div className={`absolute top-0 left-0 ${isFirst ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-32 md:h-32'} z-30 -translate-x-7`}>
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
                    <div className={`absolute top-0 right-0 ${isFirst ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-32 md:h-32'} z-30 translate-x-7`}>
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
                                        id={`curve-${winner}-${rank}`}
                                        d="M 40 60 Q 150 20, 260 60"
                                        fill="transparent"
                                    />
                                    <filter id={`shadow-${winner}-${rank}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="5" dy="5" stdDeviation="1" floodColor="#cb1760" floodOpacity="1"/>
                                    </filter>
                                </defs>
                                <text 
                                    fill="#ffffff" 
                                    fontSize={isFirst ? "40" : "36"}
                                    fontWeight="900"
                                    fontFamily="'Alfa Slab One', sans-serif"
                                    letterSpacing="1.5"
                                    filter={`url(#shadow-${winner}-${rank})`}
                                >
                                    <textPath 
                                        href={`#curve-${winner}-${rank}`} 
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
                            <div className={`absolute ${isFirst ? 'w-72 h-72' : 'w-60 h-60'}`}>
                                <svg viewBox="0 0 200 200" className="w-full h-full">
                                    <defs>
                                        <linearGradient id={`arch-gradient-${winner}-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
                                            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 20 180 Q 20 30, 100 30 Q 180 30, 180 180 Z"
                                        fill={`url(#arch-gradient-${winner}-${rank})`}
                                        stroke="#D4A574"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>

                            {/* House Mascot */}
                            <div className="relative z-10 animate-float overflow-visible mt-20" 
                                style={{ 
                                    width: isFirst ? '550px' : '450px', 
                                    height: isFirst ? '550px' : '450px' 
                                }}>
                                <img
                                    src={`/images/${winner.toLowerCase()}_mascot2.png`}
                                    alt={`${winner} mascot`}
                                    className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{ transform: isFirst ? 'scale(1.5)' : 'scale(1.3)' }}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        console.error(`Failed to load ${winner.toLowerCase()}_mascot2.png`);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Rank Badge at Bottom */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
                            <div className="absolute inset-0 bg-black translate-y-1 rounded-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }} />
                            <div 
                                className="relative bg-stone-900 text-white px-16 py-6 rounded-lg border-2 border-stone-700 text-center"
                                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                            >
                                <div className={`${isFirst ? 'text-base' : 'text-sm'} font-mont font-semibold text-stone-400 tracking-wider`}>POINTS: {totalPoints}</div>
                                <div className={`${isFirst ? 'text-4xl' : 'text-3xl'} font-mont font-bold tracking-wide`}>RANK {rank}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Winners Page Component
const WinnersPage = () => {
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [winners, setWinners] = useState([]);
    const [showRank1, setShowRank1] = useState(false);
    const [showRank2, setShowRank2] = useState(false);
    const [showRank3, setShowRank3] = useState(false);

 useEffect(() => {
        // Get leaderboard data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const leaderboardParam = urlParams.get('data');
        
        let leaderboardData = [];
        
        if (leaderboardParam) {
            try {
                leaderboardData = JSON.parse(decodeURIComponent(leaderboardParam));
            } catch (e) {
                console.error('Error parsing leaderboard data:', e);
            }
        }
        
        // Sort and get top 3
        const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.points - a.points);
        const top3 = sortedLeaderboard.slice(0, 3).map((item, index) => ({
            house: item.name,
            points: item.points,
            rank: index + 1
        }));
        
        setWinners(top3);
        console.log('Winners loaded:', top3);
    }, []);

    const handleReveal = () => {
        setCurtainOpen(true);
        // Sequential reveal: Rank 1 → Rank 2 → Rank 3
        setTimeout(() => setShowRank1(true), 1500);
        setTimeout(() => setShowRank2(true), 3500);
        setTimeout(() => setShowRank3(true), 5500);
        setTimeout(() => setShowConfetti(true), 2000);
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <VerticalPatternBackground>
            <div className="relative z-10 font-['Montserrat'] text-stone-900 min-h-screen">
                {/* Go Back Button */}
                <div className="fixed top-4 right-0 z-[100] px-6 sm:px-10 md:px-12">
                     <Pointer>
                                        <div className="text-2xl">👆</div>
                                    </Pointer>
                    <button
                        onClick={goBack}
                        className="group relative select-none"
                        title="Go Back"
                    >
                        <div className="relative w-[120px] md:w-[140px] aspect-[169/58]">
                            <img 
                                src="/images/loginbtn.svg" 
                                alt="" 
                                className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%] transition-transform duration-200" 
                            />
                            <svg 
                                className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" 
                                viewBox="0 0 169 45"
                            >
                                <path 
                                    className="transition-colors duration-200 fill-[#FDFBF7] group-hover:fill-[#D97706]" 
                                    d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" 
                                    stroke="#271811" 
                                    strokeWidth="2" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
                                <span className="font-mont text-xs sm:text-sm md:text-lg font-bold tracking-wide text-black group-hover:text-black pointer-events-none">
                                    GO BACK
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 pt-10 pb-20">
                    {/* Header */}
                    <header className="text-center relative pt-10">
                        <div className="absolute left-0 right-1/2 top-[100px] border-t-2 border-black hidden md:block" style={{ marginRight: '300px' }}></div>
                        <div className="absolute left-1/2 right-0 top-[100px] border-t-2 border-black hidden md:block" style={{ marginLeft: '300px' }}></div>
                        <h1 className="text-5xl md:text-7xl font-black text-stone-900 inline-block p-2 relative z-10"
                            style={{ textShadow: '5px 5px 0px #FEE89B' }}
                        >
                            BHARATHAM'26 CHAMPIONS
                        </h1>
                    </header>

                    {/* Curtain Container */}
                    <div className="relative w-full flex items-center justify-center">
                        
                        {/* Reveal Button */}
                       {!curtainOpen && (
                        <div className="absolute top-1/2 left-1/2 
                        -translate-x-1/2 -translate-y-1/2 
                        z-[60] group flex flex-col items-center">

                            {/* Hover Emoji */}
                            <div className="
                            text-3xl 
                            opacity-0 
                            group-hover:opacity-100 
                            transition-opacity duration-300
                            animate-bounce
                            z-50
                            -mb-20
                            ">
                            👆
                            </div>

                            {/* Button */}
                            <button
                            onClick={handleReveal}
                            className="relative"
                            >
                            <div className="relative">
                                <div 
                                className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl" 
                                style={{ backgroundColor: '#000' }} 
                                />

                                <div 
                                className="relative px-12 py-6 rounded-2xl border-4 border-stone-900 
                                transform transition-all duration-300 
                                group-hover:translate-x-2 group-hover:translate-y-2 
                                group-hover:shadow-none shadow-lg" 
                                style={{ backgroundColor: '#cb1760' }}
                                >
                                <span className="text-3xl md:text-4xl font-mont font-semibold text-white tracking-wider">
                                    REVEAL WINNERS
                                </span>
                                </div>
                            </div>
                            </button>

                        </div>
                        )}



                        {/* Red Curtains */}
                        <div className="fixed inset-0 overflow-hidden z-50" style={{ pointerEvents: curtainOpen ? 'none' : 'auto' }}>
                            {/* Left Curtain */}
                            <div 
                                className={`absolute top-0 left-0 h-full w-1/2 border-r-8 border-yellow-600 shadow-2xl transition-transform duration-[2000ms] ease-in-out ${
                                    curtainOpen ? '-translate-x-full' : 'translate-x-0'
                                }`}
                                style={{
                                    backgroundColor: '#991b1b',
                                    backgroundImage: 'linear-gradient(to right, #7f1d1d, #991b1b, #b91c1c), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 40px)'
                                }}
                            >
                                <div className="absolute inset-0 opacity-30" 
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 50px, transparent 50px, transparent 90px)'
                                    }}
                                />
                            </div>

                            {/* Right Curtain */}
                            <div 
                                className={`absolute top-0 right-0 h-full w-1/2 border-l-8 border-yellow-600 shadow-2xl transition-transform duration-[2000ms] ease-in-out ${
                                    curtainOpen ? 'translate-x-full' : 'translate-x-0'
                                }`}
                                style={{
                                    backgroundColor: '#991b1b',
                                    backgroundImage: 'linear-gradient(to left, #7f1d1d, #991b1b, #b91c1c), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 40px)'
                                }}
                            >
                                <div className="absolute inset-0 opacity-30" 
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 50px, transparent 50px, transparent 90px)'
                                    }}
                                />
                            </div>

                            {/* Curtain Rod */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-700 to-yellow-900 border-y-4 border-yellow-600 shadow-lg z-10" />
                        </div>

                        {/* Winners Display */}
                        <div className={`relative w-full transition-opacity duration-1000 ${
                            curtainOpen ? 'opacity-100' : 'opacity-0'
                        }`}>
                            {winners.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 items-end justify-items-center max-w-6xl mx-auto px-4">
                                    {/* Rank 2 - Left, lower than 1st */}
                                    {winners[1] && (
                                    <div className={`w-full flex justify-center lg:mt-24 order-2 lg:order-1 transition-all duration-700 ${
                                        showRank2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}>
                                        <WinnerCard
                                        winner={winners[1].house}
                                        totalPoints={winners[1].points}
                                        rank={2}
                                        isFirst={false}
                                        showConfetti={false}
                                        />
                                    </div>
                                    )}

                                    {/* Rank 1 */}
                                    {winners[0] && (
                                    <div className={`w-full flex justify-center order-1 lg:order-2 transition-all duration-700 ${
                                        showRank1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}>
                                        <WinnerCard
                                        winner={winners[0].house}
                                        totalPoints={winners[0].points}
                                        rank={1}
                                        isFirst={true}
                                        showConfetti={showConfetti}
                                        />
                                    </div>
                                    )}

                                    {/* Rank 3 */}
                                    {winners[2] && (
                                    <div className={`w-full flex justify-center lg:mt-40 order-3 lg:order-3 transition-all duration-700 ${
                                        showRank3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}>
                                        <WinnerCard
                                        winner={winners[2].house}
                                        totalPoints={winners[2].points}
                                        rank={3}
                                        isFirst={false}
                                        showConfetti={false}
                                        />
                                    </div>
                                    )}

                                </div>
                            )}

                            {curtainOpen && (
                                <div className="text-center mt-5 animate-fade-in">
                                    <p className="text-2xl md:text-3xl text-stone-700 italic font-opensans">
                                        Victory through Unity, Excellence through Spirit
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
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
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
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
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
            `}</style>
        </VerticalPatternBackground>
    );
};

export default WinnersPage;