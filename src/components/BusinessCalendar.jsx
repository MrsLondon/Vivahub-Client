import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";

const localizer = momentLocalizer(moment);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessCalendar = ({ salonId }) => {
  const [events, setEvents] = useState([]);

  // Function to convert booking data to calendar event format
  const convertToCalendarEvent = (booking) => {
    try {
      const appointmentDate = new Date(booking.appointmentDate); // já é uma data ISO
      const [hour, minute] = booking.appointmentTime.split(":").map(Number);

      // Define a hora e os minutos corretamente
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
        title: `${booking.serviceId.name} - ${booking.customerId.firstName}`,
        start,
        end,
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

        // Transform bookings into calendar events
        const bookings = response.data.map(convertToCalendarEvent);

        // Transform bookings into calendar events
        // const bookings = response.data.map((booking) => ({
        //   title: `${booking.serviceId.name} - ${booking.customerId.firstName}`,
        //   start: new Date(
        //     `${booking.appointmentDate}T${booking.appointmentTime}`
        //   ),
        //   end: new Date(
        //     new Date(
        //       `${booking.appointmentDate}T${booking.appointmentTime}`
        //     ).getTime() +
        //       booking.serviceId.duration * 60000 // Add service duration in minutes
        //   ),
        // }));

        setEvents(bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Failed to load calendar events.");
      }
    };

    fetchBookings();
  }, [salonId]);

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView="week"
        views={["month", "week", "day"]}
        popup
        eventPropGetter={(event) => ({
          style: { backgroundColor: "#A2B9C6", color: "white" },
        })}
        onSelectEvent={(event) => toast.success(`Event: ${event.title}`)}
      />
    </div>
  );
};

export default BusinessCalendar;
