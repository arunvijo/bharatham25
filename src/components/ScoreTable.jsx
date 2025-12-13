import React, { useState } from "react";
// Removed unused admin-specific icons/imports
import { 
    // MdOutlineAdd, 
    // MdOutlineDelete, 
    // MdOutlineInfo, 
    MdSearch,
    MdScore 
} from "react-icons/md";
// Removed unused admin tool
// import { ExportToExcel } from "../../ExportToExcel"; 
// Removed AiOutlineEdit

// Renamed props for clarity, removing isAdminMode since this is viewer-only
const ScoreTable = ({ scores: inputScores }) => {
    // Variable Renaming: filter -> searchInput
    const [searchInput, setSearchInput] = useState("");

    // Variable Renaming: filteredScores -> displayedScores
    // Logic remains unchanged: filtering based on searchInput and excluding "Negative" position
    const displayedScores = inputScores.filter(
        (scoreItem) =>
            (scoreItem.position !== "Negative") && 
            (
                scoreItem.event.toLowerCase().includes(searchInput.toLowerCase()) ||
                scoreItem.house.toLowerCase().includes(searchInput.toLowerCase()) ||
                scoreItem.position.toLowerCase().includes(searchInput.toLowerCase())
            )
    );

    // Variable Renaming: pos -> positionString
    // Helper for Position Badges - Logic remains unchanged
    const getPositionStyle = (positionString) => {
        const p = positionString.toLowerCase();
        if (p.includes("1") || p.includes("first")) return "bg-yellow-100 text-yellow-800 border-yellow-300"; 
        if (p.includes("2") || p.includes("second")) return "bg-stone-200 text-stone-700 border-stone-300"; 
        if (p.includes("3") || p.includes("third")) return "bg-orange-200 text-orange-800 border-orange-300"; 
        return "bg-stone-100 text-stone-600 border-stone-200";
    };
    
    // --- Custom Styles based on Figma Table Layout (Class names remain unchanged) ---
    // Note: The structure relies on min-width/width classes that were set based on the ADMIN table (including the action column).
    // For a viewer-only table, the widths should be recalculated to use the full 1241px space. 
    // However, since the request states *no structure change*, I will maintain the current column widths, which will result in some empty space where the action column *would* be.
    const tableCellClass = "px-6 py-4 border-r-[3px] border-stone-300 flex items-center justify-center text-center";
    
    return (
        // Wrapper for the entire component section (Structure remains unchanged)
        <div className="space-y-6 font-['Montserrat'] w-full">
            
            {/* Header Section (Controls) - Reduced to Viewer Search only */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 bg-transparent p-5">
                
                {/* Search Bar (Kept visible for viewer filtering) */}
                <div className="flex items-center gap-3 w-full md:w-auto">
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
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white overflow-hidden mx-auto">
                <div className="overflow-x-auto">
                    
                    {/* Table Headers (Structure remains unchanged) */}
                    <div className="flex border-b-[3px] border-stone-900 bg-stone-100 min-w-[1241px]">
                        <div className="w-[80px] min-w-[80px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">NO.</div>
                        <div className="w-[256px] min-w-[256px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">EVENTS</div>
                        <div className="w-[224px] min-w-[224px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">HOUSE</div>
                        <div className="w-[288px] min-w-[288px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">PARTICIPANTS</div>
                        <div className="w-[176px] min-w-[176px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POSITION</div>
                        <div className="w-[160px] min-w-[160px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POINTS</div>
                        {/* Removed Action Column Header: Width 57px is now implicitly empty space */}
                        <div className="w-[57px] min-w-[57px] h-[60px] flex items-center justify-center text-3xl font-bold font-['Montserrat']"></div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-stone-300">
                        {displayedScores.map((scoreItem, index) => (
                                <div key={scoreItem._id} className="flex border-b border-stone-300 hover:bg-orange-50/50 transition-colors group min-w-[1241px]">
                                    
                                    {/* No */}
                                    <div className={`w-[80px] min-w-[80px] text-sm text-stone-600 ${tableCellClass}`}>{index + 1}</div>
                                    
                                    {/* Event */}
                                    <div className={`w-[256px] min-w-[256px] text-base font-bold text-stone-800 ${tableCellClass} justify-start`}>{scoreItem.event}</div>
                                    
                                    {/* House */}
                                    <div className={`w-[224px] min-w-[224px] ${tableCellClass}`}>
                                        <span className="px-2.5 py-0.5 inline-flex text-sm font-bold rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                            {scoreItem.house}
                                        </span>
                                    </div>
                                    
                                    {/* Participants List */}
                                    <div className={`w-[288px] min-w-[288px] ${tableCellClass} justify-start`}>
                                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                            {scoreItem.registration?.participants?.map((participant) => (
                                                <span key={participant._id} className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200">
                                                    {participant.fullName.split(' ')[0]} 
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Position Badge */}
                                    <div className={`w-[176px] min-w-[176px] ${tableCellClass}`}>
                                        <span className={`px-3 py-1 inline-flex text-sm font-bold rounded-sm border-2 ${getPositionStyle(scoreItem.position)} uppercase tracking-wider`}>
                                            {scoreItem.position}
                                        </span>
                                    </div>

                                    {/* Points */}
                                    <div className={`w-[160px] min-w-[160px] text-2xl font-extrabold text-desi-saffron ${tableCellClass}`}>{scoreItem.points}</div>

                                    {/* Actions (This cell remains, but is empty/unused) */}
                                    <div className={`w-[57px] min-w-[57px] ${tableCellClass}`}>
                                        {/* Content removed for viewer mode */}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreTable;