import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  MdPerson, 
  MdSave, 
  MdArrowBack, 
  MdBadge, 
  MdSchool, 
  MdClass, 
  MdGroups,
  MdEdit
} from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const EditParticipant = () => {
  const [fullName, setFullName] = useState("");
  const [uid, setUID] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [house, setHouse] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth0();

  // Env Variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/");
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/participant/${id}`)
      .then((response) => {
        const data = response.data;
        setFullName(data.fullName);
        setUID(data.uid);
        setBranch(data.branch);
        setSemester(data.semester);
        setHouse(data.house);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error loading participant details", { variant: "error" });
        console.error(error);
      });
  }, [id, enqueueSnackbar, apiUrl]);

  const handleEditParticipant = () => {
    const data = {
      fullName,
      uid,
      branch,
      semester,
      house
    };

    setLoading(true);
    axios
      .put(`${apiUrl}/participant/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Participant updated successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating participant", { variant: "error" });
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
      title="Edit Participant" 
      subtitle={`Editing: ${fullName}`}
    >
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-desi-teal p-8 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-stone-100 pb-4">
            <div className="p-3 bg-teal-50 rounded-full text-desi-teal">
              <MdEdit className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 font-reality tracking-wide">Update Details</h2>
              <p className="text-sm text-stone-400">Modify student information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Personal Details */}
            <div className="md:col-span-2">
              <Label icon={MdPerson}>Full Name</Label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <Label icon={MdBadge}>UID (Roll No)</Label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUID(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* 2. House Assignment */}
            <div>
              <Label icon={MdGroups}>House</Label>
              <select
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className={inputClass}
              >
                <option value="">Select House</option>
                <option value="Rajputs">Rajputs</option>
                <option value="Mughals">Mughals</option>
                <option value="Vikings">Vikings</option>
                <option value="Spartans">Spartans</option>
                <option value="Aryans">Aryans</option>
              </select>
            </div>

            {/* 3. Academic Details */}
            <div>
              <Label icon={MdSchool}>Branch</Label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Branch</option>
                <option value="CSE Alpha">CSE Alpha</option>
                <option value="CSE Beta">CSE Beta</option>
                <option value="CSE Gamma">CSE Gamma</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
                <option value="AE">AE</option>
              </select>
            </div>

            <div>
              <Label icon={MdClass}>Semester</Label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Semester</option>
                <option value="S2">S2</option>
                <option value="S4">S4</option>
                <option value="S6">S6</option>
                <option value="S8">S8</option>
              </select>
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
              onClick={handleEditParticipant}
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

export default EditParticipant;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BackButton from "../../components/BackButton";
// import Spinner from "../../components/Spinner";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useAuth0 } from "@auth0/auth0-react";



// const EditParticipant = () => {
//   const [fullName, setFullName] = useState("");
//   const [uid, setUID] = useState("");
//   const [branch, setBranch] = useState("");
//   const [semester, setSemester] = useState("");
//   const [house, setHouse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { enqueueSnackbar } = useSnackbar();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//   },[]);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`https://bharatham-backend-j9s1.onrender.com/participant/${id}/`)
//       .then((response) => {
//         setFullName(response.data.fullName);
//         setUID(response.data.uid);
//         setBranch(response.data.branch);
//         setSemester(response.data.semester);
//         setHouse(response.data.house);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//         alert("An error happened. Please check console");
//         console.log(error);
//       });
//   }, []);

//   const handleEditParticipant = () => {
//     const data = {
//       fullName,
//       uid,
//       branch,
//       semester,
//       house
//     };
//     setLoading(true);
//     console.log(data);
//     axios
//       .put(`https://bharatham-backend-j9s1.onrender.com/participant/${id}/`, data)
//       .then((response) => {
//         setLoading(false);
//         enqueueSnackbar("Participant Edited successfully", {
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
//       <h1>Edit Participant</h1>
//       {loading ? <Spinner /> : ""}
//       <div>
//         <div>
//           <label>Full Name</label>
//           <input
//             type="text"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>UID</label>
//           <input
//             type="text"
//             value={uid}
//             onChange={(e) => setUID(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Branch</label>
//           <select
//             name="branch"
//             value={branch}
//             onChange={(e) => setBranch(e.target.value)}
//             id="branch"
//           >
//             <option value="CSE Alpha">CSE Alpha</option>
//             <option value="CSE Beta">CSE Beta</option>
//             <option value="CSE Gamma">CSE Gamma</option>
//           </select>
//         </div>
//         <div>
//           <label>Semester</label>
//           <select
//             name="semester"
//             value={semester}
//             onChange={(e) => setSemester(e.target.value)}
//             id="semester"
//           >
//             <option value="S2">S2</option>
//             <option value="S4">S4</option>
//             <option value="S6">S6</option>
//             <option value="S8">S8</option>
//           </select>
//         </div>
//         <div>
//           <label>House</label>
//           <select
//             name="house"
//             value={house}
//             onChange={(e) => setHouse(e.target.value)}
//             id="semester"
//           >
//             <option value="Rajputs">Rajputs</option>
//             <option value="Mughals">Mughals</option>
//             <option value="Vikings">Vikings</option>
//             <option value="Spartans">Spartans</option>
//             <option value="Aryans">Aryans</option>
//           </select>
//         </div>
//         <button onClick={handleEditParticipant}>Edit</button>
//       </div>
//     </div>
//   );
// };

// export default EditParticipant;
