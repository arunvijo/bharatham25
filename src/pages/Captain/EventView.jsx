import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { MdOutlineDelete, MdEvent, MdGroup, MdInfo, MdPersonAdd, MdSave, MdArrowBack } from "react-icons/md";

// Modern Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import CaptainRegistrationTable from "../../components/registration/CaptainRegistrationTable";
import SearchableDropdown from "../../components/SearchableDropdown";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton"; 

const EventView = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [registrations, setRegistrations] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [house, setHouse] = useState("");
  const [event, setEvent] = useState(null);
  const [participantData, setParticipantData] = useState("");
  const [participantList, setParticipantList] = useState([]);
  const [participants, setParticipants] = useState([]);
  
  // NEW: States for specific event rules
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");

  // DEADLINES (Manual 2026)
  const PRE_EVENT_DEADLINE = new Date("2026-01-04T23:59:59");
  const MAIN_EVENT_DEADLINE = new Date("2026-01-24T23:59:59");
  const now = new Date();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Use Env Variable for API URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";
  
  // FIX: Added Extempore and Recitation so the language dropdown shows for them
  const literaryEvents = ["Essay Writing", "Short Story", "Poetry", "Extempore", "Recitation"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.nickname) return;

        // 1. Get House
        const houseResponse = await axios.get(
          `${apiUrl}/house/by-captain/${user.nickname}`
        );
        const houseData = houseResponse.data.find(d => d.name !== "Admin");
        if (!houseData) {
            enqueueSnackbar("Captain house not found", { variant: "error" });
            return;
        }
        setHouse(houseData.name);

        // 2. Get Participants
        const participantResponse = await axios.get(
          `${apiUrl}/participant/by-house/${houseData.name}`
        );
        setParticipantList(participantResponse.data.data);

        // 3. Get Event Details
        const eventResponse = await axios.get(`${apiUrl}/event/${id}`);
        const eventData = eventResponse.data;
        setEvent(eventData);

        // 4. Get Existing Registrations
        const registrationResponse = await axios.get(
          `${apiUrl}/registration/by-house-event/${id}/${houseData.name}`
        );
        setRegistrations(registrationResponse.data.data);

        // 5. Check Active Status with Category-Based Deadline Enforcement
        const isPreEvent = eventData.category === "Pre-Event" || eventData.isPreEvent === true;
        const deadlineToUse = isPreEvent ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
        
        const isRegistrationOpen = eventData.registrationEnabled || eventData.date === "TBD";
        const withinDeadline = now < deadlineToUse;
        
        setActive(isRegistrationOpen && withinDeadline);

      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading event data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, user, id, apiUrl]);

  const handleAddParticipants = () => {
    if (participantData) {
      // Check if already added
      if (participants.some((p) => p.uid === participantData)) {
        enqueueSnackbar("Participant already added", { variant: "warning" });
        return;
      }

      // Check Limits (Frontend Check)
      const maxLimit = event.maxTeamSize || event.maxIndividualLimit || 1;
      if (participants.length >= maxLimit) {
        enqueueSnackbar(`Maximum limit of ${maxLimit} participants reached`, { variant: "error" });
        return;
      }

      // Validate Literary Events (Language Required)
      if (literaryEvents.includes(event.name) && !selectedLanguage) {
        enqueueSnackbar("Please select a language for this participant", { variant: "warning" });
        return;
      }

      // Validate Open Mic (Act Type Required)
      if (event.name === "Open Mic" && !performanceType) {
        enqueueSnackbar("Please enter the act type", { variant: "warning" });
        return;
      }

      // Add to list
      const pObj = participantList.find((p) => p.uid === participantData);
      if (pObj) {
        const newParticipant = {
          ...pObj,
          language: selectedLanguage || null,
          performanceType: performanceType || null
        };
        setParticipants((old) => [...old, newParticipant]);
        
        // Reset inputs
        setParticipantData("");
        setSelectedLanguage("");
        setPerformanceType("");
      }
    }
  };

  const handleDeleteParticipants = (uid) => {
    setParticipants(participants.filter((p) => p.uid !== uid));
  };

  const handleSaveRegistration = () => {
    if (participants.length === 0) {
      enqueueSnackbar("No participant selected", { variant: "error" });
      return;
    }

    // 1. Check Min Participants
    const minLimit = event.minTeamSize || event.minIndividualLimit || 1;
    if (participants.length < minLimit) {
      enqueueSnackbar(`Minimum ${minLimit} participants required`, { variant: "error" });
      return;
    }

    // 2. Check House Registration Limit
    const houseLimit = event.maxRegistrations || event.teamLimit || 1;
    if (registrations.length >= houseLimit) {
      enqueueSnackbar(`Registration limit reached for ${house}`, { variant: "error" });
      return;
    }

    // 3. Language Diversity Rule (At least 2 languages for Literary Events)
    if (literaryEvents.includes(event.name) && participants.length > 1) {
      const languages = new Set(participants.map(p => p.language).filter(l => l));
      if (languages.size < 2) {
        enqueueSnackbar("Participants must represent at least 2 different languages.", { variant: "error" });
        return;
      }
    }

    const data = {
      event: event.name,
      house,
      participants,
    };

    setLoading(true);
    // 4. Send to Backend
    axios
      .post(`${apiUrl}/registration/`, data)
      .then((response) => {
        setLoading(false);
        setRegistrations((old) => [...old, response.data]);
        enqueueSnackbar("Registration Created successfully", { variant: "success" });
        setParticipants([]);
        setParticipantData("");
      })
      .catch((error) => {
        setLoading(false);
        const msg = error.response?.data?.message || "Error creating registration!";
        enqueueSnackbar(msg, { variant: "error" });
      });
  };

  const handleDeleteRegistration = (e) => {
    const regId = e.currentTarget.id || e.target.id;
    if(!window.confirm("Are you sure you want to delete this registration?")) return;

    setLoading(true);
    axios
      .delete(`${apiUrl}/registration/${regId}`)
      .then(() => {
        setRegistrations((old) => old.filter((r) => r._id !== regId));
        enqueueSnackbar("Registration deleted successfully", { variant: "success" });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.response?.data?.message || "Error processing deletion!", { variant: "error" });
      });
  };

  if (loading || !event) return <div className="h-screen w-full flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper variables
  const isLiterary = literaryEvents.includes(event.name);
  const isOpenMic = event.name === "Open Mic";
  const maxLimit = event.maxTeamSize || event.maxIndividualLimit || 1;
  const houseLimit = event.maxRegistrations || event.teamLimit || 1;
  
  // Logic: Only show the 'New Entry' form if the house limit isn't reached AND the deadline hasn't passed
  const canRegisterNew = registrations.length < houseLimit && active;

  return (
    <DashboardLayout
      role="Captain"
      title="Event Details"
      subtitle={`Managing: ${event.name}`}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Event Header Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-desi-saffron p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black font-reality tracking-wide flex items-center gap-2">
              <MdEvent className="text-desi-saffron" />
              {event.name}
            </h1>
            <div className="flex gap-3 mt-2 text-sm font-medium text-stone-500 uppercase tracking-wider">
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.category}</span>
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.type}</span>
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.participation}</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-right">
             <div className="text-center px-4 py-2 bg-orange-50 rounded-lg border border-orange-100">
                <span className="block text-xs text-orange-600 font-bold uppercase">House Limit</span>
                <span className="text-xl font-bold text-stone-800">{registrations.length} <span className="text-stone-400 text-sm">/ {houseLimit}</span></span>
             </div>
             <div className="text-center px-4 py-2 bg-teal-50 rounded-lg border border-teal-100">
                <span className="block text-xs text-teal-600 font-bold uppercase">Team Size</span>
                <span className="text-xl font-bold text-stone-800">{event.minTeamSize || event.minIndividualLimit} - {maxLimit}</span>
             </div>
          </div>
        </div>

        {/* 2. Existing Registrations Table - Always visible for Editing/Deleting (until global deadline) */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-stone-800">Current Registrations</h3>
            { (event.category === "Pre-Event" && now > PRE_EVENT_DEADLINE) && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase">
                    New Entries Locked (Jan 4)
                </span>
            )}
          </div>
          <div className="p-0">
            <CaptainRegistrationTable
                registrations={registrations}
                admin={true} // This hides the redundant circular button
                handleDeleteRegistration={handleDeleteRegistration}
            />
          </div>
        </div>
        
        {/* 3. New Registration Form - Hidden if deadline passed or limit reached */}
        {canRegisterNew ? (
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-desi-teal animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
              <MdPersonAdd className="text-desi-teal text-2xl" />
              <h3 className="text-xl font-bold text-stone-800">New Registration Entry</h3>
            </div>

            {/* Team Preview */}
            <div className="mb-6">
                {participants.length > 0 ? (
                    <div className="flex flex-wrap gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                    {participants.map((p) => (
                        <div key={p.uid} className="flex items-center gap-3 bg-white border border-stone-200 px-3 py-2 rounded-full shadow-sm group">
                            <div className="flex flex-col leading-tight">
                                <span className="font-bold text-stone-800 text-sm">{p.fullName}</span>
                                <span className="text-[10px] text-stone-500 font-mono">
                                    {p.uid} 
                                    {p.language && <span className="text-orange-600 font-bold ml-1">• {p.language}</span>}
                                    {p.performanceType && <span className="text-purple-600 font-bold ml-1">• {p.performanceType}</span>}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleDeleteParticipants(p.uid)}
                                className="text-stone-300 hover:text-red-600 transition-colors"
                            >
                                <MdOutlineDelete size={18} />
                            </button>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-stone-400 italic text-sm text-center py-4">No participants added to this entry yet.</p>
                )}
            </div>

            {/* Add Participant Controls */}
            {participants.length < maxLimit && (
              <div className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-4 rounded-lg border border-stone-200">
                
                <div className="flex-1 w-full">
                  <SearchableDropdown
                    options={participantList}
                    label="Search Student"
                    id="participant"
                    selectedVal={participantData}
                    handleChange={(val) => setParticipantData(val)}
                  />
                </div>

                {isLiterary && (
                  <div className="w-full md:w-48">
                     <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Language</label>
                     <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none text-sm"
                     >
                        <option value="">Select</option>
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Hindi">Hindi</option>
                     </select>
                  </div>
                )}

                {isOpenMic && (
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Act Type</label>
                    <input 
                      type="text"
                      placeholder="e.g. Standup"
                      value={performanceType}
                      onChange={(e) => setPerformanceType(e.target.value)}
                      className="w-full p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none text-sm"
                    />
                  </div>
                )}

                <button
                  className="w-full md:w-auto px-6 py-3 bg-desi-teal text-white font-bold rounded-lg shadow hover:bg-teal-800 active:scale-95 transition-all"
                  onClick={handleAddParticipants}
                >
                  + Add
                </button>
              </div>
            )}
            
            <div className="flex justify-end mt-6 pt-4 border-t border-stone-100">
                <button 
                    onClick={handleSaveRegistration}
                    disabled={participants.length === 0}
                    className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                    <MdSave className="text-xl" />
                    Confirm Registration
                </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg flex items-start gap-4">
             <MdInfo className="text-amber-500 text-2xl mt-0.5" />
             <div>
                <h3 className="text-amber-800 font-bold text-lg">Registration Limited</h3>
                <p className="text-amber-600 text-sm mt-1">
                    {registrations.length >= houseLimit 
                        ? `Your house has reached the maximum limit of ${houseLimit} registration(s) for this event.`
                        : `New registrations for Pre-Events closed on Jan 4th. You may still view or edit existing registrations above.`}
                </p>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventView;