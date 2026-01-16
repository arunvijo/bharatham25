import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAdd, MdAppRegistration, MdSearch, MdFilterList, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const RegistrationTable = ({
  registrations = [],
  handleDeleteRegistration,
}) => {
  // --- States for Filtering & Pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [houseFilter, setHouseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage]);

  const uniqueHouses = ["All", ...new Set(registrations.map(r => r.house))];

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-black tracking-wide flex items-center gap-2">
            <MdAppRegistration className="text-desi-saffron" />
            Admin Portal <span className="text-stone-400 text-base font-normal">({filteredRegistrations.length})</span>
          </h3>
          <ExportToExcel apiData={filteredRegistrations} fileName={"filtered_registrations"} />
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
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>
        <div className="relative">
          <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-desi-saffron outline-none text-sm appearance-none"
            value={houseFilter}
            onChange={(e) => {setHouseFilter(e.target.value); setCurrentPage(1);}}
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
                          <span>{p.fullName}</span>
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
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-30"
            >
              <MdChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-stone-700">Page {currentPage} of {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-30"
            >
              <MdChevronRight size={20} />
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