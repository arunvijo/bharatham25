import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdEvent, MdSave, MdArrowBack, MdImage, MdCategory, 
  MdDateRange, MdPlace, MdGroups, MdToggleOn, MdToggleOff 
} from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const EditEvent = () => {
  const [name, setName] = useState("");
  const [participation, setParticipation] = useState("Individual");
  const [image, setImage] = useState("");
  const [type, setType] = useState("On-Stage");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  
  // Matched to Backend Schema
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxRegistrations, setMaxRegistrations] = useState(1);
  
  // Logic Flags
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [isPreEvent, setIsPreEvent] = useState(false);
  const [countsTowardsLimit, setCountsTowardsLimit] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch Existing Data
  useEffect(() => {
    setLoading(true);
    axios.get(`${apiUrl}/event/${id}`)
      .then((response) => {
        const data = response.data;
        setName(data.name || "");
        setImage(data.image || "");
        setParticipation(data.participation || "Individual");
        setType(data.type || "On-Stage");
        setCategory(data.category || "General");
        setVenue(data.venue || "");
        
        // Date Handling
        if (data.date && data.date !== "TBD") {
            const d = new Date(data.date);
            if(!isNaN(d)) setDate(d.toISOString().split('T')[0]);
        }

        // Limit Handling - Check both new and old keys if migrating
        setMinTeamSize(data.minTeamSize || data.minIndividualLimit || 1);
        setMaxTeamSize(data.maxTeamSize || data.maxIndividualLimit || 1);
        setMaxRegistrations(data.maxRegistrations || data.teamLimit || 1);
        
        // Flags
        setRegistrationEnabled(data.registrationEnabled ?? true);
        setIsPreEvent(data.isPreEvent ?? false);
        setCountsTowardsLimit(data.countsTowardsLimit ?? true);
        
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error loading event data", { variant: "error" });
        console.error(error);
      });
  }, [id, apiUrl, enqueueSnackbar]);

  const handleEditEvent = () => {
    // Basic Validation
    if (!name || !participation || !type || !category) {
        enqueueSnackbar("Please fill all required fields", { variant: "warning" });
        return;
    }

    const data = {
      name,
      image,
      participation,
      type,
      category,
      date: date || "TBD",
      venue,
      // Explicitly Cast to Number to prevent 'CastError' and ensure backend accepts it
      minTeamSize: Number(minTeamSize),
      maxTeamSize: Number(maxTeamSize),
      maxRegistrations: Number(maxRegistrations),
      registrationEnabled,
      isPreEvent,
      countsTowardsLimit
    };

    setLoading(true);
    axios.put(`${apiUrl}/event/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Event updated successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        const msg = error.response?.data?.message || "Error updating event";
        enqueueSnackbar(msg, { variant: "error" });
        console.error("Update Error:", error);
      });
  };

  if (loading || isLoading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  const inputClass = "w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none text-sm";
  const Label = ({ children }) => <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{children}</label>;

  return (
    <DashboardLayout role="Admin" title="Edit Event" subtitle={name}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-teal p-8">
          
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-stone-800">Event Configuration</h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => setRegistrationEnabled(!registrationEnabled)}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${registrationEnabled ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                >
                    {registrationEnabled ? <MdToggleOn size={16}/> : <MdToggleOff size={16}/>}
                    {registrationEnabled ? "REGISTRATION OPEN" : "CLOSED"}
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Event Name</Label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <Label>Image URL</Label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
            </div>

            <div>
              <Label>Participation</Label>
              <select value={participation} onChange={(e) => setParticipation(e.target.value)} className={inputClass}>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div>
              <Label>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="On-Stage">On-Stage</option>
                <option value="Off-Stage">Off-Stage</option>
                <option value="Pre-Event">Pre-Event</option>
              </select>
            </div>

            <div>
              <Label>Date</Label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>

            <div>
              <Label>Venue</Label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClass} />
            </div>

            {/* Logic Control Panel */}
            <div className="md:col-span-2 bg-stone-50 p-4 rounded-lg border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 pb-2 border-b border-stone-200 mb-2">
                    <h3 className="text-xs font-bold text-stone-400 uppercase">Rules & Limits</h3>
                </div>
                
                <div>
                  <Label>Min Team Size</Label>
                  <input type="number" value={minTeamSize} onChange={(e) => setMinTeamSize(e.target.value)} className="w-full p-2 bg-white border rounded" />
                </div>
                <div>
                  <Label>Max Team Size</Label>
                  <input type="number" value={maxTeamSize} onChange={(e) => setMaxTeamSize(e.target.value)} className="w-full p-2 bg-white border rounded" />
                </div>
                <div>
                  <Label>House Entry Limit</Label>
                  <input type="number" value={maxRegistrations} onChange={(e) => setMaxRegistrations(e.target.value)} className="w-full p-2 bg-white border rounded" />
                </div>

                <div className="md:col-span-3 flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={countsTowardsLimit} onChange={(e) => setCountsTowardsLimit(e.target.checked)} className="accent-desi-teal" />
                        <span className="text-xs font-medium text-stone-600">Counts towards 5/3 Limit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isPreEvent} onChange={(e) => setIsPreEvent(e.target.checked)} className="accent-desi-teal" />
                        <span className="text-xs font-medium text-stone-600">Is Pre-Event (Jan 4 Deadline)</span>
                    </label>
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button onClick={() => navigate("/admin")} className="px-6 py-2 text-stone-500 hover:bg-stone-100 rounded-lg">Cancel</button>
            <button onClick={handleEditEvent} className="flex items-center gap-2 px-8 py-3 bg-desi-teal text-white font-bold rounded-lg shadow hover:bg-teal-800 transition-all">
              <MdSave /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditEvent;