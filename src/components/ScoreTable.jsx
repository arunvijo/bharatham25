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
// Ensure this path is correct for your project structure. 
// If ExportToExcel is in 'src/', use "../ExportToExcel"
import { ExportToExcel } from "../../ExportToExcel"; 

const ScoreTable = ({ scores: inputScores = [], admin: isAdminMode = false }) => {
    const [searchInput, setSearchInput] = useState("");

    // --- HELPER 1: Safe Event Name Access ---
    const getEventName = (event) => {
        if (!event) return "Unknown Event";
        return typeof event === "string" ? event : event.name || "Unknown";
    };

    // --- HELPER 2: Safe Participant Access ---
    const getParticipants = (score) => {
        if (score.participant && score.participant.name) {
            return [{ _id: score.participant.uid, fullName: score.participant.name }];
        }
        return score.registration?.participants || [];
    };

    // --- FILTER LOGIC ---
    const displayedScores = inputScores.filter((scoreItem) => {
        if (!scoreItem) return false;
        
        // Exclude Penalties
        if (scoreItem.position === "Negative") return false;

        // Safe Lowercase Matching
        const eventName = getEventName(scoreItem.event).toLowerCase();
        const houseName = (scoreItem.house || "").toLowerCase();
        const positionName = (scoreItem.position || "").toLowerCase();
        const search = searchInput.toLowerCase();

        return (
            eventName.includes(search) ||
            houseName.includes(search) ||
            positionName.includes(search)
        );
    });

    // --- POSITION BADGE STYLES ---
    const getPositionStyle = (positionString) => {
        const p = (positionString || "").toLowerCase();
        if (p.includes("1") || p.includes("first")) return "bg-yellow-100 text-yellow-800 border-yellow-300"; 
        if (p.includes("2") || p.includes("second")) return "bg-stone-200 text-stone-700 border-stone-300"; 
        if (p.includes("3") || p.includes("third")) return "bg-orange-200 text-orange-800 border-orange-300"; 
        return "bg-stone-100 text-stone-600 border-stone-200";
    };
    
    const tableCellClass = "px-6 py-4 border-r-[3px] border-stone-300 flex items-center justify-center text-center";

    return (
        <div className="space-y-6 font-['Montserrat'] w-full">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-transparent p-5">
                
                {/* Left: Title & Export */}
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
                        <MdScore className="text-desi-saffron" /> 
                        Records <span className="text-stone-400 text-base font-normal">({displayedScores?.length})</span>
                    </h3>
                    {isAdminMode && (
                        <div className="opacity-80 hover:opacity-100 transition-opacity border-2 border-black p-1 bg-white">
                            <ExportToExcel apiData={inputScores} fileName={"scores"} />
                        </div>
                    )}
                </div>

                {/* Right: Search & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    
                    {/* Search Bar - Visible to EVERYONE */}
                    <div className="relative flex-1 md:w-72 border-[3px] border-black bg-white">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-900 text-xl" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white text-black focus:outline-none transition-all text-sm font-['Montserrat']"
                        />
                    </div>

                    {/* Add Score Button - Restricted to ADMIN */}
                    {isAdminMode && (
                        <Link 
                            to="/score/create" 
                            className="p-3 bg-desi-saffron text-white border-[3px] border-black rounded-sm shadow-md hover:bg-amber-700 hover:scale-105 transition-all"
                            title="Add Score"
                        >
                            <MdOutlineAdd className="text-2xl" />
                        </Link>
                    )}
                </div>
            </div>

            {/* --- DESKTOP TABLE VIEW --- */}
            <div className="hidden lg:block bg-white overflow-hidden mx-auto">
                <div className="overflow-x-auto">
                    <div className="flex border-b-[3px] border-stone-900 bg-stone-100 min-w-[1241px]">
                        <div className="w-[80px] min-w-[80px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">NO.</div>
                        <div className="w-[256px] min-w-[256px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">EVENTS</div>
                        <div className="w-[224px] min-w-[224px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">HOUSE</div>
                        <div className="w-[288px] min-w-[288px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">PARTICIPANTS</div>
                        <div className="w-[176px] min-w-[176px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POSITION</div>
                        <div className="w-[160px] min-w-[160px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POINTS</div>
                        {isAdminMode && <div className="w-[57px] min-w-[57px] h-[60px] flex items-center justify-center text-3xl font-bold font-['Montserrat']">...</div>}
                    </div>

                    <div className="divide-y divide-stone-300">
                        {displayedScores.map((scoreItem, index) => (
                            <div key={scoreItem._id || index} className="flex border-b border-stone-300 hover:bg-orange-50/50 transition-colors group min-w-[1241px]">
                                <div className={`w-[80px] min-w-[80px] text-sm text-stone-600 ${tableCellClass}`}>{index + 1}</div>
                                
                                <div className={`w-[256px] min-w-[256px] text-base font-bold text-stone-800 ${tableCellClass} justify-start`}>
                                    {getEventName(scoreItem.event)}
                                </div>
                                
                                <div className={`w-[224px] min-w-[224px] ${tableCellClass}`}>
                                    <span className="px-2.5 py-0.5 inline-flex text-sm font-bold rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                        {scoreItem.house}
                                    </span>
                                </div>
                                
                                <div className={`w-[288px] min-w-[288px] ${tableCellClass} justify-start`}>
                                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                        {getParticipants(scoreItem).map((participant, i) => (
                                            <span 
                                                key={participant._id || i} 
                                                className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200"
                                            >
                                                {participant.fullName?.split(' ')[0] || 'Unknown'}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={`w-[176px] min-w-[176px] ${tableCellClass}`}>
                                    <span className={`px-3 py-1 inline-flex text-sm font-bold rounded-sm border-2 ${getPositionStyle(scoreItem.position)} uppercase tracking-wider`}>
                                        {scoreItem.position}
                                    </span>
                                </div>

                                <div className={`w-[160px] min-w-[160px] text-2xl font-extrabold text-desi-saffron ${tableCellClass}`}>{scoreItem.points}</div>

                                {isAdminMode && (
                                    <div className={`w-[57px] min-w-[57px] ${tableCellClass}`}>
                                        <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/score/details/${scoreItem._id}`} className="text-stone-700 hover:text-blue-600 p-1"><MdOutlineInfo size={16} /></Link>
                                            <Link to={`/score/edit/${scoreItem._id}`} className="text-stone-700 hover:text-desi-saffron p-1"><AiOutlineEdit size={16} /></Link>
                                            <Link to={`/score/delete/${scoreItem._id}`} className="text-stone-700 hover:text-red-600 p-1"><MdOutlineDelete size={16} /></Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MOBILE CARD VIEW --- */}
            <div className="lg:hidden space-y-4">
                {displayedScores.map((scoreItem, index) => (
                    <div key={scoreItem._id || index} className="bg-white border-[3px] border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3">
                        <div className="flex justify-between items-center border-b-2 border-stone-200 pb-2">
                            <span className="text-sm font-bold text-stone-500">#{index + 1}</span>
                            <span className="text-2xl font-extrabold text-desi-saffron">{scoreItem.points} pts</span>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Event</div>
                            <div className="text-lg font-bold text-stone-800">{getEventName(scoreItem.event)}</div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex-1 min-w-[120px]">
                                <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">House</div>
                                <span className="px-2.5 py-1 inline-flex text-sm font-bold rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                    {scoreItem.house}
                                </span>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Position</div>
                                <span className={`px-3 py-1 inline-flex text-sm font-bold rounded-sm border-2 ${getPositionStyle(scoreItem.position)} uppercase tracking-wider`}>
                                    {scoreItem.position}
                                </span>
                            </div>
                        </div>

                        {/* Participants */}
                        {(() => {
                            const parts = getParticipants(scoreItem);
                            if (parts.length > 0) {
                                return (
                                    <div>
                                        <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Participants</div>
                                        <div className="flex flex-wrap gap-2">
                                            {parts.map((participant, i) => (
                                                <span 
                                                    key={participant._id || i} 
                                                    className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200"
                                                >
                                                    {participant.fullName?.split(' ')[0] || 'Unknown'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                        })()}

                        {isAdminMode && (
                            <div className="flex gap-2 pt-2 border-t-2 border-stone-200">
                                <Link to={`/score/details/${scoreItem._id}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white border-2 border-black text-sm font-bold hover:bg-blue-600 transition-colors">
                                    <MdOutlineInfo size={16} /> Details
                                </Link>
                                <Link to={`/score/edit/${scoreItem._id}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-desi-saffron text-white border-2 border-black text-sm font-bold hover:bg-amber-700 transition-colors">
                                    <AiOutlineEdit size={16} /> Edit
                                </Link>
                                <Link to={`/score/delete/${scoreItem._id}`} className="flex items-center justify-center px-3 py-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-colors">
                                    <MdOutlineDelete size={18} />
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScoreTable;