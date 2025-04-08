import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/auth.context";
import { createBooking } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const BookingPage = () => {
  const { bookingItems, removeFromBooking, totalPrice, totalDuration, clearBooking } = useContext(BookingContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Generate available time slots based on business hours (9am-5pm)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8am
    const endHour = 20;  // 8pm

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        const minuteFormatted = minute.toString().padStart(2, '0');
        slots.push(`${hourFormatted}:${minuteFormatted} ${amPm}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingItems.length === 0) {
      alert("Please add services to your booking first");
      return;
    }

    if (!isAuthenticated || !user) {
      // Save current path to redirect back after login
      const currentPath = window.location.pathname;
      navigate(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // For each service in the booking, create a separate booking record
      const bookingPromises = bookingItems.map(async (service) => {
        // Convert time from "1:00 PM" format to 24-hour format "13:00"
        const timeString = formData.time;
        const [time, period] = timeString.split(' ');
        const [hour, minute] = time.split(':');
        let hour24 = parseInt(hour);
        
        if (period === 'PM' && hour24 < 12) {
          hour24 += 12;
        } else if (period === 'AM' && hour24 === 12) {
          hour24 = 0;
        }
        
        const time24 = `${hour24.toString().padStart(2, '0')}:${minute}`;
        
        const bookingData = {
          serviceId: service._id,
          appointmentDate: formData.date,
          appointmentTime: time24,
          notes: formData.notes
        };
        
        return await createBooking(bookingData);
      });
      
      const results = await Promise.all(bookingPromises);
      console.log("Booking results:", results);
      
      // Clear booking after successful submission
      clearBooking();
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      let message = "There was an error submitting your booking. Please try again.";
      
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`font-sans leading-relaxed min-h-screen flex flex-col transition-colors duration-300 ${
      theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"
    }`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center shadow-sm ${
        theme === "light" ? "bg-[#eeeeee]" : "bg-gray-800"
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={theme === "light" ? "/logo.png" : "/logo-dark.png"} 
            alt="VivaHub Logo" 
            className="h-10"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === "light"
                ? "text-[#4A4A4A] hover:bg-[#FADADD]"
                : "text-gray-200 hover:bg-gray-700"
            } transition-colors`}
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          
          {/* <Link 
            to="/test-booking" 
            className={`${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            } hover:underline`}
          >
            Back to Services
          </Link> */}
        </div>
      </header>

      <div className="py-10 px-5 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-medium mb-6 ${
            theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
          }`}>
            Complete Your Booking
          </h1>

          {submitSuccess ? (
            <div className={`rounded-lg p-6 mb-8 text-center ${
              theme === "light" 
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-green-900 border border-green-700 text-green-100"
            }`}>
              <h2 className="text-2xl font-medium mb-4">Booking Confirmed!</h2>
              <p className="mb-6">Your booking has been successfully submitted.</p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  navigate("/test-booking");
                }}
                className={`px-6 py-2 rounded transition duration-300 ${
                  theme === "light"
                    ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                Book More Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className={`rounded-lg p-6 sticky top-6 ${
                  theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
                }`}>
                  <h2 className={`text-xl font-medium mb-4 ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                  }`}>
                    Booking Summary
                  </h2>
                  
                  {bookingItems.length === 0 ? (
                    <p className={`mb-4 ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}>
                      Your booking is empty.
                    </p>
                  ) : (
                    <>
                      <ul className={`divide-y mb-4 ${
                        theme === "light" ? "divide-gray-200" : "divide-gray-700"
                      }`}>
                        {bookingItems.map((item) => (
                          <li key={item._id} className="py-4 flex justify-between">
                            <div>
                              <h3 className={`font-medium ${
                                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                              }`}>
                                {item.name}
                              </h3>
                              <p className={`text-sm ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }`}>
                                {item.duration} minutes
                              </p>
                            </div>
                            <div className="flex items-start">
                              <span className={`font-medium mr-3 ${
                                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                              }`}>
                                ${item.price.toFixed(2)}
                              </span>
                              <button 
                                onClick={() => removeFromBooking(item._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className={`border-t pt-4 ${
                        theme === "light" ? "border-gray-200" : "border-gray-700"
                      }`}>
                        <div className={`flex justify-between mb-2 ${
                          theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                        }`}>
                          <span>Total Duration:</span>
                          <span>{totalDuration} minutes</span>
                        </div>
                        <div className={`flex justify-between text-lg font-bold ${
                          theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                        }`}>
                          <span>Total:</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className={`rounded-lg p-6 ${
                  theme === "light" 
                    ? "bg-white border border-gray-200" 
                    : "bg-gray-800 border border-gray-700"
                }`}>
                  <h2 className={`text-xl font-medium mb-6 ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                  }`}>
                    Your Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#FADADD]"
                            : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#FADADD]"
                            : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#FADADD]"
                          : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                      }`}
                    />
                  </div>
                  
                  <h2 className={`text-xl font-medium mb-6 ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                  }`}>
                    Appointment Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="date" className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#FADADD]"
                            : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Time
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#FADADD]"
                            : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                        }`}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="notes" className={`block text-sm font-medium mb-1 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Special Requests or Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#FADADD]"
                          : "border-gray-600 bg-gray-700 focus:ring-gray-500"
                      }`}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || bookingItems.length === 0}
                    className={`w-full py-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "light"
                        ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                  {errorMessage && (
                    <p className={`mt-2 ${
                      theme === "light" ? "text-red-500" : "text-red-400"
                    }`}>
                      {errorMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;