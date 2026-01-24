import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdEmojiEvents, 
  MdSave, 
  MdArrowBack, 
  MdEvent, 
  MdGroups, 
  MdWarning
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const CreateScore = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [registrationList, setRegistrationList] = useState([]); 
  
  // Selection State
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventObj, setSelectedEventObj] = useState(null);
  const [registrationId, setRegistrationId] = useState("");
  
  // Score Details
  const [position, setPosition] = useState("");
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState("");
  const [isPenalty, setIsPenalty] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // --- 1. INITIAL LOAD (Fetch Events Only) ---
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
        navigate("/");
        return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/event/`);
        // Sort events alphabetically for easier finding
        const sortedEvents = response.data.data.sort((a, b) => 
            a.name.localeCompare(b.name)
        );
        setEventList(sortedEvents);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading events", { variant: "error" });
      }
    };

    if (isAuthenticated) fetchEvents();
  }, [isAuthenticated, isLoading, navigate, apiUrl, enqueueSnackbar]);

  // --- 2. HANDLE EVENT CHANGE (Lazy Load Registrations) ---
  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    
    // Reset dependent fields
    setRegistrationId("");
    setRegistrationList([]);
    setPosition("");
    setPoints(0);
    setIsPenalty(false);

    if (!eventId) return;

    // Find full event object
    const eventObj = eventList.find(ev => ev._id === eventId);
    setSelectedEventObj(eventObj);

    // Fetch registrations ONLY for this event
    setLoading(true);
    try {
        const res = await axios.get(`${apiUrl}/registration/by-event/${eventId}`);
        if(res.data.data.length === 0) {
            enqueueSnackbar("No registrations found for this event yet.", { variant: "info" });
        }
        setRegistrationList(res.data.data);
    } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching participants", { variant: "error" });
    } finally {
        setLoading(false);
    }
  };

  // --- 3. HANDLE POSITION SELECTION (Auto-Points) ---
  const handlePositionSelect = (pos, defaultPoints) => {
    setPosition(pos);
    setPoints(defaultPoints);
    setIsPenalty(pos === "Negative");
    
    // Clear reason if not penalty
    if (pos !== "Negative") setReason("");
  };

  // --- 4. SUBMIT SCORE ---
  const handleSaveScore = () => {
    // Validation
    if (!selectedEventId || !registrationId || !position || points === "") {
        enqueueSnackbar("Please fill in all required fields", { variant: "warning" });
        return;
    }

    const selectedReg = registrationList.find((r) => r._id === registrationId);
    if (!selectedReg) return;

    // --- FIX: Safe Data Extraction for Groups/Teams ---
    const firstPart = selectedReg.participants?.[0];
    // Fallback if participant list is empty (rare but possible)
    const safeUid = firstPart?.uid || `TEAM-${selectedReg.house.toUpperCase()}`;
    const safeName = firstPart?.fullName || `${selectedReg.house} Team`;

    // Construct Payload
    const data = {
      event: {
        id: selectedEventObj._id,
        name: selectedEventObj.name,
        type: selectedEventObj.participation
      },
      house: selectedReg.house,
      registrationId: selectedReg._id, 
      registration: selectedReg,       
      position,
      points: parseInt(points),
      reason: isPenalty ? reason : "",
      // Use the safe values here to prevent 400 Bad Request
      participant: {
        uid: safeUid,
        name: safeName
      }
    };

    setLoading(true);
    axios
      .post(`${apiUrl}/score/`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar(isPenalty ? "Penalty Applied" : "Score Added Successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        const msg = error.response?.data?.message || "Error saving score";
        enqueueSnackbar(msg, { variant: "error" });
        console.error(error);
      });
  };

  if (loading && !selectedEventObj) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // --- HELPER COMPONENT: POSITION CARD ---
  const PositionCard = ({ label, value, defaultPoints, color, icon: Icon }) => (
    <button
        onClick={() => handlePositionSelect(value, defaultPoints)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            position === value 
                ? `bg-${color}-50 border-${color}-500 shadow-md scale-105` 
                : `bg-white border-stone-100 hover:border-${color}-200 hover:bg-stone-50`
        }`}
    >
        <div className={`text-3xl mb-2 text-${color}-600`}>
            <Icon />
        </div>
        <span className={`font-bold text-sm uppercase tracking-wider text-${color}-800`}>{label}</span>
        <span className="text-xs text-stone-400 mt-1">{defaultPoints} pts</span>
    </button>
  );

  return (
    <DashboardLayout 
      role="Admin" 
      title="Score Management" 
      subtitle="Record Event Results"
    >
      <div className="max-w-3xl mx-auto pb-12">
        
        <div className={`bg-white rounded-xl shadow-lg border-t-4 p-8 animate-fade-in-up transition-colors duration-300 ${isPenalty ? 'border-desi-maroon' : 'border-desi-saffron'}`}>
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8 border-b border-stone-100 pb-4">
            <div className={`p-3 rounded-full text-white shadow-sm ${isPenalty ? 'bg-desi-maroon' : 'bg-desi-saffron'}`}>
              {isPenalty ? <MdWarning className="text-2xl" /> : <MdEmojiEvents className="text-2xl" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 font-reality tracking-wide">
                {isPenalty ? "Record Penalty" : "Award Points"}
              </h2>
              <p className="text-sm text-stone-400">Select event and assign winners</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 1. Event Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-1.5">
                <MdEvent className="text-desi-saffron" /> Select Event
              </label>
              <select
                value={selectedEventId}
                onChange={handleEventChange}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none font-bold text-stone-700"
              >
                <option value="">-- Choose Event --</option>
                {eventList.map((e) => (
                  <option key={e._id} value={e._id}>{e.name} ({e.category})</option>
                ))}
              </select>
            </div>

            {/* 2. Team/Student Selection (Filtered List) */}
            {selectedEventId && (
                <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-1.5">
                        <MdGroups className="text-desi-saffron" /> Select Winner / Team
                    </label>
                    <select
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none font-medium text-stone-700"
                    >
                        <option value="">-- Choose Registration --</option>
                        {registrationList.map((r) => (
                        <option key={r._id} value={r._id}>
                            {/* FIX: Always show names to distinguish multiple teams from same house */}
                            {r.house} — {r.participants.map(p => p.fullName).join(", ")}
                        </option>
                        ))}
                    </select>
                    <p className="text-xs text-right mt-1 text-stone-400">
                        {registrationList.length} qualified entries found
                    </p>
                </div>
            )}

            {/* 3. Position Podiums */}
{registrationId && (
    <div className="animate-fade-in space-y-6">
        <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-3">Position / Grade</label>
            
            {/* Standard Positions */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                <PositionCard label="1st" value="First" defaultPoints={10} color="yellow" icon={MdEmojiEvents} />
                <PositionCard label="2nd" value="Second" defaultPoints={7} color="stone" icon={MdEmojiEvents} />
                <PositionCard label="3rd" value="Third" defaultPoints={5} color="orange" icon={MdEmojiEvents} />
                <PositionCard label="4th" value="Fourth" defaultPoints={3} color="blue" icon={MdEmojiEvents} />
                <PositionCard label="5th" value="Fifth" defaultPoints={1} color="indigo" icon={MdEmojiEvents} />
            </div>

            {/* Special Grades & Penalty */}
            <div className="grid grid-cols-3 gap-3">
                <PositionCard label="A Grade" value="A Grade" defaultPoints={8} color="teal" icon={MdEmojiEvents} />
                <PositionCard label="B Grade" value="B Grade" defaultPoints={5} color="cyan" icon={MdEmojiEvents} />
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
                    className={`w-full p-3 bg-stone-50 border rounded-lg outline-none font-bold text-lg ${isPenalty ? 'text-red-600 border-red-200 focus:ring-red-500' : 'text-green-600 border-stone-200 focus:ring-desi-saffron'}`}
                />
                <p className="text-[10px] text-stone-400 mt-1">
                    *Check Manual: A Grade = 8 or 15 pts | 4th = 10 or 20 pts
                </p>
            </div>

            {isPenalty && (
                <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-red-500 uppercase mb-1.5">Reason for Penalty</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Late Submission / Disqualification"
                        className="w-full p-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-red-800"
                    />
                </div>
            )}
        </div>
    </div>
)}

          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-stone-100">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-6 py-3 text-stone-500 font-medium hover:bg-stone-100 rounded-lg transition-colors"
            >
              <MdArrowBack /> Cancel
            </button>
            <button
              onClick={handleSaveScore}
              disabled={loading || !position || !registrationId}
              className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isPenalty ? 'bg-desi-maroon hover:bg-red-900' : 'bg-desi-saffron hover:bg-amber-700'}`}
            >
              <MdSave className="text-xl" /> 
              {loading ? "Saving..." : (isPenalty ? "Apply Penalty" : "Save Score")}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateScore;