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
  <div className="bg-white p-6 font-qawatone rounded-lg shadow-sm border-t-4 border-l border-r border-b border-stone-200 flex items-center gap-5 hover:shadow-md transition-all hover:-translate-y-1"
       style={{borderTopColor: color.replace('bg-', '').replace('text-', '') === 'desi-saffron' ? '#D97706' : 
                               color.includes('teal') ? '#0F766E' : 
                               color.includes('indigo') ? '#4F46E5' : '#9F1239'}}> 
    <div className={`p-4 rounded-full ${color} text-white text-2xl shadow-md`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-stone-500 font-qawatone uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-qawatone text-black">{value}</h3>
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
      subtitle="Pre-Events Edit Option Enabled"
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
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg text-sm font-qawatone transition-all relative top-[1px]
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
                  <h3 className="text-3xl font-qawatone tracking-wide text-black">Available Events</h3>
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

