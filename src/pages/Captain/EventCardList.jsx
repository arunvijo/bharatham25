import React, { useState } from "react";
import { MdSearch, MdEvent } from "react-icons/md";
import EventCard from "./EventCard";

const EventCardList = ({ events = [] }) => {
  const [filter, setFilter] = useState("");

  // Safety check: Ensure events is an array before filtering
  const safeEvents = Array.isArray(events) ? events : [];

  const filteredEvents = safeEvents.filter(
    (event) =>
      event?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      event?.category?.toLowerCase().includes(filter.toLowerCase()) ||
      event?.type?.toLowerCase().includes(filter.toLowerCase()) ||
      event?.participation?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Modern Search Bar */}
      <div className="relative max-w-md mx-auto md:mx-0">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
        <input
          type="text"
          placeholder="Search events..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-desi-saffron focus:border-transparent transition-all text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            // Key fix: Ensure event exists before rendering
            event && <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <MdEvent className="mx-auto text-4xl text-stone-300 mb-2" />
          <p className="text-stone-500 font-medium">No events found matching "{filter}"</p>
        </div>
      )}
    </div>
  );
};

export default EventCardList;

// import React, { useState } from "react";
// import EventCard from "./EventCard";

// const EventCardList = ({ events }) => {
//   const [filter, setFilter] = useState("");

//   const filteredEvents = events.filter(
//     (event) =>
//       event.name.toLowerCase().includes(filter.toLowerCase()) ||
//       event.category.toLowerCase().includes(filter.toLowerCase()) ||
//       event.type.toLowerCase().includes(filter.toLowerCase()) ||
//       event.participation.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <>
//       <input
//         type="text"
//         placeholder="Filter by name, category, type, participation"
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//         style={{
//           marginBottom: 20,
//           borderRadius: 30,
//           width: "70%",
//           border: "none",
//           paddingBlock: 10,
//           paddingInline: 20,
//           fontFamily: "DM Sans",
//         }}
//       />
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         {filteredEvents.map((event) => (
//           <EventCard key={event._id} event={event} />
//         ))}
//       </div>
//     </>
//   );
// };

// export default EventCardList;
