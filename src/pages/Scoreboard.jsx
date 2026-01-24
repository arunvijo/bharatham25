import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { 
    MdOutlineAdd, 
    MdOutlineDelete, 
    MdOutlineInfo, 
    MdSearch,
    MdScore,
    MdChevronLeft,
    MdChevronRight
} from "react-icons/md";
import { ExportToExcel } from "../../ExportToExcel"; 

const ScoreTable = ({ scores: inputScores = [], admin: isAdminMode = false }) => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(displayedScores.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedScores = displayedScores.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchInput]);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

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
        <div className="space-y-6 w-full">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-transparent p-5">
                
                {/* Left: Title & Export */}
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-mont text-black tracking-wide flex items-center gap-2">
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
                            className="w-full pl-10 pr-4 py-2 bg-white text-black focus:outline-none transition-all text-sm"
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
                        <div className="w-[80px] min-w-[80px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">NO.</div>
                        <div className="w-[256px] min-w-[256px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">EVENTS</div>
                        <div className="w-[224px] min-w-[224px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">HOUSE</div>
                        <div className="w-[288px] min-w-[288px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">PARTICIPANTS</div>
                        <div className="w-[176px] min-w-[176px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">POSITION</div>
                        <div className="w-[160px] min-w-[160px] h-[60px] border-r-[3px] border-stone-900 flex items-center justify-center text-3xl font-mont">POINTS</div>
                        {isAdminMode && <div className="w-[57px] min-w-[57px] h-[60px] flex items-center justify-center text-3xl font-mont">...</div>}
                    </div>

                    <div className="divide-y divide-stone-300">
                        {paginatedScores.map((scoreItem, index) => (
                            <div key={scoreItem._id || index} className="flex border-b border-stone-300 hover:bg-orange-50/50 transition-colors group min-w-[1241px]">
                                <div className={`w-[80px] min-w-[80px] text-sm text-stone-600 ${tableCellClass}`}>
                                    {startIndex + index + 1}
                                </div>
                                
                                <div className={`w-[256px] min-w-[256px] text-base font-mont text-stone-800 ${tableCellClass} justify-start`}>
                                    {getEventName(scoreItem.event)}
                                </div>
                                
                                <div className={`w-[224px] min-w-[224px] ${tableCellClass}`}>
                                    <span className="px-2.5 py-0.5 inline-flex text-sm font-mont rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                        {scoreItem.house}
                                    </span>
                                </div>
                                
                                <div className={`w-[288px] min-w-[288px] ${tableCellClass} justify-start`}>
                                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                        {getParticipants(scoreItem).map((participant, i) => (
                                            <span 
                                                key={participant._id || i} 
                                                className="text-xs font-mont text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200"
                                            >
                                                {participant.fullName?.split(' ')[0] || 'Unknown'}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={`w-[176px] min-w-[176px] ${tableCellClass}`}>
                                    <span className={`px-3 py-1 inline-flex text-sm font-mont rounded-sm border-2 ${getPositionStyle(scoreItem.position)} uppercase tracking-wider`}>
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
                {paginatedScores.map((scoreItem, index) => (
                    <div key={scoreItem._id || index} className="bg-white border-[3px] border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3">
                        <div className="flex justify-between items-center border-b-2 border-stone-200 pb-2">
                            <span className="text-sm font-mont text-stone-500">#{startIndex + index + 1}</span>
                            <span className="text-2xl font-extrabold text-desi-saffron">{scoreItem.points} pts</span>
                        </div>
                        <div>
                            <div className="text-xs font-mont text-stone-500 uppercase tracking-wide mb-1">Event</div>
                            <div className="text-lg font-mont text-stone-800">{getEventName(scoreItem.event)}</div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex-1 min-w-[120px]">
                                <div className="text-xs font-mont text-stone-500 uppercase tracking-wide mb-1">House</div>
                                <span className="px-2.5 py-1 inline-flex text-sm font-mont rounded-sm bg-stone-200 text-stone-800 border border-stone-300">
                                    {scoreItem.house}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* --- 3. Negative Scores Section (COMMENTED OUT) --- */}
                    <section className="pt-8 space-y-6">
                        <div className="text-center relative pt-10 pb-5">
                            <div className="text-4xl font-extrabold text-stone-900 inline-block p-2">
                                <div className="absolute left-0 right-1/2 top-[100px] border-t-2 border-black hidden md:block" style={{ marginRight: '240px' }}></div>
                                <div className="absolute left-1/2 right-0 top-[100px] border-t-2 border-black hidden md:block" style={{ marginLeft: '240px' }}></div>

                                <h1 className="text-5xl md:text-7xl font-black text-stone-900 inline-block p-2 relative z-10"
                                    style={{ textShadow: '5px 5px 0px #FEE89B' }}
                                >
                                    Penalties
                                </h1>
                            </div>
                        </div>

                        {/* Participants */}
                        {(() => {
                            const parts = getParticipants(scoreItem);
                            if (parts.length > 0) {
                                return (
                                    <div>
                                        <div className="text-xs font-mont text-stone-500 uppercase tracking-wide mb-2">Participants</div>
                                        <div className="flex flex-wrap gap-2">
                                            {parts.map((participant, i) => (
                                                <span 
                                                    key={participant._id || i} 
                                                    className="text-xs font-mont text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200"
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
                                <Link to={`/score/details/${scoreItem._id}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white border-2 border-black text-sm font-mont hover:bg-blue-600 transition-colors">
                                    <MdOutlineInfo size={16} /> Details
                                </Link>
                                <Link to={`/score/edit/${scoreItem._id}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-desi-saffron text-white border-2 border-black text-sm font-mont hover:bg-amber-700 transition-colors">
                                    <AiOutlineEdit size={16} /> Edit
                                </Link>
                                <Link to={`/score/delete/${scoreItem._id}`} className="flex items-center justify-center px-3 py-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-colors">
                                    <MdOutlineDelete size={18} />
                                </Link>
                            </div>
                        </div>
                    </section>
                   

                </main>
                
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {displayedScores.length > itemsPerPage && (
                <div className="flex items-center justify-between px-5 py-4 bg-white border-t-[3px] border-stone-300">
                    <div className="text-sm text-stone-600 font-mont">
                        Showing <span className="font-semibold text-stone-900">{startIndex + 1}</span> to{" "}
                        <span className="font-semibold text-stone-900">{Math.min(endIndex, displayedScores.length)}</span> of{" "}
                        <span className="font-semibold text-stone-900">{displayedScores.length}</span> records
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border-2 border-black bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                            title="Previous page"
                        >
                            <MdChevronLeft className="text-xl" />
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Show first page, last page, current page, and pages around current
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-3 py-1 border-2 border-black text-sm font-mont transition-colors ${
                                                currentPage === page
                                                    ? "bg-desi-saffron text-white"
                                                    : "bg-white hover:bg-stone-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return (
                                        <span key={page} className="px-2 py-1 text-stone-500">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border-2 border-black bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                            title="Next page"
                        >
                            <MdChevronRight className="text-xl" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreTable;