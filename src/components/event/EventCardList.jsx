import React, { useState } from "react";
import { MdSearch, MdEvent } from "react-icons/md";
import EventCard from "./EventCard";

const EventCardList = ({ house, events = [] }) => {
  const [filter, setFilter] = useState("");

  // Safety check for array
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
          placeholder="Search events by name, category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-desi-saffron focus:border-transparent transition-all text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            // Pass house prop if needed by the card later
            event && <EventCard key={event._id} event={event} house={house} />
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

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const EventCardList = ({ events, house }) => {
//   return (
//     <div className="event-grid">
//       {events.map((event) => (
//         <div key={event._id} className="event-card">
//           <div className="event-header" style={{ color: `#270B55` }}>
//             <h3>{event.name}</h3>
//             <div className="event-badges">
//               <span className={`badge ${event.participation?.toLowerCase()}`}>
//                 {event.participation}
//               </span>
//               <span className={`badge ${event.type?.toLowerCase()}`}>
//                 {event.type}
//               </span>
//               <span className={`badge ${event.registrationEnabled ? 'enabled' : 'disabled'}`}>
//                 {event.registrationEnabled ? 'Registration Open' : 'Registration Closed'}
//               </span>
//             </div>
//           </div>
//           <div className="event-details">
//             <p><strong>Category:</strong> {event.category}</p>
//             <p><strong>Date:</strong> {event.date}</p>
//             <p><strong>Venue:</strong> {event.venue}</p>
//             <p><strong>Individual Limit:</strong> {event.individualLimit}</p>
//             <p><strong>Team Limit:</strong> {event.teamLimit}</p>
//           </div>
//           <div className="event-actions">
//             <Link to={`/captain/event/${event._id}`} className="btn btn-primary">
//               View Details
//             </Link>
//             {event.registrationEnabled && (
//               <Link to={`/captain/event/${event._id}/register`} className="btn btn-success">
//                 Register
//               </Link>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EventCardList; 