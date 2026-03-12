import React, { useEffect } from "react";

export default function CustomAlert({ message, type, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close after 3s

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">

      <div
        className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4`}
      >
        <span className="font-medium">{message}</span>

        <button
          onClick={onClose}
          className="text-white font-bold"
        >
          ✕
        </button>

      </div>

    </div>
  );
}