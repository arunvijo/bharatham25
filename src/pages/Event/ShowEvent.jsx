import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useAuth0 } from "@auth0/auth0-react";



const ShowEvent = () => {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
    axios
      .get(`https://bharatham-backend-j9s1.onrender.com/event/${id}/`)
      .then((response) => {
        setEvent(response.data);
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
      <h1>Show Events </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <span>ID : </span>
            <span>{event._id}</span>
          </div>
          <div>
            <span>Event Name : </span>
            <span>{event.name}</span>
          </div>
          <div>
            <span>Participation : </span>
            <span>{event.participation}</span>
          </div>
          <div>
            <span>Type : </span>
            <span>{event.type}</span>
          </div>
          <div>
            <span>Category : </span>
            <span>{event.category}</span>
          </div>
          <div>
            <span>Date : </span>
            <span>{event.date}</span>
          </div>
          <div>
            <span>Venue : </span>
            <span>{event.venue}</span>
          </div>
          <div>
            <span>Individual Limit : </span>
            <span>{event.individualLimit}</span>
          </div>
          <div>
            <span>Team Limit : </span>
            <span>{event.teamLimit}</span>
          </div>

          <div>
            <span>Create Time : </span>
            <span>{new Date(event.createdAt).toString()}</span>
          </div>
          <div>
            <span>Last Update Time : </span>
            <span>{new Date(event.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEvent;
