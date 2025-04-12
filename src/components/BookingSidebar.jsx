import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/auth.context";

function BookingSidebar({ isOpen, onClose, theme }) {
  const { bookingItems, removeFromBooking, totalPrice, bookingCount } = useContext(BookingContext);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  const handleProceedToBooking = () => {
    if (isAuthenticated && user && user.role === 'customer') {
      onClose();
      navigate("/booking");
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    setShowLoginPopup(false);
    // Get the current path to redirect back after login
    const currentPath = window.location.pathname;
    navigate(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>

      {/* Compact Summary Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center
        ${theme === "light" ? "bg-transparent" : "bg-transparent"}`}
      >
        <div 
          className={`w-full max-w-2xl mx-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800 text-gray-200"
          } shadow-lg`}
          style={{ 
            borderTopLeftRadius: "1rem", 
            borderTopRightRadius: "1rem" 
          }}
        >
          {/* Handle for dragging/expanding */}
          <div 
            className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 cursor-pointer"
            onClick={() => setShowFullDetails(!showFullDetails)}
          ></div>

          {/* Compact Summary */}
          <div className="px-3 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center">
              <div className="font-semibold">{bookingCount} {bookingCount === 1 ? 'service' : 'services'}</div>
              <div className="mx-2">·</div>
              <div className="font-semibold">${totalPrice.toFixed(2)}</div>
              <button 
                className={`ml-2 text-sm underline ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
                onClick={() => setShowFullDetails(!showFullDetails)}
              >
                {showFullDetails ? "Hide" : "Edit"}
              </button>
            </div>
            
            <button 
              className={`w-full sm:w-auto px-4 py-2 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "light" 
                  ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]" 
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
              onClick={handleProceedToBooking}
              disabled={bookingItems.length === 0}
            >
              Book
            </button>
          </div>

          {/* Expandable Details Section */}
          {showFullDetails && (
            <div className={`p-4 border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}>
              <div className="overflow-y-auto" style={{ maxHeight: "30vh" }}>
                {bookingItems.length === 0 ? (
                  <p className={`text-center py-4 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    You haven't selected any services yet.
                  </p>
                ) : (
                  bookingItems.map((item) => (
                    <div 
                      key={item._id} 
                      className={`flex items-center justify-between py-2 ${
                        theme === "light" ? "border-b border-gray-200" : "border-b border-gray-700"
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className="text-md font-semibold">{item.name}</h3>
                        <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                          ${item.price.toFixed(2)} · {item.duration} min
                        </p>
                      </div>
                      <button 
                        className={`text-red-500 p-2 ${
                          theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900"
                        } rounded-full`}
                        onClick={() => removeFromBooking(item._id)}
                        aria-label="Remove service"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowLoginPopup(false)}></div>
          <div className={`p-6 rounded-lg shadow-xl z-10 max-w-md w-full mx-4 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <button 
              className={`absolute top-4 right-4 text-xl ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`} 
              onClick={() => setShowLoginPopup(false)}
            >
              ✕
            </button>
            <h3 className={`text-xl font-bold mb-4 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}>Login Required</h3>
            <p className={`mb-6 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              You need to be logged in as a customer to proceed with your booking. Please log in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoginRedirect}
                className={`flex-1 py-2 rounded transition duration-300 ${
                  theme === "light" 
                    ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]" 
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className={`flex-1 py-2 rounded transition duration-300 ${
                  theme === "light" 
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
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
