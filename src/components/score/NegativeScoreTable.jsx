import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdOutlineDelete, 
  MdOutlineInfo, 
  MdSearch,
  MdWarning
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const NegativeScoreTable = ({ scores, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredScores = scores.filter(
    (score) =>
      score.event.toLowerCase().includes(filter.toLowerCase()) ||
      score.house.toLowerCase().includes(filter.toLowerCase()) ||
      score.reason?.toLowerCase().includes(filter.toLowerCase())
  );

  const negativeScores = filteredScores.filter((s) => s.position === "Negative");

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section (Maroon Theme) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-maroon">
        <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-black font-reality tracking-wide flex items-center gap-2">
              <MdWarning className="text-desi-maroon" />
              Penalties <span className="text-stone-400 text-base font-sans font-normal">({negativeScores.length})</span>
            </h3>
            {admin && (
              <div className="opacity-80 hover:opacity-100 transition-opacity">
                  <ExportToExcel apiData={scores} fileName={"penalties"} />
              </div>
            )}
        </div>

        {admin && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search penalties..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-desi-maroon/30 focus:border-desi-maroon transition-all text-sm"
                />
            </div>
            
            <Link 
                to="/score/create" 
                className="p-2 bg-desi-maroon text-white rounded-full shadow-lg hover:bg-red-900 hover:scale-105 transition-all"
                title="Add Penalty"
            >
              <MdOutlineAdd className="text-2xl" />
            </Link>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
                <tr>
                {['No', 'Event', 'House', 'Reason', 'Penalty Points', admin ? 'Action' : ''].map((head) => (
                    head && <th key={head} className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">{head}</th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
                {negativeScores.map((score, index) => (
                <tr key={score._id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-800">{score.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {score.house}
                        </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-stone-600 italic">
                        "{score.reason}"
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-desi-maroon">
                        {score.points}
                    </td>

                    {/* Actions */}
                    {admin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link to={`/score/details/${score._id}`} className="text-stone-400 hover:text-blue-600 p-1.5"><MdOutlineInfo size={18} /></Link>
                            <Link to={`/score/edit/${score._id}`} className="text-stone-400 hover:text-desi-saffron p-1.5"><AiOutlineEdit size={18} /></Link>
                            <Link to={`/score/delete/${score._id}`} className="text-stone-400 hover:text-desi-maroon p-1.5"><MdOutlineDelete size={18} /></Link>
                        </div>
                    </td>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {negativeScores.length === 0 && (
            <div className="p-12 text-center text-stone-400">
                <MdWarning className="text-4xl mx-auto mb-2 opacity-20" />
                <p>No penalties found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default NegativeScoreTable;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineEdit } from "react-icons/ai";
// import { BsInfoCircle } from "react-icons/bs";
// import {
//   MdOutlineAdd,
//   MdOutlineAddBox,
//   MdOutlineDelete,
//   MdOutlineInfo,
// } from "react-icons/md";
// import { ExportToExcel } from "../../../ExportToExcel";

// const NegativeScoreTable = ({ scores, admin = false }) => {
//   const [filter, setFilter] = useState("");

//   const filteredScores = scores.filter(
//     (score) =>
//       score.event.toLowerCase().includes(filter.toLowerCase()) ||
//       score.house.toLowerCase().includes(filter.toLowerCase()) ||
//       score.reason?.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div className="score-table">
//       <div className="row">
//         <h3>Negative Scores ({filteredScores?.filter((s) => s.position == "Negative").length})</h3>
//         {admin && <ExportToExcel apiData={scores} fileName={"scores"} />}
//         {admin && (
//           <>
//             <Link to="/score/create" className="btn-icon">
//               <MdOutlineAdd />
//             </Link>
//             <input
//               type="text"
//               placeholder="Filter by event, house, reason"
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
//             {/* <th>Participants</th> */}
//             <th>Reason</th>
//             <th>Points</th>
//             {admin && <th>Operations</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredScores
//             .filter((s) => s.position == "Negative")
//             .map((score, index) => (
//               <tr key={score._id} className="h-8">
//                 <td>{index + 1}</td>
//                 <td>{score.event}</td>
//                 <td>{score.house}</td>
//                 {/* <td>
//                   {score.registration.participants.map((p) => (
//                     <p key={p._id} style={{ fontSize: "inherit" }}>
//                       {p.uid} | {p.fullName}
//                     </p>
//                   ))}
//                 </td> */}
//                 <td>{score.reason}</td>
//                 <td>{score.points}</td>
//                 {admin && (
//                   <td>
//                     <div>
//                       <Link
//                         to={`/score/details/${score._id}`}
//                         className="btn-icon"
//                       >
//                         <MdOutlineInfo />
//                       </Link>
//                       <Link
//                         to={`/score/edit/${score._id}`}
//                         className="btn-icon"
//                       >
//                         <AiOutlineEdit />
//                       </Link>
//                       <Link
//                         to={`/score/delete/${score._id}`}
//                         className="btn-icon"
//                       >
//                         <MdOutlineDelete />
//                       </Link>
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default NegativeScoreTable;
