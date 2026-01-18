import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdOutlineDelete, 
  MdOutlineInfo, 
  MdSearch,
  MdScore 
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const ScoreTable = ({ scores, admin = false }) => {
  const [filter, setFilter] = useState("");

  // --- HELPER 1: Safe Event Name Access ---
  // Handles both new (Object) and old (String) data formats
  const getEventName = (event) => {
    if (!event) return "";
    return typeof event === "string" ? event : event.name || "";
  };

  // --- HELPER 2: Safe Participant Access ---
  // Handles new direct participant data or old registration links
  const getParticipants = (score) => {
    if (score.participant && score.participant.name) {
        return [{ _id: score.participant.uid, fullName: score.participant.name }];
    }
    return score.registration?.participants || [];
  };

  const filteredScores = scores.filter((score) => {
    const eventName = getEventName(score.event).toLowerCase();
    const houseName = (score.house || "").toLowerCase();
    const positionName = (score.position || "").toLowerCase();
    const search = filter.toLowerCase();

    return (
      eventName.includes(search) ||
      houseName.includes(search) ||
      positionName.includes(search)
    );
  });

  // Helper for Position Badges
  const getPositionStyle = (pos) => {
    const p = (pos || "").toLowerCase();
    if (p.includes("1") || p.includes("first")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (p.includes("2") || p.includes("second")) return "bg-stone-100 text-stone-700 border-stone-200";
    if (p.includes("3") || p.includes("third")) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-stone-50 text-stone-600 border-stone-100";
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-black font-reality tracking-wide flex items-center gap-2">
              <MdScore className="text-desi-saffron" />
              Scores <span className="text-stone-400 text-base font-sans font-normal">({filteredScores?.length})</span>
            </h3>
            {admin && (
              <div className="opacity-80 hover:opacity-100 transition-opacity">
                  <ExportToExcel apiData={scores} fileName={"scores"} />
              </div>
            )}
        </div>

        {admin && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search scores..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-desi-saffron/50 focus:border-desi-saffron transition-all text-sm"
                />
            </div>
            
            <Link 
                to="/score/create" 
                className="p-2 bg-desi-saffron text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all"
                title="Add Score"
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
                {['No', 'Event', 'House', 'Participants', 'Position', 'Points', admin ? 'Action' : ''].map((head) => (
                    head && <th key={head} className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">{head}</th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
                {filteredScores
                  .filter((s) => s.position !== "Negative")
                  .map((score, index) => (
                <tr key={score._id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400">{index + 1}</td>
                    
                    {/* Event Name Safe Render */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-800">
                        {getEventName(score.event)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {score.house}
                        </span>
                    </td>
                    
                    {/* Participants List Safe Render */}
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            {getParticipants(score).map((p, i) => (
                                <span key={p._id || i} className="text-xs font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded border border-stone-100 w-fit">
                                    {p.fullName}
                                </span>
                            ))}
                        </div>
                    </td>

                    {/* Position Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getPositionStyle(score.position)} uppercase tracking-wide`}>
                            {score.position}
                        </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-desi-saffron">{score.points}</td>

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
      </div>
    </div>
  );
};

export default ScoreTable;