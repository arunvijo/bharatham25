import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import {
  FaCalendarAlt,
  FaUsers,
  FaTrophy,
  FaMapMarkerAlt,
} from "react-icons/fa";

const EventPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const { id } = useParams();
  const [event, setEvent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(
          `https://bharatham-1.onrender.com/event/${id}`
        );
        const event = eventResponse.data;

        const registrationResponse = await axios.get(
          `https://bharatham-1.onrender.com/registration/by-event/${id}/`
        );
        const registrations = registrationResponse.data.data;

        setEvent(eventResponse.data);
        setRegistrations(registrations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMenu = () => {
    setShowMenu((old) => !old);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="event-page">
      {window.innerWidth < 750 && (
        <motion.button
          className="btn-burger"
          onClick={handleMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaBars size={20} />
        </motion.button>
      )}
      {!(window.innerWidth < 750 && showMenu) && (
        <Navigation showMenu={showMenu} />
      )}

      <motion.section
        className="event-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="event-header-content">
          <h1>{event?.name}</h1>
          <div className="event-venue">
            <FaMapMarkerAlt className="venue-icon" />
            <h2>{event?.venue}</h2>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="event-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="event-tags">
          <div className="event-tag">
            <FaUsers className="tag-icon" />
            <span>{event?.participation}</span>
          </div>
          <div className="event-tag">
            <FaTrophy className="tag-icon" />
            <span>{event?.type}</span>
          </div>
          <div className="event-tag">
            <FaCalendarAlt className="tag-icon" />
            <span>{event?.category}</span>
          </div>
        </div>

        <div className="event-houses">
          <h2>Participating Houses</h2>
          <div className="house-grid">
            <div className="house-card">
              <img src="/images/aryans.png" alt="Aryans" />
              <span>Aryans</span>
            </div>
            <div className="house-card">
              <img src="/images/mughals.png" alt="Mughals" />
              <span>Mughals</span>
            </div>
            <div className="house-card">
              <img src="/images/rajput.png" alt="Rajputs" />
              <span>Rajputs</span>
            </div>
            <div className="house-card">
              <img src="/images/spartans.png" alt="Spartans" />
              <span>Spartans</span>
            </div>
            <div className="house-card">
              <img src="/images/vikings.png" alt="Vikings" />
              <span>Vikings</span>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="contact">
        <div className="container">
          <div>
            <img src="/images/logo.png" alt="logo" />
          </div>
          <div>
            <h1>Contact Us</h1>
            <p>
              X9V5+96P, Rajagiri Valley Rd, Rajagiri Valley, Kakkanad, Kerala
              682039
            </p>
            <p>20th, 21st, 22nd March 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventPage;
