import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { 
  MdEmojiEvents, 
  MdGroups, 
  MdAppRegistration, 
  MdPerson,
  MdEvent,
  MdDashboard 
} from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import EventCardList from "./EventCardList";
import CaptainRegistrationTable from "../../components/registration/CaptainRegistrationTable";
import ParticipantTable from "../../components/participant/ParticipantTable";

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-l border-r border-b border-stone-200 flex items-center gap-5 hover:shadow-md transition-all hover:-translate-y-1"
       style={{borderTopColor: color.replace('bg-', '').replace('text-', '') === 'desi-saffron' ? '#D97706' : 
                               color.includes('teal') ? '#0F766E' : 
                               color.includes('indigo') ? '#4F46E5' : '#9F1239'}}> 
    <div className={`p-4 rounded-full ${color} text-white text-2xl shadow-md`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-black font-sans">{value}</h3>
    </div>
  </div>
);

const CaptainDashboard = () => {
  const [house, setHouse] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("events"); // <--- NEW: Tab State
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  const handleDeleteRegistration = (e) => {
    const id = e.currentTarget.id || e.target.id;
    if(!window.confirm("Are you sure you want to delete this registration?")) return;
    setLoading(true);
    axios.delete(`${apiUrl}/registration/${id}`)
      .then(() => {
        setRegistrations(old => old.filter(r => r._id !== id));
        enqueueSnackbar("Registration deleted successfully", { variant: "success" });
      })
      .catch((error) => {
        console.error("Error:", error);
        enqueueSnackbar("Error deleting registration", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated && !isLoading) return navigate("/");
      if (!user?.nickname) return;
      
      setLoading(true);
      try {
        const houseResponse = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const houseData = houseResponse.data.find(d => d.name !== "Admin");
        
        if (!houseData) {
          enqueueSnackbar("Invalid User / No House Assigned", { variant: "error" });
          navigate("/");
          return;
        }
        
        setHouse(houseData.name);
        
        const [partRes, eventRes, regRes] = await Promise.all([
           axios.get(`${apiUrl}/participant/by-house/${houseData.name}`),
           axios.get(`${apiUrl}/event/`),
           axios.get(`${apiUrl}/registration/by-house/${houseData.name}`)
        ]);

        setParticipants(partRes.data.data);
        setEvents(eventRes.data.data);
        setRegistrations(regRes.data.data);

      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Error loading data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, isLoading, user, navigate, enqueueSnackbar, apiUrl]);

  // Tab Configuration
  const tabs = [
    { id: "events", label: "Events Overview", icon: <MdEvent /> },
    { id: "registrations", label: "Registrations", icon: <MdAppRegistration /> },
    { id: "participants", label: "House Students", icon: <MdGroups /> },
  ];

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout 
      role="Captain" 
      title={`${house} House`} 
      subtitle="Registration closes Jan 4, 2026"
    >
      {/* 1. Stats Grid (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Events" value={events.length} icon={<MdEmojiEvents />} color="bg-amber-600" />
        <StatCard title="Registrations" value={registrations.length} icon={<MdAppRegistration />} color="bg-teal-700" />
        <StatCard title="House Strength" value={participants.length} icon={<MdGroups />} color="bg-indigo-600" />
        <StatCard title="Current Rank" value="#1" icon={<MdPerson />} color="bg-rose-700" />
      </div>

      {/* 2. Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 min-h-[600px]">
        
        <div className="px-6 pt-6 pb-0 border-b border-stone-200 bg-stone-50 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg text-sm font-bold transition-all relative top-[1px]
                ${activeTab === tab.id 
                  ? "bg-white text-desi-saffron border-t-2 border-l border-r border-stone-200 shadow-sm" 
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"}`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Tab Content */}
        <div className="p-6">
          
          {activeTab === "events" && (
            <div className="animate-fade-in-up">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-reality tracking-wide text-black">Available Events</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">LIVE REGISTRATION</span>
               </div>
               <EventCardList house={house} events={events} />
            </div>
          )}

          {activeTab === "registrations" && (
            <div className="animate-fade-in-up">
               <CaptainRegistrationTable
                  registrations={registrations}
                  handleDeleteRegistration={handleDeleteRegistration}
               />
            </div>
          )}

          {activeTab === "participants" && (
            <div className="animate-fade-in-up">
               <ParticipantTable participants={participants} />
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CaptainDashboard;

// import React, { useState, useEffect } from "react";
// import ParticipantTable from "../../components/participant/ParticipantTable";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import LogoutButton from "../LogoutButton";
// import Spinner from "../../components/Spinner";
// import EventCardList from "./EventCardList";
// import RegistrationTable from "../../components/registration/RegistrationTable";
// import CaptainRegistrationTable from "../../components/registration/CaptainRegistrationTable";

// const CaptainDashboard = () => {
//   const [house, setHouse] = useState("");
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [participants, setParticipants] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showType, setShowType] = useState("table");
//   const { enqueueSnackbar } = useSnackbar();

//   const navigate = useNavigate();

//   const handleDeleteRegistration = (e) => {
//     const id = e.target.id;
//     setLoading(true);

//     // First, get the registration data
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/registration/${id}`)
//       .then((response) => {
//         const registration = response.data;
//         if (!registration) {
//           throw new Error("No registration data received");
//         }

//         const participants = registration.participants;
//         const eventName = registration.event;

//         if (!participants || !eventName) {
//           throw new Error("Invalid registration data structure");
//         }

//         // Fetch event details
//         return axios
//           .get(`https://bharatham-backend-j9s1.onrender.com/event/`)
//           .then((eventResponse) => {
//             const event = eventResponse.data.data.find(
//               (e) => e.name === eventName
//             );
//             if (!event) {
//               throw new Error(`Event "${eventName}" not found`);
//             }
//             return { registration, event };
//           });
//       })
//       .then(({ registration, event }) => {
//         console.log("Registration data:", {
//           event: event.name,
//           category: event.category,
//           participation: event.participation,
//           participants: registration.participants.map((p) => p.fullName),
//         });

//         // Fetch latest participant data for all participants
//         return Promise.all(
//           registration.participants.map((participant) =>
//             axios
//               .get(
//                 `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`
//               )
//               .then((response) => response.data)
//           )
//         ).then((latestParticipants) => {
//           console.log(
//             "Latest participant data:",
//             latestParticipants.map((p) => ({
//               name: p.fullName,
//               individual: p.individual,
//               group: p.group,
//               literary: p.literary,
//             }))
//           );

//           // Create a copy of participants with latest data to update their counts
//           const updatedParticipants = latestParticipants.map((p) => ({
//             ...p,
//             individual: p.individual || 0,
//             group: p.group || 0,
//             literary: p.literary || 0,
//           }));

//           // Update participation counts
//           updatedParticipants.forEach((p) => {
//             console.log("Updating participant:", p.fullName);
//             console.log("Current counts:", {
//               individual: p.individual,
//               group: p.group,
//               literary: p.literary,
//             });

//             if (event.category !== "Non-Counting") {
//               if (event.participation === "Individual") {
//                 if (
//                   event.category === "Literary" &&
//                   (event.date !== "21-03-2025" &&
//                     event.date !== "22-03-2025" &&
//                     event.date !== "20-03-2025")
//                 ) {
//                   p.literary = Math.max(0, p.literary - 1);
//                   console.log("Updated literary count:", p.literary);
//                 } else if (
//                   event.category != "Deco" &&
//                   event.category != "Open Stage" &&
//                   event.category != "Media"
//                 ) {
//                   p.individual = Math.max(0, p.individual - 1);
//                   console.log("Updated individual count:", p.individual);
//                 }
//               } else if (event.participation === "Group") {
//                 if (
//                   event.category === "Literary" &&
//                   (event.date !== "21-03-2025" &&
//                     event.date !== "22-03-2025" &&
//                     event.date !== "20-03-2025")
//                 ) {
//                   p.literary = Math.max(0, p.literary - 1);
//                   console.log("Updated literary count:", p.literary);
//                 } else if (
//                   event.category != "Deco" &&
//                   event.category != "Open Stage" &&
//                   event.category != "Media"
//                 ) {
//                   p.group = Math.max(0, p.group - 1);
//                   console.log("Updated group count:", p.group);
//                 }
//               }
//             }
//           });

//           console.log(
//             "Final updated participants:",
//             updatedParticipants.map((p) => ({
//               name: p.fullName,
//               individual: p.individual,
//               group: p.group,
//               literary: p.literary,
//             }))
//           );

//           // Update all participants with new counts
//           return Promise.all(
//             updatedParticipants.map((participant) =>
//               axios
//                 .put(
//                   `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`,
//                   participant
//                 )
//                 .then((response) => {
//                   console.log("Updated participant in database:", {
//                     name: response.data.fullName,
//                     individual: response.data.individual,
//                     group: response.data.group,
//                     literary: response.data.literary,
//                   });
//                   return response;
//                 })
//             )
//           );
//         });
//       })
//       .then(() => {
//         // After participants are updated, delete the registration
//         return axios.delete(
//           `https://bharatham-backend-j9s1.onrender.com/registration/${id}`
//         );
//       })
//       .then(() => {
//         setRegistrations((old) => old.filter((r) => r._id !== id));
//         enqueueSnackbar(
//           "Registration deleted and participant data updated successfully!",
//           {
//             variant: "success",
//           }
//         );
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error in delete process:", error);
//         setLoading(false);
//         enqueueSnackbar(
//           error.response?.data?.message || "Error processing deletion!",
//           { variant: "error" }
//         );
//       });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       let house = "";
//       try {
//         console.log("Starting data fetch...");
//         console.log("Auth state:", {
//           isAuthenticated,
//           isLoading,
//           user: user?.nickname,
//         });

//         if (!isAuthenticated && !isLoading) {
//           console.log("Not authenticated, redirecting to home...");
//           navigate("/");
//           return;
//         }

//         console.log("Fetching house data for captain:", user.nickname);
//         const houseResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/house/by-captain/${user.nickname}`
//         );
//         console.log("House response:", houseResponse.data);

//         if (houseResponse.data) {
//           const filteredHouses = houseResponse.data.filter(
//             (d) => d.name != "Admin"
//           );
//           console.log("Filtered houses:", filteredHouses);

//           if (filteredHouses.length > 0) {
//             house = filteredHouses[0].name;
//             console.log("Selected house:", house);
//           } else {
//             console.log("No valid house found for captain");
//             enqueueSnackbar("Invalid User", {
//               variant: "error",
//             });
//             navigate("/");
//             return;
//           }
//         } else {
//           console.log("No house data received");
//           enqueueSnackbar("Invalid User", {
//             variant: "error",
//           });
//           navigate("/");
//           return;
//         }

//         console.log("Fetching participant data for house:", house);
//         const participantResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/participant/by-house/${house}`
//         );
//         console.log(
//           "Participant data received:",
//           participantResponse.data.data.length,
//           "participants"
//         );
//         const participants = participantResponse.data.data;

//         console.log("Fetching all events...");
//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/`
//         );
//         console.log(
//           "Events data received:",
//           eventResponse.data.data.length,
//           "events"
//         );
//         const events = eventResponse.data.data;

//         console.log("Fetching registrations for house:", house);
//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-house/${house}`
//         );
//         console.log(
//           "Registrations data received:",
//           registrationResponse.data.data.length,
//           "registrations"
//         );
//         const registrations = registrationResponse.data.data;

//         console.log("Setting state with fetched data...");
//         setHouse(house);
//         setParticipants(participants);
//         setEvents(events);
//         setRegistrations(registrations);
//         console.log("Data fetch completed successfully");
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         console.error("Error details:", {
//           message: error.message,
//           response: error.response?.data,
//           status: error.response?.status,
//         });
//         enqueueSnackbar("Error loading data", { variant: "error" });
//       } finally {
//         console.log("Setting loading state to false");
//         setLoading(false);
//       }
//     };

//     if (user) {
//       console.log("User detected, initiating data fetch...");
//       fetchData();
//     } else {
//       console.log("No user detected, skipping data fetch");
//     }
//   }, [user]);

//   return (
//     <div className="main-container">
//       <div>
//         <h1>Captain Dashboard</h1>
//         <p>{user?.name}</p>
//       </div>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <>
//           <LogoutButton />
//           <h3>Events</h3>
//           <EventCardList house={house} events={events} />
//           <CaptainRegistrationTable
//             registrations={registrations}
//             handleDeleteRegistration={handleDeleteRegistration}
//           />
//           <ParticipantTable participants={participants} />
//         </>
//       )}
//     </div>
//   );
// };

// export default CaptainDashboard;
