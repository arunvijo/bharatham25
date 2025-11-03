import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfo, BsInfoCircle } from "react-icons/bs";
import {
  MdInfo,
  MdOutlineAdd,
  MdOutlineAddBox,
  MdOutlineDelete,
  MdOutlineInfo,
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const RegistrationTable = ({ registrations, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.event.toLowerCase().includes(filter.toLowerCase()) ||
      registration.house.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <>
      <div className="row">
        <h3>Registrations ({registrations.length})</h3>
        <ExportToExcel apiData={registrations} fileName={"registrations"} />
        {admin && (
          <>
            <Link to="/registration/create" className="btn-icon">
              <MdOutlineAdd />
            </Link>
            <input
              type="text"
              placeholder="Filter by event, house"
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
            <th>Event</th>
            <th>House</th>
            <th>Participants</th>
            {admin && <th>Operations</th>}
          </tr>
        </thead>
        <tbody>
          {filteredRegistrations.map((registration, index) => (
            <tr key={registration._id}>
              <td>{index + 1}</td>
              <td>{registration.event}</td>
              <td>{registration.house}</td>
              <td>
                {registration.participants.map((participant) => (
                  <p key={participant._id}>
                    {participant.uid} | {participant.fullName}
                  </p>
                ))}
              </td>
              {admin && (
                <td>
                  <div>
                    <Link
                      to={`/registration/details/${registration._id}`}
                      className="btn-icon"
                    >
                      <MdOutlineInfo />
                    </Link>
                    <Link
                      to={`/registration/edit/${registration._id}`}
                      className="btn-icon"
                    >
                      <AiOutlineEdit />
                    </Link>
                    <Link
                      to={`/registration/delete/${registration._id}`}
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

export default RegistrationTable;
