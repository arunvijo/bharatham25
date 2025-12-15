import React, { useState } from "react";
// Removed Link and admin-specific icons/imports: AiOutlineEdit, MdOutlineAdd, MdOutlineDelete, MdOutlineInfo
import { 
    MdSearch,
    MdWarning
} from "react-icons/md";
// Removed ExportToExcel as it's an admin feature
// import { ExportToExcel } from "../../ExportToExcel";

// Removed 'admin' prop from the signature
const NegativeScoreTable = ({ scores }) => {
    const [filter, setFilter] = useState("");

    // Filtering logic remains unchanged
    const filteredScores = scores.filter(
        (score) =>
            score.event.toLowerCase().includes(filter.toLowerCase()) ||
            score.house.toLowerCase().includes(filter.toLowerCase()) ||
            score.reason?.toLowerCase().includes(filter.toLowerCase())
    );

    const negativeScores = filteredScores.filter((s) => s.position === "Negative");

    // --- Custom Styles based on Figma Table Layout ---
    const cellClass = "px-6 py-4 border-r-[3px] border-stone-300 flex items-center justify-center text-center";

    return (
        <div className="space-y-6 font-['Montserrat'] w-full">
            
            {/* Header Section (Controls) - Reduced to Viewer Search only */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 bg-transparent p-5">
                
                {/* Search Bar (Kept visible for viewer filtering) */}
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

            {/* Table Card (Responsive container for the table) */}
            <div className="bg-white overflow-hidden mx-auto">
                <div className="overflow-x-auto"> {/* Enables horizontal scrolling on small screens */}
                    
                    {/* Table Headers (Structure maintained) */}
                    <div className="flex border-b-[3px] border-stone-900 bg-red-50 min-w-[1241px]">
                        {/* Column Widths (Approximated to match the fixed Figma layout) */}
                        <div className="w-[80px] min-w-[80px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">NO.</div>
                        <div className="w-[256px] min-w-[256px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">EVENTS</div>
                        <div className="w-[224px] min-w-[224px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">HOUSE</div>
                        <div className="w-[440px] min-w-[440px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">REASON</div>
                        <div className="w-[160px] min-w-[160px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-bold font-['Montserrat']">POINTS</div>
                        {/* Action Column removed: w-[80px] space is implicitly left empty to preserve other columns' widths */}
                        <div className="w-[80px] min-w-[80px] h-[60px]"></div> 
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-stone-300">
                        {negativeScores.map((score, index) => (
                            <div key={score._id} className="flex border-b border-stone-300 hover:bg-red-50/50 transition-colors group min-w-[1241px]">
                                
                                {/* No */}
                                <div className={`w-[80px] min-w-[80px] text-sm text-stone-600 ${cellClass}`}>{index + 1}</div>
                                
                                {/* Event */}
                                <div className={`w-[256px] min-w-[256px] text-base font-bold text-stone-800 ${cellClass} justify-start`}>{score.event}</div>
                                
                                {/* House */}
                                <div className={`w-[224px] min-w-[224px] ${cellClass}`}>
                                    <span className="px-2.5 py-0.5 inline-flex text-sm font-bold rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                        {score.house}
                                    </span>
                                </div>
                                
                                {/* Reason */}
                                <div className={`w-[440px] min-w-[440px] text-sm text-stone-700 ${cellClass} justify-start italic text-wrap`}>
                                    "{score.reason || 'Not specified'}"
                                </div>

                                {/* Penalty Points */}
                                <div className={`w-[160px] min-w-[160px] text-2xl font-extrabold text-desi-maroon ${cellClass}`}>{score.points}</div>

                                {/* Actions - Removed content */}
                                <div className={`w-[80px] min-w-[80px] ${cellClass}`}>
                                    {/* Empty content */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {negativeScores.length === 0 && (
                    <div className="p-12 text-center text-stone-600">
                        <MdWarning className="text-4xl mx-auto mb-2 opacity-50" />
                        <p className="text-xl">No penalties found in the log.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NegativeScoreTable;