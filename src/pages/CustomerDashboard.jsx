import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const handleRescheduleBooking = async () => {
    console.log("Selected Booking:", selectedBooking);
    if (!newDate || !newTime) {
      toast.warning("Please select a new date and time");
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/bookings/reschedule/${selectedBooking._id}`,
        { appointmentDate: newDate, appointmentTime: newTime },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Updated Booking:", response.data.booking);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBooking._id ? response.data.booking : booking
        )
      );

      toast.success("Booking rescheduled successfully");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error("Failed to reschedule booking");
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setNewDate("");
    setNewTime("");
  };

  const closeRescheduleModal = () => {
    setSelectedBooking(null);
  };

  const openCancelConfirmation = (bookingId) => {
    setBookingToCancel(bookingId);
  };

  const closeCancelConfirmation = () => {
    setBookingToCancel(null);
  };

  const handleCancelBooking = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/canceledBookings/cancel/${bookingToCancel}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingToCancel)
      );

      toast.success("Booking canceled successfully");
      setBookingToCancel(null);
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios
          .get(`${API_URL}/api/bookings`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .catch((err) => {
            if (err.response?.status === 404) {
              return { data: [] };
            }
            throw err;
          });

        setBookings(response.data);
      } catch (err) {
        if (!err.response || err.response.status !== 404) {
          setError("Failed to fetch bookings");
          console.error("Error fetching bookings:", err);
          toast.error("Failed to fetch bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="text-red-600 p-4">{error}</div>
      </>
    );

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {/* Reschedule Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Reschedule Booking</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRescheduleBooking}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            <p className="mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeCancelConfirmation}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome, {user.firstName}!
            </h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Your Profile
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Your Bookings
              </h2>
              {bookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    You haven't made any bookings yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manage your bookings
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id || booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.salonId
                              ? booking.salonId.name
                              : "No salon assigned"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.serviceId
                              ? booking.serviceId.name
                              : "No service assigned"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.appointmentDate &&
                            !isNaN(new Date(booking.appointmentDate))
                              ? new Date(
                                  booking.appointmentDate
                                ).toLocaleDateString()
                              : "No date"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.appointmentTime
                              ? new Date(
                                  `1970-01-01T${booking.appointmentTime}`
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "No time"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {booking.bookingStatus === "Pending" ? (
                              <div className="flex justify-center items-center space-x-4">
                                <button
                                  onClick={() => openRescheduleModal(booking)}
                                  className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => openCancelConfirmation(booking._id)}
                                  className="px-4 py-2 bg-[#A2B9C6] text-white rounded-lg text-sm hover:bg-[#FADADD] hover:text-[#4A4A4A] transition duration-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                {booking.bookingStatus === "Service Completed"
                                  ? "Service Completed"
                                  : "Service Canceled"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;