import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdOutlineDelete, 
  MdOutlineInfo, 
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const ParticipantTable = ({ participants, admin = false }) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 1. Filter Data
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      participant.branch.toLowerCase().includes(filter.toLowerCase()) ||
      participant.semester.toLowerCase().includes(filter.toLowerCase()) ||
      participant.house.toLowerCase().includes(filter.toLowerCase()) ||
      participant.uid.toLowerCase().includes(filter.toLowerCase())
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, itemsPerPage]);

  // Helper to color code houses
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
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <h3 className="text-xl md:text-2xl font-bold text-black font-reality tracking-wide">
              Participants <span className="text-stone-400 text-base font-sans font-normal">({filteredParticipants.length})</span>
            </h3>
            <div className="opacity-80 hover:opacity-100 transition-opacity">
                <ExportToExcel apiData={filteredParticipants} fileName={"participants"} />
            </div>
        </div>

        {admin && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Modern Pill Search Bar */}
            <div className="relative flex-1 md:w-72">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search UID, Name, House..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-desi-saffron/50 focus:border-desi-saffron transition-all text-sm"
                />
            </div>
            
            {/* Floating Add Button */}
            <Link 
                to="/participant/create" 
                className="p-2 bg-desi-saffron text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all shrink-0"
                title="Add New Participant"
            >
              <MdOutlineAdd className="text-2xl" />
            </Link>
          </div>
        )}
      </div>

      {/* Modern Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
                <tr>
                {['No', 'UID', 'Full Name', 'Branch', 'Sem', 'House', 'Ind', 'Grp', 'Lit'].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                        {head}
                    </th>
                ))}
                {admin && <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
                {currentParticipants.map((participant, index) => (
                <tr key={participant._id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400">
                        {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-desi-teal">{participant.uid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-800">{participant.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{participant.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{participant.semester}</td>
                    
                    {/* House Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full border ${getHouseBadgeColor(participant.house)}`}>
                            {participant.house}
                        </span>
                    </td>

                    {/* Counters (Subtle styling) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-600">
                        <span className={participant.individual >= 5 ? "text-red-600 font-bold" : ""}>{participant.individual}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-600">
                        <span className={participant.group >= 3 ? "text-red-600 font-bold" : ""}>{participant.group}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-600">{participant.literary}</td>

                    {/* Action Buttons (Fade in on hover) */}
                    {admin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link 
                                to={`/participant/details/${participant._id}`} 
                                className="text-stone-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors"
                                title="View Details"
                            >
                                <MdOutlineInfo size={18} />
                            </Link>
                            <Link 
                                to={`/participant/edit/${participant._id}`} 
                                className="text-stone-400 hover:text-desi-saffron hover:bg-orange-50 p-1.5 rounded-md transition-colors"
                                title="Edit"
                            >
                                <AiOutlineEdit size={18} />
                            </Link>
                            <Link 
                                to={`/participant/delete/${participant._id}`} 
                                className="text-stone-400 hover:text-desi-maroon hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                title="Delete"
                            >
                                <MdOutlineDelete size={18} />
                            </Link>
                        </div>
                    </td>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredParticipants.length > 0 && (
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Info Text */}
                <div className="text-sm text-stone-500">
                    Showing <span className="font-bold text-stone-800">{startIndex + 1}</span> to <span className="font-bold text-stone-800">{Math.min(startIndex + itemsPerPage, filteredParticipants.length)}</span> of <span className="font-bold text-stone-800">{filteredParticipants.length}</span> students
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Rows Per Page Selector */}
                    <select 
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="bg-white border border-stone-200 text-stone-600 text-xs rounded-lg px-2 py-1 outline-none focus:border-desi-saffron mr-4"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>

                    <button 
                        onClick={() => setCurrentPage(1)} 
                        disabled={currentPage === 1}
                        className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
                    >
                        <MdFirstPage size={20} />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
                    >
                        <MdChevronLeft size={20} />
                    </button>
                    
                    <span className="text-sm font-medium text-stone-600 px-2">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
                    >
                        <MdChevronRight size={20} />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(totalPages)} 
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
                    >
                        <MdLastPage size={20} />
                    </button>
                </div>
            </div>
        )}
        
        {/* Empty State */}
        {filteredParticipants.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400">
                <MdSearch className="text-4xl mb-2 opacity-20" />
                <p>No participants found matching "{filter}"</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantTable;
