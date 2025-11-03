import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsInfo, BsInfoCircle } from "react-icons/bs";
import {
  MdInfo,
  MdOutlineAdd,
  MdOutlineAddBox,
  MdOutlineDelete,
  MdOutlineInfo,
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";
import { useSnackbar } from "notistack";

const CaptainRegistrationTable = ({
  registrations,
  admin = false,
  handleDeleteRegistration,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleRegistrationClick = (e) => {
    if (!e.currentTarget.dataset.enabled) {
      e.preventDefault();
      enqueueSnackbar("Registration is currently closed for this event", {
        variant: "warning",
      });
    }
  };

  return (
    <>
      <div className="row">
        <h3>Registrations ({registrations.length})</h3>
        <div className="row" style={{ gap: "1rem" }}>
          <Link 
            to="/captain/registration/create" 
            className="btn-icon"
            onClick={handleRegistrationClick}
            data-enabled={true}
          >
            <MdOutlineAdd /> 
          </Link>
          <ExportToExcel apiData={registrations} fileName={"registrations"} />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Event</th>
            <th>House</th>
            <th>Participants</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, index) => (
            <tr key={registration._id}>
              <td>{index + 1}</td>
              <td>{registration.event}</td>
              <td>{registration.house}</td>
              <td>
                {registration.participants.map((participant, index) => (
                  <p key={index}>
                    {participant.uid} | {participant.fullName}
                  </p>
                ))}
              </td>
              <td>
                <div>
                  <button
                    id={registration._id}
                    onClick={handleDeleteRegistration}
                  >
                    <AiOutlineDelete id={registration._id} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CaptainRegistrationTable;
