import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import BookingSidebar from "../components/BookingSidebar";

// Sample salon services data for testing
const sampleServices = [
  {
    _id: "service1",
    name: "Haircut & Styling",
    price: 45,
    duration: 60,
    description: "Professional haircut and styling service"
  },
  {
    _id: "service2",
    name: "Manicure",
    price: 30,
    duration: 45,
    description: "Classic manicure with polish"
  },
  {
    _id: "service3",
    name: "Facial Treatment",
    price: 65,
    duration: 75,
    description: "Rejuvenating facial treatment"
  },
  {
    _id: "service4",
    name: "Hair Coloring",
    price: 85,
    duration: 120,
    description: "Full hair coloring service"
  }
];

const TestBookingPage = () => {
  const [isBookingSidebarOpen, setIsBookingSidebarOpen] = useState(false);
  const { addToBooking, bookingCount } = useContext(BookingContext);

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
        <Link to="/">
          <h1 className="text-xl font-bold">VivaHub</h1>
        </Link>
        
        {/* Booking button with counter */}
        <button 
          onClick={() => setIsBookingSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg hover:bg-[#f0c8cc] transition duration-300"
        >
          <span>My Booking</span>
          {bookingCount > 0 && (
            <span className="bg-white text-[#4A4A4A] text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {bookingCount}
            </span>
          )}
        </button>
      </header>

      {/* Test Content */}
      <div className="py-10 px-5 bg-white flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium text-[#4A4A4A] mb-6">
            Test Booking System
          </h1>
          <p className="text-lg text-[#4A4A4A]/80 mb-8">
            This is a test page to try out the booking functionality. Click on "Add to booking" for any service below to add it to your booking sidebar.
          </p>

          {/* Services Section */}
          <section className="py-6 px-5 bg-[#F8F8F8] rounded-lg">
            <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Sample Services</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {sampleServices.map((service) => (
                <li
                  key={service._id}
                  className="bg-white rounded-lg shadow-sm p-5 border border-[#E0E0E0] hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-1">
                    {service.description}
                  </p>
                  <p className="text-sm text-[#4A4A4A]/80 mb-1">
                    <strong>Price:</strong> ${service.price}
                  </p>
                  <p className="text-sm text-[#4A4A4A]/80 mb-4">
                    <strong>Duration:</strong> {service.duration} minutes
                  </p>
                  <button
                    onClick={() => {
                      addToBooking(service);
                      setIsBookingSidebarOpen(true);
                    }}
                    className="w-full py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300"
                  >
                    Add to booking
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Booking Sidebar */}
      <BookingSidebar 
        isOpen={isBookingSidebarOpen} 
        onClose={() => setIsBookingSidebarOpen(false)} 
      />
    </div>
  );
};

export default TestBookingPage;
