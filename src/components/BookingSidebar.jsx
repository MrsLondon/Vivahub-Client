import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/auth.context";

function BookingSidebar({ isOpen, onClose }) {
  const { bookingItems, removeFromBooking, totalPrice, totalDuration, bookingCount } = useContext(BookingContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const handleProceedToBooking = () => {
    // Check if user is logged in and is a customer
    if (isAuthenticated && user && user.role === 'customer') {
      onClose();
      navigate("/booking");
    } else {
      // Show login popup if not logged in or not a customer
      setShowLoginPopup(true);
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    setShowLoginPopup(false);
    navigate("/login");
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

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowLoginPopup(false)}></div>
          <div className="bg-white p-6 rounded-lg shadow-xl z-10 max-w-md w-full mx-4">
            <button 
              className="absolute top-4 right-4 text-gray-600 text-xl" 
              onClick={() => setShowLoginPopup(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-[#4A4A4A] mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in as a customer to proceed with your booking. Please log in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoginRedirect}
                className="flex-1 py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingSidebar;
