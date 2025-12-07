import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdEvent, 
  MdCategory, 
  MdPlace, 
  MdDateRange, 
  MdGroups, 
  MdLayers,
  MdAccessTime,
  MdEdit,
  MdArrowBack
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const ShowEvent = () => {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
        navigate("/");
        return;
    }

    setLoading(true);
    axios
      .get(`${apiUrl}/event/${id}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, isAuthenticated, isLoading, navigate, apiUrl]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper for Detail Items
  const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100 ${fullWidth ? "md:col-span-2" : ""}`}>
      <div className="p-2 bg-white rounded-full text-desi-saffron shadow-sm text-lg">
        {Icon && <Icon />}
      </div>
      <div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</p>
        <p className="text-stone-800 font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      role="Admin" 
      title="Event Details" 
      subtitle={`Viewing: ${event.name}`}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Back & Edit Actions */}
        <div className="flex justify-between items-center mb-6">
            <button 
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-stone-500 hover:text-desi-saffron transition-colors font-medium"
            >
                <MdArrowBack className="text-lg" /> Back to Dashboard
            </button>
            <button
                onClick={() => navigate(`/event/edit/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-desi-teal text-white rounded-lg shadow hover:bg-teal-800 transition-all"
            >
                <MdEdit /> Edit Event
            </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-saffron p-8 animate-fade-in-up">
            
            {/* Header */}
            <div className="border-b border-stone-100 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-reality tracking-wide mb-2">{event.name}</h1>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full border border-orange-100">
                            {event.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${event.registrationEnabled ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {event.registrationEnabled ? "Registration Open" : "Registration Closed"}
                        </span>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-stone-400 font-mono">ID: {event._id}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* Classification */}
                <h3 className="md:col-span-2 text-sm font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mt-2 mb-2">Overview</h3>
                <DetailItem icon={MdGroups} label="Participation" value={event.participation} />
                <DetailItem icon={MdLayers} label="Type" value={event.type} />
                
                {/* Logistics */}
                <h3 className="md:col-span-2 text-sm font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mt-4 mb-2">Logistics</h3>
                <DetailItem icon={MdDateRange} label="Date" value={event.date ? new Date(event.date).toLocaleDateString() : 'TBD'} />
                <DetailItem icon={MdPlace} label="Venue" value={event.venue} />

                {/* Limits */}
                <h3 className="md:col-span-2 text-sm font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mt-4 mb-2">Participation Limits</h3>
                <DetailItem icon={MdGroups} label="Team Size (Min-Max)" value={`${event.minIndividualLimit || 1} - ${event.maxIndividualLimit || 1} Members`} />
                <DetailItem icon={MdLayers} label="House Registration Limit" value={`${event.teamLimit} Entry per House`} />

            </div>

            {/* Metadata Footer */}
            <div className="bg-stone-50 rounded-lg p-4 text-xs text-stone-400 flex flex-col md:flex-row justify-between gap-2 font-mono border border-stone-100">
                <div className="flex items-center gap-2">
                    <MdAccessTime /> Created: {new Date(event.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                    <MdEdit /> Last Updated: {new Date(event.updatedAt).toLocaleString()}
                </div>
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShowEvent;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useAuth0 } from "@auth0/auth0-react";



// const ShowEvent = () => {
//   const [event, setEvent] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/event/${id}/`)
//       .then((response) => {
//         setEvent(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Show Events </h1>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div>
//           <div>
//             <span>ID : </span>
//             <span>{event._id}</span>
//           </div>
//           <div>
//             <span>Event Name : </span>
//             <span>{event.name}</span>
//           </div>
//           <div>
//             <span>Participation : </span>
//             <span>{event.participation}</span>
//           </div>
//           <div>
//             <span>Type : </span>
//             <span>{event.type}</span>
//           </div>
//           <div>
//             <span>Category : </span>
//             <span>{event.category}</span>
//           </div>
//           <div>
//             <span>Date : </span>
//             <span>{event.date}</span>
//           </div>
//           <div>
//             <span>Venue : </span>
//             <span>{event.venue}</span>
//           </div>
//           <div>
//             <span>Individual Limit : </span>
//             <span>{event.individualLimit}</span>
//           </div>
//           <div>
//             <span>Team Limit : </span>
//             <span>{event.teamLimit}</span>
//           </div>

//           <div>
//             <span>Create Time : </span>
//             <span>{new Date(event.createdAt).toString()}</span>
//           </div>
//           <div>
//             <span>Last Update Time : </span>
//             <span>{new Date(event.updatedAt).toString()}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowEvent;
