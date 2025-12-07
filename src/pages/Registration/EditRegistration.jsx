import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdEdit, 
  MdSave, 
  MdArrowBack, 
  MdEvent, 
  MdGroups, 
  MdPersonAdd,
  MdDelete
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import SearchableDropdown from "../../components/SearchableDropdown";

const EditRegistration = () => {
  const [event, setEvent] = useState("");
  const [house, setHouse] = useState("");
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New State for Extra Fields
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  // Constants
  const literaryEvents = ["Essay Writing", "Short Story", "Poetry"];
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // Helper flags
  const isLiterary = literaryEvents.includes(event);
  const isOpenMic = event === "Open Mic";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
        navigate("/");
        return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [regRes, houseRes, partRes] = await Promise.all([
            axios.get(`${apiUrl}/registration/${id}`),
            axios.get(`${apiUrl}/house/`),
            axios.get(`${apiUrl}/participant/`)
        ]);

        const data = regRes.data;
        setEvent(data.event);
        setHouse(data.house);
        setParticipants(data.participants);
        
        setHouses(houseRes.data.data);
        setParticipantList(partRes.data.data);
        
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading registration", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [id, isAuthenticated, isLoading, navigate, apiUrl, enqueueSnackbar]);

  const handleAddParticipants = () => {
    if (participantData) {
      // Check Duplicates
      if (participants.some(p => p.uid === participantData)) {
        enqueueSnackbar("Participant already added", { variant: "warning" });
        return;
      }

      // Check Special Fields
      if (isLiterary && !selectedLanguage) {
        enqueueSnackbar("Please select a language", { variant: "warning" });
        return;
      }
      if (isOpenMic && !performanceType) {
        enqueueSnackbar("Please enter the act type", { variant: "warning" });
        return;
      }

      const pObj = participantList.find((p) => p.uid === participantData);
      if (pObj) {
        setParticipants(old => [...old, {
            ...pObj,
            language: selectedLanguage || null,
            performanceType: performanceType || null
        }]);
        
        setParticipantData("");
        setSelectedLanguage("");
        setPerformanceType("");
      }
    }
  };

  const handleDeleteParticipants = (uid) => {
    setParticipants(participants.filter((p) => p.uid !== uid));
  };

  const handleEditRegistration = () => {
    const data = {
      event,
      house,
      participants,
    };

    setLoading(true);
    axios
      .put(`${apiUrl}/registration/${id}`, data)
      .then(() => {
        enqueueSnackbar("Registration Updated Successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar("Error updating registration", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout 
      role="Admin" 
      title="Edit Registration" 
      subtitle={`Updating ID: ${id}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. Configuration Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-saffron">
          <div className="flex items-center gap-2 mb-4 text-stone-800 font-bold text-lg">
            <MdEdit className="text-desi-saffron text-2xl" />
            <h3>Registration Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Read-Only Event */}
            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Event</label>
                <div className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-600 font-medium">
                    {event}
                </div>
            </div>

            {/* House Selector (Editable) */}
            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">House</label>
                <select
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none transition-all"
                >
                    {houses.filter(h => h.name !== "Admin").map((h) => (
                        <option key={h._id} value={h.name}>{h.name}</option>
                    ))}
                </select>
            </div>
          </div>
        </div>

        {/* 2. Participant Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-teal animate-fade-in">
            <div className="flex items-center gap-2 mb-6 text-stone-800 font-bold text-lg">
              <MdPersonAdd className="text-desi-teal text-2xl" />
              <h3>Manage Team</h3>
            </div>

            {/* Add Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-end mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
              <div className="flex-1 w-full">
                <SearchableDropdown
                  options={participantList.filter((p) => p.house.toLowerCase() === house.toLowerCase())}
                  label={`Add ${house} Student`}
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
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none"
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

            {/* Team List */}
            <div className="flex flex-wrap gap-3">
              {participants.map((p) => (
                <div key={p.uid} className="flex items-center gap-3 bg-white border border-stone-200 px-4 py-2 rounded-full group hover:border-red-200 transition-colors shadow-sm">
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
                    className="text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg transition-colors"
          >
            <MdArrowBack /> Cancel
          </button>
          <button
            onClick={handleEditRegistration}
            className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 active:scale-95 transition-all"
          >
            <MdSave /> Save Changes
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EditRegistration;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";
// import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";



// const EditRegistration = () => {
//   const [event, setEvent] = useState("");
//   const [house, setHouse] = useState("");
//   const [participantData, setParticipantData] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   const handleAddParticipants = () => {
//     if (participantData != "") {
//       let flag = false;
//       participants.forEach((participant) => {
//         if (participant == participantData) flag = true;
//       });

//       if (flag == false) {
//         console.log(participantData);
//         setParticipants((old) => [...old, participantData]);
//       }
//       setParticipantData("");
//     }
//   };

//   const handleDeleteParticipants = (e) => {
//     const uid = e.target.id;
//     console.log(e.target.id);
//     setParticipants(
//       participants.filter((participant) => {
//         console.log("p: ", participant, ", u: ", uid, participant != uid);
//         return participant != uid;
//       })
//     );
//     console.log(uid, participants);
//   };

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`)
//       .then((response) => {
//         setEvent(response.data.event);
//         setHouse(response.data.house);
//         setParticipants(response.data.participants);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//         alert("An error happened. Please check console");
//         console.log(error);
//       });
//   }, []);

//   const handleEditRegistration = () => {
//     const data = {
//       event,
//       house,
//       participants,
//     };
//     setLoading(true);
//     console.log(data);
//     axios
//       .put(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`, data)
//       .then((response) => {
//         setLoading(false);
//         enqueueSnackbar("Registration Edited successfully", {
//           variant: "success",
//         });
//         navigate("/admin");
//       })
//       .catch((error) => {
//         setLoading(false);
//         // alert('An error happened. Please check console')
//         enqueueSnackbar("Error!", { variant: "error" });
//         console.log(error);
//       });
//   };

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Edit Registration</h1>
//       {loading ? <Spinner /> : ""}
//       <div>
//         <div>
//           <label>Event</label>
//           <input
//             type="text"
//             value={event}
//             onChange={(e) => setEvent(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>House</label>
//           <select
//             name="house"
//             value={house}
//             onChange={(e) => setType(e.target.value)}
//             id="house"
//           >
//             <option value=""></option>
//             <option value="Mughals">Mughals</option>
//             <option value="Aryans">Aryans</option>
//             <option value="Spartans">Spartans</option>
//             <option value="Rajputs">Rajputs</option>
//             <option value="Vikings">Vikings</option>
//           </select>
//         </div>
//         <div>
//           <label>Participants</label>
//           <p>Added Participants : </p>
//           <div className="pill-container">
//             {participants &&
//               participants.map((participant) => (
//                 <button
//                   key={participant._id}
//                   id={participant}
//                   className="btn-pill"
//                   onClick={handleDeleteParticipants}
//                 >
//                   {participant.fullName} <MdOutlineDelete />
//                 </button>
//               ))}
//           </div>
//           <div className="sub-group">
//             <input
//               className="form-input"
//               type="text"
//               value={participantData}
//               onChange={(e) => setParticipantData(e.target.value)}
//             />
//             <button className="btn-outline" onClick={handleAddParticipants}>
//               + Participant
//             </button>
//           </div>
//         </div>
//         <button onClick={handleEditRegistration}>Edit</button>
//       </div>
//     </div>
//   );
// };

// export default EditRegistration;
