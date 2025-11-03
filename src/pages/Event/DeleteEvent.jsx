import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";



const DeleteEvent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
      return;
    }
    setLoading(false);
  }, [isAuthenticated, isLoading, navigate]);

  const handleDeleteEvent = () => {
    setLoading(true);
    axios
      .delete(`https://bharatham-1.onrender.com/event/${id}/`)
      .then(() => {
        enqueueSnackbar("Event Deleted successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Error in delete process:", error);
        enqueueSnackbar(
          error.response?.data?.message || "Error deleting event!",
          { variant: "error" }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Delete Event</h1>
      {loading && <Spinner />}
      <div>
        <h3>Are You Sure You want to delete this event?</h3>
        <button onClick={handleDeleteEvent} disabled={loading}>
          {loading ? "Deleting..." : "Yes, Delete it"}
        </button>
      </div>
    </div>
  );
};

export default DeleteEvent;
