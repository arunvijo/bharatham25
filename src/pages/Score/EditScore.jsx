import React, { useState, useEffect } from "react";
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
  MdWarning,
  MdEmojiEvents,
  MdGrade
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const EditScore = () => {
  const [event, setEvent] = useState("");
  const [registration, setRegistration] = useState("");
  const [position, setPosition] = useState("");
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState("");
  const [isPenalty, setIsPenalty] = useState(false);

  const [eventList, setEventList] = useState([]);
  const [registrationList, setRegistrationList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/");

    const fetchData = async () => {
      setLoading(true);
      try {
        const [scoreRes, eventRes, regRes] = await Promise.all([
            axios.get(`${apiUrl}/score/${id}`),
            axios.get(`${apiUrl}/event/`),
            axios.get(`${apiUrl}/registration/`)
        ]);

        const score = scoreRes.data;
        setEvent(score.event);
        setRegistration(score.registration._id);
        setPosition(score.position);
        setPoints(score.points);
        setReason(score.reason);
        setIsPenalty(score.position === "Negative");

        setEventList(eventRes.data.data);
        setRegistrationList(regRes.data.data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading score details", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, isLoading, id, navigate, apiUrl, enqueueSnackbar]);

  const handlePositionSelect = (pos, defaultPoints) => {
    setPosition(pos);
    // Only reset points if switching to a standard position, otherwise keep existing
    // If switching TO penalty, set -5. If switching FROM penalty, set default.
    if (pos === "Negative") {
        setPoints(-5);
    } else {
        setPoints(defaultPoints);
    }
    
    setIsPenalty(pos === "Negative");
  };

  const handleEditScore = () => {
    const selectedReg = registrationList.find((r) => r._id === registration);
    
    const data = {
      event,
      house: selectedReg?.house,
      registration: selectedReg,
      position,
      points: parseInt(points),
      reason: isPenalty ? reason : "",
    };

    setLoading(true);
    axios
      .put(`${apiUrl}/score/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Score Updated Successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating score", { variant: "error" });
        console.error(error);
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper: Position Card
  const PositionCard = ({ label, value, defaultPoints, color, icon: Icon }) => (
    <button
        onClick={() => handlePositionSelect(value, defaultPoints)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
            position === value 
                ? `bg-${color}-50 border-${color}-500 shadow-md scale-105` 
                : `bg-white border-stone-100 hover:border-${color}-200 hover:bg-stone-50`
        }`}
    >
        <div className={`text-2xl mb-1 text-${color}-600`}>
            <Icon />
        </div>
        <span className={`font-bold text-xs uppercase tracking-wider text-${color}-800`}>{label}</span>
    </button>
  );

  return (
    <DashboardLayout 
      role="Admin" 
      title="Edit Score" 
      subtitle={`Updating Record ID: ${id}`}
    >
      <div className="max-w-4xl mx-auto">
        
        <div className={`bg-white rounded-xl shadow-lg border-t-4 p-8 animate-fade-in-up transition-colors duration-300 ${isPenalty ? 'border-desi-maroon' : 'border-desi-teal'}`}>
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-stone-100 pb-4">
            <div className={`p-3 rounded-full text-white ${isPenalty ? 'bg-desi-maroon' : 'bg-desi-teal'}`}>
              <MdEdit className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 font-reality tracking-wide">Modify Score</h2>
              <p className="text-sm text-stone-400">Correct points or change winners</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 1. Event Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Event</label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none font-medium text-stone-700"
              >
                {eventList.map((e) => (
                  <option key={e._id} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Team Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Winner / Team</label>
              <select
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-teal outline-none font-medium text-stone-700"
              >
                {registrationList
                  .filter((r) => r.event === event)
                  .map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.house} | {r.participants.map(p => p.fullName).join(", ")}
                    </option>
                  ))}
              </select>
            </div>

            {/* 3. Position Selector */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-3">Position / Grade</label>
                
                {/* Regular Positions */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                    <PositionCard label="1st" value="First" defaultPoints={10} color="yellow" icon={MdEmojiEvents} />
                    <PositionCard label="2nd" value="Second" defaultPoints={7} color="stone" icon={MdEmojiEvents} />
                    <PositionCard label="3rd" value="Third" defaultPoints={5} color="orange" icon={MdEmojiEvents} />
                    <PositionCard label="4th" value="Fourth" defaultPoints={3} color="blue" icon={MdEmojiEvents} />
                    <PositionCard label="5th" value="Fifth" defaultPoints={1} color="indigo" icon={MdEmojiEvents} />
                </div>

                {/* Grades & Penalty */}
                <div className="grid grid-cols-3 gap-3">
                    <PositionCard label="A Grade" value="A Grade" defaultPoints={8} color="teal" icon={MdGrade} />
                    <PositionCard label="B Grade" value="B Grade" defaultPoints={5} color="cyan" icon={MdGrade} />
                    <PositionCard label="Penalty" value="Negative" defaultPoints={-5} color="red" icon={MdWarning} />
                </div>
            </div>

            {/* 4. Points & Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Points Awarded</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className={`w-full p-3 bg-stone-50 border rounded-lg outline-none font-bold text-lg ${isPenalty ? 'text-red-600 border-red-200 focus:ring-red-500' : 'text-green-600 border-stone-200 focus:ring-desi-teal'}`}
                    />
                     <p className="text-[10px] text-stone-400 mt-1">
                        *Verify with Manual: A Grade = 8 or 15 pts | 4th = 10 or 20 pts
                    </p>
                </div>

                {isPenalty && (
                    <div className="animate-fade-in">
                        <label className="block text-xs font-bold text-red-500 uppercase mb-1.5">Reason for Penalty</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-red-800"
                        />
                    </div>
                )}
            </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-stone-100">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg transition-colors"
            >
              <MdArrowBack /> Cancel
            </button>
            <button
              onClick={handleEditScore}
              className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all ${isPenalty ? 'bg-desi-maroon hover:bg-red-900' : 'bg-desi-teal hover:bg-teal-800'}`}
            >
              <MdSave className="text-xl" /> Update Score
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditScore;