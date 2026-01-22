import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
    MdOutlineAdd, 
    MdOutlineDelete, 
    MdSearch,
    MdWarning 
} from "react-icons/md";
// FIXED IMPORT: Goes up 2 levels
import { ExportToExcel } from "../../ExportToExcel";

const NegativeScoreTable = ({ scores = [], admin: isAdminMode = false }) => {
    const [filter, setFilter] = useState("");

    // --- HELPER: Safe Event Name Access (Still used for search filtering) ---
    const getEventName = (event) => {
        if (!event) return "";
        return typeof event === "string" ? event : event.name || "";
    };

    const negativeScores = scores.filter((score) => {
        if (score.position !== "Negative") return false;

        const eventName = getEventName(score.event).toLowerCase();
        const houseName = (score.house || "").toLowerCase();
        const reasonText = (score.reason || "").toLowerCase();
        const searchTerm = filter.toLowerCase();

        return (
            eventName.includes(searchTerm) ||
            houseName.includes(searchTerm) ||
            reasonText.includes(searchTerm)
        );
    });

    const cellClass = "px-6 py-4 border-r-[3px] border-stone-300 flex items-center justify-center text-center";

    return (
        <div className="space-y-6 font-['Montserrat'] w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 bg-transparent p-5">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
                        <MdWarning className="text-desi-maroon" /> 
                        Penalties <span className="text-stone-400 text-base font-normal">({negativeScores.length})</span>
                    </h3>
                    {isAdminMode && (
                        <div className="opacity-80 hover:opacity-100 transition-opacity border-2 border-black p-1 bg-white">
                            <ExportToExcel apiData={scores} fileName={"penalties"} />
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72 border-[3px] border-black bg-white">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-900 text-xl" />
                        <input
                            type="text"
                            placeholder="Search penalties..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white text-black focus:outline-none transition-all text-sm font-['Montserrat']"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white overflow-hidden mx-auto">
                <div className="overflow-x-auto">
                    {/* Header Row - UPDATED COLUMNS */}
                    <div className="flex border-b-[3px] border-stone-900 bg-red-50 min-w-[1000px]">
                        <div className="w-[80px] min-w-[80px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">NO.</div>
                        <div className="w-[300px] min-w-[300px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">HOUSE</div>
                        {/* REASON column expanded to fill space previously taken by Event */}
                        <div className="w-[600px] min-w-[600px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">REASON</div>
                        <div className="w-[160px] min-w-[160px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POINTS</div>
                        <div className="w-[80px] min-w-[80px] h-[60px]"></div> 
                    </div>

                    <div className="divide-y divide-stone-300">
                        {negativeScores.map((score, index) => (
                            <div key={score._id} className="flex border-b border-stone-300 hover:bg-red-50/50 transition-colors group min-w-[1000px]">
                                <div className={`w-[80px] min-w-[80px] text-sm text-stone-600 ${cellClass}`}>{index + 1}</div>
                                
                                <div className={`w-[300px] min-w-[300px] ${cellClass}`}>
                                    <span className="px-3 py-1 inline-flex text-lg font-bold rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                        {score.house}
                                    </span>
                                </div>
                                
                                <div className={`w-[600px] min-w-[600px] text-base text-stone-700 ${cellClass} justify-start italic text-wrap`}>
                                    "{score.reason || 'General House Penalty'}"
                                </div>

                                <div className={`w-[160px] min-w-[160px] text-2xl font-extrabold text-desi-maroon ${cellClass}`}>{score.points}</div>

                                <div className={`w-[80px] min-w-[80px] ${cellClass}`}>
                                    {isAdminMode && (
                                        <Link to={`/score/delete/${score._id}`} className="text-stone-400 hover:text-desi-maroon p-2">
                                            <MdOutlineDelete size={20} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {negativeScores.map((score, index) => (
                    <div key={score._id} className="bg-white border-[3px] border-stone-900 shadow-[4px_4px_0px_0px_rgba(127,29,29,1)] p-4 space-y-3 border-l-8 border-l-desi-maroon">
                        <div className="flex justify-between items-center border-b-2 border-red-200 pb-2 bg-red-50 -m-4 mb-3 p-4">
                            <span className="text-sm font-bold text-stone-500">#{index + 1}</span>
                            <div className="flex items-center gap-2">
                                <MdWarning className="text-red-600" size={20} />
                                <span className="text-2xl font-extrabold text-desi-maroon">{score.points} pts</span>
                            </div>
                        </div>
                        
                        <div>
                             <div className="text-xs font-bold text-stone-500 uppercase">House</div>
                             <span className="font-bold text-xl text-stone-800">{score.house}</span>
                        </div>
                        
                        <div>
                             <div className="text-xs font-bold text-stone-500 uppercase">Reason</div>
                             <div className="text-sm text-stone-700 italic bg-red-50 p-3 rounded border border-red-200 mt-1">
                                "{score.reason || 'General House Penalty'}"
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NegativeScoreTable;