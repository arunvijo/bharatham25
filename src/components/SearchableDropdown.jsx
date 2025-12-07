import { useEffect, useRef, useState } from "react";
import { MdExpandMore, MdSearch, MdCheck } from "react-icons/md";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Selection
  const selectOption = (option) => {
    setQuery("");
    handleChange(option.uid);
    setIsOpen(false);
  };

  // Handle Input Focus
  const toggle = () => setIsOpen(!isOpen);

  // Display Logic (Show Name + UID if possible, or just UID)
  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) {
      const selectedOption = options.find(opt => opt.uid === selectedVal);
      return selectedOption 
        ? `${selectedOption.fullName || selectedOption.uid} (${selectedOption.uid})`
        : selectedVal;
    }
    return "";
  };

  // Filter Logic
  const filter = (options) => {
    if (!query) return options;
    const lowerQuery = query.toLowerCase();
    return options.filter(
      (option) => 
        option.uid.toLowerCase().includes(lowerQuery) || 
        (option.fullName && option.fullName.toLowerCase().includes(lowerQuery))
    );
  };

  return (
    <div className="relative w-full font-sans">
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">
          {label}
        </label>
      )}

      {/* Input Control */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdSearch className="text-stone-400 text-lg group-focus-within:text-desi-saffron transition-colors" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          placeholder="Search..."
          onChange={(e) => {
            setQuery(e.target.value);
            handleChange(null); // Clear selection while typing
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-desi-saffron focus:border-desi-saffron transition-all outline-none shadow-sm"
        />

        {/* Arrow Icon */}
        <div 
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={toggle}
        >
          <MdExpandMore 
            className={`text-stone-400 text-xl transition-transform duration-200 ${isOpen ? "rotate-180 text-desi-saffron" : ""}`} 
          />
        </div>
      </div>

      {/* Dropdown Options Panel */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-stone-100 rounded-xl shadow-xl max-h-60 overflow-auto animate-fade-in-down custom-scrollbar"
        >
          {filter(options).length > 0 ? (
            filter(options).map((option, index) => {
              const isSelected = option.uid === selectedVal;
              return (
                <div
                  onClick={() => selectOption(option)}
                  key={`${id}-${index}`}
                  className={`px-4 py-3 cursor-pointer transition-colors border-b border-stone-50 last:border-0 flex justify-between items-center
                    ${isSelected 
                      ? "bg-orange-50 text-desi-saffron font-medium" 
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                >
                  <div>
                    <span className="block text-sm">
                      {option.fullName || option.uid}
                    </span>
                    {option.fullName && (
                      <span className="block text-xs text-stone-400 font-mono mt-0.5">
                        {option.uid}
                      </span>
                    )}
                  </div>
                  {isSelected && <MdCheck className="text-desi-saffron" />}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-stone-400 italic text-center">
              No matches found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;

// import { useEffect, useRef, useState } from "react";

// const SearchableDropdown = ({
//   options,
//   label,
//   id,
//   selectedVal,
//   handleChange
// }) => {
//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const inputRef = useRef(null);

//   useEffect(() => {
//     console.log(options)
//     document.addEventListener("click", toggle);
//     return () => document.removeEventListener("click", toggle);
//   }, []);

//   const selectOption = (option) => {
//     setQuery(() => "");
//     handleChange(option.uid);
//     setIsOpen((isOpen) => !isOpen);
//   };

//   function toggle(e) {
//     setIsOpen(e && e.target === inputRef.current);
//   }

//   const getDisplayValue = () => {
//     if (query) return query;
//     if (selectedVal) return selectedVal;

//     return "";
//   };

//   const filter = (options) => {
//     return options.filter(
//       (option) => option.uid.toLowerCase().indexOf(query.toLowerCase()) > -1
//     );
//   };

//   return (
//     <div className="dropdown">
//       <div className="control">
//         <div className="selected-value">
//           <input
//             ref={inputRef}
//             type="text"
//             value={getDisplayValue()}
//             name="searchTerm"
//             onChange={(e) => {
//               setQuery(e.target.value);
//               handleChange(null);
//             }}
//             onClick={toggle}
//           />
//         </div>
//         <div className={`arrow ${isOpen ? "open" : ""}`}></div>
//       </div>

//       <div className={`options ${isOpen ? "open" : ""}`}>
//         {filter(options).map((option, index) => {
//             // console.log(option, index)
//           return (
//             <div
//               onClick={() => selectOption(option)}
//               className={`option ${
//                 option.uid === selectedVal ? "selected" : ""
//               }`}
//               key={`${id}-${index}`}
//             >
//               {option.uid}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SearchableDropdown;
