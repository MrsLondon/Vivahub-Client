import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewForm from "../components/ReviewForm";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleRescheduleBooking = async () => {
    console.log("Selected Booking:", selectedBooking);
    if (!newDate || !newTime) {
      toast.warning("Please select a new date and time");
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/bookings/${selectedBooking._id}/reschedule`,
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

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
    // Refresh bookings to update UI
    fetchBookings();
  };

  const openReviewForm = (booking) => {
    setSelectedBookingForReview(booking);
    setShowReviewForm(true);
  };

  // Function to fetch bookings - wrapped in useCallback to prevent unnecessary re-renders
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/api/users/${user.id}`,
        editProfileData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      toast.success("Profile updated successfully");

      // Update user in context
      setUser(response.data.user);

      setShowEditProfileModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div
        className={`min-h-screen font-body transition-colors duration-300 ${
          theme === "light"
            ? "bg-white text-[#4A4A4A]"
            : "bg-gray-900 text-gray-200"
        }`}
      >
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2B9C6]"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen font-body transition-colors duration-300 ${
          theme === "light"
            ? "bg-white text-[#4A4A4A]"
            : "bg-gray-900 text-gray-200"
        }`}
      >
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="text-red-600 p-4">{error}</div>
      </div>
    );

  return (
    <div
      className={`min-h-screen font-body transition-colors duration-300 ${
        theme === "light"
          ? "bg-white text-[#4A4A4A]"
          : "bg-gray-900 text-gray-200"
      }`}
    >
      <Header theme={theme} toggleTheme={toggleTheme} />

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
        theme={theme === "light" ? "light" : "dark"}
      />

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Edit Profile
            </h2>
            <form onSubmit={handleEditProfile}>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={editProfileData.firstName}
                  onChange={(e) =>
                    setEditProfileData({
                      ...editProfileData,
                      firstName: e.target.value,
                    })
                  }
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  value={editProfileData.lastName}
                  onChange={(e) =>
                    setEditProfileData({
                      ...editProfileData,
                      lastName: e.target.value,
                    })
                  }
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={editProfileData.email}
                  onChange={(e) =>
                    setEditProfileData({
                      ...editProfileData,
                      email: e.target.value,
                    })
                  }
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Reschedule Booking
            </h2>
            <form>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  New Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRescheduleBooking}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                  }`}
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
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Confirm Cancellation
            </h2>
            <p
              className={`mb-6 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeCancelConfirmation}
                className={`px-4 py-2 rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                }`}
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                className={`px-4 py-2 rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div
              className={`p-4 border-b ${
                theme === "light" ? "border-gray-200" : "border-gray-700"
              } flex justify-between items-center`}
            >
              <h2
                className={`text-lg font-semibold ${
                  theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                }`}
              >
                Leave a Review
              </h2>
              <button
                onClick={() => setShowReviewForm(false)}
                className={
                  theme === "light"
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-400 hover:text-gray-200"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  <span className="font-medium">Salon:</span>{" "}
                  {selectedBookingForReview.salonId?.name || "Unknown Salon"}
                </p>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  <span className="font-medium">Service:</span>{" "}
                  {selectedBookingForReview.serviceId?.name ||
                    "Unknown Service"}
                </p>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(
                    selectedBookingForReview.appointmentDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <ReviewForm
                bookingId={selectedBookingForReview._id}
                salonId={selectedBookingForReview.salonId?._id}
                serviceId={selectedBookingForReview.serviceId?._id}
                onReviewSubmitted={handleReviewSubmitted}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`rounded-lg shadow-sm ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div className="p-6">
            <h1
              className={`text-3xl font-bold mb-6 ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Welcome, {user.firstName}!
            </h1>

            <div
              className={`p-4 rounded-lg mb-8 ${
                theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-semibold ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                  }`}
                >
                  Your Profile
                </h2>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                  }`}
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    Email
                  </p>
                  <p
                    className={
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }
                  >
                    {user.email}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    Member Since
                  </p>
                  <p
                    className={
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                }`}
              >
                Your Bookings
              </h2>
              {bookings.length === 0 ? (
                <div
                  className={`text-center py-8 rounded-lg ${
                    theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-700"
                  }`}
                >
                  <p
                    className={
                      theme === "light" ? "text-gray-500" : "text-gray-300"
                    }
                  >
                    You haven't made any bookings yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead
                      className={
                        theme === "light" ? "bg-gray-50" : "bg-gray-700"
                      }
                    >
                      <tr>
                        {["Business", "Service", "Date", "Time", "Actions"].map(
                          (header) => (
                            <th
                              key={header}
                              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                theme === "light"
                                  ? "text-gray-500"
                                  : "text-gray-300"
                              }`}
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "light"
                          ? "divide-gray-200 bg-white"
                          : "divide-gray-700 bg-gray-800"
                      }`}
                    >
                      {bookings.map((booking) => (
                        <tr key={booking.id || booking._id}>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-200"
                            }`}
                          >
                            {booking.salonId
                              ? booking.salonId.name
                              : "No salon assigned"}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-200"
                            }`}
                          >
                            {booking.serviceId
                              ? booking.serviceId.name
                              : "No service assigned"}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-200"
                            }`}
                          >
                            {booking.appointmentDate &&
                            !isNaN(new Date(booking.appointmentDate))
                              ? new Date(
                                  booking.appointmentDate
                                ).toLocaleDateString()
                              : "No date"}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-200"
                            }`}
                          >
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
                                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    theme === "light"
                                      ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                                      : "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                                  }`}
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() =>
                                    openCancelConfirmation(booking._id)
                                  }
                                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    theme === "light"
                                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : booking.bookingStatus ===
                              "Service Completed" ? (
                              <div className="flex flex-col space-y-2 items-center">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    theme === "light"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-green-800 text-green-200"
                                  }`}
                                >
                                  Service Completed
                                </span>
                                <button
                                  onClick={() => openReviewForm(booking)}
                                  className={`px-4 py-1 rounded-lg text-xs transition duration-300 ${
                                    theme === "light"
                                      ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                                      : "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                                  }`}
                                >
                                  Leave Review
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  theme === "light"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-gray-600 text-gray-200"
                                }`}
                              >
                                Service Canceled
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
    </div>
  );
};

export default CustomerDashboard;
