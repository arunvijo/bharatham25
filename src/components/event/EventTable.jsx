import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import {
  MdOutlineAdd,
  MdOutlineAddBox,
  MdOutlineDelete,
  MdOutlineInfo,
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const EventTable = ({ events, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.venue.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="row">
        <h3>Events ({events?.length})</h3>
        <ExportToExcel apiData={events} fileName={"events"} />
        {admin && (
          <>
            {" "}
            <Link to="/event/create" className="btn-icon">
              <MdOutlineAdd />
            </Link>
            <input
              type="text"
              placeholder="Filter by name, venue, type, participation, category"
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
          </>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Participation</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Min Limit</th>
            <th>Max Limit</th>
            <th>Team Limit</th>
            <th>Registration Status</th>
            {admin && <th>Operations</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEvents?.map((event, index) => (
            <tr key={event._id} className="h-8">
              <td>{index + 1}</td>
              <td>
                {admin ? (
                  <Link to={`/admin/event/view/${event._id}`}>
                    {event.name}
                  </Link>
                ) : (
                  event.name
                )}
              </td>
              <td>{event.participation}</td>
              <td>{event.type}</td>
              <td>{event.category}</td>
              <td>{event?.date?.substring(0, 10)}</td>
              <td>{event.venue}</td>
              <td>{event.minIndividualLimit}</td>
              <td>{event.maxIndividualLimit}</td>
              <td>{event.teamLimit}</td>
              <td
                className={`badge ${
                  event.registrationEnabled ? "enabled" : "disabled"
                }` } style={{fontWeight: "bold", fontSize: "1.2rem"}}
              >
                {event.registrationEnabled ? "Open" : "Closed"}
              </td>
              {admin && (
                <td>
                  <div>
                    <Link
                      to={`/event/details/${event._id}`}
                      className="btn-icon"
                    >
                      <MdOutlineInfo />
                    </Link>
                    <Link to={`/event/edit/${event._id}`} className="btn-icon">
                      <AiOutlineEdit />
                    </Link>
                    <Link
                      to={`/event/delete/${event._id}`}
                      className="btn-icon"
                    >
                      <MdOutlineDelete />
                    </Link>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EventTable;
