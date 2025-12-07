import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaCalendarAlt,
  FaUsers,
  FaTrophy,
  FaMapMarkerAlt,
  FaBars,
  FaInfoCircle
} from "react-icons/fa";
import { MdHome, MdLogin, MdArrowBack, MdEvent } from "react-icons/md";

// Components
import Spinner from "../components/Spinner";

// Images (Ensure these are in public/images)
const houseImages = {
  "Aryans": "/images/aryans.png",
  "Mughals": "/images/mughals.png",
  "Rajputs": "/images/rajput.png",
  "Spartans": "/images/spartans.png",
  "Vikings": "/images/vikings.png"
};

const EventPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [event, setEvent] = useState();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Event Details
        const eventResponse = await axios.get(`${apiUrl}/event/${id}`);
        setEvent(eventResponse.data);

        // Fetch Registrations (To see who is participating)
        // Note: Public users might only need to see WHICH houses are participating, not individual student names
        const registrationResponse = await axios.get(`${apiUrl}/registration/by-event/${id}`);
        setRegistrations(registrationResponse.data.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, apiUrl]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-900"><Spinner /></div>;

  // Get unique participating houses
  const participatingHouses = [...new Set(registrations.map(r => r.house))];

  return (
    <div className="min-h-screen bg-stone-900 text-white font-sans selection:bg-desi-saffron selection:text-white">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-stone-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-reality text-desi-saffron tracking-wider cursor-pointer" onClick={() => navigate('/')}>BHARATHAM</h1>
        </div>
        <div className="flex gap-4">
            <button onClick={() => navigate('/events')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white" title="Back to Events">
                <MdArrowBack size={24} />
            </button>
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white" title="Home">
                <MdHome size={24} />
            </button>
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect()} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-desi-saffron rounded-full text-sm font-bold transition-all">
                    <MdLogin /> Login
                </button>
            )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Hero Section */}
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
        >
            <div className="inline-block p-4 rounded-full bg-stone-800 border border-stone-700 mb-2">
                <MdEvent className="text-4xl text-desi-saffron" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-reality text-white tracking-wide">
                {event?.name}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-lg font-medium text-stone-300">
                <span className="flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full border border-stone-700">
                    <FaMapMarkerAlt className="text-desi-saffron" /> {event?.venue || "TBD"}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full border border-stone-700">
                    <FaCalendarAlt className="text-desi-saffron" /> {event?.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}
                </span>
            </div>
        </motion.section>

        {/* Details Grid */}
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {/* Info Cards */}
            <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 flex flex-col items-center text-center hover:border-desi-saffron transition-colors">
                <FaUsers className="text-3xl text-desi-saffron mb-3" />
                <h3 className="text-stone-400 uppercase text-xs font-bold tracking-widest mb-1">Participation</h3>
                <p className="text-xl font-bold text-white">{event?.participation}</p>
            </div>
            
            <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 flex flex-col items-center text-center hover:border-desi-saffron transition-colors">
                <FaTrophy className="text-3xl text-desi-saffron mb-3" />
                <h3 className="text-stone-400 uppercase text-xs font-bold tracking-widest mb-1">Category</h3>
                <p className="text-xl font-bold text-white">{event?.category}</p>
            </div>

            <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 flex flex-col items-center text-center hover:border-desi-saffron transition-colors">
                <FaInfoCircle className="text-3xl text-desi-saffron mb-3" />
                <h3 className="text-stone-400 uppercase text-xs font-bold tracking-widest mb-1">Type</h3>
                <p className="text-xl font-bold text-white">{event?.type}</p>
            </div>
        </motion.section>

        {/* Participating Houses */}
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-stone-700 flex-1"></div>
                <h2 className="text-2xl font-reality text-stone-300 tracking-wider">PARTICIPATING HOUSES</h2>
                <div className="h-px bg-stone-700 flex-1"></div>
            </div>

            {participatingHouses.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-8">
                    {participatingHouses.map(house => (
                        <div key={house} className="group flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full bg-stone-800 border-2 border-stone-700 p-4 flex items-center justify-center group-hover:border-desi-saffron group-hover:scale-110 transition-all shadow-lg">
                                <img 
                                    src={houseImages[house]} 
                                    alt={house} 
                                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                                />
                            </div>
                            <span className="text-stone-400 font-bold uppercase tracking-wider text-sm group-hover:text-desi-saffron transition-colors">{house}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-stone-500 italic">
                    <p>Registration hasn't started yet for this event.</p>
                </div>
            )}
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-stone-950 text-center border-t border-white/5 mt-12">
        <div className="flex flex-col items-center gap-4">
            <img src="/images/logo.png" alt="logo" className="w-16 h-16 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <div>
                <h3 className="text-white font-reality tracking-wide text-xl">BHARATHAM 2026</h3>
                <p className="text-stone-500 text-sm mt-1">Rajagiri School of Engineering & Technology</p>
            </div>
            <div className="text-stone-600 text-xs mt-4 flex flex-col gap-1">
                <p>X9V5+96P, Rajagiri Valley, Kakkanad, Kerala 682039</p>
                <p>20th - 22nd March 2025</p>
            </div>
        </div>
      </footer>

    </div>
  );
};

export default EventPage;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";
// import Navigation from "../components/Navigation";
// import {
//   FaCalendarAlt,
//   FaUsers,
//   FaTrophy,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// const EventPage = () => {
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showMenu, setShowMenu] = useState(true);
//   const { id } = useParams();
//   const [event, setEvent] = useState();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/${id}`
//         );
//         const event = eventResponse.data;

//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-event/${id}/`
//         );
//         const registrations = registrationResponse.data.data;

//         setEvent(eventResponse.data);
//         setRegistrations(registrations);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleMenu = () => {
//     setShowMenu((old) => !old);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="event-page">
//       {window.innerWidth < 750 && (
//         <motion.button
//           className="btn-burger"
//           onClick={handleMenu}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <FaBars size={20} />
//         </motion.button>
//       )}
//       {!(window.innerWidth < 750 && showMenu) && (
//         <Navigation showMenu={showMenu} />
//       )}

//       <motion.section
//         className="event-header"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="event-header-content">
//           <h1>{event?.name}</h1>
//           <div className="event-venue">
//             <FaMapMarkerAlt className="venue-icon" />
//             <h2>{event?.venue}</h2>
//           </div>
//         </div>
//       </motion.section>

//       <motion.section
//         className="event-details"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <div className="event-tags">
//           <div className="event-tag">
//             <FaUsers className="tag-icon" />
//             <span>{event?.participation}</span>
//           </div>
//           <div className="event-tag">
//             <FaTrophy className="tag-icon" />
//             <span>{event?.type}</span>
//           </div>
//           <div className="event-tag">
//             <FaCalendarAlt className="tag-icon" />
//             <span>{event?.category}</span>
//           </div>
//         </div>

//         <div className="event-houses">
//           <h2>Participating Houses</h2>
//           <div className="house-grid">
//             <div className="house-card">
//               <img src="/images/aryans.png" alt="Aryans" />
//               <span>Aryans</span>
//             </div>
//             <div className="house-card">
//               <img src="/images/mughals.png" alt="Mughals" />
//               <span>Mughals</span>
//             </div>
//             <div className="house-card">
//               <img src="/images/rajput.png" alt="Rajputs" />
//               <span>Rajputs</span>
//             </div>
//             <div className="house-card">
//               <img src="/images/spartans.png" alt="Spartans" />
//               <span>Spartans</span>
//             </div>
//             <div className="house-card">
//               <img src="/images/vikings.png" alt="Vikings" />
//               <span>Vikings</span>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       <section className="contact">
//         <div className="container">
//           <div>
//             <img src="/images/logo.png" alt="logo" />
//           </div>
//           <div>
//             <h1>Contact Us</h1>
//             <p>
//               X9V5+96P, Rajagiri Valley Rd, Rajagiri Valley, Kakkanad, Kerala
//               682039
//             </p>
//             <p>20th, 21st, 22nd March 2025</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EventPage;
