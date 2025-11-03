import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useAuth0 } from "@auth0/auth0-react";
import RegistrationTable from "../../components/registration/RegistrationTable";
import ScoreTable from "../../components/score/ScoreTable";

const ShowParticipant = () => {
  const [participant, setParticipant] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/participant/${id}`
        );
        const data = participantResponse.data;

        const registrationResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/registration/by-participant/${id}`
        );
        console.log(
          `https://bharatham-backend-j9s1.onrender.com/registration/by-participant/${id}`
        );
        const registrations = registrationResponse.data.data;

        const scoreResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/score/by-participant/${id}`
        );
        console.log(
          `https://bharatham-backend-j9s1.onrender.com/score/by-participant/${id}`
        );
        const scores = scoreResponse.data.data;

        const eventResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/event/`
        );
        console.log(`https://bharatham-backend-j9s1.onrender.com/event/`);
        const events = eventResponse.data.data;

        setParticipant(data);
        setEvents(events);
        setRegistrations(registrations);
        setScores(scores);

        // console.log("Count : ", count);

        console.log(data, scores, registrations.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Show Participants </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <span>Full Name : </span>
            <span>{participant.fullName}</span>
          </div>
          <div>
            <span>UID : </span>
            <span>{participant.uid}</span>
          </div>
          <div>
            <span>Branch : </span>
            <span>{participant.branch}</span>
          </div>
          <div>
            <span>Semester :</span>
            <span>{participant.semester}</span>
          </div>
          <div>
            <span>House : </span>
            <span>{participant.house}</span>
          </div>
          <div className="row">
            <div>
              <p>Participation Counts</p>
              <ul>
                <li>Individual Events: {participant.individual || 0}</li>
                <li>Group Events: {participant.group || 0}</li>
                <li>Literary Events: {participant.literary || 0}</li>
              </ul>
              <p>Participation Limits</p>
              <ul>
                <li>Individual Events: Max 5</li>
                <li>Literary Events: Max 4</li>
                <li>Group Events: Max 3</li>
              </ul>
            </div>
          </div>
          <strong>
            Total Score : {scores?.reduce((sum, curr) => sum + curr.points, 0)}
          </strong>
          <RegistrationTable registrations={registrations} />
          <ScoreTable scores={scores} />
        </div>
      )}
    </div>
  );
};

export default ShowParticipant;
