import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

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

  useEffect(() => {
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
  }, []);

  const handleSaveEvent = () => {
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
    console.log(data);
    axios
      .post("https://bharatham-1.onrender.com/event/", data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Event Created successfully", {
          variant: "success",
        });
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
      <h1>Create Events </h1>
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
          <label>Date</label>
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
          <label>Max Team Member Limit</label>
          <input
            type="number"
            value={maxIndividualLimit}
            onChange={(e) => setMaxIndividualLimit(e.target.value)}
          />
        </div>
        <div>
          <label>Min Team Member Limit</label>
          <input
            type="number"
            value={minIndividualLimit}
            onChange={(e) => setMinIndividualLimit(e.target.value)}
          />
        </div>
        <div>
          <label>Max Team Limit</label>
          <input
            type="number"
            value={teamLimit}
            onChange={(e) => setTeamLimit(e.target.value)}
          />
        </div>
        <button onClick={handleSaveEvent}>Create</button>
      </div>
    </div>
  );
};

export default CreateEvent;
