import React from "react";
import { Link } from "react-router-dom";

const AdminEventCard = ({ event }) => {
  return (
    <Link to={`/admin/event/view/${event._id}`} className="event-card">
      <h3>{event.name}</h3>
      <p>{event.type} | {event.category}</p>
      {/* <p>{event.participation}</p> */}
      {/* <p>{new Date(event.date).toLocaleDateString("en-US")}</p> */}
    </Link>
  );
};

export default AdminEventCard;
