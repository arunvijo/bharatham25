import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { MdMenu, MdSearch, MdEvent, MdLogin, MdHome } from "react-icons/md";
import { motion } from "framer-motion";

// Components
import Spinner from "../components/Spinner";
import Navigation from "../components/Navigation";

const Events = () => {
  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventResponse = await axios.get(`${apiUrl}/event/`);
        setEvents(eventResponse.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.venue.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase())
  );

  const filters = [
    "All", "Onstage", "Offstage", "Pre Event", 
    "Individual", "Group", 
    "Literary", "Music", "Dance", "Theatre", "Media"
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-900"><Spinner /></div>;

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
            {isAuthenticated && (
                <button onClick={() => navigate('/captain')} className="flex items-center gap-2 px-4 py-2 bg-desi-saffron text-white rounded-full text-sm font-bold hover:bg-amber-600 transition-all">
                    Dashboard
                </button>
            )}
        </div>
      </nav>

      <motion.main 
        className="max-w-7xl mx-auto px-4 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-reality text-white mb-4">Explore Events</h1>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
                Discover the diverse competitions at Bharatham 2026. From classical dance to battle of bands, find your stage.
            </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f === "All" ? "" : f)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                        (filter === f || (f === "All" && filter === ""))
                            ? "bg-desi-saffron text-white border-desi-saffron shadow-lg shadow-orange-900/50"
                            : "bg-stone-800 text-stone-400 border-stone-700 hover:border-desi-saffron hover:text-white"
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((e) => (
                    <Link
                        key={e._id}
                        to={`/event/${e._id}`}
                        className="group relative bg-stone-800 rounded-xl overflow-hidden border border-stone-700 hover:border-desi-saffron transition-all hover:-translate-y-2 hover:shadow-2xl"
                    >
                        {/* Image */}
                        <div className="h-48 w-full bg-stone-700 overflow-hidden relative">
                            {e.image ? (
                                <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600">
                                    <MdEvent className="text-6xl opacity-20" />
                                </div>
                            )}
                            
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded shadow-md ${
                                    e.registrationEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {e.registrationEnabled ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white font-reality tracking-wide mb-1 group-hover:text-desi-saffron transition-colors">
                                {e.name}
                            </h3>
                            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-3">
                                {e.category} • {e.participation}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-stone-500 border-t border-stone-700 pt-3">
                                <span>{e.venue || "TBD"}</span>
                                <span className="text-desi-saffron font-bold group-hover:translate-x-1 transition-transform">View →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-stone-500">
                <MdSearch className="text-6xl mx-auto mb-4 opacity-20" />
                <p className="text-xl">No events found matching "{filter}"</p>
                <button 
                    onClick={() => setFilter("")} 
                    className="mt-4 text-desi-saffron hover:underline font-medium"
                >
                    Clear Filters
                </button>
            </div>
        )}

      </motion.main>

      {/* Footer */}
      <footer className="py-12 bg-stone-950 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-3 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Replace with your actual Logo */}
            <div className="w-8 h-8 bg-desi-saffron rounded-full"></div> 
            <span className="text-xl font-reality text-white">BHARATHAM 2026</span>
        </div>
        <p className="text-stone-500 text-sm">Rajagiri School of Engineering & Technology</p>
        <p className="text-stone-600 text-xs mt-2">© 2026 • Made with Saffron & Code</p>
      </footer>

    </div>
  );
};

export default Events;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import LogoutButton from "./LogoutButton";
// import LoginButton from "./LoginButton";
// import axios from "axios";
// import { MdInfo, MdMenu } from "react-icons/md";
// import { motion } from "framer-motion";
// import Navigation from "../components/Navigation";

// const Events = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [events, setEvents] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showMenu, setShowMenu] = useState(true);
//   const navigate = useNavigate();

//   const filteredEvents = events.filter(
//     (event) =>
//       event.name.toLowerCase().includes(filter.toLowerCase()) ||
//       event.venue.toLowerCase().includes(filter.toLowerCase()) ||
//       event.type.toLowerCase().includes(filter.toLowerCase()) ||
//       event.participation.toLowerCase().includes(filter.toLowerCase()) ||
//       event.category.toLowerCase().includes(filter.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const eventResponse = await axios.get(
//           "https://bharatham-backend-j9s1.onrender.com/event/"
//         );
//         const events = eventResponse.data.data;
//         console.log(eventResponse.data.data);
//         setEvents(events);
//       } catch (error) {
//         console.error(error);
//         // Handle errors here (e.g., display error message)
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []); // Only re-run on changes to isAuthenticated

//   const handleMenu = () => {
//     console.log("Menu clicked", showMenu);
//     setShowMenu((old) => !old);
//   };

//   return (
//     <div className="events_page">
//       {/* <img
//         className="image-bg"
//         src="https://firebasestorage.googleapis.com/v0/b/bharatham-8f3b2.appspot.com/o/wave-bg.png?alt=media&token=20d0fef8-3cef-485e-a65d-8047b1b77006"
//       /> */}
      
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
//       {!(window.innerWidth < 750 && showMenu) && <Navigation showMenu={showMenu} />}

//       <motion.section
//         className="landing"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <h1>Events</h1>

//         <div className="button-container">
//           <div className="button-row">
//             <button className="btn-outline" onClick={(e) => setFilter("")}>
//               All
//             </button>
//             <button
//               className="btn-outline"
//               onClick={(e) => setFilter("onstage")}
//             >
//               Onstage
//             </button>
//             <button
//               className="btn-outline"
//               onClick={(e) => setFilter("offstage")}
//             >
//               Offstage
//             </button>
//             <button
//               className="btn-outline"
//               onClick={(e) => setFilter("pre event")}
//             >
//               Pre Event
//             </button>
//             <button
//               className="btn-outline"
//               onClick={(e) => setFilter("individual")}
//             >
//               Individual
//             </button>
//             <button className="btn-outline" onClick={(e) => setFilter("Group")}>
//               Group
//             </button>
//             <button
//               className="btn-outline"
//               onClick={(e) => setFilter("Literary")}
//             >
//               Literary
//             </button>
//             <button className="btn-outline" onClick={(e) => setFilter("Music")}>
//               Music
//             </button>
//             <button className="btn-outline" onClick={(e) => setFilter("Dance")}>
//               Dance
//             </button>
//             <button className="btn-outline" onClick={(e) => setFilter("Theatre")}>
//               Theatre
//             </button>
//             <button className="btn-outline" onClick={(e) => setFilter("Theatre")}>
//               Media
//             </button>
//           </div>
//         </div>

//         <div className="container" style={{ marginInline: "0" }}>
//           {filteredEvents?.map((e) => (
//             <Link
//               className="box"
//               to={`/event/${e._id}`}
//               style={{ backgroundImage: `url(${e.image})` }}
//             >
//               <div className="content">
//                 <p>{e.name}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </motion.section>

//       <section className="contact">
//         <div className="container">
//           <div>
//             <img src="./images/logo.png" alt="logo" />
//           </div>
//           <div>
//             <h1>Contact Us</h1>
//             <p>rajagiribharatham23@gmail.com</p>
//             <p>20, 21, 22 March 2025</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Events;
