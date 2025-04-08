import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BusinessProfile = () => {
  const { id } = useParams();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalon({ ...salon, [name]: value });
  };

  const handleNestedChange = (day, field, value) => {
    setSalon({
      ...salon,
      openingHours: {
        ...salon.openingHours,
        [day]: { ...salon.openingHours[day], [field]: value },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedOpeningHours = Object.keys(salon.openingHours).reduce(
      (acc, day) => {
        const { open, close } = salon.openingHours[day];
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
      openingHours: formattedOpeningHours,
    };

    try {
      await axios.put(`${API_URL}/api/salons/update/${id}`, sanitizedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Salon updated successfully!");
      navigate("/business-dashboard");
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
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <h1 className="text-3xl font-bold text-center text-[#4A4A4A] dark:text-gray-200 mb-10">
          Edit Business Profile
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
        >
          {/* Left Column */}
          {/* Left Column (General Info Section) */}
<div className="lg:col-span-5">
  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
    <h2 className="text-lg font-semibold text-[#4A4A4A] dark:text-gray-200 mb-2">
      General Information
    </h2>

    {[
      { label: "Business Name", name: "name", type: "text" },
      { label: "Location", name: "location", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Phone", name: "phone", type: "text" },
    ].map((field) => (
      <div key={field.name}>
        <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200 mb-1">
          {field.label}
        </label>
        <input
          type={field.type}
          name={field.name}
          value={salon[field.name]}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-2 text-black"
          required
        />
      </div>
    ))}

    {/* Description */}
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200 mb-1">
        Description
      </label>
      <textarea
        name="description"
        value={salon.description}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-2 text-black"
        rows="3"
      />
    </div>

    {/* Closed Days */}
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] dark:text-gray-200 mb-1">
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
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-2"
        placeholder="e.g., 2025-12-25, 2025-01-01"
      />
    </div>
  </div>
</div>


          {/* Right Column */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-lg font-semibold text-[#4A4A4A] dark:text-gray-200">
              Opening Hours
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sameHours"
                className="h-4 w-4 text-[#A2B9C6] border-gray-300 rounded focus:ring-[#A2B9C6]"
                onChange={(e) => {
                  if (e.target.checked) {
                    const firstDayHours = salon.openingHours.monday;
                    setSalon((prev) => ({
                      ...prev,
                      openingHours: Object.keys(prev.openingHours).reduce(
                        (acc, day) => {
                          acc[day] = { ...firstDayHours };
                          return acc;
                        },
                        {}
                      ),
                    }));
                  }
                }}
              />
              <label
                htmlFor="sameHours"
                className="text-sm font-medium text-[#4A4A4A] dark:text-gray-200"
              >
                Same hours for all days
              </label>
            </div>

            {Object.keys(salon.openingHours).map((day) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800"
              >
                <label className="w-24 capitalize font-medium text-[#4A4A4A] dark:text-gray-200">
                  {day}:
                </label>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <select
                    value={salon.openingHours[day].open || ""}
                    onChange={(e) =>
                      handleNestedChange(day, "open", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-sm text-[#4A4A4A] dark:text-black focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] appearance-none"
                  >
                    <option value="">Closed</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = String(i).padStart(2, "0");
                      return (
                        <option key={`open-${day}-${i}`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    value={salon.openingHours[day].close || ""}
                    onChange={(e) =>
                      handleNestedChange(day, "close", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-sm text-[#4A4A4A] dark:black focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] appearance-none"
                    disabled={!salon.openingHours[day].open}
                  >
                    <option value="">Closed</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = String(i).padStart(2, "0");
                      return (
                        <option key={`close-${day}-${i}`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="lg:col-span-12 flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-[#A2B9C6] text-white rounded-lg text-sm hover:bg-[#FADADD] hover:text-[#4A4A4A] transition duration-300"
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
