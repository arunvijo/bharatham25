import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";



const DeleteScore = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
  }, []);

  const handleDeleteScore = () => {
    setLoading(true);
    axios
      .delete(`https://bharatham-1.onrender.com/score/${id}/`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Score Deleted successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please check console')
        enqueueSnackbar("Error!", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Delete Score</h1>
      {loading ? <Spinner /> : ""}
      <div>
        <h3>Are You Sure You want to delete this score?</h3>
        <button onClick={handleDeleteScore}>Yes, Delete it</button>
      </div>
    </div>
  );
};

export default DeleteScore;
