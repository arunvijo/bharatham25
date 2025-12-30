import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAdd, MdAppRegistration } from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";
import { useSnackbar } from "notistack";

const RegistrationTable = ({
  registrations,
  admin = false,
  handleDeleteRegistration,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  // Helper for house badge colors
  const getHouseBadgeColor = (houseName) => {
    switch (houseName?.toLowerCase()) {
      case 'rajputs': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'spartans': return 'bg-red-100 text-red-800 border-red-200';
      case 'vikings': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mughals': return 'bg-green-100 text-green-800 border-green-200';
      case 'aryans': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marathas': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
            <MdAppRegistration className="text-desi-saffron" />
            All Registrations <span className="text-stone-400 text-base font-sans font-normal">({registrations.length})</span>
          </h3>
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <ExportToExcel apiData={registrations} fileName={"registrations"} />
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/registration/create"
            className="flex items-center gap-2 px-5 py-2 bg-desi-saffron text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all font-medium"
            title="Add Registration"
          >
            <MdOutlineAdd className="text-xl" />
            <span>New Entry</span>
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
                  <th key={head} className={`px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider ${head === 'Action' ? 'text-right' : 'text-left'}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {registrations.map((registration, index) => (
                <tr key={registration._id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-stone-800">{registration.event}</span>
                  </td>

                  {/* House Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full border ${getHouseBadgeColor(registration.house)}`}>
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

                  {/* Combined Action Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/registration/edit/${registration._id}`}
                        className="text-stone-400 hover:text-desi-saffron hover:bg-orange-50 p-2 rounded-lg transition-all"
                        title="Edit Registration"
                      >
                        <AiOutlineEdit size={20} />
                      </Link>

                      <button
                        onClick={() => handleDeleteRegistration(registration._id)}
                        className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all opacity-60 group-hover:opacity-100"
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
            <p>No registrations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationTable;