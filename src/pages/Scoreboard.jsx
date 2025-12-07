import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdEmojiEvents, MdMenu, MdHome, MdLogin } from "react-icons/md";

// Components
import Spinner from "../components/Spinner";
import ScoreboardChart from "../components/ScoreboardChart";
import ScoreTable from "../components/score/ScoreTable";
import NegativeScoreTable from "../components/score/NegativeScoreTable";

const Scoreboard = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const scoreResponse = await axios.get(`${apiUrl}/score/`);
        const fetchedScores = scoreResponse.data.data;
        setScores(fetchedScores);

        // Calculate Totals
        const houseTotals = {
            "Spartans": 0, "Mughals": 0, "Vikings": 0, "Rajputs": 0, "Aryans": 0
        };

        fetchedScores.forEach(s => {
            if (houseTotals[s.house] !== undefined) {
                houseTotals[s.house] += s.points;
            }
        });

        // Convert to Array for Chart
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-900"><Spinner /></div>;

  const leadingHouse = leaderboard.length > 0 ? leaderboard[0] : { name: "TBD", points: 0 };

  return (
    <div className="min-h-screen bg-stone-900 text-white font-sans selection:bg-desi-saffron selection:text-white">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-stone-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-reality text-desi-saffron tracking-wider">BHARATHAM</h1>
        </div>
        <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MdHome size={24} className="text-stone-400 hover:text-white" />
            </button>
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect()} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-desi-saffron rounded-full text-sm font-bold transition-all">
                    <MdLogin /> Login
                </button>
            )}
            {isAuthenticated && (
                <button onClick={() => navigate('/captain')} className="flex items-center gap-2 px-4 py-2 bg-desi-saffron text-white rounded-full text-sm font-bold hover:bg-amber-600 transition-all">
                    Dashboard
                </button>
            )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section: Leader */}
        <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-desi-saffron/20 border border-desi-saffron/50 text-desi-saffron font-bold uppercase text-xs tracking-widest">
                <MdEmojiEvents /> Live Standings
            </div>
            <h1 className="text-5xl md:text-7xl font-reality text-white">
                {leadingHouse.name} <span className="text-stone-600">Leads</span>
            </h1>
            <p className="text-stone-400 text-lg">With a total of <span className="text-white font-bold">{leadingHouse.points} Points</span></p>
        </div>

        {/* Chart Section */}
        <div className="bg-stone-800 p-6 md:p-10 rounded-2xl shadow-2xl border border-white/5">
            <div className="h-[300px] md:h-[400px] w-full">
                <ScoreboardChart scores={leaderboard} />
            </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Scores */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                <div className="bg-stone-100 px-6 py-4 border-b border-stone-200">
                    <h3 className="text-stone-800 font-bold text-lg">Recent Victories</h3>
                </div>
                <div className="p-2">
                    <ScoreTable scores={scores} />
                </div>
            </div>

            {/* Penalties */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                    <h3 className="text-red-800 font-bold text-lg">Penalty Log</h3>
                </div>
                <div className="p-2">
                    <NegativeScoreTable scores={scores} />
                </div>
            </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-stone-600 text-sm border-t border-white/5 mt-12">
        <p>© 2026 Bharatham • RSET</p>
      </footer>

    </div>
  );
};

export default Scoreboard;

// import React from "react";
// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Chart from "chart.js/auto";
// import { MdInfo, MdMenu } from "react-icons/md";

// import ScoreTable from "../components/score/ScoreTable";

// import ChartDataLabels from "chartjs-plugin-datalabels";
// import NegativeScoreTable from "../components/score/NegativeScoreTable";
// import Navigation from "../components/Navigation";

// const Scoreboard = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [scores, setScores] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showMenu, setShowMenu] = useState(true);
//   const navigate = useNavigate();

//   const [ranking, setRanking] = useState({
//     labels: ["Spartans", "Mughals", "Vikings", "Rajputs", "Aryans"],
//     datasets: [
//       {
//         label: "Scoreboard",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: [
//           "rgba(236,129,121,0.8)",
//           "rgba(252,155,9,0.8)",
//           "rgba(95,213,170,0.8)",
//           "rgba(83,199,223,0.8)",
//           "rgba(255,216,76,0.8)",
//         ],
//         borderColor: [
//           "rgba(236,129,121,1)",
//           "rgba(252,155,9,1)",
//           "rgba(95,213,170,1)",
//           "rgba(83,199,223,1)",
//           "rgba(255,216,76,1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   });

//   useEffect(() => {
//     // console.log(user, isAuthenticated, isLoading);

//     const fetchData = async () => {
//       try {
//         const scoreResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/score/`
//         );
//         const scores = scoreResponse.data.data;

//         setScores(scores);
//         console.log(scores);

//         scores.forEach((score) => {
//           if (score.house == "Mughals")
//             ranking.datasets[0].data[1] += score.points;
//           else if (score.house == "Spartans")
//             ranking.datasets[0].data[0] += score.points;
//           else if (score.house == "Vikings")
//             ranking.datasets[0].data[2] += score.points;
//           else if (score.house == "Rajputs")
//             ranking.datasets[0].data[3] += score.points;
//           else if (score.house == "Aryans")
//             ranking.datasets[0].data[4] += score.points;
//         });

//         const ctx = document
//           .getElementById("scoreboard-chart")
//           .getContext("2d");

//         Chart.defaults.color = "#FFF";

//         Chart.register(ChartDataLabels);
//         const scoreboardChart = new Chart(ctx, {
//           type: "bar",
//           data: ranking,
//           options: {
//             scales: {
//               yAxes: [
//                 {
//                   ticks: {
//                     beginAtZero: true,
//                   },
//                 },
//               ],
//             },
//             plugins: {
//               legend: {
//                 display: false,
//               },
//               datalabels: {
//                 // Position of the labels
//                 // (start, end, center, etc.)
//                 anchor: "center",
//                 // Alignment of the labels
//                 // (start, end, center, etc.)
//                 align: "end",
//                 // Color of the labels
//                 color: "white",
//                 font: {
//                   weight: "bold",
//                 },
//                 formatter: function (value, context) {
//                   // Display the actual data value
//                   return value;
//                 },
//               },
//             },
//           },
//         });
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleMenu = () => {
//     console.log("Menu clicked", showMenu);
//     setShowMenu((old) => !old);
//   };

//   return (
//     <div className="scoreboard_page">
//       {window.innerWidth < 750 && (
//         <motion.button
//           className="btn-burger"
//           onClick={handleMenu}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <MdMenu size={20} />
//         </motion.button>
//       )}
//       {!(window.innerWidth < 750 && showMenu) && (
//         <Navigation showMenu={showMenu} />
//       )}

//       <section id="home">
//         <h1>scoreboard</h1>
//         <div className="scoreboard">
//           <canvas id="scoreboard-chart"></canvas>
//         </div>

//         <ScoreTable scores={scores} />
//         <NegativeScoreTable scores={scores} />
//       </section>
//     </div>
//   );
// };

// export default Scoreboard;
