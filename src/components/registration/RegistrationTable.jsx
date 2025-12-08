import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
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
    switch(houseName?.toLowerCase()) {
        case 'rajputs': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'spartans': return 'bg-red-100 text-red-800 border-red-200';
        case 'vikings': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'mughals': return 'bg-green-100 text-green-800 border-green-200';
        case 'aryans': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-black font-reality tracking-wide flex items-center gap-2">
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
                    <th key={head} className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
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
                                    
                                    {/* Language Tag */}
                                    {participant.language && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-full uppercase tracking-wide">
                                            {participant.language}
                                        </span>
                                    )}

                                    {/* Act Type Tag */}
                                    {participant.performanceType && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-full uppercase tracking-wide">
                                            {participant.performanceType}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </td>

                    {/* Delete Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                            id={registration._id}
                            onClick={handleDeleteRegistration}
                            className="text-stone-400 hover:text-desi-maroon hover:bg-red-50 p-2 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                            title="Delete Registration"
                        >
                            <AiOutlineDelete size={20} />
                        </button>
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


// import React from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineDelete } from "react-icons/ai";
// import { MdOutlineAdd } from "react-icons/md";
// import { ExportToExcel } from "../../../ExportToExcel";
// import { useSnackbar } from "notistack";

// const RegistrationTable = ({
//   registrations,
//   handleDeleteRegistration,
// }) => {
//   const { enqueueSnackbar } = useSnackbar();

//   return (
//     <>
//       <div className="row">
//         <h3>Registrations ({registrations.length})</h3>
//         <div className="row" style={{ gap: "1rem" }}>
//           {/* Link to Admin Registration Create */}
//           <Link to="/registration/create" className="btn-icon">
//             <MdOutlineAdd />
//           </Link>
//           <ExportToExcel apiData={registrations} fileName={"registrations"} />
//         </div>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>No</th>
//             <th>Event</th>
//             <th>House</th>
//             <th>Participants</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {registrations.map((registration, index) => (
//             <tr key={registration._id}>
//               <td>{index + 1}</td>
//               <td>{registration.event}</td>
//               <td>{registration.house}</td>
//               <td>
//                 {registration.participants.map((participant, pIndex) => (
//                   <p key={pIndex} style={{ margin: "4px 0" }}>
//                     {participant.uid} | {participant.fullName}
                    
//                     {/* Display Language (Literary) */}
//                     {participant.language && (
//                       <span style={{ fontWeight: "600", color: "#555", marginLeft: "5px" }}>
//                         ({participant.language})
//                       </span>
//                     )}

//                     {/* Display Act Type (Open Mic) */}
//                     {participant.performanceType && (
//                       <span style={{ fontStyle: "italic", color: "#555", marginLeft: "5px" }}>
//                         - {participant.performanceType}
//                       </span>
//                     )}
//                   </p>
//                 ))}
//               </td>
//               <td>
//                 <div style={{display: "flex", gap: "10px"}}>
//                    {/* If you have an Edit page, add Link to edit here */}
//                   <button
//                     id={registration._id}
//                     onClick={handleDeleteRegistration}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <AiOutlineDelete id={registration._id} size={20} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default RegistrationTable;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineEdit } from "react-icons/ai";
// import { BsInfo, BsInfoCircle } from "react-icons/bs";
// import {
//   MdInfo,
//   MdOutlineAdd,
//   MdOutlineAddBox,
//   MdOutlineDelete,
//   MdOutlineInfo,
// } from "react-icons/md";
// import { ExportToExcel } from "../../../ExportToExcel";

// const RegistrationTable = ({ registrations, admin = false }) => {
//   const [filter, setFilter] = useState("");

//   const filteredRegistrations = registrations.filter(
//     (registration) =>
//       registration.event.toLowerCase().includes(filter.toLowerCase()) ||
//       registration.house.toLowerCase().includes(filter.toLowerCase())
//   );
//   return (
//     <>
//       <div className="row">
//         <h3>Registrations ({registrations.length})</h3>
//         <ExportToExcel apiData={registrations} fileName={"registrations"} />
//         {admin && (
//           <>
//             <Link to="/registration/create" className="btn-icon">
//               <MdOutlineAdd />
//             </Link>
//             <input
//               type="text"
//               placeholder="Filter by event, house"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               style={{
//                 marginBottom: 20,
//                 borderRadius: 30,
//                 width: "70%",
//                 border: "none",
//                 paddingBlock: 10,
//                 paddingInline: 20,
//                 fontFamily: "DM Sans",
//               }}
//             />
//           </>
//         )}
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>No</th>
//             <th>Event</th>
//             <th>House</th>
//             <th>Participants</th>
//             {admin && <th>Operations</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRegistrations.map((registration, index) => (
//             <tr key={registration._id}>
//               <td>{index + 1}</td>
//               <td>{registration.event}</td>
//               <td>{registration.house}</td>
//               <td>
//                 {registration.participants.map((participant) => (
//                   <p key={participant._id}>
//                     {participant.uid} | {participant.fullName}
//                   </p>
//                 ))}
//               </td>
//               {admin && (
//                 <td>
//                   <div>
//                     <Link
//                       to={`/registration/details/${registration._id}`}
//                       className="btn-icon"
//                     >
//                       <MdOutlineInfo />
//                     </Link>
//                     <Link
//                       to={`/registration/edit/${registration._id}`}
//                       className="btn-icon"
//                     >
//                       <AiOutlineEdit />
//                     </Link>
//                     <Link
//                       to={`/registration/delete/${registration._id}`}
//                       className="btn-icon"
//                     >
//                       <MdOutlineDelete />
//                     </Link>
//                   </div>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default RegistrationTable;
