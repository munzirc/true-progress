import React from "react";

const getColorClasses = (severity) => {
  switch (severity) {
    case "success":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
    case "info":
    default:
      return "bg-blue-600";
  }
};

const Snackbar = ({ message, severity }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded shadow-md text-white ${getColorClasses(
          severity
        )}`}
      >
        {message}
      </div>
    </div>
  );
};

export default Snackbar;
