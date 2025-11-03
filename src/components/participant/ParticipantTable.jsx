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

const ParticipantTable = ({ participants, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      participant.branch.toLowerCase().includes(filter.toLowerCase()) ||
      participant.semester.toLowerCase().includes(filter.toLowerCase()) ||
      participant.house.toLowerCase().includes(filter.toLowerCase()) ||
      participant.uid.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <>
      <div className="row">
        <h3>Participants ({participants?.length})</h3>
        <ExportToExcel apiData={participants} fileName={"participants"} />
        {admin && (
          <>
            {" "}
            <Link to="/participant/create" className="btn-icon">
              <MdOutlineAdd />
            </Link>
            <input
              type="text"
              placeholder="Filter by full name, branch, semester, house, uid"
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
            <th>UID</th>
            <th>Full Name</th>
            <th>Branch</th>
            <th>Semester</th>
            <th>House</th>
            <th>Individual</th>
            <th>Group</th>
            <th>Literary</th>
            {admin && <th>Operations</th>}
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((participant, index) => (
            <tr key={participant._id} className="h-8">
              <td>{index + 1}</td>
              <td>{participant.uid}</td>
              <td>{participant.fullName}</td>
              <td>{participant.branch}</td>
              <td>{participant.semester}</td>
              <td>{participant.house}</td>
              <td>{participant.individual}</td>
              <td>{participant.group}</td>
              <td>{participant.literary}</td>
              {admin && (
                <td>
                  <div>
                    <Link
                      to={`/participant/details/${participant._id}`}
                      className="btn-icon"
                    >
                      <MdOutlineInfo />
                    </Link>
                    <Link
                      to={`/participant/edit/${participant._id}`}
                      className="btn-icon"
                    >
                      <AiOutlineEdit />
                    </Link>
                    <Link
                      to={`/participant/delete/${participant._id}`}
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

export default ParticipantTable;
