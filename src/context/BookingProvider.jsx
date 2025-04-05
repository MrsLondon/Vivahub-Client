import React, { useState, useEffect } from "react";
import { BookingContext } from "./BookingContext";

const BookingProvider = ({ children }) => {
  const [bookingItems, setBookingItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const clearBooking = () => {
    setBookingItems([]);
  };
  
  const updateTotals = (currentBooking) => {
    const updatedBookingCount = currentBooking.length;
  
    const updatedTotalPrice = currentBooking.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    
    const updatedTotalDuration = currentBooking.reduce((sum, item) => {
      return sum + item.duration;
    }, 0);
  
    setTotalPrice(updatedTotalPrice);
    setTotalDuration(updatedTotalDuration);
    setBookingCount(updatedBookingCount);
  };
  
  useEffect(() => {
    updateTotals(bookingItems);
  }, [bookingItems]);

  const addToBooking = (service) => {
    setBookingItems((prevBooking) => {
      const updatedBooking = [...prevBooking];
      const existingItemIndex = updatedBooking.findIndex((item) => item._id === service._id);

      if (existingItemIndex >= 0) {
        // Service already exists in booking, don't add it again
        return updatedBooking;
      } else {
        // Add the new service to booking
        updatedBooking.push({ ...service });
      }

      return updatedBooking;
    });
  };

  const removeFromBooking = (serviceId) => {
    setBookingItems((prevBooking) => {
      const updatedBooking = prevBooking.filter((item) => item._id !== serviceId);
      return updatedBooking;
    });
  };

  return (
    <BookingContext.Provider value={{ 
      bookingItems, 
      totalPrice, 
      totalDuration, 
      bookingCount, 
      addToBooking, 
      removeFromBooking, 
      clearBooking 
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
