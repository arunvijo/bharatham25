import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdDelete, MdPersonAdd, MdSave, MdEvent, MdArrowBack, MdDomain } from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import SearchableDropdown from "../../components/SearchableDropdown";

const CreateRegistration = () => {
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [house, setHouse] = useState("");
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Specific Fields from your original logic
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [gender, setGender] = useState("");
  const [danceType, setDanceType] = useState("");
  const [instrumentType, setInstrumentType] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // DEADLINES (Manual 2026)
  const PRE_EVENT_DEADLINE = new Date("2026-01-04T23:59:59");
  const MAIN_EVENT_DEADLINE = new Date("2026-01-19T13:00:00");
  const now = new Date();

  // Rules from your original logic + Manual fixes
  const literaryEventsForLanguage = ["Recitation", "Extempore"];
  const diversityRuleEvents = ["Essay Writing", "Short Story", "Poetry"];
  const musicEvents = ["Light Music", "Western Vocal", "Classical Music", "Rap", "Mappilappattu"];
  const danceEvents = ["Classical Dance forms"]; 
  const instrumentEvents = ["Instruments"];
  const openMicEvent = "Open Mic";

  // Events where we register the HOUSE, not specific students
  const houseRegistrationEvents = [
  "Photography", 
  "Graffiti", 
  "Vogue",               // Matches database "Vogue"
  "Short Film", 
  "Making of Bharatham", 
  "Adzap",               // Matches database "Adzap"
  "Patriotic Song"       // Added based on your previous request
];
  
  const languageEvents = [...new Set([...literaryEventsForLanguage, ...diversityRuleEvents])]; 

  useEffect(() => {
    if (!isAuthenticated && !isLoading) { navigate("/"); return; }

    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user?.nickname) return;

        const houseResponse = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const houseData = houseResponse.data.find(d => d.name !== "Admin");
        
        if (!houseData) {
          enqueueSnackbar("Invalid Access", { variant: "error" });
          navigate("/");
          return;
        }
        setHouse(houseData.name);

        const [partRes, eventRes, regRes] = await Promise.all([
           axios.get(`${apiUrl}/participant/by-house/${houseData.name}`),
           axios.get(`${apiUrl}/event/`),
           axios.get(`${apiUrl}/registration/by-house/${houseData.name}`)
        ]);

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
  }, [isAuthenticated, user, navigate, apiUrl, enqueueSnackbar]);

  // --- HANDLERS ---
  const handleAddParticipants = () => {
    if (participantData) {
      if (!event) { enqueueSnackbar("Select event first", { variant: "error" }); return; }

      const selectedEvent = events.find((e) => e.name === event);
      if (!selectedEvent) return;
      
      // Deadline Enforcement
      const isPre = selectedEvent.category === "Pre-Event" || selectedEvent.isPreEvent;
      const isTurnAround = selectedEvent.name === "Turn Around";
      const dLine = (isPre && !isTurnAround) ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
      
      if (now > dLine) {
        enqueueSnackbar(`Registration ended on ${dLine.toLocaleDateString()}`, { variant: "error" });
        return;
      }

      // Limits
      const maxLimit = selectedEvent.maxTeamSize || selectedEvent.maxIndividualLimit || 1;
      if (participants.length >= maxLimit) {
        enqueueSnackbar(`Maximum limit of ${maxLimit} reached`, { variant: "error" });
        return;
      }

      // Special Field Validation
      if (languageEvents.includes(event) && !selectedLanguage) {
        enqueueSnackbar("Select a language", { variant: "warning" }); return;
      }
      if (musicEvents.includes(event) && !gender) {
        enqueueSnackbar("Select gender category", { variant: "warning" }); return;
      }

      if (participants.some((p) => p.uid === participantData)) {
        enqueueSnackbar("Already added", { variant: "warning" }); return;
      }

      const pObj = participantList.find((p) => p.uid === participantData);
      if (pObj) {
        setParticipants(old => [...old, {
          ...pObj,
          language: selectedLanguage || null,
          performanceType: performanceType || null,
          genderCategory: gender || null,
          danceType: danceType || null,
          instrumentType: instrumentType || null
        }]);
        
        setParticipantData("");
        setSelectedLanguage("");
        setPerformanceType("");
        setGender("");
        setDanceType("");
        setInstrumentType("");
      }
    }
  };

  const handleAddHouseEntry = () => {
    if (!event) { enqueueSnackbar("Select event first", { variant: "error" }); return; }
    if (participants.length > 0) { enqueueSnackbar("House entry already added.", { variant: "warning" }); return; }

    const houseParticipant = {
      _id: `HOUSE_${house}_${Date.now()}`,
      uid: `HOUSE_${house.toUpperCase()}`,
      fullName: `${house} House Team`,
      house: house,
      isHouseEntry: true
    };

    setParticipants([houseParticipant]);
    enqueueSnackbar(`${house} Team added successfully`, { variant: "success" });
  };

  const handleDeleteParticipants = (uid) => {
    setParticipants(participants.filter((p) => p.uid !== uid));
  };

  const handleSaveRegistration = () => {
    if (participants.length === 0) { enqueueSnackbar("No participants", { variant: "error" }); return; }

    const selectedEvent = events.find((e) => e.name === event);
    if (!selectedEvent) return;

    const isHouseEntry = participants.some(p => p.isHouseEntry);

    // Min Limit check
    const minLimit = selectedEvent.minTeamSize || selectedEvent.minIndividualLimit || 1;
    if (!isHouseEntry && participants.length < minLimit) {
      enqueueSnackbar(`Minimum ${minLimit} required`, { variant: "error" }); return;
    }

    // Synchronization Rule
    if (event === "Synchronization" && participants.length === 2) {
      const gnds = participants.map(p => p.gender);
      if (!gnds.includes("Male") || !gnds.includes("Female")) {
        enqueueSnackbar("Synchronization requires 1 Male and 1 Female", { variant: "error" }); return;
      }
    }

    // House Registration Limit
    const houseLimit = selectedEvent.maxRegistrations || selectedEvent.teamLimit || 1;
    const currentRegs = registrations.filter(r => r.event === event);
    if (currentRegs.length >= houseLimit) {
      enqueueSnackbar(`House registration limit reached`, { variant: "error" }); return;
    }

    // Literary Diversity Rule
    if (diversityRuleEvents.includes(event) && !isHouseEntry && participants.length > 1) {
      const langs = new Set(participants.map(p => p.language).filter(Boolean));
      if (langs.size < 2) {
        enqueueSnackbar("Must have 2+ different languages.", { variant: "error" }); return;
      }
    }

    setLoading(true);
    axios.post(`${apiUrl}/registration/`, { event, house, participants })
      .then((res) => {
        setRegistrations(old => [...old, res.data]);
        enqueueSnackbar("Registered Successfully!", { variant: "success" });
        navigate("/captain");
      })
      .catch((err) => {
        enqueueSnackbar(err.response?.data?.message || "Error", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const isLiterary = languageEvents.includes(event);
  const isOpenMic = event === openMicEvent;
  const isMusic = musicEvents.includes(event);
  const isDance = danceEvents.includes(event);
  const isInstrument = instrumentEvents.includes(event);
  const isHouseEvent = houseRegistrationEvents.includes(event);

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout role="Captain" title="New Registration" subtitle={`For ${house} House`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-saffron">
          <div className="flex items-center gap-2 mb-4 text-stone-800 font-bold text-lg">
            <MdEvent className="text-desi-saffron text-2xl" />
            <h3>Select Event</h3>
          </div>
          <select
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
              setParticipants([]); 
              setSelectedLanguage(""); setPerformanceType(""); setGender(""); setDanceType(""); setInstrumentType("");
            }}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none"
          >
            <option value="">-- Choose Event --</option>
            {events.filter(e => {
                const isPre = e.category === "Pre-Event" || e.isPreEvent;
                const dLine = isPre ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
                return e.registrationEnabled && now < dLine;
            }).map((e) => (
              <option key={e._id} value={e.name}>{e.name}</option>
            ))}
          </select>
        </div>

        {event && (
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-teal animate-fade-in">
            <div className="flex items-center gap-2 mb-6 text-stone-800 font-bold text-lg">
              {isHouseEvent ? <MdDomain className="text-desi-teal text-2xl" /> : <MdPersonAdd className="text-desi-teal text-2xl" />}
              <h3>{isHouseEvent ? "House Entry" : "Add Participants"}</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-4 rounded-lg">
              {isHouseEvent ? (
                <div className="w-full flex flex-col items-center justify-center py-4 text-center">
                   <p className="text-stone-500 mb-4 max-w-sm text-sm">Individual student names are not required for this house entry.</p>
                   <button onClick={handleAddHouseEntry} disabled={participants.length > 0} className="px-6 py-2 bg-desi-teal text-white font-bold rounded-lg hover:bg-teal-800 transition-all">Register {house}</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 w-full">
                    <SearchableDropdown options={participantList} label="Search Student..." selectedVal={participantData} handleChange={setParticipantData} />
                  </div>
                  {isLiterary && (
                    <div className="w-full md:w-40">
                      <label className="block text-xs font-bold mb-1">Language</label>
                      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full p-3 border rounded-lg text-sm bg-white outline-none">
                        <option value="">Select</option>
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  )}
                  {isMusic && (
                    <div className="w-full md:w-40">
                      <label className="block text-xs font-bold mb-1">Category</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 border rounded-lg text-sm bg-white outline-none">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  )}
                  {isOpenMic && (
                    <div className="w-full md:w-40">
                      <label className="block text-xs font-bold mb-1">Act Type</label>
                      <input value={performanceType} onChange={(e) => setPerformanceType(e.target.value)} placeholder="e.g. Standup" className="w-full p-3 border rounded-lg text-sm" />
                    </div>
                  )}
                  <button onClick={handleAddParticipants} className="w-full md:w-auto px-6 py-2.5 bg-desi-teal text-white font-medium rounded-lg hover:bg-teal-800 transition-all">Add</button>
                </>
              )}
            </div>

            {participants.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {participants.map((p) => (
                  <div key={p.uid} className={`flex items-center gap-3 border px-4 py-2 rounded-full ${p.isHouseEntry ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200 shadow-sm'}`}>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-stone-800 text-sm">{p.fullName}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                           {p.isHouseEntry ? "HOUSE ENTRY" : p.uid} {p.language && `• ${p.language}`} {p.genderCategory && `• ${p.genderCategory}`}
                        </span>
                    </div>
                    <button onClick={() => handleDeleteParticipants(p.uid)} className="text-stone-400 hover:text-red-600"><MdDelete /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <button onClick={() => navigate("/captain")} className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg"><MdArrowBack /> Cancel</button>
              <button onClick={handleSaveRegistration} disabled={participants.length === 0} className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 disabled:opacity-50"><MdSave /> Confirm</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateRegistration;