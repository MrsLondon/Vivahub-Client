import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * BusinessDashboard component for salon owners to:
 * 1. View and manage bookings
 * 2. Update booking statuses (confirm/cancel)
 * 3. View business analytics
 * 4. Manage services and availability
 */
const BusinessDashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  // State management
  const [salon, setSalon] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [languages, setLanguages] = useState([]); // State to store languages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    languageSpoken: [],
  });

  /**
   * Fetch languages from the API
   */
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services/languages`);
        setLanguages(
          response.data.map((lang) => ({
            value: lang.code,
            label: (
              <div className="flex items-center">
                <img
                  src={`https://flagcdn.com/w40/${lang.country}.png`} // URL to flag image
                  alt={lang.name}
                  className="w-5 h-5 mr-2"
                />
                {lang.name}
              </div>
            ),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      }
    };

    fetchLanguages();
  }, []);

  /**
   * Handle language change event
   * @param {object} selectedOptions - Selected language options
   */
  const handleLanguageChange = (selectedOptions) => {
    setNewService({
      ...newService,
      languageSpoken: selectedOptions.map((option) => option.value), // only store the language code
    });
  };

  /**
   * Fetch bookings, services, and salon data when component mounts
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes, salonRes] = await Promise.all([
          axios
            .get(`${API_URL}/api/bookings`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch((err) => {
              if (err.response?.status === 404) {
                return { data: [] }; // Return empty array if no bookings found
              }
              throw err;
            }),
          axios
            .get(`${API_URL}/api/services/user`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch((err) => {
              if (err.response?.status === 404) {
                return { data: [] }; // Return empty array if no services found
              }
              throw err;
            }),
          axios
            .get(`${API_URL}/api/salons/user`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch((err) => {
              if (err.response?.status === 404) {
                return { data: [] }; // Return empty array if no salon found
              }
              throw err;
            }),
        ]);

        // update the state with the fetched data
        setBookings(bookingsRes.data);
        setServices(servicesRes.data);
        setSalon(salonRes.data); // store salon data
      } catch (err) {
        if (!err.response || err.response.status !== 404) {
          setError("Failed to fetch dashboard data");
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /**
   * Handle service submission
   * @param {object} e - Event object
   */
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/services`,
        { ...newService, businessId: user.id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setServices([...services, response.data]);
      setNewService({
        name: "",
        description: "",
        price: "",
        duration: "",
        languageSpoken: [],
      });
    } catch (err) {
      setError("Failed to create service");
      console.error("Error creating service:", err);
    }
  };

  /**
   * Handle booking status updates
   * @param {string} bookingId - ID of the booking to update
   * @param {string} status - New status ('confirmed' or 'cancelled')
   */
  const handleBookingStatus = async (bookingId, status) => {
    try {
      // Update booking status in the backend
      await axios.put(
        `${API_URL}/api/business/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      // Show success notification
      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-light text-[#4A4A4A] mb-6">
              Business Dashboard
            </h1>

            {/* Business Profile Section */}
            <div className="bg-[#F8F8F8] p-4 rounded-lg mb-6 border border-[#E0E0E0]">
              <h2 className="text-lg font-medium text-[#4A4A4A] mb-2">
                Business Profile
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#4A4A4A]/80">Business Name</p>
                  <p className="text-[#4A4A4A]">{salon?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4A4A]/80">Email</p>
                  <p className="text-[#4A4A4A]">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => navigate(`/salons/update/${salon._id}`)}
                  className="flex items-center justify-center w-10 h-10 bg-[#A2B9C6] text-white rounded-full hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  //onClick={handleDeleteSalon}
                  className="flex items-center justify-center w-10 h-10 bg-[#FF6B6B] text-white rounded-full hover:bg-[#e55a5a] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="bg-[#F8F8F8] p-4 rounded-lg mb-6 border border-[#E0E0E0]">
              <h2 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Bookings
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id || booking.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.serviceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.status === "pending" && (
                            <div className="space-x-2">
                              <button
                                onClick={() =>
                                  handleBookingStatus(booking.id, "confirmed")
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleBookingStatus(booking.id, "cancelled")
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Service Section */}
            <div className="bg-[#F8F8F8] p-4 rounded-lg mb-6 border border-[#E0E0E0]">
              <h2 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Add New Service
              </h2>
              <form
                onSubmit={handleServiceSubmit}
                className="bg-[#F8F8F8] p-4 rounded-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A]">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-[#E0E0E0] shadow-sm focus:border-[#A2B9C6] focus:ring-[#A2B9C6] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A]">
                      Price
                    </label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({ ...newService, price: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-[#E0E0E0] shadow-sm focus:border-[#A2B9C6] focus:ring-[#A2B9C6] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A]">
                      Duration (minutes)
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
                      className="mt-1 block w-full rounded-md border-[#E0E0E0] shadow-sm focus:border-[#A2B9C6] focus:ring-[#A2B9C6] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A]">
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
                      className="mt-1 block w-full rounded-md border-[#E0E0E0] shadow-sm focus:border-[#A2B9C6] focus:ring-[#A2B9C6] sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A]">
                    Languages Spoken
                  </label>
                  <Select
                    isMulti
                    options={languages}
                    onChange={handleLanguageChange}
                    className="mt-1"
                    placeholder="Select languages..."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-[#A2B9C6] text-white px-4 py-2 rounded-md hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                >
                  Add Service
                </button>
              </form>
            </div>

            {/* Services Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Your Services
              </h2>

              {services.length === 0 ? (
                <div className="text-center py-8 bg-[#F8F8F8] rounded-lg border border-[#E0E0E0]">
                  <p className="text-[#4A4A4A]/80">
                    No services added yet. Add your first service using the form
                    above.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E0E0E0]">
                    <thead className="bg-[#F8F8F8]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A]/80 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A]/80 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A]/80 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A]/80 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E0E0E0]">
                      {services.map((service) => (
                        <tr key={service._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                            {service.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                            ${service.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                            {service.duration} mins
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

export default BusinessDashboard;
