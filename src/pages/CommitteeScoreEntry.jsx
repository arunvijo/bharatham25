import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { 
  MdEmojiEvents, 
  MdEvent, 
  MdGroups, 
  MdWarning,
  MdLock,
  MdCheckCircle,
  MdHistory
} from "react-icons/md";
import Spinner from "../components/Spinner";

const CommitteeScoreEntry = () => {
  // --- SECURITY ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const COMMITTEE_PIN = "2026"; // Shared PIN for the 3 members

  // --- DATA ---
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [registrationList, setRegistrationList] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]); // Local history for this session only
  
  // --- FORM STATE ---
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventObj, setSelectedEventObj] = useState(null);
  const [registrationId, setRegistrationId] = useState("");
  const [position, setPosition] = useState("");
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState("");
  const [isPenalty, setIsPenalty] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // --- 1. LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === COMMITTEE_PIN) {
      setIsAuthenticated(true);
      fetchEvents();
      enqueueSnackbar("Committee Panel Unlocked", { variant: "success" });
    } else {
      enqueueSnackbar("Invalid PIN", { variant: "error" });
    }
  };

  // --- 2. LOAD EVENTS ---
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/event/`);
      const sortedEvents = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
      setEventList(sortedEvents);
    } catch (error) {
      enqueueSnackbar("Error loading events", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLE EVENT CHANGE ---
  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    setRegistrationId(""); // Clear winner
    setRegistrationList([]);
    
    if (!eventId) return;

    const eventObj = eventList.find(ev => ev._id === eventId);
    setSelectedEventObj(eventObj);

    setLoading(true);
    try {
        const res = await axios.get(`${apiUrl}/registration/by-event/${eventId}`);
        setRegistrationList(res.data.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  // --- 4. PRE-FILL POINTS ---
  const handlePositionSelect = (pos, defaultPoints) => {
    setPosition(pos);
    setPoints(defaultPoints);
    setIsPenalty(pos === "Negative");
    if (pos !== "Negative") setReason("");
  };

  // --- 5. SUBMIT (FAST ENTRY MODE) ---
  const handleSaveScore = () => {
    if (!selectedEventId || !registrationId || !position || points === "") {
        enqueueSnackbar("Missing fields", { variant: "warning" });
        return;
    }

    const selectedReg = registrationList.find((r) => r._id === registrationId);
    if (!selectedReg) return;

    const participantName = selectedEventObj.participation === "Individual" 
        ? selectedReg.participants[0]?.fullName 
        : `${selectedReg.house} Team`;

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
      participant: {
        uid: selectedReg.participants[0]?.uid,
        name: selectedReg.participants[0]?.fullName
      }
    };

    setLoading(true);
    axios.post(`${apiUrl}/score/`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Score Saved!", { variant: "success" });

        // Add to local session history (Visual confirmation)
        setSessionHistory(prev => [{
            id: Date.now(),
            event: selectedEventObj.name,
            winner: participantName,
            position: position,
            time: new Date().toLocaleTimeString()
        }, ...prev]);

        // RESET FORM (But keep Event selected for speed if needed, or reset all?)
        // Strategy: Reset Winner/Position but keep Event (usually entering multiple for same event)
        setRegistrationId("");
        setPosition("");
        setPoints(0);
        setReason("");
        setIsPenalty(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error saving score", { variant: "error" });
      });
  };

  // --- VIEW: LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
           <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-desi-saffron">
              <MdLock size={32} />
           </div>
           <h2 className="text-2xl font-bold text-stone-800 mb-2">Committee Access</h2>
           <form onSubmit={handleLogin}>
             <input 
               type="password" value={pin} onChange={e => setPin(e.target.value)}
               className="w-full text-center text-2xl tracking-[0.5em] font-bold p-3 border-2 border-stone-200 rounded-xl mb-4 focus:border-desi-saffron focus:outline-none"
               placeholder="••••" maxLength={4} autoFocus
             />
             <button type="submit" className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-700">Unlock</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 pb-12 font-sans">
       {/* Header */}
       <div className="bg-stone-900 text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
             <MdEmojiEvents className="text-desi-saffron text-2xl" />
             <span className="font-qawatone text-2xl tracking-wide">Score Entry</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-stone-400 hover:text-white uppercase">Logout</button>
       </div>

       <div className="max-w-4xl mx-auto p-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT: INPUT FORM */}
          <div className="md:col-span-2 space-y-6">
             <div className={`bg-white rounded-xl shadow-lg border-t-4 p-6 transition-colors duration-300 ${isPenalty ? 'border-desi-maroon' : 'border-desi-saffron'}`}>
                
                {/* Event Select */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block flex items-center gap-2">
                        <MdEvent /> Select Event
                    </label>
                    <select value={selectedEventId} onChange={handleEventChange} className="w-full p-3 bg-stone-50 border rounded-lg font-bold text-stone-800 text-lg">
                        <option value="">-- Choose Event --</option>
                        {eventList.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                </div>

                {/* Winner Select */}
                {selectedEventId && (
                    <div className="mb-6 animate-fade-in">
                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block flex items-center gap-2">
                        <MdGroups /> Select Winner
                    </label>
                    <select value={registrationId} onChange={e => setRegistrationId(e.target.value)} className="w-full p-3 bg-stone-50 border rounded-lg font-medium text-lg">
                        <option value="">-- Choose Entry --</option>
                        {registrationList.map(r => (
                            <option key={r._id} value={r._id}>
                            {selectedEventObj?.participation === "Individual" 
                                ? `${r.participants[0]?.fullName} (${r.house})` 
                                : `${r.house} House Team`}
                            </option>
                        ))}
                    </select>
                    </div>
                )}

                {/* Position & Points */}
                {registrationId && (
                <div className="mb-6 animate-fade-in">
                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">Position</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                        {l: "1st", p: 10, v:"First"}, {l: "2nd", p: 7, v:"Second"}, 
                        {l: "3rd", p: 5, v:"Third"}, {l: "Pen", p: -5, v:"Negative"}
                        ].map((opt) => (
                            <button 
                            key={opt.l} onClick={() => handlePositionSelect(opt.v, opt.p)}
                            className={`p-2 rounded-lg font-bold border-2 transition-all ${
                                position === opt.v ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-100 text-stone-500'
                            }`}
                            >
                            {opt.l}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-stone-400 uppercase">Points</label>
                            <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="w-full p-3 border rounded-lg font-bold text-xl" />
                        </div>
                        {isPenalty && (
                            <div className="flex-[2]">
                                <label className="text-xs font-bold text-red-400 uppercase">Reason</label>
                                <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full p-3 border border-red-200 bg-red-50 rounded-lg text-red-800" />
                            </div>
                        )}
                    </div>
                </div>
                )}

                <button 
                onClick={handleSaveScore}
                disabled={loading || !registrationId || !points}
                className={`w-full py-4 mt-2 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 ${isPenalty ? 'bg-desi-maroon' : 'bg-desi-saffron'}`}
                >
                {loading ? <Spinner small /> : <><MdCheckCircle className="text-xl"/> CONFIRM SCORE</>}
                </button>
             </div>
          </div>

          {/* RIGHT: SESSION HISTORY */}
          <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 h-full">
                  <h3 className="text-sm font-bold text-stone-400 uppercase mb-4 flex items-center gap-2">
                      <MdHistory /> Recent Entries
                  </h3>
                  {sessionHistory.length === 0 ? (
                      <p className="text-xs text-stone-300 text-center italic mt-10">No scores added in this session yet.</p>
                  ) : (
                      <div className="space-y-3 overflow-y-auto max-h-[500px]">
                          {sessionHistory.map((item) => (
                              <div key={item.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-sm">
                                  <p className="font-bold text-stone-800 truncate">{item.event}</p>
                                  <div className="flex justify-between items-center mt-1">
                                      <span className="text-stone-500 text-xs truncate max-w-[120px]">{item.winner}</span>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.position === "Negative" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                          {item.position}
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>

       </div>
    </div>
  );
};

export default CommitteeScoreEntry;