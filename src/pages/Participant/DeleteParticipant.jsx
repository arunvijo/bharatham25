import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BackButton from '../../components/BackButton'
import Spinner from '../../components/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useAuth0 } from "@auth0/auth0-react";



const DeleteParticipant = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
  },[]);

  const handleDeleteParticipant = () => {
    setLoading(true);
    axios
      .delete(`https://bharatham-1.onrender.com/participant/${id}/`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Participant Deleted successfully', {variant: 'success'})
        navigate('/admin')
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please check console')
        enqueueSnackbar('Error!', {variant: 'error'})
        console.log(error);
      })
  }

  return (
    <div className='main-container'>
      <BackButton destination='/admin' />
      <h1 className='text-3xl my-4'>Delete Participant</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
          <h3 className='text-2xl'>Are You Sure You want to delete this participant?</h3>
        <button className='p-4 bg-red-600 w-full' onClick={handleDeleteParticipant}>Yes, Delete it</button>
      </div>
    </div>
  )
}

export default DeleteParticipant