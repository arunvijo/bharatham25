import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EventCardList = ({ events, house }) => {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <div className="event-header" style={{ color: `#270B55` }}>
            <h3>{event.name}</h3>
            <div className="event-badges">
              <span className={`badge ${event.participation?.toLowerCase()}`}>
                {event.participation}
              </span>
              <span className={`badge ${event.type?.toLowerCase()}`}>
                {event.type}
              </span>
              <span className={`badge ${event.registrationEnabled ? 'enabled' : 'disabled'}`}>
                {event.registrationEnabled ? 'Registration Open' : 'Registration Closed'}
              </span>
            </div>
          </div>
          <div className="event-details">
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Individual Limit:</strong> {event.individualLimit}</p>
            <p><strong>Team Limit:</strong> {event.teamLimit}</p>
          </div>
          <div className="event-actions">
            <Link to={`/captain/event/${event._id}`} className="btn btn-primary">
              View Details
            </Link>
            {event.registrationEnabled && (
              <Link to={`/captain/event/${event._id}/register`} className="btn btn-success">
                Register
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCardList; 