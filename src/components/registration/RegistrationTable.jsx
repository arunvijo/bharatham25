import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdAppRegistration, 
  MdSearch, 
  MdFilterList, 
  MdChevronLeft, 
  MdChevronRight, 
  MdFirstPage, 
  MdLastPage 
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const RegistrationTable = ({
  registrations = [],
  handleDeleteRegistration,
}) => {
  // --- States for Filtering & Pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [houseFilter, setHouseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- Helper for house badge colors ---
  const getHouseBadgeColor = (houseName) => {
    switch (houseName?.toLowerCase()) {
      case 'rajputs': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'spartans': return 'bg-red-100 text-red-800 border-red-200';
      case 'vikings': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mughals': return 'bg-green-100 text-green-800 border-green-200';
      case 'aryans': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marathas': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  // --- Filtering Logic ---
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = reg.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            reg.participants.some(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesHouse = houseFilter === "All" || reg.house === houseFilter;
      return matchesSearch && matchesHouse;
    });
  }, [registrations, searchTerm, houseFilter]);

  // --- NEW: FLATTEN DATA FOR EXPORT (Granular View) ---
  const exportData = useMemo(() => {
    return filteredRegistrations.flatMap((reg) => {
      // Map EACH participant to their own row
      return reg.participants.map((p) => ({
        "Event": reg.event,
        "House": reg.house,
        "Team ID": reg._id, // Used for color grouping
        "Team Size": reg.participants.length,
        
        "Participant Name": p.fullName,
        "UID": p.uid,
        "Branch": p.branch || "-",    
        "Semester": p.semester || "-", 
        
        "Act Type": p.performanceType || "-",
        "Language": p.language || "-",
        "Gender": p.genderCategory || "-",
        "Dance/Instrument": p.danceType || p.instrumentType || "-",
        
        "Registered At": new Date(reg.createdAt).toLocaleDateString(),
      }));
    });
  }, [filteredRegistrations]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  const uniqueHouses = ["All", ...new Set(registrations.map(r => r.house))];

  // Reset to page 1 when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, houseFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
            <MdAppRegistration className="text-desi-saffron" />
            Admin Portal <span className="text-stone-400 text-base font-normal">({filteredRegistrations.length})</span>
          </h3>
          
          {/* UPDATED EXPORT: Uses the flattened 'exportData' */}
          <div className="opacity-80 hover:opacity-100 transition-opacity">
             <ExportToExcel apiData={exportData} fileName={"admin_filtered_registrations"} />
          </div>
        </div>
        <Link
          to="/registration/create"
          className="flex items-center gap-2 px-5 py-2 bg-desi-saffron text-white rounded-full shadow hover:bg-amber-700 transition-all font-medium"
        >
          <MdOutlineAdd className="text-xl" />
          <span>New Entry</span>
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
        <div className="relative col-span-2">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
          <input 
            type="text"
            placeholder="Search by event or participant name..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none text-sm appearance-none"
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
          >
            {uniqueHouses.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                {['No', 'Event', 'House', 'Participants', 'Action'].map((head) => (
                  <th key={head} className={`px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider ${head === 'Action' ? 'text-right' : 'text-left'}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {paginatedData.map((registration, index) => (
                <tr key={registration._id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-400">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-stone-800">{registration.event}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full border ${getHouseBadgeColor(registration.house)}`}>
                      {registration.house}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {registration.participants.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                          <span className="font-mono text-[10px] bg-teal-50 px-1 rounded border border-teal-100">{p.uid}</span>
                          <span className="font-bold">{p.fullName}</span>
                          
                          {/* VISUAL BADGES */}
                          <div className="flex flex-wrap gap-1">
                            {p.language && <span className="px-1.5 py-0.5 text-[9px] bg-orange-100 text-orange-800 rounded border border-orange-200 uppercase">{p.language}</span>}
                            {p.performanceType && <span className="px-1.5 py-0.5 text-[9px] bg-purple-100 text-purple-800 rounded border border-purple-200 uppercase">{p.performanceType}</span>}
                            {p.genderCategory && <span className="px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-800 rounded border border-blue-100 uppercase">{p.genderCategory}</span>}
                            {(p.danceType || p.instrumentType) && <span className="px-1.5 py-0.5 text-[9px] bg-pink-50 text-pink-800 rounded border border-pink-100 uppercase">{p.danceType || p.instrumentType}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/registration/edit/${registration._id}`} className="p-2 text-stone-400 hover:text-desi-saffron hover:bg-orange-50 rounded-lg transition-all">
                        <AiOutlineEdit size={18} />
                      </Link>
                      <button onClick={() => handleDeleteRegistration(registration._id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <AiOutlineDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-t border-stone-200">
          <p className="text-xs text-stone-500">
            Showing <span className="font-bold">{paginatedData.length}</span> of <span className="font-bold">{filteredRegistrations.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <select 
                value={itemsPerPage} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                className="bg-white border border-stone-200 text-stone-600 text-xs rounded-lg px-2 py-1 outline-none mr-4"
            >
                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v} per page</option>)}
            </select>

            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1} 
              className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
            >
              <MdFirstPage size={20} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
            >
              <MdChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-bold text-stone-700 px-2">Page {currentPage} of {totalPages || 1}</span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
            >
              <MdChevronRight size={20} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30 transition-colors"
            >
              <MdLastPage size={20} />
            </button>
          </div>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="p-12 text-center text-stone-400">
            <p>No matches found for your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationTable;