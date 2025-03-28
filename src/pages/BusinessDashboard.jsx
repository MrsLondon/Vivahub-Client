import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Select from "react-select";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessDashboard = () => {
  const { user } = useAuth();
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

  // Fetch languages from the API
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

  const handleLanguageChange = (selectedOptions) => {
    setNewService({
      ...newService,
      languageSpoken: selectedOptions.map((option) => option.value), // only store the language code
    });
  };

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

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      setError("Failed to update booking status");
      console.error("Error updating booking:", err);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </>
    );

  if (error) return (
    <>
      <Navbar />
      <div className="text-red-600 p-4">{error}</div>
    </>
  );

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default BusinessDashboard;
