import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const localizer = momentLocalizer(moment);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessCalendar = ({ salonId, onSelectEvent }) => {
  const [events, setEvents] = useState([]);

  const convertToCalendarEvent = (booking) => {
    try {
      const appointmentDate = new Date(booking.appointmentDate);
      const [hour, minute] = booking.appointmentTime.split(":").map(Number);

      const start = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
        hour,
        minute,
        0
      );

      const end = new Date(
        start.getTime() + booking.serviceId.duration * 60000
      );

      return {
        id: booking._id || booking.id,
        title: `${booking.serviceId.name}`,
        start,
        end,
        customerName: booking.customerId.firstName,
        notes: booking.notes,
      };
    } catch (error) {
      console.error("Erro ao converter evento:", booking, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("API BOOKINGS RESPONSE", response.data);

        const bookings = response.data.map(convertToCalendarEvent);
        setEvents(bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Failed to load calendar events.");
      }
    };

    fetchBookings();
  }, [salonId]);

  const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Navegation between periods */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="p-2 rounded-full bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc] transition"
          >
            <FaChevronLeft />
          </button>
          <h1 className="text-xl font-bold text-[#4A4A4A]">{label}</h1>
          <button
            onClick={() => onNavigate("NEXT")}
            className="p-2 rounded-full bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc] transition"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Buttons to switch between views */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => onView("day")}
            className={`px-4 py-2 rounded-lg transition ${
              view === "day"
                ? "bg-[#FADADD] text-[#4A4A4A]"
                : "bg-gray-200 text-gray-600"
            } hover:bg-[#f0c8cc]`}
          >
            Day
          </button>
          <button
            onClick={() => onView("week")}
            className={`px-4 py-2 rounded-lg transition ${
              view === "week"
                ? "bg-[#FADADD] text-[#4A4A4A]"
                : "bg-gray-200 text-gray-600"
            } hover:bg-[#f0c8cc]`}
          >
            Week
          </button>
          <button
            onClick={() => onView("month")}
            className={`px-4 py-2 rounded-lg transition ${
              view === "month"
                ? "bg-[#FADADD] text-[#4A4A4A]"
                : "bg-gray-200 text-gray-600"
            } hover:bg-[#f0c8cc]`}
          >
            Month
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView="month"
        views={["month", "week", "day"]}
        popup
        className="bg-[#F8F8F8] text-[#4A4A4A] rounded-lg shadow-md"
        components={{
          toolbar: CustomToolbar,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#FADADD",
            color: "#4A4A4A",
            borderRadius: "5px",
            border: "none",
            padding: "5px",
          },
        })}
        onSelectEvent={onSelectEvent} 
      />
    </div>
  );
};

export default BusinessCalendar;
