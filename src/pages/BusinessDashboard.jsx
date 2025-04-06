import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
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
      return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${open} - ${close}`;
    });
  };

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services/languages`);
        const options = response.data.map((lang) => ({
          value: lang.code,
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
      languageSpoken: selectedOptions.map(option => option.value),
    });
  };

  // Handle language selection for editing service
  const handleEditLanguageChange = (selectedOptions) => {
    setEditedService({
      ...editedService,
      languageSpoken: selectedOptions.map(option => option.value),
    });
  };

  // Get current language selections for a service
  const getCurrentLanguages = (languageCodes) => {
    return languageOptions.filter(option => 
      languageCodes?.includes(option.value)
    );
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes, salonRes] = await Promise.all([
          axios.get(`${API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/services/user`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/salons/user`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }).catch(() => ({ data: {} })),
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

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/services`, 
        newService,
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
      languageSpoken: service.languageSpoken || [] 
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/services/update/${editingServiceId}`,
        editedService,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setServices(services.map(service =>
        service._id === editingServiceId ? response.data : service
      ));

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
    toast.custom((t) => (
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
    ), { duration: 60000 });
  };

  const performDeleteService = async (serviceId) => {
    try {
      await axios.delete(`${API_URL}/api/services/delete/${serviceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setServices(services.filter(service => service._id !== serviceId));
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

      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-light text-[#4A4A4A]">
              Business Dashboard
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/salons/update/${salon._id}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] transition-colors"
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Salon</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-[#4A4A4A] mb-4">
              Business Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="text-lg text-[#4A4A4A]">{salon?.name || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <FaPhone className="mr-2" /> Phone
                  </p>
                  <p className="text-lg text-[#4A4A4A]">{salon?.phone || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-[#4A4A4A]">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address
                  </p>
                  <p className="text-lg text-[#4A4A4A]">{salon?.location || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <FaClock className="mr-2" /> Opening Hours
                  </p>
                  <div className="text-lg text-[#4A4A4A]">
                    {salon?.openingHours ? (
                      <ul className="space-y-1">
                        {formatOpeningHours(salon.openingHours).map((hours, index) => (
                          <li key={index}>{hours}</li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#4A4A4A]">Bookings</h2>
              <div className="text-sm text-gray-500">
                {bookings.length} total bookings
              </div>
            </div>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No bookings found. Bookings will appear here once customers make reservations.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Customer", "Service", "Date", "Time", "Status", "Actions"].map((header) => (
                        <th 
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id || booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-[#4A4A4A]">
                            {booking.customerName}
                          </div>
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
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {booking.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleBookingStatus(booking.id, "confirmed")
                                }
                                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleBookingStatus(booking.id, "cancelled")
                                }
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-[#4A4A4A] mb-6">
                Add New Service
              </h2>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={newService.price}
                        onChange={(e) =>
                          setNewService({ ...newService, price: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-4 bg-[#A2B9C6] text-white px-6 py-3 rounded-lg hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] transition-colors"
                >
                  Add Service
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#4A4A4A]">
                  Your Services
                </h2>
                <div className="text-sm text-gray-500">
                  {services.length} services
                </div>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No services added yet. Add your first service using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div 
                      key={service._id} 
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                              placeholder="Duration (mins)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Languages Spoken
                            </label>
                            <Select
                              isMulti
                              options={languageOptions}
                              value={getCurrentLanguages(editedService.languageSpoken)}
                              onChange={handleEditLanguageChange}
                              className="mt-1"
                              classNamePrefix="select"
                              placeholder="Select languages..."
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleSaveClick}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <FaCheck className="inline mr-2" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                              <FaTimes className="inline mr-2" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg text-[#4A4A4A]">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {service.description}
                            </p>
                            <div className="flex space-x-4 mt-2">
                              <span className="text-sm text-gray-500">
                                ${service.price}
                              </span>
                              <span className="text-sm text-gray-500">
                                {service.duration} mins
                              </span>
                            </div>
                            {service.languageSpoken?.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Languages:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {service.languageSpoken.map((langCode, index) => {
                                    const lang = languageOptions.find(
                                      (option) => option.value === langCode
                                    );
                                    return lang ? (
                                      <span 
                                        key={index} 
                                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                                      >
                                        {lang.label.props.children[1]}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(service)}
                              className="p-2 text-[#A2B9C6] hover:text-[#8fa9b8] transition-colors"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
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