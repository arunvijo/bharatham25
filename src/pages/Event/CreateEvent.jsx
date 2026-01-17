import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdEvent, 
  MdSave, 
  MdArrowBack, 
  MdImage, 
  MdCategory, 
  MdDateRange, 
  MdPlace,
  MdGroups,
  MdLayers,
  MdToggleOn,
  MdToggleOff,
  MdInfo
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const CreateEvent = () => {
  // --- STATE MANAGEMENT ---
  const [name, setName] = useState("");
  const [participation, setParticipation] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  
  // Numerical Limits (Aligned with Backend Schema)
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxRegistrations, setMaxRegistrations] = useState(1);
  
  // Logic Flags
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [isPreEvent, setIsPreEvent] = useState(false);
  const [countsTowardsLimit, setCountsTowardsLimit] = useState(true);

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Environment Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  // Auth Check
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
        navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // --- HANDLERS ---

  const handleSaveEvent = async () => {
    // 1. Basic Validation
    if (!name || !participation || !type || !category) {
      enqueueSnackbar("Please fill in all required fields (Name, Type, Category, Participation)", { variant: "warning" });
      return;
    }

    // 2. Prepare Payload (Strict Typing)
    const data = {
      name,
      image: image || "", // Send empty string if null
      participation,
      type,
      category,
      date: date || "TBD",
      venue: venue || "Main Stage",
      
      // CRITICAL: Convert to Numbers to prevent 'CastError' on Backend
      minTeamSize: Number(minTeamSize),
      maxTeamSize: Number(maxTeamSize),
      maxRegistrations: Number(maxRegistrations),
      
      // New Logic Fields
      registrationEnabled,
      isPreEvent,
      countsTowardsLimit
    };

    setLoading(true);
    try {
        // 3. Send Request
        const response = await axios.post(`${apiUrl}/event/`, data);
        
        if (response.status === 201) {
            enqueueSnackbar(`Event "${name}" created successfully!`, { variant: "success" });
            navigate("/admin");
        }
    } catch (error) {
        console.error("Create Error:", error);
        const msg = error.response?.data?.message || "Failed to create event. Check console.";
        enqueueSnackbar(msg, { variant: "error" });
    } finally {
        setLoading(false);
    }
  };

  // --- UI HELPERS ---

  if (loading) {
      return (
        <div className="h-screen flex items-center justify-center bg-stone-50">
            <Spinner />
        </div>
      );
  }

  const Label = ({ children, icon: Icon }) => (
    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 flex items-center gap-1.5 tracking-wide">
      {Icon && <Icon className="text-desi-saffron text-sm" />}
      {children}
    </label>
  );

  const inputClass = "w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron focus:bg-white focus:border-desi-saffron transition-all outline-none text-stone-700 font-medium text-sm shadow-sm";

  return (
    <DashboardLayout 
      role="Admin" 
      title="Event Management" 
      subtitle="Create New Competition"
    >
      <div className="max-w-5xl mx-auto pb-12">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border-t-8 border-desi-saffron overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl text-desi-saffron shadow-sm">
                <MdEvent className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-800 font-reality tracking-tight">Create New Event</h2>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-1">Bharatham 2026 Official Entry</p>
              </div>
            </div>
            
            {/* Quick Status Toggle */}
            <button 
                onClick={() => setRegistrationEnabled(!registrationEnabled)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-sm border ${
                    registrationEnabled 
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
            >
                {registrationEnabled ? <MdToggleOn size={20}/> : <MdToggleOff size={20}/>}
                {registrationEnabled ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED'}
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLUMN 1: Basic Identity */}
            <div className="space-y-6">
                <div className="md:col-span-2">
                    <Label icon={MdEvent}>Event Name</Label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className={inputClass} 
                        placeholder="e.g. Battle of Bands" 
                    />
                </div>

                <div>
                    <Label icon={MdImage}>Cover Image URL</Label>
                    <input 
                        type="text" 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)} 
                        className={inputClass} 
                        placeholder="https://imgur.com/..." 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label icon={MdDateRange}>Date</Label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            className={inputClass} 
                        />
                    </div>
                    <div>
                        <Label icon={MdPlace}>Venue</Label>
                        <input 
                            type="text" 
                            value={venue} 
                            onChange={(e) => setVenue(e.target.value)} 
                            className={inputClass} 
                            placeholder="e.g. Main Stage" 
                        />
                    </div>
                </div>
            </div>

            {/* COLUMN 2: Categorization */}
            <div className="space-y-6">
                <div>
                    <Label icon={MdGroups}>Participation Mode</Label>
                    <select 
                        value={participation} 
                        onChange={(e) => setParticipation(e.target.value)} 
                        className={inputClass}
                    >
                        <option value="">Select Mode</option>
                        <option value="Individual">Individual (Solo)</option>
                        <option value="Group">Group (Team)</option>
                    </select>
                </div>

                <div>
                    <Label icon={MdLayers}>Event Context</Label>
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                        className={inputClass}
                    >
                        <option value="">Select Type</option>
                        <option value="On-Stage">On-Stage (Performance)</option>
                        <option value="Off-Stage">Off-Stage (Competition)</option>
                        <option value="Pre-Event">Pre-Event (Early Submission)</option>
                    </select>
                </div>

                <div>
                    <Label icon={MdCategory}>Category Genre</Label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className={inputClass}
                    >
                        <option value="">Select Genre</option>
                        <option value="Music">Music</option>
                        <option value="Dance">Dance</option>
                        <option value="Theatre">Theatre</option>
                        <option value="Literary">Literary</option>
                        <option value="Art">Fine Arts</option>
                        <option value="General">General / Variety</option>
                        <option value="Media">Media / Photography</option>
                    </select>
                </div>
            </div>

            {/* FULL WIDTH: Rules & Logic Configuration */}
            <div className="md:col-span-2 mt-4">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-stone-200">
                        <MdInfo className="text-desi-teal text-xl" />
                        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider">Configuration & Limits</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label>Min Students / Team</Label>
                            <input 
                                type="number" 
                                min="1"
                                value={minTeamSize} 
                                onChange={(e) => setMinTeamSize(e.target.value)} 
                                className={`${inputClass} bg-white`} 
                            />
                            <p className="text-[10px] text-stone-400 mt-1">Min 1 for Solo</p>
                        </div>
                        <div>
                            <Label>Max Students / Team</Label>
                            <input 
                                type="number" 
                                min="1"
                                value={maxTeamSize} 
                                onChange={(e) => setMaxTeamSize(e.target.value)} 
                                className={`${inputClass} bg-white`} 
                            />
                            <p className="text-[10px] text-stone-400 mt-1">Upper limit for registration</p>
                        </div>
                        <div>
                            <Label>Max Entries / House</Label>
                            <input 
                                type="number" 
                                min="1"
                                value={maxRegistrations} 
                                onChange={(e) => setMaxRegistrations(e.target.value)} 
                                className={`${inputClass} bg-white`} 
                            />
                            <p className="text-[10px] text-stone-400 mt-1">Total teams allowed per house</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Toggle 1: Limit Logic */}
                        <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${countsTowardsLimit ? 'bg-teal-50 border-teal-200' : 'bg-white border-stone-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={countsTowardsLimit} 
                                onChange={(e) => setCountsTowardsLimit(e.target.checked)} 
                                className="w-5 h-5 accent-desi-teal mr-3" 
                            />
                            <div>
                                <span className="block text-sm font-bold text-stone-800">Counts towards 5/3 Limit</span>
                                <span className="block text-xs text-stone-500 mt-0.5">Uncheck for Graffiti, Patriotic Song, etc.</span>
                            </div>
                        </label>

                        {/* Toggle 2: Pre-Event Logic */}
                        <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${isPreEvent ? 'bg-orange-50 border-orange-200' : 'bg-white border-stone-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={isPreEvent} 
                                onChange={(e) => setIsPreEvent(e.target.checked)} 
                                className="w-5 h-5 accent-desi-saffron mr-3" 
                            />
                            <div>
                                <span className="block text-sm font-bold text-stone-800">Is Pre-Event</span>
                                <span className="block text-xs text-stone-500 mt-0.5">Enforces Jan 4 Deadline Logic (except Turn Around)</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="bg-stone-50 px-8 py-6 border-t border-stone-100 flex justify-end gap-4">
            <button 
                onClick={() => navigate("/admin")} 
                className="flex items-center gap-2 px-6 py-3 text-stone-500 font-bold hover:bg-stone-200 rounded-xl transition-all"
            >
              <MdArrowBack /> Cancel
            </button>
            <button 
                onClick={handleSaveEvent} 
                disabled={loading}
                className="flex items-center gap-3 px-8 py-3 bg-desi-saffron text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <MdSave className="text-xl" /> 
              {loading ? "Creating..." : "Confirm & Create"}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;