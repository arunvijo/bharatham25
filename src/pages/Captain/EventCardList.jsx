import React, { useState } from "react";
import EventCard from "./EventCard";

const EventCardList = ({ events }) => {
  const [filter, setFilter] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Filter by name, category, type, participation"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          marginBottom: 20,
          borderRadius: 30,
          width: "70%",
          border: "none",
          paddingBlock: 10,
          paddingInline: 20,
          fontFamily: "DM Sans",
        }}
      />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </>
  );
};

export default EventCardList;
