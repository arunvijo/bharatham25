import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdDelete, MdPersonAdd, MdSave, MdGroups, MdArrowBack } from "react-icons/md";

// UI Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import SearchableDropdown from "../../components/SearchableDropdown";

const CreateRegistration = () => {
  // --- STATE MANAGEMENT ---
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [house, setHouse] = useState("");
  const [houses, setHouses] = useState([]);
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- SPECIFIC FIELDS (Per PDF Requirements) ---
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [gender, setGender] = useState("");
  const [danceType, setDanceType] = useState("");
  const [instrumentType, setInstrumentType] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // --- RULE CONFIGURATION ---
  const literaryEventsForLanguage = ["Recitation", "Extempore"];
  const diversityRuleEvents = ["Essay Writing", "Short Story", "Poetry"]; 
  const musicEvents = ["Light Music", "Western Vocal", "Classical Music"];
  const danceEvents = ["Classical Dance forms"]; 
  const instrumentEvents = ["Instruments"];
  const openMicEvent = "Open Mic";

  // Consolidate all events needing a language field
  const languageEvents = [...new Set([...literaryEventsForLanguage, ...diversityRuleEvents])]; 

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [houseRes, partRes, eventRes, regRes] = await Promise.all([
           axios.get(`${apiUrl}/house/`),
           axios.get(`${apiUrl}/participant/`),
           axios.get(`${apiUrl}/event/`),
           axios.get(`${apiUrl}/registration/`)
        ]);

        setHouses(houseRes.data.data);
        setParticipantList(partRes.data.data);
        setEvents(eventRes.data.data);
        setRegistrations(regRes.data.data);

      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, isLoading, navigate, apiUrl, enqueueSnackbar]);

  // --- HANDLERS ---
  const handleAddParticipants = () => {
    if (participantData) {
      if (!house) { enqueueSnackbar("Select a house first", { variant: "error" }); return; }
      if (!event) { enqueueSnackbar("Select an event first", { variant: "error" }); return; }

      const selectedEvent = events.find((e) => e.name === event);
      if (!selectedEvent) return;
      
      // 1. Check Limits
      const maxLimit = selectedEvent.maxTeamSize || selectedEvent.maxIndividualLimit || 1;
      if (participants.length >= maxLimit) {
        enqueueSnackbar(`Maximum limit of ${maxLimit} reached`, { variant: "error" });
        return;
      }

      // 2. Check Special Fields (Validation)
      if (languageEvents.includes(event) && !selectedLanguage) {
        enqueueSnackbar("Please select a language", { variant: "warning" });
        return;
      }
      if (event === openMicEvent && !performanceType) {
        enqueueSnackbar("Please enter the act type", { variant: "warning" });
        return;
      }
      if (musicEvents.includes(event) && !gender) {
        enqueueSnackbar("Please select a gender category", { variant: "warning" });
        return;
      }
      if (danceEvents.includes(event) && !danceType) {
        enqueueSnackbar("Please select a dance form", { variant: "warning" });
        return;
      }
      if (instrumentEvents.includes(event) && !instrumentType) {
        enqueueSnackbar("Please select an instrument", { variant: "warning" });
        return;
      }

      // 3. Check Duplicates
      if (participants.some((p) => p.uid === participantData)) {
        enqueueSnackbar("Participant already added", { variant: "warning" });
        return;
      }

      // 4. Add to List
      const pObj = participantList.find((p) => p.uid === participantData);
      if (pObj) {
        setParticipants(old => [...old, {
          ...pObj,
          language: selectedLanguage || null,
          performanceType: performanceType || null,
          gender: gender || null,
          danceType: danceType || null,
          instrumentType: instrumentType || null
        }]);
        
        // Reset Inputs
        setParticipantData("");
        setSelectedLanguage("");
        setPerformanceType("");
        setGender("");
        setDanceType("");
        setInstrumentType("");
      } else {
        enqueueSnackbar("Participant not found in list.", { variant: "error" });
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

    const selectedEvent = events.find((e) => e.name === event);
    if (!selectedEvent) { enqueueSnackbar("Invalid event selected", { variant: "error" }); return; }
    
    // Rule: Min Participants (Frontend Check)
    const minLimit = selectedEvent.minTeamSize || selectedEvent.minIndividualLimit || 1;
    if (participants.length < minLimit) {
      enqueueSnackbar(`Minimum ${minLimit} participants required`, { variant: "error" });
      return;
    }

    // Rule: House Limit (Frontend Check - backend also validates)
    const houseLimit = selectedEvent.maxRegistrations || selectedEvent.teamLimit || 1;
    const currentRegs = registrations.filter(r => r.event === event && r.house === house);
    if (currentRegs.length >= houseLimit) {
      enqueueSnackbar(`House limit (${houseLimit}) reached for this event. Try again after admin sync.`, { variant: "error" });
      return;
    }

    // Rule: Language Diversity (Specific Pre-Events only) - Frontend Check
    if (diversityRuleEvents.includes(event)) {
      const langs = new Set(participants.map(p => p.language).filter(Boolean));
      if (langs.size < 2) {
        enqueueSnackbar("Must include participants from at least 2 different languages (English/Malayalam/Hindi).", { variant: "error" });
        return;
      }
    }

    // Submit
    setLoading(true);
    axios.post(`${apiUrl}/registration/`, { event, house, participants })
      .then((res) => {
        setRegistrations(old => [...old, res.data]);
        enqueueSnackbar("Registration Created Successfully!", { variant: "success" });
        navigate("/admin");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Error creating registration";
        enqueueSnackbar(msg, { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  // Helper Variables
  const currentEventObj = events.find(e => e.name === event);
  const isLiterary = languageEvents.includes(event);
  const isOpenMic = event === openMicEvent;
  const isMusic = musicEvents.includes(event);
  const isDance = danceEvents.includes(event);
  const isInstrument = instrumentEvents.includes(event);


  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout 
      role="Admin" 
      title="Manual Registration" 
      subtitle="Register students on behalf of a House"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. Configuration Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-saffron">
          <div className="flex items-center gap-2 mb-4 text-stone-800 font-bold text-lg">
            <MdGroups className="text-desi-saffron text-2xl" />
            <h3>Select House & Event</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">House</label>
                <select
                    value={house}
                    onChange={(e) => {
                        setHouse(e.target.value);
                        setParticipants([]); 
                    }}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none transition-all"
                >
                    <option value="">-- Select House --</option>
                    {houses?.filter(h => h.name !== "Admin").map((h) => (
                        <option key={h._id} value={h.name}>{h.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Event</label>
                <select
                    value={event}
                    onChange={(e) => {
                        setEvent(e.target.value);
                        setParticipants([]); 
                        // Reset all conditionals
                        setSelectedLanguage("");
                        setPerformanceType("");
                        setGender("");
                        setDanceType("");
                        setInstrumentType("");
                    }}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none transition-all"
                >
                    <option value="">-- Select Event --</option>
                    {events.map((e) => (
                        <option key={e._id} value={e.name}>{e.name}</option>
                    ))}
                </select>
            </div>
          </div>

          {currentEventObj && (
            <div className="mt-4 p-3 bg-stone-50 rounded border border-stone-100 text-xs font-medium text-stone-500 uppercase tracking-wider flex gap-4 flex-wrap">
              <span>Min Team: {currentEventObj.minTeamSize || 1}</span>
              <span>Max Team: {currentEventObj.maxTeamSize || 1}</span>
              <span>Max Regs: {currentEventObj.maxRegistrations || 1}</span>
              {diversityRuleEvents.includes(event) && <span className="text-orange-600 font-bold">Requires 2+ Languages</span>}
            </div>
          )}
        </div>

        {/* 2. Participant Selection */}
        {event && house && (
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-teal animate-fade-in">
            <div className="flex items-center gap-2 mb-6 text-stone-800 font-bold text-lg">
              <MdPersonAdd className="text-desi-teal text-2xl" />
              <h3>Add {house} Participants</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-4 rounded-lg">
              
              {/* Student Search */}
              <div className="flex-1 w-full">
                <SearchableDropdown
                  options={participantList.filter((p) => p.house.toLowerCase() === house.toLowerCase())}
                  label={`Search ${house} Student...`}
                  id="participant"
                  selectedVal={participantData}
                  handleChange={(val) => setParticipantData(val)}
                />
              </div>

              {/* === CONDITIONAL INPUTS BASED ON EVENT TYPE === */}

              {/* Language (Literary / Recitation / Extempore) */}
              {isLiterary && (
                <div className="w-full md:w-40">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
                  >
                    <option value="">Select</option>
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              )}

              {/* Gender (Music Events) */}
              {isMusic && (
                <div className="w-full md:w-40">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}

              {/* Dance Type (Classical Dance) */}
              {isDance && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Dance Form</label>
                  <select
                    value={danceType}
                    onChange={(e) => setDanceType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
                  >
                    <option value="">Select Form</option>
                    <option value="Bharathanatyam">Bharathanatyam</option>
                    <option value="Mohiniyattam">Mohiniyattam</option>
                    <option value="Kuchipudi">Kuchipudi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Instrument Type (Instruments) */}
              {isInstrument && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Instrument</label>
                  <select
                    value={instrumentType}
                    onChange={(e) => setInstrumentType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Wind">Wind</option>
                    <option value="Percussion">Percussion</option>
                    <option value="String">String</option>
                    <option value="Keyboard">Keyboard</option>
                  </select>
                </div>
              )}

              {/* Open Mic Input */}
              {isOpenMic && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Performance</label>
                  <input
                    type="text"
                    placeholder="e.g. Standup"
                    value={performanceType}
                    onChange={(e) => setPerformanceType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
                  />
                </div>
              )}

              <button
                onClick={handleAddParticipants}
                className="w-full md:w-auto px-6 py-2.5 bg-desi-teal text-white font-medium rounded-lg shadow-md hover:bg-teal-800 active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 3. Team Preview */}
        {participants.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h4 className="text-sm font-bold text-stone-400 uppercase mb-4">Current Team ({participants.length})</h4>
            <div className="flex flex-wrap gap-3">
              {participants.map((p) => (
                <div key={p.uid} className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-stone-800 text-sm">{p.fullName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {p.uid}
                      {/* Show Tags */}
                      {p.language && <span className="ml-1 text-orange-600 font-bold">• {p.language}</span>}
                      {p.gender && <span className="ml-1 text-blue-600 font-bold">• {p.gender}</span>}
                      {p.danceType && <span className="ml-1 text-purple-600 font-bold">• {p.danceType}</span>}
                      {p.instrumentType && <span className="ml-1 text-teal-600 font-bold">• {p.instrumentType}</span>}
                      {p.performanceType && <span className="ml-1 text-pink-600 font-bold">• {p.performanceType}</span>}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteParticipants(p.uid)} className="text-stone-400 hover:text-red-600 transition-colors">
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Footer */}
        <div className="flex justify-end gap-4 pt-6">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg transition-colors">
            <MdArrowBack /> Cancel
          </button>
          <button onClick={handleSaveRegistration} disabled={participants.length === 0} className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 disabled:opacity-50 active:scale-95 transition-all">
            <MdSave /> Confirm
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateRegistration;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";
// import { MdOutlineDelete } from "react-icons/md";
// import SearchableDropdown from "../../components/SearchableDropdown";

// const CreateRegisration = () => {
//   const [event, setEvent] = useState("");
//   const [events, setEvents] = useState([]);
//   const [house, setHouse] = useState("");
//   const [houses, setHouses] = useState([]);
//   const [participantData, setParticipantData] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [participantList, setParticipantList] = useState([]);
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // New State for Extra Fields
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [performanceType, setPerformanceType] = useState("");

//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const { isAuthenticated, isLoading } = useAuth0();

//   // Define Literary Events for Language Rules
//   const literaryEvents = ["Essay Writing", "Short Story", "Poetry"];

//   // Use Environment Variable for API URL (defaults to localhost if not set)
//   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

//   useEffect(() => {
//     if (!isAuthenticated && !isLoading) navigate("/");

//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch Houses
//         const houseResponse = await axios.get(`${apiUrl}/house/`);
//         const houses = houseResponse.data.data;

//         // Fetch Participants
//         const participantResponse = await axios.get(`${apiUrl}/participant/`);
//         const participantList = participantResponse.data.data;

//         // Fetch Events
//         const eventResponse = await axios.get(`${apiUrl}/event/`);
//         const events = eventResponse.data.data;

//         // Fetch Registrations
//         const registrationResponse = await axios.get(`${apiUrl}/registration/`);
//         const registrations = registrationResponse.data.data;

//         setHouses(houses);
//         setEvents(events);
//         setParticipantList(participantList);
//         setRegistrations(registrations);
//       } catch (error) {
//         console.error(error);
//         enqueueSnackbar("Error loading data", { variant: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) fetchData();
//   }, [isAuthenticated, isLoading, navigate, enqueueSnackbar, apiUrl]);

//   const handleAddParticipants = () => {
//     if (participantData) {
//       // 1. Basic Validations
//       if (!house) {
//         enqueueSnackbar("Please select a house first", { variant: "error" });
//         return;
//       }
//       if (!event) {
//         enqueueSnackbar("Please select an event first", { variant: "error" });
//         return;
//       }

//       const selectedEvent = events.find((e) => e.name === event);
//       if (!selectedEvent) return;

//       // 2. Check Team Size Limit (Max participants per entry)
//       // Use maxTeamSize if available, otherwise fall back to maxIndividualLimit
//       const maxLimit = selectedEvent.maxTeamSize || selectedEvent.maxIndividualLimit || 1;
//       if (participants.length >= maxLimit) {
//         enqueueSnackbar(`Maximum limit of ${maxLimit} participants reached`, { variant: "error" });
//         return;
//       }

//       // 3. Literary Event Validation (Language Required)
//       if (literaryEvents.includes(event) && !selectedLanguage) {
//         enqueueSnackbar("Please select a language for this participant", { variant: "warning" });
//         return;
//       }

//       // 4. Open Mic Validation (Act Type Required)
//       if (event === "Open Mic" && !performanceType) {
//         enqueueSnackbar("Please enter the performance type", { variant: "warning" });
//         return;
//       }

//       // 5. Check if already added
//       let flag = false;
//       participants.forEach((participant) => {
//         if (participant.uid === participantData) flag = true;
//       });

//       if (!flag) {
//         // Find participant details
//         const pObj = participantList.find((p) => p.uid === participantData);
//         if (pObj) {
//           // Add participant with extra fields
//           const newParticipant = {
//             ...pObj,
//             language: selectedLanguage || null,
//             performanceType: performanceType || null
//           };
//           setParticipants((old) => [...old, newParticipant]);
          
//           // Reset inputs
//           setParticipantData("");
//           setSelectedLanguage("");
//           setPerformanceType("");
//         }
//       } else {
//         enqueueSnackbar("Participant already added", { variant: "warning" });
//         setParticipantData("");
//       }
//     }
//   };

//   const handleDeleteParticipants = (e) => {
//     const uid = e.currentTarget.id; // Changed to currentTarget to handle icon clicks better
//     setParticipants(
//       participants.filter((participant) => {
//         return participant.uid !== uid;
//       })
//     );
//   };

//   const handleSaveRegistration = () => {
//     const selectedEvent = events.find((e) => e.name === event);
    
//     if (!selectedEvent) {
//       enqueueSnackbar("Invalid event selected", { variant: "error" });
//       return;
//     }

//     if (participants.length === 0) {
//       enqueueSnackbar("No participant selected", { variant: "error" });
//       return;
//     }

//     // 1. Check Minimum Participants
//     const minLimit = selectedEvent.minTeamSize || selectedEvent.minIndividualLimit || 1;
//     if (participants.length < minLimit) {
//       enqueueSnackbar(`Minimum ${minLimit} participants required for this event`, { variant: "error" });
//       return;
//     }

//     // 2. Check House Registration Limit (How many times this house can register)
//     const houseLimit = selectedEvent.maxRegistrations || selectedEvent.teamLimit || 1;
//     const houseRegistrationsForEvent = registrations.filter(
//       (reg) => reg.event === event && reg.house === house
//     );
    
//     if (houseRegistrationsForEvent.length >= houseLimit) {
//       enqueueSnackbar(`${house} has reached the registration limit (${houseLimit}) for this event`, { variant: "error" });
//       return;
//     }

//     // 3. Check Language Diversity Rule (Literary Events)
//     if (literaryEvents.includes(event)) {
//       const uniqueLanguages = new Set(participants.map(p => p.language));
//       if (uniqueLanguages.size < 2) {
//         enqueueSnackbar("Participants must represent at least 2 different languages.", { variant: "error" });
//         return;
//       }
//     }

//     const data = {
//       event,
//       house,
//       participants, // Contains language/performanceType
//     };

//     setLoading(true);
    
//     // 4. Send to Backend
//     // Note: The backend now handles the logic for:
//     // - Counting individual/group events
//     // - Updating participant counters
//     // - Returning errors if limits are exceeded
//     axios
//       .post(`${apiUrl}/registration/`, data)
//       .then((response) => {
//         setLoading(false);
//         setRegistrations((old) => [...old, response.data]);
//         enqueueSnackbar("Registration Created successfully", { variant: "success" });
//         navigate("/admin");
//       })
//       .catch((error) => {
//         setLoading(false);
//         // Show specific error from backend (e.g., "Limit Reached")
//         const msg = error.response?.data?.message || "Error creating registration!";
//         enqueueSnackbar(msg, { variant: "error" });
//       });
//   };

//   // Helper flags
//   const isLiterary = literaryEvents.includes(event);
//   const isOpenMic = event === "Open Mic";

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Create Registration (Admin)</h1>
//       <hr />

//       <p>House : </p>
//       <select
//         name="house"
//         id="house"
//         value={house}
//         onChange={(e) => {
//           setHouse(e.target.value);
//           setParticipants([]); // Clear participants if house changes
//         }}
//       >
//         <option value="">Select House</option>
//         {houses
//           ?.filter((h) => h.name !== "Admin")
//           .map((h) => (
//             <option key={h._id} value={h.name}>{h.name}</option>
//           ))}
//       </select>

//       <p>Event : </p>
//       <select
//         name="event"
//         id="event"
//         value={event}
//         onChange={(e) => {
//           setEvent(e.target.value);
//           setParticipants([]); // Clear participants if event changes
//           setSelectedLanguage("");
//           setPerformanceType("");
//         }}
//       >
//         <option value="">Select Event</option>
//         {events?.map((e) => (
//           <option key={e._id} value={e.name}>{e.name}</option>
//         ))}
//       </select>

//       <p>Added Participants : </p>
//       <div className="pill-container">
//         {participants.map((participant) => (
//           <button
//             id={participant.uid}
//             className="btn-pill"
//             onClick={handleDeleteParticipants}
//             key={`p${participant.uid}`}
//           >
//             {participant.fullName} 
//             {participant.language ? ` (${participant.language})` : ""}
//             {participant.performanceType ? ` - ${participant.performanceType}` : ""}
//             <MdOutlineDelete />
//           </button>
//         ))}
//       </div>

//       <div className="sub-group">
//         <div className="row" style={{ gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
          
//           <SearchableDropdown
//             options={participantList.filter((p) =>
//               house ? p.house.toLowerCase() === house.toLowerCase() : true
//             )}
//             label="Participant"
//             id="participant"
//             selectedVal={participantData}
//             handleChange={(val) => setParticipantData(val)}
//           />

//           {/* Conditional Input: Language for Literary Events */}
//           {isLiterary && (
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <label style={{ fontSize: "0.9rem", marginBottom: "5px" }}>Language</label>
//               <select
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//               >
//                 <option value="">Select</option>
//                 <option value="English">English</option>
//                 <option value="Malayalam">Malayalam</option>
//                 <option value="Hindi">Hindi</option>
//               </select>
//             </div>
//           )}

//           {/* Conditional Input: Act Type for Open Mic */}
//           {isOpenMic && (
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <label style={{ fontSize: "0.9rem", marginBottom: "5px" }}>Act Type</label>
//               <input 
//                 type="text" 
//                 placeholder="e.g. Standup"
//                 value={performanceType}
//                 onChange={(e) => setPerformanceType(e.target.value)}
//                 style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
//               />
//             </div>
//           )}

//           <button className="btn-outline" onClick={handleAddParticipants}>
//             + Add
//           </button>
//         </div>
//       </div>

//       <button onClick={handleSaveRegistration} style={{ marginTop: "20px" }}>
//         Submit Registration
//       </button>
//     </div>
//   );
// };

// export default CreateRegisration;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";
// import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
// import SearchableDropdown from "../../components/SearchableDropdown";

// const CreateRegisration = () => {
//   const [event, setEvent] = useState("");
//   const [events, setEvents] = useState([]);
//   const [house, setHouse] = useState("");
//   const [houses, setHouses] = useState([]);
//   const [participantData, setParticipantData] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [participantList, setParticipantList] = useState([]);
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     // console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");

//     const fetchData = async () => {
//       try {
//         const houseResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/house/`
//         );
//         const houses = houseResponse.data.data;

//         const participantResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/participant/`
//         );
//         const participantList = participantResponse.data.data;

//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/`
//         );
//         const events = eventResponse.data.data;

//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/`
//         );
//         const registrations = registrationResponse.data.data;

//         setHouses(houses);
//         setEvents(events);
//         setParticipantList(participantList);
//         setRegistrations(registrations);
//         setLoading(false);
//         // console.log(events.length, registrations.length);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) fetchData();
//   }, [isAuthenticated]);

//   const handleAddParticipants = () => {
//     if (participantData) {
//       let flag = false;
//       participants.forEach((participant) => {
//         if (participant.uid == participantData) flag = true;
//       });

//       if (flag == false) {
//         const pObj = participantList.filter((p) => p.uid == participantData)[0];
//         // console.log(participantData, pObj);
//         setParticipants((old) => [...old, pObj]);
//       }
//       setParticipantData("");
//     }
//   };

//   const handleDeleteParticipants = (e) => {
//     const uid = e.target.id;
//     setParticipants(
//       participants.filter((participant) => {
//         return participant.uid != uid;
//       })
//     );
//   };

//   const handleSaveRegistration = () => {
//     const data = {
//       event,
//       house,
//       participants,
//     };

//     if (participants.length === 0) {
//       enqueueSnackbar("No participant selected", {
//         variant: "error",
//       });
//       return;
//     }

//     // Get the selected event object
//     const selectedEvent = events.find((e) => e.name === event);
//     if (!selectedEvent) {
//       enqueueSnackbar("Invalid event selected", { variant: "error" });
//       return;
//     }

//     // Check minimum participant limit
//     if (participants.length < selectedEvent.minIndividualLimit) {
//       enqueueSnackbar(
//         `Minimum ${selectedEvent.minIndividualLimit} participants required for this event`,
//         {
//           variant: "error",
//         }
//       );
//       return;
//     }

//     // Check maximum participant limit
//     if (participants.length > selectedEvent.maxIndividualLimit) {
//       enqueueSnackbar(
//         `Maximum ${selectedEvent.maxIndividualLimit} participants allowed for this event`,
//         {
//           variant: "error",
//         }
//       );
//       return;
//     }

//     // Check team limit for the event
//     const houseRegistrationsForEvent = registrations.filter(
//       (reg) => reg.event === event && reg.house === house
//     );
//     if (houseRegistrationsForEvent.length >= selectedEvent.teamLimit) {
//       enqueueSnackbar(
//         `Maximum team limit of ${selectedEvent.teamLimit} reached for this event`,
//         {
//           variant: "error",
//         }
//       );
//       return;
//     }

//     // Create a copy of participants to update their counts
//     const updatedParticipants = participants.map((p) => ({
//       ...p,
//       individual: p.individual || 0,
//       group: p.group || 0,
//       literary: p.literary || 0,
//     }));

//     // Update participation counts
//     // updatedParticipants.forEach((p) => {
//     //   if (selectedEvent.category !== "Non-Counting") {
//     //     if (selectedEvent.participation === "Individual") {
//     //       if (
//     //         selectedEvent.category === "Literary" &&
//     //         selectedEvent.date !== "21-03-2025" &&
//     //         selectedEvent.date !== "22-03-2025" &&
//     //         selectedEvent.date !== "20-03-2025"
//     //       ) {
//     //         p.literary += 1;
//     //       } else if (
//     //         selectedEvent.category != "Deco" &&
//     //         selectedEvent.category != "Open Stage" &&
//     //         selectedEvent.category != "Media"
//     //       ) {
//     //         p.individual += 1;
//     //       }
//     //     } else if (selectedEvent.participation === "Group") {
//     //       if (
//     //         selectedEvent.category === "Literary" &&
//     //         selectedEvent.date !== "21-03-2025" &&
//     //         selectedEvent.date !== "22-03-2025" &&
//     //         selectedEvent.date !== "20-03-2025"
//     //       ) {
//     //         p.literary += 1;
//     //       } else if (
//     //         selectedEvent.category != "Deco" &&
//     //         selectedEvent.category != "Open Stage" &&
//     //         selectedEvent.category != "Media"
//     //       ) {
//     //         p.group += 1;
//     //       }
//     //     }
//     //   }
//     // });

//     // Check participation limits after updating counts
//     let flag = true;
//     const unlimitedGroupUids = [
//       "U2101071",
//       "U2101016",
//       "U2101119",
//       "U2105050",
//       "U2102031",
//       "U2104050",
//       "U2107031",
//       "U2101016",
//       "U2101078",
//       "U2103064",
//     ];
//     updatedParticipants.forEach((p) => {
//       if (
//         p.individual > 5 ||
//         p.literary > 4 ||
//         (p.group > 3 && !unlimitedGroupUids.includes(p.uid))
//       ) {
//         flag = false;
//       }
//     });

//     if (!flag) {
//       enqueueSnackbar("Participant has reached participation limit", {
//         variant: "error",
//       });
//       setParticipantData("");
//       setParticipants([]);
//       return;
//     }

//     setLoading(true);
//     axios
//       .post("https://bharatham-backend-j9s1.onrender.com/registration/", data)
//       .then((response) => {
//         setLoading(false);
//         setRegistrations((old) => [...old, response.data]);

//         enqueueSnackbar("Registration Created successfully", {
//           variant: "success",
//         });

//         // Update participants with new counts
//         const updateParticipants = async () => {
//           try {
//             await Promise.all(
//               updatedParticipants.map((participant) =>
//                 axios.put(
//                   `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`,
//                   participant
//                 )
//               )
//             );
//             enqueueSnackbar("Participant data updated successfully!", {
//               variant: "success",
//             });
//           } catch (error) {
//             console.error(error);
//             enqueueSnackbar("Error updating participant data!", {
//               variant: "error",
//             });
//           }
//         };

//         updateParticipants();
//         navigate("/admin");
//       })
//       .catch((error) => {
//         setLoading(false);
//         enqueueSnackbar("Error creating registration!", { variant: "error" });
//       });
//   };

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Create Registration</h1>

//       <hr />

//       <p>House : </p>
//       <select
//         name="house"
//         id="house"
//         value={house}
//         onChange={(e) => setHouse(e.target.value)}
//       >
//         <option value="">{""}</option>
//         {houses
//           ?.filter((h) => h.name != "Admin")
//           .map((h) => (
//             <option value={h.name}>{h.name}</option>
//           ))}
//       </select>

//       <p>Event : </p>
//       <select
//         name="event"
//         id="event"
//         value={event}
//         onChange={(e) => setEvent(e.target.value)}
//       >
//         <option value="">{""}</option>
//         {events?.map((e) => (
//           <option value={e.name}>{e.name}</option>
//         ))}
//       </select>

//       <p>Added Participants : </p>
//       <div className="pill-container">
//         {participants.map((participant) => (
//           <button
//             id={participant.uid}
//             className="btn-pill"
//             onClick={handleDeleteParticipants}
//             key={`p${participant.uid}`}
//           >
//             {participant.uid} | {participant.fullName}
//             <MdOutlineDelete />
//           </button>
//         ))}
//       </div>
//       <div className="sub-group">
//         <div className="row" style={{ gap: "20px" }}>
//           <SearchableDropdown
//             options={participantList.filter((registration) =>
//               registration.house.toLowerCase().includes(house.toLowerCase())
//             )}
//             label="Participant"
//             id="participant"
//             selectedVal={participantData}
//             handleChange={(val) => setParticipantData(val)}
//           />
//           <button className="btn-outline" onClick={handleAddParticipants}>
//             + Participant
//           </button>
//         </div>
//       </div>

//       <button onClick={handleSaveRegistration}>Create</button>
//     </div>
//   );
// };
// export default CreateRegisration;
