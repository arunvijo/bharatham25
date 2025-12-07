import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward, MdGroups, MdPerson } from "react-icons/md";

const EventCard = ({ event }) => {
  // Safety Check: If event prop is missing, don't render anything (prevents crash)
  if (!event) return null;

  const isOpen = event.registrationEnabled;
  const isTeam = event.participation === "Group";

  return (
    <Link
      to={`/captain/event/view/${event._id}`}
      className="group relative bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Status Strip (Top Border) */}
      <div className={`h-1.5 w-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="p-5 flex-1 flex flex-col">
        
        {/* Header: Category & Status */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-1 rounded-md border border-stone-200">
            {event.category || "Event"}
          </span>
          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${isOpen ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-stone-800 font-reality tracking-wide mb-1 group-hover:text-desi-saffron transition-colors line-clamp-2">
          {event.name || "Unnamed Event"}
        </h3>
        
        <p className="text-xs text-stone-500 font-medium mb-4 flex items-center gap-1">
          {isTeam ? <MdGroups className="text-desi-teal" /> : <MdPerson className="text-desi-saffron" />}
          {event.participation} Event
        </p>

        {/* Footer Info */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
          <div className="text-xs text-stone-400 font-mono">
             {/* Safety check for limits */}
             {event.minIndividualLimit || 1}-{event.maxIndividualLimit || event.teamLimit || 1} / Team
          </div>
          
          <span className="flex items-center gap-1 text-xs font-bold text-desi-saffron opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
            Manage <MdArrowForward />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

// import React from "react";
// import { Link } from "react-router-dom";

// const EventCard = ({ event }) => {
//   return (
//     <Link to={`/captain/event/view/${event._id}`} className="event-card">
//       <h3 style={{ color: `#270B55` }}>{event.name}</h3>
//       <p>{event.type} | {event.category}</p>
//       <p>{event.participation}</p>
//       <p>{event.date}</p>
//       <p style={{ color: event.registrationEnabled ? "green" : "red", fontWeight: "bold" }}>{event.registrationEnabled ? "Registration Open" : "Registration Closed"}</p>
//     </Link>
//   );
// };

// export default EventCard;
