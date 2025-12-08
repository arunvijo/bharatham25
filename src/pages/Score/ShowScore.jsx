import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MdEmojiEvents,
  MdWarning,
  MdEvent,
  MdGroups,
  MdPerson,
  MdAccessTime,
  MdEdit,
  MdArrowBack
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const ShowScore = () => {
  const [score, setScore] = useState({});
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
      .get(`${apiUrl}/score/${id}`)
      .then((response) => {
        setScore(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, isAuthenticated, isLoading, navigate, apiUrl]);

  if (loading || !score._id) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  const isPenalty = score.position === "Negative";
  const themeColor = isPenalty ? "red" : "yellow";
  const ThemeIcon = isPenalty ? MdWarning : MdEmojiEvents;

  return (
    <DashboardLayout
      role="Admin"
      title="Score Details"
      subtitle={`Record ID: ${score._id}`}
    >
      <div className="max-w-3xl mx-auto">

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
            <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-stone-500 hover:text-desi-saffron transition-colors font-medium"
            >
                <MdArrowBack className="text-lg" /> Back to Dashboard
            </button>
            
            <button
                onClick={() => navigate(`/score/edit/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-lg border border-stone-200 hover:bg-white hover:border-desi-saffron hover:text-desi-saffron transition-all shadow-sm"
            >
                <MdEdit /> Edit Score
            </button>
        </div>

        {/* Main Result Card */}
        <div className={`bg-white rounded-xl shadow-lg border-t-8 p-8 animate-fade-in-up ${isPenalty ? 'border-desi-maroon' : 'border-desi-saffron'}`}>

            {/* Header: Position & Points */}
            <div className="flex flex-col items-center justify-center text-center mb-8 border-b border-stone-100 pb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-md ${isPenalty ? 'bg-red-50 text-desi-maroon' : 'bg-yellow-50 text-yellow-600'}`}>
                    <ThemeIcon className="text-5xl" />
                </div>
                
                <h2 className={`text-4xl font-bold font-reality tracking-wide mb-1 ${isPenalty ? 'text-desi-maroon' : 'text-stone-800'}`}>
                    {score.position}
                </h2>
                <p className="text-stone-400 font-bold uppercase tracking-widest text-sm mb-4">
                    {isPenalty ? "Penalty Applied" : "Place Secured"}
                </p>

                <div className={`px-6 py-2 rounded-full text-2xl font-extrabold flex items-center gap-2 ${isPenalty ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <span>{score.points > 0 ? "+" : ""}{score.points}</span>
                    <span className="text-xs uppercase font-bold opacity-70 pt-1">Points</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Event Info */}
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <span className="text-xs font-bold text-stone-400 uppercase block mb-2">Event Details</span>
                    <div className="flex items-center gap-3 text-stone-800 font-bold text-lg">
                        <MdEvent className="text-desi-saffron" />
                        {score.event}
                    </div>
                    <div className="flex items-center gap-3 text-stone-600 font-medium mt-2">
                        <MdGroups className="text-stone-400" />
                        {score.house} House
                    </div>
                </div>

                {/* Reason (If Penalty) */}
                {isPenalty && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <span className="text-xs font-bold text-red-400 uppercase block mb-2">Reason for Penalty</span>
                        <p className="text-red-800 font-medium italic">"{score.reason || "Rule Violation"}"</p>
                    </div>
                )}

                {/* Participants */}
                <div className={`bg-stone-50 p-4 rounded-lg border border-stone-100 ${!isPenalty ? 'md:col-span-1' : 'md:col-span-2'}`}>
                    <span className="text-xs font-bold text-stone-400 uppercase block mb-2">Participants</span>
                    <div className="flex flex-col gap-2">
                        {score.registration?.participants?.map((p) => (
                            <div key={p.uid} className="flex items-center gap-2 text-sm text-stone-700">
                                <MdPerson className="text-stone-300" />
                                <span className="font-mono text-stone-400 text-xs">{p.uid}</span>
                                <span className="font-bold">{p.fullName}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Metadata */}
            <div className="flex justify-between text-xs text-stone-400 font-mono border-t border-stone-100 pt-4">
                <div className="flex items-center gap-1">
                    <MdAccessTime /> Recorded: {new Date(score.createdAt).toLocaleDateString()}
                </div>
                <div>Last Update: {new Date(score.updatedAt).toLocaleTimeString()}</div>
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShowScore;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useAuth0 } from "@auth0/auth0-react";



// const ShowScore = () => {
//   const [score, setScore] = useState();
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/score/${id}/`)
//       .then((response) => {
//         setScore(response.data);
//         console.log(response.data);
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
//       <h1>Show Scores </h1>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div>
//           <div>
//             <span>ID : </span>
//             <span>{score?._id}</span>
//           </div>
//           <div>
//             <span>Event : </span>
//             <span>{score?.event}</span>
//           </div>
//           <div>
//             <span>House : </span>
//             <span>{score?.house}</span>
//           </div>
//           <div>
//             <span>Participants : </span>
//             <span>
//               {score?.registration.participants.map(
//                 (p) => `${p.uid} | ${p.fullName} `
//               )}
//             </span>
//           </div>
//           <div>
//             <span>Position : </span>
//             <span>{score?.position}</span>
//           </div>
//           <div>
//             <span>Points : </span>
//             <span>{score?.points}</span>
//           </div>

//           <div>
//             <span>Create Time : </span>
//             <span>{new Date(score?.createdAt).toString()}</span>
//           </div>
//           <div>
//             <span>Last Update Time : </span>
//             <span>{new Date(score?.updatedAt).toString()}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowScore;
