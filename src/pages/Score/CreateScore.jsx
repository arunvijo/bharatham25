import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const CreateScore = () => {
  const [score, setScore] = useState();
  const [event, setEvent] = useState("");
  const [registration, setRegistration] = useState();
  const [position, setPosition] = useState("");
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState("");

  const [eventList, setEventList] = useState([]);
  const [registrationList, setRegistrationList] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");

    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(
          `https://bharatham-1.onrender.com/event/`
        );
        const events = eventResponse.data.data;

        const registrationResponse = await axios.get(
          `https://bharatham-1.onrender.com/registration/`
        );
        const registrations = registrationResponse.data.data;

        console.log(events, registrations);
        setEventList(events);
        setRegistrationList(registrations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(registrationList);
    console.log(registrationList.filter((r) => r.event == event));
  }, [event]);

  const handleSaveScore = () => {
    const data = {
      event,
      house: registrationList.filter((r) => r._id === registration)[0].house,
      registration: registrationList.filter((r) => r._id === registration)[0],
      position,
      points: parseInt(points),
      reason,
    };
    setLoading(true);
    console.log(data);
    axios
      .post("https://bharatham-1.onrender.com/score/", data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Score Created successfully", {
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
      <h1>Create Score </h1>
      {loading ? <Spinner /> : ""}
      <div>
        <div>
          <label>Event</label>
          <select
            name="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            id="event"
          >
            <option value=""></option>
            {eventList.map((e) => (
              <option key={e._id} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Registration</label>
          <select
            name="registration"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            id="registration"
          >
            <option value=""></option>
            {registrationList
              .filter((r) => r.event == event)
              .map((r) => (
                <option key={r._id} value={r._id}>
                  {r.house} | {r.participants.map((p) => `${p.fullName} `)}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Position</label>
          <select
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            id="position"
          >
            <option value=""></option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Fourth">Fourth</option>
            <option value="Fifth">Fifth</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
        <div>
          <label>Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
        <div>
          <label>Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button onClick={handleSaveScore}>Create</button>
      </div>
    </div>
  );
};

export default CreateScore;
