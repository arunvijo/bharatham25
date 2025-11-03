import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useAuth0 } from "@auth0/auth0-react";



const ShowScore = () => {
  const [score, setScore] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
    axios
      .get(`https://bharatham-1.onrender.com/score/${id}/`)
      .then((response) => {
        setScore(response.data);
        console.log(response.data);
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
      <h1>Show Scores </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <span>ID : </span>
            <span>{score?._id}</span>
          </div>
          <div>
            <span>Event : </span>
            <span>{score?.event}</span>
          </div>
          <div>
            <span>House : </span>
            <span>{score?.house}</span>
          </div>
          <div>
            <span>Participants : </span>
            <span>
              {score?.registration.participants.map(
                (p) => `${p.uid} | ${p.fullName} `
              )}
            </span>
          </div>
          <div>
            <span>Position : </span>
            <span>{score?.position}</span>
          </div>
          <div>
            <span>Points : </span>
            <span>{score?.points}</span>
          </div>

          <div>
            <span>Create Time : </span>
            <span>{new Date(score?.createdAt).toString()}</span>
          </div>
          <div>
            <span>Last Update Time : </span>
            <span>{new Date(score?.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowScore;
