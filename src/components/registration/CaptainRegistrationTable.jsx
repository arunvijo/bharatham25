import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAdd, MdAppRegistration } from "react-icons/md";
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
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-teal">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
            <MdAppRegistration className="text-desi-teal" />
            Registrations <span className="text-stone-400 text-base font-sans font-normal">({registrations.length})</span>
          </h3>
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <ExportToExcel apiData={registrations} fileName={"registrations"} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/captain/registration/create"
            className="flex items-center gap-2 px-5 py-2 bg-desi-teal text-white rounded-full shadow-lg hover:bg-teal-800 hover:scale-105 transition-all font-medium"
            onClick={handleRegistrationClick}
            data-enabled={true}
          >
            <MdOutlineAdd className="text-xl" />
            <span>New Registration</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                {['No', 'Event', 'House', 'Participants', 'Action'].map((head) => (
                  <th 
                    key={head} 
                    className={`px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider ${head === 'Action' ? 'text-right' : 'text-left'}`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {registrations.map((registration, index) => (
                <tr key={registration._id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-stone-800 block">{registration.event}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {registration.house}
                    </span>
                  </td>
                  
                  {/* Participants List */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {registration.participants.map((participant, pIndex) => (
                        <div key={pIndex} className="flex items-center gap-2 text-sm text-stone-700">
                          <span className="font-mono text-desi-teal text-xs bg-teal-50 px-1.5 rounded border border-teal-100">
                            {participant.uid}
                          </span>
                          <span className="font-medium">{participant.fullName}</span>
                          
                          {participant.language && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-full uppercase tracking-wide">
                              {participant.language}
                            </span>
                          )}

                          {participant.performanceType && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-full uppercase tracking-wide">
                              {participant.performanceType}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Actions Column - Fixed Layout */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/captain/registration/edit/${registration._id}`}
                        className="text-stone-400 hover:text-desi-teal hover:bg-teal-50 p-2 rounded-lg transition-all"
                        title="Edit Participants"
                      >
                        <AiOutlineEdit size={20} />
                      </Link>
                      
                      <button
                        id={registration._id}
                        onClick={handleDeleteRegistration}
                        className="text-stone-400 hover:text-desi-maroon hover:bg-red-50 p-2 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                        title="Delete Registration"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {registrations.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400">
            <MdAppRegistration className="text-4xl mb-2 opacity-20" />
            <p>No registrations found yet.</p>
            <Link 
              to="/captain/registration/create"
              className="mt-4 text-sm text-desi-teal font-medium hover:underline"
            >
              Create your first registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainRegistrationTable;