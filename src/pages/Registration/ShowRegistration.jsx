import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useAuth0 } from "@auth0/auth0-react";



const ShowRegistration = () => {
  const [registration, setRegistration] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
    axios
      .get(`https://bharatham-1.onrender.com/registration/${id}/`)
      .then((response) => {
        setRegistration(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Show Registration </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <span>ID : </span>
            <span>{registration._id}</span>
          </div>
          <div>
            <span>Event : </span>
            <span>{registration.event}</span>
          </div>
          <div>
            <span>House : </span>
            <span>{registration.house}</span>
          </div>
          <div>
            <span>Participants : </span>
            <span>
              {registration.participants && registration.participants.map((participant) => (
                <p key={participant._id}>{participant.fullName}</p>
              ))}
            </span>
          </div>

          <div>
            <span>Create Time : </span>
            <span>{new Date(registration.createdAt).toString()}</span>
          </div>
          <div>
            <span>Last Update Time : </span>
            <span>{new Date(registration.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowRegistration;
