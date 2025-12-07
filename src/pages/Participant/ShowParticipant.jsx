import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdPerson, 
  MdSchool, 
  MdClass, 
  MdGroups,
  MdEmojiEvents,
  MdAppRegistration,
  MdArrowBack,
  MdScore
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import RegistrationTable from "../../components/registration/RegistrationTable";
import ScoreTable from "../../components/score/ScoreTable";

const ShowParticipant = () => {
  const [participant, setParticipant] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated && !isLoading) return navigate("/");
        setLoading(true);

        const [partRes, regRes, scoreRes] = await Promise.all([
          axios.get(`${apiUrl}/participant/${id}`),
          axios.get(`${apiUrl}/registration/by-participant/${id}`),
          axios.get(`${apiUrl}/score/by-participant/${id}`)
        ]);

        setParticipant(partRes.data);
        setRegistrations(regRes.data.data);
        setScores(scoreRes.data.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, isLoading, id, navigate, apiUrl]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper: Limit Badge
  const LimitBadge = ({ label, count, max }) => {
    const isFull = count >= max;
    return (
      <div className={`flex flex-col p-3 rounded-lg border ${isFull ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{label}</span>
        <div className="flex items-end gap-1">
          <span className={`text-2xl font-bold ${isFull ? 'text-red-600' : 'text-stone-800'}`}>{count || 0}</span>
          <span className="text-sm text-stone-400 font-medium mb-1">/ {max}</span>
        </div>
      </div>
    );
  };

  const totalScore = scores?.reduce((sum, curr) => sum + curr.points, 0) || 0;

  return (
    <DashboardLayout 
      role="Admin" 
      title="Student Profile" 
      subtitle={`Details for: ${participant.uid}`}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Action */}
        <button 
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-stone-500 hover:text-desi-saffron transition-colors font-medium"
        >
            <MdArrowBack className="text-lg" /> Back to Dashboard
        </button>

        {/* 1. Profile Header Card */}
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-desi-teal p-8 animate-fade-in-up flex flex-col md:flex-row justify-between gap-6">
            
            {/* Identity */}
            <div className="flex items-start gap-4">
                <div className="p-4 bg-teal-50 rounded-full text-desi-teal shadow-sm">
                    <MdPerson className="text-4xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-reality tracking-wide">{participant.fullName}</h1>
                    <p className="text-stone-500 font-mono font-medium">{participant.uid}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase rounded-full border border-stone-200 flex items-center gap-1">
                            <MdSchool /> {participant.branch}
                        </span>
                        <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase rounded-full border border-stone-200 flex items-center gap-1">
                            <MdClass /> {participant.semester}
                        </span>
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase rounded-full border border-orange-200 flex items-center gap-1">
                            <MdGroups /> {participant.house}
                        </span>
                    </div>
                </div>
            </div>

            {/* Big Score */}
            <div className="flex flex-col items-end justify-center border-l border-stone-100 pl-6">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total Contribution</span>
                <div className="flex items-center gap-2 text-desi-saffron">
                    <MdEmojiEvents className="text-4xl" />
                    <span className="text-5xl font-extrabold">{totalScore}</span>
                    <span className="text-sm font-bold text-stone-400 mt-4">Pts</span>
                </div>
            </div>
        </div>

        {/* 2. Participation Limits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LimitBadge label="Individual Events" count={participant.individual} max={5} />
            <LimitBadge label="Group Events" count={participant.group} max={3} />
            <LimitBadge label="Literary Events" count={participant.literary} max={4} />
        </div>

        {/* 3. Data Tables */}
        <div className="space-y-8">
            
            {/* Registrations */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                    <MdAppRegistration className="text-stone-400 text-xl" />
                    <h3 className="text-lg font-bold text-stone-800">Event Registrations</h3>
                </div>
                <div className="p-0">
                    <RegistrationTable registrations={registrations} />
                </div>
            </div>

            {/* Scores */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                    <MdScore className="text-stone-400 text-xl" />
                    <h3 className="text-lg font-bold text-stone-800">Performance History</h3>
                </div>
                <div className="p-0">
                    <ScoreTable scores={scores} />
                </div>
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ShowParticipant;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useAuth0 } from "@auth0/auth0-react";
// import RegistrationTable from "../../components/registration/RegistrationTable";
// import ScoreTable from "../../components/score/ScoreTable";

// const ShowParticipant = () => {
//   const [participant, setParticipant] = useState({});
//   const [registrations, setRegistrations] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [scores, setScores] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const participantResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/participant/${id}`
//         );
//         const data = participantResponse.data;

//         const registrationResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-participant/${id}`
//         );
//         console.log(
//           `https://bharatham-backend-j9s1.onrender.com/registration/by-participant/${id}`
//         );
//         const registrations = registrationResponse.data.data;

//         const scoreResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/score/by-participant/${id}`
//         );
//         console.log(
//           `https://bharatham-backend-j9s1.onrender.com/score/by-participant/${id}`
//         );
//         const scores = scoreResponse.data.data;

//         const eventResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/event/`
//         );
//         console.log(`https://bharatham-backend-j9s1.onrender.com/event/`);
//         const events = eventResponse.data.data;

//         setParticipant(data);
//         setEvents(events);
//         setRegistrations(registrations);
//         setScores(scores);

//         // console.log("Count : ", count);

//         console.log(data, scores, registrations.length);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) fetchData();
//   }, [isAuthenticated]);

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Show Participants </h1>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div>
//           <div>
//             <span>Full Name : </span>
//             <span>{participant.fullName}</span>
//           </div>
//           <div>
//             <span>UID : </span>
//             <span>{participant.uid}</span>
//           </div>
//           <div>
//             <span>Branch : </span>
//             <span>{participant.branch}</span>
//           </div>
//           <div>
//             <span>Semester :</span>
//             <span>{participant.semester}</span>
//           </div>
//           <div>
//             <span>House : </span>
//             <span>{participant.house}</span>
//           </div>
//           <div className="row">
//             <div>
//               <p>Participation Counts</p>
//               <ul>
//                 <li>Individual Events: {participant.individual || 0}</li>
//                 <li>Group Events: {participant.group || 0}</li>
//                 <li>Literary Events: {participant.literary || 0}</li>
//               </ul>
//               <p>Participation Limits</p>
//               <ul>
//                 <li>Individual Events: Max 5</li>
//                 <li>Literary Events: Max 4</li>
//                 <li>Group Events: Max 3</li>
//               </ul>
//             </div>
//           </div>
//           <strong>
//             Total Score : {scores?.reduce((sum, curr) => sum + curr.points, 0)}
//           </strong>
//           <RegistrationTable registrations={registrations} />
//           <ScoreTable scores={scores} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowParticipant;
