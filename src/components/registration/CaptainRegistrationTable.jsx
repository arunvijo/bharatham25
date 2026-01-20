import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdAppRegistration, 
  MdLock, 
  MdSearch, 
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";
import { useSnackbar } from "notistack";

const CaptainRegistrationTable = ({
  registrations = [],
  admin = false, 
  handleDeleteRegistration,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  
  // --- States for Search & Pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UPDATED LOGIC: Global Lockdown Deadline
  const GLOBAL_LOCKDOWN = new Date("2026-01-19T13:00:00");
  const now = new Date();
  const isLocked = now > GLOBAL_LOCKDOWN;

  // --- 1. Search Filtering Logic ---
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        reg.event?.toLowerCase().includes(searchStr) ||
        reg.participants?.some(p => 
          p.fullName?.toLowerCase().includes(searchStr) || 
          p.uid?.toLowerCase().includes(searchStr)
        )
      );
    });
  }, [registrations, searchTerm]);

  // --- 2. NEW: Flatten Data for Excel Export (Hybrid Approach) ---
  // This creates one row per student in Excel, but groups them by Team ID
  const exportData = useMemo(() => {
    return filteredRegistrations.flatMap((reg) => {
      // Map EACH participant to their own row
      return reg.participants.map((p) => ({
        "Event": reg.event,
        "House": reg.house,
        "Team ID": reg._id, // Critical for coloring logic in ExportToExcel
        "Team Size": reg.participants.length,
        
        "Participant Name": p.fullName,
        "UID": p.uid,
        "Branch": p.branch || "-",    // Restored Branch
        "Semester": p.semester || "-", // Restored Semester
        
        "Act Type": p.performanceType || "-",
        "Language": p.language || "-",
        "Gender": p.genderCategory || "-",
        "Dance/Instrument": p.danceType || p.instrumentType || "-",
        
        "Registered At": new Date(reg.createdAt).toLocaleDateString(),
      }));
    });
  }, [filteredRegistrations]);

  // --- 3. Pagination Logic ---
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = useMemo(() => {
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, startIndex, itemsPerPage]);

  // Reset to page 1 when search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleRegistrationClick = (e) => {
    if (isLocked) {
      e.preventDefault();
      enqueueSnackbar("All registrations are now locked for Bharatham '26", {
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-teal">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <MdAppRegistration className="text-desi-teal text-2xl" />
            <h3 className="text-xl font-bold text-black tracking-wide whitespace-nowrap">
              Registrations <span className="text-stone-400 text-sm font-normal">({filteredRegistrations.length})</span>
            </h3>
          </div>
          
          <div className="relative w-full sm:w-64">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
            <input
              type="text"
              placeholder="Search event or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-desi-teal/50 transition-all text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <MdClose />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* UPDATED EXPORT: Uses 'exportData' instead of filteredRegistrations */}
          <div className="flex items-center justify-center w-10 h-10 bg-white border border-stone-200 text-stone-400 hover:text-desi-teal hover:border-desi-teal hover:bg-teal-50 rounded-full shadow-sm transition-all cursor-pointer group" title="Export to Excel">
             <ExportToExcel apiData={exportData} fileName={"house_registrations"} />
          </div>

          {!admin && (
            !isLocked ? (
              <Link to="/captain/registration/create" className="flex items-center justify-center w-10 h-10 bg-desi-teal text-white rounded-full shadow-lg hover:bg-teal-800 hover:scale-110 transition-all" onClick={handleRegistrationClick} title="New Registration">
                <MdOutlineAdd className="text-2xl" />
              </Link>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 bg-stone-100 text-stone-400 rounded-full border border-stone-200 cursor-not-allowed" title="System Locked">
                <MdLock className="text-xl" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                {['No', 'Event', 'Participants', 'Action'].map((head) => (
                  <th key={head} className={`px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider ${head === 'Action' ? 'text-right' : 'text-left'}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {currentData.map((registration, index) => (
                <tr key={registration._id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-stone-800 block">{registration.event}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {registration.participants.map((participant, pIndex) => (
                        <div key={pIndex} className="flex items-center gap-2 text-sm text-stone-700">
                          <span className="font-mono text-desi-teal text-[10px] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">{participant.uid}</span>
                          <span className="font-medium whitespace-nowrap">{participant.fullName}</span>
                          
                          {/* Visual Badges for Table View */}
                          <div className="flex flex-wrap gap-1">
                            {participant.language && <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-full uppercase">{participant.language}</span>}
                            {participant.genderCategory && <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full uppercase">{participant.genderCategory}</span>}
                            {participant.performanceType && <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-full uppercase">{participant.performanceType}</span>}
                            {(participant.danceType || participant.instrumentType) && <span className="px-2 py-0.5 text-[9px] font-bold bg-pink-50 text-pink-700 border border-pink-200 rounded-full uppercase">{participant.danceType || participant.instrumentType}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {!isLocked ? (
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/captain/registration/edit/${registration._id}`} className="text-stone-400 hover:text-desi-teal hover:bg-teal-50 p-2 rounded-lg transition-all" title="Edit Participants">
                          <AiOutlineEdit size={20} />
                        </Link>
                        <button id={registration._id} onClick={handleDeleteRegistration} className="text-stone-400 hover:text-desi-maroon hover:bg-red-50 p-2 rounded-lg transition-all opacity-60 group-hover:opacity-100" title="Delete Registration">
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-stone-300 italic text-xs">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredRegistrations.length > 0 && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-stone-500">
              Showing <span className="font-bold text-stone-800">{startIndex + 1}</span> to <span className="font-bold text-stone-800">{Math.min(startIndex + itemsPerPage, filteredRegistrations.length)}</span> of <span className="font-bold text-stone-800">{filteredRegistrations.length}</span> registrations
            </div>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-stone-200 text-stone-600 text-xs rounded-lg px-2 py-1 outline-none mr-4">
                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v} per page</option>)}
              </select>
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"><MdFirstPage size={20} /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"><MdChevronLeft size={20} /></button>
              <span className="text-sm font-medium text-stone-600 px-2">Page {currentPage} of {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"><MdChevronRight size={20} /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"><MdLastPage size={20} /></button>
            </div>
          </div>
        )}

        {filteredRegistrations.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400">
            <MdSearch className="text-4xl mb-2 opacity-20" />
            <p className="font-medium">No registrations match "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainRegistrationTable;