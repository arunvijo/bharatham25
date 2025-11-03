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

const ScoreTable = ({ scores, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredScores = scores.filter(
    (score) =>
      score.event.toLowerCase().includes(filter.toLowerCase()) ||
      score.house.toLowerCase().includes(filter.toLowerCase()) ||
      score.position.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="score-table">
      <div className="row">
        <h3>Scores ({filteredScores?.length})</h3>
        {admin && <ExportToExcel apiData={scores} fileName={"scores"} />}
        {admin && (
          <>
            <Link to="/score/create" className="btn-icon">
              <MdOutlineAdd />
            </Link>
            <input
              type="text"
              placeholder="Filter by event, house, position"
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
            <th>Position</th>
            <th>Points</th>
            {admin && <th>Operations</th>}
          </tr>
        </thead>
        <tbody>
          {filteredScores
            .filter((s) => s.position != "Negative")
            .map((score, index) => (
              <tr key={score._id} className="h-8">
                <td>{index + 1}</td>
                <td>{score.event}</td>
                <td>{score.house}</td>
                <td>
                  {score.registration.participants.map((p) => (
                    <p key={p._id} style={{ fontSize: "inherit" }}>
                      {p.uid} | {p.fullName}
                    </p>
                  ))}
                </td>
                <td>{score.position}</td>
                <td>{score.points}</td>
                {admin && (
                  <td>
                    <div>
                      <Link
                        to={`/score/details/${score._id}`}
                        className="btn-icon"
                      >
                        <MdOutlineInfo />
                      </Link>
                      <Link
                        to={`/score/edit/${score._id}`}
                        className="btn-icon"
                      >
                        <AiOutlineEdit />
                      </Link>
                      <Link
                        to={`/score/delete/${score._id}`}
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
    </div>
  );
};

export default ScoreTable;
