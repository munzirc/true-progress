import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-4 bg-[#e0f2fe] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
