import React from "react";
import BusinessCalendar from "./BusinessCalendar";

const CalendarModal = ({ isOpen, onClose, salonId }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        {/* Botton to close modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>

        {/* Calendar Component */}
        <BusinessCalendar salonId={salonId} />
      </div>
    </div>
  );
};

export default CalendarModal;
