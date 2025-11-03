import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import axios from "axios";
import { MdInfo, MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

const Events = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.venue.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventResponse = await axios.get(
          "https://bharatham-backend-j9s1.onrender.com/event/"
        );
        const events = eventResponse.data.data;
        console.log(eventResponse.data.data);
        setEvents(events);
      } catch (error) {
        console.error(error);
        // Handle errors here (e.g., display error message)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Only re-run on changes to isAuthenticated

  const handleMenu = () => {
    console.log("Menu clicked", showMenu);
    setShowMenu((old) => !old);
  };

  return (
    <div className="events_page">
      {/* <img
        className="image-bg"
        src="https://firebasestorage.googleapis.com/v0/b/bharatham-8f3b2.appspot.com/o/wave-bg.png?alt=media&token=20d0fef8-3cef-485e-a65d-8047b1b77006"
      /> */}
      
      {window.innerWidth < 750 && (
        <motion.button
          className="btn-burger"
          onClick={handleMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MdMenu size={20} />
        </motion.button>
      )}
      {!(window.innerWidth < 750 && showMenu) && <Navigation showMenu={showMenu} />}

      <motion.section
        className="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Events</h1>

        <div className="button-container">
          <div className="button-row">
            <button className="btn-outline" onClick={(e) => setFilter("")}>
              All
            </button>
            <button
              className="btn-outline"
              onClick={(e) => setFilter("onstage")}
            >
              Onstage
            </button>
            <button
              className="btn-outline"
              onClick={(e) => setFilter("offstage")}
            >
              Offstage
            </button>
            <button
              className="btn-outline"
              onClick={(e) => setFilter("pre event")}
            >
              Pre Event
            </button>
            <button
              className="btn-outline"
              onClick={(e) => setFilter("individual")}
            >
              Individual
            </button>
            <button className="btn-outline" onClick={(e) => setFilter("Group")}>
              Group
            </button>
            <button
              className="btn-outline"
              onClick={(e) => setFilter("Literary")}
            >
              Literary
            </button>
            <button className="btn-outline" onClick={(e) => setFilter("Music")}>
              Music
            </button>
            <button className="btn-outline" onClick={(e) => setFilter("Dance")}>
              Dance
            </button>
            <button className="btn-outline" onClick={(e) => setFilter("Theatre")}>
              Theatre
            </button>
            <button className="btn-outline" onClick={(e) => setFilter("Theatre")}>
              Media
            </button>
          </div>
        </div>

        <div className="container" style={{ marginInline: "0" }}>
          {filteredEvents?.map((e) => (
            <Link
              className="box"
              to={`/event/${e._id}`}
              style={{ backgroundImage: `url(${e.image})` }}
            >
              <div className="content">
                <p>{e.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      <section className="contact">
        <div className="container">
          <div>
            <img src="./images/logo.png" alt="logo" />
          </div>
          <div>
            <h1>Contact Us</h1>
            <p>rajagiribharatham23@gmail.com</p>
            <p>20, 21, 22 March 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
