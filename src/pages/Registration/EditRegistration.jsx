import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";



const EditRegistration = () => {
  const [event, setEvent] = useState("");
  const [house, setHouse] = useState("");
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const handleAddParticipants = () => {
    if (participantData != "") {
      let flag = false;
      participants.forEach((participant) => {
        if (participant == participantData) flag = true;
      });

      if (flag == false) {
        console.log(participantData);
        setParticipants((old) => [...old, participantData]);
      }
      setParticipantData("");
    }
  };

  const handleDeleteParticipants = (e) => {
    const uid = e.target.id;
    console.log(e.target.id);
    setParticipants(
      participants.filter((participant) => {
        console.log("p: ", participant, ", u: ", uid, participant != uid);
        return participant != uid;
      })
    );
    console.log(uid, participants);
  };

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
    axios
      .get(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`)
      .then((response) => {
        setEvent(response.data.event);
        setHouse(response.data.house);
        setParticipants(response.data.participants);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check console");
        console.log(error);
      });
  }, []);

  const handleEditRegistration = () => {
    const data = {
      event,
      house,
      participants,
    };
    setLoading(true);
    console.log(data);
    axios
      .put(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`, data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Registration Edited successfully", {
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
      <h1>Edit Registration</h1>
      {loading ? <Spinner /> : ""}
      <div>
        <div>
          <label>Event</label>
          <input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div>
          <label>House</label>
          <select
            name="house"
            value={house}
            onChange={(e) => setType(e.target.value)}
            id="house"
          >
            <option value=""></option>
            <option value="Mughals">Mughals</option>
            <option value="Aryans">Aryans</option>
            <option value="Spartans">Spartans</option>
            <option value="Rajputs">Rajputs</option>
            <option value="Vikings">Vikings</option>
          </select>
        </div>
        <div>
          <label>Participants</label>
          <p>Added Participants : </p>
          <div className="pill-container">
            {participants &&
              participants.map((participant) => (
                <button
                  key={participant._id}
                  id={participant}
                  className="btn-pill"
                  onClick={handleDeleteParticipants}
                >
                  {participant.fullName} <MdOutlineDelete />
                </button>
              ))}
          </div>
          <div className="sub-group">
            <input
              className="form-input"
              type="text"
              value={participantData}
              onChange={(e) => setParticipantData(e.target.value)}
            />
            <button className="btn-outline" onClick={handleAddParticipants}>
              + Participant
            </button>
          </div>
        </div>
        <button onClick={handleEditRegistration}>Edit</button>
      </div>
    </div>
  );
};

export default EditRegistration;
