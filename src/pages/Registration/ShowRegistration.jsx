import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MdAppRegistration,
  MdPerson,
  MdAccessTime,
  MdEdit,
  MdArrowBack,
  MdGroups
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const ShowRegistration = () => {
  const [registration, setRegistration] = useState({});
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
      .get(`${apiUrl}/registration/${id}`)
      .then((response) => {
        setRegistration(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, isAuthenticated, isLoading, navigate, apiUrl]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper to color code houses
  const getHouseBadgeColor = (houseName) => {
    switch(houseName?.toLowerCase()) {
        case 'rajputs': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'spartans': return 'bg-red-100 text-red-800 border-red-200';
        case 'vikings': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'mughals': return 'bg-green-100 text-green-800 border-green-200';
        case 'aryans': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <DashboardLayout
      role="Admin"
      title="Registration Details"
      subtitle={`Viewing ID: ${registration._id}`}
    >
      <div className="max-w-4xl mx-auto">

        {/* Actions Row */}
        <div className="flex justify-between items-center mb-6">
            <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-stone-500 hover:text-desi-teal transition-colors font-medium"
            >
                <MdArrowBack className="text-lg" /> Back to Dashboard
            </button>
            
            <button
                onClick={() => navigate(`/registration/edit/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-lg border border-stone-200 hover:bg-white hover:border-desi-teal hover:text-desi-teal transition-all shadow-sm"
            >
                <MdEdit /> Edit Registration
            </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-teal p-8 animate-fade-in-up">

            {/* Header: Event & House */}
            <div className="border-b border-stone-100 pb-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900 font-reality tracking-wide mb-3 flex items-center gap-3">
                            <MdAppRegistration className="text-desi-teal" />
                            {registration.event}
                        </h1>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex w-fit items-center gap-1 ${getHouseBadgeColor(registration.house)}`}>
                            <MdGroups /> {registration.house} House
                        </span>
                    </div>
                    <div className="text-right bg-stone-50 p-3 rounded-lg border border-stone-100">
                         <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">Team Size</span>
                         <span className="text-2xl font-bold text-stone-800">{registration.participants?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Participants Grid */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">
                    Registered Participants
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {registration.participants?.map((p) => (
                        <div key={p._id || p.uid} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100 hover:border-desi-teal/30 transition-colors">
                            <div className="p-2 bg-white rounded-full text-stone-400 shadow-sm">
                                <MdPerson className="text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-stone-800 truncate">{p.fullName}</p>
                                <p className="text-xs text-stone-500 font-mono">{p.uid}</p>
                            </div>
                            
                            {/* Special Tags (Language / Act) */}
                            <div className="flex flex-col items-end gap-1">
                                {p.language && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                                        {p.language}
                                    </span>
                                )}
                                {p.performanceType && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                                        {p.performanceType}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Metadata */}
            <div className="bg-stone-50 rounded-lg p-4 text-xs text-stone-400 flex flex-col md:flex-row justify-between gap-2 font-mono border border-stone-100">
                <div className="flex items-center gap-2">
                    <MdAccessTime /> Registered: {new Date(registration.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                    <MdEdit /> Last Updated: {new Date(registration.updatedAt).toLocaleString()}
                </div>
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShowRegistration;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useAuth0 } from "@auth0/auth0-react";



// const ShowRegistration = () => {
//   const [registration, setRegistration] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`)
//       .then((response) => {
//         setRegistration(response.data);
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
//       <h1>Show Registration </h1>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div>
//           <div>
//             <span>ID : </span>
//             <span>{registration._id}</span>
//           </div>
//           <div>
//             <span>Event : </span>
//             <span>{registration.event}</span>
//           </div>
//           <div>
//             <span>House : </span>
//             <span>{registration.house}</span>
//           </div>
//           <div>
//             <span>Participants : </span>
//             <span>
//               {registration.participants && registration.participants.map((participant) => (
//                 <p key={participant._id}>{participant.fullName}</p>
//               ))}
//             </span>
//           </div>

//           <div>
//             <span>Create Time : </span>
//             <span>{new Date(registration.createdAt).toString()}</span>
//           </div>
//           <div>
//             <span>Last Update Time : </span>
//             <span>{new Date(registration.updatedAt).toString()}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowRegistration;
