import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

function BookingSidebar({ isOpen, onClose }) {
  const { bookingItems, removeFromBooking, totalPrice, totalDuration, bookingCount } = useContext(BookingContext);
  const navigate = useNavigate();
  
  const handleProceedToBooking = () => {
    onClose();
    navigate("/booking");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button className="absolute top-4 right-4 text-gray-600 text-xl" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-xl font-bold p-4 border-b">Your Booking</h2>

        <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
          {bookingItems.length === 0 ? (
            <p className="text-gray-500">You haven't selected any services yet.</p>
          ) : (
            bookingItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b py-4">
                <div className="flex-1">
                  <h3 className="text-md font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Duration: {item.duration} minutes</p>
                  <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                  onClick={() => removeFromBooking(item._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t absolute bottom-0 w-full bg-white">
          <p className="text-lg font-semibold">Total Services: {bookingCount}</p>
          <p className="text-sm text-gray-600">Total Duration: {totalDuration} minutes</p>
          <p className="text-lg font-semibold text-[#4A4A4A]">Total: ${totalPrice.toFixed(2)}</p>
          <button 
            className="w-full py-2 mt-4 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleProceedToBooking}
            disabled={bookingItems.length === 0}
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </>
  );
}

export default BookingSidebar;
