import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward, MdGroups, MdPerson, MdTimer } from "react-icons/md";

const EventCard = ({ event }) => {
  // Safety Check: If event prop is missing, don't render anything (prevents crash)
  if (!event) return null;

  // UPDATED LOGIC: Deadlines from Manual 2026
  const PRE_EVENT_DEADLINE = new Date("2026-01-04T23:59:59");
  const MAIN_EVENT_DEADLINE = new Date("2026-01-19T13:00:00");
  const now = new Date();

  // Check if event is a Pre-Event to determine which deadline to use
  const isPreEvent = event.category === "Pre-Event" || event.isPreEvent === true;
  const isTurnAround = event.name === "Turn Around";
  const deadline = (isPreEvent && !isTurnAround) ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
  
  // Event is "Open" only if enabled AND within the deadline
  const isWithinDeadline = now < deadline;
  const isOpen = event.registrationEnabled && isWithinDeadline;
  
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
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${isOpen ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            {/* Show deadline warning for Pre-Events if Jan 4 is near or passed */}
            {isPreEvent && isWithinDeadline && (
              <span className="text-[9px] text-orange-600 font-bold flex items-center gap-0.5">
                <MdTimer /> Jan 4
              </span>
            )}
          </div>
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
             {/* Safety check for team limits based on manual data */}
             {event.minTeamSize || event.minIndividualLimit || 1}-{event.maxTeamSize || event.maxIndividualLimit || 1} / Entry
          </div>
          
          <span className="flex items-center gap-1 text-xs font-bold text-desi-saffron opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
            {isOpen ? 'Register' : 'View'} <MdArrowForward />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;