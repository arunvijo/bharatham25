import React from "react";
import EventCard from "./AdminEventCard";

const AdminEventCardList = ({ events }) => {
  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "nowrap", overflowX: "scroll",marginTop: 20 }}>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default AdminEventCardList;
