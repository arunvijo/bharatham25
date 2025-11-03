import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { MdMenu } from "react-icons/md";
import ScrollReveal from "scrollreveal";
import "../main.css";

// Import new components
import Navigation from "../components/Navigation";
import CountdownTimer from "../components/CountdownTimer";
import ScoreboardChart from "../components/ScoreboardChart";

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  // Create refs for sections
  const aboutRef = React.useRef(null);
  const housesRef = React.useRef(null);
  const eventsRef = React.useRef(null);
  const contactRef = React.useRef(null);

  // Use useInView to detect when sections are in view
  const aboutInView = useInView(aboutRef, { once: true });
  const housesInView = useInView(housesRef, { once: true });
  const eventsInView = useInView(eventsRef, { once: true });
  const contactInView = useInView(contactRef, { once: true });

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/");

    ScrollReveal({
      origin: "top",
      distance: "100px",
      duration: 2000,
      reset: true,
    }).reveal(".logo", { delay: 300 });
  }, [isAuthenticated, isLoading, navigate]);

  const handleMenu = () => {
    setShowMenu((old) => !old);
  };

  return (
    <>
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

      <section
        className="landing"
        style={{
          backgroundImage: `url('/images/heroDesign1.png'), url('/images/heroDesign2.png')`,
          backgroundPosition: "top left, bottom right",
          backgroundRepeat: "no-repeat, no-repeat",
          padding: "0",
        }}
      >
        <div className="logo">
          <img src="/images/logoC.png" alt="Bharatham-Logo" />
        </div>
        <CountdownTimer />
      </section>

      <section className="about" id="about" ref={aboutRef}>
        <div className="container">
          <motion.img 
            src="/images/about.png" 
            alt="about"
            initial={{ x: -100, opacity: 0 }}
            animate={aboutInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={aboutInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1 
              className="about-h1"
              initial={{ y: -20, opacity: 0 }}
              animate={aboutInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              About
              <br />
              Bharatham
            </motion.h1>
            <motion.p 
              style={{ textTransform: "none" }}
              initial={{ y: 20, opacity: 0 }}
              animate={aboutInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Bharatham is the annual cultural festival of Rajagiri School of
              Engineering and Technology where students compete in a variety of
              events as part of their respective houses: Mughals, Rajputs,
              Spartans, Vikings, and Aryans. The festival showcases the talents
              of the students in music, dance, theater, and various other
              cultural events.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="houses" id="houses" ref={housesRef}>
        <div className="purple-backdrop"></div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={housesInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={housesInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The Houses
          </motion.h1>
          <motion.img 
            className="housesLogo" 
            src="images/houses.svg" 
            alt="houses"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={housesInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.img
            className="housesMobile"
            src="images/housesMobile.svg"
            alt="houses"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={housesInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
        <img className="wave2" src="/images/wave2.png" alt="" />
      </section>

      <section className="events" id="events" ref={eventsRef}>
        <motion.h1 
          style={{ color: "#270b55", fontSize: "4rem", marginTop: "2rem", zIndex: "100" }}
          initial={{ y: -30, opacity: 0 }}
          animate={eventsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Events
        </motion.h1>
        <motion.div 
          className="types"
          initial={{ opacity: 0 }}
          animate={eventsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="event-container"
            initial={{ y: 50, opacity: 0 }}
            animate={eventsInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/events">
              <img
                className="event-image"
                src="/images/music.png"
                alt="music"
              />
              <p className="event-text">Music Events</p>
            </Link>
          </motion.div>
          <motion.div 
            className="event-container"
            initial={{ y: 50, opacity: 0 }}
            animate={eventsInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/events">
              <img className="event-image" src="/images/team.png" alt="team" />
              <p className="event-text">Team Events</p>
            </Link>
          </motion.div>
          <motion.div 
            className="event-container"
            initial={{ y: 50, opacity: 0 }}
            animate={eventsInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link to="/events">
              <img
                className="event-image"
                src="/images/individual.png"
                alt="individual"
              />
              <p className="event-text">Individual Events</p>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="scoreboard"
          initial={{ y: 30, opacity: 0 }}
          animate={eventsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={eventsInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            Scoreboard
          </motion.h1>
          <ScoreboardChart />
        </motion.div>
      </section>

      <section className="contact" ref={contactRef}>
        <div className="container">
          <div>
            <img src="/images/logo.png" alt="logo" />
          </div>
          <div>
            <h1>Contact Us</h1>
            <p>X9V5+96P, Rajagiri Valley Rd, Rajagiri Valley, Kakkanad, Kerala 682039</p>
            <p>20th, 21st, 22nd March 2025</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
