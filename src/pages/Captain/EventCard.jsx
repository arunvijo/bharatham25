import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Link to={`/captain/event/view/${event._id}`} className="event-card">
      <h3 style={{ color: `#270B55` }}>{event.name}</h3>
      <p>{event.type} | {event.category}</p>
      <p>{event.participation}</p>
      <p>{event.date}</p>
      <p style={{ color: event.registrationEnabled ? "green" : "red", fontWeight: "bold" }}>{event.registrationEnabled ? "Registration Open" : "Registration Closed"}</p>
    </Link>
  );
};

export default EventCard;
