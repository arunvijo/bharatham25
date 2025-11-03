import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import ParticipantTable from "../components/participant/ParticipantTable";
import EventTable from "../components/event/EventTable";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import RegistrationTable from "../components/registration/RegistrationTable";
import ScoreTable from "../components/score/ScoreTable";
import { useSnackbar } from "notistack";
import AdminEventCardList from "../components/admin/AdminEventCardList";
import NegativeScoreTable from "../components/score/NegativeScoreTable";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaTrophy,
  FaMinusCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showType, setShowType] = useState("event");
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated && !isLoading) {
          navigate("/");
          return;
        }

        const houseResponse = await axios.get(
          `https://bharatham-1.onrender.com/house/by-captain/${user.nickname}`
        );

        if (houseResponse?.data.filter((d) => d.name == "Admin").length > 0) {
          const house = houseResponse.data[0].name;
        } else {
          enqueueSnackbar("Invalid User", {
            variant: "error",
          });
          logout({ logoutParams: { returnTo: window.location.origin } });
          navigate("/");
        }

        const [
          participantResponse,
          eventResponse,
          registrationResponse,
          scoreResponse,
        ] = await Promise.all([
          axios.get("https://bharatham-1.onrender.com/participant/"),
          axios.get("https://bharatham-1.onrender.com/event/"),
          axios.get("https://bharatham-1.onrender.com/registration/"),
          axios.get("https://bharatham-1.onrender.com/score/"),
        ]);

        setParticipants(participantResponse.data.data);
        setEvents(eventResponse.data.data);
        setRegistrations(registrationResponse.data.data);
        setScores(scoreResponse.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load data. Please try again later.");
        enqueueSnackbar("Error loading data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const viewOptions = [
    { id: "event", label: "Events", icon: <FaCalendarAlt /> },
    { id: "participant", label: "Participants", icon: <FaUsers /> },
    { id: "registration", label: "Registrations", icon: <FaClipboardList /> },
    { id: "score", label: "Scores", icon: <FaTrophy /> },
    { id: "negScore", label: "Negative Scores", icon: <FaMinusCircle /> },
  ];

  const updateParticipation = async () => {
    // Reset all participation counts to 0
    participants.forEach((p) => {
      p.individual = 0;
      p.group = 0;
      p.literary = 0;
    });

    // Update counts based on registrations
    registrations.forEach((reg) => {
      reg.participants.forEach((p) => {
        const participantSelect = participants.filter(
          (par) => par.uid === p.uid
        )[0];
        const eventSelect = events.filter((e) => e.name === reg.event)[0];

        if (eventSelect.category !== "Non-Counting") {
          if (eventSelect.participation === "Individual") {
            if (eventSelect.category === "Literary") {
              participantSelect.literary += 1;
            } else {
              participantSelect.individual += 1;
            }
          } else if (eventSelect.participation === "Group") {
            if (eventSelect.category === "Literary") {
              participantSelect.literary += 1;
            } else {
              participantSelect.group += 1;
            }
          }
        }
      });
    });

    // Update all participants in the database
    try {
      await Promise.all(
        participants.map((p) =>
          axios.put(`https://bharatham-1.onrender.com/participant/${p._id}/`, p)
        )
      );
      enqueueSnackbar("Participation counts updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating participation counts:", error);
      enqueueSnackbar("Error updating participation counts!", {
        variant: "error",
      });
    }
  };

  return (
    <motion.div
      className="main-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/" className="btn btn-outline">
            Home
          </Link>
          <LogoutButton className="logout-button">
            <FaSignOutAlt /> Logout
          </LogoutButton>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="view-selector">
            {viewOptions.map((option) => (
              <motion.button
                key={option.id}
                className={`view-button ${
                  showType === option.id ? "active" : ""
                }`}
                onClick={() => setShowType(option.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.icon}
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            className="table-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showType === "registration" && (
              <RegistrationTable registrations={registrations} admin={true} />
            )}
            {showType === "event" && (
              <EventTable events={events} admin={true} />
            )}
            {showType === "participant" && (
              <ParticipantTable participants={participants} admin={true} />
            )}
            {showType === "score" && (
              <ScoreTable scores={scores} admin={true} />
            )}
            {showType === "negScore" && (
              <NegativeScoreTable scores={scores} admin={true} />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
