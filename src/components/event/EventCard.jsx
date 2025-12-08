import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward, MdGroups, MdPerson, MdPlace, MdDateRange } from "react-icons/md";

const EventCard = ({ event }) => {
  if (!event) return null;

  const isOpen = event.registrationEnabled;
  const isTeam = event.participation === "Group";

  // Helper for date formatting
  const formatDate = (dateString) => {
    if (!dateString || dateString === "TBD") return "Date TBD";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Link
      to={`/captain/event/view/${event._id}`} // Correct route based on your App.jsx
      className="group relative bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Status Strip (Top Border) */}
      <div className={`h-1.5 w-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="p-5 flex-1 flex flex-col">
        
        {/* Header: Category & Status */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-1 rounded-md border border-stone-200">
            {event.category || "General"}
          </span>
          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${isOpen ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-stone-800 font-reality tracking-wide mb-2 group-hover:text-desi-saffron transition-colors line-clamp-2">
          {event.name}
        </h3>
        
        {/* Details */}
        <div className="space-y-1 mb-4">
          <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            {isTeam ? <MdGroups className="text-desi-teal text-sm" /> : <MdPerson className="text-desi-saffron text-sm" />}
            {event.participation} Event
          </p>
          {event.venue && (
             <p className="text-xs text-stone-400 flex items-center gap-1.5">
               <MdPlace className="text-sm" /> {event.venue}
             </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
          <div className="text-xs text-stone-400 font-mono flex items-center gap-1">
             <MdDateRange /> {formatDate(event.date)}
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