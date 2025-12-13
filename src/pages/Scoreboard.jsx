import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdHome, MdLogin, MdEmojiEvents } from "react-icons/md";

// Components
import Spinner from "../components/Spinner";
import ScoreboardChart from "../components/ScoreboardChart";
import ScoreTable from "../components/ScoreTable";
import NegativeScoreTable from "../components/NegativeScoreTable";
import Nav from "../components/Navbar";

// Decorative Image Component
const DecorativeImage = ({ src, className, alt = "Decorative pattern" }) => (
    <img className={className} src={src} alt={alt} />
);

// Utility component for the repeating vertical floral images (Figma elements at 1094px and 345px)
// We use a responsive background image style to mimic the tiling effect for a clean responsive layout.
const VerticalPatternBackground = ({ children }) => (
    <div className="bg-orange-100 relative overflow-hidden">
        {/* Floral Pattern Image (Placeholder for the repeating vertical floral pattern) */}
        {/* We use specific image placeholders here to represent the large, repeating vertical patterns. */}
        <div 
            className="absolute top-0 right-0 h-full w-1/5 bg-repeat-y opacity-50 hidden lg:block"
            style={{ backgroundImage: `url(/images/floral1.png)`, backgroundPosition: 'right', transform: 'rotateY(180deg)'  }} 
        />
        <div 
            className="absolute top-0 left-0 h-full w-1/5 bg-repeat-y opacity-50 hidden lg:block"
            style={{ backgroundImage: `url(/images/floral3.png)`, backgroundPosition: 'left'}}
        />
        {children}
    </div>
);


const Scoreboard = () => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

    // Data fetching logic remains unchanged
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const scoreResponse = await axios.get(`${apiUrl}/score/`);
                const fetchedScores = scoreResponse.data.data;
                setScores(fetchedScores);

                const houseTotals = {
                    "Spartans": 0, "Mughals": 0, "Vikings": 0, "Rajputs": 0, "Aryans": 0
                };

                fetchedScores.forEach(s => {
                    if (houseTotals[s.house] !== undefined) {
                        houseTotals[s.house] += s.points;
                    }
                });

                const rankingArray = Object.keys(houseTotals).map(house => ({
                    name: house,
                    points: houseTotals[house]
                })).sort((a, b) => b.points - a.points);

                setLeaderboard(rankingArray);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-orange-100"><Spinner /></div>;

    // Filter scores for positive and negative tables (Logic remains unchanged)
    const positiveScores = scores.filter(s => s.points > 0);
    const negativeScores = scores.filter(s => s.points < 0);

    return (
        <VerticalPatternBackground>
            {/* Main responsive container with cream background and Montserrat font */}
            <div className="min-h-screen relative overflow-x-hidden font-['Montserrat'] text-stone-900">
                
                
                
                {/* --- Navbar (Retained for functionality) --- */}
                <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b-2 border-black/10">
                    <Nav/>
                </nav>

                {/* --- Main Content Area (Responsive) --- */}
                <main className="max-w-7xl mx-auto px-4 py-10 space-y-20">

                    {/* Header/Title Section (Centered) */}
                    <header className="text-center relative pt-10 pb-5">
                        <div className="absolute left-0 right-1/2 top-[100px] border-t-2 border-black hidden md:block" style={{ marginRight: '240px' }}></div>
                        <div className="absolute left-1/2 right-0 top-[100px] border-t-2 border-black hidden md:block" style={{ marginLeft: '240px' }}></div>

                        <h1 className="text-5xl md:text-7xl font-black text-stone-900 inline-block p-2 relative z-10"
                            style={{ textShadow: '5px 5px 0px #FEE89B' }}
                        >
                            Scoreboard
                        </h1>
                    </header>

                    {/* --- 1. Leaderboard Chart Section --- */}
                    <section className="mx-auto w-full max-w-4xl relative">
                        {/* Background Shadow */}
                        <div className="w-full h-full absolute bg-stone-900 translate-x-3 translate-y-3" />
                        
                        {/* Main White Bordered Container */}
                        <div className="w-full bg-white border-4 border-stone-900 relative p-4 h-[600px] md:h-[700px]">
                            <h2 className="text-3xl font-extrabold text-stone-900 text-center mb-6 border-b-2 border-stone-200 pb-3">
                                <MdEmojiEvents className="inline text-desi-saffron" size={32}/> House Standings
                            </h2>
                            <div className="w-full h-[85%]">
                                <ScoreboardChart scores={leaderboard} />
                            </div>
                        </div>
                    </section>

                    {/* --- 2. Positive Scores Section --- */}
                    <section className="pt-8 space-y-6">
                        <div className="text-center relative pt-10 pb-5">
                            {/* Title with Scrollwork Decoration */}
                            <div className="text-4xl font-extrabold text-stone-900 inline-block p-2">
                                <div className="absolute left-0 right-1/2 top-[100px] border-t-2 border-black hidden md:block" style={{ marginRight: '240px' }}></div>
                        <div className="absolute left-1/2 right-0 top-[100px] border-t-2 border-black hidden md:block" style={{ marginLeft: '240px' }}></div>

                        <h1 className="text-5xl md:text-7xl font-black text-stone-900 inline-block p-2 relative z-10"
                            style={{ textShadow: '5px 5px 0px #FEE89B' }}
                        >
                            Scores
                        </h1>
                            </div>
                        </div>
                        
                        {/* Table Container */}
                        <div className="w-full mx-auto relative">
                            {/* Background Shadow */}
                            <div className="w-full h-full absolute bg-stone-900 translate-x-2 translate-y-2" />
                            
                            {/* Main White Bordered Table */}
                            <div className="w-full bg-white border-[3px] border-stone-900 relative overflow-hidden">
                                <ScoreTable scores={positiveScores} />
                            </div>
                        </div>
                    </section>

                    {/* --- 3. Negative Scores Section --- */}
                    <section className="pt-8 space-y-6">
                        <div className="text-center relative pt-10 pb-5">
                            {/* Title with Scrollwork Decoration */}
                            <div className="text-4xl font-extrabold text-stone-900 inline-block p-2">
                                <div className="absolute left-0 right-1/2 top-[100px] border-t-2 border-black hidden md:block" style={{ marginRight: '240px' }}></div>
                        <div className="absolute left-1/2 right-0 top-[100px] border-t-2 border-black hidden md:block" style={{ marginLeft: '240px' }}></div>

                        <h1 className="text-5xl md:text-7xl font-black text-stone-900 inline-block p-2 relative z-10"
                            style={{ textShadow: '5px 5px 0px #FEE89B' }}
                        >
                            Negative Scores
                        </h1>
                            </div>
                        </div>
                        
                        {/* Table Container */}
                        <div className="w-full mx-auto relative">
                            {/* Background Shadow */}
                            <div className="w-full h-full absolute bg-stone-900 translate-x-2 translate-y-2" />
                            
                            {/* Main White Bordered Table */}
                            <div className="w-full bg-white border-[3px] border-stone-900 relative overflow-hidden">
                                <NegativeScoreTable scores={negativeScores} />
                            </div>
                        </div>

                        {/* 3. floral3.png and 4. floral4.png: Placed decoratively below tables */}
                    </section>

                </main>

                {/* --- Footer (Using 'footer.png' placeholder for the scrollwork) --- */}
                <footer className="py-8 text-center text-stone-600 text-sm mt-12">
    <div className="w-full max-w-4xl mx-auto flex justify-center items-center">
        {/* Horizontal line (Left) */}
        {/* <div className="flex-grow border-t-2 border-stone-400 mx-4"></div> */}
        
        {/* Decorative Footer Scrollwork (5th PNG image) */}
        <DecorativeImage 
            src="/images/footer.png" 
            // Increased size to w-48 (as done previously)
            // Added transform class to move it slightly above the horizontal line
            className="w-48 h-50 transform -translate-y-16 relative z-10"
            alt="Decorative Footer Scrollwork"
        />

        {/* Horizontal line (Right) */}
        {/* <div className="flex-grow border-t-2 border-stone-400 mx-4"></div> */}
    </div>
    <p className="mt-4">© 2026 Bharatham • RSET</p>
</footer>
                
            </div>
        </VerticalPatternBackground>
    );
};

export default Scoreboard;