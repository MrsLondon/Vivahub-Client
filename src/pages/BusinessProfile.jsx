import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessProfile = () => {
  const { id } = useParams(); // Get salon ID from the URL
  const navigate = useNavigate();
  const [salon, setSalon] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    description: "",
    openingHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    closedDays: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch salon data
  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/salons/${id}`);
        setSalon(response.data);
      } catch (err) {
        console.error("Error fetching salon:", err);
        setError("Failed to load salon data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalon({ ...salon, [name]: value });
  };

  // Handle nested fields (e.g., openingHours)
  const handleNestedChange = (day, field, value) => {
    setSalon({
      ...salon,
      openingHours: {
        ...salon.openingHours,
        [day]: { ...salon.openingHours[day], [field]: value },
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adjust the format of openingHours to match the backend
    const formattedOpeningHours = Object.keys(salon.openingHours).reduce(
      (acc, day) => {
        const { open, close } = salon.openingHours[day];

        // Garantir que os valores sejam convertidos para null ou "HH:mm"
        acc[day] = {
          open: open && open !== "Closed" ? open : null,
          close: close && close !== "Closed" ? close : null,
        };

        return acc;
      },
      {}
    );

    const sanitizedData = {
      ...salon,
      openingHours: formattedOpeningHours, // Substituir pelo formato correto
    };

    console.log("Data being sent:", sanitizedData); // Verificar os dados no console

    try {
      await axios.put(`${API_URL}/api/salons/update/${id}`, sanitizedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Salon updated successfully!");
      navigate("/business-dashboard"); // Redirecionar após sucesso
    } catch (err) {
      console.error("Error updating salon:", err);
      toast.error("Failed to update salon.");
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
    <div className="font-body leading-relaxed min-h-screen bg-white dark:bg-gray-900 text-[#4A4A4A] dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-[#4A4A4A] dark:text-gray-200 mb-8">
          Edit Business Profile
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column: General Information */}
          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                value={salon.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={salon.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={salon.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={salon.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Description
              </label>
              <textarea
                name="description"
                value={salon.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Closed Days */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200">
                Closed Days
              </label>
              <input
                type="text"
                name="closedDays"
                value={salon.closedDays.join(", ")}
                onChange={(e) =>
                  setSalon({
                    ...salon,
                    closedDays: e.target.value
                      .split(",")
                      .map((day) => day.trim()),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 2025-12-25, 2025-01-01"
              />
            </div>
          </div>

          {/* Right Column: Opening Hours */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#4A4A4A] dark:text-gray-200">
              Opening Hours
            </h2>
            {Object.keys(salon.openingHours).map((day) => (
              <div
                key={day}
                className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              >
                <p className="text-sm capitalize text-[#4A4A4A] dark:text-gray-200 w-1/4">
                  {day}
                </p>
                <div className="flex items-center gap-2 w-3/4">
                  <input
                    type="time"
                    value={salon.openingHours[day].open || ""} // Fallback to empty string if null
                    onChange={(e) =>
                      handleNestedChange(day, "open", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-[#A2B9C6] focus:ring-[#A2B9C6]"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="time"
                    value={salon.openingHours[day].close || ""} // Fallback to empty string if null
                    onChange={(e) =>
                      handleNestedChange(day, "close", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-[#A2B9C6] focus:ring-[#A2B9C6]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#A2B9C6] text-white rounded-lg text-sm hover:bg-[#FADADD] hover:text-[#4A4A4A] transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;
