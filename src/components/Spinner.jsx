import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <div className="w-3 h-3 bg-desi-saffron rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-desi-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-desi-maroon rounded-full animate-bounce"></div>
    </div>
  );
};

export default Spinner;

// import React from "react";

// const Spinner = () => {
//   return (
//     <div className="lds-ellipsis">
//       <div></div>
//       <div></div>
//       <div></div>
//       <div></div>
//     </div>
//   );
// };

// export default Spinner;
