import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { 
  MdOutlineDelete, 
  MdEvent, 
  MdGroup, 
  MdInfo, 
  MdPersonAdd, 
  MdSave, 
  MdArrowBack,
  MdCategory,
  MdLayers,
  MdPeople
} from "react-icons/md";

// Modern Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import CaptainRegistrationTable from "../../components/registration/CaptainRegistrationTable";
import SearchableDropdown from "../../components/SearchableDropdown";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

const EventView = () => {
  // --- AUTH & ROUTING ---
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // --- STATE MANAGEMENT ---
  const [registrations, setRegistrations] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [house, setHouse] = useState("");
  const [event, setEvent] = useState(null);
  const [participantData, setParticipantData] = useState("");
  const [participantList, setParticipantList] = useState([]);
  const [participants, setParticipants] = useState([]);
  
  // Rule-Specific States
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");

  // --- CONSTANTS & MANUAL RULES ---
  const PRE_EVENT_DEADLINE = new Date("2026-01-04T23:59:59");
  const MAIN_EVENT_DEADLINE = new Date("2026-01-19T12:00:00");
  const now = new Date();

  const literaryEvents = ["Essay Writing", "Short Story", "Poetry", "Extempore", "Recitation"];
  const houseRegistrationEvents = [
  "Photography", 
  "Graffiti", 
  "Vogue",               // Matches database "Vogue"
  "Short Film", 
  "Making of Bharatham", 
  "Adzap",               // Matches database "Adzap"
  "Patriotic Song"       // Added based on your previous request
];

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.nickname) return;
      
      try {
        setLoading(true);

        // 1. Get House Details for Captain
        const houseResponse = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const houseData = houseResponse.data.find(d => d.name !== "Admin");
        
        if (!houseData) {
          enqueueSnackbar("Captain house not found", { variant: "error" });
          navigate("/captain");
          return;
        }
        setHouse(houseData.name);

        // 2. Load Participants for this House
        const participantResponse = await axios.get(`${apiUrl}/participant/by-house/${houseData.name}`);
        setParticipantList(participantResponse.data.data || []);

        // 3. Load Event Configuration
        const eventResponse = await axios.get(`${apiUrl}/event/${id}`);
        const eventData = eventResponse.data;
        setEvent(eventData);

        // 4. Load House's Existing Registrations for this specific Event
        const registrationResponse = await axios.get(
          `${apiUrl}/registration/by-house-event/${id}/${houseData.name}`
        );
        setRegistrations(registrationResponse.data.data || []);

        // 5. Calculate Deadline & Active Status
        const isPreEvent = eventData.category === "Pre-Event" || eventData.isPreEvent === true;
        const isTurnAround = eventData.name === "Turn Around";

        // Logic Exception: Turn Around stays open until Main Event Deadline
        const deadlineToUse = (isPreEvent && !isTurnAround) ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
        
        const isRegistrationOpen = eventData.registrationEnabled !== false;
        const isWithinDeadline = now < deadlineToUse;

        setActive(isRegistrationOpen && isWithinDeadline);

      } catch (error) {
        console.error("Fetch Error:", error);
        enqueueSnackbar("Failed to sync with server", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, id, apiUrl, navigate]);

  // --- HANDLERS ---

  const handleAddParticipants = () => {
    if (!participantData) return;

    // Duplication Check
    if (participants.some((p) => p.uid === participantData)) {
      enqueueSnackbar("Participant already added to this entry", { variant: "warning" });
      return;
    }

    // Capacity Check
    const maxLimit = event.maxTeamSize || event.maxIndividualLimit || 1;
    if (participants.length >= maxLimit) {
      enqueueSnackbar(`This event allows a maximum of ${maxLimit} participants`, { variant: "error" });
      return;
    }

    // Literary Language Check
    if (literaryEvents.includes(event.name) && !selectedLanguage) {
      enqueueSnackbar("Please select a language for this student", { variant: "warning" });
      return;
    }

    // Open Mic Performance Check
    if (event.name === "Open Mic" && !performanceType) {
      enqueueSnackbar("Please specify the act type for Open Mic", { variant: "warning" });
      return;
    }

    const pObj = participantList.find((p) => p.uid === participantData);
    if (pObj) {
      setParticipants((old) => [
        ...old, 
        { 
          ...pObj, 
          language: selectedLanguage || null, 
          performanceType: performanceType || null 
        }
      ]);
      
      // Clear Input fields
      setParticipantData("");
      setSelectedLanguage("");
      setPerformanceType("");
    }
  };

  const handleAddHouseEntry = () => {
    const houseEntry = {
      uid: `HOUSE_${house.toUpperCase().replace(/\s/g, "_")}`,
      fullName: `${house} House Team`,
      house: house,
      isHouseEntry: true
    };
    setParticipants([houseEntry]);
    enqueueSnackbar(`${house} House Team selected for entry`, { variant: "info" });
  };

  const handleSaveRegistration = async () => {
    if (participants.length === 0) {
      enqueueSnackbar("Please add at least one participant", { variant: "error" });
      return;
    }

    // Validate Minimum Requirement
    const minLimit = event.minTeamSize || event.minIndividualLimit || 1;
    const isHouseEntry = participants.some(p => p.isHouseEntry);
    
    if (!isHouseEntry && participants.length < minLimit) {
      enqueueSnackbar(`Minimum ${minLimit} participant(s) required for this event`, { variant: "error" });
      return;
    }

    // Literary Language Diversity Check (Mandatory for group literary items)
    if (literaryEvents.includes(event.name) && participants.length > 1) {
      const languages = new Set(participants.map(p => p.language).filter(l => l));
      if (languages.size < 2) {
        enqueueSnackbar("Participants must represent at least 2 different languages", { variant: "error" });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        event: event.name,
        house: house,
        participants: participants
      };

      const response = await axios.post(`${apiUrl}/registration/`, payload);
      setRegistrations((old) => [...old, response.data]);
      enqueueSnackbar("Registration successfully recorded!", { variant: "success" });
      setParticipants([]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Internal Server Error";
      enqueueSnackbar(errorMsg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistration = async (e) => {
    const regId = e.currentTarget.id || e.target.id;
    if (!window.confirm("Are you sure you want to withdraw this registration?")) return;

    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/registration/${regId}`);
      setRegistrations((old) => old.filter((r) => r._id !== regId));
      enqueueSnackbar("Registration withdrawn", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Deletion failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER HELPERS ---
  if (loading || !event) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-desi-cream">
        <Spinner />
      </div>
    );
  }

  const isLiterary = literaryEvents.includes(event.name);
  const isOpenMic = event.name === "Open Mic";
  const isHouseEvent = houseRegistrationEvents.includes(event.name);
  const isTurnAround = event.name === "Turn Around";
  const houseLimit = event.maxRegistrations || event.teamLimit || 1;
  const canRegisterNew = registrations.length < houseLimit && active;

  return (
    <DashboardLayout role="Captain" title="Event Console" subtitle={`Portal for ${event.name}`}>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        
        {/* SECTION 1: EVENT IDENTITY */}
        <div className="bg-white rounded-2xl shadow-sm border-l-8 border-desi-saffron p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-desi-saffron/10 rounded-lg">
                <MdEvent className="text-3xl text-desi-saffron" />
              </div>
              <h1 className="text-4xl font-bold text-stone-900 font-reality">{event.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-600 border border-stone-200">
                <MdCategory /> {event.category}
              </span>
              <span className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-600 border border-stone-200">
                <MdLayers /> {event.type}
              </span>
              <span className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-600 border border-stone-200">
                <MdPeople /> {event.participation}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 text-center min-w-[120px]">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">House Limit</p>
              <p className="text-2xl font-black text-stone-800">{registrations.length} <span className="text-stone-300 text-sm">/ {houseLimit}</span></p>
            </div>
            <div className="bg-teal-50 px-6 py-3 rounded-2xl border border-teal-100 text-center min-w-[120px]">
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-tighter">Size Requirement</p>
              <p className="text-2xl font-black text-stone-800">
                {event.minTeamSize || event.minIndividualLimit || 1} - {event.maxTeamSize || event.maxIndividualLimit || 1}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CURRENT STATUS TABLE */}
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-stone-800 tracking-tight">Registered Entries</h3>
            { (event.category === "Pre-Event" && now > PRE_EVENT_DEADLINE && !isTurnAround) && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full border border-red-100 animate-pulse">
                <MdInfo />
                <span className="text-xs font-black uppercase">Submissions Closed on Jan 4</span>
              </div>
            )}
          </div>
          <div className="p-2">
            <CaptainRegistrationTable
              registrations={registrations}
              admin={true} 
              handleDeleteRegistration={handleDeleteRegistration}
            />
          </div>
        </div>

        {/* SECTION 3: DYNAMIC REGISTRATION FORM */}
        {canRegisterNew ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-desi-teal transition-all">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
              <div className="p-2 bg-desi-teal/10 rounded-lg text-desi-teal">
                <MdPersonAdd className="text-2xl" />
              </div>
              <h3 className="text-2xl font-black text-stone-800">
                {isHouseEvent ? "Submit House Team Entry" : "Create New Registration"}
              </h3>
            </div>

            {isHouseEvent ? (
              /* THE HOUSE ENTRY PATH */
              <div className="py-12 flex flex-col items-center justify-center bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                <MdGroup className="text-7xl text-stone-200 mb-4" />
                <p className="text-stone-500 font-medium text-center max-w-md mb-8">
                  For <strong>{event.name}</strong>, you register the entire house as one unit. 
                  Individual student names are not required for this category.
                </p>
                {participants.length === 0 ? (
                  <button 
                    onClick={handleAddHouseEntry}
                    className="group flex items-center gap-3 px-10 py-4 bg-desi-teal text-white font-black rounded-2xl shadow-lg hover:bg-teal-800 transition-all hover:scale-105"
                  >
                    Register {house} House Team
                  </button>
                ) : (
                  <div className="flex items-center gap-4 bg-white border-2 border-desi-teal px-8 py-4 rounded-3xl shadow-sm text-desi-teal font-black animate-in fade-in zoom-in">
                    <MdGroup className="text-2xl" />
                    <span>{house.toUpperCase()} TEAM READY</span>
                    <button 
                      onClick={() => setParticipants([])} 
                      className="ml-4 p-1 hover:bg-red-50 text-stone-300 hover:text-red-500 rounded-lg transition-colors"
                    >
                       <MdOutlineDelete size={24} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* THE STANDARD ENTRY PATH */
              <div className="space-y-8">
                {/* Visual Team Preview */}
                <div className="min-h-[60px]">
                  {participants.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {participants.map((p) => (
                        <div key={p.uid} className="flex items-center gap-4 bg-stone-50 border border-stone-200 px-5 py-3 rounded-2xl group hover:border-desi-teal transition-colors">
                          <div className="flex flex-col">
                            <span className="font-black text-stone-800 text-sm leading-none">{p.fullName}</span>
                            <span className="text-[10px] text-stone-400 font-mono mt-1">
                              {p.uid} {p.language && `• ${p.language}`} {p.performanceType && `• ${p.performanceType}`}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeleteParticipants(p.uid)}
                            className="text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <MdOutlineDelete size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-stone-400 py-4 italic text-sm">
                      <MdInfo /> No students added to this registration yet
                    </div>
                  )}
                </div>

                {/* Input Controls */}
                {participants.length < (event.maxTeamSize || event.maxIndividualLimit || 1) && (
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <SearchableDropdown
                        options={participantList}
                        label="Find Student by Name or UID"
                        selectedVal={participantData}
                        handleChange={setParticipantData}
                      />
                    </div>
                    
                    {isLiterary && (
                      <div className="w-full md:w-48">
                        <label className="block text-[10px] font-black text-stone-400 uppercase mb-2">Language</label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full p-3.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-desi-teal outline-none text-sm font-bold"
                        >
                          <option value="">Select Language</option>
                          <option value="English">English</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>
                    )}

                    {isOpenMic && (
                      <div className="w-full md:w-48">
                        <label className="block text-[10px] font-black text-stone-400 uppercase mb-2">Act Category</label>
                        <input 
                          type="text"
                          placeholder="e.g. Monoact"
                          value={performanceType}
                          onChange={(e) => setPerformanceType(e.target.value)}
                          className="w-full p-3.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-desi-teal outline-none text-sm font-bold"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleAddParticipants}
                      className="w-full md:w-auto px-8 py-3.5 bg-desi-teal text-white font-black rounded-xl shadow-md hover:bg-teal-800 hover:translate-y-[-2px] transition-all"
                    >
                      ADD TO LIST
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Final Action */}
            <div className="flex justify-end mt-12 pt-6 border-t border-stone-100">
              <button 
                onClick={handleSaveRegistration}
                disabled={participants.length === 0}
                className="flex items-center gap-3 px-12 py-4 bg-desi-saffron text-white font-black rounded-2xl shadow-xl hover:bg-amber-700 disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95"
              >
                <MdSave className="text-2xl" />
                SUBMIT REGISTRATION
              </button>
            </div>
          </div>
        ) : (
          /* BLOCK: DISPLAYED WHEN REGISTRATION IS UNAVAILABLE */
          !isTurnAround && (
            <div className="bg-stone-50 border-2 border-stone-100 p-10 rounded-3xl flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-stone-200/50 rounded-full text-stone-400">
                <MdInfo size={40} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-black text-stone-800">Registration Restricted</h3>
                <p className="text-stone-500 font-medium leading-relaxed mt-2">
                  {registrations.length >= houseLimit 
                    ? `Your house has already filled the quota (${houseLimit} entry) for this event.`
                    : `Pre-event submissions officially closed on January 4th. Existing registrations can still be modified via the table above.`}
                </p>
                <button 
                  onClick={() => navigate("/captain")} 
                  className="mt-6 text-desi-teal font-black hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <MdArrowBack /> Return to Dashboard
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventView;