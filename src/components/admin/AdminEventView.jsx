import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { 
  MdEvent, 
  MdGroups, 
  MdPerson, 
  MdDelete, 
  MdArrowBack, 
  MdAppRegistration 
} from "react-icons/md";

// Components
import DashboardLayout from "../layout/DashboardLayout"; // Adjust path if needed (might be ../../components/layout)
import CaptainRegistrationTable from "../registration/CaptainRegistrationTable";
import Spinner from "../Spinner";

const AdminEventView = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated && !isLoading) {
            navigate("/");
            return;
        }
        setLoading(true);

        // 1. Fetch Event Details
        const eventResponse = await axios.get(`${apiUrl}/event/${id}`);
        setEvent(eventResponse.data);

        // 2. Fetch Registrations for this Event
        const registrationResponse = await axios.get(`${apiUrl}/registration/by-event/${id}`);
        setRegistrations(registrationResponse.data.data);

      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading event details", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, isLoading, id, navigate, apiUrl, enqueueSnackbar]);

  const handleDeleteRegistration = (e) => {
    const regId = e.currentTarget.id || e.target.id;
    
    if(!window.confirm("Are you sure you want to delete this registration?")) return;

    setLoading(true);

    axios
      .delete(`${apiUrl}/registration/${regId}`)
      .then(() => {
        setRegistrations((old) => old.filter((r) => r._id !== regId));
        enqueueSnackbar("Registration deleted successfully", { variant: "success" });
      })
      .catch((error) => {
        console.error("Error deleting:", error);
        const msg = error.response?.data?.message || "Error deleting registration!";
        enqueueSnackbar(msg, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading || !event) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  const maxLimit = event.maxIndividualLimit || event.maxTeamSize || 1;
  const minLimit = event.minIndividualLimit || event.minTeamSize || 1;

  return (
    <DashboardLayout
      role="Admin"
      title="Event Management"
      subtitle={`Managing: ${event.name}`}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Header Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-desi-saffron p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => navigate('/admin')} className="text-stone-400 hover:text-desi-saffron transition-colors">
                    <MdArrowBack size={24} />
                </button>
                <h1 className="text-3xl font-bold text-stone-900 font-reality tracking-wide flex items-center gap-2">
                    {event.name}
                </h1>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-stone-500 uppercase tracking-wider ml-8">
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.category}</span>
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.type}</span>
              <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">{event.participation}</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-right">
             <div className="text-center px-4 py-2 bg-teal-50 rounded-lg border border-teal-100">
                <span className="block text-xs text-teal-600 font-bold uppercase">Team Size</span>
                <span className="text-xl font-bold text-stone-800">{minLimit} - {maxLimit}</span>
             </div>
             <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <span className="block text-xs text-indigo-600 font-bold uppercase">Registrations</span>
                <span className="text-xl font-bold text-stone-800">{registrations.length}</span>
             </div>
          </div>
        </div>

        {/* 2. Registrations Table */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-teal overflow-hidden">
           <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
            <MdAppRegistration className="text-desi-teal text-xl" />
            <h3 className="text-lg font-bold text-stone-800">Registered Teams</h3>
          </div>
          <div className="p-0">
            {/* Reusing the robust Captain Table which handles deletion perfectly */}
            <CaptainRegistrationTable
                registrations={registrations}
                handleDeleteRegistration={handleDeleteRegistration}
                admin={true}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminEventView;

// import React, { useState, useEffect } from "react";
// import RegistrationTable from "../registration/RegistrationTable";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import axios from "axios";
// import { MdOutlineDelete } from "react-icons/md";
// import BackButton from "../BackButton";
// import CaptainRegistrationTable from "../registration/CaptainRegistrationTable";
// import SearchableDropdown from "../SearchableDropdown";

// const AdminEventView = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const [event, setEvent] = useState();
//   const [participantData, setParticipantData] = useState("");
//   const [participantList, setParticipantList] = useState([]);
//   const [participants, setParticipants] = useState([]);
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const participantResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/participant/`
//         );
//         const participantList = participantResponse.data.data;

//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/${id}`
//         );
//         const event = eventResponse.data;

//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-event/${id}`
//         );
//         const registrations = registrationResponse.data.data;

//         setEvent(event);
//         setParticipantList(participantList);
//         setRegistrations(registrations);
//         console.log(event?.teamLimit, registrations.length);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) fetchData();
//   }, [isAuthenticated]);

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

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>{event ? event.name : "View Event"}</h1>
//       <p>
//         {event?.participation} | {event?.type} | {event?.category}
//       </p>
//       <p>Max Team Registration : {event?.teamLimit}</p>
//       <p>Min Members per Team : {event?.minIndividualLimit}</p>
//       <p>Max Members per Team : {event?.maxIndividualLimit}</p>
//       <CaptainRegistrationTable
//         registrations={registrations}
//         handleDeleteRegistration={handleDeleteRegistration}
//       />
//     </div>
//   );
// };

// export default AdminEventView;
