import React, { useState } from "react";
import { MdSearch, MdEvent } from "react-icons/md";
import EventCard from "./EventCard";

const EventCardList = ({ events = [] }) => {
  const [filter, setFilter] = useState("");

  // Safety check: Ensure events is an array before filtering
  const safeEvents = Array.isArray(events) ? events : [];

  // UPDATED LOGIC: Deadlines from Manual 2026 
  const PRE_EVENT_DEADLINE = new Date("2026-01-04T23:59:59");
  const MAIN_EVENT_DEADLINE = new Date("2026-01-19T12:00:00");
  const now = new Date();

  const filteredAndSortedEvents = safeEvents
    .filter(
      (event) =>
        event?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        event?.category?.toLowerCase().includes(filter.toLowerCase()) ||
        event?.type?.toLowerCase().includes(filter.toLowerCase()) ||
        event?.participation?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      // Helper to check if an event is open based on manual rules 
      const isOpen = (ev) => {
      const isPre = ev.category === "Pre-Event" || ev.isPreEvent === true;
      const isTurnAround = ev.name === "Turn Around";
      const deadline = (isPre && !isTurnAround) ? PRE_EVENT_DEADLINE : MAIN_EVENT_DEADLINE;
      return ev.registrationEnabled && now < deadline;
    };

      const aOpen = isOpen(a);
      const bOpen = isOpen(b);

      // Place Open events (true/1) before Closed events (false/0)
      if (aOpen && !bOpen) return -1;
      if (!aOpen && bOpen) return 1;
      return 0;
    });

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
      {filteredAndSortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEvents.map((event) => (
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