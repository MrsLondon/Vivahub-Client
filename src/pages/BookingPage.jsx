import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/auth.context";
import { createBooking } from "../services/api";

const BookingPage = () => {
  const { bookingItems, removeFromBooking, totalPrice, totalDuration, clearBooking } = useContext(BookingContext);
  const { user, isAuthenticated } = useContext(AuthContext);
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
    for (let hour = 9; hour < 17; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${hourFormatted}:00 ${amPm}`);
      slots.push(`${hourFormatted}:30 ${amPm}`);
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
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="VivaHub Logo" className="h-10"/>
        </Link>
        <Link to="/test-booking" className="text-[#4A4A4A] hover:underline">
          Back to Services
        </Link>
      </header>

      <div className="py-10 px-5 bg-white flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium text-[#4A4A4A] mb-6">
            Complete Your Booking
          </h1>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-medium text-green-700 mb-4">Booking Confirmed!</h2>
              <p className="text-green-600 mb-6">Your booking has been successfully submitted.</p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  navigate("/test-booking");
                }}
                className="px-6 py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300"
              >
                Book More Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#F8F8F8] rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-medium text-[#4A4A4A] mb-4">Booking Summary</h2>
                  
                  {bookingItems.length === 0 ? (
                    <p className="text-gray-500 mb-4">Your booking is empty.</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-200 mb-4">
                        {bookingItems.map((item) => (
                          <li key={item._id} className="py-4 flex justify-between">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.duration} minutes</p>
                            </div>
                            <div className="flex items-start">
                              <span className="font-medium mr-3">${item.price.toFixed(2)}</span>
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
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between mb-2">
                          <span>Total Duration:</span>
                          <span>{totalDuration} minutes</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
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
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Your Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                    />
                  </div>
                  
                  <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Appointment Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Special Requests or Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || bookingItems.length === 0}
                    className="w-full py-3 bg-[#FADADD] text-[#4A4A4A] rounded-md hover:bg-[#f0c8cc] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                  {errorMessage && (
                    <p className="text-red-500 mt-2">{errorMessage}</p>
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
