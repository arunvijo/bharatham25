import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  MdToggleOff
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

// Helper functions for date format conversion
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  // Handle "2025-10-24T00:00..." ISO strings from DB
  if (dateStr.includes('T')) return dateStr.split('T')[0];
  
  // Handle custom dd-mm-yyyy
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
};

const EditEvent = () => {
  const [name, setName] = useState("");
  const [participation, setParticipation] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [maxIndividualLimit, setMaxIndividualLimit] = useState(1);
  const [minIndividualLimit, setMinIndividualLimit] = useState(1);
  const [teamLimit, setTeamLimit] = useState(0);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/event/${id}`)
      .then((response) => {
        const data = response.data;
        setName(data.name);
        setImage(data.image);
        setParticipation(data.participation);
        setType(data.type);
        setCategory(data.category);
        setDate(formatDateForInput(data.date));
        setVenue(data.venue);
        setMaxIndividualLimit(data.maxIndividualLimit);
        setMinIndividualLimit(data.minIndividualLimit);
        setTeamLimit(data.teamLimit);
        setRegistrationEnabled(data.registrationEnabled ?? true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error loading event details", { variant: "error" });
        console.error(error);
      });
  }, [id, enqueueSnackbar, apiUrl]);

  const handleEditEvent = () => {
    const data = {
      name,
      image,
      participation,
      type,
      category,
      date, // Send as YYYY-MM-DD (Standard ISO is safer for DB)
      venue,
      minIndividualLimit,
      maxIndividualLimit,
      teamLimit,
      registrationEnabled
    };

    setLoading(true);
    axios
      .put(`${apiUrl}/event/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Event updated successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing event", { variant: "error" });
        console.error(error);
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper Components
  const Label = ({ children, icon: Icon }) => (
    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-1.5">
      {Icon && <Icon className="text-desi-saffron text-sm" />}
      {children}
    </label>
  );

  const inputClass = "w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron focus:border-desi-saffron transition-all outline-none text-stone-700 font-medium";

  return (
    <DashboardLayout 
      role="Admin" 
      title="Edit Event" 
      subtitle={`Editing: ${name}`}
    >
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-teal p-8 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 rounded-full text-desi-teal">
                <MdEvent className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-800 font-reality tracking-wide">Update Event Details</h2>
                <p className="text-sm text-stone-400">Modify rules, dates, or status</p>
              </div>
            </div>
            
            {/* Registration Toggle */}
            <button 
                onClick={() => setRegistrationEnabled(!registrationEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${registrationEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
                {registrationEnabled ? <MdToggleOn className="text-2xl"/> : <MdToggleOff className="text-2xl"/>}
                {registrationEnabled ? 'Registration OPEN' : 'Registration CLOSED'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Basic Info */}
            <div className="md:col-span-2">
              <Label icon={MdEvent}>Event Name</Label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <Label icon={MdImage}>Image URL</Label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
            </div>

            {/* 2. Categorization */}
            <div>
              <Label icon={MdGroups}>Participation Type</Label>
              <select value={participation} onChange={(e) => setParticipation(e.target.value)} className={inputClass}>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div>
              <Label icon={MdLayers}>Event Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                <option value="Onstage">Onstage</option>
                <option value="Offstage">Offstage</option>
              </select>
            </div>

            <div>
              <Label icon={MdCategory}>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="Music">Music</option>
                <option value="Dance">Dance</option>
                <option value="Theatre">Theatre</option>
                <option value="Literary">Literary</option>
                <option value="Art">Art</option>
                <option value="General">General</option>
                <option value="Non-Counting">Non-Counting</option>
              </select>
            </div>

            {/* 3. Logistics */}
            <div>
              <Label icon={MdDateRange}>Date</Label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <Label icon={MdPlace}>Venue</Label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClass} />
            </div>

            {/* 4. Limits */}
            <div className="md:col-span-2 bg-stone-50 p-4 rounded-lg border border-stone-200 mt-2">
              <h3 className="text-sm font-bold text-stone-500 uppercase mb-4 border-b border-stone-200 pb-2">Participation Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Min Team Size</Label>
                  <input type="number" value={minIndividualLimit} onChange={(e) => setMinIndividualLimit(e.target.value)} className="w-full p-2 bg-white border border-stone-300 rounded outline-none focus:ring-1 focus:ring-desi-teal" />
                </div>
                <div>
                  <Label>Max Team Size</Label>
                  <input type="number" value={maxIndividualLimit} onChange={(e) => setMaxIndividualLimit(e.target.value)} className="w-full p-2 bg-white border border-stone-300 rounded outline-none focus:ring-1 focus:ring-desi-teal" />
                </div>
                <div>
                  <Label>House Limit</Label>
                  <input type="number" value={teamLimit} onChange={(e) => setTeamLimit(e.target.value)} className="w-full p-2 bg-white border border-stone-300 rounded outline-none focus:ring-1 focus:ring-desi-teal" />
                </div>
              </div>
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
              onClick={handleEditEvent}
              className="flex items-center gap-2 px-8 py-3 bg-desi-teal text-white font-bold rounded-lg shadow-lg hover:bg-teal-800 active:scale-95 transition-all"
            >
              <MdSave className="text-xl" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditEvent;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";

// // Helper functions for date format conversion
// const formatDateForInput = (dateStr) => {
//   if (!dateStr) return '';
//   // Convert from dd-mm-yyyy to yyyy-mm-dd
//   const [day, month, year] = dateStr.split('-');
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// };

// const formatDateForDisplay = (dateStr) => {
//   if (!dateStr) return '';
//   // Convert from yyyy-mm-dd to dd-mm-yyyy
//   const [year, month, day] = dateStr.split('-');
//   return `${day}-${month}-${year}`;
// };

// const EditEvent = () => {
//   const [name, setName] = useState("");
//   const [participation, setParticipation] = useState("");
//   const [image, setImage] = useState("");
//   const [type, setType] = useState("");
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState("");
//   const [venue, setVenue] = useState("");
//   const [maxIndividualLimit, setMaxIndividualLimit] = useState(1);
//   const [minIndividualLimit, setMinIndividualLimit] = useState(1);
//   const [teamLimit, setTeamLimit] = useState(0);
//   const [registrationEnabled, setRegistrationEnabled] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     if (!isAuthenticated && !isLoading) {
//       navigate("/");
//       return;
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/event/${id}/`)
//       .then((response) => {
//         setName(response.data.name);
//         setImage(response.data.image);
//         setParticipation(response.data.participation);
//         setType(response.data.type);
//         setCategory(response.data.category);
//         // Convert the date from dd-mm-yyyy to yyyy-mm-dd for the input field
//         setDate(formatDateForInput(response.data.date));
//         setVenue(response.data.venue);
//         setMaxIndividualLimit(response.data.maxIndividualLimit);
//         setMinIndividualLimit(response.data.minIndividualLimit);
//         setTeamLimit(response.data.teamLimit);
//         setRegistrationEnabled(response.data.registrationEnabled ?? true);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//         enqueueSnackbar("Error loading event details", { variant: "error" });
//         console.log(error);
//       });
//   }, [id, enqueueSnackbar]);

//   const handleEditEvent = () => {
//     const data = {
//       name,
//       image,
//       participation,
//       type,
//       category,
//       // Convert the date back to dd-mm-yyyy format before sending to server
//       date: formatDateForDisplay(date),
//       venue,
//       minIndividualLimit,
//       maxIndividualLimit,
//       teamLimit,
//       registrationEnabled
//     };
//     setLoading(true);
//     axios
//       .put(`https://bharatham-backend-j9s1.onrender.com/event/${id}/`, data)
//       .then((response) => {
//         setLoading(false);
//         enqueueSnackbar("Event edited successfully", { variant: "success" });
//         navigate("/admin");
//       })
//       .catch((error) => {
//         setLoading(false);
//         enqueueSnackbar("Error editing event", { variant: "error" });
//         console.log(error);
//       });
//   };

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Edit Event</h1>
//       {loading ? <Spinner /> : ""}
//       <div>
//         <div>
//           <label>Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Image</label>
//           <input
//             type="text"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Participation</label>
//           <select
//             name="participation"
//             value={participation}
//             onChange={(e) => setParticipation(e.target.value)}
//             id="participation"
//           >
//             <option value=""></option>
//             <option value="Individual">Individual</option>
//             <option value="Group">Group</option>
//           </select>
//         </div>
//         <div>
//           <label>Type</label>
//           <select
//             name="type"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             id="type"
//           >
//             <option value=""></option>
//             <option value="Onstage">Onstage</option>
//             <option value="Offstage">Offstage</option>
//           </select>
//         </div>
//         <div>
//           <label>Category</label>
//           <select
//             name="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             id="category"
//           >
//             <option value=""></option>
//             <option value="Non-Counting">Non-Counting</option>
//             <option value="Music">Music</option>
//             <option value="Dance">Dance</option>
//             <option value="Theatre">Theatre</option>
//             <option value="Literary">Literary</option>
//           </select>
//         </div>
//         <div>
//           <label>Date (DD-MM-YYYY)</label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Venue</label>
//           <input
//             type="text"
//             value={venue}
//             onChange={(e) => setVenue(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Min Individual Limit</label>
//           <input
//             type="number"
//             value={minIndividualLimit}
//             onChange={(e) => setMinIndividualLimit(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Max Individual Limit</label>
//           <input
//             type="number"
//             value={maxIndividualLimit}
//             onChange={(e) => setMaxIndividualLimit(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Team Limit</label>
//           <input
//             type="number"
//             value={teamLimit}
//             onChange={(e) => setTeamLimit(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Registration Status</label>
//           <div className="toggle-container">
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={registrationEnabled}
//                 onChange={(e) => setRegistrationEnabled(e.target.checked)}
//               />
//               <span className="slider round"></span>
//             </label>
//             <span className="toggle-label">
//               {registrationEnabled ? 'Registration Open' : 'Registration Closed'}
//             </span>
//           </div>
//         </div>
//         <button onClick={handleEditEvent}>Edit</button>
//       </div>
//     </div>
//   );
// };

// export default EditEvent;
