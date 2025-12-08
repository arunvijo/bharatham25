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
  MdLayers
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const CreateEvent = () => {
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
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Use Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/");
  }, [isAuthenticated, isLoading, navigate]);

  const handleSaveEvent = () => {
    if (!name || !participation || !type || !category) {
      enqueueSnackbar("Please fill in all required fields", { variant: "warning" });
      return;
    }

    const data = {
      name,
      image,
      participation,
      type,
      category,
      date,
      venue,
      maxIndividualLimit,
      minIndividualLimit,
      teamLimit,
    };

    setLoading(true);
    axios
      .post(`${apiUrl}/event/`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Event Created successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating event", { variant: "error" });
        console.error(error);
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  // Helper for Input Labels
  const Label = ({ children, icon: Icon }) => (
    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-1.5">
      {Icon && <Icon className="text-desi-saffron text-sm" />}
      {children}
    </label>
  );

  // Helper for Input Classes
  const inputClass = "w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron focus:border-desi-saffron transition-all outline-none text-stone-700 font-medium";

  return (
    <DashboardLayout 
      role="Admin" 
      title="Event Management" 
      subtitle="Create New Event"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-saffron p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-full text-desi-saffron">
                <MdEvent className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-800 font-reality tracking-wide">Event Details</h2>
                <p className="text-sm text-stone-400">Define the rules and logistics for the new event</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Basic Info */}
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

            <div className="md:col-span-2">
              <Label icon={MdImage}>Image URL (Optional)</Label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            {/* 2. Categorization */}
            <div>
              <Label icon={MdGroups}>Participation Type</Label>
              <select
                value={participation}
                onChange={(e) => setParticipation(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div>
              <Label icon={MdLayers}>Event Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Stage</option>
                <option value="Onstage">Onstage</option>
                <option value="Offstage">Offstage</option>
              </select>
            </div>

            <div>
              <Label icon={MdCategory}>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Category</option>
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
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <Label icon={MdPlace}>Venue</Label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className={inputClass}
                placeholder="e.g. Main Stage, Auditorium"
              />
            </div>

            {/* 4. Limits Section (Highlighted) */}
            <div className="md:col-span-2 bg-stone-50 p-4 rounded-lg border border-stone-200 mt-2">
              <h3 className="text-sm font-bold text-stone-500 uppercase mb-4 border-b border-stone-200 pb-2">Participation Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Min Team Size</Label>
                  <input
                    type="number"
                    value={minIndividualLimit}
                    onChange={(e) => setMinIndividualLimit(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-desi-saffron outline-none"
                  />
                </div>
                <div>
                  <Label>Max Team Size</Label>
                  <input
                    type="number"
                    value={maxIndividualLimit}
                    onChange={(e) => setMaxIndividualLimit(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-desi-saffron outline-none"
                  />
                </div>
                <div>
                  <Label>House Reg Limit</Label>
                  <input
                    type="number"
                    value={teamLimit}
                    onChange={(e) => setTeamLimit(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-desi-saffron outline-none"
                    placeholder="Entries per house"
                  />
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
              onClick={handleSaveEvent}
              className="flex items-center gap-2 px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 active:scale-95 transition-all"
            >
              <MdSave className="text-xl" /> Create Event
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";

// const CreateEvent = () => {
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
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//   }, []);

//   const handleSaveEvent = () => {
//     const data = {
//       name,
//       image,
//       participation,
//       type,
//       category,
//       date,
//       venue,
//       maxIndividualLimit,
//       minIndividualLimit,
//       teamLimit,
//     };
//     setLoading(true);
//     console.log(data);
//     axios
//       .post("https://bharatham-backend-j9s1.onrender.com/event/", data)
//       .then((response) => {
//         setLoading(false);
//         enqueueSnackbar("Event Created successfully", {
//           variant: "success",
//         });
//         navigate("/admin");
//       })
//       .catch((error) => {
//         setLoading(false);
//         // alert('An error happened. Please check console')
//         enqueueSnackbar("Error!", { variant: "error" });
//         console.log(error);
//       });
//   };

//   return (
//     <div className="main-container">
//       <BackButton destination="/admin" />
//       <h1>Create Events </h1>
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
//           <label>Date</label>
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
//           <label>Max Team Member Limit</label>
//           <input
//             type="number"
//             value={maxIndividualLimit}
//             onChange={(e) => setMaxIndividualLimit(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Min Team Member Limit</label>
//           <input
//             type="number"
//             value={minIndividualLimit}
//             onChange={(e) => setMinIndividualLimit(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Max Team Limit</label>
//           <input
//             type="number"
//             value={teamLimit}
//             onChange={(e) => setTeamLimit(e.target.value)}
//           />
//         </div>
//         <button onClick={handleSaveEvent}>Create</button>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;
