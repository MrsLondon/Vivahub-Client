import React, { useState } from "react";
import BusinessCalendar from "./BusinessCalendar";

const CalendarModal = ({ isOpen, onClose, salonId }) => {
  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para o evento selecionado

  if (!isOpen) return null; // Não renderiza se o modal não estiver aberto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        {/* Botão para fechar o modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          ✕
        </button>

        {/* Exibe os detalhes do evento selecionado */}
        {selectedEvent ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#4A4A4A] dark:text-gray-200">
              Booking Details
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                <strong className="font-semibold text-[#A2B9C6] dark:text-[#FADADD]">
                  Service:
                </strong>{" "}
                {selectedEvent.title}
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-[#A2B9C6] dark:text-[#FADADD]">
                  Start:
                </strong>{" "}
                {selectedEvent.start.toLocaleString()}
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-[#A2B9C6] dark:text-[#FADADD]">
                  End:
                </strong>{" "}
                {selectedEvent.end.toLocaleString()}
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-[#A2B9C6] dark:text-[#FADADD]">
                  Customer:
                </strong>{" "}
                {selectedEvent.customerName || "N/A"}
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-[#A2B9C6] dark:text-[#FADADD]">
                  Notes:
                </strong>{" "}
                {selectedEvent.notes || "No additional notes"}
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)} // Volta para o calendário
              className="mt-6 px-6 py-3 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] dark:bg-[#FADADD] dark:text-[#4A4A4A] dark:hover:bg-[#f0c8cc] transition"
            >
              Back to Calendar
            </button>
          </div>
        ) : (
          // Exibe o calendário se nenhum evento estiver selecionado
          <BusinessCalendar
            salonId={salonId}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarModal;
