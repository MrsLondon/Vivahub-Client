import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CustomerDashboard = () => {
  const { user } = useAuth();
  //console.log("User object:", user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Update the bookings state to remove the canceled booking
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );

      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
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
              return { data: [] }; // Return empty array if no bookings found
            }
            throw err;
          });

        setBookings(response.data);
      } catch (err) {
        if (!err.response || err.response.status !== 404) {
          setError("Failed to fetch bookings");
          console.error("Error fetching bookings:", err);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome, {user.firstName}!
            </h1>

            {/* User Profile Section */}
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

            {/* Bookings Section */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manage your bookings
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id || booking._id || index}>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                booking.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : booking.paymentStatus === "unpaid"
                                  ? "bg-red-100 text-red-800" // Alterado para vermelho
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.paymentStatus || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center items-center space-x-4">
                              <button
                                onClick={() =>
                                  handleRescheduleBooking(booking._id)
                                }
                                className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-4 py-2 bg-[#A2B9C6] text-white rounded-lg text-sm hover:bg-[#FADADD] hover:text-[#4A4A4A] transition duration-300"
                              >
                                Cancel
                              </button>
                            </div>
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
