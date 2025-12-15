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
import Footer from "../components/Footer";

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
                <div className="fixed top-4 right-0 z-[60] px-6 sm:px-10 md:px-12">
          <button
              onClick={() => navigate(-1)}
              className="group relative cursor-pointer select-none"
              title="Go Back"
          >
              {/* SVG Button Container */}
              <div className="relative w-[120px] md:w-[140px] aspect-[169/58]">
                  
                  {/* Shadow/Base Image */}
                  <img 
                      src="/images/loginbtn.svg" 
                      alt="" 
                      className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%] transition-transform duration-200" 
                  />
                  
                  {/* Main SVG Shape */}
                  <svg 
                      className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" 
                      viewBox="0 0 169 45"
                  >
                      {/* Path: Fill with white, hover fill with yellow */}
                      <path 
                          className="transition-colors duration-200 fill-[#FDFBF7] group-hover:fill-[#D97706]" 
                          d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" 
                          stroke="#271811" 
                          strokeWidth="2" 
                      />
                  </svg>
                  
                  {/* Text Label */}
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
                      <span className="font-mont text-xs sm:text-sm md:text-lg font-bold tracking-wide text-black group-hover:text-black pointer-events-none">
                          GO BACK
                      </span>
                  </div>
              </div>
          </button>
      </div>

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
                
            </div>
             <Footer />
        </VerticalPatternBackground>
    );
};

export default Scoreboard;