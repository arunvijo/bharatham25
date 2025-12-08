import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { 
  MdOutlineAdd, 
  MdOutlineDelete, 
  MdOutlineInfo, 
  MdSearch,
  MdEvent 
} from "react-icons/md";
import { ExportToExcel } from "../../../ExportToExcel";

const EventTable = ({ events, admin = false }) => {
  const [filter, setFilter] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.venue.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.participation.toLowerCase().includes(filter.toLowerCase()) ||
      event.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Search Card */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow-sm border-l-4 border-desi-saffron">
        
        <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-black font-reality tracking-wide flex items-center gap-2">
              <MdEvent className="text-desi-saffron" />
              Events <span className="text-stone-400 text-base font-sans font-normal">({events?.length})</span>
            </h3>
            <div className="opacity-80 hover:opacity-100 transition-opacity">
                <ExportToExcel apiData={events} fileName={"events"} />
            </div>
        </div>

        {admin && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-desi-saffron/50 focus:border-desi-saffron transition-all text-sm"
                />
            </div>
            
            <Link 
                to="/event/create" 
                className="p-2 bg-desi-saffron text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all"
                title="Create Event"
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
                {['No', 'Name', 'Participation', 'Type', 'Category', 'Date', 'Venue', 'Min', 'Max', 'Team', 'Status'].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                        {head}
                    </th>
                ))}
                {admin && <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
                {filteredEvents?.map((event, index) => (
                <tr key={event._id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400">{index + 1}</td>
                    
                    {/* Event Name Link */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-800">
                        {admin ? (
                            <Link to={`/admin/event/view/${event._id}`} className="hover:text-desi-saffron transition-colors">
                                {event.name}
                            </Link>
                        ) : event.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{event.participation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{event.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{event.category}</td>
                    
                    {/* Formatted Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-stone-500">
                        {event?.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{event.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{event.minIndividualLimit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{event.maxIndividualLimit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{event.teamLimit}</td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${event.registrationEnabled 
                                ? "bg-green-100 text-green-800 border border-green-200" 
                                : "bg-red-100 text-red-800 border border-red-200"}`}
                        >
                            {event.registrationEnabled ? "Open" : "Closed"}
                        </span>
                    </td>

                    {/* Actions */}
                    {admin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link 
                                to={`/event/details/${event._id}`} 
                                className="text-stone-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors"
                            >
                                <MdOutlineInfo size={18} />
                            </Link>
                            <Link 
                                to={`/event/edit/${event._id}`} 
                                className="text-stone-400 hover:text-desi-saffron hover:bg-orange-50 p-1.5 rounded-md transition-colors"
                            >
                                <AiOutlineEdit size={18} />
                            </Link>
                            <Link 
                                to={`/event/delete/${event._id}`} 
                                className="text-stone-400 hover:text-desi-maroon hover:bg-red-50 p-1.5 rounded-md transition-colors"
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
        
        {/* Empty State */}
        {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-stone-400">
                <MdEvent className="text-4xl mx-auto mb-2 opacity-20" />
                <p>No events found matching "{filter}"</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventTable;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineEdit } from "react-icons/ai";
// import { BsInfoCircle } from "react-icons/bs";
// import {
//   MdOutlineAdd,
//   MdOutlineAddBox,
//   MdOutlineDelete,
//   MdOutlineInfo,
// } from "react-icons/md";
// import { ExportToExcel } from "../../../ExportToExcel";

// const EventTable = ({ events, admin = false }) => {
//   const [filter, setFilter] = useState("");

//   const filteredEvents = events.filter(
//     (event) =>
//       event.name.toLowerCase().includes(filter.toLowerCase()) ||
//       event.venue.toLowerCase().includes(filter.toLowerCase()) ||
//       event.type.toLowerCase().includes(filter.toLowerCase()) ||
//       event.participation.toLowerCase().includes(filter.toLowerCase()) ||
//       event.category.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <>
//       <div className="row">
//         <h3>Events ({events?.length})</h3>
//         <ExportToExcel apiData={events} fileName={"events"} />
//         {admin && (
//           <>
//             {" "}
//             <Link to="/event/create" className="btn-icon">
//               <MdOutlineAdd />
//             </Link>
//             <input
//               type="text"
//               placeholder="Filter by name, venue, type, participation, category"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               style={{
//                 marginBottom: 20,
//                 borderRadius: 30,
//                 width: "70%",
//                 border: "none",
//                 paddingBlock: 10,
//                 paddingInline: 20,
//                 fontFamily: "DM Sans",
//               }}
//             />
//           </>
//         )}
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>No</th>
//             <th>Name</th>
//             <th>Participation</th>
//             <th>Type</th>
//             <th>Category</th>
//             <th>Date</th>
//             <th>Venue</th>
//             <th>Min Limit</th>
//             <th>Max Limit</th>
//             <th>Team Limit</th>
//             <th>Registration Status</th>
//             {admin && <th>Operations</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredEvents?.map((event, index) => (
//             <tr key={event._id} className="h-8">
//               <td>{index + 1}</td>
//               <td>
//                 {admin ? (
//                   <Link to={`/admin/event/view/${event._id}`}>
//                     {event.name}
//                   </Link>
//                 ) : (
//                   event.name
//                 )}
//               </td>
//               <td>{event.participation}</td>
//               <td>{event.type}</td>
//               <td>{event.category}</td>
//               <td>{event?.date?.substring(0, 10)}</td>
//               <td>{event.venue}</td>
//               <td>{event.minIndividualLimit}</td>
//               <td>{event.maxIndividualLimit}</td>
//               <td>{event.teamLimit}</td>
//               <td
//                 className={`badge ${
//                   event.registrationEnabled ? "enabled" : "disabled"
//                 }` } style={{fontWeight: "bold", fontSize: "1.2rem"}}
//               >
//                 {event.registrationEnabled ? "Open" : "Closed"}
//               </td>
//               {admin && (
//                 <td>
//                   <div>
//                     <Link
//                       to={`/event/details/${event._id}`}
//                       className="btn-icon"
//                     >
//                       <MdOutlineInfo />
//                     </Link>
//                     <Link to={`/event/edit/${event._id}`} className="btn-icon">
//                       <AiOutlineEdit />
//                     </Link>
//                     <Link
//                       to={`/event/delete/${event._id}`}
//                       className="btn-icon"
//                     >
//                       <MdOutlineDelete />
//                     </Link>
//                   </div>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default EventTable;
