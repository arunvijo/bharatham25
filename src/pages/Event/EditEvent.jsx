import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

// Helper functions for date format conversion
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  // Convert from dd-mm-yyyy to yyyy-mm-dd
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return '';
  // Convert from yyyy-mm-dd to dd-mm-yyyy
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
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
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://bharatham-1.onrender.com/event/${id}/`)
      .then((response) => {
        setName(response.data.name);
        setImage(response.data.image);
        setParticipation(response.data.participation);
        setType(response.data.type);
        setCategory(response.data.category);
        // Convert the date from dd-mm-yyyy to yyyy-mm-dd for the input field
        setDate(formatDateForInput(response.data.date));
        setVenue(response.data.venue);
        setMaxIndividualLimit(response.data.maxIndividualLimit);
        setMinIndividualLimit(response.data.minIndividualLimit);
        setTeamLimit(response.data.teamLimit);
        setRegistrationEnabled(response.data.registrationEnabled ?? true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error loading event details", { variant: "error" });
        console.log(error);
      });
  }, [id, enqueueSnackbar]);

  const handleEditEvent = () => {
    const data = {
      name,
      image,
      participation,
      type,
      category,
      // Convert the date back to dd-mm-yyyy format before sending to server
      date: formatDateForDisplay(date),
      venue,
      minIndividualLimit,
      maxIndividualLimit,
      teamLimit,
      registrationEnabled
    };
    setLoading(true);
    axios
      .put(`https://bharatham-1.onrender.com/event/${id}/`, data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Event edited successfully", { variant: "success" });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing event", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Edit Event</h1>
      {loading ? <Spinner /> : ""}
      <div>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div>
          <label>Participation</label>
          <select
            name="participation"
            value={participation}
            onChange={(e) => setParticipation(e.target.value)}
            id="participation"
          >
            <option value=""></option>
            <option value="Individual">Individual</option>
            <option value="Group">Group</option>
          </select>
        </div>
        <div>
          <label>Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            id="type"
          >
            <option value=""></option>
            <option value="Onstage">Onstage</option>
            <option value="Offstage">Offstage</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="category"
          >
            <option value=""></option>
            <option value="Non-Counting">Non-Counting</option>
            <option value="Music">Music</option>
            <option value="Dance">Dance</option>
            <option value="Theatre">Theatre</option>
            <option value="Literary">Literary</option>
          </select>
        </div>
        <div>
          <label>Date (DD-MM-YYYY)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>
        <div>
          <label>Min Individual Limit</label>
          <input
            type="number"
            value={minIndividualLimit}
            onChange={(e) => setMinIndividualLimit(e.target.value)}
          />
        </div>
        <div>
          <label>Max Individual Limit</label>
          <input
            type="number"
            value={maxIndividualLimit}
            onChange={(e) => setMaxIndividualLimit(e.target.value)}
          />
        </div>
        <div>
          <label>Team Limit</label>
          <input
            type="number"
            value={teamLimit}
            onChange={(e) => setTeamLimit(e.target.value)}
          />
        </div>
        <div>
          <label>Registration Status</label>
          <div className="toggle-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">
              {registrationEnabled ? 'Registration Open' : 'Registration Closed'}
            </span>
          </div>
        </div>
        <button onClick={handleEditEvent}>Edit</button>
      </div>
    </div>
  );
};

export default EditEvent;
