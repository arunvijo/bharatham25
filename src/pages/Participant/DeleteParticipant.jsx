import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdWarning, MdDeleteForever, MdCancel } from "react-icons/md";

// Components
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";

const DeleteParticipant = () => {
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
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDeleteParticipant = () => {
    setLoading(true);
    axios
      .delete(`${apiUrl}/participant/${id}`)
      .then(() => {
        enqueueSnackbar("Participant Deleted Successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Error in delete process:", error);
        const msg = error.response?.data?.message || "Error deleting participant!";
        enqueueSnackbar(msg, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout 
      role="Admin" 
      title="Delete Participant" 
      subtitle="Action Cannot Be Undone"
    >
      <div className="h-[70vh] flex items-center justify-center">
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-desi-maroon max-w-md w-full text-center animate-fade-in-up">
          
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-desi-maroon animate-pulse">
            <MdWarning className="text-5xl" />
          </div>

          <h2 className="text-2xl font-bold text-stone-800 font-reality tracking-wide mb-2">
            Confirm Deletion
          </h2>
          
          <p className="text-stone-500 mb-8 leading-relaxed">
            You are about to remove this student from the database. This will also delete their registrations and scores.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleDeleteParticipant}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-desi-maroon text-white font-bold rounded-lg shadow-lg hover:bg-red-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDeleteForever className="text-xl" />
              {loading ? "Deleting..." : "Yes, Remove Student"}
            </button>
            
            <button 
              onClick={() => navigate("/admin")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200 transition-all"
            >
              <MdCancel className="text-xl" />
              Cancel
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeleteParticipant;

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import BackButton from '../../components/BackButton'
// import Spinner from '../../components/Spinner'
// import { useNavigate, useParams } from 'react-router-dom'
// import { useSnackbar } from 'notistack'
// import { useAuth0 } from "@auth0/auth0-react";



// const DeleteParticipant = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams()
//   const { enqueueSnackbar } = useSnackbar()

//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     setLoading(true);
//     console.log(user, isAuthenticated, isLoading);
//     if (!isAuthenticated && !isLoading) navigate("/");
//   },[]);

//   const handleDeleteParticipant = () => {
//     setLoading(true);
//     axios
//       .delete(`https://bharatham-backend-j9s1.onrender.com/participant/${id}/`)
//       .then(() => {
//         setLoading(false);
//         enqueueSnackbar('Participant Deleted successfully', {variant: 'success'})
//         navigate('/admin')
//       })
//       .catch((error) => {
//         setLoading(false);
//         // alert('An error happened. Please check console')
//         enqueueSnackbar('Error!', {variant: 'error'})
//         console.log(error);
//       })
//   }

//   return (
//     <div className='main-container'>
//       <BackButton destination='/admin' />
//       <h1 className='text-3xl my-4'>Delete Participant</h1>
//       {loading ? <Spinner /> : ''}
//       <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
//           <h3 className='text-2xl'>Are You Sure You want to delete this participant?</h3>
//         <button className='p-4 bg-red-600 w-full' onClick={handleDeleteParticipant}>Yes, Delete it</button>
//       </div>
//     </div>
//   )
// }

// export default DeleteParticipant