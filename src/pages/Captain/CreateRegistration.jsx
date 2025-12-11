import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdDelete, MdPersonAdd, MdSave, MdEvent, MdArrowBack } from "react-icons/md";

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
  
  // Specific Fields
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [gender, setGender] = useState("");
  const [danceType, setDanceType] = useState("");
  const [instrumentType, setInstrumentType] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // Rules
  const literaryEventsForLanguage = ["Recitation", "Extempore"];
  const diversityRuleEvents = ["Essay Writing", "Short Story", "Poetry"];
  const musicEvents = ["Light Music", "Western Vocal", "Classical Music"];
  const danceEvents = ["Classical Dance forms"]; 
  const instrumentEvents = ["Instruments"];
  const openMicEvent = "Open Mic";
  
  // Consolidate all events needing a language field
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

  const handleAddParticipants = () => {
    if (participantData) {
      if (!event) { enqueueSnackbar("Select event first", { variant: "error" }); return; }

      const selectedEvent = events.find((e) => e.name === event);
      if (!selectedEvent) return;
      
      if (!selectedEvent?.registrationEnabled) {
        enqueueSnackbar("Registration Closed", { variant: "error" });
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
      if (event === openMicEvent && !performanceType) {
        enqueueSnackbar("Enter act type", { variant: "warning" }); return;
      }
      if (musicEvents.includes(event) && !gender) {
        enqueueSnackbar("Select gender", { variant: "warning" }); return;
      }
      if (danceEvents.includes(event) && !danceType) {
        enqueueSnackbar("Select dance form", { variant: "warning" }); return;
      }
      if (instrumentEvents.includes(event) && !instrumentType) {
        enqueueSnackbar("Select instrument", { variant: "warning" }); return;
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
          gender: gender || null,
          danceType: danceType || null,
          instrumentType: instrumentType || null
        }]);
        
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
    if (participants.length === 0) { enqueueSnackbar("No participants", { variant: "error" }); return; }

    const selectedEvent = events.find((e) => e.name === event);
    if (!selectedEvent) { enqueueSnackbar("Invalid event selected", { variant: "error" }); return; }

    const minLimit = selectedEvent.minTeamSize || selectedEvent.minIndividualLimit || 1;
    
    if (participants.length < minLimit) {
      enqueueSnackbar(`Minimum ${minLimit} required`, { variant: "error" }); return;
    }

    const houseLimit = selectedEvent.maxRegistrations || selectedEvent.teamLimit || 1;
    const currentRegs = registrations.filter(r => r.event === event);
    
    if (currentRegs.length >= houseLimit) {
      enqueueSnackbar(`House registration limit reached`, { variant: "error" }); return;
    }

    if (diversityRuleEvents.includes(event)) {
      const langs = new Set(participants.map(p => p.language).filter(Boolean));
      if (langs.size < 2) {
        enqueueSnackbar("Must have 2+ languages (English/Malayalam/Hindi).", { variant: "error" }); return;
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

  const currentEventObj = events.find(e => e.name === event);
  const isLiterary = languageEvents.includes(event);
  const isOpenMic = event === openMicEvent;
  const isMusic = musicEvents.includes(event);
  const isDance = danceEvents.includes(event);
  const isInstrument = instrumentEvents.includes(event);

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
            {events.filter(e => e.registrationEnabled).map((e) => (
              <option key={e._id} value={e.name}>{e.name}</option>
            ))}
          </select>
        </div>

        {event && (
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-teal animate-fade-in">
            <div className="flex items-center gap-2 mb-6 text-stone-800 font-bold text-lg">
              <MdPersonAdd className="text-desi-teal text-2xl" />
              <h3>Add Participants</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-4 rounded-lg">
              <div className="flex-1 w-full">
                <SearchableDropdown
                  options={participantList}
                  label="Search Student..."
                  id="participant"
                  selectedVal={participantData}
                  handleChange={(val) => setParticipantData(val)}
                />
              </div>

              {/* Conditional Inputs */}
              {isLiterary && (
                <div className="w-full md:w-40">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Language</label>
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg outline-none">
                    <option value="">Select</option>
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              )}

              {isMusic && (
                <div className="w-full md:w-40">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg outline-none">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}

              {isDance && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Dance Form</label>
                  <select value={danceType} onChange={(e) => setDanceType(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg outline-none">
                    <option value="">Select</option>
                    <option value="Bharathanatyam">Bharathanatyam</option>
                    <option value="Mohiniyattam">Mohiniyattam</option>
                    <option value="Kuchipudi">Kuchipudi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {isInstrument && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Instrument</label>
                  <select value={instrumentType} onChange={(e) => setInstrumentType(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg outline-none">
                    <option value="">Select</option>
                    <option value="Wind">Wind</option>
                    <option value="Percussion">Percussion</option>
                    <option value="String">String</option>
                    <option value="Keyboard">Keyboard</option>
                  </select>
                </div>
              )}

              {isOpenMic && (
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Act Type</label>
                  <input type="text" placeholder="e.g. Standup" value={performanceType} onChange={(e) => setPerformanceType(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg outline-none" />
                </div>
              )}

              <button onClick={handleAddParticipants} className="w-full md:w-auto px-6 py-2.5 bg-desi-teal text-white font-medium rounded-lg hover:bg-teal-800 transition-all">Add</button>
            </div>
          </div>
        )}

        {participants.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h4 className="text-sm font-bold text-stone-400 uppercase mb-4">Team ({participants.length})</h4>
            <div className="flex flex-wrap gap-3">
              {participants.map((p) => (
                <div key={p.uid} className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-stone-800 text-sm">{p.fullName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {p.uid}
                      {p.language && <span className="ml-1 text-orange-600 font-bold">• {p.language}</span>}
                      {p.gender && <span className="ml-1 text-blue-600 font-bold">• {p.gender}</span>}
                      {p.danceType && <span className="ml-1 text-purple-600 font-bold">• {p.danceType}</span>}
                      {p.instrumentType && <span className="ml-1 text-teal-600 font-bold">• {p.instrumentType}</span>}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteParticipants(p.uid)} className="text-stone-400 hover:text-red-600"><MdDelete /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6">
          <button onClick={() => navigate("/captain")} className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg"><MdArrowBack /> Cancel</button>
          <button onClick={handleSaveRegistration} disabled={participants.length === 0} className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 disabled:opacity-50"><MdSave /> Confirm</button>
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

// const CreateRegistration = () => {
//   const [event, setEvent] = useState("");
//   const [events, setEvents] = useState([]);
//   const [house, setHouse] = useState("");
//   const [participantData, setParticipantData] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [participantList, setParticipantList] = useState([]);
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     if (!isAuthenticated && !isLoading) {
//       navigate("/");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Get captain's house
//         const houseResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/house/by-captain/${user.nickname}`
//         );
//         const captainHouse = houseResponse.data.filter(
//           (d) => d.name !== "Admin"
//         )[0];
//         if (!captainHouse) {
//           enqueueSnackbar("Invalid User", { variant: "error" });
//           navigate("/");
//           return;
//         }
//         setHouse(captainHouse.name);

//         // Get participants for captain's house
//         const participantResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/participant/by-house/${captainHouse.name}`
//         );
//         setParticipantList(participantResponse.data.data);

//         // Get all events
//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/`
//         );
//         setEvents(eventResponse.data.data);

//         // Get existing registrations
//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-house/${captainHouse.name}`
//         );
//         setRegistrations(registrationResponse.data.data);
//       } catch (error) {
//         console.error(error);
//         enqueueSnackbar("Error loading data", { variant: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [isAuthenticated, isLoading, navigate, user?.nickname, enqueueSnackbar]);

//   const handleAddParticipants = () => {
//     if (participantData) {
//       // Check if event is selected
//       if (!event) {
//         enqueueSnackbar("Please select an event first", { variant: "error" });
//         return;
//       }

//       // Get the selected event object
//       const selectedEvent = events.find((e) => e.name === event);
//       if (!selectedEvent) {
//         enqueueSnackbar("Invalid event selected", { variant: "error" });
//         return;
//       }

//       // Check if registration is enabled for this event
//       if (!selectedEvent.registrationEnabled) {
//         enqueueSnackbar("Registration is currently closed for this event", { variant: "error" });
//         return;
//       }

//       // Check if we've reached the maximum limit
//       if (participants.length >= selectedEvent.maxIndividualLimit) {
//         enqueueSnackbar(
//           `Maximum limit of ${selectedEvent.maxIndividualLimit} participants reached for this event`,
//           {
//             variant: "error",
//           }
//         );
//         return;
//       }

//       let flag = false;
//       participants.forEach((participant) => {
//         if (participant.uid === participantData) flag = true;
//       });

//       if (!flag) {
//         const pObj = participantList.find((p) => p.uid === participantData);
//         if (pObj) {
//           setParticipants((old) => [...old, pObj]);
//         }
//       }
//       setParticipantData("");
//     }
//   };

//   const handleDeleteParticipants = (e) => {
//     const uid = e.target.id;
//     setParticipants(
//       participants.filter((participant) => participant.uid !== uid)
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

//     // Check if registration is enabled for this event
//     if (!selectedEvent.registrationEnabled) {
//       enqueueSnackbar("Registration is currently closed for this event", { variant: "error" });
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
//     updatedParticipants.forEach((p) => {
//       if (selectedEvent.category !== "Non-Counting") {
//         if (selectedEvent.participation === "Individual") {
//           if (
//             selectedEvent.category === "Literary" &&
//             (selectedEvent.date !== "21-03-2025" &&
//               selectedEvent.date !== "22-03-2025" &&
//               selectedEvent.date !== "20-03-2025")
//           ) {
//             p.literary += 1;
//           } else if (
//             selectedEvent.category != "Deco" &&
//             selectedEvent.category != "Open Stage" &&
//             selectedEvent.category != "Media"
//           ) {
//             p.individual += 1;
//           }
//         } else if (selectedEvent.participation === "Group") {
//           if (
//             selectedEvent.category === "Literary" &&
//             (selectedEvent.date !== "21-03-2025" &&
//               selectedEvent.date !== "22-03-2025" &&
//               selectedEvent.date !== "20-03-2025")
//           ) {
//             p.literary += 1;
//           } else if (
//             selectedEvent.category != "Deco" &&
//             selectedEvent.category != "Open Stage" &&
//             selectedEvent.category != "Media"
//           ) {
//             p.group += 1;
//           }
//         }
//       }
//     });

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
//         navigate("/captain");
//       })
//       .catch((error) => {
//         setLoading(false);
//         enqueueSnackbar("Error creating registration!", { variant: "error" });
//       });
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <div className="main-container">
//       <BackButton destination="/captain" />
//       <h1>Create Registration</h1>

//       <hr />

//       <p>Event : </p>
//       <select
//         name="event"
//         id="event"
//         value={event}
//         onChange={(e) => setEvent(e.target.value)}
//       >
//         <option value="">{""}</option>
//         {events?.map((e) => (
//           <option key={e._id} value={e.name}>
//             {e.name}
//           </option>
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
//             options={participantList}
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

// export default CreateRegistration;
