import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/Header";
import CalendarModal from "../components/CalendarModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // State management
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [salon, setSalon] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    languageSpoken: [],
  });

  // Format opening hours for display
  const formatOpeningHours = (hours) => {
    return Object.entries(hours).map(([day, { open, close }]) => {
      if (!open && !close) {
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`;
      }
      return `${
        day.charAt(0).toUpperCase() + day.slice(1)
      }: ${open} - ${close}`;
    });
  };

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services/languages`);
        const options = response.data.map((lang) => ({
          key: `${lang.code}-${lang.country}`,
          value: `${lang.code}-${lang.country}`,
          label: (
            <div className="flex items-center">
              <img
                src={`https://flagcdn.com/w40/${lang.country}.png`}
                alt={lang.name}
                className="w-5 h-5 mr-2"
              />
              {lang.name}
            </div>
          ),
        }));
        setLanguageOptions(options);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
        toast.error("Failed to load language options");
      }
    };

    fetchLanguages();
  }, []);

  // Handle language selection for new service
  const handleLanguageChange = (selectedOptions) => {
    setNewService({
      ...newService,
      languageSpoken: selectedOptions.map((option) => option.value),
    });
  };

  // Handle language selection for editing service
  const handleEditLanguageChange = (selectedOptions) => {
    setEditedService({
      ...editedService,
      languageSpoken: selectedOptions.map((option) => option.value),
    });
  };

  // Get current language selections for a service
  const getCurrentLanguages = (languageCodes) => {
    return languageOptions.filter((option) =>
      languageCodes?.includes(option.value)
    );
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes, salonRes] = await Promise.all([
          axios
            .get(`${API_URL}/api/bookings`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_URL}/api/services/user`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_URL}/api/salons/user`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch(() => ({ data: {} })),
        ]);

        setBookings(bookingsRes.data);
        setServices(servicesRes.data);
        setSalon(salonRes.data);
      } catch (err) {
        if (!err.response || err.response.status !== 404) {
          setError("Failed to fetch dashboard data");
          console.error("Error fetching data:", err);
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteSalon = async (salonId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this salon? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/api/salons/delete/${salonId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("Salon deleted successfully!");
        logout(); // Logout user after deletion
        navigate("/"); // Redirect user to the homepage
      } catch (err) {
        console.error("Error deleting salon:", err);
        toast.error("Failed to delete salon. Please try again.");
      }
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/services`, newService, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setServices([...services, response.data]);
      setNewService({
        name: "",
        description: "",
        price: "",
        duration: "",
        languageSpoken: [],
      });
      toast.success("Service created successfully!");
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Failed to create service");
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setEditedService({
      ...service,
      languageSpoken: service.languageSpoken || [],
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/services/update/${editingServiceId}`,
        editedService,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setServices(
        services.map((service) =>
          service._id === editingServiceId ? response.data : service
        )
      );

      toast.success("Service updated successfully!");
      setEditingServiceId(null);
      setEditedService({});
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error("Failed to update service");
    }
  };

  const handleCancelClick = () => {
    setEditingServiceId(null);
    setEditedService({});
  };

  const handleDeleteService = async (serviceId) => {
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-4">Are you sure you want to delete this service?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDeleteService(serviceId);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 60000 }
    );
  };

  // Open cancel confirmation modal
  const openCancelConfirmation = (bookingId) => {
    console.log("openCancelConfirmation called with booking ID:", bookingId);
    setBookingToCancel(bookingId);
  };

  // Close cancel confirmation modal
  const closeCancelConfirmation = () => {
    setBookingToCancel(null);
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    console.log("Booking to cancel:", bookingToCancel);

    try {
      await axios.delete(`${API_URL}/api/bookings/${bookingToCancel}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setBookings(
        bookings.filter((booking) => booking._id !== bookingToCancel)
      );
      toast.success("Booking canceled successfully!");
      closeCancelConfirmation();
    } catch (err) {
      console.error("Error canceling booking:", err);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const performDeleteService = async (serviceId) => {
    try {
      await axios.delete(`${API_URL}/api/services/delete/${serviceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setServices(services.filter((service) => service._id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/business/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    }
  };

  return (
    <div
      className={`font-sans leading-relaxed min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-gray-50 text-[#4A4A4A]"
          : "bg-gray-900 text-gray-200"
      }`}
    >
      {/* Header Component */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Modal de confirmação para cancelar booking */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1
              className={`text-3xl font-light ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Business Dashboard
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/salons/update/${salon._id}`)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                    : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                }`}
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Salon</span>
              </button>
              <button
                onClick={() => handleDeleteSalon(salon._id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-red-600 text-black hover:bg-red-700"
                }`}
              >
                <FaTrash className="w-4 h-4" />
                <span>Delete Salon</span>
              </button>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-sm border ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}
            >
              Business Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Business Name
                  </p>
                  <p
                    className={`text-lg ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {salon?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium flex items-center ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <FaPhone className="mr-2" /> Phone
                  </p>
                  <p
                    className={`text-lg ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {salon?.phone || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Email
                  </p>
                  <p
                    className={`text-lg ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium flex items-center ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <FaMapMarkerAlt className="mr-2" /> Address
                  </p>
                  <p
                    className={`text-lg ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {salon?.location || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium flex items-center ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <FaClock className="mr-2" /> Opening Hours
                  </p>
                  <div
                    className={`text-lg ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {salon?.openingHours ? (
                      <ul className="space-y-1">
                        {formatOpeningHours(salon.openingHours).map(
                          (hours, index) => (
                            <li key={index}>{hours}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div
            className={`p-6 rounded-xl shadow-sm border ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold ${
                  theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                }`}
              >
                Bookings
              </h2>
              <button
                onClick={() => setShowCalendar(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
              >
                <FaCalendarAlt className="w-5 h-5" />
                <span>View Calendar</span>
              </button>
              <div
                className={`text-sm ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {bookings.length} total bookings
              </div>
              {/* Calendar Modal */}
              <CalendarModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                salonId={salon._id}
              />
            </div>

            {bookings.length === 0 ? (
              <div
                className={`text-center py-12 rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 text-gray-500"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <p>
                  No bookings found. Bookings will appear here once customers
                  make reservations.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}
                  >
                    <tr>
                      {[
                        "Customer",
                        "Email",
                        "Service",
                        "Date",
                        "Time",
                        "Manage Bookings",
                      ].map((header) => (
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
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      theme === "light"
                        ? "divide-gray-200 bg-white"
                        : "divide-gray-700 bg-gray-800"
                    }`}
                  >
                    {bookings.map((booking) => {
                      const customerName = booking.customerId
                        ? `${booking.customerId.firstName} ${booking.customerId.lastName}`
                        : "Unknown Customer";
                      const customerEmail = booking.customerId?.email || "N/A";
                      const serviceName =
                        booking.serviceId?.name || "Unknown Service";
                      const appointmentDate = booking.appointmentDate
                        ? new Date(booking.appointmentDate).toLocaleDateString()
                        : "Invalid Date";
                      const appointmentTime =
                        booking.appointmentTime || "Invalid Time";

                      return (
                        <tr
                          key={booking._id || booking.id}
                          className={
                            theme === "light"
                              ? "hover:bg-gray-50"
                              : "hover:bg-gray-700"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`font-medium ${
                                theme === "light"
                                  ? "text-[#4A4A4A]"
                                  : "text-gray-200"
                              }`}
                            >
                              {customerName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`font-medium ${
                                theme === "light"
                                  ? "text-[#4A4A4A]"
                                  : "text-gray-200"
                              }`}
                            >
                              {customerEmail}
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              theme === "light"
                                ? "text-[#4A4A4A]"
                                : "text-gray-200"
                            }`}
                          >
                            {serviceName}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              theme === "light"
                                ? "text-[#4A4A4A]"
                                : "text-gray-200"
                            }`}
                          >
                            {appointmentDate}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              theme === "light"
                                ? "text-[#4A4A4A]"
                                : "text-gray-200"
                            }`}
                          >
                            {appointmentTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {booking.bookingStatus === "Pending" ? (
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
                            ) : (
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  theme === "light"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-gray-600 text-gray-200"
                                }`}
                              >
                                {booking.bookingStatus === "Service Completed"
                                  ? "Service Completed"
                                  : "Service Canceled"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Service Form */}
            <div
              className={`p-6 rounded-xl shadow-sm border ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                }`}
              >
                Add New Service
              </h2>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                          : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                      }`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={newService.price}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            price: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                            : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Duration (mins)
                      </label>
                      <input
                        type="number"
                        value={newService.duration}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            duration: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                            : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={newService.description}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                          : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Languages Spoken
                    </label>
                    <Select
                      isMulti
                      options={languageOptions}
                      value={getCurrentLanguages(newService.languageSpoken)}
                      onChange={handleLanguageChange}
                      className="mt-1"
                      classNamePrefix="select"
                      placeholder="Select languages..."
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor:
                            theme === "light" ? "white" : "#374151",
                          borderColor:
                            theme === "light" ? "#d1d5db" : "#4b5563",
                          "&:hover": {
                            borderColor:
                              theme === "light" ? "#a2b9c6" : "#fadadd",
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === "light" ? "white" : "#374151",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? theme === "light"
                              ? "#f3f4f6"
                              : "#4b5563"
                            : theme === "light"
                            ? "white"
                            : "#374151",
                          color: theme === "light" ? "#4a4a4a" : "#f3f4f6",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === "light" ? "#4a4a4a" : "#f3f4f6",
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: theme === "light" ? "#4a4a4a" : "#f3f4f6",
                        }),
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full mt-4 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    theme === "light"
                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8] focus:ring-[#A2B9C6]"
                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc] focus:ring-[#FADADD]"
                  }`}
                >
                  Add Service
                </button>
              </form>
            </div>

            {/* Your Services List */}
            <div
              className={`p-6 rounded-xl shadow-sm border ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-semibold ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                  }`}
                >
                  Your Services
                </h2>
                <div
                  className={`text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {services.length} services
                </div>
              </div>

              {services.length === 0 ? (
                <div
                  className={`text-center py-12 rounded-lg ${
                    theme === "light"
                      ? "bg-gray-50 text-gray-500"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <p>
                    No services added yet. Add your first service using the
                    form.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className={`p-4 border rounded-lg transition-shadow ${
                        theme === "light"
                          ? "border-gray-200 hover:shadow-sm"
                          : "border-gray-700 hover:shadow-md"
                      }`}
                    >
                      {editingServiceId === service._id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editedService.name || ""}
                            onChange={(e) =>
                              setEditedService({
                                ...editedService,
                                name: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                              theme === "light"
                                ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                                : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                            }`}
                            placeholder="Service Name"
                          />
                          <textarea
                            value={editedService.description || ""}
                            onChange={(e) =>
                              setEditedService({
                                ...editedService,
                                description: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                              theme === "light"
                                ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                                : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                            }`}
                            placeholder="Description"
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="number"
                              value={editedService.price || ""}
                              onChange={(e) =>
                                setEditedService({
                                  ...editedService,
                                  price: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                                theme === "light"
                                  ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                                  : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                              }`}
                              placeholder="Price"
                            />
                            <input
                              type="number"
                              value={editedService.duration || ""}
                              onChange={(e) =>
                                setEditedService({
                                  ...editedService,
                                  duration: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                                theme === "light"
                                  ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                                  : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                              }`}
                              placeholder="Duration (mins)"
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }`}
                            >
                              Languages Spoken
                            </label>
                            <Select
                              isMulti
                              options={languageOptions}
                              value={getCurrentLanguages(
                                editedService.languageSpoken
                              )}
                              onChange={handleEditLanguageChange}
                              className="mt-1"
                              classNamePrefix="select"
                              placeholder="Select languages..."
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  backgroundColor:
                                    theme === "light" ? "white" : "#374151",
                                  borderColor:
                                    theme === "light" ? "#d1d5db" : "#4b5563",
                                  "&:hover": {
                                    borderColor:
                                      theme === "light" ? "#a2b9c6" : "#fadadd",
                                  },
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  backgroundColor:
                                    theme === "light" ? "white" : "#374151",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? theme === "light"
                                      ? "#f3f4f6"
                                      : "#4b5563"
                                    : theme === "light"
                                    ? "white"
                                    : "#374151",
                                  color:
                                    theme === "light" ? "#4a4a4a" : "#f3f4f6",
                                }),
                                singleValue: (provided) => ({
                                  ...provided,
                                  color:
                                    theme === "light" ? "#4a4a4a" : "#f3f4f6",
                                }),
                                input: (provided) => ({
                                  ...provided,
                                  color:
                                    theme === "light" ? "#4a4a4a" : "#f3f4f6",
                                }),
                              }}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleSaveClick}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                theme === "light"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              <FaCheck className="inline mr-2" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                theme === "light"
                                  ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                  : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                              }`}
                            >
                              <FaTimes className="inline mr-2" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`font-medium text-lg ${
                                theme === "light"
                                  ? "text-[#4A4A4A]"
                                  : "text-gray-200"
                              }`}
                            >
                              {service.name}
                            </h3>
                            <p
                              className={`mt-1 ${
                                theme === "light"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                            >
                              {service.description}
                            </p>
                            <div className="flex space-x-4 mt-2">
                              <span
                                className={`text-sm ${
                                  theme === "light"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                ${service.price}
                              </span>
                              <span
                                className={`text-sm ${
                                  theme === "light"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {service.duration} mins
                              </span>
                            </div>
                            {service.languageSpoken?.length > 0 && (
                              <div className="mt-2">
                                <p
                                  className={`text-sm ${
                                    theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  Languages:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {service.languageSpoken.map(
                                    (langCode, index) => {
                                      const lang = languageOptions.find(
                                        (option) => option.value === langCode
                                      );
                                      return lang ? (
                                        <span
                                          key={index}
                                          className={`text-xs px-2 py-1 rounded ${
                                            theme === "light"
                                              ? "bg-gray-100 text-gray-800"
                                              : "bg-gray-700 text-gray-200"
                                          }`}
                                        >
                                          {lang.label.props.children[1]}
                                        </span>
                                      ) : null;
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(service)}
                              className={`p-2 transition-colors ${
                                theme === "light"
                                  ? "text-[#A2B9C6] hover:text-[#8fa9b8]"
                                  : "text-[#FADADD] hover:text-[#f0c8cc]"
                              }`}
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className={`p-2 transition-colors ${
                                theme === "light"
                                  ? "text-red-500 hover:text-red-600"
                                  : "text-red-400 hover:text-red-300"
                              }`}
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
